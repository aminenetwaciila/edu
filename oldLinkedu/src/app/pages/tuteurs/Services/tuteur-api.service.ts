import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription, } from 'rxjs';
import { ActualiteComment, ActualitePage, ActualiteT, CreateCommentRequest } from 'src/app/pages/tuteurs/Types/ActualitePageTypes.type';
import { TuteurType } from 'src/app/pages/tuteurs/Types/TuteurType.type';
import { environment } from 'src/environments/environment';
import { UserService } from '../../../shared/services/user.service';
import { SubmitChildrenMatriculesResponse } from '../Types/addEtudiantTypes';
import { Enfant } from '../Types/Enfant.type';
import { EtudiantAnneesEtSemesters } from '../Types/EtudiantAnneeAndSemesters.type';
import { GenderListItem } from '../Types/GenderListItem.type';
import { NonApprovedEnfant } from '../Types/NonApprovedEnfant.type';
import { map, switchMap } from 'rxjs/operators';
import { SemesterNotes } from '../Types/NotesPageTypes.types';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { SemesterAbsences } from '../Types/AbsencesPageTypes.types';
import { EnfantParcoursSms } from '../Types/ParcourNiveau.type';

@Injectable()
export class TuteurApiService implements OnDestroy {

  private readonly baseApiUrl = environment.tuteurApiUrl;
  // private readonly env_p = environment.production;
  tuteurSubj: Subject<TuteurType> = new Subject<TuteurType>();
  tuteurObject: TuteurType;
  private tuteurSubs$?: Subscription
  private userSubs$?: Subscription;
  private TTR_ID;


  constructor(
    private httpClient: HttpClient,
    private toastCtrl: ToastController,
    private _userServ: UserService,
    private translater: TranslateService
  ) {

    // if (environment.production) {
    let json = this._userServ.user_value;
    this.TTR_ID = (JSON.parse(json))?.Ttr_Id;
    // } else {
    //   this.TTR_ID = "125DD74B-6C18-D6A5-D063-0020C8A460CB"
    // }


    this.tuteurSubs$ = this.tuteurSubj.subscribe({
      next: (ttr: TuteurType) => {
        this.tuteurObject = ttr;
      }
    })

    this.userSubs$ = this._userServ.user$.subscribe({
      next: user => {
        if (environment.production)
          this.TTR_ID = user.Ttr_Id;
        const ttr = {
          Ttr_Id: user.Ttr_Id,
          Pers_Id: null,
          username: user.UserName,
          user_id: user.UserId,
          Crd_Cell1: user.PhoneNumber,
          Crd_TelFixe1: "",
          Crd_AdessCouriel1: user.Email,
          Crd_AdessCouriel2: "",
          Crd_AdrLigne1: "",
          Crd_AdrLigne2: "",
          Crd_Cell2: "",
          Crd_CodePostal: "",
          Crd_Compliement: "",
          Crd_TelFixe2: "",
          Crd_Id: "",
          Crd_LieuDeNaissance: "",
          Crd_Pays: "",
          Crd_Ville: "",
          Crd_X: 0,
          Crd_Y: 0,
          EntrepEnum_Id: "",
          FonctionEnum_Id: "",
          Nation_Id: "",
          Pays_Id: "",
          Pers_CinouPass: "",
          Pers_DateNaissance: null,
          Pers_Nom: "",
          Pers_Prenom: "",
          Pers_Photo: null,
          Pers_Remarque: "",
          PersRecrut_Id: "",
          PersTyp_Id: "",
          SecteurEnum_Id: "",
          Ses_Id: "",
          Sex_Id: "",
          StatutTravailEnum_Id: "",
          Ttr_Profession: "",
          Ttr_Remarque: "",
          Ttr_TimeStamp: ""
        }
        this.tuteurSubj.next(ttr);

        // this part in comment has no ready backend yet !!!
        /*
        this.getTuteurAccountDetails( this.TTR_ID  ).subscribe({
          next: ttr=>{
            this.tuteurSubj.next(ttr)
          },
          error: resp=>{

            this.translater.get("TTR.COMMON.ACCOUNT_ERR").toPromise().then(msg=>{

              this.toastCtrl.create({
                message: msg,
                duration: 4000,
                position: 'bottom',
                color: "danger"
              }).then( (toast)=>{
                toast.present()
              });

            }).catch(err=>{
              console.log(err)
            })
          }
        })
        */

      }
    })

  }

