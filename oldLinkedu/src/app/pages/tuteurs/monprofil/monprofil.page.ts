import { Component, OnDestroy, OnInit } from '@angular/core';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { NavController, Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { LocaleService } from 'src/app/shared/services/LocaleService';
import { TuteurApiService } from 'src/app/pages/tuteurs/Services/tuteur-api.service';
import { UserService } from 'src/app/shared/services/user.service';
import { TuteurType } from '../Types/TuteurType.type';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-monprofil',
  templateUrl: './monprofil.page.html',
  styleUrls: ['./monprofil.page.scss'],
})
export class MonprofilPage implements OnInit, OnDestroy {

  tuteur : TuteurType;
  ttrSub$ ?: Subscription
  lang = "";

  readonly default_avatar = "/assets/images/default-avatar.jpg";
  

  constructor( 
    private localeService: LocaleService,
    public translate: TranslateService,
    private nativeStorage: NativeStorage,
    private plateform: Platform,
    private tuteurApi : TuteurApiService,
    private navCtrl: NavController
    ) {
      
      this.plateform.backButton.subscribeWithPriority( 2, ()=>{})
      this.lang = this.localeService.currentLocale;

      this.ttrSub$ = this.tuteurApi.tuteurSubj.subscribe({
        next: (ttr)=>{
          this.tuteur = ttr
        }
      })
  }

  changeLang(lang){
    try {
      this.lang = lang;
      this.nativeStorage.setItem('lang', lang);
      this.localeService.setLocale(lang);
    } catch (error) {
      console.log(error)
    }
  }

  ngOnInit() {
    this.tuteur = this.tuteurApi.tuteurObject
    
  }

  ngOnDestroy(): void {
    this.ttrSub$.unsubscribe()
  }

  logout(){
    localStorage.removeItem("Genders");
    localStorage.removeItem("enfants")
    localStorage.removeItem("EtudiantAnneesEtSemesters")
    localStorage.removeItem("nonAprovedEnfants")
    this.navCtrl.navigateRoot("/sign-out");
  }

}
