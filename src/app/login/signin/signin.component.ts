import { Component, OnInit, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SigninSettings } from './signinsettings';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';


declare var $:any;

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['../login.component.css']
})
export class SigninComponent implements OnInit  {

  
  modalRef: BsModalRef;
  rememberme: boolean = false;
  returnUrl: string = undefined;

  @ViewChild('template') template: TemplateRef<any>;
  @Output() notify: EventEmitter<string> = new EventEmitter<string>();
  

  signinSettings: SigninSettings = {
    email: undefined,
    password: undefined
  }

  constructor(
    private userService: UserService,
    private modalService: BsModalService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute){
      if(this.authService.currentUserValue){
        this.router.navigate(['dashboard']);
      }
    }
  
  ngOnInit(){
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';

    if(localStorage.getItem('rememberme') == 'true'){
      this.signinSettings.email = localStorage.getItem('email');
      this.signinSettings.password = localStorage.getItem('password');
      this.rememberme = true;
    
    }else{
      
      localStorage.clear();
      this.rememberme = false;
    }
  }

  onSignin(){
    clearTimeout();
    this.userService.updateLoading('true');

    this.authService.login(this.signinSettings).subscribe(
      result => {
        
        this.userService.updateLoading('false');
        this.updateRememberMe(result);
        this.router.navigate([this.returnUrl]);
      },
      error => {
        setTimeout(()=> {
          this.closeModal();
        },2000);
        
        localStorage.clear();
        this.signinSettings.email = undefined;
        this.signinSettings.password = undefined;
        this.userService.updateLoading('false');
        this.openModal();
      }
    );
  }

  onForgotPassword(){
    this.notify.emit('Forgot Password Clicked');
  }

  openModal(){
    this.modalRef = this.modalService.show(this.template);
  }

  closeModal(){
    this.modalRef.hide();
  }

  updateRememberMe(credentials){
    localStorage.setItem('email',this.signinSettings.email);
    localStorage.setItem('password',this.signinSettings.password);
    localStorage.setItem('rememberme',String(this.rememberme));
  }
}
