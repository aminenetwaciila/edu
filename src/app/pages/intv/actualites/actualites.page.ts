import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';

// import Swiper core and required modules
// import SwiperCore, { Pagination, Navigation } from "swiper";

// import { PhotoViewer } from '@awesome-cordova-plugins/photo-viewer/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { IonInfiniteScroll, IonRefresher, NavController, Platform, ToastController } from '@ionic/angular';
import { TuteurApiService } from 'src/app/pages/tuteurs/Services/tuteur-api.service';
import { ActualiteT } from '../Types/ActualitePageTypes.type';
import { TranslateService } from '@ngx-translate/core';


// install Swiper modules
// SwiperCore.use([Pagination, Navigation]);

@Component({
  selector: 'app-actualites-intervenant',
  templateUrl: './actualites.page.html',
  styleUrls: ['./actualites.page.scss'],
  encapsulation: ViewEncapsulation.None,
  standalone: false,
})
export class ActualitesPage implements OnInit {


  @ViewChild('myswiper') newSwiper: any;

  size = 3;
  page = 1; // first page at start
  posts: ActualiteT[] = [];
  firstLoad = false;
  NoMoreData = false;

  constructor(
    private photoViewer: PhotoViewer,
    private navCtrl: NavController,
    private plateform: Platform,
    private tuteurApi: TuteurApiService,
    private toastCtrl: ToastController,
    private translater: TranslateService
  ) {
    this.plateform.backButton.subscribeWithPriority(2, () => { }) // disable hardware back button (android)
  }



  ngOnInit() {

    setTimeout(() => {
      this.tuteurApi.paginerActualites(this.size, (this.page - 1) * this.size).subscribe({
        next: (data) => {
          this.posts = data.data; // first call without a concat operation.
          this.size = data.size;
          this.page++;
          this.firstLoad = true;
        },
        error: (err) => {
          if (err.status == 404)
            this.translater.get("TTR.ERRORS.NO_INTERNET_CONNECTION").toPromise().then((msg) => {
              this.toastCtrl.create({ message: msg, duration: 4000, position: 'bottom', color: 'danger' })
                .then((toast) => toast.present());
            })
          else
            this.translater.get("TTR.ERRORS.GENERIC").toPromise().then((msg) => {
              this.toastCtrl.create({ message: msg, duration: 3000, position: 'bottom', color: 'warning' })
                .then((toast) => toast.present());
            })
          this.firstLoad = true;
        }
      })
    }, 2000)

  }

  doRefresh(event) {

    setTimeout(() => {
      this.page = 1;
      this.NoMoreData = false
      this.tuteurApi.paginerActualites(this.size, (this.page - 1) * this.size).subscribe({
        next: (data) => {
          this.posts = data.data;
          this.size = data.size;
          this.page++;
          event.target.complete();
        },
        error: (err) => {
          if (err.status == 404)
            this.translater.get("TTR.ERRORS.NO_INTERNET_CONNECTION").toPromise().then((msg) => {
              this.toastCtrl.create({ message: msg, duration: 4000, position: 'bottom', color: 'danger' })
                .then((toast) => toast.present());
            })
          else
            this.translater.get("TTR.ERRORS.GENERIC").toPromise().then((msg) => {
              this.toastCtrl.create({ message: msg, duration: 3000, position: 'bottom', color: 'warning' })
                .then((toast) => toast.present());
            })
          event.target.complete();
        }
      })
    }, 1000)
  }

  loadData(event: any) {
    if (this.NoMoreData) {
      event.target.complete();
      return
    }

    setTimeout(() => {
      this.tuteurApi.paginerActualites(this.size, (this.page - 1) * this.size).subscribe({
        next: (data) => {
          this.posts = this.posts.concat(data.data);
          this.size = data.size;
          if (data.data.length == 0)
            this.NoMoreData = true;
          this.page++;
          event.target.complete();
        },
        error: (err) => {
          if (err.status == 404)
            this.translater.get("TTR.ERRORS.NO_INTERNET_CONNECTION").toPromise().then((msg) => {
              this.toastCtrl.create({ message: msg, duration: 4000, position: 'bottom', color: 'danger' })
                .then((toast) => toast.present());
            })
          else
            this.translater.get("TTR.ERRORS.GENERIC").toPromise().then((msg) => {
              this.toastCtrl.create({ message: msg, duration: 3000, position: 'bottom', color: 'warning' })
                .then((toast) => toast.present());
            })
          event.target.complete();

        }
      })

    }, 1000)
  }

  previewImage(url) {
    this.photoViewer.show(url, "", { share: true });
  }

  readMore(postID, gotoComments: boolean) {
    this.navCtrl.navigateForward(['/menu/tabs/tab0/post', postID, (gotoComments ? "comments" : '')])
  }

  toggleLike(actualite: ActualiteT) {
    actualite.liked = !actualite.liked;
    if (actualite.liked)
      actualite.num_likes++;
    else
      actualite.num_likes--;
    this.tuteurApi.toggleActualiteLike(actualite.Act_Id).subscribe({
      next: (response) => {
        if (!response) {
          actualite.liked = !actualite.liked;
          if (actualite.liked)
            actualite.num_likes++;
          else
            actualite.num_likes--;
        }
      },
      error: (response) => {
        // todo : hanlde unauthenticated error
        actualite.liked = !actualite.liked;
        if (actualite.liked)
          actualite.num_likes++;
        else
          actualite.num_likes--;
      }
    })
  }

}
