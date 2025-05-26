import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class RegisterComponent {
  username = '';
  password = '';
  error = '';
  success = '';

  constructor(private auth: AuthService) {}

  register() {
    this.auth.register(this.username, this.password).subscribe({
      next: () => {
        this.error = '';
        this.success = 'Registration successful. You can now log in.';
      },
      error: err => {
        this.success = '';
        this.error = err.error || 'Registration failed';
      }
    });
  }
}
