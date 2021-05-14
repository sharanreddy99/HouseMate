import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SignupSettings } from '../login/signup/signupsettings';
import { Observable, Subject } from 'rxjs';
import { FPSettings } from '../login/forgotpassword/fpsettings';
import { baseUrl } from './baseUrl';
import { ProfileSettings } from '../profile/profilesettings';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  redirectURL: string = '';
  private isLoadingSubject = new Subject<string>();
  isLoading$ = this.isLoadingSubject.asObservable();
  
  updateLoading(value: string){
    this.isLoadingSubject.next(value);
  }
  
  constructor(private http: HttpClient) { }

  postSignupForm(signupSettings: SignupSettings): Observable<any>{
    return this.http.post(baseUrl+'signup',signupSettings);
  }

  postFPForm(fpSettings: FPSettings): Observable<any>{
    return this.http.patch(baseUrl+'forgotpassword',fpSettings)
  }

  generateOTP(email: string): Observable<any>{
    return this.http.post(baseUrl+'generateotp',{email})
  }

  validEmail(email: string): Observable<any>{
    return this.http.post(baseUrl+'verifyemail',{email});
  }

  getUserDetails(email: string, password: string): Observable<any>{
    return this.http.post(baseUrl+'fetchuser',{email,password});
  }

  updateUserDetails(olduser: ProfileSettings, newuser: ProfileSettings): Observable<any>{
    return this.http.patch(baseUrl+'updateuser',{olduser,newuser}) 
  }

  postIsValidUser(token: string):Observable<any> {
    return this.http.post(baseUrl+'isvaliduser',{token});
  }

  postLogout(email: string, password: string): Observable<any>{ 
    return this.http.post(baseUrl+'logout',{email,password});
  }

  postDeleteUser(email: string, password: string): Observable<any>{
    return this.http.post(baseUrl+'deleteuser',{email,password});
  }
}
