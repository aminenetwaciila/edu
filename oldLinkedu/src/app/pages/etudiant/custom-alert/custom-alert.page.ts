import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-custom-alert',
  templateUrl: './custom-alert.page.html',
  styleUrls: ['./custom-alert.page.scss'],
})
export class CustomAlertPage implements OnInit {
  @Input() info: any;
  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
  }


  public close() {
    this.modalCtrl.dismiss();
  }

}
