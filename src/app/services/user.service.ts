import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../interface/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly API_URL = environment.API_URL;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getUsers(): Observable<{ message: string; users: User[] }> {
    return this.http
      .get<{ message: string; users: User[] }>(`${this.API_URL}/user`, {
        withCredentials: true,
      })
      .pipe(shareReplay());
  }

  getUser(id: string) {
    return this.http.get(`${this.API_URL}/user/${id}`, {
      withCredentials: true,
    });
  }

  blockUsers(ids: string[]) {
    return this.http.put(
      `${this.API_URL}/user/block`,
      { ids: ids },
      {
        withCredentials: true,
      }
    );
  }

  unblockUsers(ids: string[]) {
    return this.http.put(
      `${this.API_URL}/user/unblock`,
      { ids: ids },
      {
        withCredentials: true,
      }
    );
  }

  deleteUsers(ids: string[]) {
    return this.http.delete(`${this.API_URL}/user/delete`, {
      withCredentials: true,
      body: { ids: ids },
    });
  }
}
