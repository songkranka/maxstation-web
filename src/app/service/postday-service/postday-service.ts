import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SharedService } from 'src/app/shared/shared.service';
import { AddStockMonthlyParam, AddStockParam, AllData, GetDocumentRequest, GetDopValidDataParam, ResponseData } from 'src/app/model/sale/postday.interface';
import { DefaultService } from '../default.service';

export interface PostdayData<T> {
  Data: T[],
  StatusCode: string,
  Message: string,
};

@Injectable({
  providedIn: 'root'
})

export class PostDayService {
  constructor(
    private http: HttpClient,
    private sharedService: SharedService,
    private svDefault : DefaultService,
  ) { }

  public async getDocument(request: GetDocumentRequest): Promise<ResponseData<AllData>> {
    let strUrl = (this.sharedService.urlPostDay || "").toString().trim() + "/api/PostDay/GetDocument";
    return await this.http.post(strUrl, request).pipe(
      map((documentData: ResponseData<AllData>) => documentData),
      // catchError(err => throwError(err))
      catchError((error: HttpErrorResponse) => {
            let errorMessage = '';
            errorMessage = 'Error:' + error.error;
            return throwError(errorMessage);
      })
    ).toPromise()
  }

  public async TestSelectDate(){
    let strUrl = (this.sharedService.urlPostDay || "").toString().trim() + "/api/PostDay/TestSelectDate";
    let apiResult = await this.http.get<any>(strUrl).toPromise();
    let result = new Date(apiResult);
    return result;
  }
  public async TestSelectDate2(){
    let strUrl = (this.sharedService.urlPostDay || "").toString().trim() + "/api/PostDay/TestSelectDate2";
    let apiResult = await this.http.get<any>(strUrl).toPromise();
    let result = new Date(apiResult);
    return result;
  }

  public async AddStock(param : AddStockParam){
    if(param == null){
      return null;
    }
    let strUrl = (this.sharedService.urlPostDay || "").toString().trim() + "/api/PostDay/AddStock";
    let result = await this.http.post<number>(strUrl , param).toPromise();
    return result;
  }
  public async AddStockMonthly(param : AddStockMonthlyParam){
    if(param == null){
      return null;
    }
    let strUrl = (this.sharedService.urlPostDay || "").toString().trim() + "/api/PostDay/AddStockMonthly";
    let result = await this.http.post<number>(strUrl , param).toPromise();
    return result;
  }

  public async GetDopValidData(param : GetDopValidDataParam){
    if(param == null){
      return null;
    }
    let strUrl = this.svDefault.GetString(this.sharedService.urlPostDay) + "/api/PostDay/GetDopValidData";
    let result = await this.http.post(strUrl , param).toPromise();
    return result;
  }

  public async SaveCloseday(req: AllData) {
    return await this.http.post(this.sharedService.urlPostDay + "/api/PostDay/SaveDocument", req).pipe(
      map((masControlData: PostdayData<AllData>) => masControlData),
      catchError(err => throwError(err))
    ).toPromise()
  }
}
