import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { type } from 'os';
import { ModelResponseData } from 'src/app/model/ModelCommon';
import { ModelCheckStockRealtimeParam, ModelGetRequestDtListQueryResource, ModelGetRequestHdListQueryResource, ModelRequestDT, ModelRequestHD, ModelStockRealTime, ModelTransferOutDT, ModelTransferOutHD, ModelTransferOutQueryResource } from 'src/app/model/ModelTransferOut';
import { ModelApiResult } from 'src/app/modules/Invoice/ModelInvoice';
import { valueSelectbox } from 'src/app/shared-model/demoModel';
import { SharedService } from 'src/app/shared/shared.service';
import Swal from 'sweetalert2';
import { DefaultService } from '../default.service';

@Injectable({
  providedIn: 'root'
})
export class TransferOutService {
  constructor(
    private _svShare : SharedService , 
    private _http : HttpClient,
    private _svDefault : DefaultService ,
  ) { }
    private showError(e : any){
      if(e == null){
        return;
      }
      let strHtml = "";
      let strTitle = "";
      if(e.hasOwnProperty("error") && typeof e.error === "string"){
        strHtml = (e.error || "").toString().trim();
      }
      if(e.hasOwnProperty("message") && typeof e.message === "string"){
        strTitle = (e.message || "").toString().trim();
      }else if(e.hasOwnProperty("Message") && typeof e.Message === "string"){
        strTitle = (e.Message || "").toString().trim();
      }
      if(strTitle === "" && strHtml === ""){
        Swal.close();
      }else{
        Swal.fire(e.message || "" , strHtml , "error");
      }
    }
    InsertTransferOut(param : ModelTransferOutHD , pOnComplete : (x:string)=> void){
      if(typeof pOnComplete !== "function" || param == null){
        return;
      }
      let strUrl = (this._svShare.urlInv || "").toString().trim() + "/api/TransferOut/InsertTransferOut";
      let insertTransferOut$ = this._http.post<string>(strUrl , param).subscribe( (x)=> {
        insertTransferOut$?.unsubscribe();
        pOnComplete(x);
      }, e=>{
        insertTransferOut$?.unsubscribe();
        this.showError(e.error);
      });
    }
  SearchTranOut(
    param : ModelTransferOutQueryResource , 
    pOnComplete : ( pResponseData : ModelResponseData<ModelTransferOutHD[]>)=> void
  ) : void{
    if(typeof pOnComplete !== "function"){
      return;
    }
    let strUrl = (this._svShare.urlInv || "").toString().trim() + "/api/TransferOut/SearchTranOut";
    let funcMapDetail : ( x: any) => ModelTransferOutDT = null;
    funcMapDetail = x=>{
      let hd = new ModelTransferOutDT();
      this._svDefault.CopyObject(x , hd);
      return hd;
    }
    let funcMapHeader : (x: any) => ModelTransferOutHD = null;
    funcMapHeader = x=>{
      let hd = new ModelTransferOutHD();
      this._svDefault.CopyObject(x , hd);
      let arrDetail : ModelTransferOutDT[] = hd.listTransOutDt;
      if(Array.isArray( arrDetail) && arrDetail.length){
        hd.listTransOutDt = arrDetail.map(funcMapDetail);
      }
      return hd;
    }
    let funMapResponse : (x: any) => ModelResponseData<ModelTransferOutHD[]> = null;
    funMapResponse = x =>{
      if(x == null){
        return null;
      }
      let resp = new ModelResponseData<ModelTransferOutHD[]>();
      this._svDefault.CopyObject(x , resp);
      let arrHeader : ModelTransferOutHD[] = resp.data;
      if(Array.isArray(arrHeader) && arrHeader.length){
        resp.data = arrHeader.map(funcMapHeader);
        resp.totalItems = x["totalItems"];
      }
      return resp;
    }
    let searchTranOut$ = this._http.post<ModelResponseData<ModelTransferOutHD[]>>(strUrl , param).subscribe( x=> {
      searchTranOut$?.unsubscribe();
      x = funMapResponse(x);
      pOnComplete(x);
    } , e =>{
      searchTranOut$?.unsubscribe();
      this.showError(e);
    });
  }
  async SearchTranOutAsync(param : ModelTransferOutQueryResource ) : Promise<ModelResponseData<ModelTransferOutHD[]>>{
    let strUrl = (this._svShare.urlInv || "").toString().trim() + "/api/TransferOut/SearchTranOut";
    let result = await this._http.post<ModelResponseData<ModelTransferOutHD[]>>(strUrl , param).toPromise();
    return result;
  }

// export interface valueSelectbox {
  // 
  GetBranch(pOnComplete : (x:valueSelectbox[])=>void){
    if(typeof pOnComplete !== "function"){
      return;
    }
    let data : any =   {
      "CompCode": this._svShare.compCode || "",
      "LocCode": this._svShare.locCode || ""
    }
    let strUrl = (this._svShare.urlMas || "").toString().trim() + "/api/Branch/GetBranchList";
    let getBranch$ = this._http.post<any>(strUrl , data).subscribe( pBranchResult=> {
      getBranch$?.unsubscribe();
      if(pBranchResult == null 
      || !pBranchResult.hasOwnProperty("Data") 
      || !Array.isArray(pBranchResult.Data) 
      || !pBranchResult.Data.length){
        return;
      }
      let arrSelectBox = pBranchResult.Data.map( pBranchItem =>{
        let strBrnCode = (pBranchItem?.BrnCode || "").toString().trim();
        let strBrnName = (pBranchItem?.BrnName || "").toString().trim();
        let selectBoxItem = <valueSelectbox>{
          KEY : strBrnCode,
          VALUE : strBrnCode + " : " + strBrnName
        }
        return selectBoxItem;
      });
      let emptyItem = <valueSelectbox>{KEY : "" , VALUE : "กรุณาเลือกสถานีที่ร้องขอ"};
      arrSelectBox = [emptyItem , ...arrSelectBox];
      pOnComplete(arrSelectBox);
    } , e =>{
      getBranch$?.unsubscribe();
      this.showError(e);
    } );
  }
  GetDocumentType(pOnComplete : (pArrValueSelectBox : valueSelectbox[])=> void , pOnError:(e:any) => void) {
    var data =
    {
      "DocType": "Request"
    }
    let strUrl = (this._svShare.urlMas || "").toString().trim() + "/api/DocumentType/GetDocumentType"; 
    let getDocumentType$= this._http.post(strUrl,data).subscribe(  response  => {
        getDocumentType$?.unsubscribe();
        let docTypeSelect2 =(<any[]>response["Data"]).map( x=> <valueSelectbox>{
          KEY : (x.DocTypeName || "").toString().trim() ,
          VALUE : (x.DocTypeId || "").toString().trim()
        });
        pOnComplete(docTypeSelect2);
      },
      er  => {
        console.log("Error", er);
        pOnError(er); 
      }
    );//subscripe
  }//GetDocumentType

