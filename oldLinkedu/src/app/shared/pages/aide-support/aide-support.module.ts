import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AideSupportComponent } from './aide-support.component';
import { TranslateModule } from '@ngx-translate/core';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';


@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, TranslateModule ],
  declarations: [AideSupportComponent],
  exports: [AideSupportComponent],
  providers: [
    CallNumber,
    Clipboard,
  ]
})
export class AideSupportComponentModule {}
