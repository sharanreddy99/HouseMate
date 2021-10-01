import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ReminderSettings } from './remindersettings';
import { ReminderService } from '../services/reminder.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
declare var $: any;

@Component({
  selector: 'app-complete-reminder',
  templateUrl: './complete-reminder.component.html',
  styleUrls: ['./reminder.component.css'],
})
export class CompleteReminderComponent implements OnInit {
  modalRef: BsModalRef;
  modalRef2: BsModalRef;
  todaydate: any = undefined;
  isLoading$: boolean = false;

  @ViewChild('template') template: TemplateRef<any>;
  @ViewChild('template2') template2: TemplateRef<any>;

  passedreminder = [];

  modalbody: string;

  counterdays = 0;
  countertime = 0;

  reminders = [];

  reminderSettings: ReminderSettings = {
    title: undefined,
    description: undefined,
    priority: 'low',
    daysgap: undefined,
    timegap: undefined,
    daysselected: [],
    timeselected: [],
  };

  isTitleValid: boolean = undefined;
  isDaysValid: boolean = undefined;
  isCustomDaysValid: boolean = undefined;
  isTimeValid: boolean = undefined;
  isCustomTimeValid: boolean = undefined;

  constructor(
    private reminderService: ReminderService,
    private modalService: BsModalService,
    private router: Router,
    private userService: UserService
  ) {}

  openModal() {
    this.modalRef = this.modalService.show(this.template);
  }

  ngOnInit(): void {
    this.todaydate = new Date();
    var dd: any = this.todaydate.getDate();

    var mm: any = this.todaydate.getMonth() + 1;
    var yyyy = this.todaydate.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }
    this.todaydate = yyyy + '-' + mm + '-' + dd;

    this.isLoading$ = true;
    this.reminderService.postGetAllReminders().subscribe(
      (result) => {
        this.isLoading$ = false;
        this.reminders = result.data;
        for (let i = 0; i < this.reminders.length; i++) {
          this.reminders[i].id = i;
        }
      },
      (err) => {
        this.isLoading$ = false;
        setTimeout(() => {
          this.modalRef.hide();
          this.router.navigate(['dashboard']);
        }, 2000);

        this.modalbody = err.error.error;
        this.openModal();
      }
    );

    $('.days-select').select2();
    $('.time-select').select2();

    $('.days-select').on('select2:unselecting', (e) => {
      let id = e.params.args.data.id;
      this.reminderSettings.daysselected =
        this.reminderSettings.daysselected.filter((obj) => obj.id != id);
    });

    $('.days-select').on('select2:selecting', (e) => {
      this.reminderSettings.daysselected.push(e.params.args.data);
    });

    $('.time-select').on('select2:unselecting', (e) => {
      let id = e.params.args.data.id;
      this.reminderSettings.timeselected =
        this.reminderSettings.timeselected.filter((obj) => obj.id != id);
    });

