import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { EnfantEncadrantsComponent } from './enfant-encadrants.component';



@NgModule({
  declarations: [EnfantEncadrantsComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule
  ]
})
export class EnfantEncadrantsModule { }
