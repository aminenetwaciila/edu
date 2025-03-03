import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EnfantIncidentsRoutingModule } from './enfant-incidents-routing.module';
import { EnfantIncidentsComponent } from './enfant-incidents.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
// import { SwiperModule } from 'swiper/angular';
// import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';


@NgModule({
  providers: [
    PhotoViewer
  ],
  declarations: [EnfantIncidentsComponent],
  imports: [
    IonicModule,
    CommonModule,
    EnfantIncidentsRoutingModule,
    FormsModule,
    // SwiperModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EnfantIncidentsModule { }
