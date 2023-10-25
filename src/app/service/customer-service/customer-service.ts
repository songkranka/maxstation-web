import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Customer } from 'src/app/model/master/customer.interface';
import { SharedService } from 'src/app/shared/shared.service';

export interface CustomerData<T> {
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

  export class CustomerService {
    constructor(private http: HttpClient, private sharedService: SharedService,) { }

    findAll(keyword: string, page: number, size: number , parentName? : string): Observable<CustomerData<Customer>> {
        var data =
        {
          "Keyword" : keyword,
          "Page": page,
          "ItemsPerPage": size,
          "ParentName" : parentName || "",
        }
          this.sharedService.urlSale;
          return this.http.post(this.sharedService.urlMas +'/api/Customer/GetCustomers', data).pipe(
          map((cashsaleData: CustomerData<Customer>) => cashsaleData),
          catchError(err => throwError(err))
        )
      }
  }