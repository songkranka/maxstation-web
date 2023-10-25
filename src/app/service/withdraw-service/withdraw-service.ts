import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Withdraw, WithdrawData } from 'src/app/model/inventory/withdraw.interface';
import { SharedService } from 'src/app/shared/shared.service';
import * as moment from 'moment';
// import { DefaultService } from 'src/app/service/default.service';
import {  ModelMasReason, ModelMasReasonGroup } from 'src/app/model/ModelScaffold';
import { CompanyCar } from 'src/app/model/master/companycar.interface'
import { ProductModel } from 'src/app/model/master/product.class';
import { DefaultService } from '../default.service';

export interface LicensePlateData<T> {
  Data: T[]
};

@Injectable({
  providedIn: 'root'
})

export class WithdrawService {
  constructor(private http: HttpClient, private sharedService: SharedService, private _svDefault: DefaultService) { }

  findAll(brncode: string, compcode: string, locCode: string, keyword: string, fromDate: Date, toDate: Date, page: number, size: number): Observable<WithdrawData<Withdraw>> {
    var data =
    {
      "BrnCode": brncode,
      "CompCode": compcode,
      "LocCode": locCode,
      "FromDate": fromDate && moment(fromDate).format('YYYY-MM-DD'),  //fromDate?.toJSON(),
      "ToDate": toDate && moment(toDate).format('YYYY-MM-DD'), //toDate?.toJSON(),
      "Keyword": keyword,
      "Page": page,
      "ItemsPerPage": size
    }

    // console.log(JSON.stringify(data));


    this.sharedService.urlSale;
    // return this.http.get('/api/CashSale/GetCashSaleHdList', {params}).pipe(
    return this.http.post(this.sharedService.urlInv + '/api/Withdraw/GetWithdrawList', data).pipe(
      map((withdrawData: WithdrawData<Withdraw>) => withdrawData),
      catchError(err => throwError(err))
    )
  }

  async GetReasons(): Promise<ModelMasReason[]> {
    let result: ModelMasReason[] = null;
    let strUrl: string = "";
    strUrl = (this.sharedService.urlInv || "").toString().trim() + "/api/Withdraw/GetReasons";
    result = <ModelMasReason[]>await this.http.get(strUrl).toPromise();
    return result;
  }

  async GetReasonGroups(pStrReasonId: string): Promise<ModelMasReasonGroup[]> {
    pStrReasonId = (pStrReasonId || "").toString().trim();
    if (pStrReasonId === "") {
      return;
    }
    let strUrl: string = "";
    strUrl = (this.sharedService.urlInv || "").toString().trim()
      + "/api/Withdraw/GetReasonGroups/"
      + encodeURI(pStrReasonId);
    let result: ModelMasReasonGroup[] = null;
    result = <ModelMasReasonGroup[]>await this.http.get(strUrl).toPromise();
    return result;
  }

  async GetProduct(pStrKeyWord: string): Promise<ProductModel[]> {
    pStrKeyWord = (pStrKeyWord || "").toString().trim();
    let data = { 
      "Keyword": pStrKeyWord, 
      "SystemDate": moment(this.sharedService.systemDate).format('YYYY-MM-DD')
    };
    //this.urlMas + "/api/Product/GetProductList"
    let strUrl = (this.sharedService.urlMas || "").toString().trim() + "/api/Product/GetProductList";
    let apiResult = <any>await this.http.post(strUrl, data).toPromise();
    if (apiResult == null || !apiResult.hasOwnProperty("Data")) {
      return null;
    }
    return <ProductModel[]>apiResult?.Data;
  }

  async GetProductWithReason(compCode: string, locCode: string, brnCode: string, reasonId: string, reasonGroup: string, pStrKeyWord: string): Promise<ProductModel[]> {
    pStrKeyWord = (pStrKeyWord || "").toString().trim();
    let data = {
      "CompCode": compCode,
      "LocCode": locCode,
      "BrnCode": brnCode,
      "ReasonId": reasonId,
      "ReasonGroup": reasonGroup,
      "Keyword": pStrKeyWord,
      "SystemDate":  moment(this.sharedService.systemDate).format('YYYY-MM-DD') // this.SvDefault.GetFormatDate(<Date>)
    };
    //this.urlMas + "/api/Product/GetProductList"
    let strUrl = (this.sharedService.urlMas || "").toString().trim() + "/api/Product/GetProductReasonList";
    let apiResult = <any>await this.http.post(strUrl, data).toPromise();
    if (apiResult == null || !apiResult.hasOwnProperty("Data")) {
      return null;
    }
    return <ProductModel[]>apiResult?.Data;
  }

  public async GetLicensePlateList(compCode: string, keyword: string, pageIndex: number, pageSize: number ): Promise<LicensePlateData<CompanyCar>> {
    let data = {
      "CompCode": compCode,
      "Keyword" : keyword,
      "Page": pageIndex,
      "ItemsPerPage": pageSize
    }

    let strUrl = (this.sharedService.urlMas || "").toString().trim() + "/api/CompanyCar/List";
    return await this.http.post(strUrl, data).pipe(
      map((licensePlateData: LicensePlateData<CompanyCar>) => licensePlateData),
      catchError(err => throwError(err))
    ).toPromise()
  }

  public PrintDocument(pStrCompCode: string, pStrBrnCode: string, pStrDocNo: string) {
    let request = {
      "CompCode": pStrCompCode,
      "BrnCode": pStrBrnCode,
      "DocNo": pStrDocNo,
    }    
    let headers = new HttpHeaders()
    let strUrl = (this.sharedService.urlViewer || "").toString().trim() + "/Withdraw/PrintPdf";
    this.http.post(strUrl, request, {
      responseType: 'arraybuffer', headers: headers
    }
    ).subscribe(response => this._svDefault.DownLoadFile('รายงานเบิกใข้.pdf', response, "application/octet-stream"));
  }
}

