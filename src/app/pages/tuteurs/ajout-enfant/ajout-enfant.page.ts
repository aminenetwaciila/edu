import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  AlertController,
  LoadingController,
  NavController,
  Platform,
  ToastController,
  ToastOptions,
} from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import {
  MatriculeState,
  SubmitChildrenMatriculesResponse,
} from '../Types/addEtudiantTypes';
import { TuteurApiService } from '../Services/tuteur-api.service';
import { EnfantService } from '../Services/enfant.service';

@Component({
  selector: 'app-ajout-enfant',
  templateUrl: './ajout-enfant.page.html',
  styleUrls: ['./ajout-enfant.page.scss'],
  standalone: false,
})
export class AjoutEnfantPage implements OnInit {

  matricules: MatriculeState[] = [];
  fieldMatricule: string = '';
  errorMatricules: string[] = []

  enfants: any[] = [];
  nonApprovedChildren: any[] = [];

  constructor(
    private navCtrl: NavController,
    private plateform: Platform,
    private loadingCtrl: LoadingController,
    private toast: ToastController,
    private apiService: TuteurApiService,
    private translater: TranslateService,
    private alertController: AlertController,
    private enfantservice: EnfantService,

  ) {
    this.plateform.backButton.subscribeWithPriority(2, (processNextHandler) => {
      this.exit();
      processNextHandler();
    });
  }

  ngOnInit() { }

  exit() {
    this.navCtrl.back();
    this.errorMatricules = [];
    this.matricules = [];
    this.fieldMatricule = '';
  }

  addMatricule() {
    if (this.fieldMatricule.length == 0 || this.matricules.find((e) => e.matricule == this.fieldMatricule) != undefined)
      return;

    let etd = this.enfantservice.approvedEnfants.find(x => x.Etd_Matricule?.toLowerCase() == this.fieldMatricule.toLowerCase())
    let nonApp = this.enfantservice.nonApprovedEnfants.find(x => x.Etd_Matricule?.toLowerCase() == this.fieldMatricule.toLowerCase())

    if (etd != null || nonApp != null) {
      this.presentToast(`Demande de suivi pour le matricule "${this.fieldMatricule}" déjà envoyée`, 'warning');
      return;
    }

    this.matricules.push({
      matricule: this.fieldMatricule.trim(),
      submitted: false,
      error: false,
    });
    this.fieldMatricule = '';
  }

  deleteMatricule(mat: string) {
    const index = this.matricules.findIndex((e) => e.matricule == mat);
    if (index >= 0) this.matricules.splice(index, 1);
  }

  async submitMatricules() {
    const loading = await this.loadingCtrl.create();
    this.errorMatricules = [];
    this.apiService
      .submitChildrenMatricules(this.matricules.map((e) => e.matricule))
      .subscribe({
        next: (response: SubmitChildrenMatriculesResponse[]) => {
          this.translater
            .get('TTR.TAB2.SUCCESS_ADDING_CHILDREN')
            .toPromise()
            .then((message) => {
              this.presentToast(message, 'success');
            })
            .catch(console.error);
          response.forEach((e) => {
            const mat = this.matricules.find((m) => m.matricule == e.matricule);
            if (mat != undefined) {
              mat.submitted = e.added;
              mat.error = e.error;
            }
          });
          loading.dismiss();
          this.errorMatricules = this.matricules.filter((e) => e.error).map((e) => e.matricule);
          if (this.errorMatricules.length > 0) {
            this.translater.get(["TTR.TAB2.MATRICULE_ERR_HEADER", "TTR.TAB2.MATRICULE_ERR_SUB8HEADER"]).toPromise().then(async (message) => {
              const dialog = await this.alertController.create({
                header: message["TTR.TAB2.MATRICULE_ERR_HEADER"],
                subHeader: message["TTR.TAB2.MATRICULE_ERR_SUB8HEADER"],
                message: this.errorMatricules.join(", "),
                buttons: ['OK'],
              })
              await dialog.present();
              dialog.onDidDismiss().then(() => {
                this.errorMatricules = [];
              })
            }).catch(console.error);
            this.matricules = [];
          }
        },
        error: async (err) => {
          loading.dismiss();
          this.translater
            .get('TTR.TAB2.ERROR_ADDING_CHILDREN')
            .toPromise()
            .then((message) => {
              this.presentToast(message, 'warning');
            })
            .catch(console.error);
        },
      });
  }

  private async presentToast(message: string, color: string) {
    const toast = await this.toast.create({
      message: message,
      duration: 3000,
      color: color,
      cssClass: 'toastCss',
    });
    toast.present();
  }
}
