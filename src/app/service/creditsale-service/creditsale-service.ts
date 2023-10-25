import { Injectable } from '@angular/core';
import { HttpClient, HttpParams  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Creditsale } from 'src/app/model/creditsale.interface';
import { SharedService } from 'src/app/shared/shared.service';
import { ModelApiResult } from 'src/app/modules/Invoice/ModelInvoice';
import { EnumApiStatus } from 'src/app/modules/Invoice/Invoice/Invoice.component';
import { ModelSalCreditSal } from 'src/app/model/ModelCommon';
import { _closeDialogVia } from '@angular/material/dialog';
import { DefaultService } from '../default.service';
import { ModelMasCompanyCar } from 'src/app/model/ModelScaffold';
export interface CreditsaleData<T> {
    items: T[],
    Data: T[],
    TotalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;

    links: {
      first: string;
      previous: string;
      next: string;
      last: string;
    }
  };
  export class ModelCustomerCar{
    custCode : string = "";
    licensePlate : string = "";
    carStatus : string = "Active";
    createdDate : Date = null;
    createdBy : string = "";
    updatedDate : Date = null;
    updatedBy : string = "";
  }
  @Injectable({
    providedIn: 'root'
  })

  export class CreditsaleService {
    constructor(
      private http: HttpClient,
      private sharedService: SharedService,
      private _svDefault : DefaultService
    ) { }

    findAll(brncode: string, compcode: string, Loccode: string, keyword: string, fromDate: Date, toDate: Date, page: number, size: number, sysDate: string): Observable<CreditsaleData<Creditsale>> {
      let strFromDate : string = null;
      if(fromDate !== null){
        strFromDate = fromDate?.toLocaleDateString("pt-br").split( '/' ).reverse( ).join( '-' ) || "";
      }
      let strToDate : string = null;
      if(toDate !== null){
        strToDate =  toDate?.toLocaleDateString("pt-br").split( '/' ).reverse( ).join( '-' ) || "";
      }
      var data =
      {
        "BrnCode": brncode,
        "CompCode": compcode,
        "LocCode": Loccode,
        "ToDate": strToDate,
        "Keyword" : keyword,
        "Skip": page || 1,
        // "Skip": 0,
        "Take": size,
        // "Take": 0,
        "FromDate": strFromDate,
        "SysDate": sysDate

      }
      //this.sharedService.urlSale;

      let funMapX = (x: CreditsaleData<Creditsale>)=>{
        if(x.Data.length < x.TotalItems){

        }
        // x.TotalItems += 10;
        return x;
      };
      return this.http.post(this.sharedService.urlSale +'/api/CreditSale/GetCreditSaleList', data).pipe(
        map((creditSaleData: CreditsaleData<Creditsale>) => funMapX(creditSaleData)),
        catchError(err => throwError(err))
      )
    }
/*
      findAll(brncode: string, compcode: string, Loccode: string, keyword: string, fromDate: Date, toDate: Date, page: number, size: number): Observable<CreditsaleData<Creditsale>> {
        var data =
        {
          "BrnCode": brncode,
          "CompCode": compcode,
          "LocCode": Loccode,
          "ToDate": toDate,
          "Keyword" : keyword,
          // "Skip": page || 1,
          "Skip": 0,
          // "Take": size,
          "Take": 0,
          "FromDate": fromDate
        }
        this.sharedService.urlSale;

        let funMapX = (x: CreditsaleData<Creditsale>)=>{
          if(x.Data.length < x.TotalItems){

          }
          // x.TotalItems += 10;
          return x;
        };
        return this.http.post(this.sharedService.urlSale +'/api/CreditSale/GetCreditSaleList', data).pipe(
          map((creditSaleData: CreditsaleData<Creditsale>) => funMapX(creditSaleData)),
          catchError(err => throwError(err))
        )
      }
*/

      public async GetCompCar(pStrCustCode : string){
        pStrCustCode = this._svDefault.GetString(pStrCustCode);
        if(pStrCustCode === ""){
          return null;
        }
        let strUrl = this._svDefault.GetString(this.sharedService.urlSale)
          +"/api/CreditSale/GetCompCar/" + encodeURI( pStrCustCode);
        let result = await this.http.get<ModelMasCompanyCar[]>(strUrl).toPromise();
        return result || [];
      }

      async GetCustomerCar(pStrCusCode : string): Promise<ModelCustomerCar[]>{
        pStrCusCode = (pStrCusCode || "").toString().trim();
        if(pStrCusCode === ""){
          return null;
        }
        let strUrl = (this.sharedService.urlSale || "").toString().trim()
          +"/api/CreditSale/GetCustomerCar?pStrCusCode=" + encodeURI( pStrCusCode);
        let apiResult : ModelApiResult<ModelCustomerCar[]> = null;
        apiResult = <ModelApiResult<ModelCustomerCar[]>>await this.http.get(strUrl).toPromise();
        if(apiResult == null){
          return null;
        }
        if(apiResult.status !== EnumApiStatus.Success ){
          throw <Error>{
            message : apiResult.errorMessage ,
            stack : apiResult.errorStackTrace
          };
        }
        return apiResult.result;
      }

      async GetCreditSale(pStrGuid : string){
        pStrGuid = (pStrGuid || "").toString().trim();
        if(pStrGuid === ""){
          return null;
        }
        let req = {"Guid": pStrGuid};
        let strUrl = (this.sharedService.urlSale || "").toString().trim() + "/api/CreditSale/GetCreditSale";
        let apiResult = <any>await this.http.post(strUrl , req).toPromise();
        if(apiResult == null || !apiResult.hasOwnProperty("Data") || apiResult.Data == null){
          return null;
        }
        let result =  <ModelSalCreditSal>apiResult.Data;
        return result;
      }
    }
