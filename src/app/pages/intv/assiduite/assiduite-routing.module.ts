import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AssiduitePage } from './assiduite.page';

const routes: Routes = [
  {
    path: '',
    component: AssiduitePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AssiduitePageRoutingModule {}
