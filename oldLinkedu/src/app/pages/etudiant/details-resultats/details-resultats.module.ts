import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsResultatsPageRoutingModule } from './details-resultats-routing.module';

import { DetailsResultatsPage } from './details-resultats.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsResultatsPageRoutingModule
  ],
  declarations: [DetailsResultatsPage]
})
export class DetailsResultatsPageModule {}
