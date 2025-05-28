import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class AuthService {
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
    });
  }

  logout() {
    return this.http.post('http://localhost:8080/api/auth/logout', {}, { withCredentials: true });
  }
}
