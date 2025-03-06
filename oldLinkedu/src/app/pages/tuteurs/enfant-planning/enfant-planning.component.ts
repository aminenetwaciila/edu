import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LocaleService } from 'src/app/shared/services/LocaleService';
import { EnfantService } from '../Services/enfant.service';
import { TuteurApiService } from '../Services/tuteur-api.service';

@Component({
  selector: 'app-enfant-planning',
  templateUrl: './enfant-planning.component.html',
  styleUrls: ['./enfant-planning.component.scss'],
})
export class EnfantPlanningComponent implements OnInit, OnDestroy {

  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  
  calendarOptions: CalendarOptions = {
    initialView: 'timeGridWeek',
    locale: 'fr-FR',
    slotMinTime: '08:00:00',
    slotMaxTime: "19:00:00",
    slotLabelFormat:{
      hour: '2-digit',
      minute: '2-digit',
      omitZeroMinute: true,
      meridiem: 'short'
    },
    // eventTextColor: "#fff",
    dateClick: this.handleDateClick.bind(this), // bind is important!
    eventClick: this.eventClick.bind(this),
    weekends: true, // initial value
    headerToolbar: {
      start: 'title', end: 'prev,next'
    },
    hiddenDays: [ 0 ],
    footerToolbar: { left: 'today', center: '', right: 'dayGridMonth,timeGridWeek,listWeek' },
    events: [],
    allDaySlot: false,
    themeSystem: "standard"
  }; 

  dataSource: any = [];

  loading=true

  private enfSub$ ?: Subscription;


  constructor( 
    private localeService: LocaleService,
    private apiService: TuteurApiService,
    private enfantService: EnfantService,
    private toastCtrl :ToastController,
    private translater: TranslateService
  ) { 

    this.enfSub$ = this.enfantService.currentSelectedEnfantSubj.subscribe(e=>{
      this.getEvents();
    })
  }

  ngOnDestroy(): void {
    this.loading = true
    this.enfSub$?.unsubscribe()
  }


  ngOnInit() {

    const local = this.localeService.currentLocale=='en'? 'en': 'fr';

    setTimeout(() => {
      this.calendarOptions = {
        initialView: 'timeGridWeek',
        locale: local,
        dayHeaderFormat:{
          weekday: 'short',
        },
        hiddenDays: [ 0 ],
        // eventTextColor: "#fff",
        slotMinTime: '08:00:00',
        slotMaxTime: "19:00:00",
        slotLabelFormat:{
          hour: '2-digit',
          minute: '2-digit',
          omitZeroMinute: true,
          meridiem: 'lowercase',
          hour12:false
        },
        dateClick: this.handleDateClick.bind(this), // bind is important!
        eventClick: this.eventClick.bind(this),
        weekends: true, // initial value
        headerToolbar: {
          start: 'title', end: 'prev,next'
        },
        footerToolbar: { left: 'today', center: '', right: 'dayGridMonth,timeGridWeek,listWeek', },
        events: [],
        allDaySlot: false,
        themeSystem: "standard"
      }; 

    }, 100);

    setTimeout(()=>{
      this.getEvents().then(()=>{
        this.loading=false;
      })
    },100)

  }


  getEvents(){
    return this.apiService.getEnfantEmploi( this.enfantService.currentEnfant.Etd_Matricule ).toPromise().then((response:any)=>{

        if (response == null) {

          this.translater.get('TTR.TAB2.PLANNING.FETCH_ERROR').subscribe((res: string) => {
            this.toastCtrl.create({
              message: res,
              duration: 3000,
              color: 'danger',
              position: 'bottom',
              cssClass: 'toast'
            }).then((toastData)=>{
              toastData.present();
            });
          })

        } else if(response.length == 0){
          
          this.translater.get('TTR.TAB2.PLANNING.NO_PLANNING').subscribe((res: string) => {
            this.toastCtrl.create({
              message: res,
              duration: 3000,
              color: 'warning',
              position: 'bottom',
              cssClass: 'toast'
            }).then((toastData)=>{
              toastData.present();
            });
          })

        } else {
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
              x.className = "complete"  ;
              x.backgroundColor = "#2ecc71"; 
            }
            else if (x.EtatSea_Nom == "ANNULEE") { 
              x.className = "annule" ;
              x.backgroundColor = "#a7a7a7"; 
            }
            else {
              x.className = "autre" ;
              x.backgroundColor = "#007ad9"
            }
            return x;
          });
          this.setCalendarEvents(this.dataSource);
        }

      }).catch(error=>{
        this.translater.get('TTR.TAB2.PLANNING.FETCH_ERROR').subscribe((res: string) => {
          this.toastCtrl.create({
            message: res,
            duration: 3000,
            color: 'danger',
            position: 'bottom',
            cssClass: 'toast'
          }).then((toastData)=>{
            toastData.present();
          });
        })
      })
  }


  setCalendarEvents(datasource: any[]) {
    this.calendarOptions.events = datasource;
  }


  handleDateClick(arg) {
    console.log("handleDateClick:")
    console.log(arg)
   }

  eventClick(arg) {
    console.log("eventClick:")
    console.log(arg)
  }

  doRefresh(event) {
    setTimeout(() => {
      this.getEvents();
      event.target.complete();
    }, 2000);
  }

}
