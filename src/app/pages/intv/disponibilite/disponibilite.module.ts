import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DisponibilitePageRoutingModule } from './disponibilite-routing.module';

import { DisponibilitePage } from './disponibilite.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DisponibilitePageRoutingModule
  ],
  declarations: [DisponibilitePage]
})
export class DisponibilitePageModule {}
