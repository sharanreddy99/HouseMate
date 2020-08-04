import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ItemService } from '../services/item.service';
import { UserService } from '../services/user.service';
declare var $:any;

@Component({
  selector: 'app-complete-items',
  templateUrl: './complete-items.component.html',
  styleUrls: ['./items.component.css']
})
export class CompleteItemsComponent implements OnInit{

  constructor(private router: Router,
    private itemService: ItemService,
    private userService: UserService){}

  checked: boolean; 
  isLoading$: boolean = false;
    
  categoryOptions = [
    {id: 0, text: 'Select a Category'},
  ];

  itemOptions = [
    {id: 0, text: 'Select an Item'},
  ];
 
  ngOnInit(){

    $('.category-select').select2({
      data: this.categoryOptions
    });
    
    $('.item-select').select2({
      data: this.itemOptions
    });

    $(document).ready(()=> {

      this.isLoading$ = true;
      this.itemService.postGetDisabledState(this.checked,localStorage.getItem('email'),localStorage.getItem('password')).subscribe(
        result => {    
          this.isLoading$ = false;
          this.checked = result.checked;
          this.itemService.postSetDisabledState(this.checked,localStorage.getItem('email'),localStorage.getItem('password')).subscribe();
        }
      );

      this.itemService.postGetCategory(localStorage.getItem('email'),localStorage.getItem('password')).subscribe(
        result => {
          this.isLoading$ = false;
          this.categoryOptions = [{id: 0, text: 'Select a Category'}];
          this.categoryOptions = this.categoryOptions.concat(result);  
          
          $('.category-select').select2({
            data: this.categoryOptions
          });

          let id = localStorage.getItem('categoryid');
          if(id && parseInt(id)<this.categoryOptions.length){
            $('.category-select').val(id).trigger('change').trigger({type: 'select2:selecting'});
          }else{
            $('.category-select').val(0).trigger('change')
          }
        },
        error => {
        this.isLoading$ = false;
        this.router.navigate(['items'])
        }
      )
    });
    
    $('.category-select').on('select2:selecting',(e)=>{
      if(e && e.params && e.params.args && e.params.args.data){
        localStorage.setItem('categoryid',e.params.args.data.id);
        localStorage.setItem('category',e.params.args.data.text);
      }

        this.isLoading$ = true;
        this.itemService.postGetItem(localStorage.getItem('category'),localStorage.getItem('email'),localStorage.getItem('password')).subscribe(
          result => {
            this.isLoading$ = false;
            this.itemOptions = [{id: 0, text: 'Select an Item'}]
            this.itemOptions = this.itemOptions.concat(result); 
            $('.item-select').empty();
            $('.item-select').select2({
              data: this.itemOptions
            });

          },
          error => {
            this.isLoading$ = false;
          },
          () => {
            
            let id = localStorage.getItem('nameid');
            if(id && parseInt(id)<this.itemOptions.length){
              $('.item-select').val(id).trigger('change');
            }else{
              $('.item-select').val(0).trigger('change');
            }
          }
        )
      });
    
    $('.item-select').on('select2:selecting',(e)=>{
        localStorage.setItem('nameid',e.params.args.data.id);
        localStorage.setItem('name',e.params.args.data.text);
    });
  }

  openAddItem(){
    
    let category = $('.category-select').select2('data')[0].text
    let categoryid = $('.category-select').select2('data')[0].id
    if(category != "Select a Category"){
      localStorage.setItem('category',category);
      localStorage.setItem('categoryid',categoryid)
    }
    else{
      localStorage.removeItem('category');
      localStorage.removeItem('categoryid')
    }

    this.router.navigate(['items','additem'])
  }
  openEditItem(){
    let category = $('.category-select').select2('data')[0].text
    let name = $('.item-select').select2('data')[0].text
    let categoryid = $('.category-select').select2('data')[0].id
    let nameid = $('.item-select').select2('data')[0].id
    
    localStorage.setItem('category',category);
    localStorage.setItem('name',name);

    localStorage.setItem('categoryid',categoryid);
    localStorage.setItem('nameid',nameid);

    this.router.navigate(['items','edititem'])
  }
  openDeleteItem(){
    let category = $('.category-select').select2('data')[0].text
    let name = $('.item-select').select2('data')[0].text
    let categoryid = $('.category-select').select2('data')[0].id
    let nameid = $('.item-select').select2('data')[0].id
    
    localStorage.setItem('category',category);
    localStorage.setItem('name',name);

    localStorage.setItem('categoryid',categoryid);
    localStorage.setItem('nameid',nameid);

    this.router.navigate(['items','deleteitem'])
  }

  openAddOrRemoveStock(){
    
    let category = $('.category-select').select2('data')[0].text
    let name = $('.item-select').select2('data')[0].text
    let categoryid = $('.category-select').select2('data')[0].id
    let nameid = $('.item-select').select2('data')[0].id
    
    localStorage.setItem('category',category);
    localStorage.setItem('name',name);

    localStorage.setItem('categoryid',categoryid);
    localStorage.setItem('nameid',nameid);

    this.router.navigate(['items','addremovestock'])
  }

  toggleDisabled(){
    this.itemService.postSetDisabledState(this.checked,localStorage.getItem('email'),localStorage.getItem('password')).subscribe();
  }
}