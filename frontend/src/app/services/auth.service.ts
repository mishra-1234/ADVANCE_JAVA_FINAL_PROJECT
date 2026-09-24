import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/AD-PROJECT';

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<any> {
    const formData = new URLSearchParams();
    formData.set('email', request.email);
    formData.set('password', request.password);

    return this.http.post(this.apiUrl + '/login', formData.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      responseType: 'text',
      withCredentials: true
    });
  }

  register(request: RegisterRequest): Observable<any> {
    const formData = new URLSearchParams();
    formData.set('fullName', request.fullName);
    formData.set('employeeId', request.employeeId);
    formData.set('email', request.email);
    formData.set('department', request.department);
    formData.set('password', request.password);

    return this.http.post(this.apiUrl + '/register', formData.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      responseType: 'text',
      withCredentials: true
    });
  }

  saveUser(user: User): void {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
  }

  getUser(): User | null {
    const data = sessionStorage.getItem('currentUser');
    return data ? JSON.parse(data) : null;
  }

  isLoggedIn(): boolean {
    return sessionStorage.getItem('currentUser') !== null;
  }

  logout(): void {
    sessionStorage.removeItem('currentUser');
  }
}
