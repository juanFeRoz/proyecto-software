import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private stompClient: Client;
  private connected = false;

  public publicMessages$ = new BehaviorSubject<any>(null);
  public privateMessages$ = new BehaviorSubject<any>(null);
  public roomMessages$ = new BehaviorSubject<any>(null);
  public errors$ = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      debug: (str) => console.log('[STOMP]', str),
      reconnectDelay: 5000,
      onConnect: () => this.onConnected(),
      onStompError: (frame) => {
        console.error('Broker error:', frame);
        this.errors$.next(frame.body);
      }
    });
  }

  private onConnected(): void {
    this.connected = true;

    this.stompClient.subscribe('/topic/public', (message: IMessage) => {
      this.publicMessages$.next(JSON.parse(message.body));
    });

    this.stompClient.subscribe('/user/queue/messages', (message: IMessage) => {
      this.privateMessages$.next(JSON.parse(message.body));
    });

    this.stompClient.subscribe('/user/queue/errors', (message: IMessage) => {
      this.errors$.next(message.body);
    });
  }

  connect(): void {
    this.stompClient.activate();
  }

  subscribeToRoom(roomName: string): void {
    if (!this.connected) return;
    this.stompClient.subscribe(`/topic/room.${roomName}`, (message: IMessage) => {
      this.roomMessages$.next(JSON.parse(message.body));
    });
  }

  sendPublicMessage(content: string): void {
    if (!this.connected) return;
    this.stompClient.publish({
      destination: '/app/chat.sendMessage',
      body: JSON.stringify({ content }),
    });
  }

  sendPrivateMessage(username: string, content: string): void {
    if (!this.connected) return;
    this.stompClient.publish({
      destination: `/app/chat.private.${username}`,
      body: JSON.stringify({ content }),
    });
  }

  sendRoomMessage(roomName: string, content: string): void {
    if (!this.connected) return;
    this.stompClient.publish({
      destination: `/app/chat.room.${roomName}`,
      body: JSON.stringify({ content }),
    });
  }

  // Historial desde backend
  getPublicChatHistory() {
    return this.http.get<any[]>('/api/messages/public');
  }

  getPrivateChatHistory(withUser: string) {
    return this.http.get<any[]>(`/api/messages/private/${withUser}`);
  }

  getRoomChatHistory(roomName: string) {
    return this.http.get<any[]>(`/api/messages/room/${roomName}`);
  }

  disconnect(): void {
    if (this.stompClient && this.connected) {
      this.stompClient.deactivate();
      this.connected = false;
    }
  }
}
