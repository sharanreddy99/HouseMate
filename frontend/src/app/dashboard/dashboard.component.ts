import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { SubloadingService } from '../features/subloading.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  
  isLoadingReminder$ = false;
  isLoadingItems$ = false;
  isLoadingSummary$ = false;
  isLoadingAbout$ = false;
  isLoadingStockEstimator$ = false;

  gotoCompletePage(path: string){
    this.router.navigate([path]);
  }

  ngOnInit(){

    this.subloadingService.isLoadingReminder$.subscribe(
      result=>{
        this.isLoadingReminder$ = result == 'true';
        return true;
      }
    );
    
    this.subloadingService.isLoadingSummary$.subscribe(
      result=>{
        this.isLoadingSummary$ = result == 'true';
        return true;
      }
    );

    this.subloadingService.isLoadingAbout$.subscribe(
      result=>{
        this.isLoadingAbout$ = result == 'true';
        return true;
      }
    );

    this.subloadingService.isLoadingStockEstimator$.subscribe(
      result=>{
        this.isLoadingStockEstimator$ = result == 'true';
        return true;
      }
    );

    this.subloadingService.isLoadingItems$.subscribe(
      result=>{
        this.isLoadingItems$ = result == 'true';
        return true;
      }
    );
  }
  constructor(private router: Router,
    private userService: UserService,
    private subloadingService: SubloadingService) {}
}
