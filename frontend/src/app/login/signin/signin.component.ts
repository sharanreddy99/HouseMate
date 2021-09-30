import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { SigninSettings } from './signinsettings';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

declare var $: any;

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['../login.component.css'],
})
export class SigninComponent implements OnInit {
  modalRef: BsModalRef;
  rememberme: boolean = false;
  returnUrl: string = undefined;

  @ViewChild('template') template: TemplateRef<any>;
  @Output() notify: EventEmitter<string> = new EventEmitter<string>();

  signinSettings: SigninSettings = {
    email: undefined,
    password: undefined,
  };

  constructor(
    private userService: UserService,
    private modalService: BsModalService,
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    this.userService.updateLoading('true');
    if (
      localStorage.getItem('access_token') &&
      localStorage.getItem('currentUser')
    ) {
      this.userService.getUserDetails().subscribe(
        (res) => {
          let userDetails = res.data;
          this.userService
            .postDecryptData(localStorage.getItem('currentUser'))
            .subscribe(
              (res) => {
                this.userService.updateLoading('false');
                if (res.data && res.data.email == userDetails.email) {
                  this.router.navigate([this.returnUrl]);
                }
              },
              (err) => {
                this.userService.updateLoading('false');
                this.fillSigninFields();
              }
            );
        },
        (err) => {
          this.userService.updateLoading('false');
          localStorage.removeItem('access_token');
          if (localStorage.getItem('rememberme') == 'true') {
            this.fillSigninFields();
          }
        }
      );
    } else if (localStorage.getItem('rememberme') == 'true') {
      this.userService.updateLoading('false');
      this.fillSigninFields();
    } else {
      this.userService.updateLoading('false');
      localStorage.clear();
    }
  }

  onSignin() {
    clearTimeout();
    this.userService.updateLoading('true');

    this.authService.login(this.signinSettings).subscribe(
      (result) => {
        this.userService.updateLoading('false');
        this.updateRememberMe();
        this.router.navigate([this.returnUrl]);
      },
      (error) => {
        setTimeout(() => {
          this.closeModal();
        }, 2000);

        localStorage.clear();
        this.signinSettings.email = undefined;
        this.signinSettings.password = undefined;
        this.rememberme = false;
        this.userService.updateLoading('false');
        this.openModal();
      }
    );
  }

  onForgotPassword() {
    this.notify.emit('Forgot Password Clicked');
  }

  openModal() {
    this.modalRef = this.modalService.show(this.template);
  }

  closeModal() {
    this.modalRef.hide();
    this.userService.updateLoading('false');
  }

  fillSigninFields() {
    let encUser = localStorage.getItem('currentUser');
    this.userService.postDecryptData(encUser).subscribe(
      (res) => {
        let currentUser = res.data;
        this.signinSettings.email = currentUser.email;
        this.signinSettings.password = currentUser.password;
        this.rememberme = true;
      },
      (err) => {
        localStorage.clear();
        this.rememberme = false;
      }
    );
  }

  updateRememberMe() {
    localStorage.setItem('rememberme', String(this.rememberme));
  }
}
