import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DisponibilitePage } from './disponibilite.page';

const routes: Routes = [
  {
    path: '',
    component: DisponibilitePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DisponibilitePageRoutingModule {}
