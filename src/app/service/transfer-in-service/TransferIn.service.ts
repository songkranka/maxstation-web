import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GetTransOutHdListQueryResource, ModelResponseData, ModelSearchTranInQueryResource, ModelTransferInDetail, ModelTransferInHeader } from 'src/app/model/ModelTransferIn';
import { ModelTransferOutDT, ModelTransferOutHD } from 'src/app/model/ModelTransferOut';
import { ModelApiResult } from 'src/app/modules/Invoice/ModelInvoice';
import { SharedService } from 'src/app/shared/shared.service';
import Swal from 'sweetalert2';
import { DefaultService } from '../default.service';

export interface TranferInData<T> {
  Data: T,
  StatusCode: string,
  Message: string,
};

@Injectable({
  providedIn: 'root'
})
export class TransferInService {

constructor(
  private _svShare : SharedService ,
  private _http : HttpClient ,
  private _svDefault : DefaultService,
) {
}

// ModelSearchTranInQueryResource
async SearchTranIn(param : ModelSearchTranInQueryResource):Promise<ModelResponseData<ModelTransferInHeader[]>>{
  let strUrl = (this._svShare.urlInv || "").toString().trim() + "/api/TransferIn/SearchTranIn";
  let result = new ModelResponseData<ModelTransferInHeader[]>();
  let apiData = <ModelResponseData<ModelTransferInHeader[]>>await this._http.post(strUrl , param).toPromise();
  apiData = this.mapSearchTranIn(apiData);
  if(apiData != null && !apiData.isSuccess){
    this.throwError(apiData);
  }
  try {
    result.ReceiveApiData(apiData);
  } catch (pException ) {
    result.SetHttpException(pException);
  }
  return result;
}


  async GetListTransferInDetail(param : ModelTransferInHeader) : Promise<ModelTransferInDetail[]>{
    let result : ModelTransferInDetail[] = null;
    let strUrl = (this._svShare.urlInv || "").toString().trim() + "/api/TransferIn/GetListTransferInDetail";
    let apiResult = <ModelResponseData<ModelTransferInDetail[]>>await this._http.post(strUrl , param).toPromise();
    apiResult = this.mapGetListTransferInDetail(apiResult);
    if(apiResult != null){
      if(apiResult.isSuccess){
        result = apiResult.data;
      }else{
        this.throwError(apiResult);
      }
    }
    return result;
  }

  async GetTransOutDtListAsync(param:ModelTransferOutHD) : Promise<ModelTransferOutDT[]> {
    let result : ModelTransferOutDT[] = null;
    let strUrl = (this._svShare.urlInv || "").toString().trim() + "/api/TransferIn/GetTransOutDtList";
    let apiResult = <ModelResponseData<ModelTransferOutDT[]>>await this._http.post(strUrl , param).toPromise();
    if(apiResult == null){
      return null;
    }
    let funcMapDetail : (x : any) => ModelTransferOutDT = null;
    funcMapDetail = x=>{
      let dt = new ModelTransferOutDT();
      this._svDefault.CopyObject(x , dt);
      return dt;
    }
    let funMapApiResult : (x : any)=> ModelResponseData<ModelTransferOutDT[]> = null;
    funMapApiResult = x =>{
      let apiResult = new ModelResponseData<ModelTransferOutDT[]>();
      this._svDefault.CopyObject(x , apiResult);
      let arrHeader : ModelTransferOutDT[] = apiResult.data;
      if(this._svDefault.IsArray(arrHeader)){
        apiResult.data = arrHeader.map(funcMapDetail);
      }
      return apiResult;
    }
    apiResult = funMapApiResult(apiResult);
    if(apiResult.isSuccess){
      result = apiResult.data;
    }else{
      this.throwError(apiResult);
    }
    return result;
  }

  async GetTransOutHdList(param : GetTransOutHdListQueryResource) : Promise<ModelTransferOutHD[]>{
    let result : ModelTransferOutHD[] = null;
    let strUrl = (this._svShare.urlInv || "").toString().trim() + "/api/TransferIn/GetTransOutHdList";
    let apiResult = <ModelResponseData<ModelTransferOutHD[]>>await this._http.post(strUrl , param).toPromise();
    if(apiResult == null){
      return null;
    }
    let funcMapHeader : (x: any) => ModelTransferOutHD = null;
    funcMapHeader = x=>{
      let hd = new ModelTransferOutHD();
      this._svDefault.CopyObject(x,hd);
      return hd;
    }
    let funMapApiResult : (x : any)=> ModelResponseData<ModelTransferOutHD[]> = null;
    funMapApiResult = x =>{
      let apiResult = new ModelResponseData<ModelTransferOutHD[]>();
      this._svDefault.CopyObject(x , apiResult);
      let arrHeader : ModelTransferOutHD[] = apiResult.data;
      if(this._svDefault.IsArray(arrHeader)){
        apiResult.data = arrHeader.map(funcMapHeader);
      }
      return apiResult;
    }
    apiResult = funMapApiResult(apiResult);
    if(apiResult.isSuccess){
      result = apiResult.data;
    }else{
      this.throwError(apiResult);
    }
    return result;
  }

