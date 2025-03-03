import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MonComptePageRoutingModule } from './mon-compte-routing.module';

import { MonComptePage } from './mon-compte.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MonComptePageRoutingModule,
    TranslateModule
  ],
  declarations: [MonComptePage]
})
export class MonComptePageModule {}
