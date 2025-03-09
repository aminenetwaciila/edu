import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { LoadingController, NavController, Platform, ToastController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { TuteurApiService } from 'src/app/pages/tuteurs/Services/tuteur-api.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ActualiteT, CreateCommentRequest } from '../../../Types/ActualitePageTypes.type';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.scss'],
  standalone: false,
})
export class PostPageComponent implements OnInit, AfterViewInit {

  actualite : ActualiteT ;
  loading:any;
  activatedRoute$ ?:Subscription;
  private post_id:string;
  commentModel ="";
  focusOnInput = false
  submitting=false;

  readonly default_avatar = "/assets/images/default-avatar.jpg"

  constructor(
    private navCtrl: NavController,
    private photoViewer: PhotoViewer,
    private spinnerCtrl:LoadingController,
    private route: ActivatedRoute,
    private plateform: Platform,
    private tuteurApi: TuteurApiService,
    private translate: TranslateService,
    private toastCtrl: ToastController,
    private userService: UserService
    ) {

    this.plateform.backButton.subscribeWithPriority( 1, ()=>{
      this.back();
    })

    this.activatedRoute$ = this.route.params.subscribe(params=>{
      this.post_id = params['id'];
      this.focusOnInput = params['comments'] && params['comments'].length>0
      if( this.post_id.length==0 )
        this.back()
    });
    this.showLoadingSpinner()

  }


  ngAfterViewInit(): void {
    if( this.focusOnInput )
      setTimeout(()=>{
        document.getElementById('commentInput')?.scrollIntoView()
        document.getElementById('commentInput')?.focus()
      }, 1400)
  }


  async showLoadingSpinner(){
    this.translate.get("TTR.COMMON.LOADING").toPromise().then(async msg=>{
      this.loading = await this.spinnerCtrl.create({
        message: msg,
      });
      this.loading.present()
    })
  }

  previewImage( url ){
    this.photoViewer.show( url, "", {share: true});
  }

  ngOnInit() {
    console.log("Tuteur.post-page.component.ts ngOnInit");

    const tabBar = document.querySelector('ion-tab-bar');
    if (tabBar !== null) {
        tabBar.style.display = 'none';
    }

    setTimeout(()=>{
      this.tuteurApi.getActualite(this.post_id).subscribe({
        next: (resp)=>{
          this.actualite = resp
          this.loading.dismiss();
        },
        error: (err)=>{
          this.loading.dismiss();
          this.translate.get("TTR.TAB1.FEED_NOT_FOUND").toPromise().then( (msg)=>{
            this.toastCtrl.create({message: msg, duration:4000, position:'bottom', keyboardClose:true, color:'danger'})
              .then( (toast)=>toast.present() );
          })
          this.back()
        }
      })
    }, 500)
  }

  back(){
    const tabBar = document.querySelector('ion-tab-bar');
    if (tabBar !== null) {
      tabBar.style.display = 'flex';
    }
    this.navCtrl.back();
  }

  doRefresh(event){
    setTimeout(()=>{
      this.tuteurApi.getActualite(this.post_id).subscribe({
        next: (resp)=>{
          this.actualite = resp
          event.target.complete();
        },
        error: (err)=>{
          this.loading.dismiss();
          this.translate.get("TTR.TAB1.FEED_NOT_FOUND").toPromise().then( (msg)=>{
            this.toastCtrl.create({message: msg, duration:4000, position:'bottom', keyboardClose:true, color:'danger'})
              .then( (toast)=>toast.present() );
          })
          event.target.complete();
          this.back()
        }
      })
    }, 500)
  }

  comment(){
    if( this.commentModel.length==0 )return;
    const tuteur_data = JSON.parse(this.userService.user_value);
    const comment:CreateCommentRequest = {
      ActCom_Act_Id: this.actualite.Act_Id,
      ActCom_contenu: this.commentModel,
      ActCom_created_at: new Date(),
      ActCom_Id: uuidv4(),
      ActCom_User_Id: "" //tuteur_data.Ttr_Id // dev db id => for testing "277E360E-312B-6891-A4A9-0022C42111EF"//
    }
    this.submitting=true
    console.log("comment: ", comment)
    this.tuteurApi.createCommentOnActualite(comment).subscribe({
      next:(newComment)=>{
        this.actualite.comments.unshift(newComment)
        this.commentModel = "";
        this.submitting=false
      },
      error: (err)=>{
        this.translate.get("TTR.ERRORS.GENERIC").toPromise().then( (msg)=>{
          this.toastCtrl.create({message: msg+` (${err.status})`, duration: 5000, position: 'bottom', color: 'danger'})
          .then( (toast)=>toast.present() );
        })
        this.submitting=false
      }
    })
  }
}
