import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { ItemSettings } from '../itemsettings';
import { ItemService } from 'src/app/services/item.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserService } from 'src/app/services/user.service';

declare var $:any;

@Component({
  selector: 'app-edititem',
  templateUrl: './edititem.component.html',
  styleUrls: ['./edititem.component.css']
})
export class EdititemComponent implements OnInit {
  
  @ViewChild('template2') template: TemplateRef<any>;
  modalRef2: BsModalRef;
  secondmodalbody: string;
  todaydate: any = undefined;
  isLoading$: boolean = false;

  oldItemSettings: ItemSettings = {
    category: undefined,
    name: undefined,
    quantity: undefined,
    units: 'choose',
    stockcount: undefined,
    price: undefined,
    notify: 'choose',
    utilizationTime:undefined,
    utilizationQuantity: undefined,
    utilizationUnits: 'choose',
    description: undefined,
    nextreqdate: undefined,
    totalstock: {
      amount: undefined,
      units: undefined,
      daysleft: undefined
    }
  };

  itemSettings: ItemSettings = {
    category: undefined,
    name: undefined,
    quantity: undefined,
    units: 'choose',
    stockcount: undefined,
    price: undefined,
    notify: 'choose',
    utilizationTime:undefined,
    utilizationQuantity: undefined,
    utilizationUnits: 'choose',
    description: undefined,
    nextreqdate: undefined,
    totalstock: {
      amount: undefined,
      units: undefined,
      daysleft: undefined
    }
  };

  isUnitsValid: boolean;
  isNotifyValid: boolean;
  isUtilTimeValid: boolean;
  isUtilUnitsValid: boolean;
  isDateValid: boolean;
  
  config = {
    keyboard: false,
    ignoreBackdropClick: true
  }
 
  ngOnInit(){
    this.todaydate = new Date();
    var dd: any = this.todaydate.getDate();

    var mm: any = this.todaydate.getMonth()+1; 
    var yyyy = this.todaydate.getFullYear();
    if(dd<10) 
    {
      dd = '0'+dd;
    } 

    if(mm<10) 
    {
        mm='0'+mm;
    } 
    this.todaydate = yyyy+'-'+mm+'-'+dd;
    
    let category = localStorage.getItem('category');
    let name = localStorage.getItem('name')
    
    this.isLoading$ = true;
    this.itemService.getCurrentItemDetails(category,name,localStorage.getItem('email'),localStorage.getItem('password')).subscribe(
      result => {
        this.isLoading$ = false;
        this.itemSettings = result;
        this.oldItemSettings = {...result};
      },error => {
        this.isLoading$ = false;
        this.router.navigate(['items'])
      }
    )
  }


  constructor(private itemService: ItemService,
    private router: Router,
    private route:  ActivatedRoute,
    private modalService: BsModalService,
    private userService: UserService) {
    }
  
  updateItem(){
    
    this.itemSettings.category = this.itemSettings.category.trim();
    this.itemSettings.name = this.itemSettings.name.trim();
    
    if(this.itemSettings.units === 'choose'){
      this.isUnitsValid = false;
    }
    
    else{
      this.isUnitsValid = true;
    }
    
    
    if(this.itemSettings.notify === 'choose'){
      this.isNotifyValid= false;
      this.isUtilTimeValid= false;
      this.isUtilUnitsValid= false;
      this.isDateValid= false;
    }
    
    else if(this.itemSettings.notify === 'request'){
      this.isNotifyValid = true;
      this.isUtilTimeValid= true;
      this.isUtilUnitsValid= true;
      
      if(this.itemSettings.nextreqdate){
        this.isDateValid = true;
      }
      else{
        this.isDateValid = false;
      }
    }
    else{

      this.isNotifyValid = true;
      this.isDateValid = true;

      if(this.itemSettings.utilizationTime >=0){
        this.isUtilTimeValid = true;
      }else{
        this.isUtilTimeValid = false;
      }
      
      if(this.itemSettings.utilizationUnits === 'choose'){
        this.isUtilUnitsValid = false;
      }else{
        this.isUtilUnitsValid = true;
      }

      if((this.itemSettings.units == 'kg' || this.itemSettings.units == 'gms') && (this.itemSettings.utilizationUnits == 'kg' || this.itemSettings.utilizationUnits == 'gms')){
        this.isUnitsValid = true;
        this.isUtilUnitsValid = true;
      }

      else if((this.itemSettings.units == 'lit' || this.itemSettings.units == 'ml') && (this.itemSettings.utilizationUnits == 'lit' || this.itemSettings.utilizationUnits == 'ml')){
        this.isUnitsValid = true;
        this.isUtilUnitsValid = true;
      }

      else if(this.itemSettings.units == 'dozen' && this.itemSettings.utilizationUnits == 'dozen'){
        this.isUnitsValid = true;
        this.isUtilUnitsValid = true;
      }

      else if(this.itemSettings.units == 'units' && this.itemSettings.utilizationUnits == 'units'){
        this.isUnitsValid = true;
        this.isUtilUnitsValid = true;
      }
      else{
        this.isUnitsValid = false;
        this.isUtilUnitsValid = false;
      }
    }

    if(this.isUnitsValid && this.isNotifyValid && this.isUtilTimeValid && this.isUtilUnitsValid && this.isDateValid ){
      
      this.itemSettings.category = this.itemSettings.category.toUpperCase();
      this.itemSettings.name = this.itemSettings.name.toUpperCase();

      this.isLoading$ = true;
      this.itemService.postUpdateItem(this.oldItemSettings,this.itemSettings,localStorage.getItem('email'),localStorage.getItem('password')).subscribe(
        result => {
          this.isLoading$ = false;
          setTimeout(()=>{
            this.closeSecondModal();
            window.location.reload();
          },2000);
          
          localStorage.setItem('category',result.category);
          localStorage.setItem('name',result.name);
          this.secondmodalbody = "Updated Item Successfully.";
          this.openSecondModal();
        },
        error => {
          this.isLoading$ = false;
          setTimeout(()=>{
            this.closeSecondModal();
          },2000);
          
          this.secondmodalbody = "Updating Item Failed. Check whether the updated item already exists.";
          this.openSecondModal();
        }
      );
    }
  }

  onCancel(){
    this.router.navigate(['items']);
  }

  openSecondModal(){
    this.modalRef2 = this.modalService.show(this.template);
  }

  closeSecondModal(){
    this.modalRef2.hide();
  }

  compareBothSettings(){
    return JSON.stringify(this.itemSettings)==JSON.stringify(this.oldItemSettings);
  }

}
