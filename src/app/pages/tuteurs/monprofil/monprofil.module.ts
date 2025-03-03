import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MonprofilPageRoutingModule } from './monprofil-routing.module';

import { MonprofilPage } from './monprofil.page';
import { TranslateModule } from '@ngx-translate/core';
import { SupportContainerComponent } from '../support-container/support-container.component';
import { AideSupportComponentModule } from 'src/app/shared/pages/aide-support/aide-support.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MonprofilPageRoutingModule,
    TranslateModule,
    AideSupportComponentModule
  ],
  declarations: [
    MonprofilPage,
    SupportContainerComponent
  ],
  exports:[
    SupportContainerComponent
  ]
})
export class MonprofilPageModule {}
