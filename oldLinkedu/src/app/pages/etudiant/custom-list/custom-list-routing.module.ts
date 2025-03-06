import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomListPage } from './custom-list.page';

const routes: Routes = [
  {
    path: '',
    component: CustomListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomListPageRoutingModule {}
