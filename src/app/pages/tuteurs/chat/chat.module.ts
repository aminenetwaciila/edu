import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { IonicModule } from '@ionic/angular';
import { UserMessageComponent } from './components/user-message/user-message.component';
import { MyMessageComponent } from './components/my-message/my-message.component';
import { MessagesDetailFooterComponent } from './components/footer/footer.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    ChatComponent,
    UserMessageComponent,
    MessagesDetailFooterComponent,
    MyMessageComponent
  ],
  imports: [
    IonicModule,
    FormsModule,
    CommonModule,
    TranslateModule
  ]
})
export class ChatModule { }
