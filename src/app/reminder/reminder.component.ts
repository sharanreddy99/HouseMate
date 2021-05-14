import { Component, OnInit } from '@angular/core';
import { ReminderService } from '../services/reminder.service';
import { SubloadingService } from '../features/subloading.service';
declare var $: any;

@Component({
  selector: 'app-reminder',
  templateUrl: './reminder.component.html',
  styleUrls: ['./reminder.component.css']
})
export class ReminderComponent implements OnInit{

  reminders = []

  constructor(private reminderService: ReminderService,
    private subloadingService: SubloadingService) { }

  ngOnInit(): void {
    this.subloadingService.updateLoadingReminder('true');
    this.reminderService.postGetAllReminders(localStorage.getItem('email'),localStorage.getItem('password')).subscribe(
      result => {
        this.subloadingService.updateLoadingReminder('false');
        this.reminders = result
        for(let i=0;i<this.reminders.length;i++){
          this.reminders[i].id = i;
        }
      },
      err => {
        this.subloadingService.updateLoadingReminder('false');
      }
    );
  }
}
