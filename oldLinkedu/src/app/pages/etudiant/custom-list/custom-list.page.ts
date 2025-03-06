import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-custom-list',
  templateUrl: './custom-list.page.html',
  styleUrls: ['./custom-list.page.scss'],
})
export class CustomListPage implements OnInit {
  @Input() type: any;
  @Input() data: any;
  title: string;
  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
    if (this.type == 'absence') {
      this.title = 'Absences';
    } else {
      this.title = 'Elements d\'évaluation';
    }
    console.log(this.data);
  }


  public close() {
    this.modalCtrl.dismiss();
  }

}
