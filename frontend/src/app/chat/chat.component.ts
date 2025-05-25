import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
export class ChatComponent {
  canales: string[] = ['general', 'random', 'proyectos', 'soporte'];
  canalActual: string = this.canales[0];
  mensajesPorCanal: { [canal: string]: Mensaje[] } = {};
  nuevoMensaje: string = '';
  usuarioActual: string = 'Tú';
  nuevoCanal: string = '';

  // Nueva propiedad para guardar el índice del mensaje que está pidiendo confirmación para eliminar
  indiceConfirmacionEliminar: number | null = null;

  constructor() {
    // Inicializa mensajes por canal
    this.canales.forEach(canal => {
      this.mensajesPorCanal[canal] = [
        { usuario: 'System', texto: `Bienvenido al canal #${canal}`, hora: this.getHoraActual() }
      ];
    });
  }

  get mensajes(): Mensaje[] {
    return this.mensajesPorCanal[this.canalActual] || [];
  }

  seleccionarCanal(canal: string) {
    this.canalActual = canal;
    if (!this.mensajesPorCanal[canal]) {
      this.mensajesPorCanal[canal] = [
        { usuario: 'System', texto: `Bienvenido al canal #${canal}`, hora: this.getHoraActual() }
      ];
    }
  }

  enviarMensaje() {
    const texto = this.nuevoMensaje.trim();
    if (!texto) return;
    this.mensajesPorCanal[this.canalActual].push({
      usuario: this.usuarioActual,
      texto,
      hora: this.getHoraActual()
    });
    this.nuevoMensaje = '';
  }

  editarMensaje(mensaje: Mensaje) {
    mensaje.editando = true;
    mensaje.textoTemporal = mensaje.texto;
  }

  guardarEdicion(mensaje: Mensaje) {
    if (mensaje.textoTemporal?.trim()) {
      mensaje.texto = mensaje.textoTemporal.trim();
      mensaje.horaEdicion = this.getHoraActual(); 
    }
    mensaje.editando = false;
    mensaje.textoTemporal = '';
  }

  cancelarEdicion(mensaje: Mensaje) {
    mensaje.editando = false;
    mensaje.textoTemporal = '';
  }

  // Cambiamos este método para solo setear la confirmación
  pedirConfirmacionEliminar(index: number) {
    this.indiceConfirmacionEliminar = index;
  }

  // Método que elimina realmente el mensaje
  confirmarEliminar() {
    if (this.indiceConfirmacionEliminar !== null) {
      this.mensajesPorCanal[this.canalActual].splice(this.indiceConfirmacionEliminar, 1);
      this.indiceConfirmacionEliminar = null;
    }
  }

  cancelarEliminar() {
    this.indiceConfirmacionEliminar = null;
  }

  agregarCanal() {
    const canal = this.nuevoCanal.trim();
    if (canal && !this.canales.includes(canal)) {
      this.canales.push(canal);
      this.mensajesPorCanal[canal] = [
        { usuario: 'System', texto: `Bienvenido al canal #${canal}`, hora: this.getHoraActual() }
      ];
      this.seleccionarCanal(canal);
      this.nuevoCanal = '';
    }
  }

  private getHoraActual(): string {
    const ahora = new Date();
    return ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

