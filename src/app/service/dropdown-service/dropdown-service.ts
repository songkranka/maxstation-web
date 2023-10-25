import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Dropdown } from 'src/app/model/dropdown/dropdown.interface';
import { SharedService } from 'src/app/shared/shared.service';

export interface DropdownData<T> {
    items: T[],
};

@Injectable({
    providedIn: 'root'
})

export class DropDownService {
    constructor(private http: HttpClient, private sharedService: SharedService,) { }

    findCustomerCars(customerCode: string): Observable<DropdownData<Dropdown>> {
        var data =
        {
            "customerCode": customerCode
        }
        return this.http.post(this.sharedService.urlMas + '​/api/Dropdown/GetCustomerCars', data).pipe(
            map((dropdownData: DropdownData<Dropdown>) => dropdownData),
            catchError(err => throwError(err))
        )
    }
}