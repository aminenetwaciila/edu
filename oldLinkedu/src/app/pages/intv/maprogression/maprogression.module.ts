import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MaprogressionPageRoutingModule } from './maprogression-routing.module';

import { MaprogressionPage } from './maprogression.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MaprogressionPageRoutingModule
  ],
  declarations: [MaprogressionPage]
})
export class MaprogressionPageModule {}
