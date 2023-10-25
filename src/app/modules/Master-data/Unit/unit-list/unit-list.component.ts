import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { ModelMasUnit } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { UnitService } from 'src/app/service/unit-service/unit-service';
import { SharedService } from 'src/app/shared/shared.service';
import { ModelUnitParam, ModelUnitResult } from '../UnitModel';

@Component({
  selector: 'app-unit-list',
  templateUrl: './unit-list.component.html',
  styleUrls: ['./unit-list.component.scss']
})
export class UnitListComponent implements OnInit {
  filterValue: string = null;
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  dataSource = new MatTableDataSource<ModelMasUnit>();
  pageEvent: PageEvent;
  displayedColumns: string[] = ['no', 'unitId', 'unitName', 'unitStatus'];
  no = 0;
  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  private _strBrnCode: string = "";
  private _strCompCode: string = "";
  private _strLocCode: string = "";
  public authPositionRole: any;

  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private unitservice: UnitService,
    private _svShared: SharedService,
    public SvDefault: DefaultService,
    private authGuard: AuthGuard,
    private _router: Router
  ) { }

  async ngOnInit() {
    this.SvDefault.DoActionAsync(async () => await this.start(), true);
  }

  ngAfterViewInit(): void {
    this.SvDefault.DoAction(() => {
      this.dataSource.sort = this.sort;
    });
  }

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  private async start() {
    this.authPositionRole = this.SvDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }

    this._strBrnCode = (this._svShared.brnCode || "").toString().trim();
    this._strCompCode = (this._svShared.compCode || "").toString().trim();
    this._strLocCode = (this._svShared.locCode || "").toString().trim();
    await this.getDataList();
  }

  public async GetDataList() {
    await this.SvDefault.DoActionAsync(async () => await this.getDataList(), true);
  }

  private async getDataList(pNumPage?: number) {
    this.dataSource.data = [];
    this.length = 0;
    let numPage: number = pNumPage || 1;
    let strKeyWord: string = (this.filterValue || "").toString().trim();
    let param: ModelUnitParam = null;
    param = new ModelUnitParam();
    param.Page = numPage;
    param.ItemsPerPage = this.pageSize;
    param.Keyword = strKeyWord;
    let apiResult: ModelUnitResult = null;
    apiResult = await this.unitservice.GetDataList(param);

    if (apiResult != null) {
      this.dataSource.data = apiResult['items'];
      this.length = apiResult['totalItems'];
    }
  }

  async OnPaginateChange(pEvent: PageEvent) {
    await this.SvDefault.DoActionAsync(async () => await this.onPaginateChange(pEvent), true);
  }

  private async onPaginateChange(pEvent: PageEvent) {
    this.no = pEvent.pageIndex > 0 ? pEvent.pageIndex * pEvent.pageSize : 0;
    let page = pEvent.pageIndex;
    this.pageSize = pEvent.pageSize;
    if (this.filterValue == null) {
      page = page + 1;
    }
    await this.getDataList(page);
  }

  public async newDocument(){
    await this.SvDefault.DoActionAsync(async()=> await this.NewDocument());
  }

  private async NewDocument(){
    this._router.navigate(['/Unit/New']);
  }
}
