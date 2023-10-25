import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SharedService } from 'src/app/shared/shared.service';
import { GetDocument, GetDocumentResponse, MeterResponse, MeterResponse2, ResponseData } from 'src/app/model/master/meter.interface';
import { ModelMasBranchCalibrate, ModelMasReason } from 'src/app/model/ModelScaffold';


@Injectable({
  providedIn: 'root'
})

export class MeterService {
  constructor(private http: HttpClient, private sharedService: SharedService,) { }

  public async getDocument(request: GetDocument): Promise<ResponseData<GetDocumentResponse>> {

    let strUrl = (this.sharedService.urlDailyAks || "").toString().trim() + "/api/Meter/GetDocument";
    return await this.http.post(strUrl, request).pipe(
      map((documentData: ResponseData<GetDocumentResponse>) => documentData),
      catchError(err => throwError(err))
    ).toPromise()
  }

  public async getPosMeter(compCode: string, brnCode: string, docDate: string, periodNo: Number, periodStart: string): Promise<Array<MeterResponse>> {
    let data = {
      "CompCode": compCode,
      "BrnCode": brnCode,
      "DocDate": docDate,
      "PeriodNo": periodNo,
      "PeriodStart": periodStart
    }

    let strUrl = (this.sharedService.urlDailyOperationApim || "").toString().trim() + "/api/Meter/GetPosMeter";
    return await this.http.post(strUrl, data).pipe(
      map((meterRespose: Array<MeterResponse>) => meterRespose),
      catchError(err => throwError(err))
    ).toPromise()
  }

  public async GetPosMeterAPIM(compCode: string, brnCode: string, docDate: string, periodNo: Number, periodStart: string) {
    let data = {
      "CompCode": compCode,
      "BrnCode": brnCode,
      "DocDate": docDate,
      "PeriodNo": periodNo,
      "PeriodStart": periodStart
    }
/*
http.post('someurl',{
   headers: {'Access-Control-Request-Method':'POST','Access-Control-Request-Header':'*'},data}
*/

    let strUrl =  (this.sharedService.urlDailyOperationApim || "").toString().trim() + "/api/Meter/GetPosMeter";
    let result = this.http.post<MeterResponse[]>(strUrl, data
      // ,{
      // headers: {'Access-Control-Request-Method':'POST','Access-Control-Request-Header':'*' }   }
   ).toPromise();
    return result;
  }

  public async getMasBranchCalibrate(compCode: string, brnCode: string): Promise<Array<ModelMasBranchCalibrate>> {
    let data = {
      "CompCode": compCode,
      "BrnCode": brnCode
    }

    let strUrl = (this.sharedService.urlDailyAks || "").toString().trim() + "/api/Meter/GetMasBranchCalibrate";
    return await this.http.post(strUrl, data).pipe(
      map((meterRespose: Array<ModelMasBranchCalibrate>) => meterRespose),
      catchError(err => throwError(err))
    ).toPromise()
  }

  public async GetHoldReason(){
    let strUrl = (this.sharedService.urlDailyAks || "").toString().trim() + "/api/Meter/GetHoldReason";
    let result = await this.http.get<ModelMasReason[]>(strUrl).toPromise();
    return result;
  }

  public async ValidatePOS(pStrBrnCode : string , pIntPeriodNo : number , pDatDocDate : Date){
    let strUrl = (this.sharedService.urlDailyOperation || "").toString().trim()
      + `/api/Meter/ValidatePOS/${pStrBrnCode}/${pIntPeriodNo}/${pDatDocDate}`;
    let result = await this.http.get<MeterResponse2>(strUrl).toPromise();
    return result;
  }
}
