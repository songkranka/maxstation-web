import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModelInfPoHeader, ModelInfPoItem, ModelInvReturnSupHd, ModelMasBranch, ModelMasEmployee, ModelMasReason, ModelInvReceiveProdDt, ModelMasSupplier, ModelInvReceiveProdHd } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ModelSupplierReturn, ModelSupplierReturnResult, ModelSupplierReturnParam } from 'src/app/modules/Inventory/SupplierReturn/ModelSupplierReturn';
import { promise } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class SupplierReturnService {

  constructor(
    private _svShared : SharedService,
    private _svDefault : DefaultService,
    private _http : HttpClient,
  ) { 
    this._strUrlInventory = (_svShared.urlInv || "").toString().trim() ;
    this._strApiSupplierReturn = this._strUrlInventory + "/api/SupplierReturn/";
  }

  private _strUrlInventory : string = "";
  private _strApiSupplierReturn : string = "";

  public async GetArraySupplierReturnHeader(param : ModelSupplierReturnParam): Promise<ModelSupplierReturnResult> {
    if(param == null){
      return null;
    }
    let strUrl : string ="";
    strUrl = this._strApiSupplierReturn + "GetArraySupplierReturnHeader";
    let result : ModelSupplierReturnResult = null;
    result = await this._http.post<ModelSupplierReturnResult>(strUrl , param).toPromise();
    return result;
  }
  public async GetArrayReceiveProduct(param : ModelInvReturnSupHd): Promise<ModelInvReceiveProdHd[]>{
    if(param == null){
      return null;
    }
    let strUrl : string ="";
    strUrl = this._strApiSupplierReturn + "GetArrayReceiveProduct";
    let result : ModelInvReceiveProdHd[] = null;
    result = await this._http.post<ModelInvReceiveProdHd[]>(strUrl , param).toPromise();
    return result;
  }
  public async GetArrayReceiveProdDt(param : ModelInvReceiveProdHd): Promise<ModelInvReceiveProdDt[]>{
    if(param == null){
      return null;
    }
    let strUrl : string ="";
    strUrl = this._strApiSupplierReturn + "GetArrayReceiveProdDt";
    let result : ModelInvReceiveProdDt[] = null;
    result = await this._http.post<ModelInvReceiveProdDt[]>(strUrl , param).toPromise();
    return result;
  }
  public async GetArrayBranch(){
    let strUrl : string ="";
    strUrl = this._strApiSupplierReturn + "GetArrayBranch";
    let result : ModelMasBranch[] = null;
    result = await this._http.get<ModelMasBranch[]>(strUrl).toPromise();
    return result;
  }
  public async GetArrayPoItem(pStrPoNumber : string){
    pStrPoNumber = (pStrPoNumber || "").toString().trim();
    if(pStrPoNumber === ""){
      return null;
    }
    let strUrl : string ="";
    strUrl = this._strApiSupplierReturn + "GetArrayPoItem/" + encodeURI(pStrPoNumber);
    let result : ModelInvReceiveProdDt[] = null;
    result = await this._http.get<ModelInvReceiveProdDt[]>(strUrl).toPromise();
    return result;
  }
  public async GetArrayReason(): Promise<ModelMasReason[]> {
    let strUrl : string ="";
    strUrl = this._strApiSupplierReturn + "GetArrayReason";
    let result : ModelMasReason[] = null;
    result = await this._http.get<ModelMasReason[]>(strUrl).toPromise();
    return result;
  }
  public async GetArrayReasonDesc(ReasonID : string): Promise<ModelMasReason[]> {
    let strUrl : string ="";
    strUrl = this._strApiSupplierReturn + "GetArrayReasonDesc"; + encodeURI(ReasonID)
    let result : ModelMasReason[] = null;
    result = await this._http.get<ModelMasReason[]>(strUrl).toPromise();
    return result;
  }
  public async GetEmployee(pStrEmpCode : string): Promise<ModelMasEmployee>{
    pStrEmpCode = (pStrEmpCode || "").toString().trim();
    if(pStrEmpCode === ""){
      return;
    }
    let strUrl : string ="";
    strUrl = this._strApiSupplierReturn + "GetEmployee/" + encodeURI(pStrEmpCode);
    let result : ModelMasEmployee = null;
    result = await this._http.get<ModelMasEmployee>(strUrl).toPromise();
    return result;
  }
  public async GetSupplier(pStrSupCode : string): Promise<ModelMasSupplier>{
    pStrSupCode = (pStrSupCode || "").toString().trim();
    if(pStrSupCode === ""){
      return;
    }
    let strUrl : string = "";
    strUrl = this._strApiSupplierReturn + "GetSupplier/" + encodeURI(pStrSupCode);
    let result : ModelMasSupplier = null;
    result = await this._http.get<ModelMasSupplier>(strUrl).toPromise();
    return result;
  }
  public async GetSupplierReturn(pStrGuid : string): Promise<ModelSupplierReturn> {
    pStrGuid = (pStrGuid || "").toString().trim();
    if(pStrGuid === ""){
      return;
    }
    let strUrl : string ="";
    strUrl = this._strApiSupplierReturn + "GetSupplierReturn/" + encodeURI(pStrGuid);
    let result : ModelSupplierReturn = null;
    result = await this._http.get<ModelSupplierReturn>(strUrl).toPromise();
    return result;
  }
  public async UpdateStatus(param : ModelInvReturnSupHd): Promise<ModelInvReturnSupHd> {
    if(param == null){
      return null;
    }
    let strUrl : string ="";
    strUrl = this._strApiSupplierReturn + "UpdateStatus";
    let result : ModelInvReturnSupHd = null;
    result = await this._http.post<ModelInvReturnSupHd>(strUrl , param).toPromise();
    return result;
  }
  public async SaveSupplierReturn(param : ModelSupplierReturn): Promise<ModelSupplierReturn> {
    if(param == null){
      return null;
    }
    let strUrl : string ="";
    strUrl = this._strApiSupplierReturn + "SaveSupplierReturn";
    let result : ModelSupplierReturn = null;
    result = await this._http.post<ModelSupplierReturn>(strUrl , param).toPromise();
    return result;
  }
}
