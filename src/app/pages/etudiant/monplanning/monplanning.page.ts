import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
// import { CalendarOptions, FullCalendarComponent } from '@fullcalendar/angular';
import { AlertController, MenuController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DbService } from 'src/app/shared/services/db.service';
import { UserService } from 'src/app/shared/services/user.service';
import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { CalendarOptions } from '@fullcalendar/core';
import { HelperService } from 'src/app/shared/services/helper.service';

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
    locale: 'fr',
    slotMinTime: '08:00:00',
    firstDay: 1,
    // eventTextColor: "#fff",
    // dateClick: this.handleDateClick.bind(this), // bind is important!
    eventClick: this.eventClick.bind(this),
    weekends: true, // initial value
    headerToolbar: { start: 'title', end: 'prev,next' },
    footerToolbar: { left: 'today', center: '', right: 'dayGridMonth,timeGridWeek,listWeek' },
    events: [],
    plugins: [dayGridPlugin, timeGridPlugin, listPlugin],
  };


  userData: any;
  events: any;
  dataSource: any = [];

  constructor(
    private menu: MenuController,
    private db: DbService,
    private user: UserService,
    private alertController: AlertController,
  ) { }

  ngOnInit() {
    this.menu.enable(true);
    // setTimeout(() => {
    //   this.calendarOptions = {
    //     initialView: 'timeGridWeek',
    //     locale: 'fr-FR',
    //     // eventTextColor: "#fff",
    //     slotMinTime: '08:00:00',
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
    //   this.setCalendarEvents(this.dataSource);      // this.calendarComponent.getApi().refetchEvents();

    // }, 100);

    // this.dataServ.seances$
    // .pipe(takeUntil(this._unsubscribeAll))
    // .subscribe((data: any) => {
    //   if (data == null) {
    //     this.setCalendarEvents([]);
    //     return;
    //   }

    //   this.ComposantSectionDS = data.ABS_ComposantSections;
    //   this.SeancesDS = data.ABS_Seances;
    //   this.setCalendarEvents(data.ABS_Seances);
    // });

    this.user.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        this.userData = data;
        if (this.userData != null) {
          this.GetEtdAgenda()
        }
      });


  }



  GetEtdAgenda() {
    return this.db.loadAgendaEtd().then((response: any) => {
      console.log("Response GetEtdAgenda: ", response);
      if (response == null) this.db.presentToast("Erreur de chargement des séances.");
      else {
        this.dataSource = response.map((x: any) => {
          x.id = x.Sea_Id;

          // x.title = x.Crs_Code + " | " + x.Sea_Nom + " | " + x.Composante + " | " + (x.SalleEffective ? x.SalleEffective : x.Salle);
          // x.title = x.Sea_Nom + " " + x.Crs_Code + " " + x.Composante + " " + x.Section + " " + (x.SalleEffective ? x.SalleEffective : x.Salle);
          x.title = x.Sea_Nom + " " + x.Crs_Code + " " + x.Composante + " " + (x.SalleEffective ? x.SalleEffective : x.Salle);

          x.start = (x.Sea_DateDebutEffective ? x.Sea_DateDebutEffective : x.Sea_DateDebutPrevu);
          x.end = (x.Sea_DateFinEffeEffective ? x.Sea_DateFinEffeEffective : x.Sea_DateFinPrevu);
          x.editable = false;
          // if (x.Sea_DateDebutEffective != null) x.backgroundColor = "#2ecc71";
          // else x.backgroundColor = "#007ad9";
          if (x.EtatSea_Nom == "COMPLÉTÉE" || x.Sea_DateDebutEffective != null) {
            x.className = "complete";
            x.backgroundColor = "#2ecc71";
          }
          else if (x.EtatSea_Nom == "ANNULEE") {
            x.className = "annule";
            x.backgroundColor = "#a7a7a7";
          }
          else {
            x.className = "autre";
            x.backgroundColor = "#007ad9"
          }
          return x;
        });
        this.setCalendarEvents(this.dataSource);

      }
    }, (error) => {
      this.db.presentToast("Erreur de chargement des séances.");
    });
  }

  // if (x.EtatSea_Nom == "COMPLÉTÉE" || x.Sea_DateDebutEffective != null) { x.backgroundColor = "#2ecc71"; }
  //           else if (x.EtatSea_Nom == "ANNULEE") { x.backgroundColor = "#a7a7a7"; }
  //           else x.backgroundColor = "#007ad9";


  public GetSeanceAbsents(sea_id) {
    return this.db.getData('api/ABS_ComposantSectionAPI/GetSeanceAbsents/' + sea_id)
  }

  doRefresh(event) {
    setTimeout(() => {
      this.GetEtdAgenda();
      event.target.complete();
    }, 2000);
  }

  setCalendarEvents(datasource: any[]) {
    this.calendarOptions.events = datasource;
    const today = new Date();
    this.events = this.dataSource
      .filter(x => x.start.includes(today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2)))
  }

  handleDateClick(arg) {
    this.events = this.dataSource.filter(x => x.start.includes(arg.dateStr))
  }

  async eventClick(arg) {

    let sea_id = arg.event.id;
    let event = this.dataSource.find(x => x.Sea_Id == sea_id);
    console.log("event: ", event)


    let dd = event.Sea_DateDebutPrevu;
    let df = event.Sea_DateFinPrevu;

    let salle = event.Salle;
    if (event.SalleEffective != null) salle = event.SalleEffective;

    if (event.Sea_DateDebutEffective != null) {
      dd = event.Sea_DateDebutEffective;
      df = event.Sea_DateFinEffeEffective;
    }

    dd = new Date(dd)
    df = new Date(df)

    const alert = await this.alertController.create({
      header: `${event.Composante} - ${event.Crs_Nom} (${event.Crs_Code}) `,
      subHeader: `Salle: ${salle}`,
      message: `Seance n°${event.Sea_Nom} le ${HelperService.getFormattedDate(dd)} de ${HelperService.getFormattedTime(dd)} à ${HelperService.getFormattedTime(df)}`,
      buttons: ['OK'],
      animated: true,
      backdropDismiss: true,

    });

    await alert.present();

    this.events = this.dataSource.filter(x => x.start.includes(arg.event?.extendedProps?.Sea_DatePrevu.split('T')[0]))
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
