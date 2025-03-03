import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// import { matieres } from 'src/app/shared/data/matieres';
import { DataService } from 'src/app/shared/services/data.service';
import { DbService } from 'src/app/shared/services/db.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-maprogression',
  templateUrl: './maprogression.page.html',
  styleUrls: ['./maprogression.page.scss'],
  standalone: false,
})
export class MaprogressionPage implements OnInit {
  mesmatieres = null;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  userData: any;
  ComposantSectionDS: any;

  constructor(
    private _dataService: DataService,
    private user: UserService,
    private db: DbService,
    private navCtrl: NavController) { }

  ngOnInit() {

    this._dataService.maprogressions$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        if (data == null) {
          return;
        }
        this.mesmatieres = data;
      });

    this.user.user$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {

        this.userData = data;
        if (this.userData != null && this.mesmatieres == null)
          this.db.loadMaProgression();
      });

  }


  doRefresh(event) {
    setTimeout(() => {
      this.db.loadMaProgression();
      event.target.complete();
    }, 2000);
  }



  // getSeancesProgress() {
  //   let url = "/api/ABS_ComposantSectionAPI/getSeancesProgress/" + localStorage.getItem("Intv_Id") + "/" + localStorage.getItem("Ann_Id");
  //   return new Promise(
  //     (resolve, reject) => {
  //       // if (!environment.production) {
  //       //   resolve(this.setSeancesProgressDataSource(this.progressDS));
  //       //   return null;
  //       // }
  //       this.httpClient
  //         .get(this.globalUrl + url)
  //         .subscribe(
  //           (response: any[]) => {
  //             //console.warn("response api/ABS_ComposantSectionAPI/getSeancesProgress: ", response);
  //             resolve(this.setSeancesProgressDataSource(response));
  //           },
  //           (error) => reject(error)
  //         );
  //     });
  // }


  public openListSeance(matiere) {
    this._dataService.matiere = matiere;
    this.navCtrl.navigateForward('/listes-seances');
  }

}
