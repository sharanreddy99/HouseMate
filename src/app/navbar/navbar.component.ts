import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {


  constructor(private router: Router,
    private authService: AuthService){}

  gotoLogout(){
    this.authService.logout();
  }

  gotoProfile(){
    this.router.navigate(['profile'])
  }

  gotoDashboard(){
    this.router.navigate(['dashboard'])
  }
}
