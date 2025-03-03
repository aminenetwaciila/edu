import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MesresultatsPageRoutingModule } from './mesresultats-routing.module';

import { MesresultatsPage } from './mesresultats.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MesresultatsPageRoutingModule
  ],
  declarations: [MesresultatsPage]
})
export class MesresultatsPageModule {}
