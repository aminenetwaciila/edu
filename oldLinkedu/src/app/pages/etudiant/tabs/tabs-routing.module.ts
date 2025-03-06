import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: '',
        component: TabsPage
      },
      {
        path: 'actualite',
        loadChildren: () => import('../actualites/actualites.module').then( m => m.ActualitesPageModule)
      },
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then( m => m.HomePageModule)
      },
      {
        path: 'monplanning',
        loadChildren: () => import('../monplanning/monplanning.module').then( m => m.MonplanningPageModule)
      },
      {
        path: 'mesmatieres',
        loadChildren: () => import('../mesmatieres/mesmatieres.module').then( m => m.MesmatieresPageModule)
      },
      {
        path: 'mesresultats',
        loadChildren: () => import('../mesresultats/mesresultats.module').then( m => m.MesresultatsPageModule)
      }

    ]
  },
  {
    path: '',
    redirectTo: 'actualite',
    pathMatch: 'full'
  }
];





@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
