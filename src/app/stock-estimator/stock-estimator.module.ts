import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompleteStockEstimatorComponent } from './complete-stock-estimator.component';
import { StockEstimatorComponent } from './stock-estimator.component';
import { NavbarModule } from '../navbar/navbar.module';
import { FormsModule } from '@angular/forms';
import { FeaturesModule } from '../features/features.module';

@NgModule({
  declarations: [CompleteStockEstimatorComponent,StockEstimatorComponent],
  imports: [
    CommonModule,
    NavbarModule,
    FormsModule,
    FeaturesModule
  ],
  exports: [
    StockEstimatorComponent,
    CompleteStockEstimatorComponent
  ]
})
export class StockEstimatorModule { }
