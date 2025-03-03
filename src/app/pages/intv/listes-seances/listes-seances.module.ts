import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListesSeancesPageRoutingModule } from './listes-seances-routing.module';

import { ListesSeancesPage } from './listes-seances.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListesSeancesPageRoutingModule
  ],
  declarations: [ListesSeancesPage]
})
export class ListesSeancesPageModule {}
