import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username = '';
  password = '';
  message = '';
  isError = false;

  constructor(private auth: AuthService, private router: Router) {}

  register() {
    this.auth.register(this.username, this.password).subscribe({
      next: () => {
        this.message = 'Registro exitoso. Ahora puedes iniciar sesión.';
        this.isError = false;
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: err => {
        this.message = err.error || 'Error al registrar';
        this.isError = true;
      }
    });
  }
}
