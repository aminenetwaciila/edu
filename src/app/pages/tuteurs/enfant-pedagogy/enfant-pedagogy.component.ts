import { Component, OnInit } from '@angular/core';
// import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';

@Component({
  selector: 'app-enfant-pedagogy',
  templateUrl: './enfant-pedagogy.component.html',
  styleUrls: ['./enfant-pedagogy.component.scss'],
  standalone: false,
})
export class EnfantPedagogyComponent implements OnInit {

  posts = [ // todo define model here
    {
      prof : {
        id: 1,
        name: "Prof. Hamza",
        img: "https://via.placeholder.com/300x200/123",
        speciality: "Departement X"
      },
      content:"Lorem epsom Lorem lorem",
      date: "22/03/2022",
      images: []
    },
    {
      prof : {
        id: 1,
        name: "Prof. Mohamed",
        img:"https://via.placeholder.com/300x200/123",
        speciality: "Departement Y"
      },
      content:"Lorem epsom Lorem lorem",
      date: "22/03/2022",
      images : [
        "https://via.placeholder.com/300x200/123",
          "https://via.placeholder.com/300x200/125",
      ]
    }
  ]

  constructor( private photoViewer: PhotoViewer) { }

  ngOnInit() {}

  previewImage( url ){
    this.photoViewer.show( url, "", {share: true});
  }

}
