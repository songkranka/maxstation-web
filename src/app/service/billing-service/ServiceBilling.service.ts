import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { from, Observable, Subscription, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { error } from 'selenium-webdriver';
import * as ModelBilling from 'src/app/model/ModelBilling';
import { ModelBilling2, ModelBillingResult, ModelGetBillingModalItemOutput, ModelSaleBillingDetail, ModelSaleBillingHeader, ModelSearchBillingInput } from 'src/app/model/ModelBilling';
import * as ModelCommon from 'src/app/model/ModelCommon';
import { ModelHeaderDetail } from 'src/app/model/ModelCommon';
import { ModelSalTaxinvoiceHd } from 'src/app/model/ModelScaffold';
import * as ModelInvoice from 'src/app/modules/Invoice/ModelInvoice';
import { SharedService } from 'src/app/shared/shared.service';
import Swal from 'sweetalert2';
import { DefaultService } from '../default.service';
@Injectable({
  providedIn: 'root'
})
export class ServiceBilling {

  constructor(
    private _http: HttpClient,
    private _svShared: SharedService,
    private _modalService :NgbModal ,
    private _svDefault : DefaultService
  ) { }
  // private showError(pException : Error) : void {
  //   if(pException == null){
  //     return;
  //   }
  //   let strErrorMessage = (pException?.message || "").toString().trim();
  //   let strStack =  (pException?.stack || "").toString().trim();
  //   Swal.fire(pException.message , `<pre>${strStack}</pre>` , "error");
  // }
  public async GetBilling(pStrGuid : string){
    pStrGuid = this._svDefault.GetString(pStrGuid);
    if(pStrGuid === ""){
      return null;
    }
    let strUrl = (this._svShared.urlSale || "").toString().trim() + "/api/Billing/GetBilling/"+ pStrGuid;
    let result = await this._http.get<ModelBilling2>(strUrl).toPromise();
    return result;
  }


  // async GetBillingAsync( pStrDocNo : string ) : Promise<ModelHeaderDetail<ModelSaleBillingHeader , ModelSaleBillingDetail>>{
  //   pStrDocNo = (pStrDocNo || "").toString().trim();
  //   if(pStrDocNo === "" ){
  //     return;
  //   }
  //   let input ={
  //     brnCode : this._svShared.brnCode || "" ,
  //     compCode : this._svShared.compCode || "" ,
  //     locCode : this._svShared.locCode || ""  ,
  //     docNo : pStrDocNo
  //   }
  //   let strUrl = (this._svShared.urlSale || "").toString().trim() + "/api/Billing/GetBilling";
  //   let result = <ModelHeaderDetail<ModelSaleBillingHeader , ModelSaleBillingDetail>>await this._http.post( strUrl, input).toPromise();
  //   return result;
  // }
  // InsertBilling(
  //   pInput : ModelCommon.ModelHeaderDetail<ModelBilling.ModelSaleBillingHeader , ModelBilling.ModelSaleBillingDetail> ,
  //   pOnComplete : ()=> void
  // ){
  //   if(pInput == null || typeof(pOnComplete) !== "function"){
  //     return;
  //   }
  //   let strUrl = this._svShared.urlSale + "/api/Billing/InsertBilling";
  //   let insertBilling$ = this._http.post(strUrl , pInput).subscribe(()=>{
  //     insertBilling$?.unsubscribe();
  //     pOnComplete();
  //   }, err =>{
  //     insertBilling$?.unsubscribe();
  //     Swal.fire(err.message || "" , err.error || "" , "error");
  //   })
  // }

  async InsertBillingAsync(pInput : ModelBilling2 ){
    if(pInput == null ){
      return;
    }
    let strUrl = this._svDefault.GetString(this._svShared.urlSale) + "/api/Billing/InsertBilling";
    let result = await this._http.post<string>(strUrl , pInput).toPromise();
    return result;
  }

  // async InsertBillingAsync(
  //   pInput : ModelHeaderDetail<ModelSaleBillingHeader , ModelSaleBillingDetail> ,
  // ): Promise<ModelHeaderDetail<ModelSaleBillingHeader , ModelSaleBillingDetail>>{
  //   if(pInput == null ){
  //     return;
  //   }
  //   let strUrl = (this._svShared.urlSale || "").toString().trim() + "/api/Billing/InsertBilling";
  //   let result = <ModelHeaderDetail<ModelSaleBillingHeader , ModelSaleBillingDetail>>
  //     await this._http.post(strUrl , pInput).toPromise();
  //   return result;
  // }

  async UpdateBillingAsyc( pInput : ModelBilling2){
    if(pInput == null){
      return;
    }
    let strUrl = this._svDefault.GetString(this._svShared.urlSale) + "/api/Billing/UpdateBilling";
    let result = await this._http.post<string>(strUrl , pInput).toPromise();
    return result;
  }
  async UpdateStatus( pInput : ModelSaleBillingHeader){
    if(pInput == null){
      return;
    }
    let strUrl = this._svDefault.GetString(this._svShared.urlSale) + "/api/Billing/UpdateStatus";
    let result = await this._http.post<string>(strUrl , pInput).toPromise();
    return result;
  }
  // async UpdateBillingAsyc(
  //   pInput : ModelHeaderDetail<ModelSaleBillingHeader , ModelSaleBillingDetail>
  // ) : Promise<ModelHeaderDetail<ModelSaleBillingHeader , ModelSaleBillingDetail>>{
  //   if(pInput == null){
  //     return;
  //   }
  //   let strUrl = (this._svShared.urlSale || "").toString().trim() + "/api/Billing/UpdateBilling";
  //   let result = <ModelHeaderDetail<ModelSaleBillingHeader , ModelSaleBillingDetail>>await this._http.post(strUrl , pInput).toPromise();
  //   return result;
  // }
  public async SearchBillingAsync(pInput : ModelSearchBillingInput){
    let strUrl = this._svShared.urlSale + "/api/Billing/SearchBilling";
    let result = await this._http.post<ModelBillingResult>(strUrl , pInput).toPromise();
    return result;
  }
  // SearchBilling(
  //   pInput : ModelBilling.ModelSearchBillingInput ,
  //   pOnComplete : ( x : ModelBilling.ModelSaleBillingHeader[] ) => void ,
  //   pOnError? : (e:Error)=> void
  // ):void {
  //   if(typeof(pOnComplete) !== "function"){
  //     return;
  //   }
  //   let requestSearchBill : Subscription = null;
  //   if(typeof(pOnError) !== "function"){
  //     pOnError = (e:Error)=>{
  //       this.showError(e);
  //       requestSearchBill?.unsubscribe();
  //     };
  //   }
  //   let strUrl = this._svShared.urlSale + "/api/Billing/SearchBilling";
  //   requestSearchBill = this._http.post<ModelBilling.ModelSaleBillingHeader[]>(strUrl , pInput)
  //     // .pipe(catchError( async (e) => pOnError(e)) , map( x=> <ModelBilling.ModelApiListOutput<ModelBilling.ModelSaleBillingHeader>>x ))
  //     .subscribe( x => {
  //       try {
  //         requestSearchBill?.unsubscribe();
  //         pOnComplete(x);
  //       } catch (error) {
  //         requestSearchBill?.unsubscribe();
  //         pOnError(<Error>error);
  //       }
  //     } , err=> {
  //       requestSearchBill?.unsubscribe();
  //       Swal.fire(err.message || "" , err.error || "" , "error");
  //     });
  // }
  public async GetTaxInvoice(pStrCusCode : string){
    pStrCusCode = this._svDefault.GetString(pStrCusCode);
    if(pStrCusCode === ""){
      return null;
    }
    let strUrl : string = this._svShared.urlSale + "/api/Billing/GetTaxInvoice/" + pStrCusCode ;
    let result = await this._http.get<ModelGetBillingModalItemOutput[]>(strUrl).toPromise();
    return result;
  }
  // SearchBillingModalItem(
  //   pStrCustomerCode : string ,
  //   pOncomplete : (x : ModelBilling.ModelGetBillingModalItemOutput[]) => void ,
  //   pOnError? : (e : Error)=> void
  // ){
  //   if(typeof(pOncomplete) !== "function"){
  //     return;
  //   }
  //   let strUrl : string = this._svShared.urlSale + "/api/Billing/GetBillingModalItem" ;
  //   let param ={CustomerCode : pStrCustomerCode};
  //   let modalItem$ = this._http.post<ModelBilling.ModelGetBillingModalItemOutput[]>(strUrl , param  ).subscribe( x=>{
  //     modalItem$?.unsubscribe();
  //     pOncomplete(x);
  //   } , pException=>{
  //     modalItem$?.unsubscribe();
  //     if(pException == null){
  //       return;
  //     }
  //     let strHeader = (pException.message || "").toString().trim();
  //     let strMessage = (pException.error || "").toString().trim();
  //     if(typeof(pOnError)==="function"){
  //       pOnError(<Error>{
  //         message : strHeader,
  //         stack : strMessage
  //       });
  //     }else{
  //       Swal.fire(strHeader , `<pre>${strMessage}</pre>` , "error");
  //     }
  //   } )
  // }

  // async SearchBillingModalItemAsync(pStrCustomerCode : string ): Promise<ModelGetBillingModalItemOutput[]>{
  //   let strUrl : string = (this._svShared.urlSale || "").toString().trim() + "/api/Billing/GetBillingModalItem" ;
  //   let param ={CustomerCode : pStrCustomerCode};
  //   let result = await this._http.post<ModelGetBillingModalItemOutput[]>(strUrl , param  ).toPromise();
  //   return result;
  // }

  ShowModal<T>(pContent : any , pStrSize : "xl" | "lg" | "xs" , pOncomplete : ( x : T )=> void , pInput? : any){
    if( pContent == null){
      return;
    }
    let modalRef : NgbModalRef = this._modalService.open(pContent, { size : pStrSize });
    if(pInput != null){
      for (const key in pInput) {
        if (Object.prototype.hasOwnProperty.call(pInput, key)) {
          modalRef.componentInstance[key] = pInput[key];
        }
      }
    }
    if(typeof(pOncomplete) === "function"){
      modalRef.result.then( x=> this._svDefault.DoAction(()=> pOncomplete(x))
      , r=> {}).catch(x=> {});
    }
  }

  public GetReportBilling(pStrCompCode: string, pStrBrnCode: string, pStrDocNo: string) {
    let request = {
      "CompCode": pStrCompCode,
      "BrnCode": pStrBrnCode,
      "DocNo": pStrDocNo,
    }
    let headers = new HttpHeaders()
    let strUrl = (this._svShared.urlViewer || "").toString().trim() + "/Billing/PrintBilling";
    this._http.post(strUrl, request, {
      responseType: 'arraybuffer', headers: headers
    }
    ).subscribe(response => this._svDefault.DownLoadFile('รายงานใบวางบิล.pdf', response, "application/octet-stream"));
  }

}

