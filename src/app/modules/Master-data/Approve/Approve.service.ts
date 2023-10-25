import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModelSysApproveConfig, ModelSysApproveHd, ModelSysApproveStep } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ModelApprove, ModelApproveParam, ModelArrayApprove, ModelSearchApproveParam, ModelSearchApproveResult } from './ModelApprove';

@Injectable({
  providedIn: 'root'
})
export class ApproveService {

constructor(
  private _svDefault : DefaultService,
  private _http : HttpClient ,
  private _svShared : SharedService ,
) { 
  this._strUrl = _svDefault.GetString(_svShared.urlMas) + "/api/Approve/";
}

private _strUrl : string = "";

public async GetArraySysApprove(pStrEmpCode : string){
  pStrEmpCode = this._svDefault.GetString(pStrEmpCode);
  if(pStrEmpCode === ""){
    return null;
  }
  let strUrl : string = this._strUrl + "GetArraySysApprove/" + encodeURI(pStrEmpCode);
  let result : ModelArrayApprove = null;
  result = await this._http.get<ModelArrayApprove>(strUrl).toPromise();
  return result;
}

public async GetPendingApprove(pStrEmpCode : string){
  pStrEmpCode = this._svDefault.GetString(pStrEmpCode);
  if(pStrEmpCode === ""){
    return null;
  }
  let strUrl : string = this._strUrl + "GetPendingApprove/" + encodeURI(pStrEmpCode);
  let result : ModelSysApproveStep[] = null;
  result = await this._http.get<ModelSysApproveStep[]>(strUrl).toPromise();
  return result;
}

public async GetApproveByGuid(pStrGuid : string){
  pStrGuid = this._svDefault.GetString(pStrGuid);
  if(pStrGuid === ""){
    return null;
  }
  let strUrl : string = this._strUrl + "GetApproveByGuid/" + encodeURI(pStrGuid);
  let result : ModelApprove = null;
  result = await this._http.get<ModelApprove>(strUrl).toPromise();
  return result;
}
public async SaveApprove( param : ModelApprove){
  if(param == null){
    return null;
  }
  let strUrl : string = this._strUrl + "SaveApprove";
  let result : ModelApprove = null;
  result = await this._http.post<ModelApprove>(strUrl , param).toPromise();
  return result;
}
public async GetArrayConfig(){
  let strUrl : string = this._strUrl + "GetArrayConfig";
  let result = await this._http.get<ModelSysApproveConfig[]>(strUrl).toPromise();
  return result;
}

public async ValidateApproveDocument( param : ModelApproveParam){
  if(param == null){
    return null;
  }
  let strUrl : string = this._strUrl + "ValidateApproveDocument";
  let result = await this._http.post<ModelSysApproveStep[]>(strUrl , param).toPromise();
  return result;
}

public async SearchApprove(param : ModelSearchApproveParam){
  if(param == null){
    return null;
  }
  let strUrl : string = this._strUrl + "SearchApprove";
  let result = await this._http.post<ModelSearchApproveResult>(strUrl , param).toPromise();
  return result;
}


}
