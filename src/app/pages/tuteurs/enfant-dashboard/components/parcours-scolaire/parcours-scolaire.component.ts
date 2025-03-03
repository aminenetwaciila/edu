import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { Subscription } from 'rxjs'
import { EnfantRouterService } from '../../../Services/enfant-router.service'
import { EnfantService } from '../../../Services/enfant.service'
import { TuteurApiService } from '../../../Services/tuteur-api.service'
import { EnfantParcoursSms } from '../../../Types/ParcourNiveau.type'

@Component({
  selector: 'app-parcours-scolaire',
  templateUrl: './parcours-scolaire.component.html',
  styleUrls: ['./parcours-scolaire.component.scss'],
  standalone: false,
})
export class ParcoursScolaireComponent implements OnInit, OnDestroy {
  parcourEntier = false
  loading = true
  parcours: EnfantParcoursSms[] = []
  fetchSus$?: Subscription
  niveaux: { n: number, att: boolean, items: EnfantParcoursSms[] }[] = [
    { n: 5, att: false, items: [] },
    { n: 4, att: false, items: [] },
    { n: 3, att: false, items: [] },
    { n: 2, att: false, items: [] },
    { n: 1, att: false, items: [] },
  ]

  constructor(
    private enfantRouterService: EnfantRouterService,
    private apiService: TuteurApiService,
    private enfantService: EnfantService,
  ) {
    this.fetchSus$ = this.enfantService.currentSelectedEnfantSubj.subscribe({
      next: (enfant) => {
        console.log("enfant: ", enfant);

        this.loading = true
        this.niveaux = [
          { n: 5, att: false, items: [] },
          { n: 4, att: false, items: [] },
          { n: 3, att: false, items: [] },
          { n: 2, att: false, items: [] },
          { n: 1, att: false, items: [] },
        ];
        if (enfant != null) {
          this.apiService.getEnfantParcours(enfant.Etd_Matricule).subscribe({
            next: (niveaux: EnfantParcoursSms[]) => {
              this.parcours = niveaux
              this.distributeSemesters()
              this.loading = false
            },
          })
        }
        else {

        }
      },
    })
  }

  ngOnInit() {
    this.apiService
      .getEnfantParcours(this.enfantService.currentEnfant.Etd_Matricule)
      .subscribe({
        next: (niveaux: EnfantParcoursSms[]) => {
          this.parcours = niveaux
          this.distributeSemesters()
          this.loading = false
        },
      })
  }

  ngOnDestroy(): void {
    this.fetchSus$?.unsubscribe()
    this.loading = true
  }

  forward(annee: string, semester: string) {

    if (!annee || annee.length == 0 || semester.length == 0) return;

    this.enfantRouterService.router.next({
      route: 'notes/' + annee + '/' + semester,
      direction: 'forward',
      sub: true,
      component: "NOTES",
    })
  }

  private distributeSemesters() {
    this.niveaux = [
      { n: 5, att: false, items: [] },
      { n: 4, att: false, items: [] },
      { n: 3, att: false, items: [] },
      { n: 2, att: false, items: [] },
      { n: 1, att: false, items: [] },
    ];
    this.parcours.forEach(p => {
      p._complete = true;
      p._valide = p.SmsValidation.search("n") == -1;
      if (parseInt(p.Sms_Nom) <= 2) {
        this.niveaux.find(n => n.n == 1).items.push(p);
      } else
        if (parseInt(p.Sms_Nom) <= 4) {
          this.niveaux.find(n => n.n == 2).items.push(p);
        } else
          if (parseInt(p.Sms_Nom) <= 6) {
            this.niveaux.find(n => n.n == 3).items.push(p);
          } else
            if (parseInt(p.Sms_Nom) <= 8) {
              this.niveaux.find(n => n.n == 4).items.push(p);
            } else
              if (parseInt(p.Sms_Nom) <= 10) {
                this.niveaux.find(n => n.n == 5).items.push(p);
              }
    })
    this.niveaux.forEach(n => {
      switch (n.items.length) {
        case 2:
          n.att = true;
          break;
        case 1:
          n.att = true;
          const sem = parseInt(n.items[0].Sms_Nom);
          n.items.push({
            EtdSpecSms_Id: '',
            Sms_Nom: (sem + 1).toString(),
            Sms_NomComplet: '',
            SmsMoyenne: 0,
            SmsValidation: '',
            SmsMention: '',
            SmsObservation: '',
            Niv_Nom: n.items[0].Niv_Nom,
            Ann_Nom: n.items[0].Ann_Nom,
            _complete: false,
            _valide: null,
          })
          break;
        case 0:
          n.items.push({
            EtdSpecSms_Id: '',
            Sms_Nom: (n.n * 2).toString(),
            Sms_NomComplet: '',
            SmsMoyenne: 0,
            SmsValidation: '',
            SmsMention: '',
            SmsObservation: '',
            Niv_Nom: '',
            Ann_Nom: '',
            _valide: null,
            _complete: false,
          })
          n.items.push({
            EtdSpecSms_Id: '',
            Sms_Nom: (n.n * 2 - 1).toString(),
            Sms_NomComplet: '',
            SmsMoyenne: 0,
            SmsValidation: '',
            SmsMention: '',
            SmsObservation: '',
            Niv_Nom: '',
            Ann_Nom: '',
            _valide: null,
            _complete: false,
          })
          break;
      }
    })
    this.niveaux.forEach(e => e.items.sort((a, b) => parseInt(b.Sms_Nom) - parseInt(a.Sms_Nom)))
  }
}
