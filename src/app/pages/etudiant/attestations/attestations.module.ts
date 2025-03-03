import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AttestationsPageRoutingModule } from './attestations-routing.module';

import { AttestationsPage } from './attestations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AttestationsPageRoutingModule
  ],
  declarations: [AttestationsPage]
})
export class AttestationsPageModule {}
