import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LocaleProvider } from './LocaleProvider';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AuthService } from './shared/services/auth/auth.service';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { registerLocaleData } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import localeFr from '@angular/common/locales/fr';
import localeEN from '@angular/common/locales/en';
import { FormsModule } from '@angular/forms';
import { CustomAlertPageModule } from './pages/etudiant/custom-alert/custom-alert.module';
import { CustomListPageModule } from './pages/etudiant/custom-list/custom-list.module';
import { DetailsRevisionsPageModule } from './pages/etudiant/details-revisions/details-revisions.module';
import { UpdateSeancePageModule } from './pages/intv/update-seance/update-seance.module';

registerLocaleData(localeFr);
registerLocaleData(localeEN);

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    HttpClientModule,

    UpdateSeancePageModule,
    CustomAlertPageModule,
    CustomListPageModule,
    FontAwesomeModule,
    DetailsRevisionsPageModule,


    TranslateModule.forRoot({
      defaultLanguage: 'fr',
      loader: {
        provide: TranslateLoader,
        useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json'),
        deps: [HttpClient]
      }
    }),
  ],
  providers: [
    LocaleProvider,
    NativeStorage,
    // InAppBrowser,
    AuthService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
