import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutComponent } from './about.component';
import { CompleteAboutComponent } from './complete-about.component';
import { NavbarModule } from '../navbar/navbar.module';
import { FeaturesModule } from '../features/features.module';

@NgModule({
  declarations: [AboutComponent, CompleteAboutComponent],
  imports: [
    CommonModule,
    NavbarModule,
    FeaturesModule
  ],
  exports: [
    AboutComponent,
    CompleteAboutComponent
  ]
})
export class AboutModule { }
