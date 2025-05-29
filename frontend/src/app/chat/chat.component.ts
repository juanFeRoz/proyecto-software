import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatService } from './chat.service';

interface Mensaje {
  usuario: string;
  texto: string;
  hora: string;
  editando?: boolean;
  textoTemporal?: string;
  horaEdicion?: string;
}

@Component({
  standalone: true,
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  imports: [CommonModule, FormsModule],
})
export class ChatComponent implements OnInit, OnDestroy {
  canales: string[] = ['general', 'random', 'proyectos', 'soporte'];
  canalActual: string = this.canales[0];
  mensajesPorCanal: { [canal: string]: Mensaje[] } = {};
  nuevoMensaje: string = '';
  usuarioActual: string = 'Tú';
  nuevoCanal: string = '';
  indiceConfirmacionEliminar: number | null = null;

  private canalSuscrito: string | null = null;
  private roomSub: Subscription | null = null;

  constructor(private chatService: ChatService) {
    this.canales.forEach(canal => {
      this.mensajesPorCanal[canal] = [
        { usuario: 'System', texto: `Bienvenido al canal #${canal}`, hora: this.getHoraActual() }
      ];
    });
  }

  ngOnInit(): void {
    this.chatService.connect();

    // suscribirse al canal inicial
    this.suscribirseACanal(this.canalActual);
  }

  ngOnDestroy(): void {
    this.roomSub?.unsubscribe();
    this.chatService.disconnect();
  }

  get mensajes(): Mensaje[] {
    return this.mensajesPorCanal[this.canalActual] || [];
  }

  seleccionarCanal(canal: string): void {
    this.canalActual = canal;

    if (!this.mensajesPorCanal[canal]) {
      this.mensajesPorCanal[canal] = [
        { usuario: 'System', texto: `Bienvenido al canal #${canal}`, hora: this.getHoraActual() }
      ];
    }

    this.suscribirseACanal(canal);
  }

  enviarMensaje(): void {
    const texto = this.nuevoMensaje.trim();
    if (!texto) return;

    this.chatService.sendRoomMessage(this.canalActual, texto);
    this.nuevoMensaje = '';
  }

  editarMensaje(mensaje: Mensaje): void {
    mensaje.editando = true;
    mensaje.textoTemporal = mensaje.texto;
  }

  guardarEdicion(mensaje: Mensaje): void {
    if (mensaje.textoTemporal?.trim()) {
      mensaje.texto = mensaje.textoTemporal.trim();
      mensaje.horaEdicion = this.getHoraActual();
    }
    mensaje.editando = false;
    mensaje.textoTemporal = '';
  }

  cancelarEdicion(mensaje: Mensaje): void {
    mensaje.editando = false;
    mensaje.textoTemporal = '';
  }

  pedirConfirmacionEliminar(index: number): void {
    this.indiceConfirmacionEliminar = index;
  }

  confirmarEliminar(): void {
    if (this.indiceConfirmacionEliminar !== null) {
      this.mensajesPorCanal[this.canalActual].splice(this.indiceConfirmacionEliminar, 1);
      this.indiceConfirmacionEliminar = null;
    }
  }

  cancelarEliminar(): void {
    this.indiceConfirmacionEliminar = null;
  }

  agregarCanal(): void {
    const nuevo = this.nuevoCanal.trim();
    if (nuevo && !this.canales.includes(nuevo)) {
      this.canales.push(nuevo);
      this.mensajesPorCanal[nuevo] = [
        { usuario: 'System', texto: `Bienvenido al canal #${nuevo}`, hora: this.getHoraActual() }
      ];
      this.seleccionarCanal(nuevo);
      this.nuevoCanal = '';
    }
  }

  private suscribirseACanal(canal: string): void {
    if (this.canalSuscrito === canal) return;

    this.roomSub?.unsubscribe();
    this.chatService.subscribeToRoom(canal);
    this.canalSuscrito = canal;

    this.roomSub = this.chatService.roomMessages$.subscribe(msg => {
      if (msg && canal === this.canalActual) {
        this.mensajesPorCanal[canal].push({
          usuario: msg.sender,
          texto: msg.content,
          hora: msg.timestamp
        });
      }
    });
  }

  private getHoraActual(): string {
    const ahora = new Date();
    return ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}
