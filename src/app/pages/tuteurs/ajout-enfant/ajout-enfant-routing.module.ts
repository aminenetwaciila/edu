import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AjoutEnfantPage } from './ajout-enfant.page';

const routes: Routes = [
  {
    path: '',
    component: AjoutEnfantPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AjoutEnfantPageRoutingModule {}
