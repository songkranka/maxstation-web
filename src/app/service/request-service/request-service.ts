import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Request } from 'src/app/model/request.interface';
import { SharedService } from 'src/app/shared/shared.service';

export interface RequestData<T> {
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

  export class RequestService {
    constructor(private http: HttpClient, private sharedService: SharedService,) { }
    findAll(brncode: string, compcode: string, Loccode: string, keyword: string, fromDate: Date, toDate: Date, page: number, size: number): Observable<RequestData<Request>> {
      var data =
        {
          "BrnCode": brncode,
          "CompCode": compcode,
          "LocCode": Loccode,
          "ToDate": toDate,
          "Keyword" : keyword,
          "Skip": page || 1,
          "Take": size,
          "FromDate": fromDate
        }
        this.sharedService.urlInv;
        return this.http.post(this.sharedService.urlInv +'/api/Request/GetRequestHdList', data).pipe(
          map((data: RequestData<Request>) => data),
          catchError(err => throwError(err))
        )
      }
    }
