import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EnfantRouterService } from '../Services/enfant-router.service';
import { EnfantService } from '../Services/enfant.service';
import { Enfant } from '../Types/Enfant.type';

@Component({
  selector: 'app-enfant-infos',
  templateUrl: './enfant-infos.component.html',
  styleUrls: ['./enfant-infos.component.scss'],
  standalone: false,
})
export class EnfantInfosComponent implements OnInit, OnDestroy {


  enfant : Enfant = null;
  enfant$: Subscription;

  constructor( private enfantservice: EnfantService, private enfantRouterService: EnfantRouterService) {
    this.enfant$ = this.enfantservice.currentSelectedEnfantSubj.subscribe( e=>{
      this.enfant = e;
    })
  }

  ngOnInit() {
    this.enfant = this.enfantservice.currentEnfant;
  }

  ngOnDestroy(): void {
    this.enfant$.unsubscribe();
  }

  getEnfantGender( id :string ){
    const list =  this.enfantservice.gendersList;
    const gender = list.find(e=>e.Sex_Id==id)
    return gender ? gender.Sex_Nom : null;
  }



}
