import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AjoutEnfantPageRoutingModule } from './ajout-enfant-routing.module';

import { AjoutEnfantPage } from './ajout-enfant.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AjoutEnfantPageRoutingModule,
    TranslateModule,
    FormsModule
  ],
  declarations: [AjoutEnfantPage]
})
export class AjoutEnfantPageModule {}
