import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModelMasSupplier, ModelMasSupplierProduct } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ModelGetSupplierListParam, ModelGetSupplierListResult, ModelSupplier } from './ModelSupplier';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor(
    private _svDefault : DefaultService,
    private _svShare : SharedService,
    private _http : HttpClient,
  ) { }

  public async CheckDuplicateCode(pStrSubCode : string) : Promise<boolean>{
    pStrSubCode = this._svDefault.GetString(pStrSubCode);
    if(pStrSubCode === ""){
      return false;
    }
    let strUrl : string = "";
    strUrl = this._svDefault.GetString(this._svShare.urlMas)
      + "/api/Supplier/CheckDuplicateCode/"
      + pStrSubCode;
    let apiResult : boolean = false;
    apiResult = await this._http.get<boolean>(strUrl).toPromise();
    let result : boolean = false;
    result = !!apiResult
    return result;
  }

  public async GetSupplier(pStrGuid : string) : Promise<ModelSupplier>{
    let result : ModelSupplier = null;
    result = new ModelSupplier();
    pStrGuid = this._svDefault.GetString(pStrGuid);
    if(pStrGuid === ""){
      return result;
    }
    let strUrl : string = "";
    strUrl = this._svDefault.GetString(this._svShare.urlMas)
      + "/api/Supplier/GetSupplier/"
      + pStrGuid;
    let apiResult : ModelSupplier = null;
    apiResult = await this._http.get<ModelSupplier>(strUrl).toPromise();
    result = this.CloneSupplier(apiResult);
    return result;
  }
  public async UpdateStatus(param : ModelMasSupplier) : Promise<ModelMasSupplier>{
    let result : ModelMasSupplier;
    result = new ModelMasSupplier();
    if(param == null){
      return result;
    }
    let strUrl : string = "";
    strUrl = this._svDefault.GetString(this._svShare.urlMas)
      + "/api/Supplier/UpdateStatus/"
    let apiResult : ModelMasSupplier = null;
    apiResult = await this._http.post<ModelMasSupplier>(strUrl , param).toPromise();
    if(apiResult == null){
      return result;
    }
    this._svDefault.CopyObject(apiResult , result);
    return result;
  }
  public CloneSupplier(param : ModelSupplier){
    let result = new ModelSupplier();
    if(param == null){
      return result;
    }
    if( param.hasOwnProperty("Supplier")){
      this._svDefault.CopyObject(param.Supplier , result.Supplier);
    }
    if(this._svDefault.IsArray(param.ArrSupProduct)){
      result.ArrSupProduct = param.ArrSupProduct.map(x=>{
        let pu = new ModelMasSupplierProduct();
        this._svDefault.CopyObject(x , pu);
        return pu;
      });
    }
    return result;
  }
  public CloneSupplierList(param : ModelGetSupplierListResult){
    let result = new ModelGetSupplierListResult();
    if(param == null){
      return result;
    }
    if( param.hasOwnProperty("TotalItem")){
      result.TotalItem = param.TotalItem;
    }
    if(this._svDefault.IsArray(param.ArrSuplier)){
      result.ArrSuplier = param.ArrSuplier.map(x=>{
        let pu = new ModelMasSupplier();
        this._svDefault.CopyObject(x , pu);
        return pu;
      });
    }
    return result;
  }
  //InsertSupplier
  public async InsertSupplier(param :ModelSupplier) : Promise<ModelSupplier>{
    let result : ModelSupplier = null;
    result = new ModelSupplier();
    if(param == null){
      return result;
    }
    let strUrl : string = "";
    strUrl = this._svDefault.GetString(this._svShare.urlMas)
      + "/api/Supplier/InsertSupplier/"
    let apiResult : ModelSupplier = null;
    apiResult = await this._http.post<ModelSupplier>(strUrl , param).toPromise();
    if(apiResult == null){
      return result;
    }
    result = this.CloneSupplier(apiResult);
    return result;

  }

  public async UpdateSupplier(param :ModelSupplier) : Promise<ModelSupplier>{
    let result : ModelSupplier = null;
    result = new ModelSupplier();
    if(param == null){
      return result;
    }
    let strUrl : string = "";
    strUrl = this._svDefault.GetString(this._svShare.urlMas)
      + "/api/Supplier/UpdateSupplier/"
    let apiResult : ModelSupplier = null;
    apiResult = await this._http.post<ModelSupplier>(strUrl , param).toPromise();
    if(apiResult == null){
      return result;
    }
    result = this.CloneSupplier(apiResult);
    return result;
  }

  public async GetSupplierList(param : ModelGetSupplierListParam) : Promise<ModelGetSupplierListResult>{
    let result : ModelGetSupplierListResult = null;
    result = new ModelGetSupplierListResult();
    if(param == null){
      return result;
    }
    let strUrl : string = "";
    strUrl = this._svDefault.GetString(this._svShare.urlMas)
      + "/api/Supplier/GetSupplierList/";
    let apiResult : ModelGetSupplierListResult = null;
    apiResult = await this._http.post<ModelGetSupplierListResult>(strUrl , param).toPromise();
    result = this.CloneSupplierList(apiResult);
    return result;
  }
}
