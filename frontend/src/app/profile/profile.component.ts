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
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  modalRef: BsModalRef;
  modalRef2: BsModalRef;

  @ViewChild('template') template: TemplateRef<any>;
  @ViewChild('template2') template2: TemplateRef<any>;

  modalbody: string;
  deleteusertext: string;

  profileSettings: ProfileSettings = {
    firstName: undefined,
    lastName: undefined,
    email: undefined,
    password: undefined,
  };

  newProfileSettings: ProfileSettings = { ...this.profileSettings };

  isEditClicked: boolean = false;
  isSaveClicked: boolean = true;
  confpass: string = undefined;
  isFNValid: boolean;
  isLNValid: boolean;
  isEmailValid: boolean;
  isPassValid: boolean;
  isOTPSent: boolean;
  isOTPVerified: boolean;
  isSignupValid: boolean;
  explainpasswordcount: number = 0;
  isLoading$: boolean = false;

  constructor(
    private userService: UserService,
    private modalService: BsModalService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.isLoading$ = true;

    this.userService.getUserDetails().subscribe(
      (result) => {
        this.isLoading$ = false;
        this.newProfileSettings.firstName = this.profileSettings.firstName =
          result.data.firstName;
        this.newProfileSettings.lastName = this.profileSettings.lastName =
          result.data.lastName;
        this.newProfileSettings.email = this.profileSettings.email =
          result.data.email;
        this.userService
          .postDecryptData(localStorage.getItem('currentUser'))
          .subscribe(
            (res) => {
              this.newProfileSettings.password = this.profileSettings.password =
                res.data.password;
              this.confpass = res.data.password;
            },
            (err) => {
              this.isLoading$ = false;
              setTimeout(() => {
                this.modalRef.hide();
                this.authService.logout();
              }, 3000);
              this.modalbody = err.error.error;
              this.openModal();
            }
          );
      },
      (err) => {
        this.isLoading$ = false;
        setTimeout(() => {
          this.modalRef.hide();
          this.authService.logout();
        }, 3000);
        this.modalbody = err.error.error;
        this.openModal();
      }
    );
  }

  onEdit() {
    this.isEditClicked = true;
    this.isSaveClicked = false;
  }

  generateOTP() {
    clearTimeout();

    this.userService.updateLoading('true');

    this.userService.generateOTP(this.newProfileSettings.email).subscribe(
      (result) => {
        setTimeout(() => {
          this.closeModal();
        }, 3000);

        setTimeout(() => {
          this.isOTPSent = false;
        }, 180000);

        this.isOTPSent = true;
        this.isOTPVerified = undefined;

        this.modalbody = 'OTP has been generated and is valid for 3 minutes.';
        this.openModal();
      },
      (err) => {
        setTimeout(() => {
          this.closeModal();
        }, 3000);

        this.isOTPSent = undefined;
        this.isOTPVerified = undefined;
        this.modalbody = 'Generating OTP failed. Try again later.';
        this.openModal();
      },
      () => {
        this.userService.updateLoading('false');
      }
    );
  }

  validateEmailAndGenerateOTP() {
    clearTimeout();

    let pattern = /[\w-]+@([\w-]+\.)+[\w-]+/i;
    this.isEmailValid = pattern.test(this.newProfileSettings.email);

    if (this.isEmailValid) {
      this.isLoading$ = true;

      this.userService.validEmail(this.newProfileSettings.email).subscribe(
        (result) => {
          this.isLoading$ = false;
          this.generateOTP();
        },
        (err) => {
          this.isLoading$ = false;
          setTimeout(() => {
            this.closeModal();
          }, 3000);

          this.isOTPVerified = false;
          this.modalbody = err.error.error;
          this.openModal();
        }
      );
    }
  }

  verifyOTP(otp: string) {
    this.isLoading$ = true;
    this.userService.verifyOTP(this.newProfileSettings.email, otp).subscribe(
      (result) => {
        this.isLoading$ = false;
        this.isOTPVerified = true;
      },
      (err) => {
        this.isLoading$ = false;
        setTimeout(() => {
          this.closeModal();
        }, 3000);

        this.isOTPVerified = false;
        this.modalbody = err.error.error;
        this.openModal();
      },
      () => {
        this.userService.updateLoading('false');
      }
    );
  }

  onProfileEdit() {
    clearTimeout();

    this.newProfileSettings.firstName =
      this.newProfileSettings.firstName === undefined
        ? ''
        : this.newProfileSettings.firstName;
    this.newProfileSettings.lastName =
      this.newProfileSettings.lastName === undefined
        ? ''
        : this.newProfileSettings.lastName;
    this.newProfileSettings.email =
      this.newProfileSettings.email === undefined
        ? ''
        : this.newProfileSettings.email;
    this.newProfileSettings.password =
      this.newProfileSettings.password === undefined
        ? ''
        : this.newProfileSettings.password;
    this.confpass = this.confpass === undefined ? '' : this.confpass;

    let pattern = /^[A-Za-z]{2,}([\ A-Za-z]+)*$/i;
    this.isFNValid = pattern.test(this.newProfileSettings.firstName);
    this.isLNValid = pattern.test(this.newProfileSettings.lastName);

    pattern = /[\w-]+@([\w-]+\.)+[\w-]+/i;
    this.isEmailValid = pattern.test(this.newProfileSettings.email);

    pattern = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?([^\w\s]|[_])).{8,}$/;
    this.isPassValid = pattern.test(this.newProfileSettings.password);
    this.isPassValid = pattern.test(this.confpass);
    this.isPassValid = this.isPassValid
      ? this.newProfileSettings.password === this.confpass
      : false;

    if (
      this.isFNValid &&
      this.isLNValid &&
      this.isEmailValid &&
      this.isPassValid
    ) {
      this.isLoading$ = true;
      this.userService.updateUserDetails(this.newProfileSettings).subscribe(
        (result) => {
          this.isLoading$ = false;
          setTimeout(() => {
            this.modalRef.hide();
            this.authService.logout();
          }, 3000);
          this.modalbody = result.data;
          this.openModal();
        },
        (err) => {
          this.isLoading$ = false;
          setTimeout(() => {
            this.modalRef.hide();
          }, 3000);
          this.modalbody = err.error.error;
          this.openModal();
        }
      );
    }
  }

  goDelete() {
    this.isLoading$ = true;
    this.closeSecondModal();
    this.userService.postDeleteUser().subscribe(
      (result) => {
        this.isLoading$ = false;
        setTimeout(() => {
          this.modalRef.hide();
          this.authService.logout();
        }, 2000);
        this.modalbody = result.data;
        this.openModal();
      },
      (err) => {
        this.isLoading$ = false;
        setTimeout(() => {
          this.closeModal();
        }, 2000);
        this.modalbody = err.error.error;
        this.openModal();
      }
    );
  }

  equalObjects(): boolean {
    return (
      JSON.stringify(this.profileSettings) ==
        JSON.stringify(this.newProfileSettings) &&
      this.newProfileSettings.password == this.confpass
    );
  }

  openModal() {
    this.modalRef = this.modalService.show(this.template);
  }

  closeModal() {
    this.modalRef.hide();
  }

  openSecondModal() {
    this.modalRef2 = this.modalService.show(this.template2);
  }

  closeSecondModal() {
    this.modalRef2.hide();
  }

  explainPassword(passRef: any) {
    if (this.explainpasswordcount == 0) {
      setTimeout(() => {
        this.modalRef.hide();
      }, 10000);
      passRef.setSelectionRange(0, passRef.value.length);
      this.modalbody =
        'Password must consist of atleast 1 Uppercase, 1 Lowercase, 1 Digit and 1 special symbol with a min length of 8.';
      this.openModal();
      this.explainpasswordcount += 1;
    }
  }
}
