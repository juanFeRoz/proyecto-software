import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  logeado = false;

  constructor(private authService: AuthService, private router: Router) {
    // Escuchar cambios en el estado de autenticación
    this.authService.isLoggedIn$.subscribe(value => {
      this.logeado = value;
    });
  }

  logout() {
    this.authService.logout().subscribe(() => {
      // Redirige al home tras cerrar sesión
      this.router.navigate(['/home']);
    });
  }
}

