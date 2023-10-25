import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ModelInvReceiveProdHd, ModelMasSupplier } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import { PoHeaderListQuery, PoItemListResult, QueryResult, ReceiveOilListQuery, ReceiveOilQuery, PoItemListParam } from './ModelReceiveOil';
import { PoHeader2 } from '../../../model/ModelCommon';

export interface ReceiveOilData<T> {
  Data: T[],
  StatusCode: string,
  Message: string,
};

@Injectable({
  providedIn: 'root'
})
export class ReceiveOilService {

  constructor(
    private _svShare: SharedService,
    private _svDefault: DefaultService,
    private _http: HttpClient,
  ) { }

  public async GetPoHeaderList(pQuery: PoHeaderListQuery): Promise<ReceiveOilData<PoHeader2>> {
    let strUrl = (this._svShare.urlInv || "").toString().trim() + "/api/PurchaseOrder/HeaderList";
    return await this._http.post(strUrl, pQuery).pipe(
      map((poHeaderData: ReceiveOilData<PoHeader2>) => poHeaderData),
      catchError(err => throwError(err))
    ).toPromise()
  }

  public async GetPoItemList(param: PoItemListParam): Promise<ReceiveOilData<PoItemListResult>> {
    let strUrl = (this._svShare.urlInv || "").toString().trim() + "/api/PurchaseOrder/DetailList";
    return await this._http.post(strUrl, param).pipe(
      map((poHeaderData: ReceiveOilData<PoItemListResult>) => poHeaderData),
      catchError(err => throwError(err))
    ).toPromise()
  }

  public async GetReceiveOil(pStrGuid: string): Promise<ReceiveOilData<ReceiveOilQuery>> {
    pStrGuid = (pStrGuid || "").toString().trim();
    if (pStrGuid === "") {
      return;
    }

    let strUrl = (this._svShare.urlInv || "").toString().trim() + "/api/ReceiveOil/FindById/" + encodeURI(pStrGuid);
    return await this._http.get(strUrl).pipe(
      map((receiveOilData: ReceiveOilData<ReceiveOilQuery>) => receiveOilData),
      catchError(err => throwError(err))
    ).toPromise()
  }

  public async SaveReceiveOil(pQuery: ReceiveOilQuery) {
    let strUrl = (this._svShare.urlInv || "").toString().trim() + "/api/ReceiveOil/Create";
    return await this._http.post(strUrl, pQuery).pipe(
      map((receiveOilData: ReceiveOilData<ReceiveOilQuery>) => receiveOilData),
      catchError(err => throwError(err))
    ).toPromise()
  }

  public async GetReceiveOilList(pQuery: ReceiveOilListQuery) {
    if (pQuery == null) {
      return null;
    }
    let strUrl = (this._svShare.urlInv || "").toString().trim() + "/api/ReceiveOil/List";
    let result = <QueryResult<ModelInvReceiveProdHd>>await this._http.post(strUrl, pQuery).toPromise();
    return result;
  }
  public async UpdateStatus(pInput: ReceiveOilQuery) {
    if (pInput == null) {
      return null;
    }
    let strUrl = (this._svShare.urlInv || "").toString().trim() + "/api/ReceiveOil/UpdateStatus";
    return await this._http.post(strUrl, pInput).pipe(
      map((receiveOilData: ReceiveOilData<ReceiveOilQuery>) => receiveOilData),
      catchError(err => throwError(err))
    ).toPromise()
  }

  public async GetArraySupplier(): Promise<ModelMasSupplier[]>{
    let strUrl = (this._svShare.urlInv || "").toString().trim() + "/api/ReceiveGas/GetArraySupplier";
    let result : ModelMasSupplier[] = null;
    result = await this._http.get<ModelMasSupplier[]>(strUrl).toPromise();
    return result;
  }
}
