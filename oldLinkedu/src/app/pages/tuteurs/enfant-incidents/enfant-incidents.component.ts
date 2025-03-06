import { Component, OnInit } from '@angular/core';
import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';

@Component({
  selector: 'app-enfant-incidents',
  templateUrl: './enfant-incidents.component.html',
  styleUrls: ['./enfant-incidents.component.scss'],
})
export class EnfantIncidentsComponent implements OnInit {

  incidents = [ // todo define model here 
    {
      prof : {
        id: 1,
        name: "Administration",
        img: "https://via.placeholder.com/300x200/123",
      },
      content:"Lorem epsom Lorem lorem",
      date: "22/03/2022",
      images: [
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
