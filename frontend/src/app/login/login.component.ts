import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isForgotPassword: boolean = false;
  checked: boolean = false;
  isLoading$: boolean = false;

  subscription: Subscription[] = []

  constructor(private router: Router,
    private userService: UserService) {
    }

  ngOnInit(): void {    
    this.subscription.push(this.userService.isLoading$.subscribe(
      result=>{
        this.isLoading$ = result.substring(0,4)=='true';
        return true;
      }
    ));
  }

  onForgotPassword(){
    this.isForgotPassword = true;
  }

}