  ngOnDestroy(): void {
    this.tuteurSubs$?.unsubscribe()
    this.userSubs$?.unsubscribe()
  }



  paginerActualites(size: number, skip: number) {
    const user_id = this.tuteurObject?.user_id;

    if (user_id) return this.httpClient.get<ActualitePage>(this.baseApiUrl + `linkedu-api/tuteurAPI/GetTuteurActualites/${user_id}/${skip}/${size}`)

    return this.tuteurSubj.pipe(map((ttr) => {
      const user_id = ttr.user_id
      return user_id
    }),
      switchMap((user_id) => {
        return this.httpClient.get<ActualitePage>(this.baseApiUrl + `linkedu-api/tuteurAPI/GetTuteurActualites/${user_id}/${skip}/${size}`)
      }))
  }

  // get actualite by id
  getActualite(act_id: string) {
    return this.httpClient.get<ActualiteT>(this.baseApiUrl + `linkedu-api/tuteurAPI/GetTuteurActualites/${act_id}`)
  }

  createCommentOnActualite(comment: CreateCommentRequest) {
    comment.ActCom_User_Id = this.tuteurObject.user_id;
    return this.httpClient.post<ActualiteComment>(this.baseApiUrl + `linkedu-api/tuteurAPI/AddActualiteComment`, comment);
  }

  getTuteurAccountDetails(ttr_id: string) {
    return this.httpClient.get<TuteurType>(this.baseApiUrl + `linkedu-api/tuteurAPI/GetTuteur/${ttr_id}`)
  }

  toggleActualiteLike(act_id: string) {
    const user_id = this.tuteurObject.user_id;
    return this.httpClient.post<boolean>(this.baseApiUrl + `linkedu-api/tuteurAPI/TuteurSubmitActualiteLike`, {
      user_id, act_id
    });
  }

  submitChildrenMatricules(matricules: string[]) {
    const ttr_id = this.TTR_ID;
    return this.httpClient.post<SubmitChildrenMatriculesResponse[]>(this.baseApiUrl + `linkedu-api/tuteurAPI/addEnfantsByMatricules/${ttr_id}`, { matricules })
  }

  geTuteurApprovedChildren() {
    const ttr_id = this.TTR_ID;
    return this.httpClient.get<Enfant[]>(this.baseApiUrl + `linkedu-api/tuteurAPI/GetTuteursEnfants/${ttr_id}`);
  }

  geTuteurNonApprovedChildren() {
    const ttr_id = this.TTR_ID;
    return this.httpClient.get<NonApprovedEnfant[]>(this.baseApiUrl + `linkedu-api/tuteurAPI/GetTuteursEnfantsNonApprouves/${ttr_id}`);
  }


  getEtudiantAnneesAndSemesters(etd_id: string) {
    const ttr_id = this.TTR_ID;
    return this.httpClient.post<EtudiantAnneesEtSemesters[]>(this.baseApiUrl + `linkedu-api/etudiantAPI/getEtudiantAnneesAndSemestersLists`, {
      ttr_id, etd_id
    });
  }


  // shared apis
  getGendersList() {
    return this.httpClient.get<GenderListItem[]>(this.baseApiUrl + `linkedu-api/tuteurAPI/getSexes`);
  }


  getEtudiantNotes(etd_id: string, annee_id: string, semestre_id: string) {
    const ttr_id = this.TTR_ID;
    return this.httpClient.post<SemesterNotes>(this.baseApiUrl + `linkedu-api/etudiantAPI/getEtudiantMarksByYearAndSemester`, {
      ttr_id, etd_id, year_id: annee_id, semester_id: semestre_id
    });
  }


  getEtudiantAbsences(etd_id: string, annee_id: string, semestre_id: string) {
    const ttr_id = this.TTR_ID;
    return this.httpClient.post<SemesterAbsences>(this.baseApiUrl + `linkedu-api/etudiantAPI/getEtudiantAbsencesByYearAndSemester`, {
      ttr_id, etd_id, year_id: annee_id, semester_id: semestre_id
    });
  }


  public getEnfantEmploi(etd_matricule: string) {
    return this.httpClient.get(environment.url + '/api/ABS_SeanceAPI/GetEtdAgenda1/' + etd_matricule)
  }

  public getEnfantParcours(etd_matricule: string) {
    return this.httpClient.get<EnfantParcoursSms[]>(this.baseApiUrl + 'linkedu-api/etudiantAPI/GetEtudiantParcours/' + etd_matricule)
  }

}
