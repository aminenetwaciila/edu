import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CustomListPageRoutingModule } from './custom-list-routing.module';

import { CustomListPage } from './custom-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CustomListPageRoutingModule
  ],
  declarations: [CustomListPage]
})
export class CustomListPageModule {}
