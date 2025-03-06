import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MoncursusPageRoutingModule } from './moncursus-routing.module';

import { MoncursusPage } from './moncursus.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MoncursusPageRoutingModule
  ],
  declarations: [MoncursusPage]
})
export class MoncursusPageModule {}
