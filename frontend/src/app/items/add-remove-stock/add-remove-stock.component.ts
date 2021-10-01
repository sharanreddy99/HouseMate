import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  KeyValueDiffers,
} from '@angular/core';
import { ItemSettings } from '../itemsettings';
import { ItemService } from 'src/app/services/item.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-remove-stock',
  templateUrl: './add-remove-stock.component.html',
  styleUrls: ['./add-remove-stock.component.css'],
})
export class AddRemoveStockComponent implements OnInit {
  @ViewChild('template2') template: TemplateRef<any>;
  secondmodalbody: string;
  modalRef2: BsModalRef;
  isLoading$: boolean = false;

  itemSettings: ItemSettings = {
    category: undefined,
    name: undefined,
    quantity: undefined,
    units: 'choose',
    stockcount: undefined,
    price: undefined,
    notify: 'choose',
    utilizationTime: undefined,
    utilizationQuantity: undefined,
    utilizationUnits: 'choose',
    description: undefined,
    nextreqdate: undefined,
    totalstock: {
      amount: undefined,
      units: undefined,
      daysleft: undefined,
    },
  };

  newstockcount = undefined;
  newquantity = undefined;
  newunits = 'choose';

  config = {
    keyboard: false,
    ignoreBackdropClick: true,
  };

  ngOnInit() {
    let category = localStorage.getItem('category');
    let name = localStorage.getItem('name');

    this.isLoading$ = true;
    this.itemService.getCurrentItemDetails(category, name).subscribe(
      (result) => {
        this.isLoading$ = false;
        this.itemSettings = result.data;
      },
      (error) => {
        this.isLoading$ = false;
        setTimeout(() => {
          this.router.navigate(['items']);
        }, 2000);

        this.secondmodalbody = 'Unable to fetch details. Please try again.';
        this.openSecondModal();
      }
    );
  }

  constructor(
    private itemService: ItemService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private userService: UserService
  ) {}

  addStock() {
    if (this.newstockcount > 0) {
      this.isLoading$ = true;
      this.itemService
        .postRefillItem(
          this.itemSettings,
          this.newstockcount,
          undefined,
          undefined
        )
        .subscribe(
          (result) => {
            this.isLoading$ = false;
            setTimeout(() => {
              this.closeSecondModal();
              this.router.navigate(['items', 'edititem']).then(() => {
                window.location.reload();
              });
            }, 2000);

            this.secondmodalbody = 'Added Stock Successfully.';
            this.openSecondModal();
          },
          (err) => {
            this.isLoading$ = false;
            setTimeout(() => {
              this.closeSecondModal();
              window.location.reload();
            }, 2000);

            this.secondmodalbody = err.error.error;
            this.openSecondModal();
          }
        );
    } else {
      setTimeout(() => {
        this.closeSecondModal();
      }, 2000);

      this.secondmodalbody = 'Stockcount should be positive.';
      this.openSecondModal();
    }
  }

  removeStock() {
    if (this.newstockcount > 0) {
      this.isLoading$ = true;
      this.itemService
        .postRemoveItem(
          this.itemSettings,
          this.newstockcount,
          undefined,
          undefined
        )
        .subscribe(
          (result) => {
            this.isLoading$ = false;
            setTimeout(() => {
              this.closeSecondModal();
              this.router.navigate(['items', 'edititem']).then(() => {
                window.location.reload();
              });
            }, 2000);

            this.secondmodalbody = 'Removed Stock Successfully.';
            this.openSecondModal();
          },
          (err) => {
            this.isLoading$ = false;
            setTimeout(() => {
              window.location.reload();
            }, 2000);

            this.secondmodalbody = err.error.error;
            this.openSecondModal();
          }
        );
    } else {
      setTimeout(() => {
        this.closeSecondModal();
      }, 2000);

      this.secondmodalbody = 'Stockcount should be positive.';
      this.openSecondModal();
    }
  }

  addQuantity() {
    if (this.newquantity > 0 && this.newunits !== 'choose') {
      this.isLoading$ = true;
      this.itemService
        .postRefillItem(
          this.itemSettings,
          undefined,
          this.newquantity,
          this.newunits
        )
        .subscribe(
          (result) => {
            this.isLoading$ = false;
            setTimeout(() => {
              this.closeSecondModal();
              this.router.navigate(['items', 'edititem']).then(() => {
                window.location.reload();
              });
            }, 2000);

            this.secondmodalbody = 'Added Quantity Successfully';
            this.openSecondModal();
          },
          (err) => {
            this.isLoading$ = false;
            setTimeout(() => {
              window.location.reload();
            }, 2000);

            this.secondmodalbody = err.error.error;
            this.openSecondModal();
          }
        );
    } else {
      setTimeout(() => {
        this.closeSecondModal();
      }, 2000);

      this.secondmodalbody =
        'Please make sure you have mentioned the right quantity.';
      this.openSecondModal();
    }
  }

  removeQuantity() {
    if (this.newquantity > 0 && this.newunits !== 'choose') {
      this.isLoading$ = true;
      this.itemService
        .postRemoveItem(
          this.itemSettings,
          undefined,
          this.newquantity,
          this.newunits
        )
        .subscribe(
          (result) => {
            this.isLoading$ = false;
            setTimeout(() => {
              this.closeSecondModal();
              this.router.navigate(['items', 'edititem']).then(() => {
                window.location.reload();
              });
            }, 2000);

            this.secondmodalbody = 'Removed Quantity Successfully.';
            this.openSecondModal();
          },
          (err) => {
            this.isLoading$ = false;
            setTimeout(() => {
              this.closeSecondModal();
            }, 2000);

            this.secondmodalbody = err.error.error;
            this.openSecondModal();
          }
        );
    } else {
      setTimeout(() => {
        this.closeSecondModal();
      }, 2000);

      this.secondmodalbody =
        'Please make sure you have mentioned the right quantity.';
      this.openSecondModal();
    }
  }

  onCancel() {
    this.router.navigate(['items']);
  }

  openSecondModal() {
    this.modalRef2 = this.modalService.show(this.template);
  }

  closeSecondModal() {
    this.modalRef2.hide();
  }
}
