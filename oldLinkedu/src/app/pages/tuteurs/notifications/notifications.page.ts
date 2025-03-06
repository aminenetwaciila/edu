import { Component, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {

  constructor( private navCtrl:NavController, private plateform: Platform) {
    this.plateform.backButton.subscribeWithPriority( 2, (processNextHandler)=>{
      this.exit();
      processNextHandler();
    })
  }

  ngOnInit() {
  }

  exit(){
    this.navCtrl.back();
  }
}
