import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService
{
    private _url = environment.url;
    private _user: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    private _user_info: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    private _userData: BehaviorSubject<any> = new BehaviorSubject<any>(null);

    /**
     * Constructor
     */
    constructor(private _httpClient: HttpClient, public router: Router)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    // set accessToken(token: string)
    // {
    //     localStorage.setItem('accessToken', token);
    // }

    // get accessToken(): string
    // {
    //     return localStorage.getItem('accessToken') ?? '';
    // }


    /**
     * Setter & getter for user
     *
     * @param value
     */
    set user(value: any)
    {
        // Store the value
        this._user.next(value);
        localStorage.setItem('linkEdu_user', JSON.stringify(value));
    }

    get user$(): Observable<any>
    {
        return this._user.asObservable();
    }

    get user_value()
    {
        return localStorage.getItem('linkEdu_user') ?? ''
    }


     /**
     * Setter & getter for intro
     *
     * @param value
     */
      set intro(value: any)
      {
          localStorage.setItem('intro_displayed', value);
      }

      get intro()
      {
          return localStorage.getItem('intro_displayed') ?? ''
      }

     /**
     * Setter & getter for userData
     *
     * @param value
     */
      set userData(value: any)
      {
          // Store the value
          this._userData.next(value);
      }
  
      get userData$(): Observable<any>
      {
          return this._userData.asObservable();
      }


    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------
    
}
