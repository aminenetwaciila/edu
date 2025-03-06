import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ModalController } from '@ionic/angular';
import { DbService } from 'src/app/shared/services/db.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-update-seance',
  templateUrl: './update-seance.page.html',
  styleUrls: ['./update-seance.page.scss'],
})
export class UpdateSeancePage implements OnInit {
  formSubmitted = false;
  seanceForm: FormGroup;
  // Data passed in by componentProps
  @Input() param: string;
  seance: any;
  userData: any;


  constructor(
    public modalCtrl: ModalController,
    public loadingController: LoadingController,
    private _userServ: UserService,
    public db: DbService) { }

  ngOnInit() {

    if (this.param != null) {
      this.seance = JSON.parse(this.param);
    }
    this.initializeSeanceForm(this.seance);

    this._userServ.user$.subscribe((data) => {
      this.userData = data;
    })
  }



// convenience getter for easy access to form fields
  get f() { return this.seanceForm.controls; }

  //FUNCTION INITALIZE FORM GROUP
  public initializeSeanceForm(seance?: any) {

    this.seanceForm = new FormGroup({
      Sea_Id: new FormControl(seance?.Sea_Id, Validators.required),
      date: new FormControl(seance?.Sea_DateDebutEffective, Validators.required),
      debut: new FormControl(seance?.Sea_DateDebutEffective, Validators.required),
      fin: new FormControl(seance?.Sea_DateFinEffeEffective, Validators.required),
      salle: new FormControl(seance?.SalleEffective, Validators.required),
      remarque: new FormControl(seance?.Sea_Remarque),
    });
  }

  public async save() {
    this.formSubmitted = true;


    if (this.seanceForm.invalid) {
      return;
    }

    const data = this.seanceForm.value;

    const loading = await this.loadingController.create();
    await loading.present().then(() => {});

    const seance: any = {};
    
    seance.Sea_DateDebutEffective = data.date;
    seance.Sea_DateFinEffective = data.fin;
    seance.Sea_DateFinEffeEffective = data.fin;
    seance.SalleEffective = data.salle;
    seance.Sea_Remarque = data.remarque;
    seance.Sea_Id = data.Sea_Id;
    seance.Intv_Id = this.userData?.Intv_Id;

    this.db.putData('api/ABS_SeanceAPI/UpdateSeance', seance)
    .subscribe({
      next: () => {
        this.modalCtrl.dismiss().then(() => {
          loading.dismiss().then(() => {});
        });
      },
      error: (err) => {
        loading.dismiss().then(() => {});
        this.db.presentToast('Une erreur est survenue. Veuillez réessayer ultérieurement.');
      }
    });
   
  }

  public close() {
    this.modalCtrl.dismiss();
  }

}
