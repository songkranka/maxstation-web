import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModelInvUnuseHd, ModelMasProduct, ModelMasReason } from 'src/app/model/ModelScaffold';
import { SharedService } from 'src/app/shared/shared.service';
import { ModelUnusable, ModelUnusableParam, ModelUnusableResult } from './ModelUnusable';

@Injectable({
  providedIn: 'root'
})
export class UnusableService {

constructor(
  private _http : HttpClient,
  private _svShared : SharedService,
) { 
  this._strUrl = (_svShared.urlInv || "").toString().trim()+ "/api/Unusable/";
}
  private _strUrl : string = "";
  public async GetArrayHeader(param : ModelUnusableParam): Promise<ModelUnusableResult>{
    if(param == null){
      return null;
    }
    let strUrl : string = "";
    strUrl = this._strUrl + "GetArrayHeader";
    let result : ModelUnusableResult = null;
    result = await this._http.post<ModelUnusableResult>(strUrl , param).toPromise();
    return result
  }
  public async GetArrayProduct(): Promise<ModelMasProduct[]>{
    let strUrl : string = "";
    strUrl = this._strUrl + "GetArrayProduct";
    let result : ModelMasProduct[] = null;
    result = await this._http.get<ModelMasProduct[]>(strUrl).toPromise();
    return result
  }

  public async GetArrayReason(){
    let strUrl : string = "";
    strUrl = this._strUrl + "GetArrayReason";
    let result : ModelMasReason[] = null;
    result = await this._http.get<ModelMasReason[]>(strUrl).toPromise();
    return result;
  }
  public async GetUnusable(pStrGuid : string): Promise<ModelUnusable>{
    pStrGuid = (pStrGuid || "").toString().trim();
    if(pStrGuid === ""){
      return null;
    }
    pStrGuid = encodeURI(pStrGuid);
    let strUrl : string = "";
    strUrl = this._strUrl + "GetUnusable/" + pStrGuid;
    let result : ModelUnusable = null;
    result = await this._http.get<ModelUnusable>(strUrl).toPromise();
    return result;
  }

  public async SaveUnusable(param : ModelUnusable): Promise<ModelUnusable>{
    if(param == null){
      return null;
    }
    let strUrl : string = "";
    strUrl = this._strUrl + "SaveUnusable";
    let result : ModelUnusable = null;
    result = await this._http.post<ModelUnusable>(strUrl , param).toPromise();
    return result;
  }

  public async UpdateStatus(pHeader : ModelInvUnuseHd): Promise<ModelInvUnuseHd>{
    if(pHeader == null){
      return null;
    }
    let strUrl : string = "";
    strUrl = this._strUrl + "UpdateStatus";
    let result : ModelInvUnuseHd = null;
    result = await this._http.post<ModelInvUnuseHd>(strUrl , pHeader).toPromise();
    return result;
  }

}
