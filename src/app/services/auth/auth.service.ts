import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { LoginResponse, RegisterResponse } from '../../models/responses.model';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly LOGIN_URL =
    'https://authservicebackend.onrender.com/auth/login';
  private readonly REGISTER_URL =
    'https://authservicebackend.onrender.com/auth/register';
  private authenticatedSubject = new BehaviorSubject<boolean>(
    this.isLoggedIn()
  );

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  login(name: string, password: string): Observable<void> {
    return this.http
      .post<LoginResponse>(this.LOGIN_URL, { name, password })
      .pipe(
        switchMap(response => {
          if (response.jwt) {
            localStorage.setItem('token', response.jwt);
            const loginTime = new Date().toISOString();
            localStorage.setItem('loginTime', loginTime);
            this.authenticatedSubject.next(true);
          }
          return this.userService.getUser(name).pipe();
        })
      );
  }

  register(name: string, email: string, password: string): Observable<void> {
    return this.http
      .post<RegisterResponse>(this.REGISTER_URL, { name, email, password })
      .pipe(
        map(response => {
          if (response.message === 'Email already register!') {
            throw new Error(response.message);
          }
        })
      );
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('loginTime');
      this.authenticatedSubject.next(false);
      this.router.navigate(['/auth/login']);
    }
  }

  isAuthenticated(): Observable<boolean> {
    return this.authenticatedSubject.asObservable();
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  isLoggedIn(): boolean {
    if (typeof window !== 'undefined') {
      return this.getToken() !== null;
    }
    return false;
  }
}
