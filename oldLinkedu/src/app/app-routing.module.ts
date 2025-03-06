/* eslint-disable max-len */
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/services/auth/guards/auth.guard';
import { NoAuthGuard } from './shared/services/auth/guards/noAuth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'splash', pathMatch: 'full' },
  { path: 'splash', loadChildren: () => import('./shared/pages/splash/splash.module').then(m => m.SplashPageModule) },
  { path: 'sign-in', loadChildren: () => import('./shared/pages/sign-in/sign-in.module').then(m => m.SignInPageModule), canActivate: [NoAuthGuard], },
  { path: 'sign-up', loadChildren: () => import('./shared/pages/sign-up/sign-up.module').then(m => m.SignUpPageModule) },
  { path: 'sign-out', loadChildren: () => import('./shared/pages/sign-out/sign-out.module').then(m => m.SignOutPageModule) },
  { path: 'intro', loadChildren: () => import('./shared/pages/intro/intro.module').then(m => m.IntroPageModule) },
  { path: 'forgot-password', loadChildren: () => import('./shared/pages/forgotpassword/forgotpassword.module').then(m => m.ForgotpasswordPageModule) },

  // intervenant
  { path: 'menu', loadChildren: () => import('./pages/intv/tabs/tabs.module').then(m => m.TabsPageModule), canActivate: [AuthGuard], },
  { path: 'assiduite', loadChildren: () => import('./pages/intv/assiduite/assiduite.module').then(m => m.AssiduitePageModule) },
  { path: 'evaluation', loadChildren: () => import('./pages/intv/evaluation/evaluation.module').then(m => m.EvaluationPageModule) },
  { path: 'disponibilite', loadChildren: () => import('./pages/intv/disponibilite/disponibilite.module').then(m => m.DisponibilitePageModule) },
  { path: 'plandecharge', loadChildren: () => import('./pages/intv/plandecharge/plandecharge.module').then(m => m.PlandechargePageModule) },
  { path: 'profil', loadChildren: () => import('./pages/intv/profil/profil.module').then(m => m.ProfilPageModule) },
  { path: 'listes-seances', loadChildren: () => import('./pages/intv/listes-seances/listes-seances.module').then(m => m.ListesSeancesPageModule) },
  { path: 'update-seance', loadChildren: () => import('./pages/intv/update-seance/update-seance.module').then(m => m.UpdateSeancePageModule) },
  { path: 'participants', loadChildren: () => import('./pages/intv/participants/participants.module').then(m => m.ParticipantsPageModule) },


  { path: 'menuTtr', loadChildren: () => import('./pages/tuteurs/tabs/tabs.module').then(m => m.TabsPageModule), canActivate: [AuthGuard], },
  { path: 'tabs', loadChildren: () => import('./pages/tuteurs/tabs/tabs.module').then(m => m.TabsPageModule) },

  // etudiant
  { path: 'menuEtd', loadChildren: () => import('./pages/etudiant/tabs/tabs.module').then(m => m.TabsPageModule), canActivate: [AuthGuard], },
  { path: 'listes-seances', loadChildren: () => import('./pages/etudiant/listes-seances/listes-seances.module').then(m => m.ListesSeancesPageModule) },
  { path: 'revisions', loadChildren: () => import('./pages/etudiant/revisions/revisions.module').then(m => m.RevisionsPageModule) },
  { path: 'rattrapages', loadChildren: () => import('./pages/etudiant/rattrapages/rattrapages.module').then(m => m.RattrapagesPageModule) },
  { path: 'details-rattrapages', loadChildren: () => import('./pages/etudiant/rattrapages/details-rattrapages/details-rattrapages.module').then(m => m.DetailsRattrapagesPageModule) },
  { path: 'attestations', loadChildren: () => import('./pages/etudiant/attestations/attestations.module').then(m => m.AttestationsPageModule) },
  { path: 'new-attestations', loadChildren: () => import('./pages/etudiant/new-attestations/new-attestations.module').then(m => m.NewAttestationsPageModule) },
  { path: 'custom-alert', loadChildren: () => import('./pages/etudiant/custom-alert/custom-alert.module').then(m => m.CustomAlertPageModule) },
  { path: 'details-resultats', loadChildren: () => import('./pages/etudiant/details-resultats/details-resultats.module').then(m => m.DetailsResultatsPageModule) },
  { path: 'details-revisions', loadChildren: () => import('./pages/etudiant/details-revisions/details-revisions.module').then(m => m.DetailsRevisionsPageModule) },
  { path: 'custom-list', loadChildren: () => import('./pages/etudiant/custom-list/custom-list.module').then(m => m.CustomListPageModule) },

];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
