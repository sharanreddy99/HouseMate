import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SubloadingService {


  private isLoadingReminderSubject = new Subject<string>();
  isLoadingReminder$ = this.isLoadingReminderSubject.asObservable();
  updateLoadingReminder(value: string){
    this.isLoadingReminderSubject.next(value);
  }

  private isLoadingItemsSubject = new Subject<string>();
  isLoadingItems$ = this.isLoadingItemsSubject.asObservable();
  updateLoadingItems(value: string){
    this.isLoadingItemsSubject.next(value);
  }

  private isLoadingSummarySubject = new Subject<string>();
  isLoadingSummary$ = this.isLoadingSummarySubject.asObservable();  
  updateLoadingSummary(value: string){
    this.isLoadingSummarySubject.next(value);
  }

  private isLoadingAboutSubject = new Subject<string>();
  isLoadingAbout$ = this.isLoadingAboutSubject.asObservable();
  updateLoadingAbout(value: string){
    this.isLoadingAboutSubject.next(value);
  }

  private isLoadingStockEstimatorSubject = new Subject<string>();
  isLoadingStockEstimator$ = this.isLoadingStockEstimatorSubject.asObservable();  
  updateLoadingStockEstimator(value: string){
    this.isLoadingStockEstimatorSubject.next(value);
  }

  constructor() { }
}
