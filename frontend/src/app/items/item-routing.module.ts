import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EdititemComponent } from './edititem/edititem.component';
import { AdditemComponent } from './additem/additem.component';
import { DeleteitemComponent } from './deleteitem/deleteitem.component';
import { AddRemoveStockComponent } from './add-remove-stock/add-remove-stock.component';

const routes: Routes = [
  {
    path: 'items/additem',
    component: AdditemComponent
  },
  {
    path: 'items/edititem',
    component: EdititemComponent
  },
  {
    path: 'items/deleteitem',
    component: DeleteitemComponent
  },
  {
    path: 'items/addremovestock',
    component: AddRemoveStockComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemRoutingModule { }