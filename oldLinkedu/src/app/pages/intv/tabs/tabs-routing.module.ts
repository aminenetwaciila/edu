import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'tab0',
        loadChildren: () => import('../actualites/actualites.module').then(m => m.ActualitesPageModule)
      },
      {
        path: 'tab1',
        loadChildren: () => import('../monplanning/monplanning.module').then(m => m.MonplanningPageModule)
      },
      {
        path: 'tab2',
        loadChildren: () => import('../maprogression/maprogression.module').then(m => m.MaprogressionPageModule)
      },
      {
        path: 'tab3',
        loadChildren: () => import('../mesmatieres/mesmatieres.module').then(m => m.MesmatieresPageModule)
      },
      {
        path: 'tab4',
        loadChildren: () => import('../mesetudiants/mesetudiants.module').then(m => m.MesetudiantsPageModule)
      },
      {
        path: '',
        redirectTo: 'tab0',
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
})
export class TabsPageRoutingModule {}
