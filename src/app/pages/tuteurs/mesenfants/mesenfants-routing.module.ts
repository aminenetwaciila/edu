import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EnfantIndexPage } from '../enfant-index/enfant-index.page';
import { MesenfantsPage } from './mesenfants.page';



const routes: Routes = [
  { path: 'add-enfant', pathMatch: 'full', loadChildren: () => import('../ajout-enfant/ajout-enfant.module').then(m => m.AjoutEnfantPageModule) },
  { path: 'enf', loadChildren: () => import('../enfant-index/enfant-index.module').then(m => m.EnfantIndexPageModule) },
  { path: '', pathMatch: 'full', component: MesenfantsPage },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MesenfantsPageRoutingModule { }
