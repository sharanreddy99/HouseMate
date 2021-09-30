import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { ItemService } from '../services/item.service';
import { SubloadingService } from '../features/subloading.service';

declare var $: any;

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
})
export class SummaryComponent implements OnInit {
  colors = undefined;

  categoryOptions = [{ id: 0, text: 'All Items' }];

  view: any[] = [];

  legendTitle = 'Item Categories';
  legendPosition = 'right';

  showGridLines = true;

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = false;
  xAxisLabel = 'Items List';
  showYAxisLabel = true;
  yAxisLabel = 'Stock Count For All Items';
  timeline = false;

  colorScheme = { domain: [] };

  multi: any = [];

  constructor(
    private itemService: ItemService,
    private subloadingService: SubloadingService
  ) {}

  ngOnInit() {
    $(document).ready(() => {
      $('.helloworld').scroll(() => {
        $('.hiddenbutton').click();
      });
    });

    $('.category-select').select2({
      data: this.categoryOptions,
    });

    this.subloadingService.updateLoadingSummary('true');
    this.itemService
      .postGetAllItems(
        localStorage.getItem('email'),
        localStorage.getItem('password')
      )
      .subscribe(
        (result) => {
          this.subloadingService.updateLoadingSummary('false');
          this.categoryOptions = [{ id: 0, text: 'ALl Items' }];
          this.categoryOptions = this.categoryOptions.concat(
            result['selectdata']
          );
          $('.category-select').select2({
            data: this.categoryOptions,
          });
          this.getAllItems();
        },
        (err) => {}
      );
  }

  random_rgba() {
    return 'hsla(' + Math.random() * 360 + ', 100%, 50%, 1)';
  }

  getAllItems() {
    this.subloadingService.updateLoadingSummary('true');
    this.itemService
      .postGetAllItems(
        localStorage.getItem('email'),
        localStorage.getItem('password')
      )
      .subscribe(
        (result) => {
          this.subloadingService.updateLoadingSummary('false');
          this.categoryOptions = [{ id: 0, text: 'All Items' }];
          this.categoryOptions = this.categoryOptions.concat(
            result['selectdata']
          );
          $('.category-select').select2({
            data: this.categoryOptions,
          });

          if (!this.colors) {
            this.colors = {};
            for (var i = 1; i < this.categoryOptions.length; i++) {
              this.colors[this.categoryOptions[i].text] = this.random_rgba();
            }
          }

          result['estimatedstock'].sort((a, b) =>
            a.category.localeCompare(b.category)
          );

          this.multi = [];
          this.colorScheme = { domain: [] };

          for (let i = 0; i < result['estimatedstock'].length; i++) {
            this.multi[i] = {};
            this.multi[i]['name'] = result['estimatedstock'][i].name;
            this.multi[i]['value'] = parseInt(
              '' + result['estimatedstock'][i].stockcount
            );
            this.multi[i]['extra'] = {};
            this.multi[i]['extra']['category'] =
              result['estimatedstock'][i].category;
            this.multi[i]['extra']['nextreqdate'] =
              result['estimatedstock'][i].nextreqdate;
            this.colorScheme.domain.push(
              this.colors[result['estimatedstock'][i].category]
            );
          }

          this.view = [60 * result['estimatedstock'].length, 500];
          if (this.view[0] < 200) {
            this.view[0] = 200;
          }
          this.yAxisLabel = 'Stock Count for All Items';
        },
        (err) => {}
      );
  }
}
