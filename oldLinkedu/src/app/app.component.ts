import { Component } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { UserService } from './shared/services/user.service';
import { LocaleService } from './shared/services/LocaleService';
import { menu } from './shared/data/navigation';
import { MenuController, NavController, Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { faCoffee, faCalendarCheck, faChalkboardUser, } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
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
    private navCtrl: NavController
    ) {

    this.translate.addLangs(['en','fr'])
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
          switch( this.userData.Role ){
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
      error: (err) => {}
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
      this.nativeStorage.setItem('lang', lang);
      this.localeService.setLocale(lang);
    } catch (error) {
      console.log(error)
    }
  }
    
}