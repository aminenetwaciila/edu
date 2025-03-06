import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AttestationsPage } from './attestations.page';

const routes: Routes = [
  {
    path: '',
    component: AttestationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttestationsPageRoutingModule {}
