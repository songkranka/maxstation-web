import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SharedService } from 'src/app/shared/shared.service';
import { Adjust, AdjustData } from 'src/app/model/inventory/adjust.interface';
import { AdjustRequestData } from 'src/app/model/inventory/adjustrequest.interface';
import { ModelInvAdjustRequestDt, ModelMasReason } from 'src/app/model/ModelScaffold';
import { DefaultService } from '../default.service';


@Injectable({
  providedIn: 'root'
})

export class AdjustService {
  constructor(private http: HttpClient, private sharedService: SharedService, private _svDefault: DefaultService) { }

  findAll(brncode: string, compcode: string, Loccode: string, keyword: string, fromDate: Date, toDate: Date, page: number, size: number): Observable<AdjustData<Adjust>> {
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

    return this.http.post(this.sharedService.urlInv + '/api/Adjust/GetAdjustHDList', data).pipe(
      map((AdjustData: AdjustData<Adjust>) => AdjustData),
      catchError(err => throwError(err))
    )
  }

  public async getAdjustRequestDt(compcode: string, brncode: string, Loccode: string, DocNo: string): Promise<AdjustRequestData<ModelInvAdjustRequestDt>> {
    var data =
    {
      "CompCode": compcode,
      "BrnCode": brncode,
      "LocCode": Loccode,
      "DocNo": DocNo
    }

    let strUrl = (this.sharedService.urlInv || "").toString().trim() + "/api/AdjustRequest/GetAdjustRequestDTList";
    return await this.http.post(strUrl, data).pipe(
      map((AdjustRequestData: AdjustRequestData<ModelInvAdjustRequestDt>) => AdjustRequestData),
      catchError(err => throwError(err))
    ).toPromise()
  }

  async GetReasons(): Promise<ModelMasReason[]> {
    let result: ModelMasReason[] = null;
    let strUrl: string = "";
    strUrl = (this.sharedService.urlInv || "").toString().trim() + "/api/Adjust/GetReasonAdjusts";
    result = <ModelMasReason[]>await this.http.get(strUrl).toPromise();
    return result;
  }
}
