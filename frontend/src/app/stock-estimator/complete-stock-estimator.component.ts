import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { ItemService } from '../services/item.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-complete-stock-estimator',
  templateUrl: './complete-stock-estimator.component.html',
  styleUrls: ['./stock-estimator.component.css'],
})
export class CompleteStockEstimatorComponent implements OnInit {
  todaydate: any = undefined;
  isLoading$: boolean = false;
  totalprice: number = 0;
  completeresult = [];
  dtoptions = {
    language: {
      search: '<b>Search</b>',
      info: '<b>Showing _START_ to _END_ of _TOTAL_ ITEMS</b>',
      lengthMenu: '<b>Show</b> _MENU_ <b>Items</b>',
      emptyTable: 'No Items Found',
    },
  };

  tabledata = [];

  constructor(
    private itemService: ItemService,
    private userService: UserService,
    private router: Router
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
      $('.estimatestock-table').DataTable(this.dtoptions);
    });

    $('.estimatestock-select').on('select2:unselecting', (e) => {
      let removedtext = e.params.args.data.text;
      this.tabledata = this.tabledata.filter((row) => {
        return row.text !== removedtext;
      });

      let removeditem = this.completeresult.find(
        (row) => row.text == removedtext
      );
      if (removeditem && removeditem.price) {
        let price = parseInt(removeditem.price);
        this.totalprice -= price;
      }

      $('.estimatestock-table').DataTable().destroy();
      $('.estimatestock-table').DataTable({
        ...this.dtoptions,
        data: this.tabledata.map((obj) => [
          obj.category,
          obj.text,
          obj.nextreqdate,
          obj.currentstockcount,
          obj.newstockcount,
          obj.price,
        ]),
      });
    });

    $('.estimatestock-select').on('select2:selecting', (e) => {
      let addedtext = e.params.args.data.text;
      let addeditem = this.completeresult.find((row) => row.text == addedtext);
      if (addeditem.price) {
        let price = parseInt(addeditem.price);
        this.totalprice += price;
      } else {
        addeditem.price = '---';
      }

      this.tabledata.push(addeditem);

      $('.estimatestock-table').DataTable().destroy();
      $('.estimatestock-table').DataTable({
        ...this.dtoptions,
        data: this.tabledata.map((obj) => [
          obj.category,
          obj.text,
          obj.nextreqdate,
          obj.currentstockcount,
          obj.newstockcount,
          obj.price,
        ]),
      });
    });
  }

  fetchCompleteStockItems(duration: number, dateduration: string) {
    this.isLoading$ = true;
    this.itemService
      .postGetCompleteEstimatedItems(duration, dateduration)
      .subscribe(
        (result) => {
          this.isLoading$ = false;
          this.completeresult = [];
          for (let i = 0; i < result.data['estimatedstock'].length; i++) {
            this.completeresult[i] = {};
            this.completeresult[i].id = result.data['estimatedstock'][i].id;
            this.completeresult[i].text = result.data['estimatedstock'][i].text;
            this.completeresult[i].category =
              result.data['estimatedstock'][i].category;
            this.completeresult[i].name = result.data['estimatedstock'][i].name;
            this.completeresult[i].nextreqdate =
              result.data['estimatedstock'][i].nextreqdate;
            this.completeresult[i].currentstockcount =
              result.data['estimatedstock'][i].currentstockcount;
            this.completeresult[i].newstockcount =
              result.data['estimatedstock'][i].newstockcount;
            this.completeresult[i].price =
              result.data['estimatedstock'][i].price;
          }
          let resultdata = undefined;

          if (duration) {
            resultdata = 'No items found';
          } else {
            resultdata = 'No items found';
          }

          var selectArr = [];
          for (var i = 0; i < result.data['estimatedstock'].length; i++) {
            selectArr[i] = {};
            selectArr[i].id = i;
            selectArr[i].text = result.data['estimatedstock'][i].text;
          }

          $('.estimatestock-select')
            .empty()
            .select2({
              data: selectArr,
              language: {
                noResults: function () {
                  return resultdata;
                },
              },
            });

          let indexarr = [];
          this.tabledata = [];
          this.totalprice = 0;

          for (let i = 0; i < result.data['estimatedstock'].length; i++) {
            indexarr[i] = result.data['estimatedstock'][i].id;
            this.tabledata[i] = result.data['estimatedstock'][i];
            if (!this.tabledata[i].price) {
              this.tabledata[i].price = '---';
            } else {
              this.totalprice =
                this.totalprice + parseInt(this.tabledata[i].price);
            }
          }

          $('.estimatestock-select').val(indexarr).change();

          $('.estimatestock-table').DataTable().destroy();
          $('.estimatestock-table').DataTable({
            ...this.dtoptions,
            data: this.tabledata.map((obj) => [
              obj.category,
              obj.text,
              obj.nextreqdate,
              obj.currentstockcount,
              obj.newstockcount,
              obj.price,
            ]),
          });
        },
        (error) => {
          this.isLoading$ = false;
          window.location.reload();
        }
      );
  }
}
