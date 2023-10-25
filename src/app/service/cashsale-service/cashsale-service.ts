import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Cashsale } from 'src/app/model/cashsale.interface';

import { SharedService } from 'src/app/shared/shared.service';
import { ModelSalQuotationHd2 } from 'src/app/model/ModelCommon';
import { DetailModel, HeaderModel, ModelCashSaleQuotationDetail, ModelCashSaleResource2 } from 'src/app/modules/Sale/cashsale/ModelCashSale';
import { ModelMasProductUnit, ModelSalQuotationHd } from 'src/app/model/ModelScaffold';

export interface CashsaleData<T> {
    items: T[],
    Data: T[],
    totalItems: number;
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

  @Injectable({
    providedIn: 'root'
  })

  export class CashsaleService {
    constructor(private http: HttpClient, private sharedService: SharedService,) { }
    findAll(brncode: string, compcode: string, keyword: string, fromDate: Date, toDate: Date, page: number, size: number, sysDate: string): Observable<CashsaleData<Cashsale>> {
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
        "FromDate": strFromDate,
        "ToDate": strToDate,
        "Keyword" : keyword,
        "Page": page,
        "ItemsPerPage": size,
        "SysDate": sysDate
      }
      
          //this.sharedService.urlSale;
      // return this.http.get('/api/CashSale/GetCashSaleHdList', {params}).pipe(
      return this.http.post(this.sharedService.urlSale +'/api/CashSale/GetCashSaleHdList', data).pipe(
        map((cashsaleData: CashsaleData<Cashsale>) => cashsaleData),
        catchError(err => throwError(err))
      )
    }

    async GetQuotationDetail(pQuotationHeader : ModelSalQuotationHd): Promise<ModelCashSaleQuotationDetail[]>{
      let strUrl =  (this.sharedService.urlSale || "").toString().trim() + "/api/CashSale/GetQuotationDetail";
      let result = <ModelCashSaleQuotationDetail[]>await this.http.post(strUrl , pQuotationHeader).toPromise();
      return result;
    }

    async GetQuotationListByCashSale(pCashSale : HeaderModel) : Promise<ModelSalQuotationHd[]>{
      let strUrl =  (this.sharedService.urlSale || "").toString().trim() + "/api/CashSale/GetQuotationListByCashSale";
      let result = <ModelSalQuotationHd[]>await this.http.post(strUrl , pCashSale).toPromise();
      return result;
    }

    async GetCashSale2(pStrGuid : string): Promise<ModelCashSaleResource2>{
      pStrGuid = (pStrGuid || "").toString().trim();
      if(pStrGuid === ""){
        return null;
      }
      let strUrl =  (this.sharedService.urlSale || "").toString().trim() 
        + "/api/CashSale/GetCashSale2?pStrGuid=" 
        + encodeURI(pStrGuid);
      let result = <ModelCashSaleResource2>await this.http.get(strUrl).toPromise();
      return result;
    }
    async SaveCashSale2(pInput : ModelCashSaleResource2): Promise<ModelCashSaleResource2>{
      if(pInput ==null){
        return null;
      }
      let strUrl =  (this.sharedService.urlSale || "").toString().trim() + "/api/CashSale/SaveCashSale2";
      let result = <ModelCashSaleResource2>await this.http.post(strUrl , pInput).toPromise();
      return result;
    }
    async SetStockQty(pArrDetail : DetailModel[]): Promise<void>{
      if(!(Array.isArray(pArrDetail) && pArrDetail.length)){
        return;
      }
      let arrUnitBarCode : string[] = [];
      for (let i = 0; i < pArrDetail.length; i++) {
        const dt = pArrDetail[i];
        if(dt == null){
          continue;
        }
        dt.UnitBarcode = (dt.UnitBarcode || "").toString().trim();
        if(dt.UnitBarcode === ""){
          continue;
        }
        dt.ItemQty = (dt.ItemQty || 0);
        dt.StockQty = dt.ItemQty;
        arrUnitBarCode.push(dt.UnitBarcode);
      }
      if(arrUnitBarCode.length === 0){
        return;
      }
      let strPDBarcodeList : string =  arrUnitBarCode.join(",");
      let strUrl =  (this.sharedService.urlMas || "").toString().trim() + "/api/ProductUnit/GetProductUnitList";
      var data ={PDBarcodeList: strPDBarcodeList };
      let apiResult = <any> await this.http.post(strUrl , data).toPromise();
      if(apiResult == null || !apiResult.hasOwnProperty("Data") || !Array.isArray(apiResult.Data) || !apiResult.Data.length){
        return;
      }
      let arrProductUnit = <ModelMasProductUnit[]>apiResult.Data;
      for (let j = 0; j < arrProductUnit.length; j++) {
        const pu = arrProductUnit[j];
        let strUnitBarCode = (pu.UnitBarcode || "").toString().trim();
        for (let i = 0; i < pArrDetail.length; i++) {
          const dt = pArrDetail[i];
          if(dt.UnitBarcode !== strUnitBarCode){
            continue;
          }
          let numUnitStock = pu.UnitStock || 0;
          let numUnitRatio = pu.UnitRatio || 0;
          if(numUnitRatio === 0){
            numUnitRatio = 1;
          }
          dt.StockQty = dt.ItemQty * numUnitStock / numUnitRatio;
        }
      }
    }
    /*
    findAll(brncode: string, compcode: string, keyword: string, fromDate: Date, toDate: Date, page: number, size: number): Observable<CashsaleData<Cashsale>> {
        var data =
        {
          "BrnCode": brncode,
          "CompCode": compcode,
          "FromDate": fromDate,
          "ToDate": toDate,
          "Keyword" : keyword,
          "Page": page,
          "ItemsPerPage": size
        }
            this.sharedService.urlSale;
        // return this.http.get('/api/CashSale/GetCashSaleHdList', {params}).pipe(
        return this.http.post(this.sharedService.urlSale +'/api/CashSale/GetCashSaleHdList', data).pipe(
          map((cashsaleData: CashsaleData<Cashsale>) => cashsaleData),
          catchError(err => throwError(err))
        )
      }
      */
  }
