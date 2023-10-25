import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { async } from 'rxjs/internal/scheduler/async';
import { QueryResultResource } from 'src/app/model/ModelDashboard';
import { ModelMasProduct, ModelMasProductGroup, ModelMasProductUnit, ModelMasUnit } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ModelProduct } from './ModelProduct';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

constructor(
  private  _svShared : SharedService,
  private _svDefault : DefaultService,
  private _http : HttpClient,
) { }

async GetArrProduct(keyword: string, page: number, size: number){
  var data =
  {
    "Keyword": keyword,
    "Page": page,
    "ItemsPerPage": size,
  }
  let strUrl = this._svDefault.GetString( this._svShared.urlMas) + '/api/Product/FindAll';
  let result = await  this._http.post<QueryResultResource<ModelMasProduct>>(strUrl , data).toPromise();
  if(result != null && this._svDefault.IsArray(result.items)){
    result.items = result.items.map(x=> {
      let pd = new ModelMasProduct();
      this._svDefault.CopyObject(x , pd);
      return pd;
    });
  }
  return result;
}

async GetArrProductGroup(){
  let strUrl = this._svDefault.GetString( this._svShared.urlMas) + '/api/ProductGroup/GetProductGroupList';
  let apiResult = await this._http.post(strUrl , {}).toPromise();
  let result : ModelMasProductGroup[] = null;
  if(apiResult != null
    && apiResult.hasOwnProperty("Data")
    && this._svDefault.IsArray(apiResult["Data"])
  ){
    result = apiResult["Data"].map(x=>{
      let pg = new ModelMasProductGroup();
      this._svDefault.CopyObject(x , pg);
      return pg;
    });
  }
  return result;
}

public async GetProduct(pStrGuid : string) : Promise<ModelProduct>{
  pStrGuid = this._svDefault.GetString(pStrGuid);
  let strUrl = this._svDefault.GetString( this._svShared.urlMas)
    + '/api/Product/GetProduct/' + pStrGuid;
  let apiResult : ModelProduct = null;
  apiResult = await this._http.get<ModelProduct>(strUrl).toPromise();
  let result : ModelProduct;
  result = this.CloneProduct(apiResult);
  return result;
}

public CloneProduct(param : ModelProduct){
  let result = new ModelProduct();
  if(param == null){
    return result;
  }
  if( param.hasOwnProperty("Product")){
    this._svDefault.CopyObject(param.Product , result.Product);
  }
  if(this._svDefault.IsArray(param.ArrProductUnit)){
    result.ArrProductUnit = param.ArrProductUnit.map(x=>{
      let pu = new ModelMasProductUnit();
      this._svDefault.CopyObject(x , pu);
      return pu;
    });
  }
  return result;
}

public async IsDuplicateProductId(pStrProductId : string) : Promise<boolean>{
  pStrProductId = this._svDefault.GetString(pStrProductId);
  let strUrl = this._svDefault.GetString( this._svShared.urlMas)
    + '/api/Product/IsDuplicateProductId/' + pStrProductId;
  let result : boolean = false;
  result = await this._http.get<boolean>(strUrl).toPromise();
  return result;
}
public async GetAllUnit() : Promise<ModelMasUnit[]>{
  let strUrl = this._svDefault.GetString( this._svShared.urlMas)
    + '/api/Product/GetAllUnit';
  let result : ModelMasUnit[] = [];
  let apiResult : ModelMasUnit[] = [];
  apiResult = await this._http.get<ModelMasUnit[]>(strUrl).toPromise();
  if(this._svDefault.IsArray(apiResult)){
    result = apiResult.map(x=>{
      let pu = new ModelMasUnit();
      this._svDefault.CopyObject(x , pu);
      return pu;
    });
  }
  return result;
}
public async InsertProduct(param : ModelProduct) : Promise<ModelProduct>{
  let strUrl = this._svDefault.GetString( this._svShared.urlMas)
    + '/api/Product/InsertProduct';
  let result : ModelProduct = null;
  let apiResult : ModelProduct = null;
  apiResult = await this._http.post<ModelProduct>(strUrl , param).toPromise();
  result = this.CloneProduct(apiResult);
  return result;
}
public async UpdateProduct(param : ModelProduct) : Promise<ModelProduct>{
  let strUrl = this._svDefault.GetString( this._svShared.urlMas)
    + '/api/Product/UpdateProduct';
  let result : ModelProduct = null;
  let apiResult : ModelProduct = null;
  apiResult = await this._http.post<ModelProduct>(strUrl , param).toPromise();
  result = this.CloneProduct(apiResult);
  return result;
}
public async UpdateStatus(param : ModelMasProduct) : Promise<ModelMasProduct>{
  let strUrl = this._svDefault.GetString( this._svShared.urlMas)
    + '/api/Product/UpdateStatus';
  let result : ModelMasProduct = new ModelMasProduct();
  let apiResult : ModelMasProduct = null;
  apiResult = await this._http.post<ModelMasProduct>(strUrl , param).toPromise();
  if(apiResult == null){
    return result;
  }
  this._svDefault.CopyObject(apiResult , result);
  return result;
}

//UpdateStatus
}

