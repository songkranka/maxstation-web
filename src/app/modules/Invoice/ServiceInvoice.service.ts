import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import * as ModelInvoice from './ModelInvoice';
import { SharedService } from './../../shared/shared.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { catchError, map } from 'rxjs/operators';
import { ModelApiResult, ModelGetProductServiceOutput, ModelInsertCreditSalesQuery } from './ModelInvoice';
@Injectable({
  providedIn: 'root'
})
export class ServiceInvoice {

  constructor(private _sharedService : SharedService , private _httpClient : HttpClient) { }

  GetProductService(
    pOnComplete : ( pArrProduct : ModelInvoice.ModelGetProductServiceOutput[] )=> void , 
    pOnError? : ((pException : Error) => void)
  ) : void{
    if(typeof(pOnComplete) !== "function"){
      return;
    }
    let strUrl : string = this._sharedService.urlSale + "/api/Invoice/GetProductService";
    let product$ = this._httpClient.get<ModelInvoice.ModelGetProductServiceOutput[]>(strUrl).subscribe( pArrProduct => {
      product$?.unsubscribe();
      pOnComplete(pArrProduct);
    }, pException=>{
      product$?.unsubscribe();
      if(pException == null){
        return;
      }
      let strHeader = (pException.message || "").toString().trim();
      let strMessage = (pException.error || "").toString().trim();
      if(typeof(pOnError)==="function"){
        pOnError(<Error>{
          message : strHeader,
          stack : strMessage
        });
      }else{
        Swal.fire(strHeader , `<pre>${strMessage}</pre>` , "error");
      }
    });
  }
  async GetProductServiceAsync() : Promise< ModelGetProductServiceOutput[]>{
    let strUrl : string = this._sharedService.urlSale + "/api/Invoice/GetProductService";
    let result : ModelGetProductServiceOutput[] = await this._httpClient.get<ModelGetProductServiceOutput[]>(strUrl).toPromise();
    return result;
  }

  GetProductServiceOld() : Observable<ModelInvoice.ModelApiResult<ModelInvoice.ModelGetProductServiceOutput[]>>{
    let strUrl : string = this._sharedService.urlSale + "/api/Invoice/GetProductService";
    return this._httpClient.get<ModelInvoice.ModelApiResult<ModelInvoice.ModelGetProductServiceOutput[]>>(this._sharedService.urlSale + "/api/Invoice/GetProductService");
  }
  GetPattern(
    pOnComplete : (pStrPattern : string , pArrMasDocPattern : ModelInvoice.ModelMasDocPattern[])=> void , 
    pOnError? : (e:Error)=> void ,
    pStrDocType? : string ,
  ){
    if(typeof(pOnComplete) !== "function"){
      return;
    }
    let strUrl : string = this._sharedService.urlMas + "/api/Other/GetPattern";
    let objBody = {"docType": pStrDocType || "Invoice" };
    let pattern$ = this._httpClient.post(strUrl , objBody).subscribe(x=>{
      pattern$?.unsubscribe();      
      if(x == null){
        return;
      }
      let objData : any = null;
      if( x.hasOwnProperty("Data")){
        objData = (<any>x).Data;
      }
      if(objData == null){
        return;
      }
      let strPattern : string = "";  
      if(objData.hasOwnProperty("Pattern")){
        strPattern = (objData.Pattern || "").toString().trim();
      }
      let arrMasDocPattern : ModelInvoice.ModelMasDocPattern[];
      if(objData.hasOwnProperty("MasDocPattern") && Array.isArray(objData.MasDocPattern)){
        arrMasDocPattern = <ModelInvoice.ModelMasDocPattern[]>objData.MasDocPattern;
      }else{
        arrMasDocPattern = [];
      }
      pOnComplete(strPattern , arrMasDocPattern);
      
    }, e=>{      
      if(e == null || e == NaN){
        return;
      }
      let ex= <Error>{
        message : (e?.name || "") ,
        stack : (e?.message || "")
      };
      
      if(typeof(pOnError) === "function"){
        pOnError(ex);
      }else{
        Swal.fire(ex.message ,`<pre>${ex.stack}</pre>` , "error");
      }
      pattern$?.unsubscribe();
    });
    // pattern$.unsubscribe();
  }
  // GetRunningPattern(){
  //   let strUrl : string = this._sharedService.urlSale + "/api/Invoice/GetProductService";
  //   let param = {
  //     compCode : this._sharedService.compCode ,
  //     brnCode : this._sharedService.brnCode,
  //     locCode : this._sharedService.locCode
  //   }
  //   let pattern$ = this._httpClient.post(strUrl , param )
  //   .pipe( map(x=> <string>x) , catchError(async (err) => console.log(err))
  //   ).subscribe( x=> {
      
