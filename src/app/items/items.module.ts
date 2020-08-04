import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ModalModule } from 'ngx-bootstrap/modal';

import { ItemsComponent } from './items.component';
import { CompleteItemsComponent } from './complete-items.component';
import { NavbarModule } from '../navbar/navbar.module';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AdditemComponent } from './additem/additem.component';
import { EdititemComponent } from './edititem/edititem.component';
import { DeleteitemComponent } from './deleteitem/deleteitem.component';
import { ItemRoutingModule } from './item-routing.module';
import { AddRemoveStockComponent } from './add-remove-stock/add-remove-stock.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FeaturesModule } from '../features/features.module';

@NgModule({
  declarations: [ItemsComponent, CompleteItemsComponent, AdditemComponent, EdititemComponent, DeleteitemComponent, AddRemoveStockComponent],
  imports: [
    CommonModule,
    FormsModule,
    NavbarModule,
    CarouselModule.forRoot(),
    ModalModule.forRoot(),
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ItemRoutingModule,
    MatSlideToggleModule,
    FeaturesModule
  ],
  exports: [
    ItemsComponent,
    CompleteItemsComponent
  ]
})
export class ItemsModule {
 }
