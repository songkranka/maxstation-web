import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ModelInfPoHeader, ModelInfPoItem, ModelInvReceiveProdHd, ModelMasSupplier } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ModelSupplierResult, PoHeaderListQuery, PoItemListParam, PoItemListResult, QueryResult, ReceiveGasListQuery, ReceiveGasQuery } from './ModelReceiveGas';

export interface ReceiveGasData<T> {
  Data: T,
  StatusCode: string,
  Message: string,
};

@Injectable({
  providedIn: 'root'
})
export class ReceiveGasService {

constructor(
  private _svShare : SharedService , 
  private _svDefault : DefaultService,
  private _http : HttpClient ,
) { }
  public async GetPoHeaderList( pQuery : PoHeaderListQuery): Promise<ModelInfPoHeader[]>{
    let strUrl = (this._svShare.urlInv || "").toString().trim() + "/api/ReceiveGas/GetPoHeaderList";
    let result  =  <ModelInfPoHeader[]>await this._http.post(strUrl , pQuery).toPromise();
    return result;
  }

  public async GetPoItemList( param : PoItemListParam): Promise<PoItemListResult>{
    let strUrl = (this._svShare.urlInv || "").toString().trim() + "/api/ReceiveGas/GetPoItemList";
    let result  =  <PoItemListResult>await this._http.post(strUrl , param).toPromise();
    return result;
  }

  public async GetReceiveGas(pStrGuid : string): Promise<ReceiveGasQuery>{
    pStrGuid = (pStrGuid || "").toString().trim();
    if(pStrGuid === ""){
      return;
    }
    let strUrl = (this._svShare.urlInv || "").toString().trim() 
      + "/api/ReceiveGas/GetReceiveGas/" + encodeURI(pStrGuid);
    let result = <ReceiveGasQuery>await this._http.get(strUrl).toPromise();
    return result;
  }

  public async SaveReceiveGas(pQuery : ReceiveGasQuery){  
    let strUrl = (this._svShare.urlInv || "").toString().trim() + "/api/ReceiveGas/SaveReceiveGas";
    return await this._http.post(strUrl, pQuery).pipe(
      map((receiveGasData: ReceiveGasData<ReceiveGasQuery>) => receiveGasData),
      catchError(err => throwError(err))
    ).toPromise()
    // let result =<ReceiveGasQuery> await this._http.post(strUrl , pQuery).toPromise();
    // return result;
  }

  public async GetReceiveGasList(pQuery : ReceiveGasListQuery){
    if(pQuery == null){
      return null;
    }
    let strUrl = (this._svShare.urlInv || "").toString().trim() + "/api/ReceiveGas/GetReceiveGasList";
    let result =<QueryResult<ModelInvReceiveProdHd>> await this._http.post(strUrl , pQuery).toPromise();
    return result;
  }
  public async UpdateStatus(pInput : ModelInvReceiveProdHd){
    if(pInput == null){
      return null;
    }
    let strUrl = (this._svShare.urlInv || "").toString().trim() + "/api/ReceiveGas/UpdateStatus";
    let result =<ModelInvReceiveProdHd> await this._http.post(strUrl , pInput).toPromise();
    return result;
  }
  public async GetArraySupplier(): Promise<ModelMasSupplier[]>{
    let strUrl = (this._svShare.urlInv || "").toString().trim() + "/api/ReceiveGas/GetArraySupplier";
    let result : ModelMasSupplier[] = null;
    result = await this._http.get<ModelMasSupplier[]>(strUrl).toPromise();
    return result;
  }

public async GetSupplier(pStrSupCode : string , pStrCompCode : string): Promise<ModelSupplierResult>{
    pStrSupCode = (pStrSupCode || "").toString().trim();
    pStrCompCode = ( pStrCompCode || "").toString().trim();
    if(pStrSupCode === "" || pStrCompCode === ""){
      return null;
    }
    pStrCompCode = encodeURI(pStrCompCode);
    pStrSupCode = encodeURI(pStrSupCode);
    let strUrl = (this._svShare.urlInv || "").toString().trim() 
    + `/api/ReceiveGas/GetSupplier/${pStrSupCode}/${pStrCompCode}`;
    let result : ModelSupplierResult = null;
    result = await this._http.get<ModelSupplierResult>(strUrl).toPromise();
    return result;
  }
}
