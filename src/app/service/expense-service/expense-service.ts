import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import { Expense, ExpenseEss, ExpenseHd, ExpenseTable, SaveExpense } from 'src/app/model/finance/expense.interface';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import * as moment from 'moment';

export interface Expensedata<T> {
    items: T[],
    totalItems: number;
    Data: T[],
    StatusCode: string,
    Message: string,
};

@Injectable({
    providedIn: 'root'
})

export class ExpenseService {
    private _strUrlFinance: string = "";
    private _strApiExpense: string = "";

    constructor(
        private _svShared: SharedService,
        private _svDefault: DefaultService,
        private _http: HttpClient,
    ) {
        this._strUrlFinance = (_svShared.urlFinance || "").toString().trim();
        this._strApiExpense = this._strUrlFinance + "/api/Expense/";
    }

    findAll(brncode: string, compcode: string, keyword: string, fromDate: Date, toDate: Date, page: number, size: number): Observable<Expensedata<Expense>> {
        var data =
        {
            "BrnCode": brncode,
            "CompCode": compcode,
            "FromDate": fromDate && moment(fromDate).format('YYYY-MM-DD'),
            "ToDate": toDate && moment(toDate).format('YYYY-MM-DD'),
            "Keyword": keyword,
            "Page": page,
            "ItemsPerPage": size
        }

        return this._http.post(this._strApiExpense + 'List', data).pipe(
            map((withdrawData: Expensedata<Expense>) => withdrawData),
            catchError(err => throwError(err))
        )
    }

    public async GetDocPattern(compCode: string, brnCode: string, docType: string, docDate: string) {
        let strUrl = this._strApiExpense + "GetMasDocPattern/" + encodeURI(compCode) + "/" + encodeURI(brnCode) + "/" + encodeURI(docType) + "/" + encodeURI(docDate);
        return await this._http.get<string>(strUrl).toPromise();
    }

    public async GetMasExpenseTable(status: string, compCode: string, brnCode: string, locCode: string, docNo: string) {
        let strUrl = this._strApiExpense + "GetMasExpenseTable/" + encodeURI(status) + "/" + encodeURI(compCode) + "/" + encodeURI(brnCode) + "/" + encodeURI(locCode) + "/" + encodeURI(docNo);
        let result: ExpenseTable[] = null;
        result = await this._http.get<ExpenseTable[]>(strUrl).toPromise();
        return result;
    }

    public async GetExpenseHd(compCode: string, brnCode: string, locCode: string, guid: string) {
        let strUrl = this._strApiExpense + "GetExpenseHd/" + encodeURI(compCode) + "/" + encodeURI(brnCode) + "/" + encodeURI(locCode) + "/" + encodeURI(guid);
        var result = await this._http.get<ExpenseHd[]>(strUrl).toPromise();
        return result;
    }

    public async GetExpenseEssTable(compCode: string, brnCode: string, locCode: string, docNo: string) {
        let strUrl = this._strApiExpense + "GetExpenseEssTable/" + encodeURI(compCode) + "/" + encodeURI(brnCode) + "/" + encodeURI(locCode) + "/" + encodeURI(docNo);
        var result = await this._http.get<ExpenseEss[]>(strUrl).toPromise();
        return result;
    }

    // public async SaveData(param: SaveExpense): Promise<ExpenseTable> {
    //     if (param == null) {
    //         return null;
    //     }
    //     let strUrl = this._strApiExpense + "SaveExpense";
    //     let result: ExpenseTable = null;
    //     result = await this._http.post<ExpenseTable>(strUrl, param).toPromise();
    //     return result;
    // }
    public async SaveData(pQuery: SaveExpense) {
        let strUrl = (this._strApiExpense || "").toString().trim() + "SaveExpense";
        return await this._http.post(strUrl, pQuery).pipe(
            map((expenseData: Expensedata<ExpenseTable>) => expenseData),
            catchError((error: HttpErrorResponse) => {
                let errorMessage = '';
                if (error.error instanceof ErrorEvent) {
                    errorMessage = 'Error:' + error.error.message;
                } else {
                    errorMessage = 'Message:' + error.error.messages;
                }
                return throwError(errorMessage);
            })
        ).toPromise()
    }

    public async UpdateStatus(pQuery: ExpenseHd) {
        let strUrl = (this._strApiExpense || "").toString().trim() + "UpdateStatus";
        return await this._http.post(strUrl, pQuery).pipe(
            map((expenseData: Expensedata<ExpenseTable>) => expenseData),
            catchError((error: HttpErrorResponse) => {
                let errorMessage = '';
                if (error.error instanceof ErrorEvent) {
                    errorMessage = 'Error:' + error.error.message;
                } else {
                    errorMessage = 'Message:' + error.error.messages;
                }
                return throwError(errorMessage);
            })
        ).toPromise()
    }
}

