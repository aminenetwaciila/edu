import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TuteurApiService } from '../Services/tuteur-api.service';

@Component({
  selector: 'app-mon-compte',
  templateUrl: './mon-compte.page.html',
  styleUrls: ['./mon-compte.page.scss'],
})
export class MonComptePage implements OnInit {

  editting = false;
  readonly default_avatar = "/assets/images/default-avatar.jpg"
  tuteurForm : FormGroup = new FormGroup({
    photo: new FormControl( null , Validators.required),
    prenom: new FormControl( '', Validators.required),
    nom: new FormControl( '', Validators.required),
    adresse: new FormControl( '', Validators.required),
    email: new FormControl( '', [Validators.required, Validators.email]),
    tel: new FormControl( '', Validators.required),
  }); 
  formSubmitted = false;

  private ttrSubs$ ?: Subscription

  constructor(
    private tuteurApi : TuteurApiService
  ) { 
    this.ttrSubs$ = this.tuteurApi.tuteurSubj.subscribe({
      next: (ttr)=>{
        this.tuteurForm = new FormGroup({
          photo: new FormControl( ttr.Pers_Photo, Validators.required),
          prenom: new FormControl( ttr.Pers_Prenom, Validators.required),
          nom: new FormControl( ttr.Pers_Nom, Validators.required),
          adresse: new FormControl( ttr.Crd_AdrLigne1, Validators.required),
          email: new FormControl( ttr.Crd_AdessCouriel1, [Validators.required, Validators.email]),
          tel: new FormControl( ttr.Crd_Cell1, Validators.required),
        }); 
      }
    })
  }


  ngOnInit() {
    const ttr = this.tuteurApi.tuteurObject;
    this.tuteurForm = new FormGroup({
      photo: new FormControl( ttr.Pers_Photo, Validators.required),
      prenom: new FormControl( ttr.Pers_Prenom, Validators.required),
      nom: new FormControl( ttr.Pers_Nom, Validators.required),
      adresse: new FormControl( ttr.Crd_AdrLigne1, Validators.required),
      email: new FormControl( ttr.Crd_AdessCouriel1, [Validators.required, Validators.email]),
      tel: new FormControl( ttr.Crd_Cell1, Validators.required),
    }); 
  }

  enableEditting(){
    this.editting = true;
  }

  disableEditting(){
    this.editting = false;
  }

}
