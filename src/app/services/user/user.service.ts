import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly USERS_URL =
    'https://authservicebackend.onrender.com/user/all';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  getUser(name: string): void {
    const headers = this.getAuthHeaders();
    this.http
      .get<User>(`https://authservicebackend.onrender.com/user/data/${name}`, {
        headers,
      })
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
    return this.http.delete<void>(
      `https://authservicebackend.onrender.com/user/${id}`,
      {
        headers,
      }
    );
  }

  blockUser(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.put<void>(
      `https://authservicebackend.onrender.com/user/block/${id}`,
      null,
      {
        headers,
      }
    );
  }

  unblockUser(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.put<void>(
      `https://authservicebackend.onrender.com/user/unblock/${id}`,
      null,
      { headers }
    );
  }

  deleteAllUsers(): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(
      'https://authservicebackend.onrender.com/user/all',
      {
        headers,
      }
    );
  }

  blockAllUsers(): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.put<void>(
      'https://authservicebackend.onrender.com/user/block/all',
      null,
      {
        headers,
      }
    );
  }

  unblockAllUsers(): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.put<void>(
      'https://authservicebackend.onrender.com/user/unblock/all',
      null,
      {
        headers,
      }
    );
  }
}
