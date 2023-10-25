import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModelCustomerCar } from 'src/app/service/creditsale-service/creditsale-service';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ModelCustomer, ModelGetCustomerLisParam, ModelGetCustomerListResult, ModelMasCustomer2, ModelMasCustomerCar2 } from './ModelCustomer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

constructor(
  private _svDefault : DefaultService,
  private _svShare : SharedService,
  private _http : HttpClient,
) { }

public async CheckDuplicateCustCode(pStrCuscode : string){
  pStrCuscode = this._svDefault.GetString(pStrCuscode);
  if(pStrCuscode === ""){
    return false;
  }
  let strUrl = this._svShare.urlMas + "/api/Customer/CheckDuplicateCustCode/" + pStrCuscode;
  let apiResult = await this._http.get<boolean>(strUrl).toPromise();
  let result = !!apiResult
  return result;
}

public async GetCustomerList2(param : ModelGetCustomerLisParam){
  if(param == null){
    return null;
  }
  //GetCustomerList2
  let strUrl = this._svShare.urlMas + "/api/Customer/GetCustomerList2/";
  let apiResult = await this._http.post<ModelGetCustomerListResult>(strUrl,param).toPromise();
  let result = new ModelGetCustomerListResult();
  if(apiResult != null){
    if(apiResult.hasOwnProperty("TotalItem")){
      result.TotalItem = apiResult.TotalItem;
    }
    apiResult.ArrCustomer;
    if(this._svDefault.IsArray(apiResult.ArrCustomer)){
      result.ArrCustomer = apiResult.ArrCustomer.map(x=>{
        let cus = new ModelMasCustomer2();
        this._svDefault.CopyObject(x , cus);
        return cus;
      });
    }
  }
  return result;

}

public async GetCustomer(pStrGuid : string){
  pStrGuid = this._svDefault.GetString(pStrGuid);
  if(pStrGuid === ""){
    return null;
  }
  let strUrl = this._svShare.urlMas + "/api/Customer/GetCustomer/" + pStrGuid;
  let apiResult = await this._http.get<ModelCustomer>(strUrl).toPromise();
  if(apiResult == null){
    return null;
  }
  let result = new ModelCustomer();
  if( apiResult.hasOwnProperty("Customer") && apiResult.Customer != null){
    this._svDefault.CopyObject(apiResult.Customer , result.Customer);
  }
  if(this._svDefault.IsArray(apiResult.ArrCustomerCar)){
    result.ArrCustomerCar = apiResult.ArrCustomerCar.filter(x=> x!= null).map(x=>{
      let car = new ModelMasCustomerCar2();
      this._svDefault.CopyObject(x , car);
      return car;
    });
  }
  return result;
}

public async InsertCustomer(param : ModelCustomer){
  if(param == null){
    return null;
  }
  let strUrl = this._svShare.urlMas + "/api/Customer/InsertCustomer/";
  let result = await this._http.post<ModelCustomer>(strUrl , param).toPromise();
  return result;
}
public async UpdateCustomer(param : ModelCustomer){
  if(param == null){
    return null;
  }
  let strUrl = this._svShare.urlMas + "/api/Customer/UpdateCustomer/";
  let result = await this._http.post<ModelCustomer>(strUrl , param).toPromise();
  return result;
}
public async UpdateStatus(param : ModelMasCustomer2){
  if(param == null){
    return null;
  }
  let strUrl = this._svShare.urlMas + "/api/Customer/UpdateStatus/";
  let result = await this._http.post<ModelMasCustomer2>(strUrl , param).toPromise();
  return result;
}

}
