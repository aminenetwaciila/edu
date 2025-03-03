import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from '../chat/chat.component';
import { EnfantAbsenceComponent } from '../enfant-absence/enfant-absence.component';
import { EnfantDashboardComponent } from '../enfant-dashboard/enfant-dashboard.component';
import { EnfantEncadrantsComponent } from '../enfant-encadrants/enfant-encadrants.component';
import { EnfantIncidentsComponent } from '../enfant-incidents/enfant-incidents.component';
import { EnfantInfosComponent } from '../enfant-infos/enfant-infos.component';
import { EnfantNotesComponent } from '../enfant-notes/enfant-notes.component';
import { EnfantPedagogyComponent } from '../enfant-pedagogy/enfant-pedagogy.component';
import { EnfantPlanningComponent } from '../enfant-planning/enfant-planning.component';
import { EnfantIndexPage } from './enfant-index.page';



const routes: Routes = [  
  {
    path: '',
    component: EnfantIndexPage,
    children: [
      {
        path: 'planning',
        pathMatch: 'full',
        component: EnfantPlanningComponent,
      },
      {
        path: 'pedagogy',
        pathMatch: 'full',
        component: EnfantPedagogyComponent,
      },
      {
        path: 'notes/:annee/:semestre',
        component: EnfantNotesComponent,
      },
      {
        path: 'notes',
        pathMatch: 'full',
        component: EnfantNotesComponent,
      },
      {
        path: 'absence',
        pathMatch: 'full',
        component: EnfantAbsenceComponent,
      },
      {
        path: 'encadrants/chat',
        pathMatch: 'full',
        component: ChatComponent,
      },
      {
        path: 'encadrants',
        pathMatch: 'full',
        component: EnfantEncadrantsComponent,
      },
      {
        path: 'chat',
        pathMatch: 'full',
        component: ChatComponent,
      },
      {
        path: 'dashboard',
        pathMatch: 'full',
        component: EnfantDashboardComponent,
      },
      {
        path: 'infos',
        pathMatch: 'full',
        component: EnfantInfosComponent
      },
      {
        path: 'incidents',
        pathMatch: 'full',
        component: EnfantIncidentsComponent
      },
      {
        path:'',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnfantIndexPageRoutingModule {}
