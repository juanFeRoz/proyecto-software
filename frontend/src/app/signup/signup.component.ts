import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  name: string = '';
  username: string = '';
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}


  onSignup() {
    const userData = {
      name: this.name,
      username: this.username,
      email: this.email,
      password: this.password,
    }
    
    this.http.post('http://localhost:8080/api/auth/signup', userData, { responseType: 'text' })
      .subscribe({
        next: response => {
          alert('Registro exitoso');
          console.log(response);
        },
        error: error => {
          alert('Error al registrar');
          console.error(error);
        }
      });
  }
}
