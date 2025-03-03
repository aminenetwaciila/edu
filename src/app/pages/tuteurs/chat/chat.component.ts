import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
  standalone: false,
})
export class ChatComponent implements OnInit {

  constructor() { }

  ngOnInit() {}

   /**
   * Content scroll start
   */
    logScrollStart() {
    }

    /**
     * Content scrolling
     */
    logScrolling(event) {
      // console.log('Scrolling', event);
    }

    /**
     * Content scroll end
     */
    logScrollEnd() {
    }

}
