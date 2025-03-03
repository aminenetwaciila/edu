import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlandechargePageRoutingModule } from './plandecharge-routing.module';

import { PlandechargePage } from './plandecharge.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlandechargePageRoutingModule
  ],
  declarations: [PlandechargePage]
})
export class PlandechargePageModule {}
