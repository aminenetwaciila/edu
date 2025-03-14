import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RattrapagesPage } from './rattrapages.page';

const routes: Routes = [
  {
    path: '',
    component: RattrapagesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RattrapagesPageRoutingModule {}
