import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { IonRouterOutlet, LoadingController, ModalController, NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataService } from 'src/app/shared/services/data.service';
import { DbService } from 'src/app/shared/services/db.service';
import { UserService } from 'src/app/shared/services/user.service';
import { CustomListPage } from '../custom-list/custom-list.page';
import { DetailsRevisionsPage } from '../details-revisions/details-revisions.page';

@Component({
  selector: 'app-details-resultats',
  templateUrl: './details-resultats.page.html',
  styleUrls: ['./details-resultats.page.scss'],
})
export class DetailsResultatsPage implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  matchoose = [];
  nbRevRestant = 2;
  semestre: any;
  demanderevision = false;
  etudiant: any;
  semestres: any = [];
  userData: any;
  fac_id: any;
  from: any;
  constructor(
    private route: ActivatedRoute,
    private user: UserService,
    private db: DbService,
    private navCtrl: NavController,
    private loadingController: LoadingController,
    private routerOutlet: IonRouterOutlet,
    private modalCtrl: ModalController,
    private nativeStorage: NativeStorage,
    private dataServ: DataService) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.semestre) {
        this.semestre = JSON.parse(params.semestre);
      }
      this.from = params.from;

    });



    this.dataServ.etudiant$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data: any) => {
      if (data == null) {
        return;
      }

      if (data != null) {
        this.etudiant = data;
        if (this.etudiant.ds.data) {
          this.etudiant.ds.data.map(x => x.semestres).forEach(x => {
            x.forEach(y => {
              if (y.modules.length > 0) {
                this.semestres.push(y);
              }
            });
          });
          if (this.semestres.length > 0) {
            this.semestres[0].active = true;
          }
        }



        this.nativeStorage.getItem('Fac_Id').then((data) => {
          this.fac_id = data;
        })
        .then(() => {
          if (this.from) {
            this.semestre = this.semestres.find(x => x.EtdSpecSms_Id == this.etudiant.ds.smsAReviser);
            if (this.hasDemandeActive()) {

              this.isRevisionPossible().then((data) => {
                if (data) {
                  if (this.fac_id) {
                    this.db.demandeRevision(this.etudiant.ds.smsActuel.Sms_Nom).then(data => {
                      if (data) {
                        // tslint:disable-next-line:max-line-length
                        const sna = confirm('Vous avez déjà bénéficié d\'un repêchage. Si vous souhaitez poursuivre votre demande de révision, votre repêchage risque d\'être annulé. voulez-vous continuer ?');
                        if (sna) {
                          this.demanderevision = true;
                        }
                      } else {
                        this.demanderevision = true;
                      }
                    });
                  } else{
                    this.db.presentToast("Un problème est survenue. Veuillez réessayer ultérieurement ou contactez le service support");
                    console.error("FAC_Id non disponible")
                    if (this.from) {
                      this.navCtrl.back();
                    }
                  }
                } else {
                  this.reinitRev()
                  this.db.presentToast('Vous ne pouvez plus soumettre une nouvelle demande de révision');
                  if (this.from) {
                    this.navCtrl.back();
                  }
                }
              })
              .catch(() => {
                this.db.presentToast('Un problème est survenue. Veuillez réessayer');
                if (this.from) {
                  this.navCtrl.back();
                }
              })
            } else {
              this.db.presentToast('La fonction demande revision n\'est pas disponible pour le moment.');
              this.navCtrl.back();
              }
          }
        });


      }

    });

    this.user.user$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data: any) => {

      this.userData = data;
    });


    // this.nativeStorage.getItem('Etd_Id').then((data) => {
    //   this.Etd_Id = data;
    // });
    // this.nativeStorage.getItem('cursus').then((data) => {
    //   this.cursus = JSON.parse(data);
    // });


  }

  public isNaN(note) {
    return isNaN(note);
  }

  async afficherDetAbsences(mat) {
    const modal = await this.modalCtrl.create({
      component: CustomListPage,
      componentProps: {
        type: "absence",
        data: mat?.absences
      },
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    await modal.present();
  }

  annuler() {
    this.demanderevision = !this.demanderevision;
  }

  public isRevisionPossible() {
    return new Promise((resolve, reject) => {
      if (this.fac_id) {
        this.nbRevRestant = 2;
        this.db.getNbRevisionsSms(this.etudiant.matricule, this.etudiant.ds.smsActuel.Sms_Nom, this.fac_id).then((data: any) => {
          const date = data.datefin.split("-");
          const datefin = new Date(date[2] + "-" + date[1] + "-" + date[0]);
          if (new Date() <  datefin) {
            this.nbRevRestant -= data.nb;
            if (this.nbRevRestant > 0) {
              resolve(true);
            } else {
              resolve(false);
            }
          } else {
            resolve(false);
          }
        })
        .catch(() => {
          reject()
        })
      } else{
        this.db.presentToast("Un problème est survenue. Veuillez réessayer ultérieurement ou contactez le service support");
        console.error("FAC_Id non disponible")
      }

    });

  }

  revision() {
    return new Promise((resolve, reject) => {
        this.db.demandeRevision(this.etudiant.ds.smsActuel.Sms_Nom).then(data => {
          if (data != null && data > 0) {
            // tslint:disable-next-line:max-line-length
            const sna = confirm('Vous avez déjà bénéficié d\'un repêchage. Si vous souhaitez poursuivre votre demande de révision, votre repêchage risque d\'être annulé. voulez-vous continuer ?');
            if (sna) {
              this.demanderevision = true;
              resolve(this.demanderevision);
            } else {
              resolve(false);
            }
          } else {
            this.demanderevision = true;
            resolve(this.demanderevision);
          }
          });
    });
  }


  demandeRev() {
    this.isRevisionPossible().then((data) => {
      if (data) {
        this.revision();
      } else {
        this.reinitRev()
        this.db.presentToast('Vous ne pouvez plus soumettre une nouvelle demande de révision');
        if (this.from) {
          this.navCtrl.back();
        }
      }
    });
  }

  public reinitRev() {
    this.matchoose = [];
    this.nbRevRestant = 2;
    // this.step = 0;
  }


  hasDemandeActive() {
    if (this.semestre) {
      const a = this.semestre.modules.filter(x => x.matieres.filter(y => !isNaN(y.EtdCrs_NoteExam) && y.EtdCrs_NoteExam != null && y.EtdCrs_NoteExam != '').length > 0);
      return a.length > 0;
    }
    return false
  }

  demander() {
    this.demanderevision = !this.demanderevision;
  }



  public onMatiereChecked(mat) {
    if (mat.checked) {
      this.matchoose.push(mat);
    } else {
      const i = this.matchoose.map(x => x.EtdCrs_Id).indexOf(mat.EtdCrs_Id);
      if (i !== -1) {
        this.matchoose.splice(i, 1);
      }
      mat.checked = false;
    }
    if (this.matchoose.length > 2) {
      const i = this.matchoose.map(x => x.EtdCrs_Id).indexOf(mat.EtdCrs_Id);
      if (i !== -1) {
        this.matchoose.splice(i, 1);
      }
      this.db.presentToast('Vous ne pouvez pas ajouter plus de 2 matières.');
      mat.checked = false;
    }
  }


  public async continuer() {
    const modal = await this.modalCtrl.create({
      component: DetailsRevisionsPage,
      componentProps: {
        matchoose: this.matchoose
      },
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data != null) {
      this.saveRevision(data)
    } else {
      this.reinitRev();
    }
  }

  async afficherDetNotes(mat: any) {
    const modal = await this.modalCtrl.create({
      component: CustomListPage,
      componentProps: {
        type: "notes",
        data: mat
      },
      swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    await modal.present();
  }

  async saveRevision(data) {


    const loading = await this.loadingController.create();
    await loading.present().then(async () => {

      const pro = new Promise<void>((resolve, reject) => {
        data.forEach((matiere, i) => {
          const rev_id = this.db.guid();
            const newRevision = {
              REV_Id: rev_id,
              REV_DateSoumission: new Date(),
              REV_DateTraitement: null,
              REV_Remarque:  null,
              REV_Etat: 'SOUMIS',
              EtdCrs_Id: matiere.EtdCrs_Id,
              NEL_RevisionEtdCrsEvaluation: []
            };
            const evals = matiere.evals.filter(x => x.revision != null && x.revision !== '' );
            evals.forEach(ev => {
                newRevision.NEL_RevisionEtdCrsEvaluation.push({
                    REVEVAL_Id: this.db.guid(),
                    REV_Id: rev_id,
                    EtdCrsEval_Id : ev.EtdCrsEval_Id,
                    REVEVAL_EtdComment: ev.revision,
                    REVEVAL_EnsComment: null,
                    REVEVAL_AncienneNote: ev.EtdCrsEval_Note,
                    REVEVAL_NouvelleNote: null
                });
            });


            this.db.postData('/api/NEL_RevisionAPI/CreateRevision/' + this.userData.Etd_Matricule, newRevision).toPromise()
            .then(() => {
              if ((i + 1) === this.matchoose.length) {
                resolve();
              }
            });
        });
      });

      pro.then(() => {
        this.demanderevision = false;
        this.matchoose = [];
        this.semestre.modules.forEach(x => {
          x.matieres.forEach(y => {
            y.checked = false;
          });
        });
        loading.dismiss()
        if (this.from) {
          this.navCtrl.back();
        }
      })
      .catch(() => {
        loading.dismiss()
      })
    });





    // Parcourt des élements d'évaluations qui on été commenter pour les ajoutés a l'objet newRevision



  }


   /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }


}




