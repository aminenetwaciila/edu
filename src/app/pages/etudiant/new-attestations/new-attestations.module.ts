import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NewAttestationsPageRoutingModule } from './new-attestations-routing.module';

import { NewAttestationsPage } from './new-attestations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NewAttestationsPageRoutingModule
  ],
  declarations: [NewAttestationsPage]
})
export class NewAttestationsPageModule {}
