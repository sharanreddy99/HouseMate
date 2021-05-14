import { Component, OnInit } from '@angular/core';
import { ItemService } from '../services/item.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

declare var $: any;

@Component({
  selector: 'app-complete-summary',
  templateUrl: './complete-summary.component.html',
  styleUrls: ['./summary.component.css']
})
export class CompleteSummaryComponent implements OnInit {


  colors = undefined;

  categoryOptions = [
    {id: 0, text: 'All Items'}
  ];

  view: any[] = [];
  isLoading$: boolean = false;

  legendTitle = 'Item Categories';
  legendPosition = 'right';

  showGridLines = true;

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Items List';
  showYAxisLabel = true;
  yAxisLabel = 'Stock Count';
  timeline = false;

  colorScheme = {domain: []};

  multi: any = [];
  
  constructor(private itemService: ItemService, private router: Router,private userService: UserService){}

  ngOnInit() {
    
    $(document).ready(()=>{
      $('.helloworld').scroll(()=>{
        $('.hiddenbutton').click();
      })
    });

    $('.category-select').select2({
      data: this.categoryOptions
    });

    this.isLoading$ = true;
    this.itemService.postGetAllItems(localStorage.getItem('email'),localStorage.getItem('password')).subscribe(
      result => {
        this.isLoading$ = false;
        this.categoryOptions = [{id: 0, text: 'ALl Items'}];
        this.categoryOptions = this.categoryOptions.concat(result['selectdata']);  
        $('.category-select').select2({
          data: this.categoryOptions
        });
        this.getAllItems();
      }
    );

    
    $('.category-select').on('select2:selecting',(e)=>{
      let index = e.params.args.data.id;
      if(index==0){
        this.getAllItems();
      }
      else{
        this.isLoading$ = true;
        this.itemService.postGetItemsForSummary(this.categoryOptions[index].text,localStorage.getItem('email'),localStorage.getItem('password')).subscribe(
        result => {
          this.isLoading$ = false;
          this.multi = [];
          this.colorScheme = {domain: []};

          result['estimatedstock'].sort((a,b)=> a.category.localeCompare(b.category));

          for(let i=0;i<result['estimatedstock'].length;i++){
            this.multi[i] = {}
            this.multi[i]["name"] = result['estimatedstock'][i].name;
            this.multi[i]["value"] = parseInt(''+result['estimatedstock'][i].stockcount);
            this.multi[i]['extra'] = {};
            this.multi[i]['extra']['category'] = result['estimatedstock'][i].category;
            this.multi[i]['extra']['nextreqdate'] = result['estimatedstock'][i].nextreqdate;
            this.colorScheme.domain.push(this.colors[result['estimatedstock'][i].category])
          }

          this.view = [60*result['estimatedstock'].length,500];
          if(this.view[0]<200){
            this.view[0]=200;
          }
          this.yAxisLabel = "Stock Count for "+result['estimatedstock'][0].category;
        },
        error => {
          this.isLoading$ = false;
          this.router.navigate(['dashboard']);
        })
      }
    });
  }

  random_rgba() {
    return 'hsla(' + (Math.random() * 360) + ', 100%, 50%, 1)';
  }
  
  getAllItems(){  
    this.isLoading$ = true;
    this.itemService.postGetAllItems(localStorage.getItem('email'),localStorage.getItem('password')).subscribe(
      result => {
        this.isLoading$ = false;
        this.categoryOptions = [{id: 0, text: 'All Items'}];
        this.categoryOptions = this.categoryOptions.concat(result['selectdata']);  
        $('.category-select').select2({
          data: this.categoryOptions
        });
    
        if(!this.colors){
          this.colors = {};
          for(var i=1;i<this.categoryOptions.length;i++){
            this.colors[this.categoryOptions[i].text] = this.random_rgba();
          }  
        }
        
        result['estimatedstock'].sort((a,b)=> a.category.localeCompare(b.category));

        this.multi = [];
        this.colorScheme = {domain: []};
        
        for(let i=0;i<result['estimatedstock'].length;i++){
          this.multi[i] = {}
          this.multi[i]["name"] = result['estimatedstock'][i].name;
          this.multi[i]["value"] = parseInt(''+result['estimatedstock'][i].stockcount);
          this.multi[i]['extra'] = {};
          this.multi[i]['extra']['category'] = result['estimatedstock'][i].category;
          this.multi[i]['extra']['nextreqdate'] = result['estimatedstock'][i].nextreqdate;
          this.colorScheme.domain.push(this.colors[result['estimatedstock'][i].category]);
        }

        this.view = [60*result['estimatedstock'].length,500];
        if(this.view[0]<200){
          this.view[0]=200;
        }
        this.yAxisLabel = "Stock Count for All Items"; 
      },
      error => {
        this.isLoading$ = false;
        this.router.navigate(['dashboard']);
      }
    );
  }
}
