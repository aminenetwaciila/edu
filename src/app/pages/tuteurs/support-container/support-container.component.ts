import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-support-container',
  templateUrl: './support-container.component.html',
  styleUrls: ['./support-container.component.scss'],
  standalone: false,
})
export class SupportContainerComponent implements OnInit {

  phoneNumber="";
  constructor() {
    this.phoneNumber = environment.NumeroSupportTtr;
  }

  ngOnInit() {}

}
