import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MesenfantsPageRoutingModule } from './mesenfants-routing.module';

import { MesenfantsPage } from './mesenfants.page';
import { TranslateModule } from '@ngx-translate/core';
import { EnfantIndexPageModule } from '../enfant-index/enfant-index.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MesenfantsPageRoutingModule,
    TranslateModule,
    EnfantIndexPageModule
  ],
  exports: [
    MesenfantsPageRoutingModule
  ],
  declarations: [MesenfantsPage],
  providers: []
})
export class MesenfantsPageModule { }
