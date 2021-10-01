import { Component, OnInit } from '@angular/core';
import { ItemService } from '../services/item.service';
import { Router } from '@angular/router';
import { ItemSettings } from './itemsettings';
import { SubloadingService } from '../features/subloading.service';
declare var $: any;

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
})
export class ItemsComponent implements OnInit {
  itemAvailable: boolean = false;

  categoryOptions = [{ id: 0, text: 'Select a Category' }];

  itemOptions = [{ id: 0, text: 'Select an Item' }];

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

  constructor(
    private router: Router,
    private itemService: ItemService,
    private subloadingService: SubloadingService
  ) {}

  ngOnInit(): void {
    this.itemAvailable = false;

    $('.category-select').select2({
      data: this.categoryOptions,
    });

    $('.item-select').select2({
      data: this.itemOptions,
    });

    $(document).ready(() => {
      this.subloadingService.updateLoadingItems('true');

      this.itemService.postGetCategory().subscribe(
        (result) => {
          this.subloadingService.updateLoadingItems('false');

          this.itemAvailable = false;

          this.categoryOptions = [{ id: 0, text: 'Select a Category' }];
          this.categoryOptions = this.categoryOptions.concat(result.data);

          $('.category-select').select2({
            data: this.categoryOptions,
          });

          let id = localStorage.getItem('categoryid');
          if (id && parseInt(id) < this.categoryOptions.length) {
            $('.category-select')
              .val(id)
              .trigger('change')
              .trigger({ type: 'select2:selecting' });
          }
        },
        (error) => {
          this.subloadingService.updateLoadingItems('false');
        }
      );
    });

    $('.category-select').on('select2:selecting', (e) => {
      if (e && e.params && e.params.args && e.params.args.data) {
        localStorage.setItem('categoryid', e.params.args.data.id);
        localStorage.setItem('category', e.params.args.data.text);
      }

      this.subloadingService.updateLoadingItems('true');
      this.itemService.postGetItems(localStorage.getItem('category')).subscribe(
        (result) => {
          this.subloadingService.updateLoadingItems('false');
          this.itemAvailable = false;
          this.itemOptions = [{ id: 0, text: 'Select an Item' }];
          this.itemOptions = this.itemOptions.concat(result.data);

          $('.item-select').empty();
          $('.item-select').select2({
            data: this.itemOptions,
          });

          let id = localStorage.getItem('nameid');
          if (id && parseInt(id) < this.itemOptions.length) {
            $('.item-select')
              .val(id)
              .trigger('change')
              .trigger({ type: 'select2:selecting' });
            this.itemAvailable = true;
          }
        },
        (error) => {
          this.subloadingService.updateLoadingItems('false');
        }
      );
    });

    $('.item-select').on('select2:selecting', (e) => {
      if (e && e.params && e.params.args && e.params.args.data) {
        localStorage.setItem('nameid', e.params.args.data.id);
        localStorage.setItem('name', e.params.args.data.text);
      }
      this.itemAvailable = true;

      let category = localStorage.getItem('category');
      let name = localStorage.getItem('name');

      this.subloadingService.updateLoadingItems('true');
      this.itemService.getCurrentItemDetails(category, name).subscribe(
        (result) => {
          this.subloadingService.updateLoadingItems('false');
          this.itemSettings = result.data;
        },
        (error) => {
          this.subloadingService.updateLoadingItems('false');
        }
      );
    });
  }

  openEditItem() {
    let category = $('.category-select').select2('data')[0].text;
    let name = $('.item-select').select2('data')[0].text;
    let categoryid = $('.category-select').select2('data')[0].id;
    let nameid = $('.item-select').select2('data')[0].id;

    localStorage.setItem('category', category);
    localStorage.setItem('name', name);

    localStorage.setItem('categoryid', categoryid);
    localStorage.setItem('nameid', nameid);

    this.router.navigate(['items', 'edititem']);
  }
}
