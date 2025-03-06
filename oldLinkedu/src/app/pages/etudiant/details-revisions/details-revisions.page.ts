import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DbService } from 'src/app/shared/services/db.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-details-revisions',
  templateUrl: './details-revisions.page.html',
  styleUrls: ['./details-revisions.page.scss'],
})
export class DetailsRevisionsPage implements OnInit {
  @Input() matchoose = [];
  userData: any;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(
    private modalCtrl: ModalController,
    private db: DbService,
    private user: UserService,
  ) { }

  ngOnInit() {

    this.user.user$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe((data: any) => {

      this.userData = data;
    });

  }

  isSaveEnabled() {
    let ret = true;
    this.matchoose.forEach(x => {
      if (ret) {
        ret = x.evals.filter(y => y.revision !== null && y.revision !== '').length > 0;
      }
    });

    return ret;
  }

  async saveRevision() {
    
    this.close(this.matchoose);
    
    

    // Parcourt des élements d'évaluations qui on été commenter pour les ajoutés a l'objet newRevision
    

    
  }

  close(val?) {
    this.modalCtrl.dismiss(val);
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
