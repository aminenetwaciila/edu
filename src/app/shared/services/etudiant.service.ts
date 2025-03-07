import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EtudiantService {

  constructor(
    public router: Router,
    public http: HttpClient,
  ) {
  }

  CanEtudiantCreateRevisionNote(EtdSpecSms_Id: string) {
    let url = `${environment.upulseEdu}/api/Etudiant/CanEtudiantCreateRevisionNote?`;
    url += `EtdSpecSms_Id=${EtdSpecSms_Id}`;
    return this.http.get(url);
  }




}
