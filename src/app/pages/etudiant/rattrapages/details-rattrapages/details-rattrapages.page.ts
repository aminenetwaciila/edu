/* eslint-disable */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras } from '@angular/router';
// import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { IonRouterOutlet, LoadingController, ModalController, NavController, ToastController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataService } from 'src/app/shared/services/data.service';
import { DbService } from 'src/app/shared/services/db.service';
import { UserService } from 'src/app/shared/services/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-details-rattrapages',
  templateUrl: './details-rattrapages.page.html',
  styleUrls: ['./details-rattrapages.page.scss'],
  standalone: false,
})
export class DetailsRattrapagesPage implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject<any>();

  userData: any;
  from: any;
  presentingElement = null;

  IsLoading: boolean = true;
  DataSource: any[] = [];
  OrginalDataSource: any[] = [];
  Annees: any[] = [];
  Semestres: {
    Sms_Nom: string, IsOpen: boolean, IsAutreMatieresVisible: boolean,
    MatieresObligatoire: { EtdCrs_Id: string, Crs_Code: string, Crs_Nom: string, EtdCrs_NoteExam: number, EstConfirme: boolean, MatiereOuverte: boolean, EstTraite: boolean, CanEdit: boolean }[],
    MatieresRecommande: { EtdCrs_Id: string, Crs_Code: string, Crs_Nom: string, EtdCrs_NoteExam: number, EstConfirme: boolean, MatiereOuverte: boolean, EstTraite: boolean, CanEdit: boolean }[],
    MatieresOptionnelle: { EtdCrs_Id: string, Crs_Code: string, Crs_Nom: string, EtdCrs_NoteExam: number, EstConfirme: boolean, MatiereOuverte: boolean, EstTraite: boolean, CanEdit: boolean }[],
    AutreMatieres: { EtdCrs_Id: string, Crs_Code: string, Crs_Nom: string, EtdCrs_NoteExam: number, EstConfirme: boolean, MatiereOuverte: boolean, EstTraite: boolean, CanEdit: boolean }[],
  }[] = [];

  constructor(
    private route: ActivatedRoute,
    private user: UserService,
    private db: DbService,
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private routerOutlet: IonRouterOutlet,
    private modalCtrl: ModalController,
    private nativeStorage: NativeStorage,
    private dataServ: DataService,
    private toast: ToastController) {

    // console.log("DetailsRattrapagesPage.constructor")

  }


  ngOnInit() {
    this.IsLoading = true;
    console.log("DetailsRattrapagesPage.ngOnInit")
    this.route.queryParams.subscribe((params: any) => {
      // console.log("params: ", params);
      this.Annees = JSON.parse(JSON.stringify(params.Annees));
      this.DataSource = JSON.parse(JSON.stringify(params.DataSource))
        .map((item) => {
          item.ValueChanged = false;
          return item;
        });

      console.log("DataSource: ", this.DataSource)

      // if (environment.production == false) {
      //   this.DataSource = this.DataSource.map((item) => {
      //     item.Per_DateFinInscpRatt = new Date("2025-03-01T00:00:00");

      //     return item;
      //   });
      // }

      this.OrginalDataSource = JSON.parse(JSON.stringify(this.DataSource));

      this.from = params.from;

      this.Semestres = [];

      this.DataSource.forEach((etdCrs) => {
        if (this.Semestres.find(x => x.Sms_Nom == etdCrs.Sms_Nom) == null) {
          let semestre: any = {
            Sms_Nom: etdCrs?.Sms_Nom, IsOpen: false,
            IsAutreMatieresVisible: false,
            MatieresObligatoire: [], MatieresOptionnelle: [], AutreMatieres: [],
            MatieresRecommande: [],
          };
          this.Semestres.push(semestre);
        }
        this.Semestres = this.Semestres.map((sms) => {
          if (etdCrs.EstTraite == true)
            etdCrs.CanEdit = false;
          else etdCrs.CanEdit = true;



          if (etdCrs.Sms_Nom == sms.Sms_Nom) {

            if (etdCrs.EtdCrs_RattrapageOblig == true) {

              sms.MatieresRecommande.push(etdCrs);

            } else if (etdCrs.ARattraper == true) {
              if (etdCrs.Obligatoire == true) {
                if (etdCrs.EstConfirme == false) {
                  etdCrs.EstConfirme = true;
                  etdCrs.EstTraite = false;
                  etdCrs.CanEdit = false;
                  setTimeout(() => {
                    this.OnMatiereChange(null, etdCrs.EtdCrs_Id);
                  }, 100);
                }
                sms.MatieresObligatoire.push(etdCrs);
              }
              else
                sms.MatieresOptionnelle.push(etdCrs);
            }
            else
              sms.AutreMatieres.push(etdCrs);

          }


          return sms;
        })

      })

      this.Semestres = this.Semestres.sort((a, b) => {
        if (a.Sms_Nom.length > b.Sms_Nom.length) return -1;
        if (a.Sms_Nom.length < b.Sms_Nom.length) return 1;
        if (a.Sms_Nom > b.Sms_Nom) return -1;
        if (a.Sms_Nom < b.Sms_Nom) return 1;
        return 0;
      });
      this.Semestres = this.Semestres.map((sms) => {
        if (sms.MatieresObligatoire.length > 0)
          sms.IsOpen = true;
        return sms;
      })

      console.log("Semestres: ", this.Semestres)

      this.IsLoading = false;
    });

    this.user.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        // console.log("user.data: ", data);
        this.userData = data;
      });
    // this.nativeStorage.getItem('Etd_Id').then((data) => {
    //   this.Etd_Id = data;
    // });
    // this.nativeStorage.getItem('cursus').then((data) => {
    //   this.cursus = JSON.parse(data);
    // });

    this.presentingElement = document.querySelector('.ion-page');
  }

  Refresh(event) {
    // console.log("DetailsRattrapagesPage.refresh")
    // console.log("Refresh: ", event);
  }

  OnSemestreSelected(sms_nom: string) {
    this.Semestres = this.Semestres.map((sms) => {
      if (sms.Sms_Nom == sms_nom)
        sms.IsOpen = !sms.IsOpen;
      return sms;
    });
  }

  ShowAutreMatiere(sms_nom: string) {
    this.Semestres = this.Semestres.map((sms) => {
      if (sms.Sms_Nom == sms_nom)
        sms.IsAutreMatieresVisible = true;
      return sms;
    })
  }

  OnMatiereChange(event, etdcrs_id) {
    console.log("event: ", event);
    console.log("OnMatiereChange: ", etdcrs_id);
    let item = this.DataSource.find(x => x.EtdCrs_Id == etdcrs_id);
    console.log("item: ", item);

    if (item.MatiereOuverte == false) {
      this.presentToast("Cette matière n'est pas ouverte en rattrapage.", null, 5000);
      setTimeout(() => {
        this.ResetCheckBoxes(etdcrs_id);
      }, 250);
      return;
    }


    if (item.Per_DateFinInscpRatt != null) {

      console.log("item.Per_DateFinInscpRatt: ", item.Per_DateFinInscpRatt)
      console.log("date fin: ", new Date(item.Per_DateFinInscpRatt))
      console.log("date now: ", new Date())
      if (new Date() > new Date(item.Per_DateFinInscpRatt)) {
        this.presentToast("La date limite d'inscription aux rattrapages est dépassée.", null, 5000);

        setTimeout(() => {
          this.ResetCheckBoxes(etdcrs_id);
        }, 250);
        return;
      }
    }

    this.DataSource = this.DataSource.map((item) => {
      if (item.EtdCrs_Id == etdcrs_id)
        item.ValueChanged = true;
      return item;
    })
  }

  ResetCheckBoxes(etdcrs_id) {

    let originalItem = this.OrginalDataSource.find(x => x.EtdCrs_Id == etdcrs_id)
    console.log("originalItem: ", originalItem)

    this.Semestres = this.Semestres.map((sms) => {

      // MatieresObligatoire
      sms.MatieresObligatoire = sms.MatieresObligatoire.map((mat) => {
        if (mat.EtdCrs_Id == etdcrs_id) {
          console.log("MatieresObligatoire mat: ", mat);
          mat.EstConfirme = originalItem.EstConfirme;
        }
        return mat;
      });

      // MatieresRecommande
      sms.MatieresRecommande = sms.MatieresRecommande.map((mat) => {
        if (mat.EtdCrs_Id == etdcrs_id) {
          console.log("MatieresRecommande mat: ", mat);
          mat.EstConfirme = originalItem.EstConfirme;
        }
        return mat;
      });

      // MatieresOptionnelle
      sms.MatieresOptionnelle = sms.MatieresOptionnelle.map((mat) => {
        if (mat.EtdCrs_Id == etdcrs_id) {
          console.log("MatieresOptionnelle mat: ", mat);
          mat.EstConfirme = originalItem.EstConfirme;
        }
        return mat;
      });

      // AutreMatieres
      sms.AutreMatieres = sms.AutreMatieres.map((mat) => {
        if (mat.EtdCrs_Id == etdcrs_id) {
          console.log("AutreMatieres mat: ", mat);
          mat.EstConfirme = originalItem.EstConfirme;
        }
        return mat;
      });

      return sms;
    });
  }


  EtdCrsAValider: any[] = [];
  TotalAPayer: number = null;
  isModalOpen: boolean = false;


  OpenConfirmation() {
    this.EtdCrsAValider = this.DataSource.filter(x =>
      x.ValueChanged == true &&
      (
        x.EstConfirme != this.OrginalDataSource.find(w => w.EtdCrs_Id == x.EtdCrs_Id)?.EstConfirme ||
        x.EstDemande != this.OrginalDataSource.find(w => w.EtdCrs_Id == x.EtdCrs_Id)?.EstDemande
      )
    )

    this.TotalAPayer = this.EtdCrsAValider
      .filter(x => x.EstConfirme == true)
      .reduce((accumulator, currentValue) => { return accumulator + currentValue.Tarif; }, 0);

    if (this.EtdCrsAValider.length == 0) {
      try { this.toast.dismiss(); } catch (e) { }
      this.presentToast("Veuillez confirmer l'inscription aux rattrapages.", null, 5000);
    }
    else
      this.isModalOpen = true;
  }

  GetMatieresAConfirmer() {
    return this.EtdCrsAValider.filter(x => x.EstConfirme == true && x.EstTraite == false);
  }

  CloseConfirmation() {
    this.EtdCrsAValider = [];
    this.TotalAPayer = null;
    this.isModalOpen = false;
  }

  SaveConfirmation() {
    // console.log("SaveConfirmation", this.EtdCrsAValider)
    let data = this.EtdCrsAValider.map((item) => {
      let e = {
        EtdCrs_Id: item.EtdCrs_Id,
        EstConfirme: item.EstConfirme,
        EstDemande: item.EstDemande,
      };
      return e
    })
    console.log("Save: ", data)
    this.IsLoading = true;
    this.db.UpdateEtudiantMatiereRattrapageConfirmeDemande(data)
      .subscribe((response) => {
        console.log("response UpdateEtudiantMatiereRattrapageConfirmeDemande: ", response)
        this.IsLoading = false;
        if (response == null || response == false)
          this.presentToast("", null, 5000);
        else {
          this.presentToast("Enregitstrement réussi.", null, 2500);
          this.CloseConfirmation();
          setTimeout(() => {
            this.Close();
          }, 100);
        }


      }, (error: any) => {
        console.error("error UpdateEtudiantMatiereRattrapageConfirmeDemande: ", error)
        this.IsLoading = false;;
      })
  }

  onWillDismiss(event: Event) {
    const ev = event as CustomEvent<any>;
    // console.log("ev.detail", ev.detail);

    if (ev.detail.role === 'confirm') {
      // console.log("confirm");
      // this.message = `Hello, ${ev.detail.data}!`;
    }
    // this.isModalOpen = false;
  }

  async presentToast(message: string, position?: 'top' | 'middle' | 'bottom', duration?: number) {
    const toast = await this.toast.create({
      message: message,
      duration: duration == null ? 1500 : duration,
      position: position == null ? 'top' : position,
    });
    await toast.present();
  }

  Close() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        from: 'details-rattrapages',
        // Annees: this.Annees,
        // DataSource: this.DataSource,
        // semestre: JSON.stringify(semestre)
      }
    };
    this.navCtrl.navigateForward('rattrapages', navigationExtras);
  }

  /**
    * On destroy
    */
  ngOnDestroy(): void {
    // console.log("DetailsRattrapagesPage.ngOnDestroy")

    this.DataSource = [];
    this.OrginalDataSource = [];
    this.Annees = [];
    this.Semestres = [];
    this.EtdCrsAValider = [];

    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }


}




