import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomAlertPageRoutingModule } from './custom-alert-routing.module';

import { CustomAlertPage } from './custom-alert.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomAlertPageRoutingModule
  ],
  declarations: [CustomAlertPage]
})
export class CustomAlertPageModule {}
