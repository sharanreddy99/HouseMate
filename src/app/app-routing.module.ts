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
import { AuthGuard } from './services/auth.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]    
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'items',
    component: CompleteItemsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'reminder',
    component: CompleteReminderComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'summary',
    component: CompleteSummaryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'about',
    component: CompleteAboutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'stockestimator',
    component: CompleteStockEstimatorComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule],
  providers: [
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true }
  ]
})
export class AppRoutingModule { }
