import { Component, OnInit } from '@angular/core';
import { DRemarque } from '../../../Types/DRemarque.type';

@Component({
  selector: 'app-remarques',
  templateUrl: './remarques.component.html',
  styleUrls: ['./remarques.component.scss'],
  standalone: false,
})
export class RemarquesComponent implements OnInit {


  remarques:DRemarque[] = [
    {
      id: "1",
      posterName: "Prof. Jean",
      image: "https://via.placeholder.com/300x200/124",
      content: "Ceci est un exemple de remarque"
    },
    {
      id: "2",
      posterName: "Prof. Ahmed",
      image: "https://via.placeholder.com/300x200/126",
      content: "Ceci est un exemple de remarque, qui est plus longue que la première remarque . Ceci est un exemple de remarque, qui est plus longue que la première remarque .Ceci est un exemple de remarque, qui est plus longue que la première remarque .",
    },
    {
      id: "3",
      posterName: "Administration",
      image: "https://via.placeholder.com/300x200/125",
      content: "Ceci est un exemple de remarque"
    },
  ]

  constructor() { }

  ngOnInit() {}

}
