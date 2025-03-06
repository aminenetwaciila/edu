import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-listes-seances',
  templateUrl: './listes-seances.page.html',
  styleUrls: ['./listes-seances.page.scss'],
})
export class ListesSeancesPage implements OnInit {
  @Input() param: string;
  @Input() selectedCompSec: string;
  seances: any;
  selectCompSec: any;
  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {
    this.seances = JSON.parse(this.param);
    this.selectCompSec = JSON.parse(this.selectedCompSec);
  }

  public close() {
    this.modalCtrl.dismiss();
  }

}
