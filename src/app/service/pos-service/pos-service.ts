import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Cash, SaveCashSale } from 'src/app/model/daily-shifting/cash.interface';
import { Credit } from 'src/app/model/daily-shifting/credit.interface';
import { Withdraw } from 'src/app/model/daily-shifting/withdraw.interface';
import { SharedService } from 'src/app/shared/shared.service';
import { ModelDopPosConfig, ModelMasReason } from 'src/app/model/ModelScaffold';
import { DefaultService } from '../default.service';
import { Receive } from 'src/app/model/daily-shifting/receive.interface';

export interface CashData<T> {
    items: T[],
    Data: T[],
    StatusCode: string,
    Message: string,
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;

};

export interface CreditData<T> {
    items: T[],
    Data: T[],
    StatusCode: string,
    Message: string,
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
};

export interface WithdrawData<T> {
    items: T[],
    Data: T[],
    StatusCode: string,
    Message: string,
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
};

export interface ReceiveData<T> {
    items: T[],
    Data: T[],
    StatusCode: string,
    Message: string,
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
};

export interface ReasonData<T> {
    items: T[],
    Data: T[],
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
};

export class GetDopPosConfigParam{
  ArrDocType : string[] = [];
  ArrDocDesc : string[] = [];
}

@Injectable({
    providedIn: 'root'
})

export class PosService {
    constructor(
        private http: HttpClient,
        private sharedService: SharedService,
        private _svDefault : DefaultService ,
    ) { }

    public async FindCashAllApim(fromDate: Date){
      var data =
        {
            "FromDate": fromDate,
            "CompCode": this.sharedService.compCode,
            "BrnCode": this.sharedService.brnCode,
            "LocCode": this.sharedService.locCode
        }
        let strUrl = this._svDefault.GetString(this.sharedService.urlDailyOperationApim)
        + '/api/Pos/GetCashList';
        let result = await this.http.post<CashData<Cash>>(strUrl, data).toPromise();
        return result;
    }

    findCashAll(fromDate: Date): Observable<CashData<Cash>> {
        var data =
        {
            "FromDate": fromDate,
            "CompCode": this.sharedService.compCode,
            "BrnCode": this.sharedService.brnCode,
            "LocCode": this.sharedService.locCode
        }
        return this.http.post(this.sharedService.urlDailyOperation + '/api/Pos/GetCashList', data)
            .pipe(
                map((cashsaleData: CashData<Cash>) => cashsaleData),
                catchError((error: HttpErrorResponse) => {
                    let errorMessage = '';
                    if (error.error instanceof ErrorEvent) {
                        errorMessage = 'Error:' + error.error.message;
                    } else {
                        errorMessage = 'Error Code:' + error.status + '\n Message:' + error.error.message;
                    }
                    return throwError(errorMessage);
                })
            )
    }

    findCreditAll(fromDate: Date): Observable<CreditData<Credit>> {
        var data =
        {
            "FromDate": fromDate,
            "CompCode": this.sharedService.compCode,
            "BrnCode": this.sharedService.brnCode,
            "LocCode": this.sharedService.locCode
        }
        return this.http.post(this.sharedService.urlDailyOperation + '/api/Pos/GetCreditList', data).pipe(
            map((cashsaleData: CreditData<Credit>) => cashsaleData),
            catchError((error: HttpErrorResponse) => {
                let errorMessage = '';
                if (error.error instanceof ErrorEvent) {
                    errorMessage = 'Error:' + error.error.message;
                } else {
                    errorMessage = 'Error Code:' + error.status + '\n Message:' + error.error.message;
                }
                return throwError(errorMessage);
            })
        )
    }

    findWithdrawAll(fromDate: Date): Observable<WithdrawData<Withdraw>> {
        var data =
        {
            "FromDate": fromDate,
            "CompCode": this.sharedService.compCode,
            "BrnCode": this.sharedService.brnCode,
            "LocCode": this.sharedService.locCode
        }
        return this.http.post(this.sharedService.urlDailyOperation + '/api/Pos/GetWithdrawList', data).pipe(
            map((withdrawData: WithdrawData<Withdraw>) => withdrawData),
            catchError((error: HttpErrorResponse) => {
                let errorMessage = '';
                if (error.error instanceof ErrorEvent) {
                    errorMessage = 'Error:' + error.error.message;
                } else {
                    errorMessage = 'Error Code:' + error.status + '\n Message:' + error.error.message;
                }
                return throwError(errorMessage);
            })
        )
    }

    findReceiveAll(fromDate: Date): Observable<ReceiveData<Receive>> {
        var data =
        {
            "FromDate": fromDate,
            "CompCode": this.sharedService.compCode,
            "BrnCode": this.sharedService.brnCode,
            "LocCode": this.sharedService.locCode
        }
        return this.http.post(this.sharedService.urlDailyOperation + '/api/Pos/GetReceiveList', data).pipe(
            map((receiveData: ReceiveData<Receive>) => receiveData),
            catchError((error: HttpErrorResponse) => {
                let errorMessage = '';
                if (error.error instanceof ErrorEvent) {
                    errorMessage = 'Error:' + error.error.message;
                } else {
                    errorMessage = 'Error Code:' + error.status + '\n Message:' + error.error.message;
                }
                return throwError(errorMessage);
            })
        )
    }

    async GetDopPosConfig(param : GetDopPosConfigParam){
      if(param == null){
        return null;
      }
      let strUrl = this._svDefault.GetString(this.sharedService.urlDailyAks)
        + "/api/Pos/GetDopPosConfig";
      let result = await this.http.post<ModelDopPosConfig[]>(strUrl , param).toPromise();
      return result;
    }
}
