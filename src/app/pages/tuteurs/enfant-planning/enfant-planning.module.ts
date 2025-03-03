import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { EnfantPlanningComponent } from './enfant-planning.component';

import { FullCalendarModule } from '@fullcalendar/angular';
// import interactionPlugin from '@fullcalendar/interaction'; // a plugin
// import dayGridPlugin from '@fullcalendar/daygrid';
// import timeGridPlugin from '@fullcalendar/timegrid';
// import listPlugin from '@fullcalendar/list';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

// FullCalendarModule.registerPlugins([ // register FullCalendar plugins
//   dayGridPlugin,
//   interactionPlugin,
//   timeGridPlugin,
//   listPlugin
// ]);


@NgModule({
  declarations: [
    EnfantPlanningComponent
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    FullCalendarModule,
    TranslateModule
  ]
})
export class EnfantPlanningModule { }
