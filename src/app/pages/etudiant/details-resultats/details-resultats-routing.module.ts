import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsResultatsPage } from './details-resultats.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsResultatsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsResultatsPageRoutingModule {}
