import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { IonicSlides, MenuController, NavController } from '@ionic/angular';
// import { SwiperOptions } from 'swiper';
import { UserService } from '../../services/user.service';
// import { SwiperComponent } from 'swiper/angular';
// import { ForgotPasswordPage } from '../forgot-password/forgot-password.page';
// import SwiperCore, {Autoplay} from 'swiper';
// SwiperCore.use([Autoplay]);

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
  standalone: false,
})
export class IntroPage implements OnInit, AfterViewInit {
  @ViewChild('swiper', { static: false }) swiper?: any//SwiperComponent;
  swiperModules = [IonicSlides];

  config: any = {
    slidesPerView: 1,
    spaceBetween: 50,
    loop: true,
    autoplay: {
      delay: 1000,
      disableOnInteraction: false
    },
    navigation: false,
    pagination: false,
    scrollbar: false,
  };

  constructor(
    public navCtrl: NavController,
    public menuCtrl: MenuController,
    private _user: UserService) { }

  ngAfterViewInit(): void {
    // this.swiper.swiperRef.autoplay.start();
  }


  ngOnInit() {
    this.menuCtrl.enable(false);
    this._user.intro = true;
  }


  public gotosignup() {
    this.navCtrl.navigateForward('sign-up');
  }


  public gotosignin() {
    this.navCtrl.navigateRoot('sign-in');
  }

}
