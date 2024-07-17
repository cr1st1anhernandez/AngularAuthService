import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly USERS_URL = 'http://localhost:8080/user/all';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getUser(name: string): void {
    const headers = this.getAuthHeaders();
    this.http
      .get<User>(`http://localhost:8080/user/data/${name}`, { headers })
      .pipe(
        tap(user => localStorage.setItem('currentUser', JSON.stringify(user)))
      )
      .subscribe();
  }

  getAllUsers(): Observable<User[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<User[]>(this.USERS_URL, { headers });
  }

  deleteUser(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`http://localhost:8080/user/${id}`, {
      headers,
    });
  }

  blockUser(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.put<void>(`http://localhost:8080/user/block/${id}`, null, {
      headers,
    });
  }

  unblockUser(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.put<void>(
      `http://localhost:8080/user/unblock/${id}`,
      null,
      { headers }
    );
  }

  deleteAllUsers(): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>('http://localhost:8080/user/all', {
      headers,
    });
  }

  blockAllUsers(): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.put<void>('http://localhost:8080/user/block/all', null, {
      headers,
    });
  }

  unblockAllUsers(): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.put<void>('http://localhost:8080/user/unblock/all', null, {
      headers,
    });
  }
}
