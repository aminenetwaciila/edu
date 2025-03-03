import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UpdateSeancePage } from './update-seance.page';

const routes: Routes = [
  {
    path: '',
    component: UpdateSeancePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UpdateSeancePageRoutingModule {}
