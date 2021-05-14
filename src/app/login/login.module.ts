import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

import { LoginComponent } from './login.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { ForgotpasswordComponent } from './forgotpassword/forgotpassword.component';
import { FeaturesModule } from '../features/features.module';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [LoginComponent, SigninComponent, SignupComponent, ForgotpasswordComponent],
  imports: [
    CommonModule,
    MatSlideToggleModule,
    FormsModule,
    ModalModule.forRoot(),
    HttpClientModule,
    FeaturesModule
  ],
  exports: [
    LoginComponent
  ]
})
export class LoginModule { }