  //   });
  // }
  InserCreditSales(
    pCreditSaleHeader : ModelInvoice.ModelCreditSalesHeader, 
    pArrCreditSaleDetail : ModelInvoice.ModelCreditSalesDetail[] 
  ) : Observable<ModelInvoice.ModelApiResult<boolean>>{
    let strUrl : string = this._sharedService.urlSale + "/api/Invoice/InsertCreditSales";
    let objBody = {
      CreditSaleHeader : pCreditSaleHeader ,
      ArrCreditSaleDetail : pArrCreditSaleDetail
    };
    return this._httpClient.post<ModelInvoice.ModelApiResult<boolean>>(strUrl , objBody);
  }
  async InserCreditSales2(
    pCreditSaleHeader : ModelInvoice.ModelCreditSalesHeader, 
    pArrCreditSaleDetail : ModelInvoice.ModelCreditSalesDetail[] 
  ) : Promise<ModelInvoice.ModelInsertCreditSalesQuery>{
    let result : ModelInvoice.ModelInsertCreditSalesQuery = null;
    let strUrl : string = this._sharedService.urlSale + "/api/Invoice/InsertCreditSales2";
    let objBody = <ModelInvoice.ModelInsertCreditSalesQuery>{
      creditSaleHeader : pCreditSaleHeader ,
      arrCreditSaleDetail : pArrCreditSaleDetail
    };
    let pmInsertCreditSale = this._httpClient.post<ModelInvoice.ModelApiResult<ModelInvoice.ModelInsertCreditSalesQuery>>(strUrl , objBody).toPromise();
    try {
      let apiResult = await pmInsertCreditSale;
      if(apiResult.status === ModelInvoice.EnumApiStatus.Success){
        result = apiResult.result;
      }else{
        Swal.fire(apiResult.errorMessage , apiResult.errorStackTrace , "error");
      }
    } catch (error) {
      this.showError(error);
      console.log(error);      
    }
    return result;
  }
  private showError(pError){
    Swal.fire(pError?.message || "" , pError?.error?.messages[0] || "" , "error" );
  }
  GetCreditSales(pStrDocNo : string) : Observable<ModelInvoice.ModelApiResult<{ creditSaleHeader : ModelInvoice.ModelCreditSalesHeader , arrCreditSaleDetail :  ModelInvoice.ModelCreditSalesDetail[] }>> {
    let body = {
      LocCode: this._sharedService.locCode,
      BrnCode : this._sharedService.brnCode,
      CompCode : this._sharedService.compCode,
      DocNo : pStrDocNo
    };
    return this._httpClient.post<any>(this._sharedService.urlSale + "/api/Invoice/GetCreditSales" , body);   
  }
  async GetCreditSalesByGuid(pStrGuid : string)  {
    pStrGuid = (pStrGuid || "").toString().trim();
    if(pStrGuid === ""){
      return null;
    }
    pStrGuid = encodeURI(pStrGuid);
    let strUrl = (this._sharedService.urlSale || "").toString().trim() 
      + "/api/Invoice/GetCreditSalesByGuid/" + pStrGuid;
    let apiResult = <ModelApiResult<ModelInsertCreditSalesQuery>>await this._httpClient.get(strUrl).toPromise();
    return apiResult;
    // return this._httpClient.post<any>(this._sharedService.urlSale + "/api/Invoice/GetCreditSales" , body);   
  }
  GetCreditSales2(pStrDocNo : string) : Observable<ModelInvoice.ModelApiResult<{ CreditSaleHeader : ModelInvoice.ModelCreditSalesHeader , ArrCreditSaleDetail :  ModelInvoice.ModelCreditSalesDetail[] }>> {
    let httpParam = new HttpParams();
    httpParam.append("LocCode",this._sharedService.locCode);
    httpParam.append("BrnCode",this._sharedService.brnCode);
    httpParam.append("CompCode",this._sharedService.compCode);
    httpParam.append("DocNo",pStrDocNo); 
    return this._httpClient.get<ModelInvoice.ModelApiResult<{ CreditSaleHeader : ModelInvoice.ModelCreditSalesHeader , ArrCreditSaleDetail :  ModelInvoice.ModelCreditSalesDetail[] }>>(this._sharedService.urlSale + "/api/Invoice/GetCreditSales" , { params: httpParam});   
  }
  UpdateCreditSales(
    pCreditSaleHeader : ModelInvoice.ModelCreditSalesHeader, 
    pArrCreditSaleDetail : ModelInvoice.ModelCreditSalesDetail[] 
  ) : Observable<ModelInvoice.ModelApiResult<boolean>>{
    let strUrl : string = this._sharedService.urlSale + "/api/Invoice/UpdateCreditSales";
    let objBody = {
      CreditSaleHeader : pCreditSaleHeader ,
      ArrCreditSaleDetail : pArrCreditSaleDetail
    };
    return this._httpClient.post<ModelInvoice.ModelApiResult<boolean>>(strUrl , objBody);
  }
  // /api/Invoice/GetCreditSales

}


