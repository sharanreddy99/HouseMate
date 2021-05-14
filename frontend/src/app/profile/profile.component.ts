import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { UserService } from '../services/user.service';
import { ProfileSettings } from './profilesettings';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  modalRef: BsModalRef;
  modalRef2: BsModalRef;

  @ViewChild('template') template: TemplateRef<any>;
  @ViewChild('template2') template2: TemplateRef<any>;
  

  modalbody: string;
  deleteusertext: string;

  profileSettings: ProfileSettings = {
    fname: undefined,
    lname: undefined,
    email: localStorage.getItem('email'),
    password: localStorage.getItem('password'),
  }

  newProfileSettings: ProfileSettings = {...this.profileSettings}


  isEditClicked: boolean = false;
  isSaveClicked: boolean = true;
  confpass: string = localStorage.getItem('password');
  isFNValid: boolean ;
  isLNValid: boolean;
  isEmailValid: boolean;
  isPassValid: boolean;
  isOTPSent: boolean;
  isOTPVerified: boolean;
  isSignupValid: boolean;
  private _otp: string;
  explainpasswordcount: number = 0;
  isLoading$: boolean = false;

  constructor(private userService: UserService,
    private modalService: BsModalService,
    private router: Router,
    private authService: AuthService) {}
  
  ngOnInit(): void {
    this.isLoading$ = true;

    this.userService.getUserDetails(this.profileSettings.email,this.profileSettings.password).subscribe(
      result => {
        this.isLoading$ = false;
        this.newProfileSettings.fname = this.profileSettings.fname = result.fname;
        this.newProfileSettings.lname = this.profileSettings.lname = result.lname;
      },
      error => {
        this.isLoading$ = false;
        setTimeout(()=>{
          this.modalRef.hide();
          this.router.navigate(['']);
        },3000);
        this.modalbody = "Cannot Fetch the User Details.";
        this.openModal();
      }
    )
  }
  
  openModal() {
    this.modalRef = this.modalService.show(this.template);
  }

  closeModal() {
    this.modalRef.hide();
  }

  onEdit(){
    this.isEditClicked = true;
    this.isSaveClicked = false;
  }

  generateOTP(){
    
    clearTimeout();

    let pattern = /[\w-]+@([\w-]+\.)+[\w-]+/i;
    this.isEmailValid = pattern.test(this.newProfileSettings.email);

    if(this.isEmailValid){
      this.isLoading$ = true;

      this.userService.validEmail(localStorage.getItem('email')).subscribe(
        result => {
          this.isLoading$ = false;
          setTimeout(()=>{
            this.closeModal();
          },3000);
          this.isEmailValid = false; 
          this.modalbody = "Email-ID already registered, Try another email.";
          this.openModal();
        },
        (err) => {
          this.userService.generateOTP(this.newProfileSettings.email).subscribe(
            result => {
              this.isLoading$ = false;

              setTimeout(()=>{
                this.closeModal();
              },3000);
              this.modalbody = "OTP has been generated and is valid for 3 minutes.";
              this.openModal();

              setTimeout(()=>{
                this._otp = undefined;
                this.isOTPSent = false;
              },180000);

              this._otp = result.otp;
              this.isOTPSent = true;
              this.isOTPVerified = null;
            },
            error => {
              this.isLoading$ = false;
              setTimeout(()=>{
                this.closeModal();
              },3000);
                
              this._otp = '';
              this.isOTPSent = null;
              this.isOTPVerified = null;
              this.modalbody = "Generating OTP Failed. Please try again";
              this.openModal();
            }
          );
        }
      );
    }
  }

  verifyOTP(otp: string){
    if(otp==this._otp){
      this.isOTPVerified = true;
    }else
      this.isOTPVerified = false;
  }

  
  onProfileEdit(){
    clearTimeout();
    this.isEditClicked = false;
    this.isSaveClicked = true

    this.newProfileSettings.fname = this.newProfileSettings.fname === undefined ? '' : this.newProfileSettings.fname;
    this.newProfileSettings.lname = this.newProfileSettings.lname === undefined ? '' : this.newProfileSettings.lname;
    this.newProfileSettings.email = this.newProfileSettings.email === undefined ? '' : this.newProfileSettings.email;
    this.newProfileSettings.password = this.newProfileSettings.password === undefined ? '' : this.newProfileSettings.password;
    this.confpass  = this.confpass === undefined? '' : this.confpass ;
    
    let pattern = /^[A-Za-z]{2,}([\ A-Za-z]+)*$/i;
    this.isFNValid = pattern.test(this.newProfileSettings.fname);
    this.isLNValid = pattern.test(this.newProfileSettings.lname);
    
    pattern = /[\w-]+@([\w-]+\.)+[\w-]+/i;
    this.isEmailValid = pattern.test(this.newProfileSettings.email);

    pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?([^\w\s]|[_])).{8,}$/;
    this.isPassValid = pattern.test(this.newProfileSettings.password);
    this.isPassValid = pattern.test(this.confpass);
    this.isPassValid = this.isPassValid? this.newProfileSettings.password===this.confpass : false;
    
    if((this.isFNValid && this.isLNValid && this.isEmailValid && this.isPassValid))
    {
      this.isLoading$ = true;
      this.userService.updateUserDetails(this.profileSettings,this.newProfileSettings).subscribe(
        result => {
          this.isLoading$ = false;
          setTimeout(()=>{
            this.modalRef.hide();
            this.router.navigate(['']);
          },3000);
          this.modalbody = result.msg;
          this.openModal()
        },
        error  => {
          this.isLoading$ = false;
          setTimeout(()=>{
            this.modalRef.hide();
            window.location.reload();
          },3000);
          this.modalbody = "Updating Details Failed, Please try again.";
          this.openModal();
          }
        );
    }
  }

  equalObjects(): boolean{
    return ((JSON.stringify(this.profileSettings) == JSON.stringify(this.newProfileSettings)) && this.newProfileSettings.password == this.confpass);
  }

  
  openSecondModal(){
    this.modalRef2 = this.modalService.show(this.template2);
  }

  closeSecondModal(){
    this.modalRef2.hide();
  }

  goDelete() {
    this.isLoading$ = true;
    this.closeSecondModal();
    this.userService.postDeleteUser(localStorage.getItem('email'),localStorage.getItem('password')).subscribe(
      result => {
        this.isLoading$ = false;
        setTimeout(()=>{
          this.modalRef.hide();
          this.authService.logout();
        },2000);
        this.modalbody = "User has been deleted successfully";
        this.openModal();
      },
      error  => {
        this.isLoading$ = false;
        setTimeout(()=>{
          this.modalRef.hide();
          window.location.reload();
        },2000);
        this.modalbody = "Operation Failed. Please try Again.";
        this.openModal();
        }
    )
  }
  
  explainPassword(passRef: any){
    if(this.explainpasswordcount==0){
      setTimeout(()=>{
        this.modalRef.hide();
      },10000)
      passRef.setSelectionRange(0, passRef.value.length)
      this.modalbody = "Password must consist of atleast 1 Uppercase, 1 Lowercase, 1 Digit and 1 special symbol with a min length of 8.";
      this.openModal();
      this.explainpasswordcount+=1;
    }
  }
}
