import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-complete-about',
  templateUrl: './complete-about.component.html',
  styleUrls: ['./about.component.css']
})
export class CompleteAboutComponent implements OnInit {

  isLoading$: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}
