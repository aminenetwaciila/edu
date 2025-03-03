import { Component, OnDestroy, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { IonRouterOutlet, ModalController, NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataService } from 'src/app/shared/services/data.service';
import { DbService } from 'src/app/shared/services/db.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ListesSeancesPage } from '../listes-seances/listes-seances.page';
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
    private routerOutlet: IonRouterOutlet,
    private user: UserService,
    private db: DbService,
    private modalCtrl: ModalController) { }

  ngOnInit() {


    this.dataServ.mesmatieres$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        if (data == null) {
          return;
        }

        if (data != null) {
          this.mesmatieres = this.createDS1(data);
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
          this.db.loadEtdSeances();
      });

  }

  doRefresh(event) {
    setTimeout(() => {
      this.db.loadEtdSeances();
      event.target.complete();
    }, 2000);
  }

  onCompSecEtdSelected(seances, CompSec_Id) {
    let selectedCompSec = this.ComposantSectionDS.find(x => x.CompSec_Id == CompSec_Id);

    setTimeout(async () => {

      const modal = await this.modalCtrl.create({
        component: ListesSeancesPage,
        cssClass: '',
        componentProps: {
          'param': JSON.stringify(seances),
          'selectedCompSec': JSON.stringify(selectedCompSec)
        },
        // swipeToClose: true,
        presentingElement: this.routerOutlet.nativeEl
      });
      return await modal.present();

      // this.dataSourceSeances = new MatTableDataSource(seances);
      // this.dataSourceSeances.paginator = this.paginatorSeances;//init paginator
      // this.dataSourceSeances.sort = this.sortSeances; // init sort
    }, 0)
  }


  /**
    * On destroy
    */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
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

}
