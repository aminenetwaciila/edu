import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController } from '@ionic/angular';
import { Subject, timer } from 'rxjs';
import { finalize, takeUntil, takeWhile, tap } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service';
import { DataService } from '../../services/data.service';
// import { DbService } from '../../services/db.service';

@Component({
  selector: 'app-sign-out',
  templateUrl: './sign-out.page.html',
  styleUrls: ['./sign-out.page.scss'],
  standalone: false,
})
export class SignOutPage implements OnInit, OnDestroy {
  countdown: number = 5;
    countdownMapping: any = {
        '=1'   : '# seconde',
        'other': '# secondes'
    };
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _router: Router,
        private menu: MenuController,
        private dataServ: DataService,
        private navCtrl: NavController
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.menu.enable(false);
        // Sign out
        this._authService.signOut();

        //
        this.dataServ.deconnexion();
        // Redirect after the countdown
        timer(1000, 1000)
        .pipe(
            finalize(() => {
                this.navCtrl.navigateBack(['sign-in']);
            }),
            takeWhile(() => this.countdown > 0),
            takeUntil(this._unsubscribeAll),
            tap(() => this.countdown--)
        )
        .subscribe();
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
