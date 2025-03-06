/* eslint-disable */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { Platform, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { DataService } from './data.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class DbService {
  url = environment.url;
  private _data: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  userData: any;
  // private _games: BehaviorSubject<any> = new BehaviorSubject<any>(games);
  // private _mygames: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  constructor(
    private platform: Platform,
    private httpClient: HttpClient,
    private nativeStorage: NativeStorage,
    private toast: ToastController,
    private dataServ: DataService,
    private _userServ: UserService

  ) {
    this._userServ.user$.subscribe((data) => {
      this.userData = data;
    })
  }

  /**
     * Setter & getter for data
     *
     * @param value
     */

  set data(value: any) {
    this.data.next(value);
  }

  get data$(): Observable<any> {
    return this.data.asObservable();
  }

  postData(url, params): Observable<any> {
    let headers = new HttpHeaders()
    headers = headers.set('Content-Type', 'application/json');
    return this.httpClient.post(this.url + url, params, { headers })
  }

  getData(url) {
    let headers = new HttpHeaders()
    return this.httpClient.get(this.url + url).toPromise()
  }

  putData(url, params) {
    let headers = {};
    return this.httpClient.put(this.url + url, params, headers)
  }

  deleteData(url) {
    let headers = {};
    return this.httpClient.delete(this.url + url, headers)
  }


  /**** Intv *****/

  public loadSeances() {
    this.getData('/api/ABS_ComposantSectionAPI/GetIntvSeances/' + this.userData?.Intv_Id + '/' + this.userData.Ann_Id)
      .then((data) => {
        this.dataServ.seances = data;
      })
  }

  public loadMesMatieres() {
    this.getData('/api/ABS_ComposantSectionAPI/GetComposantSection/' + this.userData?.Intv_Id + '/' + this.userData.Ann_Id)
      .then((data) => {
        this.dataServ.mesmatieres = data;
      })
  }

  public loadMaProgression() {
    this.getData("/api/ABS_ComposantSectionAPI/getSeancesProgress/" + this.userData?.Intv_Id + "/" + this.userData.Ann_Id)
      .then((data) => {
        this.dataServ.maprogressions = data;
      })
  }

  //#region Etudiant
  public getRevisions() {
    return this.getData('/api/NEL_RevisionAPI/getLoggedEtudiantRevisions/' + this.userData.Etd_Matricule)
  }
  public loadDemandeDocuments() {
    return this.getData('/api/INS_DocDemandeController/getDemandeOfStudent/' + this.userData.Etd_Matricule)
  }
  public loadAgendaEtd() {
    return this.getData('/api/ABS_SeanceAPI/GetEtdAgenda1/' + this.userData?.Etd_Matricule)
  }
  public loadEtdSeances() {
    return this.getData('/api/ABS_SeanceAPI/GetEtdSeances/' + this.userData?.Etd_Id)
      .then((response: any) => { this.dataServ.mesmatieres = response; });
  }
  registerTuteur(params: any) {
    return this.postData('/api/AccountAPI/RegisterTuteur', params);
  }
  SubmitRegisterEtudiant(params) {
    return this.postData('/api/AccountAPI/RegisterEtudiant', params);
  }
  public getNbRevisionsSms(matric, Sms_Nom, fac_Id) {
    return this.getData('/api/NEL_RevisionAPI/getNbRevisions/' + matric + '/' + Sms_Nom + '/' + fac_Id)
  }
  public CheckEtudiantMatricule(matricule) {
    return this.postData('/api/AccountAPI/CheckEtudiantMatricule/' + matricule, null);
  }
  demandeRevision(sms) {
    return this.checkRepechage(sms);
  }
  checkRepechage(sms) {
    return this.getData('api/EtudiantCoursEvaluation/CheckIfRepechage/' + this.userData?.Etd_Matricule + '/' + sms);
  }
  public loadNotesEtudiants() {
    return this.getData('/api/ACD_EtudiantAPI/GetStudent_revision/' + this.userData?.Etd_Matricule)
      .then((response: any) => {
        response[0].ds = this.createDS(response[0]);
        this.dataServ.etudiant = response[0];
      });
  }
  public getEtdId(fac_id) {
    return this.getData('/api/Etudiant/getEtdId/' + this.userData?.Etd_Matricule + '/' + fac_id)
  }

  public GetEtudiantMatiereRattrapage(etd_id) {
    let url = `${environment.upulseEdu}/api/Rattrapage/GetEtudiantMatiereRattrapage?Etd_Id=${etd_id}`;
    return this.httpClient.get(url);//.toPromise();
  }
  public UpdateEtudiantMatiereRattrapageConfirmeDemande(data: { EtdCrs_Id: string, EstConfirme: boolean, EstDemande: boolean }[]) {
    let url = `${environment.upulseEdu}/api/Rattrapage/UpdateEtudiantMatiereRattrapageConfirmeDemande`;
    return this.httpClient.put(url, { data: data });//.toPromise();
  }
  //#endregion Etudiant


  async presentToast(message) {
    const toast = await this.toast.create({
      message,
      duration: 3000,
      color: 'dark',
      cssClass: 'toastCss',
      // enterAnimation: customToastEnter,
    });
    toast.present();
  }


  public guid() {
    function s4() { return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1); }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }



  createDS1(response) {
    if (response == null || response.length == 0) return [];
    let dataSource = response
      .filter((unique, i) => { return response.indexOf(response.find(x => x.Crs_Id == unique.Crs_Id)) == i; })
      .map(crs => {
        // matiere
        return {
          Crs_Id: crs.Crs_Id,
          Crs_Code: crs.Crs_Code,
          Crs_Nom: crs.Crs_Nom,
          Composantes:
            response
              //.filter(x => x.Crs_Id == crs.Crs_Id)
              .filter((unique, i) => { return unique.Crs_Id == crs.Crs_Id && response.indexOf(response.find(x => x.CompCrs_Id == unique.CompCrs_Id)) == i; })
              .sort((a, b) => (a.Crs_Code > b.Crs_Code) ? 1 : ((b.Crs_Code > a.Crs_Code) ? -1 : 0)) //trier par Crs_Code
              .map(comp => {
                let nombreSeances = comp.Comp_NbrSeance != null ? comp.Comp_NbrSeance : 25;
                // Composante
                return {
                  Composante: comp.Composante,
                  CompCrs_Id: comp.CompCrs_Id,
                  Comp_DureeSeance: comp.Comp_DureeSeance,
                  Comp_NbrSeance: comp.Comp_NbrSeance,
                  CompSec_Id: comp.CompSec_Id,
                  Seances: comp.ABS_Seance.sort((a, b) => a.Sea_Nom > b.Sea_Nom ? 1 : -1).concat(comp.PLS_SeanceEnum
                    .sort((a, b) => a.SeaEnum_Nom > b.SeaEnum_Nom ? 1 : -1)
                    .slice(comp.ABS_Seance.length, nombreSeances)
                    .map(se => {
                      return {
                        SeaEnum_Id: se.SeaEnum_Id, SeaEnum_Nom: se.SeaEnum_Nom,
                        SeaEnum_Description: se.SeaEnum_Description,
                        Sea_Nom: se.SeaEnum_Nom,
                        //Section
                        Section: se.Section,
                        CompSec_Id: se.CompSec_Id,
                        //Composante
                        Composante: comp.Composante,
                        CompCrs_Id: comp.CompCrs_Id,
                      }
                    }))
                }
                // /. Composante
              })
        }
        // /.matiere
      });
    return dataSource;
  }


  createDS(response) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const annees = [];
    let semestres = [];
    const dataSource = { smsActuel: null, smsAReviser: null, data: null, fiches: [], specialite: null };
    const correspondance = [];

    if (response.notes != null || response.notes.length > 0) {
      response.notes.forEach(x => {
        if (x.Sms_Nom != null && !x.Sms_Nom.includes("Reprise")) {
          const i = semestres.map(y => y.Sms_Nom + "-" + y.Ann_Nom).indexOf((x.Sms_Nom ? (x.Sms_Nom + "-" + x.Ann_Nom) : ''));
          if (i === -1) {
            // tslint:disable-next-line:max-line-length
            semestres.push({ EtdSpecSms_Id: x.EtdSpecSms_Id, Sms_Nom: (x.Sms_Nom ? parseInt(x.Sms_Nom, 10) : 0), Spec_Name: x.Spec_Name, Ann_Nom: x.Ann_Nom, Fac_Id: x.Fac_Id, SmsMoyenne: x.SmsMoyenne, SmsValidation: x.SmsValidation, SmsMention: x.SmsMention, modules: [{ Mdu_Id: x.Mdu_Id, Mdu_Code: x.Mdu_Code, Mdu_Nom: x.Mdu_Nom.toLowerCase(), MduValidation: x.MduValidation, MduMoyenne: x.MduMoyenne, matieres: [{ EtdCrs_Id: x.EtdCrs_Id, Crs_Code: x.Crs_Code, Crs_Nom: x.Crs_Nom.toLowerCase(), absences: [], incidents: [], EtdCrs_NoteExam: x.CoursNoteRetenu, evals: [{ EtdCrsEval_Id: x.EtdCrsEval_Id, ElemEval_Dim: x.ElemEval_Dim, ElemEval_Pourcentage: x.CrsEval_Pourcentage, EtdCrsEval_Note: x.EtdCrsEval_Note, revision: null, open: false, }], open: false }], open: false }], open: false, absences: 0, incidents: 0 });
            correspondance.push({ semestre: 0, module: 0, matiere: x.Crs_Nom.toLowerCase() });
          } else {
            const j = semestres[i].modules.map(y => y.Mdu_Id).indexOf(x.Mdu_Id);
            if (j === -1) {
              // tslint:disable-next-line:max-line-length
              semestres[i].modules.push({ Mdu_Id: x.Mdu_Id, Mdu_Code: x.Mdu_Code, Mdu_Nom: x.Mdu_Nom.toLowerCase(), MduValidation: x.MduValidation, MduMoyenne: x.MduMoyenne, matieres: [{ EtdCrs_Id: x.EtdCrs_Id, Crs_Code: x.Crs_Code, Crs_Nom: x.Crs_Nom.toLowerCase(), absences: [], incidents: [], EtdCrs_NoteExam: x.CoursNoteRetenu, evals: [{ EtdCrsEval_Id: x.EtdCrsEval_Id, ElemEval_Dim: x.ElemEval_Dim, ElemEval_Pourcentage: x.CrsEval_Pourcentage, EtdCrsEval_Note: x.EtdCrsEval_Note, revision: null, open: false, }], open: false }], open: false });
            } else {
              const z = semestres[i].modules[j].matieres.map(y => y.EtdCrs_Id).indexOf(x.EtdCrs_Id);
              if (z === -1) {
                // tslint:disable-next-line:max-line-length
                semestres[i].modules[j].matieres.push({ EtdCrs_Id: x.EtdCrs_Id, Crs_Code: x.Crs_Code, Crs_Nom: x.Crs_Nom.toLowerCase(), absences: [], incidents: [], EtdCrs_NoteExam: x.CoursNoteRetenu, checked: false, evals: [{ EtdCrsEval_Id: x.EtdCrsEval_Id, ElemEval_Dim: x.ElemEval_Dim, ElemEval_Pourcentage: x.CrsEval_Pourcentage, EtdCrsEval_Note: x.EtdCrsEval_Note, revision: null, open: false, }], open: false });
                correspondance.push({ semestre: i, module: j, matiere: x.Crs_Nom.toLowerCase() });
              } else {
                const t = semestres[i].modules[j].matieres[z].evals.map(y => y.EtdCrsEval_Id).indexOf(x.EtdCrsEval_Id);
                if (t === -1) {
                  // tslint:disable-next-line:max-line-length
                  semestres[i].modules[j].matieres[z].evals.push({ EtdCrsEval_Id: x.EtdCrsEval_Id, ElemEval_Dim: x.ElemEval_Dim, ElemEval_Pourcentage: x.CrsEval_Pourcentage, EtdCrsEval_Note: x.EtdCrsEval_Note, open: false, revision: null });
                }
              }
            }
          }
        }
      });
    }
    if (response.fiches != null || response.fiches.length > 0) {

      response.fiches.forEach(x => {
        x.events = x.evenements.filter(y => y.type !== "");
        if (x.events.length > 0) {
          dataSource.fiches.push(x);
        }

        x.evenements.forEach(y => {
          if (y.type !== 'Demande de document' && y.type !== 'Revision de notes' && !y.Sms_Nom.includes("Reprise")) {
            const t = semestres.map(z => z.Sms_Nom + "-" + z.Ann_Nom).indexOf((y.Sms_Nom ? (y.Sms_Nom + "-" + y.Ann_Nom) : ''));
            if (t === -1) {
              // tslint:disable-next-line:max-line-length
              const semestre = { EtdSpecSms_Id: this.guid(), Spec_Name: x.Spec_Name, Sms_Nom: (y.Sms_Nom ? parseInt(y.Sms_Nom, 10) : 0), Ann_Nom: y.Ann_Nom, Fac_Id: y.Fac_Id, SmsMoyenne: null, SmsValidation: null, SmsMention: null, modules: [], fiches: [y], open: false, absences: ((y.type === "absence") ? 1 : 0) };
              // tslint:disable-next-line:max-line-length
              const module = { Mdu_Id: y.Mdu_Id, Mdu_Code: y.Mdu_Code, Mdu_Nom: (y.Mdu_Nom ? y.Mdu_Nom.toLowerCase() : null), MduValidation: null, MduMoyenne: null, matieres: [], open: false }
              const matiere = { Crs_Code: y.Crs_Code, Crs_Nom: y.Crs_Nom.toLowerCase(), absences: [], incidents: [], EtdCrs_NoteExam: x.CoursNoteRetenu, evals: [{ EtdCrsEval_Id: y.EtdCrsEval_Id, ElemEval_Dim: y.ElemEval_Dim, ElemEval_Pourcentage: x.CrsEval_Pourcentage, EtdCrsEval_Note: y.EtdCrsEval_Note }], open: false };
              if (y.type === "absence") {
                matiere.absences.push({ matiere: y.Crs_Nom, date: new Date(y.date).toLocaleDateString('fr-FR'), heured: y.heured, heuref: y.heuref });
              }
              module.matieres.push(matiere);
              semestre.modules.push(module);
              semestres.push(semestre);
              correspondance.push({ semestre: (semestres.length - 1), module: 0, matiere: y.Crs_Nom.toLowerCase() });
            } else {
              const z = semestres[t].modules.map(z => z.Mdu_Id).indexOf(y.Mdu_Id);
              if (z === -1) {
                const module = { Mdu_Id: y.Mdu_Id, Mdu_Code: y.Mdu_Code, Mdu_Nom: (y.Mdu_Nom ? y.Mdu_Nom.toLowerCase() : null), MduValidation: null, MduMoyenne: null, matieres: [], open: false };
                const matiere = { EtdCrs_Id: y.EtdCrs_Id, Crs_Code: y.Crs_Code, Crs_Nom: y.Crs_Nom.toLowerCase(), absences: [], incidents: [], EtdCrs_NoteExam: x.CoursNoteRetenu, evals: [{ EtdCrsEval_Id: y.EtdCrsEval_Id, ElemEval_Dim: y.ElemEval_Dim, ElemEval_Pourcentage: x.CrsEval_Pourcentage, EtdCrsEval_Note: y.EtdCrsEval_Note }], open: false };
                if (y.type === "absence") {
                  matiere.absences.push({ matiere: y.Crs_Nom, date: new Date(y.date).toLocaleDateString('fr-FR'), heured: y.heured, heuref: y.heuref });
                }
                module.matieres.push(matiere);
                semestres[t].modules.push(module);
                correspondance.push({ semestre: t, module: (semestres[t].modules.length - 1), matiere: y.Crs_Nom.toLowerCase() });
              } else {
                const e = semestres[t].modules[z].matieres.map(z => z.EtdCrs_Id).indexOf(y.EtdCrs_Id);
                if (e === -1) {
                  const matiere = { EtdCrs_Id: y.EtdCrs_Id, Crs_Code: y.Crs_Code, Crs_Nom: y.Crs_Nom.toLowerCase(), absences: [], incidents: [], EtdCrs_NoteExam: x.CoursNoteRetenu, evals: [{ EtdCrsEval_Id: y.EtdCrsEval_Id, ElemEval_Dim: y.ElemEval_Dim, ElemEval_Pourcentage: x.CrsEval_Pourcentage, EtdCrsEval_Note: y.EtdCrsEval_Note }], open: false };
                  if (y.type === "absence") {
                    matiere.absences.push({ matiere: y.Crs_Nom, date: new Date(y.date).toLocaleDateString('fr-FR'), heured: y.heured, heuref: y.heuref });
                  }
                  semestres[t].modules[z].matieres.push(matiere);
                } else {
                  if (y.type === "absence") {
                    semestres[t].modules[z].matieres[e].absences.push({ matiere: y.Crs_Nom, date: new Date(y.date).toLocaleDateString('fr-FR'), heured: y.heured, heuref: y.heuref });
                  }
                }
              }
              if (y.type === "absence") {
                semestres[t].absences++;
              }
            }

          }
        });
      });
    }

    for (let i = 1; i <= 10; i++) {
      const z = semestres.map(y => y.Sms_Nom).indexOf(i);
      if (z === -1) {
        // tslint:disable-next-line:max-line-length
        const semestre = { EtdSpecSms_Id: this.guid(), SmsMention: null, SmsMoyenne: '-', SmsValidation: '-', Sms_Nom: i, Ann_Nom: "-", modules: [], Fac_Id: null, open: false };
        semestres.unshift(semestre);
      }
    }

    semestres = semestres.sort((a, b) => ((a.Sms_Nom < b.Sms_Nom) ? 1 : -1));
    semestres.forEach(x => {
      if (!dataSource.smsActuel && x.modules.length > 0) {
        //&& response.anneeEnCours.Ann_Nom === x.Ann_Nom
        dataSource.smsActuel = x;

        x.modules.forEach(module => {
          module.matieres.forEach(mat => {
            if (response.demandeSoumis.includes(mat.EtdCrs_Id)) {
              mat.demandeEnCours = true;
            }
          });
        });
      }

      if ([0, 1, 2].includes(x.Sms_Nom)) {
        const i = annees.map(y => y.annee).indexOf(1);
        if (i === -1) {
          annees.push({ annee: 1, sup: 'ère', semestres: [x] });
        } else {
          annees[i].semestres.push(x);
        }
      } else if ([3, 4].includes(x.Sms_Nom)) {
        const i = annees.map(y => y.annee).indexOf(2);
        if (i === -1) {
          annees.push({ annee: 2, sup: 'ème', semestres: [x] });
        } else {
          annees[i].semestres.push(x);
        }
      } else if ([5, 6].includes(x.Sms_Nom)) {
        const i = annees.map(y => y.annee).indexOf(3);
        if (i === -1) {
          annees.push({ annee: 3, sup: 'ème', semestres: [x] });
        } else {
          annees[i].semestres.push(x);
        }
      } else if ([7, 8].includes(x.Sms_Nom)) {
        const i = annees.map(y => y.annee).indexOf(4);
        if (i === -1) {
          annees.push({ annee: 4, sup: 'ème', semestres: [x] });
        } else {
          annees[i].semestres.push(x);
        }
      } else if ([9, 10].includes(x.Sms_Nom)) {
        const i = annees.map(y => y.annee).indexOf(5);
        if (i === -1) {
          annees.push({ annee: 5, sup: 'ème', semestres: [x] });
        } else {
          annees[i].semestres.push(x);
        }
      }
    });
    if (dataSource.smsActuel != null) {
      if ([0, 1, 2].includes(dataSource.smsActuel.Sms_Nom)) {
        dataSource.smsActuel.annee = 1;
        dataSource.smsActuel.sup = 'ère';
      } else if ([3, 4].includes(dataSource.smsActuel.Sms_Nom)) {
        dataSource.smsActuel.annee = 2;
        dataSource.smsActuel.sup = 'ème';
      } else if ([5, 6].includes(dataSource.smsActuel.Sms_Nom)) {
        dataSource.smsActuel.annee = 3;
        dataSource.smsActuel.sup = 'ème';
      } else if ([7, 8].includes(dataSource.smsActuel.Sms_Nom)) {
        dataSource.smsActuel.annee = 4;
        dataSource.smsActuel.sup = 'ème';
      } else if ([9, 10].includes(dataSource.smsActuel.Sms_Nom)) {
        dataSource.smsActuel.annee = 5;
        dataSource.smsActuel.sup = 'ème';
      }
    }

    dataSource.data = annees;
    dataSource.fiches.forEach(y => {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      y.dateString = new Date(y.date).toLocaleDateString('fr-FR');
    });

    if (!dataSource.smsActuel) {
      dataSource.smsActuel = semestres[0];
      dataSource.smsAReviser = semestres[0].EtdSpecSms_Id;
      dataSource.smsActuel.reel = false;
    } else {
      dataSource.smsActuel.reel = true;
      this.nativeStorage.setItem('Fac_Id', dataSource.smsActuel.Fac_Id);

      semestres.forEach(y => {
        if (y.modules.filter(z => z.matieres.filter(t => t.EtdCrs_NoteExam != null).length > 0).length > 0) {
          if (dataSource.smsAReviser == null)
            dataSource.smsAReviser = y.EtdSpecSms_Id;
        }
      });

    }
    return dataSource;
  }
}

