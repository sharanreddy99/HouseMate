import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { baseUrl, BASE_AUTH_PATH } from './baseUrl';
import { User } from './clientuser';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}

  login(signinSettings: any) {
    return this.http
      .post(baseUrl + BASE_AUTH_PATH + 'login', signinSettings)
      .pipe(
        map((res) => {
          let user: User = {
            email: signinSettings.email,
            password: signinSettings.password,
            token: res['data']['token'],
          };

          localStorage.setItem('access_token', user.token);
          let encUser = null;

          this.userService.postEncryptData(user).subscribe(
            (res) => {
              encUser = res.data;
              localStorage.setItem('currentUser', encUser);
              this.router.navigate(['/login']);
            },
            (err) => {
              localStorage.clear();
            }
          );

          return null;
        })
      );
  }

  logout() {
    //TODO need to implement more
    this.http.get(baseUrl + BASE_AUTH_PATH + 'logout').subscribe(
      (res) => {
        localStorage.removeItem('access_token');

        this.router.navigate(['']);
      },
      (err) => {
        localStorage.removeItem('access_token');
      }
    );
  }
}
