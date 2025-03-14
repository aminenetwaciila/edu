import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { map, Subject, Subscription, } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserService } from '../../../shared/services/user.service';
import { SubmitChildrenMatriculesResponse } from '../../etudiant/Types/addEtudiantTypes';
import { NonApprovedEnfant } from '../../etudiant/Types/NonApprovedEnfant.type';
import { EtudiantAnneesEtSemesters } from '../../etudiant/Types/EtudiantAnneeAndSemesters.type';
import { GenderListItem } from '../../etudiant/Types/GenderListItem.type';
import { SemesterNotes } from '../../etudiant/Types/NotesPageTypes.types';
import { SemesterAbsences } from '../../etudiant/Types/AbsencesPageTypes.types';
import { EnfantParcoursSms } from '../../etudiant/Types/ParcourNiveau.type';
import { TuteurType } from '../../etudiant/Types/TuteurType.type';
import { ActualiteComment, ActualitePage, ActualiteT, CreateCommentRequest } from '../../etudiant/Types/ActualitePageTypes.type';
import { Enfant } from '../../etudiant/Types/Enfant.type';

@Injectable()
export class TuteurApiService implements OnDestroy {

  // private readonly baseApiUrl = environment.upulseEdu;
  // private readonly env_p = environment.production;
  tuteurSubj: Subject<TuteurType> = new Subject<TuteurType>();
  tuteurObject: TuteurType;
  private tuteurSubs$?: Subscription
  private userSubs$?: Subscription;
  private TTR_ID;


  constructor(
    private httpClient: HttpClient,
    private _userServ: UserService,
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
    let url = `${environment.upulseEdu}/linkedu-api/tuteurAPI/GetTuteurActualites/${user_id}/${skip}/${size}`;
    // if (user_id)
    return this.httpClient.get<ActualitePage>(url)

    // return this.tuteurSubj.pipe(map((ttr) => {
    //   const user_id = ttr.user_id
    //   return user_id
    // }),
    //   switchMap((user_id) => {
    //     return this.httpClient.get<ActualitePage>(environment.upulseEdu + `linkedu-api/tuteurAPI/GetTuteurActualites/${user_id}/${skip}/${size}`)
    //   }))
  }

  // get actualite by id
  getActualite(act_id: string) {
    return this.httpClient.get<ActualiteT>(environment.upulseEdu + `/linkedu-api/tuteurAPI/GetTuteurActualites/${act_id}`)
  }

  createCommentOnActualite(comment: CreateCommentRequest) {
    comment.ActCom_User_Id = this.tuteurObject.user_id;
    return this.httpClient.post<ActualiteComment>(environment.upulseEdu + `/linkedu-api/tuteurAPI/AddActualiteComment`, comment);
  }

  getTuteurAccountDetails(ttr_id: string) {
    return this.httpClient.get<TuteurType>(environment.upulseEdu + `/linkedu-api/tuteurAPI/GetTuteur/${ttr_id}`)
  }

  toggleActualiteLike(act_id: string) {
    const user_id = this.tuteurObject.user_id;
    return this.httpClient.post<boolean>(environment.upulseEdu + `/linkedu-api/tuteurAPI/TuteurSubmitActualiteLike`, {
      user_id, act_id
    });
  }

  submitChildrenMatricules(matricules: string[]) {
    const ttr_id = this.TTR_ID;
    return this.httpClient.post<SubmitChildrenMatriculesResponse[]>(environment.upulseEdu + `/linkedu-api/tuteurAPI/addEnfantsByMatricules/${ttr_id}`, { matricules })
  }

  geTuteurApprovedChildren() {
    const ttr_id = this.TTR_ID;
    return this.httpClient.get<Enfant[]>(environment.upulseEdu + `/linkedu-api/tuteurAPI/GetTuteursEnfants/${ttr_id}`);
  }

  geTuteurNonApprovedChildren() {
    const ttr_id = this.TTR_ID;
    return this.httpClient.get<NonApprovedEnfant[]>(environment.upulseEdu + `/linkedu-api/tuteurAPI/GetTuteursEnfantsNonApprouves/${ttr_id}`);
  }


  getEtudiantAnneesAndSemesters(etd_id: string) {
    const ttr_id = this.TTR_ID;
    return this.httpClient.post<EtudiantAnneesEtSemesters[]>(environment.upulseEdu + `/linkedu-api/etudiantAPI/getEtudiantAnneesAndSemestersLists`, {
      ttr_id, etd_id
    });
  }


  // shared apis
  getGendersList() {
    return this.httpClient.get<GenderListItem[]>(environment.upulseEdu + `/linkedu-api/tuteurAPI/getSexes`);
  }


  getEtudiantNotes(etd_id: string, annee_id: string, semestre_id: string) {
    const ttr_id = this.TTR_ID;
    return this.httpClient.post<SemesterNotes>(environment.upulseEdu + `/linkedu-api/etudiantAPI/getEtudiantMarksByYearAndSemester`, {
      ttr_id, etd_id, year_id: annee_id, semester_id: semestre_id
    });
  }


  getEtudiantAbsences(etd_id: string, annee_id: string, semestre_id: string) {
    const ttr_id = this.TTR_ID;
    return this.httpClient.post<SemesterAbsences>(environment.upulseEdu + `/linkedu-api/etudiantAPI/getEtudiantAbsencesByYearAndSemester`, {
      ttr_id, etd_id, year_id: annee_id, semester_id: semestre_id
    });
  }


  public getEnfantEmploi(etd_matricule: string) {
    return this.httpClient.get(environment.edu + '/api/ABS_SeanceAPI/GetEtdAgenda1/' + etd_matricule)
  }

  public getEnfantParcours(etd_matricule: string) {
    return this.httpClient.get<EnfantParcoursSms[]>(environment.upulseEdu + '/linkedu-api/etudiantAPI/GetEtudiantParcours/' + etd_matricule)
  }

}
