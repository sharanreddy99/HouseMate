import { Component, OnInit } from '@angular/core';
import { ItemService } from '../services/item.service';
import { SubloadingService } from '../features/subloading.service';
declare var $: any;

@Component({
  selector: 'app-stock-estimator',
  templateUrl: './stock-estimator.component.html',
  styleUrls: ['./stock-estimator.component.css'],
})
export class StockEstimatorComponent implements OnInit {
  todaydate: any = undefined;

  constructor(
    private itemService: ItemService,
    private subloadingService: SubloadingService
  ) {}

  ngOnInit(): void {
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

    $(document).ready(() => {
      $('.estimatestock-select').select2();
    });
  }

  fetchStockItems(duration: number, dateduration: string) {
    this.subloadingService.updateLoadingStockEstimator('true');
    this.itemService.postGetEstimatedItems(duration, dateduration).subscribe(
      (result) => {
        this.subloadingService.updateLoadingStockEstimator('false');
        let resultdata = undefined;

        if (duration) {
          resultdata = 'You have enough stock for ' + duration + ' days.';
        } else {
          resultdata = 'You have enough stock till ' + dateduration + '.';
        }

        $('.estimatestock-select')
          .empty()
          .select2({
            data: result.data['estimatedstock'],
            language: {
              noResults: function () {
                return resultdata;
              },
            },
          });

        let indexarr = [];
        for (let i = 0; i < result.data['estimatedstock'].length; i++) {
          indexarr[i] = result.data['estimatedstock'][i].id;
        }

        $('.estimatestock-select').val(indexarr).change();
      },
      (error) => {
        this.subloadingService.updateLoadingStockEstimator('false');
      }
    );
  }
}
