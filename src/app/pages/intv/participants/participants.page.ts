import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { DbService } from 'src/app/shared/services/db.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-participants',
  templateUrl: './participants.page.html',
  styleUrls: ['./participants.page.scss'],
  standalone: false,
})
export class ParticipantsPage implements OnInit {
  @Input() selectedSeance: any;
  @Input() filteredEtudiantsDataSource: any;
  @Input() etudiantDs: any;
  @Input() selectedCompSec: any;
  @Input() isAllowedToChangeAbsence: any;
  @Input() changeInCalendar: any;


  step = 0;
  formSubmitted = false;
  PeriodeSalleForm: FormGroup;
  constructor(private loadingController: LoadingController,
    public db: DbService,
    private fb: FormBuilder,
    private modalCtrl: ModalController) { }

  ngOnInit() {
  }

  async onValiderAbsenceEtudiants() {

    if (this.changeInCalendar) {
      this.db.presentToast("Veuillez faire l'absence depuis votre emploi du temps.");
      return false;
    }

    const loading = await this.loadingController.create();
    await loading.present().then(async () => {

      if (this.selectedSeance.Sea_DateEffective != null) {
        await loading.dismiss();
        return false;
      }
      let notHandledEtudiants = this.etudiantDs.filter(x => x.isAbsent == null)
      if (notHandledEtudiants.length == 0 || environment.allowSubmitWithNotHandledEtudiants) {
        let absents = this.etudiantDs.filter(x => x.isAbsent)
        let presents = this.etudiantDs.filter(x => !x.isAbsent)
        //ouvrir le modalPeriodeSalle
        this.onModalPeriodeSalleOpen(false);//this.openModalPeriodeSalleContent(false)

      }
      else {
        this.db.presentToast("Veuillez terminer l'absence afin de pouvoir valider");//alert("Veuillez faire l'absence afin de pouvoir valider");
      }

      await loading.dismiss();
    });


  }

  onModifierAbsenceEtudiants() {
    // if (this.surveillantService.isModalEtudiantLoaderVisible) {// si isModalEtudiantLoaderVisible == true alors un enregistrement est deja en cours => empecher le user de valider a nouveau
    //   this.openSnackBar("Enregistrement en cours, veuillez patienter", "OK", 120);
    //   return false;
    // }
    if (!this.isAllowedToChangeAbsence) return false;
    let notHandledEtudiants = this.etudiantDs.filter(x => x.isAbsent == null)
    if (notHandledEtudiants.length == 0 || true) {//environment.allowSubmitWithNotHandledEtudiants) {
      let absents = this.etudiantDs.filter(x => x.isAbsent)
      let presents = this.etudiantDs.filter(x => !x.isAbsent)
      //ouvrir le modalPeriodeSalle
      this.onModalPeriodeSalleOpen(false);//this.openModalPeriodeSalleContent(false)
    }
    else {
      this.db.presentToast("Veuillez terminer l'absence afin de pouvoir valider");//alert("Veuillez faire l'absence afin de pouvoir valider");
    }
  }

  onEtudiantClick(EtdCrs_Id) {
    if (this.changeInCalendar) {
      this.db.presentToast("Veuillez faire l'absence depuis votre emploi du temps.");
      return false;
    }


    if (this.selectedSeance.Sea_DateEffective == null || (this.isAllowedToChangeAbsence && this.selectedSeance.Sea_DateEffective != null)) { //si la seance n'est pas encore validée ou la seance est validée aujourd hui
      if (this.etudiantDs.find(x => x.EtdCrs_Id == EtdCrs_Id).isAbsent == null) this.etudiantDs.find(x => x.EtdCrs_Id == EtdCrs_Id).isAbsent = false;
      else this.etudiantDs.find(x => x.EtdCrs_Id == EtdCrs_Id).isAbsent = !this.etudiantDs.find(x => x.EtdCrs_Id == EtdCrs_Id).isAbsent;
      this.filteredEtudiantsDataSource.find(x => x.EtdCrs_Id == EtdCrs_Id).isAbsent = this.etudiantDs.find(x => x.EtdCrs_Id == EtdCrs_Id).isAbsent
    }
  }

  onModalPeriodeSalleClose() {
    this.step = 0;
  }