    $('.time-select').on('select2:selecting', (e) => {
      this.reminderSettings.timeselected.push(e.params.args.data);
    });
  }

  deleteAlert(reminder: any) {
    this.closeSecondModal();
    this.isLoading$ = true;
    this.reminderService.postDeleteAllReminders(reminder.title).subscribe(
      (result) => {
        this.isLoading$ = false;
        window.location.reload();
      },
      (error) => {
        this.isLoading$ = false;
        window.location.reload();
      }
    );
  }

  completeAlert(reminder: any) {
    this.isLoading$ = true;
    this.reminderService.postDeleteOneReminder(reminder._id).subscribe(
      (result) => {
        this.isLoading$ = false;
        window.location.reload();
      },
      (error) => {
        false;
        window.location.reload();
      }
    );
  }

  changePassedReminder(reminder: any) {
    this.passedreminder = reminder;
    this.openSecondModal();
  }

  addDate(date: string) {
    var today: any = new Date();
    var dd: any = today.getDate();

    var mm: any = today.getMonth() + 1;
    var yyyy = today.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }
    today = yyyy + '-' + mm + '-' + dd;

    // if(date<today){
    //   setTimeout(()=>{
    //     this.modalRef.hide();
    //   },3000);
    //   this.modalbody = "Please avoid choosing past dates."
    //   this.openModal();
    //   return;
    // }

    let flag: boolean = true;
    for (let i = 0; i < this.reminderSettings.daysselected.length; i++) {
      if (this.reminderSettings.daysselected[i].text == date) {
        flag = false;
        break;
      }
    }

    if (flag) {
      this.reminderSettings.daysselected.push({
        id: this.counterdays,
        text: date,
      });
      this.counterdays += 1;
    }
    $('.days-select')
      .empty()
      .select2({ data: this.reminderSettings.daysselected })
      .val(this.reminderSettings.daysselected.map((obj) => obj.id))
      .change();
  }

  addTime(time: string) {
    let flag: boolean = true;
    for (let i = 0; i < this.reminderSettings.timeselected.length; i++) {
      if (this.reminderSettings.timeselected[i].text == time) {
        flag = false;
        break;
      }
    }

    if (flag) {
      this.reminderSettings.timeselected.push({
        id: this.countertime,
        text: time,
      });
      this.countertime += 1;
    }
    $('.time-select')
      .empty()
      .select2({ data: this.reminderSettings.timeselected })
      .val(this.reminderSettings.timeselected.map((obj) => obj.id))
      .change();
  }

  onAddRemainder() {
    clearTimeout();

    if (this.reminderSettings.timegap == '')
      this.reminderSettings.timegap = undefined;

    this.isTitleValid =
      this.isTitleValid === undefined ? false : this.isTitleValid;
    this.isDaysValid =
      this.isDaysValid === undefined ? false : this.isDaysValid;
    this.isCustomDaysValid =
      this.isCustomDaysValid === undefined ? false : this.isCustomDaysValid;
    this.isTimeValid =
      this.isTimeValid === undefined ? false : this.isTimeValid;
    this.isCustomTimeValid =
      this.isCustomTimeValid === undefined ? false : this.isCustomTimeValid;

    if (this.reminderSettings.title && this.reminderSettings.title.length > 0)
      this.isTitleValid = true;
    else this.isTitleValid = false;

    if (
      (this.reminderSettings.daysgap >= 0 &&
        this.reminderSettings.daysselected.length == 0) ||
      (this.reminderSettings.daysgap == undefined &&
        this.reminderSettings.daysselected.length > 0)
    ) {
      this.isDaysValid = true;
      this.isCustomDaysValid = true;
    } else {
      this.isDaysValid = false;
      this.isCustomDaysValid = false;
    }

    if (
      (this.reminderSettings.timegap &&
        this.reminderSettings.timeselected.length == 0) ||
      (!this.reminderSettings.timegap &&
        this.reminderSettings.timeselected.length > 0)
    ) {
      this.isTimeValid = true;
      this.isCustomTimeValid = true;
    } else {
      this.isTimeValid = false;
      this.isCustomTimeValid = false;
    }

    if (
      this.isTitleValid &&
      this.isDaysValid &&
      this.isCustomDaysValid &&
      this.isTimeValid &&
      this.isCustomTimeValid
    ) {
      this.isLoading$ = true;
      this.reminderService.postAddReminder(this.reminderSettings).subscribe(
        (result) => {
          this.isLoading$ = false;
          setTimeout(() => {
            this.modalRef.hide();
            window.location.reload();
          }, 2000);

          this.modalbody = 'Added Reminder Successfully.';
          this.openModal();
        },
        (err) => {
          this.isLoading$ = false;
          setTimeout(() => {
            this.modalRef.hide();
            window.location.reload();
          }, 2000);

          this.modalbody = err.error.error;
          this.openModal();
        }
      );
    } else {
      setTimeout(() => {
        this.modalRef.hide();
      }, 3000);

      this.modalbody = 'Please correct the errors or fill the required fields.';
      this.openModal();
    }
  }

  openSecondModal() {
    this.modalRef2 = this.modalService.show(this.template2);
  }

  closeSecondModal() {
    this.modalRef2.hide();
  }
}
