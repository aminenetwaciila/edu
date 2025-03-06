import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MonplanningPage } from './monplanning.page';

const routes: Routes = [
  {
    path: '',
    component: MonplanningPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MonplanningPageRoutingModule {}