  onModalPeriodeSalleValider() {

    if (this.changeInCalendar) {
      this.db.presentToast("Veuillez faire l'absence depuis votre emploi du temps.");
      return false;
    }

    if (!this.PeriodeSalleForm.valid)
      this.db.presentToast("Veuillez specifier la période et la salle");//alert("Veuillez specifier la période et la salle");
    else {
      const data = this.PeriodeSalleForm.value;
      //this.amc.onModalPeriodeSalleSubmit(this.date, this.hd, this.hf, this.salle, this.remarque, this.seance, this.etudiants, this.compSec, this.isUpdating);

      data.seance_modalPeriodeSalle = this.selectedSeance;
      data.etudiants_modalPeriodeSalle = this.etudiantDs;
      data.compSec_modalPeriodeSalle = this.selectedCompSec;

      this.onModalPeriodeSalleSubmit(data.date_modalPeriodeSalle, data.hd_modalPeriodeSalle, data.hf_modalPeriodeSalle, data.salle_modalPeriodeSalle, data.remarque_modalPeriodeSalle, data.seance_modalPeriodeSalle, data.etudiants_modalPeriodeSalle, data.compSec_modalPeriodeSalle, data.isUpdating_modalPeriodeSalle);
    }
  }


  close(val?) {
    this.modalCtrl.dismiss(val);
  }
  public initializePeriodeSalleForm(param?: any) {

    this.PeriodeSalleForm = new FormGroup({
      date_modalPeriodeSalle: new FormControl(param?.date_modalPeriodeSalle, Validators.required),
      hd_modalPeriodeSalle: new FormControl(param?.hd_modalPeriodeSalle, Validators.required),
      hf_modalPeriodeSalle: new FormControl(param?.hf_modalPeriodeSalle, Validators.required),
      salle_modalPeriodeSalle: new FormControl(param?.salle_modalPeriodeSalle, Validators.required),
      remarque_modalPeriodeSalle: new FormControl(param?.remarque_modalPeriodeSalle, Validators.required),
    });
  }


  get f() { return this.PeriodeSalleForm.controls; }

  async onModalPeriodeSalleOpen(forUpdate) {
    const isUpdating_modalPeriodeSalle = forUpdate;
    const param: any = {};
    if (!isUpdating_modalPeriodeSalle) {
      param.hd_modalPeriodeSalle = "";
      param.hf_modalPeriodeSalle = "";
      param.salle_modalPeriodeSalle = "";
      param. remarque_modalPeriodeSalle = "";
    }

    try {
      if (this.selectedSeance.Sea_DateDebutEffective != null && this.selectedSeance.Sea_DateDebutEffective != "") {
        param.date_modalPeriodeSalle = this.dateToString2(new Date(this.selectedSeance.Sea_DateDebutEffective));
        param.hd_modalPeriodeSalle = this.selectedSeance.Sea_DateDebutEffective.split("T")[1];
        param.hf_modalPeriodeSalle = this.selectedSeance.Sea_DateFinEffeEffective.split("T")[1];
        param.remarque_modalPeriodeSalle = this.selectedSeance.Sea_Remarque;
        param.salle_modalPeriodeSalle = this.selectedSeance.SalleEffective;
      }
      else {
        param.date_modalPeriodeSalle = this.dateToString2(new Date(this.selectedSeance.Sea_DateDebutPrevu));
        param.hd_modalPeriodeSalle = this.selectedSeance.Sea_DateDebutPrevu.split("T")[1];
        param.hf_modalPeriodeSalle = this.selectedSeance.Sea_DateFinPrevu.split("T")[1];
      }
    } catch (e) {
      param.date_modalPeriodeSalle = this.dateToString2(new Date());
    }

    this.initializePeriodeSalleForm(param);
    // try {
    //   this.hd_modalPeriodeSalle = this.selectedSeance.Sea_DateDebutPrevu.split("T")[1]
    //   this.hf_modalPeriodeSalle = this.selectedSeance.Sea_DateFinPrevu.split("T")[1]
    // } catch (e) { console.warn('Exception: ', e); }


    this.step = 1;
  }

