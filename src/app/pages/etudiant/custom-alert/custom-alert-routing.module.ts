import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomAlertPage } from './custom-alert.page';

const routes: Routes = [
  {
    path: '',
    component: CustomAlertPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomAlertPageRoutingModule {}
