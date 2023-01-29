import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly API_URL = environment.API_URL;

  isAuthenticated = false;

  authListener: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  errorListener: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);

  messageListener: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);

  private token: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  getAuthListener(): Observable<boolean> {
    return this.authListener.asObservable();
  }

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  getErrorListener(): Observable<string | null> {
    return this.errorListener.asObservable();
  }

  getMessageListener(): Observable<string | null> {
    return this.messageListener.asObservable();
  }

  login(form: { email: string; password: string }) {
    this.http
      .post<{ message: string; token: string }>(
        `${this.API_URL}/user/login`,
        form,
        {
          withCredentials: true,
        }
      )
      .subscribe(
        (res) => {
          if (res.token) {
            this.isAuthenticated = true;

            this.authListener.next(true);

            this.token = res.token;

            sessionStorage.clear();

            sessionStorage.setItem('token', res.token);

            let returnUrl =
              this.activatedRoute.snapshot.queryParamMap.get('returnUrl');

            this.router.navigate([returnUrl || '/']);
          }
        },
        (error) => {
          this.errorListener.next(error.error.message);
        }
      );
  }

  getProfile() {
    return this.http.get<{ message: string; user: any }>(
      `${this.API_URL}/user/${this.getDecodedToken()._id}}`,
      {
        withCredentials: true,
      }
    );
  }

  getToken(): string | null {
    const token = sessionStorage.getItem('token');
    return token;
  }

  getDecodedToken(): any {
    const token = sessionStorage.getItem('token');

    if (token) {
      let decodedToken = new JwtHelperService().decodeToken(token);
      return decodedToken;
    } else {
      return false;
    }
  }

  signup(form: { name: string; email: string; password: string }) {
    this.http
      .post<{ message: string; token: string }>(
        `${this.API_URL}/user/register`,
        form,
        {
          withCredentials: true,
        }
      )
      .subscribe(
        (res) => {
          if (res.token) {
            this.isAuthenticated = true;

            this.authListener.next(true);

            this.token = res.token;

            sessionStorage.clear();

            sessionStorage.setItem('token', res.token);

            let returnUrl =
              this.activatedRoute.snapshot.queryParamMap.get('returnUrl');

            this.router.navigate([returnUrl || '/']);
          } else {
            this.messageListener.next(res.message);
          }
        },
        (error) => {
          this.errorListener.next(error.error.message);
        }
      );
  }

  logout() {
    this.isAuthenticated = false;

    this.authListener.next(false);

    this.token = null;

    sessionStorage.removeItem('token');

    this.router.navigate(['/auth/login']);
  }
}
