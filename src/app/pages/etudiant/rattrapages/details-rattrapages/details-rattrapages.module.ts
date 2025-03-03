import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsRattrapagesPageRoutingModule } from './details-rattrapages-routing.module';

import { DetailsRattrapagesPage } from './details-rattrapages.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsRattrapagesPageRoutingModule
  ],
  declarations: [DetailsRattrapagesPage]
})
export class DetailsRattrapagesPageModule {}
