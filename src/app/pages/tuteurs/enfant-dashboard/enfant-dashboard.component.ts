import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EnfantRouterService } from '../Services/enfant-router.service';
import { EnfantService } from '../Services/enfant.service';
import { Enfant } from '../Types/Enfant.type';

@Component({
  selector: 'app-enfant-dashboard',
  templateUrl: './enfant-dashboard.component.html',
  styleUrls: ['./enfant-dashboard.component.scss'],
  standalone: false,
})
export class EnfantDashboardComponent implements OnInit, OnDestroy {

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

  forward( route :string, component :string){
    this.enfantRouterService.router.next( { route, direction: 'forward', sub: true, component});
  }

  ngOnDestroy(): void {
    this.enfant$.unsubscribe();
  }

}
