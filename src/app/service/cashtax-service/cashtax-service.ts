import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Cashtax } from 'src/app/model/cashtax.interface';
import { SharedService } from 'src/app/shared/shared.service';
import { ModelCashTax, ModelCashTaxCancelAndReplace, } from 'src/app/modules/Sale/CashTax/ModelCashTax';
import { ModelFinBalance, ModelMasCustomer } from 'src/app/model/ModelScaffold';
import { DefaultService } from '../default.service';

export interface CashtaxData<T> {
  items: T[],
  Data: T[],
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;

  links: {
    first: string;
    previous: string;
    next: string;
    last: string;
  }
};

@Injectable({
  providedIn: 'root'
})

export class CashtaxService {
  constructor(private http: HttpClient, private sharedService: SharedService, private _svDefault: DefaultService) { }

  findAll(brncode: string, compcode: string, keyword: string, fromDate: Date, toDate: Date, page: number, size: number): Observable<CashtaxData<Cashtax>> {
    var data =
    {
      "BrnCode": brncode,
      "CompCode": compcode,
      "FromDate": this._svDefault.GetFormatDate(fromDate),
      "ToDate": this._svDefault.GetFormatDate(toDate),
      "Keyword": keyword,
      "Page": page,
      "ItemsPerPage": size
    }
    this.sharedService.urlSale;
    return this.http.post(this.sharedService.urlSale + '/api/CashTax/GetCashTaxHdList', data).pipe(
      map((cashsaleData: CashtaxData<Cashtax>) => cashsaleData),
      catchError(err => throwError(err))
    )
  }

  async CancelAndReplaceAsync(param: ModelCashTaxCancelAndReplace): Promise<ModelCashTaxCancelAndReplace> {
    if (param == null || param.CancelCashTax == null || param.NewCashTax == null) {
      return null;
    }
    let strUrl = (this.sharedService.urlSale || "").toString().trim() + '/api/CashTax/CancelAndReplace';
    let result = <ModelCashTaxCancelAndReplace>await this.http.post(strUrl, param).toPromise();
    return result;
  }

  async GetFinBalanceByCashTax(pCashTax: ModelCashTax): Promise<ModelFinBalance> {
    if (pCashTax == null) {
      return null;
    }

    let data = {
      "BrnCode": pCashTax.BrnCode,
      "CompCode": pCashTax.CompCode,
      "LocCode": pCashTax.LocCode,
      "DocNo": pCashTax.DocNo
    };
    let strUrl = (this.sharedService.urlSale || "").toString().trim() + '/api/CashTax/GetFinBalanceByCashTax';
    let result = <ModelFinBalance>await this.http.post(strUrl, data).toPromise();
    return result;
  }

  async GetCustomerByCustCode(custCode: string): Promise<ModelMasCustomer> {
    if (custCode == null) {
      return null;
    }

    let data = {
      "CustCode": custCode,
    };
    let strUrl = (this.sharedService.urlSale || "").toString().trim() + '/api/CashTax/GetCustomerByCustCode';
    let result = <ModelMasCustomer>await this.http.post(strUrl, data).toPromise();
    return result;
  }
}