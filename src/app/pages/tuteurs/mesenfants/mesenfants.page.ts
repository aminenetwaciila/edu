import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavController, Platform, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { EnfantService } from '../Services/enfant.service';
import { TuteurApiService } from '../Services/tuteur-api.service';
import { Enfant } from '../Types/Enfant.type';
import { NonApprovedEnfant } from '../Types/NonApprovedEnfant.type';

@Component({
  selector: 'app-mesenfants',
  templateUrl: './mesenfants.page.html',
  styleUrls: ['./mesenfants.page.scss'],
  standalone: false,
})
export class MesenfantsPage implements OnInit, OnDestroy {

  firstLoad = false;
  loaded = false;
  enfants: Enfant[] = null;
  nonApprovedChildren: NonApprovedEnfant[] = [];

  constructor(
    private enfantservice: EnfantService,
    private tuteurApi: TuteurApiService,
    private navCtl: NavController,
    private toastController: ToastController,
    private translate: TranslateService,
    private plateform: Platform
  ) {
    this.plateform.backButton.subscribeWithPriority(2, () => { })
  }


  ngOnInit() {
    this.loadChildren().finally(() => {
      this.firstLoad = true;
    });
  }

  doRefresh($event) {
    setTimeout(() => {
      this.loadChildren().finally(() => {
        $event.target.complete();
      })
    }, 1000);
  }

  ngOnDestroy(): void {
    this.loaded = false;
    this.firstLoad = false;
    this.enfants = [];
    this.nonApprovedChildren = [];
  }

  private loadChildren() {
    this.loaded = false;
    return this.enfantservice.loadChildren().then(() => {
      this.loaded = true;
      this.enfants = this.enfantservice.approvedEnfants;
      this.nonApprovedChildren = this.enfantservice.nonApprovedEnfants;

      console.log("enfants: ", this.enfants)
      console.log("nonApprovedChildren: ", this.nonApprovedChildren)

    }).catch((err) => {
      this.loaded = true;
      this.enfants = this.enfantservice.approvedEnfants;
      this.nonApprovedChildren = this.enfantservice.nonApprovedEnfants;
      // let message = "Couldn't load children, try again later."
      let message = "Erreur de chargement des enfants, veuillez réessayer plus tard."
      this.translate.get("TTR.TAB2.COULDNT_LOAD_CHILDREN").toPromise().then((msg) => {
        message = msg;
      }).finally(async () => {
        let toast = await this.toastController.create({ color: "danger", duration: 3000, message: message, });
        toast.present();
      })
    })
  }




  openChild(index: number) {
    this.enfantservice.setCurrEnfantIndex(index);
    this.navCtl.navigateForward('/menuTtr/tabs/mesenfants/enf') // navigating to enfant-index module => dashboard component
  }




}
