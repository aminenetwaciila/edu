import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
// import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
// import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

import { LoadingController, NavController } from '@ionic/angular';
import { Subject, timer } from 'rxjs';
import { finalize, takeUntil, takeWhile, tap } from 'rxjs/operators';
import { DbService } from '../../services/db.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
  standalone: false,
})
export class SignUpPage implements OnInit, OnDestroy {
  formSubmitted = false;
  step = 0;
  matricule: any;
  matricules: any = [];
  profils = [{
    title: "Je suis étudiant",
    icon: "school"
  }, {
    title: "Je suis tuteur",
    icon: "person"
  },
  {
    title: "Je suis intervenant",
    icon: "browsers"
  },
  {
    title: "Je suis futur étudiant",
    icon: "person-add"
  }];
  countdown: number = 3;
  countdownMapping: any = {
    '=1': '# seconde',
    'other': '# secondes'
  };

  profilChoosen = null;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  tuteurForm: FormGroup;
  etudiantForm: FormGroup;
  constructor(
    // private iab: InAppBrowser,
    private loadingCtrl: LoadingController,
    private db: DbService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  chooseProfil(val) {
    this.profilChoosen = val;
    // this.step++;
    if (this.profilChoosen == 0) {
      this.initializeEtudiantForm()
    } else
      if (this.profilChoosen == 1) {
        this.initializeTuteurForm();
      } else if (this.profilChoosen == 2) {
        timer(1000, 1000)
          .pipe(
            finalize(() => {
              setTimeout(() => {
                this.profilChoosen = null;
              }, 3000);
            }),
            takeWhile(() => this.countdown > 0),
            takeUntil(this._unsubscribeAll),
            tap(() => this.countdown--)
          )
          .subscribe();
      } else if (this.profilChoosen == 3) {
        timer(1000, 1000)
          .pipe(
            finalize(() => {
              this.gotoadmission();
              setTimeout(() => {
                this.profilChoosen = null;
              }, 3000);
            }),
            takeWhile(() => this.countdown > 0),
            takeUntil(this._unsubscribeAll),
            tap(() => this.countdown--)
          )
          .subscribe();
      }
  }

  initializeTuteurForm() {
    this.tuteurForm = new FormGroup({
      prenom: new FormControl('', Validators.required),
      nom: new FormControl('', Validators.required),
      adresse: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      tel: new FormControl('', Validators.required),
      matricules: new FormControl([], Validators.required),
    });
  }

  initializeEtudiantForm() {
    this.etudiantForm = new FormGroup({
      matricule: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required]),
      entite: new FormControl('', [Validators.required]),
    });
  }



  // convenience getter for easy access to form fields
  get f() { return this.tuteurForm.controls; }
  // FIN convenience getter for easy access to form fields


  async onSubmitRegisterEtudiantCheckMatricule() {

    const loading = await this.loadingCtrl.create();
    await loading.present().then(async () => {
      if (this.etudiantForm.value.matricule == null || this.etudiantForm.value.matricule == "") {
        this.db.presentToast("Veuillez saisir votre matricule");
        loading.dismiss()
      }
      //check matricule
      else {
        //this.openSnackBar("Vérification en cours, veuillez patienter", "OK", 2);
        this.db.CheckEtudiantMatricule(this.etudiantForm.value.matricule)
          .toPromise()
          .then(
            (response: any) => {
              if (response != null) {
                if (response.isMatriculeValide) {
                  if (response.hasAccount == false || (response.hasAccount == true && response.isAccountActive == false)) {
                    //activate Email
                    this.step++;
                    this.etudiantForm.controls['matricule'].setValue(this.etudiantForm.value.matricule);
                    loading.dismiss()
                  } else {
                    this.db.presentToast("Vous êtes déjà inscrit");
                    loading.dismiss()
                  }
                }
                else {
                  this.db.presentToast("Matricule incorrect");
                  loading.dismiss()
                }
              }
              else { this.db.presentToast("Erreur d'enregistrement"); loading.dismiss(); }
            },
            (error: any) => {
              this.db.presentToast("Erreur d'enregistrement");
            });
      }
    });



  }


  async onSubmitRegisterEtudiant() {

    const loading = await this.loadingCtrl.create();
    await loading.present().then(async () => {
      let params = { Email: this.etudiantForm.value.email + this.etudiantForm.value.entite, Matricule: this.etudiantForm.value.matricule };
      this.db.SubmitRegisterEtudiant(params)
        .toPromise()
        .then(
          (response: any) => {
            loading.dismiss()
            if (response == null) {
              this.db.presentToast("Erreur d'inscription.");
            } else {
              if (response.hasError) {
                this.db.presentToast(response.message);
              } else {
                this.db.presentToast(response.message);
                this.initializeEtudiantForm()
                setTimeout(() => {
                  this.navCtrl.back();
                }, 3000);
              }
            }
          })
        .catch(() => {
          this.db.presentToast("Erreur d'inscription. Veuillez réessayer ultérieurement.");
          loading.dismiss()
        })
    });
  }

  gotoadmission() {
    let url = 'https://edu.universiapolis.ma/Home/Inscription'
    // const browser = this.iab.create(url);
    window.open(url, "_system");
  }

  addMatricule() {
    this.matricule = this.matricule?.trim();
    if (this.matricule?.length > 0) {
      if (!this.matricules.includes(this.matricule)) {
        this.matricules.push(this.matricule);
        this.tuteurForm.controls['matricules'].setValue(this.matricules);
        this.matricule = '';
      }
    }
  }
  removeTuteurMatricule(matricule: string) {
    this.matricules.splice(this.matricules.indexOf(matricule), 1);
    this.tuteurForm.controls['matricules'].setValue(this.matricules);
  }

  async onSubmitRegisterTuteur() {
    const loading = await this.loadingCtrl.create();
    await loading.present().then(async () => {
      // if (!this.tuteurForm.status ) {
      //   console.log(this.tuteurForm)
      //   this.db.presentToast("Veuillez compléter le formulaire.");
      //   loading.dismiss();
      //   return false;
      // }
      const tuteurData = {
        Email: this.tuteurForm.value.email,
        Prenom: this.tuteurForm.value.prenom,
        Nom: this.tuteurForm.value.nom,
        Adresse: this.tuteurForm.value.adresse,
        Telephone: this.tuteurForm.value.tel,
        mats: this.tuteurForm.value.matricules.join(';'),
        Matricules: this.tuteurForm.value.matricules
      }
      this.db.registerTuteur(tuteurData).toPromise()
        .then((response: any) => {
          // console.log("Response authService.registerTuteur: ", response);
          // globalThis.spinnerService.hide();
          // globalThis.isBtnSubmitRegisterTuteurDisabled = false;
          if (response != null && response.hasError == true) this.db.presentToast(response.message);
          else if (response != null && response.hasError == false) {
            this.db.presentToast(response.message);
          }
        })
        .catch(err => {
          this.db.presentToast("Erreur de création de votre compte. ");
        })
        .finally(() => {
          loading.dismiss();
        })
    });
  }


  // async addMatricule() {
  //   if (this.matricule != null && this.matricule != '') {
  //     this.matricules.push(this.matricule);
  //     this.tuteurForm.controls['matricules'].setValue(this.matricules);
  //     this.matricule = '';
  //   }




  //   if (this.matricule == null || this.matricule == "") this.db.presentToast("Veuillez saisir votre matricule");
  //   //check matricule
  //   else {

  //     const loading = await this.loadingCtrl.create();
  //     await loading.present().then(async () => {

  //       this.db.CheckEtudiantMatricule(this.matricule)
  //       .then(
  //         (response: any) => {
  //           if (response != null) {
  //             if (response.isMatriculeValide) {
  //               if (response.hasAccount == false || (response.hasAccount == true && response.isAccountActive == false)) {
  //                 // //activate Email
  //                 // this.registerEtudiantParams.EmailDisplayStyle = 'block';
  //                 // //disable btn check matricule && set matricule to readonly
  //                 // this.registerEtudiantParams.isMatriculeEnabled = false;
  //                 // //sho btn submit
  //                 // this.registerEtudiantParams.isBtnSubmitRegisterEtudiantVisible = true;
  //               } else {
  //                 this.db.presentToast("Vous êtes déjà inscrit");
  //                 // //write matricule in the login input
  //                 // this.userLogin.Login = this.userEtudiantRegister.Etd_Matricule;
  //                 // //enable btn check matricule
  //                 // this.registerEtudiantParams.isMatriculeEnabled = true;
  //                 // //clear matricule from register
  //                  this.matricule = "";
  //                 //reset form
  //                 // this.clearRegisterEtudiant();
  //                 //switch to login
  //                 // this.typeForm = "login";
  //               }
  //             }
  //             else {
  //               this.db.presentToast("Matricule incorrect");
  //               // this.errorMsgRegisterEtudiant = "Matricule incorrect.";
  //               //enable btn check matricule
  //               // this.registerEtudiantParams.isMatriculeEnabled = true;
  //             }
  //           }
  //           else this.db.presentToast("Erreur d'enregistrement");
  //         },
  //         (error: any) => {
  //           // this.spinnerService.hide();
  //           this.db.presentToast("Erreur d'enregistrement");
  //           //enable btn check matricule
  //           // this.registerEtudiantParams.isMatriculeEnabled = true;
  //         });
  //     });
  //   }
  // }


  /**
     * On destroy
     */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
