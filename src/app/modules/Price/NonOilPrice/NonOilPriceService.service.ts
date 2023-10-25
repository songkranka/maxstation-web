import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModelMasProduct, ModelPriNonoilDt, ModelPriNonoilHd } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ModelNonOilDetail, ModelNonOilPrice, ModelNonOilPriceParam, ModelNonOilPriceResult } from './ModelNonOilPrice';

@Injectable({
  providedIn: 'root'
})
export class NonOilPriceService {
  private _strUrl : string = "";

  constructor(
    private _svShared : SharedService,
    private _svDefault : DefaultService,
    private _http : HttpClient,
  ) { 
    this._strUrl = _svDefault.GetString( _svShared.urlPrice) + "/api/NonOilPrice/";
  }
  
  public async GetArrayHeader(param : ModelNonOilPriceParam) {
    if(param == null){
      return null;
    }
    let result = await this._http.post<ModelNonOilPriceResult>(this._strUrl + "GetArrayHeader" , param).toPromise();
    return result;
  }
  public async GetNonOilProduct(){
    let result = await this._http.get<ModelMasProduct[]>(this._strUrl + "GetNonOilProduct").toPromise();
    return result;
  }

  public async GetNonOilPriceDetail(param : ModelPriNonoilDt){
    let result = await this._http.post<ModelPriNonoilDt>(this._strUrl + "GetNonOilPriceDetail" , param).toPromise();
    return result;
  }

  public async SaveNonOil(pHeader : ModelPriNonoilHd , pArrDetail : ModelNonOilDetail[]){
    if(pHeader == null || !this._svDefault.IsArray(pArrDetail)){
      return null;
    }
    let arrDetail = pArrDetail.map(x=> x.ArrayBranch.map(y=><ModelPriNonoilDt>{
      AdjustPrice : y.AdjustPrice,
      BeforePrice : y.BeforePrice,
      BrnCode : y.BrnCode,
      CompCode : pHeader.CompCode,
      CurrentPrice : y.CurrentPrice,
      DocNo : pHeader.DocNo,
      PdId : x.PdId,
      UnitBarcode : x.UnitId
    })).reduce((a, b) => [...a,...b], []);
    let param = <ModelNonOilPrice>{
      ArrDetail : arrDetail,
      Header : pHeader
    };
    let result = await this._http.post<ModelNonOilPrice>(this._strUrl + "SaveNonOil" , param).toPromise();
    return result;
  }

  public async GetNonOilPrice(pStrGuid : string){
    pStrGuid = pStrGuid || "";
    if(pStrGuid === ""){
      return null;
    }
    let result = await this._http.get<ModelNonOilPrice>(this._strUrl + "GetNonOilPrice/" + pStrGuid).toPromise();
    return result;
  }
  public async CancelNonOil(pHeader : ModelPriNonoilHd){
    if(pHeader == null){
      return null;
    }
    let result = await this._http.post<ModelPriNonoilHd>(this._strUrl + "CancelNonOil" , pHeader).toPromise();
    return result;
  }

  public async GetUnApproveDocument(pStrCompCode : string){
    pStrCompCode = this._svDefault.GetString(pStrCompCode);
    if(pStrCompCode === ""){
      return null;
    }
    let result = await this._http.get<ModelPriNonoilHd>(this._strUrl + "GetNonOilPrice/" + pStrCompCode).toPromise();
    return result;
  }
}
