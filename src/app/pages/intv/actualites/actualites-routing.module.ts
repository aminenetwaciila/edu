import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActualitesPage } from './actualites.page';
import { PostPageComponent } from './components/post-page/post-page.component';

const routes: Routes = [
  {
    path: '',
    component: ActualitesPage
  },
  {
    path: 'post/:id/:comments',
    component: PostPageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActualitesPageRoutingModule {}
