import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ActualitesPageRoutingModule } from './actualites-routing.module';

import { ActualitesPage } from './actualites.page';
import { TranslateModule } from '@ngx-translate/core';
// import { SwiperModule } from 'swiper/angular';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { PostPageComponent } from './components/post-page/post-page.component';

@NgModule({
  providers: [
    PhotoViewer
  ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ActualitesPageRoutingModule,
    TranslateModule,
    // SwiperModule,
  ],
  declarations: [ActualitesPage, PostPageComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ActualitesPageModule { }
