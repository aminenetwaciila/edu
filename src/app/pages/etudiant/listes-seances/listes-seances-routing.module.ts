import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListesSeancesPage } from './listes-seances.page';

const routes: Routes = [
  {
    path: '',
    component: ListesSeancesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListesSeancesPageRoutingModule {}
