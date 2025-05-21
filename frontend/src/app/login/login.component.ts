import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onLogin() {
    if (this.email === 'admin@progit.com' && this.password === '1234') {
      alert('¡Bienvenido!');
      this.router.navigate(['/home']);
    } else {
      alert('Credenciales incorrectas');
    }
  }
}
