import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestInterceptor } from './services/request.interceptor';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { CompleteItemsComponent } from './items/complete-items.component';
import { CompleteReminderComponent } from './reminder/complete-reminder.component';
import { CompleteSummaryComponent } from './summary/complete-summary.component';
import { CompleteAboutComponent } from './about/complete-about.component';
import { CompleteStockEstimatorComponent } from './stock-estimator/complete-stock-estimator.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'profile',
    component: ProfileComponent,
  },
  {
    path: 'items',
    component: CompleteItemsComponent,
  },
  {
    path: 'reminder',
    component: CompleteReminderComponent,
  },
  {
    path: 'summary',
    component: CompleteSummaryComponent,
  },
  {
    path: 'about',
    component: CompleteAboutComponent,
  },
  {
    path: 'stockestimator',
    component: CompleteStockEstimatorComponent,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
    }),
  ],
  exports: [RouterModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
  ],
})
export class AppRoutingModule {}
