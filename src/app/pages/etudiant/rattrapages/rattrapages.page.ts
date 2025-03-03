/* eslint-disable */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
import { IonRouterOutlet, ModalController, NavController, ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { DataService } from 'src/app/shared/services/data.service';
import { DbService } from 'src/app/shared/services/db.service';
import { CustomAlertPage } from '../custom-alert/custom-alert.page';
import { UserService } from 'src/app/shared/services/user.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-rattrapages',
  templateUrl: './rattrapages.page.html',
  styleUrls: ['./rattrapages.page.scss'],
  standalone: false,
})
export class RattrapagesPage implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  CurrentUser: any = null;
  IsLoading: boolean = true;
  firstLoad: boolean = false;
  isModalOpen: boolean = false;

  DataSource: any[] = [];
  Annees: {
    Ann_Id: string;
    Ann_Nom: string;
    IsOpen: boolean;
    NbInscrits: number;
    NbARattraper: number;
  }[] = null;

  constructor(
    private db: DbService,
    private user: UserService,
    private modalController: ModalController,
    private navCtrl: NavController,
    private toast: ToastController,
    private route: ActivatedRoute,
    // private dataServ: DataService,
    private routerOutlet: IonRouterOutlet) {
    // console.log("RattrapagesPage.constructor")
  }

  GetData() {
    console.log("RattrapagesPage.GetData")
    this.IsLoading = true;
    this.db.GetEtudiantMatiereRattrapage(this.CurrentUser.Etd_Id)
      .subscribe((response: any[]) => {
        console.log("response GetEtudiantMatiereRattrapage: ", response)
        this.firstLoad = true;
        this.IsLoading = false;
        if (response == null) {
          this.presentToast("Erreur de récuperation de vos rattrapages.", null, 5000);
        } else {
          this.Annees = [];
          this.DataSource = JSON.parse(JSON.stringify(response));
          response = response.sort((a, b) => {
            if (a.Ann_Nom > b.Ann_Nom) return -1;
            if (a.Ann_Nom < b.Ann_Nom) return 1;
            return 0;
          })
          response.forEach((etdCrs) => {
            if (this.Annees.find(x => x.Ann_Id == etdCrs.Ann_Id) == null) {
              // console.log("Ann_Nom: ", etdCrs.Ann_Nom, " Obligatoire:", etdCrs.Obligatoire)
              this.Annees.push({ Ann_Id: etdCrs.Ann_Id, Ann_Nom: etdCrs.Ann_Nom, IsOpen: false, NbInscrits: etdCrs.EstConfirme ? 1 : 0, NbARattraper: etdCrs.Obligatoire ? 1 : 0, })
            }
            else {
              // console.log("Ann_Nom: ", etdCrs.Ann_Nom, " Obligatoire:", etdCrs.Obligatoire)
              this.Annees = this.Annees.map((ann) => {
                if (ann.Ann_Id == etdCrs.Ann_Id) {
                  if (etdCrs.Obligatoire) ann.NbARattraper++;
                  if (etdCrs.EstConfirme) ann.NbInscrits++;
                }
                return ann;
              })
            }
          });
          this.Annees = this.Annees.map((ann) => {
            if (ann.NbARattraper > 0) ann.IsOpen = true;
            return ann;
          })
          this.Annees = this.Annees.sort((a, b) => {
            if (a.Ann_Nom > b.Ann_Nom) return -1;
            if (a.Ann_Nom < b.Ann_Nom) return 1;
            return 0;
          })
          // console.log("this.Annees: ", this.Annees)
        }
      }, (error) => {
        console.error("Erreur GetEtudiantMatiereRattrapage: ", error);
        this.presentToast("Erreur de récuperation de vos rattrapages.", null, 5000);
        this.IsLoading = false;
        this.firstLoad = true;
      })
  }

  ngOnInit() {
    // console.log("RattrapagesPage.ngOnInit")
    this.user.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        // console.log("user.data: ", data);
        this.CurrentUser = data;
        this.GetData();
      });

    this.route.queryParams.subscribe((params: any) => {
      // console.log("RattrapagesPage.ngOnInit.params: ", params);
      if (params.from == "details-rattrapages")
        this.GetData();

    });
  }

  Refresh(event) {
    // console.log('Refresh: ', event);
    this.GetData();
  }

  public OpenInscription() {
    // console.log("open inscription");
    // const semestre = this.semestres.find(x => x.active == true);
    const navigationExtras: NavigationExtras = {
      queryParams: {
        from: 'rattrapages',
        Annees: this.Annees,
        DataSource: this.DataSource,
        // semestre: JSON.stringify(semestre)
      }
    };
    this.navCtrl.navigateForward('details-rattrapages', navigationExtras);
  }

  async presentToast(message: string, position?: 'top' | 'middle' | 'bottom', duration?: number) {
    const toast = await this.toast.create({
      message: message,
      duration: duration == null ? 1500 : duration,
      position: position == null ? 'top' : position,
    });
    await toast.present();
  }

  public async voirdetails(crs) {
    const modal = await this.modalController.create({
      component: CustomAlertPage,
      componentProps: {
        info: crs
      },
      // swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
  }

  demandeRevision() {
    // const semestre = this.semestres.find(x => x.active == true);
    const navigationExtras: NavigationExtras = {
      queryParams: {
        from: 'revision',
        // semestre: JSON.stringify(semestre)
      }
    };
    this.navCtrl.navigateForward('details-resultats', navigationExtras);
  }

  MatieresDetails: any[] = []
  AnneeDetails: string = null;
  OpenDetails(ann_id: string, type: 'aRattraper' | 'inscrits') {
    if (type == 'aRattraper')
      this.MatieresDetails = this.DataSource.filter(x => x.Ann_Id == ann_id && x.Obligatoire == true);

    else
      this.MatieresDetails = this.DataSource.filter(x => x.Ann_Id == ann_id && x.EstConfirme == true);
    this.MatieresDetails = this.MatieresDetails.sort((a, b) => {
      if (a.Sms_Nom.length > b.Sms_Nom.length) return 1;
      if (a.Sms_Nom.length < b.Sms_Nom.length) return -1;
      if (a.Sms_Nom > b.Sms_Nom) return 1;
      if (a.Sms_Nom < b.Sms_Nom) return -1;
      return 0;
    })
    // console.log("MatieresDetails: ", this.MatieresDetails)
    this.isModalOpen = true;
    this.AnneeDetails = this.MatieresDetails[0].Ann_Nom
  }
  CloseDetails() {
    this.isModalOpen = false;
    this.MatieresDetails = [];
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // console.log("RattrapagesPage.ngOnDestroy");
    this.DataSource = [];
    this.Annees = null;
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
