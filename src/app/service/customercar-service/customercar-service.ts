import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CompanyCustomerCar } from 'src/app/model/master/companycustomercar.interface';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';

export interface CustomerCardata<T> {
    Data: T[],
    StatusCode: string,
    Message: string,
  };
  
  @Injectable({
    providedIn: 'root'
  })

  export class CustomerCarService {
    private _strUrlMaster : string = "";
    private _strApiBranch : string = "";

    constructor(
        private _svShared : SharedService,
        private _svDefault : DefaultService,
        private _http : HttpClient,
      ) { 
        this._strUrlMaster = (_svShared.urlMas || "").toString().trim() ;
        this._strApiBranch = this._strUrlMaster + "/api/CustomerCar/";
      }

      public async GetCompanyCustomerCar(){
        let strUrl = this._strApiBranch + "GetAllByCompany";
        let result : CompanyCustomerCar[] = null;
        result = await this._http.get<CompanyCustomerCar[]>(strUrl).toPromise();
        return result;
      }
  }

  