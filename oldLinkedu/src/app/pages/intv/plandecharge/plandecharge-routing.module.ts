import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlandechargePage } from './plandecharge.page';

const routes: Routes = [
  {
    path: '',
    component: PlandechargePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlandechargePageRoutingModule {}
