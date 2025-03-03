import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { EnfantService } from '../Services/enfant.service';
import { MesenfantsPageModule } from '../mesenfants/mesenfants.module';
import { TranslateModule } from '@ngx-translate/core';
import { TuteurApiService } from 'src/app/pages/tuteurs/Services/tuteur-api.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TabsPageRoutingModule,
    MesenfantsPageModule,
    TranslateModule
  ],
  declarations: [TabsPage],
  providers: [
    EnfantService,
    TuteurApiService
  ]
})
export class TabsPageModule {}
