import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnfantAbsenceComponent } from './enfant-absence.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';



@NgModule({
  declarations: [EnfantAbsenceComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    TranslateModule,
    
  ]
})
export class EnfantAbsenceModule { }
