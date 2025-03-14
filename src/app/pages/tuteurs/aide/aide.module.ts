import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AidePageRoutingModule } from './aide-routing.module';

import { AidePage } from './aide.page';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AidePageRoutingModule,
    TranslateModule
  ],
  declarations: [AidePage]
})
export class AidePageModule {}
