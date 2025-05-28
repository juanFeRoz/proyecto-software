import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isAuthenticated.asObservable();

  constructor(private http: HttpClient) {}

  register(username: string, password: string) {
    return this.http.post('http://localhost:8080/api/auth/register', { username, password }, { withCredentials: true });
  }

  login(username: string, password: string) {
    const body = new URLSearchParams();
    body.set('username', username);
    body.set('password', password);

    return this.http.post('http://localhost:8080/api/auth/login', body.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      withCredentials: true
    }).pipe(
      tap(() => this.isAuthenticated.next(true)) // Marca autenticado
    );
  }

  logout() {
    return this.http.post('http://localhost:8080/api/auth/logout', {}, { withCredentials: true }).pipe(
      tap(() => this.isAuthenticated.next(false)) // Marca NO autenticado
    );
  }

  // útil si quieres consultar desde otras partes si está logeado
  get isLoggedIn(): boolean {
    return this.isAuthenticated.value;
  }
}

