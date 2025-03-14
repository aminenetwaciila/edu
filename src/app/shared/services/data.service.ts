/* eslint-disable */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // url = environment.edu;
  private _matiere: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private _seances: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private _mesmatieres: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private _etudiant: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private _maprogression: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(
    private http: HttpClient,
    private toast: ToastController,

  ) {
    console.log("DataService.constructor");

  }

  /**
    * Setter & getter for etudiant
    *
    * @param value
    */

  set etudiant(value: any) {
    this._etudiant.next(value);
  }

  get etudiant$(): Observable<any> {
    return this._etudiant.asObservable();
  }

  /**
   * Setter & getter for matiere
   *
   * @param value
   */

  set matiere(value: any) {
    this._matiere.next(value);
  }

  get matiere$(): Observable<any> {
    return this._matiere.asObservable();
  }

  /**
    * Setter & getter for mesmatieres
    *
    * @param value
    */

  set mesmatieres(value: any) {
    this._mesmatieres.next(value);
  }

  get mesmatieres$(): Observable<any> {
    return this._mesmatieres.asObservable();
  }


  /**
 * Setter & getter for maprogression
 *
 * @param value
 */

  set maprogressions(value: any) {
    this._maprogression.next(value);
  }

  get maprogressions$(): Observable<any> {
    return this._maprogression.asObservable();
  }


  /**
    * Setter & getter for seance
    *
    * @param value
    */
  set seances(value: any) {
    this._seances.next(value);
  }

  get seances$(): Observable<any> {
    return this._seances.asObservable();
  }


  async presentToast(message) {
    const toast = await this.toast.create({
      message,
      duration: 3000,
      color: 'dark',
      cssClass: 'toastCss',
      // enterAnimation: customToastEnter,
    });
    toast.present();
  }

  deconnexion() {
    this._etudiant.next(null);
    this._matiere.next(null);
    this._seances.next(null);
    this._mesmatieres.next(null);
    this._maprogression.next(null);
  }
}
