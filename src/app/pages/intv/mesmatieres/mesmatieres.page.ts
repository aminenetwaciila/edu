import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataService } from 'src/app/shared/services/data.service';
import { DbService } from 'src/app/shared/services/db.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-mesmatieres',
  templateUrl: './mesmatieres.page.html',
  styleUrls: ['./mesmatieres.page.scss'],
  standalone: false,
})
export class MesmatieresPage implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  mesmatieres = null;
  userData: any;
  ComposantSectionDS: any;

  constructor(
    private dataServ: DataService,
    private user: UserService,
    private db: DbService,
    private navCtrl: NavController) { }

  ngOnInit() {


    this.dataServ.mesmatieres$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data: any) => {
      if (data == null) {
        return;
      }

      if (data != null) {
        let ds = this.createDS(data);
        this.mesmatieres = ds;
        this.ComposantSectionDS = data;
      }

      this.mesmatieres = this.mesmatieres
            .sort((a, b) => (a.Sess_Nom > b.Sess_Nom) ? 1 : (a.Crs_Code > b.Crs_Code) ? 1 : -1)
    });

    this.user.user$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data: any) => {

      this.userData = data;
      if (this.userData != null && this.mesmatieres == null)
        this.db.loadMesMatieres();
    });

  }

  doRefresh(event) {
    setTimeout(() => {
      this.db.loadMesMatieres();
      event.target.complete();
    }, 2000);
  }

  onCompSecSelected(CompSec_Id) {
    const selectedCompSec = this.ComposantSectionDS.find(x => x.CompSec_Id == CompSec_Id);
    if (selectedCompSec.PLS_SeanceEnum != null) {
      let nombreSeances = selectedCompSec.Comp_NbrSeance != null ? selectedCompSec.Comp_NbrSeance : 100;
      selectedCompSec.PLS_SeanceEnum = selectedCompSec.PLS_SeanceEnum
        .sort((a, b) => (a.SeaEnum_Nom > b.SeaEnum_Nom) ? 1 : -1)
        .slice(0, nombreSeances)
        .map(x => {
          let seance = selectedCompSec.ABS_Seance.find(s => s.Sea_Nom == x.SeaEnum_Nom) // change Code @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
          if (seance == null) seance = {};
          seance.SeaEnum_Id = x.SeaEnum_Id;
          seance.SeaEnum_Nom = x.SeaEnum_Nom;
          seance.SeaEnum_Description = x.SeaEnum_Description;
          return seance;
        });

      setTimeout(() => {
        const navigationExtras: NavigationExtras = {
          queryParams: {
            selectedCompSec: JSON.stringify(selectedCompSec)
          }
        };
        this.dataServ.matiere = selectedCompSec;
        this.navCtrl.navigateForward('/listes-seances', navigationExtras)
      }, 0)
    }
    // if (this.selectedCompSec.ABS_EtudiantComposantSection != null) {
    //   this.selectedCompSec.ABS_EtudiantComposantSection = this.selectedCompSec.ABS_EtudiantComposantSection.sort((a, b) => (a.Pers_Nom > b.Pers_Nom) ? 1 : ((b.Pers_Nom > a.Pers_Nom) ? -1 : (a.Pers_Prenom > b.Pers_Prenom) ? 1 : -1))
    // }
    // setTimeout(() => {
    //   this.initView();
    // }, 50)
  }


  createDS(response) {
    if (response == null || response.length == 0) return [];
    let dataSource = response
      .filter((unique, i) => { return response.indexOf(response.find(x => x.Crs_Id == unique.Crs_Id)) == i; })
      .map(crs => {
        // matiere
        return {
          Crs_Id: crs.Crs_Id,
          Crs_Code: crs.Crs_Code,
          Crs_Nom: crs.Crs_Nom,
          Sess_Nom: crs.Sess_Nom,
          Composantes:
            response
              //.filter(x => x.Crs_Id == crs.Crs_Id)
              .filter((unique, i) => { return unique.Crs_Id == crs.Crs_Id && response.indexOf(response.find(x => x.CompCrs_Id == unique.CompCrs_Id)) == i; })
              .sort((a, b) => (a.Crs_Code > b.Crs_Code) ? 1 : ((b.Crs_Code > a.Crs_Code) ? -1 : 0)) //trier par Crs_Code
              .map(comp => {
                // Composante
                return {
                  Composante: comp.Composante,
                  CompCrs_Id: comp.CompCrs_Id,
                  Comp_DureeSeance: comp.Comp_DureeSeance,
                  Comp_NbrSeance: comp.Comp_NbrSeance,
                  Sections:
                    response//.filter(x => x.CompCrs_Id == comp.CompCrs_Id)
                      .filter((unique, i) => { return unique.CompCrs_Id == comp.CompCrs_Id && response.indexOf(response.find(x => x.CompSec_Id == unique.CompSec_Id)) == i; })
                      .sort((a, b) => (a.Section > b.Section) ? 1 : ((b.Section > a.Section) ? -1 : 0)) //tirer les les sections par Section (A,B,C,...)
                      .map(sec => {
                        let nombreSeances = comp.Comp_NbrSeance != null ? comp.Comp_NbrSeance : 100;
                        // Section
                        return {
                          Section: sec.Section,
                          CompSec_Id: sec.CompSec_Id,
                          ABS_EtudiantComposantSection: sec.ABS_EtudiantComposantSection,
                          ABS_Seance: sec.ABS_Seance,
                          nombreSeances: nombreSeances,
                          PLS_SeanceEnum:
                            sec.PLS_SeanceEnum
                              .sort((a, b) => a.SeaEnum_Nom > b.SeaEnum_Nom ? 1 : -1)
                              .slice(0, nombreSeances)
                              .map(se => {
                                return {
                                  SeaEnum_Id: se.SeaEnum_Id, SeaEnum_Nom: se.SeaEnum_Nom,
                                  SeaEnum_Description: se.SeaEnum_Description,
                                  //Section
                                  Section: sec.Section,
                                  CompSec_Id: sec.CompSec_Id,
                                  //Composante
                                  Composante: comp.Composante,
                                  CompCrs_Id: comp.CompCrs_Id,
                                }
                              })
                        }
                        // /.Section
                      })
                }
                // /. Composante
              })
        }
        // /.matiere
      });
    return dataSource;
  }




   /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
