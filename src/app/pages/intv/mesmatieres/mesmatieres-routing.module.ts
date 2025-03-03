import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MesmatieresPage } from './mesmatieres.page';

const routes: Routes = [
  {
    path: '',
    component: MesmatieresPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MesmatieresPageRoutingModule {}
