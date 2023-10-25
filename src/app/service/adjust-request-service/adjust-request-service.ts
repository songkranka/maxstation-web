import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SharedService } from 'src/app/shared/shared.service';
import { AdjustRequest, AdjustRequestData } from 'src/app/model/inventory/adjustrequest.interface';
import { DefaultService } from '../default.service';


@Injectable({
  providedIn: 'root'
})

export class AdjustRequestService {
  constructor(private http: HttpClient, private sharedService: SharedService, private _svDefault: DefaultService) { }
  findAll(brncode: string, compcode: string, Loccode: string, keyword: string, fromDate: Date, toDate: Date, page: number, size: number): Observable<AdjustRequestData<AdjustRequest>> {
    var data =
    {
      "BrnCode": brncode,
      "CompCode": compcode,
      "LocCode": Loccode,
      "FromDate": this._svDefault.GetFormatDate(fromDate),
      "ToDate": this._svDefault.GetFormatDate(toDate),
      "Keyword": keyword,
      "Page": page,
      "ItemsPerPage": size
    }

    return this.http.post(this.sharedService.urlInv + '/api/AdjustRequest/GetAdjustRequestHDList', data).pipe(
      map((AdjustRequestData: AdjustRequestData<AdjustRequest>) => AdjustRequestData),
      catchError(err => throwError(err))
    )
  }

  public async findAllAsync(brncode: string, compcode: string, Loccode: string, keyword: string, fromDate: Date, toDate: Date, page: number, size: number): Promise<AdjustRequestData<AdjustRequest>> {
    var data =
    {
      "BrnCode": brncode,
      "CompCode": compcode,
      "LocCode": Loccode,
      "FromDate": fromDate,
      "ToDate": toDate,
      "Keyword": keyword,
      "Page": page,
      "ItemsPerPage": size,
      "onlyReadyStatus": true
    }

    let strUrl = (this.sharedService.urlInv || "").toString().trim() + "/api/AdjustRequest/GetAdjustRequestHDList";
    return await this.http.post(strUrl, data).pipe(
      map((AdjustRequestData: AdjustRequestData<AdjustRequest>) => AdjustRequestData),
      catchError(err => throwError(err))
    ).toPromise()
  }
}
