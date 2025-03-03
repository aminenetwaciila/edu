import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { EnfantPedagogyComponent } from './enfant-pedagogy.component';
// import { SwiperModule } from 'swiper/angular';
// import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { FormsModule } from '@angular/forms';


@NgModule({
  providers: [
    PhotoViewer
  ],
  declarations: [
    EnfantPedagogyComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    // SwiperModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EnfantPedagogyModule { }
