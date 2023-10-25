import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModelInfPoHeader, ModelInfPoItem, ModelInvReceiveProdDt, ModelInvReceiveProdHd, ModelInvReturnOilHd, ModelMasBranch, ModelMasEmployee, ModelMasProduct, ModelMasReason, ModelMasWarehouse } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ModelGetArrayPoItemResult, ModelReturnOil, ModelReturnOilParam, ModelReturnOilResult } from './ModelReturnOil';

@Injectable({
  providedIn: 'root'
})
export class ReturnOilService {

  constructor(
    private _svShared: SharedService,
    private _svDefault: DefaultService,
    private _http: HttpClient,
  ) {
    this._strUrlInventory = (_svShared.urlInv || "").toString().trim();
    this._strApiReturnOil = this._strUrlInventory + "/api/ReturnOil/";
  }

  private _strUrlInventory: string = "";
  private _strApiReturnOil: string = "";

  public async GetArrayBranch() {
    let strUrl: string = "";
    strUrl = this._strApiReturnOil + "GetArrayBranch";
    let result: ModelMasBranch[] = null;
    result = await this._http.get<ModelMasBranch[]>(strUrl).toPromise();
    return result;
  }

  public async GetArrayOilTerminal(compCode: string): Promise<ModelMasWarehouse[]> {
    let strUrl: string = "";
    strUrl = this._strApiReturnOil + "GetArrayOilTerminal?CompCode=" + compCode;
    let result: ModelMasWarehouse[] = null;
    result = await this._http.get<ModelMasWarehouse[]>(strUrl).toPromise();
    return result;
  }
  public async GetArrayReason(): Promise<ModelMasReason[]> {
    let strUrl: string = "";
    strUrl = this._strApiReturnOil + "GetArrayReason";
    let result: ModelMasReason[] = null;
    result = await this._http.get<ModelMasReason[]>(strUrl).toPromise();
    return result;
  }
  public async GetArrayReturnOilHeader(param: ModelReturnOilParam): Promise<ModelReturnOilResult> {
    if (param == null) {
      return null;
    }
    let strUrl: string = "";
    strUrl = this._strApiReturnOil + "GetArrayReturnOilHeader";
    let result: ModelReturnOilResult = null;
    result = await this._http.post<ModelReturnOilResult>(strUrl, param).toPromise();
    return result;
  }
  public async GetArrayPoHeader(pStrBrnCode: string): Promise<ModelInfPoHeader[]> {
    pStrBrnCode = (pStrBrnCode || "").toString().trim();
    if (pStrBrnCode === "") {
      return null;
    }
    let strUrl: string = "";
    strUrl = this._strApiReturnOil + "GetArrayPoHeader/" + encodeURI(pStrBrnCode);
    let result: ModelInfPoHeader[] = null;
    result = await this._http.get<ModelInfPoHeader[]>(strUrl).toPromise();
    return result;
  }
  public async GetArrayPoItem(pStrPoNumber: string): Promise<ModelGetArrayPoItemResult> {
    pStrPoNumber = (pStrPoNumber || "").toString().trim();
    if (pStrPoNumber === "") {
      return null;
    }
    let strUrl: string = "";
    strUrl = this._strApiReturnOil + "GetArrayPoItem/" + encodeURI(pStrPoNumber);
    let result: ModelGetArrayPoItemResult = null;
    result = await this._http.get<ModelGetArrayPoItemResult>(strUrl).toPromise();
    return result;
  }
  public async GetArrayReceiveProduct(param: ModelInvReturnOilHd): Promise<ModelInvReceiveProdHd[]> {
    if (param == null) {
      return null;
    }
    let strUrl: string = "";
    strUrl = this._strApiReturnOil + "GetArrayReceiveProduct";
    let result: ModelInvReceiveProdHd[] = null;
    result = await this._http.post<ModelInvReceiveProdHd[]>(strUrl, param).toPromise();
    return result;
  }
  public async GetArrayReceiveProdDt(param: ModelInvReceiveProdHd): Promise<ModelInvReceiveProdDt[]> {
    if (param == null) {
      return null;
    }
    let strUrl: string = "";
    strUrl = this._strApiReturnOil + "GetArrayReceiveProdDt";
    let result: ModelInvReceiveProdDt[] = null;
    result = await this._http.post<ModelInvReceiveProdDt[]>(strUrl, param).toPromise();
    return result;
  }
  public async GetArrayProductWithoutPO(): Promise<ModelInvReceiveProdDt[]> {
    let strUrl: string = "";
    strUrl = this._strApiReturnOil + "GetArrayProductWithoutPO";
    let result: ModelInvReceiveProdDt[] = null;
    result = await this._http.get<ModelInvReceiveProdDt[]>(strUrl).toPromise();
    return result;
  }
  public async GetEmployee(pStrEmpCode: string): Promise<ModelMasEmployee> {
    pStrEmpCode = (pStrEmpCode || "").toString().trim();
    if (pStrEmpCode === "") {
      return;
    }
    let strUrl: string = "";
    strUrl = this._strApiReturnOil + "GetEmployee/" + encodeURI(pStrEmpCode);
    let result: ModelMasEmployee = null;
    result = await this._http.get<ModelMasEmployee>(strUrl).toPromise();
    return result;
  }
  public async GetReturnOil(pStrGuid: string): Promise<ModelReturnOil> {
    pStrGuid = (pStrGuid || "").toString().trim();
    if (pStrGuid === "") {
      return;
    }
    let strUrl: string = "";
    strUrl = this._strApiReturnOil + "GetReturnOil/" + encodeURI(pStrGuid);
    let result: ModelReturnOil = null;
    result = await this._http.get<ModelReturnOil>(strUrl).toPromise();
    return result;
  }
  public async UpdateStatus(param: ModelInvReturnOilHd): Promise<ModelInvReturnOilHd> {
    if (param == null) {
      return null;
    }
    let strUrl: string = "";
    strUrl = this._strApiReturnOil + "UpdateStatus";
    let result: ModelInvReturnOilHd = null;
    result = await this._http.post<ModelInvReturnOilHd>(strUrl, param).toPromise();
    return result;
  }
  public async SaveReturnOil(param: ModelReturnOil): Promise<ModelReturnOil> {
    if (param == null) {
      return null;
    }
    let strUrl: string = "";
    strUrl = this._strApiReturnOil + "SaveReturnOil";
    let result: ModelReturnOil = null;
    result = await this._http.post<ModelReturnOil>(strUrl, param).toPromise();
    return result;
  }
  public async GetArrayProduct(pArrProductId: string[]): Promise<ModelMasProduct[]> {
    if (!Array.isArray(pArrProductId) || !pArrProductId.length) {
      return null;
    }
    let strUrl: string = "";
    strUrl = this._strApiReturnOil + "GetArrayProduct";
    let result: ModelMasProduct[] = null;
    result = await this._http.post<ModelMasProduct[]>(strUrl, pArrProductId).toPromise();
    return result;
  }
}
