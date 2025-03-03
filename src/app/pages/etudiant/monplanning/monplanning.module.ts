import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MonplanningPageRoutingModule } from './monplanning-routing.module';

import { MonplanningPage } from './monplanning.page';
import { FullCalendarModule } from '@fullcalendar/angular';

// import { FullCalendarModule } from '@fullcalendar/angular';
// import interactionPlugin from '@fullcalendar/interaction'; // a plugin
// import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import listPlugin from '@fullcalendar/list';

// FullCalendarModule.registerPlugins([ // register FullCalendar plugins
//   dayGridPlugin,
//   interactionPlugin,
//   timeGridPlugin,
//   listPlugin
// ]);


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MonplanningPageRoutingModule,
    FullCalendarModule
  ],
  declarations: [MonplanningPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class MonplanningPageModule { }
