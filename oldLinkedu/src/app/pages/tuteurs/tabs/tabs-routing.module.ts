import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'actualites',
        loadChildren: () => import('../actualites/actualites.module').then( m => m.ActualitesPageModule)
      },
      {
        path: 'mesenfants',
        loadChildren: () => import('../mesenfants/mesenfants.module').then( m => m.MesenfantsPageModule)
      },
      {
        path: 'monprofil',
        loadChildren: () => import('../monprofil/monprofil.module').then( m => m.MonprofilPageModule)
      },
      {
        path: 'notifs',
        loadChildren: () => import('../notifications/notifications.module').then( m => m.NotificationsPageModule)
      },
      {
        path: '',
        redirectTo: 'actualites',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tabs',
    pathMatch: 'full'
  }
];





@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
