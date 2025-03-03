import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { UserService } from '../user.service';
import { AuthUtils } from './auth.utils';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthService
{
    private _url: any = environment.url;
    private _authenticated: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string
    {
        return localStorage.getItem('accessToken') ?? '';
    }

    
    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any>
    {
        return this._httpClient.post(this._url + 'api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any>
    {
        return this._httpClient.post(this._url + 'api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */ 
    signIn(credentials: { Login: string; Password: string }): Observable<any>
    {
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post(this._url + 'api/AccountAPI/Login', credentials).pipe(
            switchMap((response: any) => {

                if (response == null) {
                    return throwError(response);
                }
                // Store the access token in the local storage
                // this.accessToken = response.accessToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response;

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any>
    {
        try {
            this._userService.user = JSON.parse(this._userService.user_value);
        } catch (error) {
        return of(false);
        }
        return;
        // Renew token
        return this._httpClient.post(this._url + 'api/auth/refresh-access-token', {
            accessToken: this.accessToken
        }).pipe(
            catchError(() =>

                // Return false
                of(false)
            ),
            switchMap((response: any) => {

                // Store the access token in the local storage
                this.accessToken = response.accessToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any>
    {
        // Remove the access token from the local storage
        // localStorage.removeItem('accessToken');
        localStorage.removeItem('linkEdu_user');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; company: string }): Observable<any>
    {
        return this._httpClient.post(this._url + 'api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post(this._url + 'api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        // Check if the user is logged in
        if ( this._authenticated )
        {
            return of(true);
        }

        // Check the access token availability
        if ( this._userService.user_value )
        {
            try {
                this._userService.user = JSON.parse(this._userService.user_value);
            } catch (error) {
            return of(false);
            }
            return of(true);
        }

        // return of(false);

        // Check the access token expire date
        // if ( AuthUtils.isTokenExpired(this.accessToken) )
        // {
        //     return of(false);
        // }

        // If the access token exists and it didn't expire, sign in using it
        return this.signInUsingToken();
    }

     /**
     * Check the authentication status
     */
      check_no_auth(): Observable<any>
      {
  
  
          // Check if the user is logged in
          if ( this._authenticated )
          {
              return of({ authenticated: true, intro: this._userService.intro});
          }
  
          // Check the access token availability
          if ( this._userService.user_value )
          {
              try {
                this._userService.user = JSON.parse(this._userService.user_value);
                if (this._userService.user == null) {
                    return of({ authenticated: false, intro: this._userService.intro});
                }
              } catch (error) {
                return of({ authenticated: false, intro: this._userService.intro});
              }
            return of({ authenticated: true, intro: this._userService.intro});
          }
  
          // return of(false);
  
          // Check the access token expire date
          // if ( AuthUtils.isTokenExpired(this.accessToken) )
          // {
          //     return of(false);
          // }
  
          // If the access token exists and it didn't expire, sign in using it
          return of({ authenticated: false, intro: this._userService.intro});
  
          // return this.signInUsingToken();
      }
}
