import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { LayoutModule } from '@angular/cdk/layout';
import { ItemsModule } from '../items/items.module';
import { ReminderModule } from '../reminder/reminder.module';
import { AboutModule } from '../about/about.module';
import { SummaryModule } from '../summary/summary.module';
import { NavbarModule } from '../navbar/navbar.module';
import { StockEstimatorModule } from '../stock-estimator/stock-estimator.module';
import { FeaturesModule } from '../features/features.module';



@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    LayoutModule,
    ItemsModule,
    ReminderModule,
    AboutModule,
    SummaryModule,
    NavbarModule,
    StockEstimatorModule,
    FeaturesModule
  ],
  exports: [DashboardComponent]
})
export class DashboardModule { }
