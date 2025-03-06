import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { EnfantDashboardComponent } from './enfant-dashboard.component';
import { TranslateModule } from '@ngx-translate/core';
import { ParcoursScolaireComponent } from './components/parcours-scolaire/parcours-scolaire.component';
import { StatsComponent } from './components/stats/stats.component';
import { FormsModule } from '@angular/forms';
import { RemarquesComponent } from './components/remarques/remarques.component';
import { PlanningUniversitaireComponent } from './components/planning-universitaire/planning-universitaire.component';



@NgModule({
  declarations: [ EnfantDashboardComponent, ParcoursScolaireComponent, StatsComponent, RemarquesComponent, PlanningUniversitaireComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    TranslateModule
  ]
})
export class EnfantDashboardModule { }
