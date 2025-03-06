import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsRevisionsPage } from './details-revisions.page';

const routes: Routes = [
  {
    path: '',
    component: DetailsRevisionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsRevisionsPageRoutingModule {}
