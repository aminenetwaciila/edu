import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage implements OnInit {
  constructor(
    public navCtrl: NavController,
    private userServ: UserService,
    private route: Router
  ) {
    setTimeout(() => {
      // this.navCtrl.navigateRoot('intro');
      if (this.userServ.user_value) {
        try {
          let user = (this.userServ.user = JSON.parse(
            this.userServ.user_value
          ));
          switch (user.Role) {
            case 'etudiant':
              this.navCtrl.navigateRoot('menuEtd/tabs/actualite').then(() => {});
              break;
            case 'intervenant':
              this.navCtrl.navigateRoot('menu/tabs/tab0').then(() => {});
              break;
            case 'tuteur':
              this.navCtrl
                .navigateRoot('menuTtr/tabs/actualites')
                .then(() => {});
              break;
            default:
              this.navCtrl.navigateRoot('sign-in');
          }
        } catch (error) {
          this.navCtrl.navigateRoot('sign-in');
        }
      } else {
        this.navCtrl.navigateRoot('sign-in');
      }
    }, 3000);
  }

  ngOnInit() {}
}
