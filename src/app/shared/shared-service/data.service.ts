import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ModelSysMenu } from 'src/app/model/ModelScaffold';

@Injectable()
export class ShareDataService {
  private menuData$ = new BehaviorSubject<any>({});
  selectedMenuData$ = this.menuData$.asObservable();
  
  private menuDataList$ = new BehaviorSubject<ModelSysMenu[]>([]);
  dataList$ = this.menuDataList$.asObservable();

  constructor() {}

  setMenuData(menuData: any) {
    this.menuData$.next(menuData);
  }

  setMenuDataList(menuDatas: ModelSysMenu[]) {
    this.menuDataList$.next(menuDatas);
  }
}