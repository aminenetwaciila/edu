import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AssiduitePageRoutingModule } from './assiduite-routing.module';

import { AssiduitePage } from './assiduite.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AssiduitePageRoutingModule
  ],
  declarations: [AssiduitePage]
})
export class AssiduitePageModule {}
