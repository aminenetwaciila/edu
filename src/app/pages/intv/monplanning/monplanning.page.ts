import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
// import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { ActionSheetController, IonRouterOutlet, MenuController, ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataService } from 'src/app/shared/services/data.service';
import { DbService } from 'src/app/shared/services/db.service';
import { UserService } from 'src/app/shared/services/user.service';
import { environment } from 'src/environments/environment';
import { ParticipantsPage } from '../participants/participants.page';
import { CalendarOptions } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

@Component({
  selector: 'app-monplanning',
  templateUrl: './monplanning.page.html',
  styleUrls: ['./monplanning.page.scss'],
  standalone: false,
})
export class MonplanningPage implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    locale: 'fr-FR',
    slotMinTime: '08:00:00',
    firstDay: 1,
    weekends: true, // initial value
    // eventTextColor: "#fff",
    // dateClick: this.handleDateClick.bind(this), // bind is important!
    eventClick: this.eventClick.bind(this),
    headerToolbar: {
      start: 'title', end: 'prev,next'
    },
    footerToolbar: { left: 'today', center: '', right: 'dayGridMonth,timeGridWeek,listWeek' },
    events: [],
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
  };
  userData: any;
  events: any;
  ComposantSectionDS: any;
  SeancesDS: any;

  constructor(private menu: MenuController,
    private db: DbService,
    private user: UserService,
    private actionSheetController: ActionSheetController,
    private dataServ: DataService,
    private routerOutlet: IonRouterOutlet,
    private modalController: ModalController) { }

  ngOnInit() {
    this.menu.enable(true);
    // setTimeout(() => {
    //   this.calendarOptions = {
    //     initialView: 'timeGridWeek',
    //     locale: 'fr-FR',
    //     slotMinTime: '08:00:00',
    //     // eventTextColor: "#fff",
    //     // dateClick: this.handleDateClick.bind(this), // bind is important!
    //     eventClick: this.eventClick.bind(this),
    //     weekends: true, // initial value
    //     headerToolbar: {
    //       start: 'title', end: 'prev,next'
    //     },
    //     footerToolbar: { left: 'today', center: '', right: 'dayGridMonth,timeGridWeek,listWeek' },
    //     events: [],
    //     plugins: [dayGridPlugin, timeGridPlugin],
    //   };
    //   // this.calendarComponent.getApi().refetchEvents();

    // }, 100);

    this.dataServ.seances$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        if (data == null) {
          this.setCalendarEvents([]);
          return;
        }

        this.ComposantSectionDS = data.ABS_ComposantSections;
        this.SeancesDS = data.ABS_Seances;
        this.setCalendarEvents(data.ABS_Seances);
      });

    this.user.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        this.userData = data;
        if (this.userData != null)
          this.db.loadSeances();
      });
  }

  doRefresh(event) {
    setTimeout(() => {
      this.db.loadSeances();
      event.target.complete();
    }, 2000);
  }

  public GetSeanceAbsents(sea_id) {
    return this.db.getData('/api/ABS_ComposantSectionAPI/GetSeanceAbsents/' + sea_id)
  }

  setCalendarEvents(ABS_Seances: any[]) {

    let seances = ABS_Seances.map((item) => {
      let obj = item;

      obj.id = item.Sea_Id;
      obj.start = (item.Sea_DateDebutEffective ? item.Sea_DateDebutEffective : item.Sea_DateDebutPrevu);
      obj.end = (item.Sea_DateFinEffeEffective ? item.Sea_DateFinEffeEffective : item.Sea_DateFinPrevu);
      obj.allDay = false;
      obj.editable = false;
      obj.title = item.Sea_Nom + " " + item.Crs_Code + " " + item.Composante + " " + item.Section + " " + (item.SalleEffective ? item.SalleEffective : item.Salle);

      if (item.EtatSea_Nom == "COMPLÉTÉE" || item.Sea_DateDebutEffective != null) {
        obj.className = "complete";
        obj.backgroundColor = "#2ecc71";
      }
      else if (item.EtatSea_Nom == "ANNULEE") {
        obj.className = "annule";
        obj.backgroundColor = "#a7a7a7";
      }
      else {
        obj.className = "autre";
        obj.backgroundColor = "#007ad9"
      };

      return obj;
    });

    this.calendarOptions.events = seances;
    const today = new Date();

    this.events = seances
      .filter(x => x.start.includes(today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2)))
  }

  handleDateClick(arg) {
    this.events = this.SeancesDS.filter(x => x.start.includes(arg.dateStr))
  }

  eventClick(arg) {
    // console.log(new Date(arg.event?.extendedProps?.Sea_DatePrevu))
    // console.log(new Date())
    if (new Date(arg.event?.extendedProps?.Sea_DatePrevu) > new Date()) {
      this.db.presentToast('Cette séance ne peut être effectué car sa plage horaire n\'est pas encore atteinte.')
      return;
    }
    this.onSeanceSelected(arg.event?.id)

    // this.events = this.SeancesDS
    // .filter(x => x.start.includes(arg.event?.extendedProps?.Sea_DatePrevu.split('T')[0]))
  }

  async openparticipants(selectedSeance, etudiantDs, filteredEtudiantsDataSource, selectedCompSec, isAllowedToChangeAbsence) {
    const modal = await this.modalController.create({
      component: ParticipantsPage,
      componentProps: {
        selectedSeance,
        etudiantDs,
        filteredEtudiantsDataSource,
        selectedCompSec,
        isAllowedToChangeAbsence,
        changeInCalendar: false
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


  onSeanceSelected(Sea_Id) {

    let isAllowedToChangeAbsence = false; // parDefaut ne pas autoriser l'intv a modifier l'absence d'un seance deja traitée.
    const selectedSeance = this.SeancesDS.find(x => x.Sea_Id == Sea_Id);
    const selectedCompSec = this.ComposantSectionDS.find(x => x.CompSec_Id == selectedSeance.CompSec_Id)

    // console.log("selectedSeance: ", selectedSeance);

    //si l'absence de la seance est deja validé ==> recuperer l'etat de l'absence de chaque etd.
    let dateToCheck = selectedSeance.Sea_TimeStamp;
    if (dateToCheck == null || dateToCheck == "")
      dateToCheck = selectedSeance.Sea_DateEffective;

    if (dateToCheck != null) {

      //si la date de la seance est la mm que la date du jour, alors autoriser l'intv a modifier l'absence/seance
      // if (new Date(selectedSeance.Sea_DateEffective) < new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59) &&
      //   new Date(selectedSeance.Sea_DateEffective) > new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0) && selectedCompSec.Composante != "Examen")

      if (new Date(dateToCheck) < new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59) &&
        new Date(dateToCheck) > new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0) && selectedCompSec.Composante != "Examen")
        isAllowedToChangeAbsence = true;
      else isAllowedToChangeAbsence = false;
      if (isAllowedToChangeAbsence)
        this.db.presentToast("Vous pouvez modifier l'absence si vous le souhaitez.");

      let selectedSeanceAbsents = [];
      this.GetSeanceAbsents(selectedSeance.Sea_Id)
        .then(
          (response: any) => {
            console.log("response GetSeanceAbsents: ", response)
            selectedSeanceAbsents = response;
            //mettre l'etat des etd dans ABS_EtudiantComposantSection par rapport a abs_absence
            let etudiantsDataSource = selectedCompSec.ABS_EtudiantComposantSection
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

            //ajouter les les etudiants qui figurent dans ABS_Absence mais pas dans ABS_EtudiantComposantSection (exemple etd qui a assister a la seance mais il a changer de section)
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

            const filteredEtudiantsDataSource = etudiantsDataSource;

            this.openparticipants(selectedSeance, etudiantsDataSource, filteredEtudiantsDataSource, selectedCompSec, isAllowedToChangeAbsence);
          },
          (error) => {
            console.error("Erreur this.intervenantService.GetSeanceAbsents(" + selectedSeance.Sea_Id + ", " + selectedSeance.CompSec_Id + "): ", error);
            this.db.presentToast("Erreur de récupération de l'absence de cette séance.");
          }
        );

    } else {
      if (selectedCompSec.Composante == "Examen") this.db.presentToast("Vous n'êtes pas autorisé à faire cette action.");
      else {
        let etudiantsDataSource = selectedCompSec.ABS_EtudiantComposantSection
          .map(x => {
            return {
              Etd_Id: x.Etd_Id, EtdCrs_Id: x.EtdCrs_Id, Etd_Matricule: x.Etd_Matricule, Pers_Nom: x.Pers_Nom, Pers_Prenom: x.Pers_Prenom,
              EtdCompSec_Id: x.EtdCompSec_Id,
              photo: environment.edu + "/Images/abs_poly1920/" + x.Etd_Matricule + ".jpg", isRemarqueVisisble: false, Remarque: "",
              Sms_Nom: x.Sms_Nom,
              Spec_Name: x.Spec_Name,
              isAbsent: null, readOnly: false,
            }
          });
        let filteredEtudiantsDataSource = etudiantsDataSource;
        this.openparticipants(selectedSeance, etudiantsDataSource, filteredEtudiantsDataSource, selectedCompSec, isAllowedToChangeAbsence); //open modal
      }
    }
  }

  async eventAction(id?) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Actions',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Participants',
          icon: 'people',
          handler: () => {
            this.onSeanceSelected(id)
          }
        },
        {
          text: 'Fermer',
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
    });
    await actionSheet.present();

    const { role, data } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role and data', role, data);
  }



  /**
    * On destroy
    */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
