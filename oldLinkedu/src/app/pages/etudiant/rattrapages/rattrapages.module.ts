import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RattrapagesPageRoutingModule } from './rattrapages-routing.module';

import { RattrapagesPage } from './rattrapages.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RattrapagesPageRoutingModule
  ],
  declarations: [RattrapagesPage]
})
export class RattrapagesPageModule { }
