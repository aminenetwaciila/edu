import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonAccordionGroup, ToastController } from '@ionic/angular';
import { EnfantService } from '../Services/enfant.service';
import { TuteurApiService } from '../Services/tuteur-api.service';
import { EtudiantAnneesEtSemesters, EtudiantSemester } from '../Types/EtudiantAnneeAndSemesters.type';
import { Subscription } from 'rxjs';
import { ModuleNotes, SemesterNotes } from '../Types/NotesPageTypes.types';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-enfant-notes',
  templateUrl: './enfant-notes.component.html',
  styleUrls: ['./enfant-notes.component.scss'],
  standalone: false,
})
export class EnfantNotesComponent implements OnInit, OnDestroy {

  @ViewChild('accordion') accordion: IonAccordionGroup;
  openMenus: string[] = []
  yearsAndSemesters: EtudiantAnneesEtSemesters[] = []
  selectedYear: string = null;
  selectedSemester: string = null;
  semesters: EtudiantSemester[] = [];

  fetchedFirstTime = false;
  loadingNotes = false;
  disableInputs = false;
  semesterNotes: SemesterNotes = null;

  private yearsAndSemestersSubs$?: Subscription;

  constructor(
    private ttrApiService: TuteurApiService,
    private enfantService: EnfantService,
    private toastCtrl: ToastController,
    private translater: TranslateService) { }

  ngOnInit() {
    this.yearsAndSemesters = this.enfantService.yearsAndSemesters;
    this.yearsAndSemestersSubs$ = this.enfantService.yearsAndSemestersSubj.subscribe((yearsAndSemesters) => {
      this.yearsAndSemesters = yearsAndSemesters;
    })
  }

  ngOnDestroy() {
    this.yearsAndSemestersSubs$?.unsubscribe();
    this.yearsAndSemesters = []
    this.fetchedFirstTime = false;
    this.disableInputs = false;
    this.loadingNotes = false;
    this.semesterNotes = null;
  }

  accordionGroupChange = (ev: any) => {
    const value = ev.detail.value;
    if (typeof (value) == 'string')
      this.openMenus = [value];
    else
      this.openMenus = value
  }

  updateSemesters() {
    this.selectedSemester = null;
    this.semesters = this.yearsAndSemesters.find((year) => year.Ann_Id == this.selectedYear)?.semesters || [];
    this.updateNotes();
  }

  updateNotes() {
    if (!this.selectedYear || !this.selectedSemester)
      return;
    this.fetchedFirstTime = true;
    this.disableInputs = true;
    this.loadingNotes = true;
    const etd_id = this.enfantService.currentEnfant.Etd_Id;
    this.ttrApiService.getEtudiantNotes(etd_id, this.selectedYear, this.selectedSemester).subscribe({
      next: (notes) => {
        this.disableInputs = false;
        this.loadingNotes = false;
        this.semesterNotes = notes;
      },
      error: (err) => {
        this.disableInputs = false;
        this.loadingNotes = false;
        this.fetchedFirstTime = false;
        this.selectedSemester = null;
        this.selectedYear = null;
        this.translater.get("TTR.TAB2.MARKS.FETCH_ERROR").subscribe((msg) => {
          this.toastCtrl.create({
            message: msg,
            duration: 3000,
            color: 'danger'
          }).then((toast) => {
            toast.present();
          })
        })
      }
    })
  }

  countTotalAbsencies() {
    let count = 0;
    this.semesterNotes.modules.forEach((module) => {
      module.elements.forEach((element) => {
        count += element.nbr_absence;
      })
    })
    return count;
  }

  countModuleAbsencies(module: ModuleNotes) {
    let count = 0;
    module.elements.forEach((element) => {
      count += element.nbr_absence;
    })
    return count;
  }

  checkValide(valide: string) {
    return valide.indexOf('n') == -1;
  }
}
