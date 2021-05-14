import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginModule } from './login/login.module';
import { NavbarModule } from './navbar/navbar.module';
import { ProfileComponent } from './profile/profile.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { FormsModule } from '@angular/forms';
import { ItemsModule } from './items/items.module';
import { SummaryModule } from './summary/summary.module';
import { ReminderModule } from './reminder/reminder.module';
import { AboutModule } from './about/about.module';
import { StockEstimatorModule } from './stock-estimator/stock-estimator.module';
import { FeaturesModule } from './features/features.module';

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LoginModule,
    AppRoutingModule,
    DashboardModule,
    NavbarModule,
    FormsModule,
    ItemsModule,
    SummaryModule,
    ReminderModule,
    AboutModule,
    StockEstimatorModule,
    FormsModule,
    FeaturesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
