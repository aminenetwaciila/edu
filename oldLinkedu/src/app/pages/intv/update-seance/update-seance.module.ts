import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UpdateSeancePageRoutingModule } from './update-seance-routing.module';

import { UpdateSeancePage } from './update-seance.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    UpdateSeancePageRoutingModule
  ],
  declarations: [UpdateSeancePage]
})
export class UpdateSeancePageModule {}
