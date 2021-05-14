import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReminderComponent } from './reminder.component';
import { CompleteReminderComponent } from './complete-reminder.component';
import { NavbarModule } from '../navbar/navbar.module';
import { FormsModule } from '@angular/forms';
import { FeaturesModule } from '../features/features.module';

@NgModule({
  declarations: [ReminderComponent, CompleteReminderComponent],
  imports: [
    CommonModule,
    NavbarModule,
    FormsModule,
    FeaturesModule
  ],
  exports: [
    ReminderComponent,
    CompleteReminderComponent
  ]
})
export class ReminderModule { }
