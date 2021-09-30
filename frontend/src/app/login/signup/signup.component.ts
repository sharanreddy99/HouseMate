import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { SignupSettings } from './signupsettings';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['../login.component.css'],
})
export class SignupComponent implements OnInit {
  modalRef: BsModalRef;
  @ViewChild('template') template: TemplateRef<any>;
  @ViewChild('signupform') signupform: any;

  explainpasswordcount: number = 0;
  modalbody: string = undefined;
  isFNValid: boolean;
  isLNValid: boolean;
  isEmailValid: boolean;
  isPassValid: boolean;
  isOTPSent: boolean;
  isOTPVerified: boolean;
  isSignupValid: boolean;

  signupSettings: SignupSettings = {
    firstName: undefined,
    lastName: undefined,
    displayName: undefined,
    email: undefined,
    mobile: undefined,
    password: undefined,
    confpass: undefined,
  };

  constructor(
    private userService: UserService,
    private modalService: BsModalService
  ) {}

  ngOnInit(): void {}

  openModal() {
    this.modalRef = this.modalService.show(this.template);
  }

  closeModal() {
    this.modalRef.hide();
  }

  generateOTP() {
    clearTimeout();
    if (this.validateFields()) {
      this.userService.updateLoading('true');
      this.userService.isNewEmail(this.signupSettings.email).subscribe(
        (res) => {
          this.userService.generateOTP(this.signupSettings.email).subscribe(
            (result) => {
              this.userService.updateLoading('false');
              setTimeout(() => {
                this.closeModal();
              }, 3000);

              this.isOTPSent = true;
              this.isOTPVerified = undefined;

              this.modalbody =
                'OTP has been generated and is valid for 3 minutes.';
              this.openModal();
            },
            (e) => {
              this.userService.updateLoading('false');
              setTimeout(() => {
                this.closeModal();
              }, 3000);

              this.isOTPSent = undefined;
              this.isOTPVerified = undefined;
              this.modalbody = 'Generating OTP failed. Try again later.';
              this.openModal();
            }
          );
        },
        (err) => {
          this.userService.updateLoading('false');
          setTimeout(() => {
            this.closeModal();
          }, 3000);

          this.isOTPSent = undefined;
          this.isOTPVerified = undefined;
          this.modalbody = err.error.error;
          this.openModal();
        }
      );
    }
  }

  verifyOTP(otp: string) {
    clearTimeout();
    this.userService.updateLoading('true');
    this.userService.verifyOTP(this.signupSettings.email, otp).subscribe(
      (result) => {
        this.userService.updateLoading('false');
        this.isOTPVerified = true;
      },
      (err) => {
        this.userService.updateLoading('false');
        setTimeout(() => {
          this.closeModal();
        }, 3000);

        if (err.error.code == 500) {
          this.isOTPSent = undefined;
        }

        this.isOTPVerified = false;
        this.modalbody = err.error.error;
        this.openModal();
      }
    );
  }

  explainPassword() {
    if (this.explainpasswordcount == 0) {
      setTimeout(() => {
        this.closeModal();
      }, 7000);
      this.modalbody =
        'Password must consist of atleast 1 Uppercase, 1 Lowercase, 1 Digit and 1 special symbol with a min length of 8.';
      this.openModal();
      this.explainpasswordcount += 1;
    }
  }

  validateFields() {
    this.signupSettings.firstName =
      this.signupSettings.firstName === undefined
        ? ''
        : this.signupSettings.firstName;
    this.signupSettings.lastName =
      this.signupSettings.lastName === undefined
        ? ''
        : this.signupSettings.lastName;
    this.signupSettings.displayName =
      this.signupSettings.firstName + ' ' + this.signupSettings.lastName;

    this.signupSettings.email =
      this.signupSettings.email === undefined ? '' : this.signupSettings.email;
    this.signupSettings.password =
      this.signupSettings.password === undefined
        ? ''
        : this.signupSettings.password;
    this.signupSettings.confpass =
      this.signupSettings.confpass === undefined
        ? ''
        : this.signupSettings.confpass;

    let pattern = /^[A-Za-z]{2,}([\ A-Za-z]+)*$/i;
    this.isFNValid = pattern.test(this.signupSettings.firstName);
    this.isLNValid = pattern.test(this.signupSettings.lastName);

    pattern = /[\w-]+@([\w-]+\.)+[\w-]+/i;
    this.isEmailValid = pattern.test(this.signupSettings.email);

    pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?([^\w\s]|[_])).{8,}$/;
    this.isPassValid = pattern.test(this.signupSettings.password);
    this.isPassValid = pattern.test(this.signupSettings.confpass);
    this.isPassValid = this.isPassValid
      ? this.signupSettings.password === this.signupSettings.confpass
      : false;

    return (
      this.isFNValid && this.isLNValid && this.isEmailValid && this.isPassValid
    );
  }

  onSignupSubmit() {
    clearTimeout();
    this.userService.updateLoading('true');

    this.userService.postSignupForm(this.signupSettings).subscribe(
      (result) => {
        this.userService.updateLoading('false');
        setTimeout(() => {
          window.location.reload();
        }, 3000);
        this.modalbody = result.data;
        this.openModal();
      },
      (err) => {
        this.userService.updateLoading('false');
        setTimeout(() => {
          this.closeModal();
        }, 3000);
        this.modalbody = err.error.error;
        this.openModal();
      }
    );
  }
}
