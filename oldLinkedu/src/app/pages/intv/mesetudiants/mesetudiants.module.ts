import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MesetudiantsPageRoutingModule } from './mesetudiants-routing.module';

import { MesetudiantsPage } from './mesetudiants.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MesetudiantsPageRoutingModule
  ],
  declarations: [MesetudiantsPage]
})
export class MesetudiantsPageModule {}
