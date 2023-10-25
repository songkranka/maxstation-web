import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Receive } from 'src/app/model/receive.interface';
import { SharedService } from 'src/app/shared/shared.service';
import { ModelFinReceiveHd, ModelFinReceivePay, ModelMasMapping } from 'src/app/model/ModelScaffold';
import { DefaultService } from '../default.service';

export interface ReceiveData<T> {
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

  export class ReceiveService {
    constructor(private http: HttpClient, private sharedService: SharedService, private _svDefault: DefaultService) { }
      findAll(brncode: string, compcode: string, Loccode: string, keyword: string, fromDate: Date, toDate: Date, page: number, size: number): Observable<ReceiveData<Receive>> {
        var data =
        {
          "BrnCode": brncode,
          "CompCode": compcode,
          "LocCode": Loccode,
          "ToDate": this._svDefault.GetFormatDate(toDate),
          "Keyword" : keyword,
          "Page": page || 1,
          "ItemsPerPage": size,
          "FromDate": this._svDefault.GetFormatDate(fromDate)
        }
        return this.http.post(this.sharedService.urlFinance +'/api/Receive/GetReceiveHdList', data).pipe(
          map((receiveData: ReceiveData<Receive>) => receiveData),
          catchError(err => throwError(err))
        )
      }

      async GetFinReceivePays(pInput : ModelFinReceiveHd):Promise<ModelFinReceivePay[]>{
        if(pInput == null){
          return null;
        }
        let strUrl = (this.sharedService.urlFinance || "").toString().trim() + "/api/Receive/GetFinReceivePays";
        let result : ModelFinReceivePay[] = null;
        result = <ModelFinReceivePay[]>await this.http.post(strUrl , pInput).toPromise();
        return result;
      }

      async GetMasMapping(){
        let strUrl = (this.sharedService.urlFinance || "").toString().trim() + "/api/Receive/GetMasMapping";
        let result  = await this.http.get<ModelMasMapping[]>(strUrl ).toPromise();
        return result;
      }

      public GetReportReceivePay(pStrCompCode: string, pStrBrnCode: string, pStrDocNo: string) {
        let request = {
          "CompCode": pStrCompCode,
          "BrnCode": pStrBrnCode,
          "DocNo": pStrDocNo,
        }    
        let headers = new HttpHeaders()
        let strUrl = (this.sharedService.urlViewer || "").toString().trim() + "/ReceivePay/PrintReceivePay";
        this.http.post(strUrl, request, {
          responseType: 'arraybuffer', headers: headers
        }
        ).subscribe(response => this._svDefault.DownLoadFile('รายงานรับชำระ.pdf', response, "application/octet-stream"));
      }

    }
