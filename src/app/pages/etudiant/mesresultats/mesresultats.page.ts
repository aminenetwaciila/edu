/* eslint-disable */

import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataService } from 'src/app/shared/services/data.service';
import { DbService } from 'src/app/shared/services/db.service';
import { UserService } from 'src/app/shared/services/user.service';
// import { DetailsResultatsPage } from '../details-resultats/details-resultats.page';

@Component({
  selector: 'app-mesresultats',
  templateUrl: './mesresultats.page.html',
  styleUrls: ['./mesresultats.page.scss'],
  standalone: false,
})
export class MesresultatsPage implements OnInit {

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  userData: any;
  etudiant: any;
  semestres = [];
  addVal = 0;
  constructor(
    private dataServ: DataService,
    private user: UserService,
    private db: DbService,
    private navCtrl: NavController) { }

  ngOnInit() {


    this.dataServ.etudiant$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        if (data == null) {
          return;
        }

        if (data != null) {
          this.etudiant = data;
          if (this.etudiant.ds.data) {
            this.etudiant.ds.data.map(x => x.semestres).forEach(x => {
              x.forEach(y => {
                if (y.modules.length > 0) {
                  this.semestres.push(y);
                }
              });
            });
            if (this.semestres.length > 0) {
              this.semestres[0].active = true;
            }
          }
        }

      });

    this.user.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {

        this.userData = data;
        if (this.userData != null && this.etudiant == null)
          this.db.loadNotesEtudiants();
      });


  }

  doRefresh(event) {
    setTimeout(() => {
      this.db.loadNotesEtudiants();
      event.target.complete();
    }, 2000);
  }

  public async opendetails(semestre) {

    const navigationExtras: NavigationExtras = {
      queryParams: {
        semestre: JSON.stringify(semestre)
      }
    };

    this.navCtrl.navigateForward('details-resultats', navigationExtras)
    // const modal = await this.modalCtrl.create({
    //   component: DetailsResultatsPage,
    //   componentProps: {},
    //   swipeToClose: true,
    //   presentingElement: this.routerOutlet.nativeEl
    // });
    // await modal.present();
    // const { data } = await modal.onWillDismiss();
    // if (data != null && data == true) {
    // }
  }

  /**
    * On destroy
    */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

}
