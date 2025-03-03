import { Component, OnInit } from '@angular/core';
import { IonRouterOutlet, ModalController } from '@ionic/angular';
import { DbService } from 'src/app/shared/services/db.service';
import { NewAttestationsPage } from '../new-attestations/new-attestations.page';

@Component({
  selector: 'app-attestations',
  templateUrl: './attestations.page.html',
  styleUrls: ['./attestations.page.scss'],
  standalone: false,
})
export class AttestationsPage implements OnInit {
  mesdemandes: any;

  constructor(
    private modalCtrl: ModalController,
    private routerOutlet: IonRouterOutlet,
    private db: DbService) { }

  ngOnInit() {
    this.getDemandes();
  }

  public getDemandes() {
    this.db.loadDemandeDocuments().then((data) => {
      this.mesdemandes = data;
    })
  }

  public async newAttestation() {
    const modal = await this.modalCtrl.create({
      component: NewAttestationsPage,
      componentProps: {
      },
      // swipeToClose: true,
      presentingElement: this.routerOutlet.nativeEl
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data != null && data == true) {
      // this.db.loadSeances();
    }
  }
}
