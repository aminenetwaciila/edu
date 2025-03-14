import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataService } from 'src/app/shared/services/data.service';
import { DbService } from 'src/app/shared/services/db.service';
import { environment } from 'src/environments/environment';
import { ParticipantsPage } from '../participants/participants.page';
import { UpdateSeancePage } from '../update-seance/update-seance.page';

@Component({
  selector: 'app-listes-seances',
  templateUrl: './listes-seances.page.html',
  styleUrls: ['./listes-seances.page.scss'],
  standalone: false,
})
export class ListesSeancesPage implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  matiere: any;
  seances = [];
  type = '';
  selectedCompSec: any;
  selectedSeance: any;
  constructor(
    private db: DbService,
    private _dataService: DataService,
    private modalCtrl: ModalController,
    private routerOutlet: IonRouterOutlet,
    private route: ActivatedRoute,
    private _changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {
    // Get the offres
    this._dataService.matiere$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((matiere: any) => {
        this.matiere = matiere;
        if (this.matiere.hasOwnProperty('ABS_Seances')) {
          this.seances = this.matiere.ABS_Seances;
          this.type = 'progression';
        } else {
          this.seances = this.matiere.PLS_SeanceEnum;
          this.type = 'matieres';
        }
        this._changeDetectorRef.markForCheck();
      });

    this.route.queryParams.subscribe((params: any) => {
      if (params.selectedCompSec != null) {
        this.selectedCompSec = JSON.parse(params.selectedCompSec);
      }
    });
  }




  async updateSeanceModal(seance) {


    if (new Date(seance.Sea_DateEffective) < new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59) &&
      new Date(seance.Sea_DateEffective) > new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0)) { }
    else {
      this.db.presentToast("Délai dépassé, vous ne pouvez modifier la séance.");
      return false;
    }


    const modal = await this.modalCtrl.create({
      component: UpdateSeancePage,
      cssClass: '',
      componentProps: {
        'param': JSON.stringify(seance)
      },
      // swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    return await modal.present();
  }


  onSeanceSelected(SeaEnum_Id) {
    let isAllowedToChangeAbsence = false; // parDefaut ne pas autoriser l'intv a modifier l'absence d'un seance deja traitée.
    this.selectedSeance = this.selectedCompSec.PLS_SeanceEnum.find(x => x.SeaEnum_Id == SeaEnum_Id);

    //si l'absence de la seance est deja validé ==> recuperer l'etat de l'absence de chaque etd.
    if (this.selectedSeance.Sea_DateEffective != null) {

      //si la date de la seance est la mm que la date du jour, alors autoriser l'intv a modifier l'absence/seance
      if (new Date(this.selectedSeance.Sea_DateEffective) < new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59) &&
        new Date(this.selectedSeance.Sea_DateEffective) > new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0) && this.selectedCompSec.Composante != "Examen")
        isAllowedToChangeAbsence = true;
      else isAllowedToChangeAbsence = false;
      if (isAllowedToChangeAbsence)
        this.db.presentToast("Vous pouvez modifier l'absence si vous le souhaitez.");

      let selectedSeanceAbsents = [];
      this.db.getData('/api/ABS_ComposantSectionAPI/GetSeanceAbsents/' + this.selectedSeance.Sea_Id)
        .then(
          (response: any) => {
            selectedSeanceAbsents = response;
            //mettre l'etat des etd dans ABS_EtudiantComposantSection par rapport a abs_absence
            const etudiantsDataSource = this.selectedCompSec.ABS_EtudiantComposantSection
              .map(x => {
                let isAbsent = null;
                let etdABS_Absence = selectedSeanceAbsents.find(a => a.Etd_Matricule == x.Etd_Matricule);
                if (etdABS_Absence != null && etdABS_Absence.Justif_Nom != null && etdABS_Absence.Justif_Nom == "NonJustifie") isAbsent = true;
                else if (etdABS_Absence != null) isAbsent = false;
                return {
                  Etd_Id: x.Etd_Id,
                  EtdCrs_Id: x.EtdCrs_Id,
                  Etd_Matricule: x.Etd_Matricule,
                  Pers_Nom: x.Pers_Nom,
                  Pers_Prenom: x.Pers_Prenom,
                  EtdCompSec_Id: x.EtdCompSec_Id,
                  Sms_Nom: x.Sms_Nom,
                  Spec_Name: x.Spec_Name,
                  //photo: environment.globalURL + "/Images/abs_poly1920/" + x.Etd_Matricule + ".jpg",
                  photo: environment.edu + "/Images/abs_poly1920/" + x.Etd_Matricule + ".jpg",
                  isRemarqueVisisble: false,
                  Remarque: etdABS_Absence != null ? etdABS_Absence.Abs_Remarque : "",
                  isAbsent: isAbsent,//selectedSeanceAbsents.find(a => a.EtdCompSec_Id == x.EtdCompSec_Id) != null ? true : false,
                  readOnly: isAllowedToChangeAbsence ? false : true,
                }
              });

            selectedSeanceAbsents.forEach((abs_absence) => {
              //let etdFound = this.etudiantsDataSource.find(x => x.EtdCompSec_Id == abs_absence.EtdCompSec_Id);
              let etdFound = etudiantsDataSource.find(x => x.Etd_Matricule == abs_absence.Etd_Matricule);
              if (etdFound == null) {
                let objToAdd = {
                  Etd_Id: abs_absence.Etd_Id,
                  EtdCrs_Id: abs_absence.EtdCrs_Id,
                  Etd_Matricule: abs_absence.Etd_Matricule,
                  Pers_Nom: abs_absence.Etd_NomComplet,
                  Pers_Prenom: "",
                  Etd_NomComplet: abs_absence.Etd_NomComplet,
                  EtdCompSec_Id: abs_absence.EtdCompSec_Id,
                  //photo: environment.globalURL + "/Images/abs_poly1920/" + abs_absence.Etd_Matricule + ".jpg",
                  photo: environment.edu + "/Images/abs_poly1920/" + abs_absence.Etd_Matricule + ".jpg",
                  Sms_Nom: abs_absence.Sms_Nom,
                  Spec_Name: abs_absence.Spec_Name,
                  isRemarqueVisisble: false,
                  Remarque: abs_absence.Abs_Remarque,
                  isAbsent: abs_absence.Justif_Nom != null && abs_absence.Justif_Nom == "NonJustifie" ? true : false,
                  readOnly: isAllowedToChangeAbsence ? false : true, //Sms_Nom: "", Spec_Name: ""
                }
                etudiantsDataSource.push(objToAdd);
              }
            });

            let filteredEtudiantsDataSource = etudiantsDataSource;
            this.openparticipants(this.selectedSeance, etudiantsDataSource, filteredEtudiantsDataSource, this.selectedCompSec, isAllowedToChangeAbsence); //open modal

            // this.open(this.modalEtudiantsContent); //open modal
            //alert("You can change absence");
            //else alert("YOU CANT CHANGE ABS");
          },
          (error) => console.error("Erreur this.intervenantService.GetSeanceAbsents(" + this.selectedSeance.Sea_Id + ", " + this.selectedSeance.CompSec_Id + "): ", error)
        );

    } else {
      let etudiantsDataSource = this.selectedCompSec.ABS_EtudiantComposantSection
        .map(x => {
          return {
            Etd_Id: x.Etd_Id, EtdCrs_Id: x.EtdCrs_Id, Etd_Matricule: x.Etd_Matricule, Pers_Nom: x.Pers_Nom, Pers_Prenom: x.Pers_Prenom,
            EtdCompSec_Id: x.EtdCompSec_Id, photo: environment.edu + "/Images/abs_poly1920/" + x.Etd_Matricule + ".jpg", isRemarqueVisisble: false, Remarque: "",
            Sms_Nom: x.Sms_Nom,
            Spec_Name: x.Spec_Name,
            isAbsent: null, readOnly: false,
          }
        });
      let filteredEtudiantsDataSource = etudiantsDataSource;
      // this.open(this.modalEtudiantsContent); //open modal
      this.openparticipants(this.selectedSeance, etudiantsDataSource, filteredEtudiantsDataSource, this.selectedCompSec, isAllowedToChangeAbsence); //open modal

    }

  }

  async openparticipants(selectedSeance, etudiantDs, filteredEtudiantsDataSource, selectedCompSec, isAllowedToChangeAbsence) {
    const modal = await this.modalCtrl.create({
      component: ParticipantsPage,
      componentProps: {
        selectedSeance,
        etudiantDs,
        filteredEtudiantsDataSource,
        selectedCompSec,
        isAllowedToChangeAbsence,
        changeInCalendar: true
      },
      // swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data != null && data == true) {
      this.db.loadSeances();
    }
  }


}
