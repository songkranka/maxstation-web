import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModelMasBranch, ModelMasProductPrice, ModelOilStandardPriceDt, ModelOilStandardPriceHd } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import Swal from 'sweetalert2';
import { ModelStandardPrice, ModelStandardPriceParam, ModelStandardPriceProduct, ModelStandardPriceResult } from './ModelStandardPrice';

@Injectable({
  providedIn: 'root'
})
export class StandardPriceService {
  constructor(
    private _svShared : SharedService ,
    private _svDefault : DefaultService ,
    private _http : HttpClient
  ) { 
    this._strUrl = _svDefault.GetString(_svShared.urlPrice);
    if(this._strUrl !== ""){
      this._strUrl += "/Api/StandardPrice/";
    }else{
      Swal.fire("Url Of Api Price is Empty" , "" , "error");
    }
  }
  private _strUrl : string = "";
  public async GetArrayHeader(pInput :  ModelStandardPriceParam ) : Promise<ModelStandardPriceResult>{
    if(this._strUrl === "" || pInput == null){
      return null;
    }
    let strUrl = this._strUrl + "GetArrayHeader";
    let result : ModelStandardPriceResult = null;
    result = await this._http.post<ModelStandardPriceResult>(strUrl , pInput).toPromise();
    return result;
  }
  public async SaveStandardPrice(pInput : ModelStandardPrice) : Promise<string>{
    if(this._strUrl === "" || pInput == null){
      return "";
    }
    let strUrl = this._strUrl + "SaveStandardPrice";
    let result : string = "";
    result = await this._http.post<string>(strUrl , pInput).toPromise();
    return result;
  }
  public async GetArrayProduct(pInput : ModelMasProductPrice) : Promise<ModelStandardPriceProduct>{
    if(this._strUrl === "" || pInput == null){
      return null;
    }
    let strUrl = this._strUrl + "GetArrayProduct";
    let result : ModelStandardPriceProduct = null;
    result = await this._http.post<ModelStandardPriceProduct>(strUrl , pInput).toPromise();
    return result;
  }
  public async UpdateStatus(pInput : ModelOilStandardPriceHd) : Promise<string>{
    if(this._strUrl === "" || pInput == null){
      return "";
    }
    let strUrl = this._strUrl + "UpdateStatus";
    let result : string = "";
    result = await this._http.post<string>(strUrl , pInput).toPromise();
    return result;
  }
  public async GetStandardPrice(pStrGuid : string) : Promise<ModelStandardPrice>{
    if(this._strUrl === ""){
      return null;
    }
    pStrGuid = this._svDefault.GetString(pStrGuid);
    if(pStrGuid === ""){
      return null;
    }
    pStrGuid = encodeURI(pStrGuid);
    let strUrl = this._strUrl + "GetStandardPrice/" + pStrGuid;
    let result : ModelStandardPrice = null;
    result = await this._http.get<ModelStandardPrice>(strUrl).toPromise();
    return result;
  }
  public async GetArrayBranch(pStrComcode : string): Promise<ModelMasBranch[]>{
    if(this._strUrl === ""){
      return null;
    }
    pStrComcode = this._svDefault.GetString(pStrComcode);
    pStrComcode = encodeURI(pStrComcode);
    let strUrl = this._strUrl + "GetArrayBranch";
    if(pStrComcode !== ""){
      strUrl += "/" + pStrComcode;
    }
    let result : ModelMasBranch[] = null;
    result = await this._http.get<ModelMasBranch[]>(strUrl).toPromise();
    return result;
  }

  public async GetArrayStandardPriceDetail(pStrCompCode : string , pStrBrnCode : string): Promise<ModelOilStandardPriceDt[]>{
    pStrCompCode = encodeURI(pStrCompCode);
    pStrBrnCode = encodeURI(pStrBrnCode);
    let strUrl = this._strUrl + `GetArrayStandardPriceDetail/${pStrCompCode}/${pStrBrnCode}`;
    let result : ModelOilStandardPriceDt[] = null;
    result = await this._http.get<ModelOilStandardPriceDt[]>(strUrl).toPromise();
    return result;
  }
  public async GetUnApproveDocument(pStrCompCode : string){
    pStrCompCode = this._svDefault.GetString(pStrCompCode);
    if(pStrCompCode === ""){
      return null;
    }
    pStrCompCode = encodeURI(pStrCompCode);
    let strUrl = this._strUrl + `GetUnApproveDocument/${pStrCompCode}`;
    let result : ModelOilStandardPriceHd = null;
    result = await this._http.get<ModelOilStandardPriceHd>(strUrl).toPromise();
    return result;
  }
}