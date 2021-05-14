import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FPSettings } from './fpsettings';
import { isUndefined } from 'util';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['../login.component.css']
})
export class ForgotpasswordComponent{
  
  modalRef: BsModalRef;
  @ViewChild('template') template: TemplateRef<any>;

  modalbody: string = undefined;
  isPassValid: boolean;
  isOTPSent: boolean;
  isOTPVerified: boolean;
  private _otp = '';
  pass: string = undefined;
  confpass: string = undefined;
  explainpasswordcount: number = 0;

  fpSettings: FPSettings = {
    email: undefined,
    password: undefined
  }

  constructor(private userService: UserService,
    private modalService: BsModalService,
    private router: Router){}
  

  openModal() {
    this.modalRef = this.modalService.show(this.template);
  }

  closeModal(){
    this.modalRef.hide();
  }

  generateOTP(){
    clearTimeout();
    this.userService.updateLoading('true');
    this.userService.validEmail(this.fpSettings.email).subscribe(
      result => {
        
        setTimeout(()=>{
          this.modalRef.hide();
        },3000);
        this.modalbody = "OTP has been generated and is valid for 3 minutes.";
        this.openModal();
        
        this.userService.generateOTP(this.fpSettings.email).subscribe(
          result => {
            setTimeout(()=>{
              this._otp = undefined;
              this.isOTPSent = false;
            },180000);
  
            this._otp = result.otp;
            this.isOTPSent = true;
            this.isOTPVerified = null;
          },
          error => {
            
            setTimeout(()=>{
              this.modalRef.hide();
            },3000);
            
            
            this._otp = '';
            this.isOTPSent = null;
            this.isOTPVerified = null;
            this.modalbody = "Generating OTP Failed. Please try again";
            this.openModal();
          },
          ()=>{
            this.userService.updateLoading('false');
          }
        )

      },error => {
        setTimeout(()=>{
          this.modalRef.hide();
        },3000);
        
        this.modalbody = error.error.msg;
        this.openModal();
      },
      ()=>{
        this.userService.updateLoading('false');
      }
    )
  }

  verifyOTP(otp: string){
    if(otp==this._otp){
      this.isOTPVerified = true;
    }else
      this.isOTPVerified = false;
  }

  gotoLogin(){
    window.location.reload();
  }

  onChangePassword(){
    clearTimeout();
    this.fpSettings.email = this.fpSettings.email === undefined ? '' : this.fpSettings.email;
    this.fpSettings.password = this.fpSettings.password === undefined ? '' : this.fpSettings.password;

    let pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?([^\w\s]|[_])).{8,}$/;
    this.isPassValid = pattern.test(this.pass);
    this.isPassValid = pattern.test(this.confpass);
    this.isPassValid = this.isPassValid? this.pass===this.confpass : false;
  
    if(this.isPassValid){
      this.fpSettings.password = this.pass;
      this.userService.updateLoading('true');
      this.userService.postFPForm(this.fpSettings).subscribe(
        result => {
          
          setTimeout(()=>{
            window.location.reload();
          },3000);
          localStorage.clear();
          this.modalbody = result.msg;
          this.openModal();
        },
        error  => {
          
          setTimeout(()=>{
            this.modalRef.hide();
          },3000);
          this.modalbody = error.error.msg;
          this.openModal() ; 
          },
          ()=>{
            this.userService.updateLoading('false');
          }
        );
    }
  }

  explainPassword(){
    clearTimeout();
    if(this.explainpasswordcount==0){
      setTimeout(()=>{
        this.modalRef.hide();
      },10000)
      this.modalbody = "Password must consist of atleast 1 Uppercase, 1 Lowercase, 1 Digit and 1 special symbol with a min length of 8.";
      this.openModal();
      this.explainpasswordcount+=1;
    }
  }
}