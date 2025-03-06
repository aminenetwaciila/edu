import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewAttestationsPage } from './new-attestations.page';

const routes: Routes = [
  {
    path: '',
    component: NewAttestationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NewAttestationsPageRoutingModule {}
