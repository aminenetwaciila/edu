import { Component, OnInit } from '@angular/core';
import { NavigationExtras } from '@angular/router';
import { IonRouterOutlet, ModalController, NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataService } from 'src/app/shared/services/data.service';
import { DbService } from 'src/app/shared/services/db.service';
import { CustomAlertPage } from '../custom-alert/custom-alert.page';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-revisions',
  templateUrl: './revisions.page.html',
  styleUrls: ['./revisions.page.scss'],
  standalone: false,
})
export class RevisionsPage implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  mesrevisions: any;
  userData: any;
  etudiant: any;
  semestres: any = [];
  constructor(
    private db: DbService,
    private user: UserService,
    private modalController: ModalController,
    private navCtrl: NavController,
    private dataServ: DataService,
    private routerOutlet: IonRouterOutlet) { }

  ngOnInit() {
    this.getRevisions();

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
            console.log(this.semestres)
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

  public getRevisions() {
    this.db.getRevisions().then((data) => {
      this.mesrevisions = data;
      this.mesrevisions.forEach(rev => {
        rev.revs.forEach(x => {
          x.NEL_RevisionEtdCrsEvaluation = x.NEL_RevisionEtdCrsEvaluation.sort((a, b) => ((a.Crs_Nom < b.Crs_Nom) ? 1 : -1));
        });
      });
    })
  }


  public async voirdetails(crs) {
    const modal = await this.modalController.create({
      component: CustomAlertPage,
      componentProps: {
        info: crs
      },
      // swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
  }

  demandeRevision() {

    // const semestre = this.semestres.find(x => x.active == true);
    const navigationExtras: NavigationExtras = {
      queryParams: {
        from: 'revision',
        // semestre: JSON.stringify(semestre)
      }
    };

    this.navCtrl.navigateForward('details-resultats', navigationExtras)
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
