import { Component, Input, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { CallNumber } from '@awesome-cordova-plugins/call-number/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';

@Component({
  selector: 'app-aide-support',
  templateUrl: './aide-support.component.html',
  styleUrls: ['./aide-support.component.scss'],
})
export class AideSupportComponent implements OnInit {

  @Input('phoneNumber') phoneNumber:string;

  constructor( private callNumber: CallNumber, private clipboard:Clipboard, private toastCtrl: ToastController, private translater:TranslateService) { }

  ngOnInit() {}


  makeCall(){
  
    this.callNumber.callNumber(this.phoneNumber, true)
    .then(res =>{

      this.translater.get("SUPPORT.SUCCESS").toPromise().then((msg)=>{
        this.toastCtrl.create({
          color: 'success',
          message: msg,
          duration: 2000,
          position: 'bottom'
        }).then((toast)=>{
          toast.present();
        });

      }).catch((err)=>{})

    })
    .catch(err => {
      this.translater.get("SUPPORT.ERROR").toPromise().then((msg)=>{

        this.toastCtrl.create({
          color: 'warning',
          message: msg,
          duration: 2000,
          position: 'bottom'
        }).then((toast)=>{
          toast.present();
        });

      }).catch((err)=>{})
    });
  }


  copyNumber(){
    this.clipboard.copy(this.phoneNumber);
    this.translater.get("SUPPORT.COPIED").toPromise().then((msg)=>{
      this.toastCtrl.create({
        color: 'success',
        message: msg,
        duration: 1800,
        position: 'bottom'
      }).then((toast)=>{
        toast.present();
      });

    }).catch((err)=>{})
  }

}
