import {Component, OnInit, OnDestroy} from '@angular/core';
import {Client, IMessage, IStompSocket} from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {HttpClient} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {DatePipe, NgForOf, NgIf} from '@angular/common';

interface ChatRoom {
  id?: number;
  name: string;
  description?: string;
}

interface ChatMessage {
  sender: string;
  recipient?: string;
  content: string;
  timestamp: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  imports: [
    FormsModule,
    NgForOf,
    DatePipe,
    NgIf
  ],
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  private stompClient: Client = new Client();

  public myUsername: string = '';
  public onlineUsers: string[] = [];

  public messages: any[] = [];
  public privateMessages: ChatMessage[] = [];

  public messageContent = '';

  public availableRooms: ChatRoom[] = [];
  public currentRoom: string = '';
  public selectedUser: string | null = null;

  public newRoomName = '';
  public newRoomDescription = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadRooms();
    this.loadUsername();
  }

  loadUsername() {
    this.http.get('/api/auth/username', {responseType: 'text'}).subscribe({
      next: (username) => {
        this.myUsername = username;
        this.connect();
      },
      error: () => {
        this.myUsername = 'anonymous';
        this.connect();
      }
    });
  }

  loadRooms() {
    this.http.get<ChatRoom[]>('/api/rooms').subscribe({
      next: rooms => {
        this.availableRooms = rooms;
        if (rooms.length > 0) {
          this.selectRoom(rooms[0].name);
        }
      },
      error: err => console.error('Error cargando salas', err)
    });
  }

  connect() {
    this.stompClient.webSocketFactory = () =>
      new SockJS('/ws-chat') as unknown as IStompSocket;

    this.stompClient.onConnect = () => {
      if (this.currentRoom) {
        this.subscribeToRoom(this.currentRoom);
      }

      this.stompClient.subscribe('/topic/onlineUsers', (message: IMessage) => {
        this.onlineUsers = JSON.parse(message.body).filter((u: string) => u !== this.myUsername);
      });

      this.stompClient.subscribe('/user/queue/messages', (message: IMessage) => {
        const msg = JSON.parse(message.body) as ChatMessage;
        this.privateMessages.push(msg);
      });
    };

    this.stompClient.activate();
  }

  subscribeToRoom(room: string) {
    this.stompClient.subscribe(`/topic/room.${room}`, (message: IMessage) => {
      if (message.body) {
        this.messages.push(JSON.parse(message.body));
      }
    });
  }

  selectRoom(roomName: string) {
    this.disconnect();
    this.selectedUser = null;
    this.currentRoom = roomName;
    this.messages = [];
    this.connect();
  }

  selectUser(username: string) {
    this.disconnect();
    this.currentRoom = '';
    this.selectedUser = username;
    this.privateMessages = [];
    this.connect();
  }

  disconnect() {
    if (this.stompClient.active) {
      this.stompClient.deactivate();
    }
  }

  sendMessage() {
    if (this.messageContent.trim() === '') return;

    if (this.selectedUser) {
      const msg: ChatMessage = {
        sender: this.myUsername,
        recipient: this.selectedUser,
        content: this.messageContent,
        timestamp: new Date().toISOString()
      };
      this.stompClient.publish({
        destination: `/app/chat.private.${this.selectedUser}`,
        body: JSON.stringify(msg)
      });
      this.privateMessages.push(msg);
    } else if (this.currentRoom) {
      this.stompClient.publish({
        destination: `/app/chat.room.${this.currentRoom}`,
        body: JSON.stringify({ content: this.messageContent })
      });
    }

    this.messageContent = '';
  }

  createRoom() {
    if (this.newRoomName.trim() === '') {
      alert('El nombre de la sala es obligatorio');
      return;
    }
    const payload = {
      name: this.newRoomName,
      description: this.newRoomDescription
    };
    this.http.post<ChatRoom>('/api/rooms', payload).subscribe({
      next: room => {
        this.availableRooms.push(room);
        this.selectRoom(room.name);
        this.newRoomName = '';
        this.newRoomDescription = '';
      },
      error: err => {
        console.error('Error creando sala', err);
        alert('Error creando sala: ' + err.error || err.message);
      }
    });
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
