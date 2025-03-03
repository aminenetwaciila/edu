import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MaprogressionPage } from './maprogression.page';

const routes: Routes = [
  {
    path: '',
    component: MaprogressionPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaprogressionPageRoutingModule {}
