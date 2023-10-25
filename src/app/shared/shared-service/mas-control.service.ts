import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { SharedService } from 'src/app/shared/shared.service';
import { Observable, throwError } from 'rxjs';
import { MasControl } from 'src/app/model/mas-control.interface';
import * as moment from 'moment';

export interface MasControlData<T> {
  Data: T[],
  StatusCode: string,
  Message: string,
};

@Injectable({
  providedIn: 'root'
})
export class MasControlService {

  constructor(
    private _svShare: SharedService,
    private _http: HttpClient,
  ) { }

  public GetMasControl(compCode: string, brnCode: string, ctrlCode: string): Observable<MasControlData<MasControl>> {
    compCode = (compCode || "").toString().trim();
    brnCode = (brnCode || "").toString().trim();
    ctrlCode = (ctrlCode || "").toString().trim();
    if (compCode === "" || brnCode === "" || ctrlCode === "") {
      return;
    }

    let req =
    {
      "CompCode": compCode,
      "BrnCode": brnCode,
      "ctrlCode": ctrlCode
    }

    return this._http.post(this._svShare.urlMas + "/api/MasControl/GetMasControl", req).pipe(
      map((headerData: MasControlData<MasControl>) => headerData),
      catchError(err => throwError(err))
    )
  }

  public async UpdateCtrlValue(compCode: string, brnCode: string, locCode: string, systemDate: Date, user: string) {
    let req = {
      "CompCode": compCode,
      "BrnCode": brnCode,
      "LocCode": locCode,
      "SystemDate": moment(systemDate).format('YYYY-MM-DD'),
      "User": user
    };

    return await this._http.post(this._svShare.urlMas + "/api/MasControl/UpdateCtrlValue", req).pipe(
      map((masControlData: MasControlData<MasControl>) => masControlData),
      catchError(err => throwError(err))
    ).toPromise()
  }

}
