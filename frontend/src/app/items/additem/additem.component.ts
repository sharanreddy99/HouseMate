import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ItemSettings } from '../itemsettings';
import { ItemService } from 'src/app/services/item.service';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-additem',
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.css'],
})
export class AdditemComponent implements OnInit {
  @ViewChild('template2') template: TemplateRef<any>;
  secondmodalbody: string;
  modalRef2: BsModalRef;
  todaydate: any = undefined;

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

  isUnitsValid: boolean;
  isNotifyValid: boolean;
  isUtilTimeValid: boolean;
  isUtilUnitsValid: boolean;
  isDateValid: boolean;
  isLoading$: boolean = false;

  config = {
    keyboard: false,
    ignoreBackdropClick: true,
  };

  constructor(
    private itemService: ItemService,
    private router: Router,
    private modalService: BsModalService
  ) {}

  ngOnInit() {
    this.todaydate = new Date();
    var dd: any = this.todaydate.getDate();

    var mm: any = this.todaydate.getMonth() + 1;
    var yyyy = this.todaydate.getFullYear();
    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }
    this.todaydate = yyyy + '-' + mm + '-' + dd;
    this.itemSettings.category = localStorage.getItem('category');
  }

  addItem() {
    this.itemSettings.category = this.itemSettings.category.trim();
    this.itemSettings.name = this.itemSettings.name.trim();

    if (this.itemSettings.units === 'choose') {
      this.isUnitsValid = false;
    } else {
      this.isUnitsValid = true;
    }

    if (
      !(
        parseFloat('' + this.itemSettings.quantity) &&
        parseFloat('' + this.itemSettings.quantity) > 0
      )
    ) {
      setTimeout(() => {
        this.closeSecondModal();
      }, 2500);
      this.itemSettings.quantity = undefined;
      this.secondmodalbody = 'Provide a valid stock quantity.';
      this.openSecondModal();
      return;
    }

    if (this.itemSettings.notify === 'choose') {
      this.isNotifyValid = false;
      this.isUtilTimeValid = false;
      this.isUtilUnitsValid = false;
      this.isDateValid = false;
    } else if (this.itemSettings.notify === 'request') {
      this.isNotifyValid = true;
      this.isUtilTimeValid = true;
      this.isUtilUnitsValid = true;

      if (this.itemSettings.nextreqdate) {
        this.isDateValid = true;
      } else {
        this.isDateValid = false;
      }
    } else {
      this.isNotifyValid = true;
      this.isDateValid = true;

      if (this.itemSettings.utilizationTime >= 0) {
        this.isUtilTimeValid = true;
      } else {
        this.isUtilTimeValid = false;
      }

      if (
        !(
          parseFloat('' + this.itemSettings.utilizationQuantity) &&
          parseFloat('' + this.itemSettings.utilizationQuantity) > 0
        )
      ) {
        setTimeout(() => {
          this.closeSecondModal();
        }, 2500);
        this.itemSettings.utilizationQuantity = undefined;
        this.secondmodalbody = 'Provide a valid Utilization quantity.';
        this.openSecondModal();
        return;
      }

      if (this.itemSettings.utilizationUnits === 'choose') {
        this.isUtilUnitsValid = false;
      } else {
        this.isUtilUnitsValid = true;
      }

      if (
        (this.itemSettings.units == 'kg' || this.itemSettings.units == 'gms') &&
        (this.itemSettings.utilizationUnits == 'kg' ||
          this.itemSettings.utilizationUnits == 'gms')
      ) {
        this.isUnitsValid = true;
        this.isUtilUnitsValid = true;
      } else if (
        (this.itemSettings.units == 'lit' || this.itemSettings.units == 'ml') &&
        (this.itemSettings.utilizationUnits == 'lit' ||
          this.itemSettings.utilizationUnits == 'ml')
      ) {
        this.isUnitsValid = true;
        this.isUtilUnitsValid = true;
      } else if (
        this.itemSettings.units == 'dozen' &&
        this.itemSettings.utilizationUnits == 'dozen'
      ) {
        this.isUnitsValid = true;
        this.isUtilUnitsValid = true;
      } else if (
        this.itemSettings.units == 'units' &&
        this.itemSettings.utilizationUnits == 'units'
      ) {
        this.isUnitsValid = true;
        this.isUtilUnitsValid = true;
      } else {
        this.isUnitsValid = false;
        this.isUtilUnitsValid = false;
      }
    }

    if (
      this.isUnitsValid &&
      this.isNotifyValid &&
      this.isUtilTimeValid &&
      this.isUtilUnitsValid &&
      this.isDateValid
    ) {
      this.itemSettings.category = this.itemSettings.category.toUpperCase();
      this.itemSettings.name = this.itemSettings.name.toUpperCase();

      if (this.itemSettings.notify === 'request')
        delete this.itemSettings.utilizationUnits;

      this.isLoading$ = true;
      this.itemService
        .postAddItem(
          this.itemSettings,
          localStorage.getItem('isDisabled') == 'true'
        )
        .subscribe(
          (res) => {
            this.isLoading$ = false;
            setTimeout(() => {
              location.reload();
            }, 2000);

            this.secondmodalbody = 'Added Item Successfully.';
            this.openSecondModal();
          },
          (err) => {
            this.isLoading$ = false;
            setTimeout(() => {
              this.closeSecondModal();
            }, 2000);

            localStorage.removeItem('category');
            localStorage.removeItem('name');
            this.secondmodalbody = err.error.error;
            this.openSecondModal();
          }
        );
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
