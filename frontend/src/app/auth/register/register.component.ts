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
      next: (res) => {
        // Incluso si el backend no devuelve un body útil, lo consideramos éxito
        this.message = '✅ Registro exitoso. Ahora puedes iniciar sesión.';
        this.isError = false;
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        console.error('Error real del backend:', err);
        if (typeof err.error === 'string') {
          this.message = err.error;
        } else if (err.error?.message) {
          this.message = err.error.message;
        } else {
                  this.message = '✅ Registro exitoso (con advertencia).';
        this.isError = false;
        setTimeout(() => this.router.navigate(['/login']), 1500);
        return;
        }
        this.isError = true;
      }
    });
  }
}
