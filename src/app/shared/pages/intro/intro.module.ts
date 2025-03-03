import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IntroPageRoutingModule } from './intro-routing.module';

import { IntroPage } from './intro.page';
import { TranslateModule } from '@ngx-translate/core';
// import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    IonicModule,
    IntroPageRoutingModule,
    // SwiperModule
  ],
  declarations: [IntroPage],
  schemas: [NO_ERRORS_SCHEMA]
})
export class IntroPageModule { }
