import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SharedService } from 'src/app/shared/shared.service';
import { ModelInvRequestHd } from 'src/app/model/ModelScaffold';
import { CsModelInvTranoutHd, ModelGetToDoTaskResult, QueryObjectResource, QueryResultResource, ResponseWarpadTaskList } from 'src/app/model/ModelDashboard';
import { HeaderProductDisplay, ProductDisplay } from 'src/app/model/master/meter.interface';
import { DefaultService } from '../default.service';


@Injectable({
  providedIn: 'root'
})

export class DashboardService {
  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
    private _svDefault : DefaultService
  ) { }

  public async getWarpadTaskList(user: string): Promise<ResponseWarpadTaskList> {

    var data =
    {
      "User": user
    }

    let strUrl = (this.sharedService.urlCommon || "").toString().trim() + "/api/Warpad/GetWarpadTaskList";
    return await this.http.post(strUrl, data).pipe(
      map((data: ResponseWarpadTaskList) => data),
      catchError(err => throwError(err))
    ).toPromise()
  }

  public async getProductDisplay(compCode: string, brnCode: string, locCode: string, docDate: string): Promise<QueryObjectResource<HeaderProductDisplay<ProductDisplay>>> {

    var data =
    {
      "CompCode": compCode,
      "BrnCode": brnCode,
      "LocCode": locCode,
      "DocDate": docDate,
    }

    // const jwtToken = localStorage.getItem('jwt');
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     "Content-Type": "application/json",
    //     "Authorization": `Bearer ${jwtToken}`
    //   })
    // }
    let strUrl = (this.sharedService.urlCommon || "").toString().trim() + "/api/Dashboard/GetProductDisplay";
    return await this.http.post(strUrl, data)
      .pipe(map((dataRequestList: QueryObjectResource<HeaderProductDisplay<ProductDisplay>>) => dataRequestList),
        catchError(err => throwError(err))
      ).toPromise()
  }

  public async getReqeustList(compCode: string, brnCode: string, locCode: string, docDate: string, page: number, itemsPerPage: number): Promise<QueryResultResource<ModelInvRequestHd>> {

    var data =
    {
      "CompCode": compCode,
      "BrnCode": brnCode,
      "LocCode": locCode,
      "DocDate": docDate,
      "Page": page,
      "ItemsPerPage": itemsPerPage
    }

    let strUrl = (this.sharedService.urlCommon || "").toString().trim() + "/api/Dashboard/GetRequestList";
    return await this.http.post(strUrl, data).pipe(
      map((dataRequestList: QueryResultResource<ModelInvRequestHd>) => dataRequestList),
      catchError(err => throwError(err))
    ).toPromise()
  }

  public async getTransferOutList(compCode: string, brnCode: string, locCode: string, docDate: string, page: number, itemsPerPage: number): Promise<QueryResultResource<CsModelInvTranoutHd>> {

    var data =
    {
      "CompCode": compCode,
      "BrnCode": brnCode,
      "LocCode": locCode,
      "DocDate": docDate,
      "Page": page,
      "ItemsPerPage": itemsPerPage
    }

    let strUrl = (this.sharedService.urlCommon || "").toString().trim() + "/api/Dashboard/GetTransferOutList";
    return await this.http.post(strUrl, data).pipe(
      map((dataRequestList: QueryResultResource<CsModelInvTranoutHd>) => dataRequestList),
      catchError(err => throwError(err))
    ).toPromise()
  }

  public async GetToDoTask(pStrEmpCode : string){
    pStrEmpCode = this._svDefault.GetString(pStrEmpCode);
    if(pStrEmpCode === ""){
      return null;
    }
    let strUrl = this._svDefault.GetString(this.sharedService.urlCommon) + "/api/Warpad/GetToDoTask/" + pStrEmpCode;
    let result = await this.http.get<ModelGetToDoTaskResult>(strUrl).toPromise();
    return result;
  }
}
