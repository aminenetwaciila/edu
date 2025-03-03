import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonAccordionGroup, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { EnfantRouterService } from '../Services/enfant-router.service';
import { EnfantService } from '../Services/enfant.service';
import { Enfant } from '../Types/Enfant.type';

@Component({
  selector: 'app-enfant-encadrants',
  templateUrl: './enfant-encadrants.component.html',
  styleUrls: ['./enfant-encadrants.component.scss'],
  standalone: false,
})
export class EnfantEncadrantsComponent implements OnInit, OnDestroy {


  constructor( private navCtrl: NavController,  private enfantservice: EnfantService, private enfantRouterService: EnfantRouterService) { }

  ngOnInit() {

  }

  openMessages(encadrantId :string){

    this.enfantRouterService.router.next( { route: 'chat', direction: 'forward', sub: true, component: 'CHAT'});

    console.log("openning messages ...")
  }

  ngOnDestroy(): void {
  }

}
