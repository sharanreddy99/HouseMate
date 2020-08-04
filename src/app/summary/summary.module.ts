import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompleteSummaryComponent } from './complete-summary.component';
import { NavbarModule } from '../navbar/navbar.module';
import { SummaryComponent } from './summary.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FeaturesModule } from '../features/features.module';



@NgModule({
  declarations: [SummaryComponent, CompleteSummaryComponent],
  imports: [
    CommonModule,
    NavbarModule,
    NgxChartsModule,
    FeaturesModule
  ],
  exports: [
    SummaryComponent,
    CompleteSummaryComponent
  ]
})
export class SummaryModule { }