  async InsertTransferInAsync(param : ModelTransferInHeader){
    // let result : ModelTransferInHeader = null;
    // let strUrl = (this._svShare.urlInv || "").toString().trim() + "/api/TransferIn/InsertTransferIn";
    // let apiResult : ModelResponseData<ModelTransferInHeader> 
    //   = <ModelResponseData<ModelTransferInHeader>>await this._http.post(strUrl , param).toPromise();
    // apiResult = this.mapTransferInHeader(apiResult)
    // if(apiResult != null){
    //   if(apiResult.isSuccess){
    //     result = apiResult.data;
    //   }else{
    //     this.throwError(apiResult);
    //   }
    // }
    // return result;

    let strUrl = (this._svShare.urlInv || "").toString().trim() + "/api/TransferIn/InsertTransferIn";
    return await this._http.post(strUrl, param).pipe(
      map((tranferInData: TranferInData<ModelTransferInHeader>) => tranferInData),
      catchError(err => throwError(err))
    ).toPromise()
  }

  async UpdateTransferInAsync(param : ModelTransferInHeader) : Promise<ModelTransferInHeader>{
    let result : ModelTransferInHeader = null;
    let strUrl = (this._svShare.urlInv || "").toString().trim() + "/api/TransferIn/UpdateTransferIn";
    let apiResult : ModelResponseData<ModelTransferInHeader> 
      = <ModelResponseData<ModelTransferInHeader>>await this._http.post(strUrl , param).toPromise();
    apiResult = this.mapTransferInHeader(apiResult)
    if(apiResult != null){
      if(apiResult.isSuccess){
        result = apiResult.data;
      }else{
        this.throwError(apiResult);
      }
    }
    return result;
  }

  public async GetTranferInHd(guid: string){
    guid = (guid || "").toString().trim();
    if (guid === ""){
      return null;
    }
    let docGuid = encodeURI(guid);
    let strUrl = (this._svShare.urlInv || "").toString().trim() + `/api/TransferIn/GetTranferInHdByGuid/${docGuid}`;
    // result = await this._http.get<ModelTransferInHeader>(strUrl).toPromise();
    let result = await this._http.get<TranferInData<ModelTransferInHeader>>(strUrl).toPromise();
    return result;
  }

  

  //--------------------[ private Method ]------------------//
  //ModelResponseData<ModelTransferInDetail[]>
  //  async GetListTransferInDetail(param : ModelTransferInHeader) : Promise<ModelTransferInDetail[]>{
  private mapGetListTransferInDetail(pInput : any) : ModelResponseData<ModelTransferInDetail[]>{
    if(pInput == null){
      return null;
    }
    let funcMapDetail : (x : any) => ModelTransferInDetail = null;
    funcMapDetail = x =>{
      let dt = new ModelTransferInDetail();
      this._svDefault.CopyObject(x , dt);
      return dt;
    }
    let result = new ModelResponseData<ModelTransferInDetail[]>();
    this._svDefault.CopyObject(pInput , result);
    let arrDetail :ModelTransferInDetail[] = result.data;
    if(this._svDefault.IsArray(arrDetail)){
      result.data = arrDetail.map(funcMapDetail);
    }
    return result;
  }

  private mapSearchTranIn(pInput : any) :  ModelResponseData<ModelTransferInHeader[]>{
    if(pInput == null){
      return null;
    }
    let result = new ModelResponseData<ModelTransferInHeader[]>();
    let funcMapHeader : (x : any) => ModelTransferInHeader = null;
    funcMapHeader = x =>{
      let dt = new ModelTransferInHeader();
      this._svDefault.CopyObject(x , dt);
      return dt;
    }
    this._svDefault.CopyObject(pInput , result);
    if(result.data != null){
      let arrHeader: ModelTransferInHeader[] = result.data;
      if(this._svDefault.IsArray(arrHeader)){
        result.data = arrHeader.map(funcMapHeader);
      }     
    } 
    return result;
  }
  private mapTransferInHeader(pInput : any) :  ModelResponseData<ModelTransferInHeader>{
    if(pInput == null){
      return null;
    }
    let funcMapDetail : (x : any) => ModelTransferInDetail = null;
    funcMapDetail = x =>{
      let dt = new ModelTransferInDetail();
      this._svDefault.CopyObject(x , dt);
      return dt;
    }
    let result = new  ModelResponseData<ModelTransferInHeader>();
    this._svDefault.CopyObject(pInput , result);
    if(result.data != null){
      let hd  = new ModelTransferInHeader();// = result.data;
      this._svDefault.CopyObject(result.data,hd);
      result.data = hd;
      let arrDetail :ModelTransferInDetail[] = hd.listTransferInDetail;
      if(this._svDefault.IsArray(arrDetail)){
        result.data.listTransferInDetail = arrDetail.map(funcMapDetail);
      }
    } 
    return result;
  }

  private throwError(pApiResult : ModelResponseData<any>) : void{
    throw <Error>{
      message : (pApiResult.errormessage || "").toString().trim() ,
      stack : (pApiResult.errorStackTrace || "").toString().trim()
    };
  }

}


