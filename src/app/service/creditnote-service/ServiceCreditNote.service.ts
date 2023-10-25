import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'
import * as ModelCreditNote from './../../modules/Sale/CreditNote/ModelCreditNote';
import { SharedService } from './../../shared/shared.service';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { catchError, map } from 'rxjs/operators';
import { CreditNoteQueryResource2, ModelGetProductServiceOutput, ModelSearchTaxInvoiceParam, ModelSearchTaxInvoiceResult } from './../../modules/Sale/CreditNote/ModelCreditNote';
import { DefaultService } from '../default.service';
import { ModelMasReason, ModelSalTaxinvoiceDt, ModelSalTaxinvoiceHd } from 'src/app/model/ModelScaffold';
@Injectable({
  providedIn: 'root'
})
export class ServiceCreditNote {

  constructor(private _svShare : SharedService , private _httpClient : HttpClient , private _svDefault : DefaultService) { }

  async GetCreditNote(pStrGuid : string): Promise<CreditNoteQueryResource2>{
    pStrGuid = (pStrGuid || "").toString().trim();
    if(pStrGuid === ""){
      return null;
    }
    pStrGuid = encodeURI(pStrGuid);
    let strUrl =  (this._svShare.urlSale || "").toString().trim() + "/api/CreditNote/GetCreditNote/" + pStrGuid;
    let result = <CreditNoteQueryResource2>await this._httpClient.get(strUrl).toPromise();
    return result;
  }
  async SaveCreditNote(pInput : CreditNoteQueryResource2): Promise<CreditNoteQueryResource2>{
    if(pInput == null){
      return null;
    }
    let strUrl =  (this._svShare.urlSale || "").toString().trim() + "/api/CreditNote/SaveCreditNote";
    let result = <CreditNoteQueryResource2>await this._httpClient.post(strUrl , pInput).toPromise();
    return result;
  }
  async GetTaxInvoiceList(pInput : CreditNoteQueryResource2): Promise<ModelSalTaxinvoiceHd[]>{
    if(pInput == null){
      return null;
    }
    let strUrl =  (this._svShare.urlSale || "").toString().trim() + "/api/CreditNote/GetTaxInvoiceList";
    let result = <ModelSalTaxinvoiceHd[]>await this._httpClient.post(strUrl , pInput).toPromise();
    return result;
  }
  async GetTaxInvoiceDetailList(pInput : ModelSalTaxinvoiceHd): Promise<ModelSalTaxinvoiceDt[]>{
    if(pInput == null){
      return null;
    }
    let strUrl =  (this._svShare.urlSale || "").toString().trim() + "/api/CreditNote/GetTaxInvoiceDetailList";
    let result = <ModelSalTaxinvoiceDt[]>await this._httpClient.post(strUrl , pInput).toPromise();
    return result;
  }
  GetProductService(
    pOnComplete : ( pArrProduct : ModelCreditNote.ModelGetProductServiceOutput[] )=> void ,
    pOnError? : ((pException : Error) => void)
  ) : void{
    if(typeof(pOnComplete) !== "function"){
      return;
    }
    let strUrl : string = this._svShare.urlSale + "/api/Invoice/GetProductService";
    let product$ = this._httpClient.get<ModelCreditNote.ModelGetProductServiceOutput[]>(strUrl).subscribe( pArrProduct => {
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
    let strUrl : string = this._svShare.urlSale + "/api/Invoice/GetProductService";
    let result : ModelGetProductServiceOutput[] = await this._httpClient.get<ModelGetProductServiceOutput[]>(strUrl).toPromise();
    return result;
  }

  GetProductServiceOld() : Observable<ModelCreditNote.ModelApiResult<ModelCreditNote.ModelGetProductServiceOutput[]>>{
    let strUrl : string = this._svShare.urlSale + "/api/Invoice/GetProductService";
    return this._httpClient.get<ModelCreditNote.ModelApiResult<ModelCreditNote.ModelGetProductServiceOutput[]>>(this._svShare.urlSale + "/api/Invoice/GetProductService");
  }
  GetPattern(
    pOnComplete : (pStrPattern : string , pArrMasDocPattern : ModelCreditNote.ModelMasDocPattern[])=> void ,
    pOnError? : (e:Error)=> void ,
    pStrDocType? : string ,
  ){
    if(typeof(pOnComplete) !== "function"){
      return;
    }
    let strUrl : string = this._svShare.urlMas + "/api/Other/GetPattern";
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
      let arrMasDocPattern : ModelCreditNote.ModelMasDocPattern[];
      if(objData.hasOwnProperty("MasDocPattern") && Array.isArray(objData.MasDocPattern)){
        arrMasDocPattern = <ModelCreditNote.ModelMasDocPattern[]>objData.MasDocPattern;
      }else{
        arrMasDocPattern = [];
      }
      pOnComplete(strPattern , arrMasDocPattern);

    }, e=>{
      if(e == null ){
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
    pCreditSaleHeader : ModelCreditNote.ModelCreditNoteHeader,
    pArrCreditSaleDetail : ModelCreditNote.ModelCreditSalesDetail[]
  ) : Observable<ModelCreditNote.ModelApiResult<boolean>>{
    let strUrl : string = this._svShare.urlSale + "/api/Invoice/InsertCreditSales";
    let objBody = {
      CreditSaleHeader : pCreditSaleHeader ,
      ArrCreditSaleDetail : pArrCreditSaleDetail
    };
    return this._httpClient.post<ModelCreditNote.ModelApiResult<boolean>>(strUrl , objBody);
  }
  async InserCreditSales2(
    pCreditSaleHeader : ModelCreditNote.ModelCreditNoteHeader,
    pArrCreditSaleDetail : ModelCreditNote.ModelCreditSalesDetail[]
  ) : Promise<ModelCreditNote.ModelInsertCreditSalesQuery>{
    let result : ModelCreditNote.ModelInsertCreditSalesQuery = null;
    let strUrl : string = this._svShare.urlSale + "/api/Invoice/InsertCreditSales2";
    let objBody = <ModelCreditNote.ModelInsertCreditSalesQuery>{
      creditSaleHeader : pCreditSaleHeader ,
      arrCreditSaleDetail : pArrCreditSaleDetail
    };
    let pmInsertCreditSale = this._httpClient.post<ModelCreditNote.ModelApiResult<ModelCreditNote.ModelInsertCreditSalesQuery>>(strUrl , objBody).toPromise();
    try {
      let apiResult = await pmInsertCreditSale;
      if(apiResult.status === ModelCreditNote.EnumApiStatus.Success){
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
  GetCreditSales(pStrDocNo : string) : Observable<ModelCreditNote.ModelApiResult<{ creditSaleHeader : ModelCreditNote.ModelCreditNoteHeader , arrCreditSaleDetail :  ModelCreditNote.ModelCreditSalesDetail[] }>> {
    let body = {
      LocCode: this._svShare.locCode,
      BrnCode : this._svShare.brnCode,
      CompCode : this._svShare.compCode,
      DocNo : pStrDocNo
    };
    return this._httpClient.post<any>(this._svShare.urlSale + "/api/Invoice/GetCreditSales" , body);
  }
  GetCreditSales2(pStrDocNo : string) : Observable<ModelCreditNote.ModelApiResult<{ CreditSaleHeader : ModelCreditNote.ModelCreditNoteHeader , ArrCreditSaleDetail :  ModelCreditNote.ModelCreditSalesDetail[] }>> {
    let httpParam = new HttpParams();
    httpParam.append("LocCode",this._svShare.locCode);
    httpParam.append("BrnCode",this._svShare.brnCode);
    httpParam.append("CompCode",this._svShare.compCode);
    httpParam.append("DocNo",pStrDocNo);
    return this._httpClient.get<ModelCreditNote.ModelApiResult<{ CreditSaleHeader : ModelCreditNote.ModelCreditNoteHeader , ArrCreditSaleDetail :  ModelCreditNote.ModelCreditSalesDetail[] }>>(this._svShare.urlSale + "/api/Invoice/GetCreditSales" , { params: httpParam});
  }
  UpdateCreditSales(
    pCreditSaleHeader : ModelCreditNote.ModelCreditNoteHeader,
    pArrCreditSaleDetail : ModelCreditNote.ModelCreditSalesDetail[]
  ) : Observable<ModelCreditNote.ModelApiResult<boolean>>{
    let strUrl : string = this._svShare.urlSale + "/api/Invoice/UpdateCreditSales";
    let objBody = {
      CreditSaleHeader : pCreditSaleHeader ,
      ArrCreditSaleDetail : pArrCreditSaleDetail
    };
    return this._httpClient.post<ModelCreditNote.ModelApiResult<boolean>>(strUrl , objBody);
  }
  // /api/Invoice/GetCreditSales
  public async GetArrayReason(): Promise<ModelMasReason[]> {
    let strUrl =  (this._svShare.urlSale || "").toString().trim() + "/api/CreditNote/GetArrayReason";
    let result : ModelMasReason[] = null;
    result = await this._httpClient.get<ModelMasReason[]>(strUrl).toPromise();
    return result;
  }

  public async SearchTaxInvoice(param : ModelSearchTaxInvoiceParam ){
    if(param == null){
      return null;
    }
    let strUrl = this._svDefault.GetString(this._svShare.urlSale)
      + "/api/CreditNote/SearchTaxInvoice";
    let result = await this._httpClient.post<ModelSearchTaxInvoiceResult>(strUrl , param).toPromise();
    return result;
  }
}


