import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { EnfantRouterService } from '../Services/enfant-router.service';
import { EnfantService } from '../Services/enfant.service';
import { Enfant } from '../Types/Enfant.type';

@Component({
  selector: 'app-enfant-index',
  templateUrl: './enfant-index.page.html',
  styleUrls: ['./enfant-index.page.scss'],
  standalone: false,
})
export class EnfantIndexPage implements OnInit, OnDestroy {


  enfants: Enfant[] = [];
  enfant: Enfant = null;
  enfant$: Subscription;

  sub: boolean = false;
  component: string = null;
  private routing$?: Subscription

  sub1:any=null; sub2:any = null;

  readonly components = [
    // #TODO: get this back
    "INFOS",
    //"PEDAGOGY",
    "PLANNING",
    "ABSENCE",
    "NOTES",
    //"ENCADRANTS",
    //"INCIDENTS" // this is appreciations
  ];


  constructor(
    private navCtrl: NavController,
    private enfantservice: EnfantService,
    private enfantRoutingService: EnfantRouterService) {
      this.enfants = this.enfantservice.approvedEnfants;
      this.enfant = this.enfantservice.currentEnfant

      this.enfant$ = this.enfantservice.currentSelectedEnfantSubj.subscribe({
        next: e => {
          if( !e )return;
          this.enfant = e;
          this.enfants = this.enfantservice.approvedEnfants;
        },
        error: (e) => {
          if( !e )return;
          this.enfant = e;
          this.enfants = this.enfantservice.approvedEnfants;
        }
      })


    this.routing$ = this.enfantRoutingService.router.subscribe(
      e => {
        if (e == null) return;

        if (e.direction == 'forward') {
          this.navCtrl.navigateForward("/menuTtr/tabs/mesenfants/enf/" + e.route);
          this.setTabBarHidden(e.component == 'CHAT')
        } else {
          this.navCtrl.navigateBack(e.route)
        }
        this.sub = e.sub;
        this.component = e.component;
        e = null;
      }
    )

  }

  ngOnInit() {
    this.enfants = this.enfantservice.approvedEnfants;
    this.enfant = this.enfantservice.currentEnfant;
  }


  ngOnDestroy(): void {
    this.enfant$?.unsubscribe();
    this.routing$?.unsubscribe();
    this.component = null;
    this.sub = false;
    this.enfant = null;
    this.enfants = [];
  }

  setTabBarHidden(hidden: boolean) {
    const tabBar = document.querySelector('ion-tab-bar');
    if (tabBar !== null) {
      if (hidden)
        tabBar.style.display = 'none';
      else
        tabBar.style.display = 'flex';
    }
  }

  changeEnfant(enf: Enfant) {
    const index = this.enfantservice.approvedEnfants.indexOf(enf);
    this.enfantservice.setCurrEnfantIndex(index);
  }

  exit() {
    if (this.component == 'CHAT') {
      this.component = "ENCADRANTS"
      this.setTabBarHidden(false)
      this.navCtrl.back();
      this.enfantRoutingService.router.next(null);
      return;
    }

    if (this.sub) {
      this.sub = false;
      this.component = null;

      this.navCtrl.navigateBack("/menuTtr/tabs/mesenfants/enf/dashboard");
      this.enfantRoutingService.router.next(null);
    } else {
      this.sub = false;
      this.component = null;
      this.enfant = null;
      this.enfantservice.clear();
      this.enfantRoutingService.router.next(null);
      this.navCtrl.navigateBack("/menuTtr/tabs/mesenfants");
    }
    //this.navCtrl.back();
  }



  navigateToComponent(comp: string) {
    this.enfantRoutingService.router.next({ component: comp, direction: 'forward', route: comp.toLowerCase(), sub: true });
  }


}
