import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core'
import { IonAccordionGroup, ToastController } from '@ionic/angular'
import { TranslateService } from '@ngx-translate/core'
import { EnfantService } from '../Services/enfant.service'
import { TuteurApiService } from '../Services/tuteur-api.service'
import {
  EtudiantAnneesEtSemesters,
  EtudiantSemester,
} from '../Types/EtudiantAnneeAndSemesters.type'
import { Subscription } from 'rxjs'
import { ElementAbsence, ModuleAbsence, SemesterAbsences } from '../Types/AbsencesPageTypes.types'


@Component({
  selector: 'app-enfant-absence',
  templateUrl: './enfant-absence.component.html',
  styleUrls: ['./enfant-absence.component.scss'],
})
export class EnfantAbsenceComponent implements OnInit, OnDestroy {
  @ViewChild('accordion') accordion: IonAccordionGroup
  openMenus: string[] = []
  yearsAndSemesters: EtudiantAnneesEtSemesters[] = []
  selectedYear: string = null
  selectedSemester: string = null
  semesters: EtudiantSemester[] = []

  fetchedFirstTime = false
  loadingAbsences = false
  disableInputs = false
  semesterAbsences: SemesterAbsences = null
  private yearsAndSemestersSubs$?: Subscription

  constructor(
    private ttrApiService: TuteurApiService,
    private enfantService: EnfantService,
    private toastCtrl: ToastController,
    private translater: TranslateService,
  ) { }

  ngOnInit() {
    this.yearsAndSemesters = this.enfantService.yearsAndSemesters
    this.yearsAndSemestersSubs$ = this.enfantService.yearsAndSemestersSubj.subscribe(
      (yearsAndSemesters) => {
        this.yearsAndSemesters = yearsAndSemesters
      },
    )
  }

  ngOnDestroy() {
    this.yearsAndSemestersSubs$?.unsubscribe()
    this.yearsAndSemesters = []
    this.fetchedFirstTime = false
    this.disableInputs = false
    this.loadingAbsences = false
    this.semesterAbsences = null
  }

  accordionGroupChange = (ev: any) => {
    const value = ev.detail.value
    if (typeof value == 'string') this.openMenus = [value]
    else this.openMenus = value
  }

  updateSemesters() {
    this.selectedSemester = null
    this.semesters =
      this.yearsAndSemesters.find((year) => year.Ann_Id == this.selectedYear)
        ?.semesters || []
    this.updateAbsences()
  }

  updateAbsences() {
    if (!this.selectedYear || !this.selectedSemester) return
    this.fetchedFirstTime = true
    this.disableInputs = true
    this.loadingAbsences = true
    const etd_id = this.enfantService.currentEnfant.Etd_Id
    this.ttrApiService
      .getEtudiantAbsences(etd_id, this.selectedYear, this.selectedSemester)
      .subscribe({
        next: (absences) => {
          this.disableInputs = false
          this.loadingAbsences = false
          this.semesterAbsences = absences; //notes
        },
        error: (err) => {
          this.disableInputs = false
          this.loadingAbsences = false
          this.fetchedFirstTime = false
          this.selectedSemester = null
          this.selectedYear = null
          this.translater.get('TTR.TAB2.ABSENCE.FETCH_ERROR').subscribe((msg) => {
            this.toastCtrl
              .create({
                message: msg,
                duration: 3000,
                color: 'danger',
              })
              .then((toast) => {
                toast.present()
              })
          })
        },
      })
  }

  countTotalAbsencies(){
    let sum = 0;
    this.semesterAbsences.modules.forEach(module => {
      sum += this.moduleAbsences(module);
    });
    return sum;
  }

  sumTotalAbsencies(){
    let sum = 0;
    this.semesterAbsences.modules.forEach(module => {
      sum += this.sumModuleAbsences(module);
    });
    return sum;
  }

  sumElementAbsences( element:ElementAbsence){
    let hours = 0
    element.absences.forEach(absence => {
      let [deb_h, deb_m] = absence.debut.split(":")
      let [fin_h, fin_m] = absence.fin.split(":")
      hours += (parseInt(fin_h) - parseInt(deb_h)) + (parseInt(fin_m) - parseInt(deb_m))/60
    });
    return hours
  }

  sumModuleAbsences( module : ModuleAbsence){
    let hours = 0
    module.elements.forEach(element => {
      hours += this.sumElementAbsences(element)
    });
    return hours
  }

  elementAbsences( element:ElementAbsence){
    return element.absences.length;
  }

  moduleAbsences( module : ModuleAbsence){
    let sum = 0;
    module.elements.forEach(element => {
      sum += this.elementAbsences(element);
    });
    return sum;
  }
}
