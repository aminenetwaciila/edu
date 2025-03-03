import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailsRattrapagesPage } from './details-rattrapages.page';

const routes: Routes = [{ path: '', component: DetailsRattrapagesPage }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DetailsRattrapagesPageRoutingModule { }
