import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RevisionsPageRoutingModule } from './revisions-routing.module';

import { RevisionsPage } from './revisions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RevisionsPageRoutingModule
  ],
  declarations: [RevisionsPage]
})
export class RevisionsPageModule {}