  async GetDocumentTypeAsync() : Promise< valueSelectbox[]> {
    var data ={"DocType": "Request" };
    let strUrl = (this._svShare.urlMas || "").toString().trim() + "/api/DocumentType/GetDocumentType"; 
    let response : any = await this._http.post(strUrl,data).toPromise();
    let result : valueSelectbox[] =(<any[]>response.Data).map( x=> <valueSelectbox>{
      KEY : (x.DocTypeName || "").toString().trim() ,
      VALUE : (x.DocTypeId || "").toString().trim()
    });
    return result;
  }//GetDocumentType

  GetRequestHdList( 
    param : ModelGetRequestHdListQueryResource
    , pOnComplete :( pArrRequestHeader :ModelRequestHD[]) => void
    , pOnError : (e:any )=> void
  ):void{
    let strUrl = (this._svShare.urlInv || "").toString().trim() + "/api/TransferOut/GetRequestHdList";
    let funcMapRequestHeader : ( x : any)=> ModelRequestHD = null;
    funcMapRequestHeader = x=>{
      let rhd : ModelRequestHD = new ModelRequestHD();
      this._svDefault.CopyObject(x , rhd);
      return rhd;
    };
    let getRequestHdList$ = this._http.post<ModelRequestHD[]>(strUrl , param).subscribe( pArrRequestHeader=> {
      getRequestHdList$?.unsubscribe();
      let arrReqHd : ModelRequestHD[] = null;
      if(Array.isArray(pArrRequestHeader) && pArrRequestHeader.length){
        arrReqHd = pArrRequestHeader.map(funcMapRequestHeader);
      }
      pOnComplete(arrReqHd);
    } , e=>{
      getRequestHdList$?.unsubscribe();
      pOnError(e);
    });// subscribe
  }
  
  GetRequestDtList(param :  ModelGetRequestDtListQueryResource , pOnComplete : (pArrRequestDt : ModelRequestDT[])=> void){
    let strUrl = (this._svShare.urlInv || "").toString().trim() + "/api/TransferOut/GetRequestDtList";
    let funcMapRequestDetail : (x : any)=> ModelRequestDT = null;
    funcMapRequestDetail = x =>{
      let dt = new ModelRequestDT();
      this._svDefault.CopyObject(x , dt);
      return dt;
    }
    let getRequestDtList$ = this._http.post<ModelRequestDT[]>(strUrl , param).subscribe( pArrRequestDetail=> {
      getRequestDtList$?.unsubscribe();
      if(Array.isArray(pArrRequestDetail) && pArrRequestDetail.length){
        pArrRequestDetail = pArrRequestDetail.map(funcMapRequestDetail);
      }
      pOnComplete(pArrRequestDetail);
    } , e=>{
      getRequestDtList$?.unsubscribe();
      this.showError(e);
    });// subscribe
  }
  GetRequest(pStrGuid : string , pOnComplete : (pRequestHeader:ModelRequestHD)=> void ){
    pStrGuid = (pStrGuid || "").toString().trim();
    if(pStrGuid === ""){
      return;
    }
    if(typeof(pOnComplete) !== "function" ){
      return;
    }
    let req = {
      "Guid": pStrGuid
    }
    let strUrl = (this._svShare.urlInv || "").toString().trim() + "/api/Request/GetRequest";
    let getRequest$ = this._http.post<any>(strUrl , req).subscribe( x=>{
      getRequest$?.unsubscribe();
      pOnComplete(<ModelRequestHD>x.Data);
    } , e => {
      getRequest$?.unsubscribe();
      this.showError(e);
    });
  }
  UpdateTransferOut(pTransferOut :ModelTransferOutHD , pOnComplete : (x: string)=>void){
    if(pTransferOut == null && typeof pOnComplete !== "function"){
      return;
    }
    let strUrl = (this._svShare.urlInv || "").toString().trim() + "/api/TransferOut/UpdateTransferOut";
    let updateTransferOut$ = this._http.post<string>(strUrl , pTransferOut).subscribe( (x)=>{
      updateTransferOut$?.unsubscribe();
      pOnComplete(x);
    }, err=>{
      updateTransferOut$?.unsubscribe();
      this.showError(err);
    });
  }

  public async CheckStockRealTime(param : ModelCheckStockRealtimeParam){
    if(param == null){
      return null;
    }
    let strUrl = (this._svShare.urlInv || "").toString().trim() + "/api/TransferOut/CheckStockRealTime";
    let result = await this._http.post<ModelStockRealTime[]>(strUrl , param).toPromise();
    return result;
  }

}


