import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReminderSettings } from '../reminder/remindersettings';
import { baseUrl } from './baseUrl';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {

  constructor(private http: HttpClient) { }

  postAddReminder(reminderSettings: ReminderSettings, email: string, password: string): Observable<any> {
    return this.http.post(baseUrl+'addreminder',{reminderSettings, email, password});
  }

  postGetAllReminders(email: string, password: string): Observable<any> {
    return this.http.post(baseUrl+'getallreminder',{email, password});
  }

  postDeleteOneReminder(_id: string, email: string, password: string): Observable<any>{
    return this.http.post(baseUrl+'deleteonereminder',{_id,email,password});
  }

  postDeleteAllReminders(title: string, email: string, password: string): Observable<any>{
    return this.http.post(baseUrl+'deleteallreminders',{title,email,password});
  }
}
