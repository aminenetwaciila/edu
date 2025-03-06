import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeEN from '@angular/common/locales/en';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

registerLocaleData(localeFr);
registerLocaleData(localeEN);

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}



import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';

import { LocaleProvider } from './LocaleProvider';
import { FormsModule } from '@angular/forms';
import { AuthService } from './shared/services/auth/auth.service';
import { UpdateSeancePageModule } from './pages/intv/update-seance/update-seance.module';
import { CustomAlertPageModule } from './pages/etudiant/custom-alert/custom-alert.module';
import { DetailsRevisionsPageModule } from './pages/etudiant/details-revisions/details-revisions.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CustomListPageModule } from './pages/etudiant/custom-list/custom-list.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
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
    InAppBrowser,
    AuthService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
