import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsRevisionsPageRoutingModule } from './details-revisions-routing.module';

import { DetailsRevisionsPage } from './details-revisions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsRevisionsPageRoutingModule
  ],
  declarations: [DetailsRevisionsPage]
})
export class DetailsRevisionsPageModule {}
