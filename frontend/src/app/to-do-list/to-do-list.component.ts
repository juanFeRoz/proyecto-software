import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GoogleAuthService } from '../google-auth.service';

@Component({
  selector: 'app-to-do-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.css']
})
export class ToDoListComponent {
  newTask: string = '';
  taskDate: string = '';
  tasks: Array<{ name: string; date: string; completed: boolean; eventId?: string }> = [];
  signedIn: boolean = false;

  constructor(private googleAuth: GoogleAuthService) {}

  async login() {
    try {
      await this.googleAuth.signIn();
      this.signedIn = true;
      alert('Sesión iniciada con éxito');
    } catch (err) {
      console.error(err);
    }
  }

  async addTask() {
    if (!this.newTask || !this.taskDate) return;

    let eventId: string | undefined;

    if (this.googleAuth.isSignedIn()) {
      const start = new Date(this.taskDate).toISOString();
      const end = new Date(new Date(this.taskDate).getTime() + 30 * 60000).toISOString(); // +30 minutos
      eventId = await this.googleAuth.createEvent(this.newTask, start, end);
    }

    this.tasks.push({
      name: this.newTask,
      date: this.taskDate,
      completed: false,
      eventId
    });

    this.newTask = '';
    this.taskDate = '';
  }

  toggleTask(index: number) {
    this.tasks[index].completed = !this.tasks[index].completed;
  }

  async removeTask(index: number) {
    const task = this.tasks[index];

    if (task.eventId && this.googleAuth.isSignedIn()) {
      try {
        await this.googleAuth.deleteEvent(task.eventId);
      } catch (error) {
        console.error('Error eliminando evento en Google Calendar', error);
      }
    }

    this.tasks.splice(index, 1);
  }
}
