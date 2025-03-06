import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MoncursusPage } from './moncursus.page';

const routes: Routes = [
  {
    path: '',
    component: MoncursusPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoncursusPageRoutingModule {}
