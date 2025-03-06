import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@capacitor/storage';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor(public router: Router) {
  }

  static async GetLocalStorage(key: string) {
    // console.log("GetLocalStorage -------------------");
    try {
      const { value } = await Storage.get({ key: key });
      if (value) {
        // console.log("GetLocalStorage ", key, " : ", value);
        return value;
      } else {
        // console.log("GetLocalStorage ", key, " not found.");
        return null;
      }
    } catch (error) {
      console.error('GetLocalStorage Error getting ', key, " : ", error);
      return null;
    }
  }

  static async SetLocalStorage(key: string, value: string) {
    // console.log("SetLocalStorage ", key, " : ", value);
    await Storage.set({ key: key, value: value });
  }



  static getFormattedDate(date: Date) {
    return ('0' + (date.getDate())).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
  }
  static getFormattedTime(date: Date) {
    return ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
  }


}