  dateToString2(d) {
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + (d.getDate())).slice(-2);// + "T" + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":00"
  }

  dateToString(d) {
    return d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + (d.getDate())).slice(-2) + "T" + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":00"
  }


  //Valider absence ------------------------------------------------
  async onModalPeriodeSalleSubmit(date: string, hd: string, hf: string, salle: string, remarqueSeance: string, seance: any, etudiants: any[], compSec: any, isUpdating: boolean) {

    const loading = await this.loadingController.create();
    await loading.present().then(async () => {

    //Seance
    let Seance = seance
    for (var prop in compSec) {
      if (!Seance.hasOwnProperty(prop) && prop != "ABS_EtudiantComposantSection" && prop != "ABS_Seance" && prop != "PLS_SeanceEnum") Seance[prop] = compSec[prop]
    }

    let dd = new Date(date);
    let df = new Date(date);
    dd.setHours(+hd.split(":")[0], +hd.split(":")[1], 0);
    df.setHours(+hf.split(":")[0], +hf.split(":")[1], 0);
    Seance.Sea_DateDebutEffective = this.dateToString(dd);
    Seance.Sea_DateFinEffective = this.dateToString(df);
    Seance.Sea_DateFinEffeEffective = this.dateToString(df);
    Seance.SalleEffective = salle;
    Seance.Sea_Remarque = remarqueSeance;
    Seance.Intv_Nom = this.selectedCompSec.Intv_Nom
    Seance.Intv_Prenom = this.selectedCompSec.Intv_Prenom

    //liste de tt les etudiants (absents et presents)
    let Liste_Absents = etudiants//.filter(x => x.isAbsent)
      .map(x => {
        let Justif_Nom = null
        if (x.isAbsent == true) Justif_Nom = "NonJustifie";
        return {
          EtdCompSec_Id: x.EtdCompSec_Id,
          Sea_Id: seance.Sea_Id,
          EtdCrs_Id: x.EtdCrs_Id,
          Sea_Nom: seance.Sea_Nom,
          Sea_DateDebut: Seance.Sea_DateDebutEffective,//dd
          Sea_DateFin: Seance.Sea_DateFinEffeEffective,//df
          Sess_Nom: seance.Sess_Nom,
          Ann_Nom: seance.Ann_Nom,
          Sec_Nom: compSec.Section,
          //CompTyp_Nom : seance.CompTyp_Nom,
          CompTyp_Id: compSec.CompTyp_Id,
          CompTyp_Nom: compSec.Composante,
          Crs_Code: compSec.Crs_Code,
          Crs_Nom: compSec.Crs_Nom,
          Crs_Version: compSec.Crs_Version,
          Intv_Id: compSec.Intv_Id,
          Intv_NomComplet: this.selectedCompSec.Intv_Nom + " " + this.selectedCompSec.Intv_Prenom,
          Etd_NomComplet: x.Pers_Nom + " " + x.Pers_Prenom,
          Etd_Matricule: x.Etd_Matricule,
          Sms_Nom: x.Sms_Nom,
          Spec_Name: x.Spec_Name,
          Fac_Nom: seance.Fac_Nom,
          Justif_Nom: Justif_Nom,
          //ABS_Id: this.NewGuid(),
          Abs_Id: this.db.guid(),
          ABS_Remarque: x.Remarque,
          Abs_Remarque: x.Remarque,
        }
      });
    this.db.presentToast("Enregistrement en cours ....");
    this.SubmitAbsence({ Liste_Absents, Seance, isUpdating })
      .then(
        async (response: any) => {
          console.warn("response SubmitAbsence", response);
          await loading.dismiss();
          if (response != null && response.hasError) {
            this.db.presentToast("Erreur d'enregistrement de l'absence. " + response.message);
          } else {
            this.step = 0; //clear modal periode salle
            this.db.presentToast("Absence enregistré.");
            this.close(true);

          }
        },
        async (error) => {
          console.error("Erreur this.intervenantService.SubmitAbsence(): ", error);
          await loading.dismiss();
          this.db.presentToast("Erreur d'enregistrement de l'absence");
        }
      );


    });


  }

  SubmitAbsence(params) {

    if (!params.isUpdating)
      return this.db.postData('/api/ABS_ComposantSectionAPI/SubmitAbsence', params).toPromise()
    else
      return this.db.postData('/api/ABS_ComposantSectionAPI/UpdateAbsence', params).toPromise()

  }



}
