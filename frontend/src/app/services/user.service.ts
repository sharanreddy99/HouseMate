import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignupSettings } from '../login/signup/signupsettings';
import { Observable, Subject } from 'rxjs';
import { FPSettings } from '../login/forgotpassword/fpsettings';
import { baseUrl, BASE_AUTH_PATH, BASE_EMAIL_PATH } from './baseUrl';
import { ProfileSettings } from '../profile/profilesettings';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  redirectURL: string = '';
  private isLoadingSubject = new Subject<string>();
  isLoading$ = this.isLoadingSubject.asObservable();

  updateLoading(value: string) {
    this.isLoadingSubject.next(value);
  }

  constructor(private http: HttpClient) {}

  postSignupForm(signupSettings: SignupSettings): Observable<any> {
    return this.http.post(baseUrl + BASE_AUTH_PATH + '/user', signupSettings);
  }

  postFPForm(fpSettings: FPSettings): Observable<any> {
    return this.http.patch(
      baseUrl + BASE_AUTH_PATH + 'forgotpassword',
      fpSettings
    );
  }

  generateOTP(email: string): Observable<any> {
    let data = {
      email: email,
      unqId: '8d5ed24c-8088-4414-9fcc-dd8556b84f21',
      placeholders: { otp: {} },
      subject: 'Generating OTP',
    };

    return this.http.post(baseUrl + BASE_EMAIL_PATH + 'send', data);
  }

  verifyOTP(email: string, otp: string): Observable<any> {
    let data = {
      email: email,
      otp: otp,
    };

    return this.http.post(baseUrl + BASE_EMAIL_PATH + 'verify', data);
  }

  validEmail(email: string): Observable<any> {
    return this.http.get(
      baseUrl + BASE_AUTH_PATH + 'verifyemail?email=' + email
    );
  }

  isNewEmail(email: string): Observable<any> {
    return this.http.get(baseUrl + BASE_AUTH_PATH + 'new/email?email=' + email);
  }

  getUserDetails(): Observable<any> {
    return this.http.get(baseUrl + BASE_AUTH_PATH + 'user');
  }

  updateUserDetails(newuser: ProfileSettings): Observable<any> {
    return this.http.patch(baseUrl + BASE_AUTH_PATH + 'user', newuser);
  }

  postLogout(email: string, password: string): Observable<any> {
    return this.http.get(baseUrl + BASE_AUTH_PATH + 'logout');
  }

  postDeleteUser(): Observable<any> {
    return this.http.delete(baseUrl + BASE_AUTH_PATH + 'user');
  }

  postEncryptData(data: any): Observable<any> {
    return this.http.post(baseUrl + BASE_AUTH_PATH + 'encrypt', { data: data });
  }

  postDecryptData(data: any): Observable<any> {
    return this.http.post(baseUrl + BASE_AUTH_PATH + 'decrypt', { data: data });
  }
}
