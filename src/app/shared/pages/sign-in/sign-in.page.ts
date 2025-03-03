import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AlertController, IonicSlides, LoadingController, MenuController, ModalController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { DbService } from 'src/app/shared/services/db.service';

import { UserService } from 'src/app/shared/services/user.service';
// import { SwiperOptions } from 'swiper';
// import { SwiperComponent } from 'swiper/angular';
// import { ForgotPasswordPage } from '../forgot-password/forgot-password.page';
// import SwiperCore, { Autoplay } from 'swiper';
// SwiperCore.use([Autoplay]);

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
  standalone: false,
})
export class SignInPage implements OnInit, AfterViewInit {
  @ViewChild('swiper', { static: false }) swiper?: ElementRef | undefined;;
  swiperModules = [IonicSlides];

  slideNext() {
    this.swiper.nativeElement.slideNext(100);
  }
  slidePrev() {
    this.swiper.nativeElement.slidePrev(100);
  }

  formSubmitted = false;
  signin: FormGroup;
  message = "";
  passwordType = 'password';
  passwordShown = false;
  signup: FormGroup;
  i = 0;
  config: any = {//SwiperOptions
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
  onSwiper([swiper]) {
    // console.log(swiper);
  }
  onSlideChange() {
    // console.log('slide change');
  }

  constructor(
    // public db: DbService,
    public navCtrl: NavController,
    public user: UserService,
    public fb: FormBuilder,
    public loadingController: LoadingController,
    public storage: NativeStorage,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public menuCtrl: MenuController,
    private route: Router,
    public db: DbService,
    public auth: AuthService) { }

  ngOnInit() {
    this.menuCtrl.enable(false);
    this.initializeSigninForm();
  }

  ngAfterViewInit(): void {
    // this.swiper.nativeElement.autoplay.start();
    setTimeout(() => {
      console.log("this.swiper.nativeElement: ", this.swiper.nativeElement);
      // this.swiper.nativeElement.startAutoplay();
    }, 100);
  }

  public passwordToogle() {
    this.passwordShown = !this.passwordShown;
    if (!this.passwordShown) {
      this.passwordType = 'password';
    } else {
      this.passwordType = 'text';
    }
  }





  //FUNCTION INITALIZE FORM GROUP
  public initializeSigninForm() {

    this.signin = new FormGroup({
      Login: new FormControl('', Validators.required),
      Password: new FormControl('', Validators.required),
      remember: new FormControl(true, Validators.required),
    });
    let ids = null;
    this.storage.getItem('linkedu_ids').then((data) => {
      ids = JSON.parse(data);
      this.signin.controls['Login'].setValue(ids.Login);
      this.signin.controls['Password'].setValue(ids.Password);
      this.signin.controls['remember'].setValue(ids.remember);
    })
      .catch(() => { });
  }

  // FIN FUNCTION INITALIZE FORM GROUP


  // convenience getter for easy access to form fields
  get f() { return this.signin.controls; }
  // FIN convenience getter for easy access to form fields


  public login() {
    this.formSubmitted = true;
    if (this.signin.invalid) {
      return;
    }
    this.loginRequest(this.signin.value);
  }

  public forgotpassword() {
    this.route.navigate(['/forgot-password'])
  }

  public async loginRequest(data) {
    const loading = await this.loadingController.create();
    await loading.present().then(() => { });

    this.auth.signIn(data)
      .subscribe({
        next: (res) => {
          this.user.user = res;
          switch (res.Role) {
            case 'etudiant':
              this.route.navigateByUrl('menuEtd/tabs/actualite').then(() => {
                loading.dismiss().then(() => { });
              });
              break;
            case "intervenant":
              this.route.navigateByUrl('menu/tabs/tab0').then(() => {
                loading.dismiss().then(() => { });
              });
              break;
            case "tuteur":
              this.route.navigateByUrl('menuTtr/tabs/actualites').then(() => {
                loading.dismiss().then(() => { });
              });
              break;

            default:

          }

          if (this.signin?.value?.remember) {
            this.storage.setItem('linkedu_ids', JSON.stringify(this.signin.value))
          }

        },
        error: (err) => {
          loading.dismiss().then(() => { });
          this.db.presentToast('Le nom d\'utilisateur ou le mot de passe est incorrect.');
        }
      });
  }

  public gotosignup() {
    this.navCtrl.navigateForward('sign-up');
  }



}
