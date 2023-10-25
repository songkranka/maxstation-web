import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModelInvAuditHd, ModelMasEmployee, ModelMasProduct } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ModelAudit, ModelAuditParam, ModelAuditProduct, ModelAuditProductParam, ModelAuditResult } from './ModelAudit';

@Injectable({
  providedIn: 'root'
})
export class AuditService {
  private _strInvUrl : string = "";
  constructor( 
    private _svDefault : DefaultService , 
    private _svShared : SharedService ,
    private _http : HttpClient,
  ) { 
    this._strInvUrl = _svDefault.GetString(_svShared.urlInv) + "/api/Audit/";
  }

  public async SaveData(pInput : ModelAudit): Promise<ModelAudit>{
    if(pInput == null){
      return null;
    }
    let strUrl = this._strInvUrl + "SaveData";
    let result : ModelAudit = null;
    result = await this._http.post<ModelAudit>(strUrl , pInput).toPromise();
    return result;
  }
  public async UpdateStatus(pInput : ModelInvAuditHd): Promise<ModelInvAuditHd>{
    if(pInput == null){
      return null;
    }
    let strUrl = this._strInvUrl + "UpdateStatus";
    let result : ModelInvAuditHd = null;
    result = await this._http.post<ModelInvAuditHd>(strUrl , pInput).toPromise();
    return result;
  }
  public async GetArrayHeader(pInput : ModelAuditParam): Promise<ModelAuditResult>{
    if(pInput == null){
      return null;
    }
    let strUrl = this._strInvUrl + "GetArrayAudit";
    let result : ModelAuditResult = null;
    result = await this._http.post<ModelAuditResult>(strUrl , pInput).toPromise();
    return result;
  }
  public async GetAudit(pStrGuid : string): Promise<ModelAudit>{
    pStrGuid = this._svDefault.GetString(pStrGuid);
    if(pStrGuid === ""){
      return null;
    }
    pStrGuid = encodeURI(pStrGuid);
    let strUrl = this._strInvUrl + "GetAudit/" + pStrGuid;
    let result : ModelAudit = null;
    result = await this._http.get<ModelAudit>(strUrl).toPromise();
    return result;
  }
  public async GetAuditCount(compCode: string, brnCode: string, pIntYear : number): Promise<number>{
    let pStrYear = this._svDefault.GetString(pIntYear);
    compCode = (compCode || "").toString().trim();
    brnCode = ( brnCode || "").toString().trim();
    if(compCode === "" || brnCode === "" || pStrYear === ""){
      return null;
    }
    compCode = encodeURI(compCode);
    brnCode = encodeURI(brnCode);
    pStrYear = encodeURI(pStrYear);

    // let strUrl = this._strInvUrl + "GetAuditCount/" + pStrYear;
    let strUrl = (this._strInvUrl || "").toString().trim() 
    + `GetAuditCount/${compCode}/${brnCode}/${pStrYear}`;
    let result : number = null;
    result = await this._http.get<number>(strUrl).toPromise();
    return result;
  }
  public async GetAuditProduct(pInput : ModelAuditProductParam): Promise<ModelAuditProduct>{
    let strUrl = this._strInvUrl + "GetAuditProduct/";
    let result : ModelAuditProduct = null;
    result = await this._http.post<ModelAuditProduct>(strUrl , pInput).toPromise();
    return result;
  }
  public async GetArrayProduct(pInput : ModelAuditProductParam): Promise<ModelMasProduct[]>{
    let strUrl = this._strInvUrl + "GetArrayProduct";
    let result : ModelMasProduct[] = null;
    result = await this._http.post<ModelMasProduct[]>(strUrl , pInput).toPromise();
    return result;
  }
  public async GetEmployee(pStrEmpCode : string): Promise<ModelMasEmployee>{
    pStrEmpCode = this._svDefault.GetString(pStrEmpCode);
    if(pStrEmpCode === ""){
      return null;
    }
    pStrEmpCode = encodeURI(pStrEmpCode);
    let strUrl = this._strInvUrl + "GetEmployee/" + pStrEmpCode;
    let result : ModelMasEmployee = null;
    result = await this._http.get<ModelMasEmployee>(strUrl).toPromise();
    return result;
  }
}
