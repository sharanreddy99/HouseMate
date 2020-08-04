import { Component, ViewChild, TemplateRef } from '@angular/core';
import { ItemSettings } from '../itemsettings';
import { ItemService } from 'src/app/services/item.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserService } from 'src/app/services/user.service';

declare var $: any;

@Component({
  selector: 'app-deleteitem',
  templateUrl: './deleteitem.component.html',
  styleUrls: ['./deleteitem.component.css']
})
export class DeleteitemComponent {
  
  @ViewChild('template2') template: TemplateRef<any>;
  @ViewChild('template3') template3: TemplateRef<any>;

  modalRef2: BsModalRef;
  modalRef3: BsModalRef;
  
  secondmodalbody: string;

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

  isLoading$: boolean = false;
  
  config = {
    keyboard: false,
    ignoreBackdropClick: true
  }
 
  ngOnInit(){
    let category = localStorage.getItem('category');
    let name = localStorage.getItem('name')
    
    this.isLoading$ = true;
    this.itemService.getCurrentItemDetails(category,name,localStorage.getItem('email'),localStorage.getItem('password')).subscribe(
      result => {
        this.isLoading$ = false;
        this.itemSettings = result;
      },error => {
        this.isLoading$ = false;
        setTimeout(()=>{
          this.router.navigate(['items']);
        },2000);
        
        this.secondmodalbody = "Unable to fetch details. Please try again.";
        this.openSecondModal();
      }
    )
  }


  constructor(private itemService: ItemService,
    private router: Router,
    private route:  ActivatedRoute,
    private modalService: BsModalService,
    private userService: UserService) {
    }
  
  deleteItem(){
    this.modalRef3.hide();
    this.isLoading$ = true;
    this.itemService.postDeleteItem(this.itemSettings,localStorage.getItem('email'),localStorage.getItem('password')).subscribe(
      result => {
        this.isLoading$ = false;
        setTimeout(()=>{
          this.closeSecondModal();
          this.router.navigate(['items']).then(()=>{
            window.location.reload();
          });
        },2000);
        
        localStorage.removeItem('categoryid');
        localStorage.removeItem('category');
        localStorage.removeItem('nameid');
        localStorage.removeItem('name');
        this.secondmodalbody = "Deleted Item Successfully.";
        this.openSecondModal();
      },
      error => {
        this.isLoading$ = false;
        setTimeout(()=>{
          this.closeSecondModal();
          localStorage.removeItem('categoryid');
          localStorage.removeItem('category');
          localStorage.removeItem('nameid');
          localStorage.removeItem('name');
          this.router.navigate(['items']);
        },2000);
        this.secondmodalbody = "Deleting Item Failed. Please try again.";
        this.openSecondModal();
      }
    );
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

  closeThirdModal(){
    this.modalRef3.hide();
  }
  
  openThirdModal(){
    this.modalRef3 = this.modalService.show(this.template3);
  }
}
