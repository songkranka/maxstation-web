import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModelInvDeliveryCtrl, ModelInvDeliveryCtrlDt, ModelInvDeliveryCtrlHd, ModelInvReceiveProdDt, ModelInvReceiveProdHd, ModelMasMapping, ModelMasProduct } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ModelDeliveryControl, ModelParamSearchDelivery, ModelParamSearchReceive, ModelResultSearchDelivery } from './ModelDelivery';

@Injectable({
  providedIn: 'root'
})
export class DeliveryControlService {
  private _strInvUrl : string = "";
constructor(
  private _svDefault : DefaultService,
  private _http : HttpClient ,
  private _svShared : SharedService,
) {
  this._strInvUrl = _svDefault.GetString(_svShared.urlInv) + "/api/DeliveryControl/";

}

public async GetMasMapping(){
  let strUrl = this._strInvUrl + "GetMasMapping";
  let result = await this._http.get<ModelMasMapping[]>(strUrl).toPromise();
  return result;
}

public async GetProducts(){
  let strUrl = this._strInvUrl + "GetProducts";
  let result = await this._http.get<ModelMasProduct[]>(strUrl).toPromise();
  return result;
}

public async UpdateStatus(param : ModelInvDeliveryCtrlHd){
  if(param == null){
    return;
  }
  let strUrl = this._strInvUrl + "UpdateStatus";
  let result = await this._http.post<ModelInvDeliveryCtrlHd>(strUrl , param).toPromise();
  return result;
}

public async GetDeliveryControl(pStrGuid : string){
  pStrGuid = this._svDefault.GetString(pStrGuid);
  if(pStrGuid === ""){
    return null;
  }
  let strUrl = this._strInvUrl + "GetDeliveryControl/" + pStrGuid;
  let result = await this._http.get<ModelDeliveryControl>(strUrl).toPromise();
  return result;
}

public async SaveDeliveryControl(param : ModelDeliveryControl){
  if(param == null){
    return;
  }
  let strUrl = this._strInvUrl + "SaveDeliveryControl";
  let result = await this._http.post<ModelDeliveryControl>(strUrl , param).toPromise();
  return result;
}

public async SearchDelivery(param : ModelParamSearchDelivery){
  if(param == null){
    return;
  }
  let strUrl = this._strInvUrl + "SearchDelivery";
  let result = await this._http.post<ModelResultSearchDelivery>(strUrl , param).toPromise();
  return result;
}

public async SearchReceive(param : ModelParamSearchReceive){
  if(param == null){
    return;
  }
  let strUrl = this._strInvUrl + "SearchReceive";
  let result = await this._http.post<ModelInvReceiveProdHd[]>(strUrl , param).toPromise();
  return result;
}

}
