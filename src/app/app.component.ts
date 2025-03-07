// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-root',
//   templateUrl: 'app.component.html',
//   styleUrls: ['app.component.scss'],
//   standalone: false,
// })
// export class AppComponent {
//   constructor() {}
// }

import { Component } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
// import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { UserService } from './shared/services/user.service';
import { LocaleService } from './shared/services/LocaleService';
import { menu } from './shared/data/navigation';
import { AlertController, MenuController, NavController, Platform, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { faCoffee, faCalendarCheck, faChalkboardUser, } from '@fortawesome/free-solid-svg-icons';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { HelperService } from './shared/services/helper.service';
import { register } from 'swiper/element/bundle';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent {

  public appPages = menu.intervenants;
  photo: any;
  icons: any = {
    assiduite: faCalendarCheck,
    evaluation: faChalkboardUser
  }

  // [
  //   { title: 'Games', url: '/folder/Inbox', icon: 'mail' },
  //   { title: 'Friends', url: '/folder/Outbox', icon: 'paper-plane' },
  //   { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
  //   { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
  //   { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
  //   { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  // ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  langChoose: string;
  userData: any;

  constructor(
    public translate: TranslateService,
    private nativeStorage: NativeStorage,
    private localeService: LocaleService,
    private user: UserService,
    private platform: Platform,
    private router: Router,
    private menuCtrl: MenuController,
    private navCtrl: NavController,
    private http: HttpClient,
    private toast: ToastController,
    private alertController: AlertController

  ) {

    this.translate.addLangs(['en', 'fr'])
    this.translate.setDefaultLang('fr');

    const browserLang = this.translate.getBrowserLang();

    this.nativeStorage.getItem('lang')
      .then((data) => {
        this.langChoose = data;
        this.localeService.initLocale(data);
      })
      .catch(() => {
        this.langChoose = browserLang;
        // this.localeService.initLocale(browserLang.match(/en|fr/) ? browserLang : 'fr');
        this.localeService.initLocale('fr');
      })
      .finally(() => {
        // this.loadMenu();
      })


    this.user.user$.subscribe({
      next: (data: any) => {
        this.userData = data;
        if (this.userData != null) {
          switch (this.userData.Role) {
            case "etudiant":
              this.appPages = menu.etudiants;
              this.photo = "https://edu.universiapolis.ma/Images/abs_poly1920/" + this.userData.Etd_Matricule + ".jpg"
              menuCtrl.enable(true)
              break;
            case "intervenant":
              this.appPages = menu.intervenants;
              this.photo = "https://www.google.com/url?sa=i&url=https%3A%2F%2Ficon-library.com%2Ficon%2Fperson-image-icon-0.html&psig=AOvVaw3jwPizSvRK2Ga1kMTbA61d&ust=1651237388665000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCODW7eHotvcCFQAAAAAdAAAAABAD"
              menuCtrl.enable(true)
              break;
            case "tuteur":
              menuCtrl.enable(false)
              break;
          }
        }

      },
      error: (err) => { }
    })

    // this.http.get(`${environment.upulseEdu}/api/Version/Mobile`)
    //   .subscribe(async (response: any) => {
    //     console.log("response Version: ", response)

    //     if (response != null && response != undefined)
    //       if (environment.version != response) {
    //         this.presentAlert(null, null, "Nouvelle version disponible, veuillez faire la mise à jour", ['Ok'])
    //       }

    //   }, (error: any) => {
    //     console.log("Error Version: ", error)
    //   })


    let url = `${environment.upulseEdu}/api/Version/GetMobileConfig`;
    this.http.get(url)
      .subscribe((response: any) => {
        console.log("response GetMobileConfig: ", response)
        if (response.Version != environment.version)
          this.presentAlert(null, null, "Nouvelle version disponible, veuillez faire la mise à jour", ['Ok'])
      }, (error) => {
        console.error("Error GetMobileConfig: ", error)
      })

    this.initializeApp();
  }


  public getIcone(value) {
    return faCoffee;
    let data: any;
    switch (value) {
      case '0':
        data = faCoffee;
        break;
      case value:

        break;
      case value:

        break;
      case value:

        break;
      case value:

        break;
      default:
        data = faCoffee;
        break;
    }
    return data;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.router.navigateByUrl('splash');
    });
  }

  public nav(url) {
    this.navCtrl.navigateForward(url);
  }

  public saveLanguage(lang) {
    try {
      // this.nativeStorage.setItem('lang', lang);
      HelperService.SetLocalStorage('lang', lang);

      this.localeService.setLocale(lang);
    } catch (error) {
      console.log(error)
    }
  }


  async presentAlert(header, subHeader, message, buttons: string[]) {
    const alert = await this.alertController.create({
      header: header,
      subHeader: subHeader,
      message: message,
      buttons: buttons,
    });

    await alert.present();
  }

}
