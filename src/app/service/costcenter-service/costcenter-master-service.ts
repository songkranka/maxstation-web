import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ModelCostCenterResource,ModelCostCenterParam,ModelCostCenterResult} from 'src/app/modules/Master-data/CostCenter/CostCenterModel';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ModelMasCostCenter } from 'src/app/model/ModelScaffold';

export interface CostCenterMasterdata<T> {
  Data: T[],
  StatusCode: string,
  Message: string,
};

@Injectable({
  providedIn: 'root'
})

export class CostCenterMasterService {
  private _strUrlMaster : string = "";
  private _strApiCostcenter : string = "";

  constructor(
    private _svShared : SharedService,
    private _svDefault : DefaultService,
    private _http : HttpClient,
  ) { 
    this._strUrlMaster = (_svShared.urlMas || "").toString().trim() ;
    this._strApiCostcenter = this._strUrlMaster + "/api/CostCenter/";
  }
  
  public async GetArrayCostcenterHeader(pInput: ModelCostCenterParam): Promise<ModelCostCenterResult> {
    let strUrl = this._strApiCostcenter + "List";
    return await this._http.post(strUrl, pInput).pipe(
      map((licensePlateData: ModelCostCenterResult) => licensePlateData),
      catchError(err => throwError(err))
    ).toPromise()
  }

  public async SaveData(pQuery: ModelCostCenterResource) {
    let strUrl = (this._strApiCostcenter || "").toString().trim() + "SaveCostCenter";
    return await this._http.post(strUrl, pQuery).pipe(
      map((data: CostCenterMasterdata<ModelCostCenterResource>) => data),
      catchError(err => throwError(err))
    ).toPromise()
  }

  public async GetCostCenterByGuid(guid: string){
    guid = (guid || "").toString().trim();
    if (guid === ""){
      return null;
    }
    let strUrl = (this._strApiCostcenter || "").toString().trim() + "GetCostCenterByGuid/" + encodeURI(guid);
    let result : ModelMasCostCenter[] = null;
    result = await this._http.get<ModelMasCostCenter[]>(strUrl).toPromise();
    return result;
  }

  public async UpdateStatus(pQuery: ModelCostCenterResource) {
    let strUrl = (this._strApiCostcenter || "").toString().trim() + "UpdateStatus";
    return await this._http.post(strUrl, pQuery).pipe(
      map((data: CostCenterMasterdata<ModelCostCenterResource>) => data),
      catchError(err => throwError(err))
    ).toPromise()
  }
}