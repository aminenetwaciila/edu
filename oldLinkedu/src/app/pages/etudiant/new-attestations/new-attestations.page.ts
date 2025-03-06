import { Component, OnInit } from '@angular/core';
import { NativeStorage } from '@awesome-cordova-plugins/native-storage/ngx';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DbService } from 'src/app/shared/services/db.service';
import { UserService } from 'src/app/shared/services/user.service';
import { __values } from 'tslib';

@Component({
  selector: 'app-new-attestations',
  templateUrl: './new-attestations.page.html',
  styleUrls: ['./new-attestations.page.scss'],
})
export class NewAttestationsPage implements OnInit {
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  documents = [
    { id: 1, DocTyp_Id: '', label: 'Carte d\'étudiant', checked: false },
    { id: 2, DocTyp_Id: '7f5847b3-a21f-4cc8-9764-9358a9335fad', label: 'Attestation de scolarité', checked: false },
    { id: 3, DocTyp_Id: '', label: 'Attestation de réussite', checked: false },
    { id: 4, DocTyp_Id: '', label: 'Attestation de diplôme', checked: false },
    { id: 5, DocTyp_Id: '', label: 'Bulletins', checked: false }
  ];
  facultes: any = [{ 'Fac_Id': '6c876f6f-b6c1-4002-880f-a7472b561386', 'DIM': 'POL' }, { 'Fac_Id': 'd9de644c-fd9f-46bd-9a48-5a1c3f4f8af0', 'DIM': 'ISI' }, { 'Fac_Id': 'be4b5bf5-daf5-46e1-893d-d3ba712fa3f6', 'DIM': 'TOU' }, { 'Fac_Id': 'fba32d52-aca0-465a-8414-35e3b5925b71', 'DIM': 'SUP' }];
  eltChecked = [];
  Etd_Id: any;
  fac_id: any;
  cursus: any;
  mesdemandes: any;
  fac_dim: any;
  userData: any;
  constructor(
    private db: DbService,
    private user: UserService,
    private nativeStorage: NativeStorage,
    private modalCtrl: ModalController) { }

  ngOnInit() {

    this.user.user$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data: any) => {
      this.userData = data;
    });


    this.nativeStorage.getItem('Fac_Id').then((data) => {
      this.fac_id = data;
      const faculte = this.facultes.find(x => x.Fac_Id === this.fac_id);
      if (faculte) {
        this.fac_dim = faculte.DIM;
      }
    });
    this.nativeStorage.getItem('Etd_Id').then((data) => {
      this.Etd_Id = data;
    });
    this.nativeStorage.getItem('cursus').then((data) => {
      this.cursus = JSON.parse(data);
    });


  }

  public pasdispo() {
    this.db.presentToast('Désolé, ce document n\'est pas encore disponible. Contactez l\'administration');
  }

  close(val?) {
    this.modalCtrl.dismiss(__values);
  }

  public isSaveEnabled() {
    return (this.documents.filter(x => x.checked === true).length > 0);
  }


  public save() {
    const docChecked = this.documents.filter(x => x.checked === true).map(x => x.DocTyp_Id);
    if (docChecked.includes('7f5847b3-a21f-4cc8-9764-9358a9335fad')) {
      const fac_id = this.fac_id ? this.fac_id : '6c876f6f-b6c1-4002-880f-a7472b561386';
      this.db.getEtdId(fac_id).then((data: any) => {
        const date = new Date();
        const docDemande_ID = this.db.guid();
        if (this.cursus.Ann_Nom == "-" || this.cursus.Ann_Nom == "" || this.cursus.Ann_Nom == null) {
          this.db.presentToast("Nous n'avons pas pu trouver l'année en cours");
          return false;
        }
        const anneeUniv = this.cursus.Ann_Nom.split("-");
        // tslint:disable-next-line:max-line-length
        const donnees = {
          'DocDemande_ID': docDemande_ID,
          'Etd_ID': this.userData.Etd_Id,
          'Dem_Date': date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + 'T' + ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2) + ':' + ('0' + date.getSeconds()).slice(-2),
          'DocEtatDemande_Id': 'c3d54a2b-73c5-4b82-a80d-b09440cd3564',
          'FAC_ID': this.fac_id,
          'DocDemande_Num': anneeUniv[0].substring(2, 4) + anneeUniv[1].substring(2, 4) + '-' + date.getDate() + (date.getMonth() + 1) + '-' + this.fac_dim + '-' + data.NbDem
        };

        this.db.postData('/api/INS_DocDemande/Demande/' + this.cursus.Ann_Nom, donnees).toPromise().then((data1: any) => {
          if (!data1) {

            this.db.presentToast("Vous ne pouvez effectuer des demandes de document que si l'année de votre cursus actuel correspond à l'année en cours.");
          
          } else {
            const checked = this.documents.filter(x => x.checked === true && x.DocTyp_Id !== '').map(x => x.DocTyp_Id);
            for (let i = 0; i < checked.length; i++) {
              const donnee = { 'DocTypDem_ID': this.db.guid(), 'DocDemande_ID': docDemande_ID, 'DocTyp_Id': checked[i] };
              this.db.postData('/api/INS_DocTypeDemande', donnee).toPromise().catch(err => {
                console.error(err)
              })
            }

            let msg = 'Votre demande a bien été enregistré.';
            if (docChecked.length > 1) {
              msg += 'Seul les documents disponibles vous seront remis.';
            }
            this.db.presentToast(msg);
            this.close(true);
            // this.documents.forEach(x => {
            //   x.checked = false;
            // });
          }

        });
      })
        .catch(() => {
        });
    } else {
      this.db.presentToast('Les documents que vous souhaitez ne sont pas disponible pour le moment.');
    }
  }

     /**
     * On destroy
     */
      ngOnDestroy(): void
      {
          // Unsubscribe from all subscriptions
          this._unsubscribeAll.next(null);
          this._unsubscribeAll.complete();
      }
}
