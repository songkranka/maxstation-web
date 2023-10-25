import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { SharedService } from 'src/app/shared/shared.service';
import { Observable, throwError } from 'rxjs';
import { Menu } from 'src/app/model/menu.interface';

export interface MenuData<T> {
  Data: T[]
};

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(
    private _svShare: SharedService,
    private _http: HttpClient,
  ) { }

  public GetMenu(compCode: string, brnCode: string): Observable<MenuData<Menu>> {
    compCode = (compCode || "").toString().trim();
    brnCode = (brnCode || "").toString().trim();
    if (compCode === "" || brnCode === "") {
      return;
    }

    compCode = encodeURI(compCode);
    brnCode = encodeURI(brnCode);

    let strUrl = (this._svShare.urlMas || "").toString().trim() +`/api/Menu/FindByCompCodeAndBranchCode/${compCode}/${brnCode}`;
    
    return  this._http.get(strUrl).pipe(
      map((menuData: MenuData<Menu>) => menuData),
      catchError(err => throwError(err))
    )
  }

}
