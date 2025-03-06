import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupportContainerComponent } from '../support-container/support-container.component';

import { MonprofilPage } from './monprofil.page';

const routes: Routes = [
  {
    path: 'mon-compte',
    pathMatch: 'full',
    loadChildren: () => import('../mon-compte/mon-compte.module').then( m => m.MonComptePageModule)
  },
  {
    path: 'aide',
    loadChildren: () => import('../aide/aide.module').then( m => m.AidePageModule)
  },
  {
    path: 'support',
    component: SupportContainerComponent
  },
  {
    path: '',
    component: MonprofilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonprofilPageRoutingModule {}
