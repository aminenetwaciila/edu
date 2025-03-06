import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { MenuController, NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataService } from 'src/app/shared/services/data.service';
import { DbService } from 'src/app/shared/services/db.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
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
    this.menu.enable(true);
    this.dataServ.etudiant$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data: any) => {
      if (data == null) {
        return;
      }
      
      if (data != null) {
        this.etudiant = data;
        this.nativeStorage.setItem('nom',  this.etudiant.prenom + ' ' + this.etudiant.nom);
        this.nativeStorage.setItem('adresse',  this.etudiant.adresse);
        this.nativeStorage.setItem('cursus',  JSON.stringify(this.etudiant.ds.smsActuel));
        this.nativeStorage.setItem('specialite',  this.etudiant.specialite);
        this.nativeStorage.setItem('datenaissance',  this.etudiant.datenaissance);
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
