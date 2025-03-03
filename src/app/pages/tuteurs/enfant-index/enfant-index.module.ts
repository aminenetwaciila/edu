import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { EnfantIndexPageRoutingModule } from './enfant-index-routing.module';
import { EnfantIndexPage } from './enfant-index.page';
import { TranslateModule } from '@ngx-translate/core';
import { EnfantService } from '../Services/enfant.service';
import { FormsModule } from '@angular/forms';
import { EnfantDashboardModule } from '../enfant-dashboard/enfant-dashboard.module';
import { EnfantPlanningModule } from '../enfant-planning/enfant-planning.module';
import { EnfantPedagogyModule } from '../enfant-pedagogy/enfant-pedagogy.module';
import { EnfantAbsenceModule } from '../enfant-absence/enfant-absence.module';
import { EnfantRouterService } from '../Services/enfant-router.service';
import { ChatModule } from '../chat/chat.module';
import { EnfantEncadrantsModule } from '../enfant-encadrants/enfant-encadrants.module';
import { EnfantInfosComponent } from '../enfant-infos/enfant-infos.component';
import { EnfantIncidentsModule } from '../enfant-incidents/enfant-incidents.module';
import { EnfantNotesComponent } from '../enfant-notes/enfant-notes.component';



@NgModule({
  imports: [
    CommonModule,
    IonicModule, 
    EnfantIndexPageRoutingModule,
    TranslateModule,
    FormsModule,
    EnfantDashboardModule,
    EnfantPlanningModule,
    EnfantPedagogyModule,
    EnfantAbsenceModule,
    EnfantEncadrantsModule,
    EnfantIncidentsModule,
    ChatModule
  ],
  declarations: [
    EnfantIndexPage,
    EnfantInfosComponent,
    EnfantNotesComponent,
  ],
  exports:[
    EnfantIndexPageRoutingModule
  ],
  providers: [
    EnfantRouterService
  ]
})
export class EnfantIndexPageModule {
}
