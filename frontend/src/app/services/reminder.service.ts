import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReminderSettings } from '../reminder/remindersettings';
import { baseUrl, BASE_REMINDER_PATH } from './baseUrl';

@Injectable({
  providedIn: 'root',
})
export class ReminderService {
  constructor(private http: HttpClient) {}

  postAddReminder(reminderSettings: ReminderSettings): Observable<any> {
    return this.http.post(baseUrl + BASE_REMINDER_PATH + 'reminder', {
      reminderSettings,
    });
  }

  postGetAllReminders(): Observable<any> {
    return this.http.get(baseUrl + BASE_REMINDER_PATH + 'all');
  }

  postDeleteOneReminder(_id: string): Observable<any> {
    return this.http.delete(
      baseUrl + BASE_REMINDER_PATH + 'reminder?id=' + _id
    );
  }

  postDeleteAllReminders(title: string): Observable<any> {
    return this.http.delete(
      baseUrl + BASE_REMINDER_PATH + 'all?title=' + title
    );
  }
}
