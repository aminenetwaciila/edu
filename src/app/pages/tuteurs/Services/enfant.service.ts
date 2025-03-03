import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { Enfant } from '../Types/Enfant.type';
import { NonApprovedEnfant } from '../Types/NonApprovedEnfant.type';
import { TuteurApiService } from './tuteur-api.service';
import { GenderListItem } from '../Types/GenderListItem.type';
import { EtudiantAnneesEtSemesters } from '../Types/EtudiantAnneeAndSemesters.type';




@Injectable()
export class EnfantService {

  private cenfantIndex = null;
  currentSelectedEnfantSubj: Subject<Enfant> = new Subject<Enfant>();

  private readonly aprovedEnfantsKey = "enfants";
  private readonly nonAprovedEnfantsKey = "nonAprovedEnfants";

  private aprovedEnfants: Enfant[] = []
  private nonAprovedEnfants: NonApprovedEnfant[] = []

  gendersList: GenderListItem[] = [];
  yearsAndSemestersSubj: Subject<EtudiantAnneesEtSemesters[]> = new Subject<EtudiantAnneesEtSemesters[]>();
  yearsAndSemesters: EtudiantAnneesEtSemesters[] = [];

  constructor(private tuteurApi: TuteurApiService) {
    this.aprovedEnfants = localStorage.getItem(this.aprovedEnfantsKey) ? JSON.parse(localStorage.getItem(this.aprovedEnfantsKey)) : [];
    this.nonAprovedEnfants = localStorage.getItem(this.nonAprovedEnfantsKey) ? JSON.parse(localStorage.getItem(this.nonAprovedEnfantsKey)) : [];

    this.getGendersList()
    this.getEtudiantSemestersAndYears();
  }


  get approvedEnfants() {
    return this.aprovedEnfants;
  }

  get nonApprovedEnfants() {
    return this.nonAprovedEnfants;
  }

  setCurrEnfantIndex(index: number) {
    this.cenfantIndex = index;
    const enf = this.aprovedEnfants[index]
    this.currentSelectedEnfantSubj.next(enf);
    this.getEtudiantSemestersAndYears();
  }

  get currEnfantIndex(): number {
    return this.cenfantIndex;
  }

  get currentEnfant(): Enfant {
    if (this.cenfantIndex == null || this.cenfantIndex == undefined) return null;
    return this.aprovedEnfants[this.cenfantIndex];
  }


  clear() {
    this.currentSelectedEnfantSubj.next(null);
  }

  loadChildren() {
    return new Promise<number>((resolve, reject) => {
      let finishOne = false;
      this.tuteurApi.geTuteurApprovedChildren().subscribe({
        next: (enfants: Enfant[]) => {
          this.aprovedEnfants = enfants;
          localStorage.setItem(this.aprovedEnfantsKey, JSON.stringify(enfants));
          if (finishOne) resolve(0);
          else finishOne = true;
        },
        error: (err: any) => {
          this.aprovedEnfants = localStorage.getItem(this.aprovedEnfantsKey) ? JSON.parse(localStorage.getItem(this.aprovedEnfantsKey)) : [];
          if (finishOne) reject(0);
          else finishOne = true;
        }
      });
      this.tuteurApi.geTuteurNonApprovedChildren().subscribe({
        next: (enfants: NonApprovedEnfant[]) => {
          this.nonAprovedEnfants = enfants;
          localStorage.setItem(this.nonAprovedEnfantsKey, JSON.stringify(enfants));
          if (finishOne) resolve(0);
          else finishOne = true;
        },
        error: (err: any) => {
          this.nonAprovedEnfants = localStorage.getItem(this.nonAprovedEnfantsKey) ? JSON.parse(localStorage.getItem(this.nonAprovedEnfantsKey)) : [];
          if (finishOne) reject(0);
          else finishOne = true;
        }
      })
    })
  }


  private getGendersList() {
    this.gendersList = (JSON.parse(localStorage.getItem("Genders")) as GenderListItem[])
    this.tuteurApi.getGendersList().subscribe({
      next: (data) => {
        this.gendersList = data;
        localStorage.setItem("Genders", JSON.stringify(data));
      }
    })
  }

  getEtudiantSemestersAndYears() {
    this.yearsAndSemesters = (JSON.parse(localStorage.getItem("EtudiantAnneesEtSemesters")) as EtudiantAnneesEtSemesters[]) ?? [];
    if (this.currentEnfant) {
      this.tuteurApi.getEtudiantAnneesAndSemesters(this.currentEnfant.Etd_Id).subscribe({
        next: (data) => {
          this.yearsAndSemesters = data;
          localStorage.setItem("EtudiantAnneesEtSemesters", JSON.stringify(data));
          this.yearsAndSemestersSubj.next(data);
        },
        error: (err) => {
          this.yearsAndSemestersSubj.next(this.yearsAndSemesters);
        }
      })
    }
  }


}
