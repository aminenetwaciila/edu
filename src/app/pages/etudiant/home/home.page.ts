import { Component, OnInit } from '@angular/core';
// import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { MenuController, NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataService } from 'src/app/shared/services/data.service';
import { DbService } from 'src/app/shared/services/db.service';
import { HelperService } from 'src/app/shared/services/helper.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  userData: any;
  etudiant: any;
  constructor(
    private dataServ: DataService,
    private user: UserService,
    private db: DbService,
    private menu: MenuController,
    private nativeStorage: NativeStorage,
    private navCtrl: NavController) { }

  ngOnInit() {
    console.log("HomePage.ngOnInit ");


    this.menu.enable(true);
    this.dataServ.etudiant$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((data: any) => {
        console.log("dataServ.etudiant: ", data);
        if (data == null) {
          return;
        }

        if (data != null) {
          this.etudiant = data;
          HelperService.SetLocalStorage('nom', this.etudiant.prenom + ' ' + this.etudiant.nom);
          HelperService.SetLocalStorage('adresse', this.etudiant.adresse);
          HelperService.SetLocalStorage('cursus', JSON.stringify(this.etudiant.ds.smsActuel));
          HelperService.SetLocalStorage('specialite', this.etudiant.specialite);
          HelperService.SetLocalStorage('datenaissance', this.etudiant.datenaissance);


          // this.nativeStorage.setItem('nom', this.etudiant.prenom + ' ' + this.etudiant.nom);
          // this.nativeStorage.setItem('adresse', this.etudiant.adresse);
          // this.nativeStorage.setItem('cursus', JSON.stringify(this.etudiant.ds.smsActuel));
          // this.nativeStorage.setItem('specialite', this.etudiant.specialite);
          // this.nativeStorage.setItem('datenaissance', this.etudiant.datenaissance);
        } else {
          console.log("dataServ.etudiant: data-NULL")
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



  public menutoggle() {
    this.menu.toggle();
  }


}
