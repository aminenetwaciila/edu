import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MesmatieresPageRoutingModule } from './mesmatieres-routing.module';

import { MesmatieresPage } from './mesmatieres.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MesmatieresPageRoutingModule
  ],
  declarations: [MesmatieresPage]
})
export class MesmatieresPageModule {}
