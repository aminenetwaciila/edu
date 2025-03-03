import { Component, OnInit } from '@angular/core';
import { EnfantService } from '../Services/enfant.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.page.html',
  styleUrls: ['./tabs.page.scss'],
  standalone: false,
})
export class TabsPage implements OnInit {

  constructor( private enfantservice:EnfantService) {
  }

  ngOnInit() {
  }

}
