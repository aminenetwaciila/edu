import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { EnfantPedagogyComponent } from './enfant-pedagogy.component';
import { SwiperModule } from 'swiper/angular';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { FormsModule } from '@angular/forms';


@NgModule({
  providers:[
    PhotoViewer
  ],
  declarations: [
    EnfantPedagogyComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    SwiperModule
  ]
})
export class EnfantPedagogyModule { }
