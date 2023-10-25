import { Component, OnInit, ViewChild } from '@angular/core';
import { ModelMasCostCenter } from 'src/app/model/ModelScaffold';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormControl, FormGroup } from '@angular/forms';
import { ModelCostCenterParam, ModelCostCenterResult } from '../../CostCenter/CostCenterModel';
import { SharedService } from 'src/app/shared/shared.service';
import { DefaultService } from 'src/app/service/default.service';
import { ShareDataService } from 'src/app/shared/shared-service/data.service';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { Router } from '@angular/router';
import { CostCenterMasterService } from 'src/app/service/costcenter-service/costcenter-master-service';

@Component({
  selector: 'app-CostCenterList',
  templateUrl: './CostCenterList.component.html',
  styleUrls: ['./CostCenterList.component.scss']
})
export class CostCenterListComponent implements OnInit {
  filterValue: string = null;
  brnCodeValue: string = null;
  brnNameValue: string = null;
  mapBrnCodeValue: string = null;
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<ModelMasCostCenter>();
  pageEvent: PageEvent;
  displayedColumns: string[] = ['no', 'brnCode', 'brnName', 'costCenter', 'profitCenter', 'brnStatus'];
  no = 0;
  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  private _strBrnCode: string = "";
  private _strCompCode: string = "";
  public authPositionRole: any;
  
  constructor(
    private CostCenterService: CostCenterMasterService,
    private _svShared: SharedService,
    public SvDefault: DefaultService,
    private shareDataService: ShareDataService,
    private authGuard: AuthGuard,
    private _router: Router
  ) { }

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  async ngOnInit() {
    this.SvDefault.DoActionAsync(async () => await this.start(), true);
  }

  private async start() {
    this.authPositionRole = this.SvDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }

    this._strBrnCode = (this._svShared.brnCode || "").toString().trim();
    this._strCompCode = (this._svShared.compCode || "").toString().trim();
    await this.getArrayHeader();
  }

  ngAfterViewInit(): void {
    this.SvDefault.DoAction(() => {
      this.dataSource.sort = this.sort;
    });
  }

  public async GetArrayHeader() {
    await this.SvDefault.DoActionAsync(async () => await this.getArrayHeader(), true);
  }

  private async getArrayHeader(pNumPage?: number) {
    this.dataSource.data = [];
    this.length = 0;
    let numPage: number = pNumPage || 1;
    let strKeyWord: string = (this.filterValue || "").toString().trim();
    let param: ModelCostCenterParam = null;
    param = new ModelCostCenterParam();
    param.Page = numPage;
    param.ItemsPerPage = this.pageSize;
    param.BrnCode = this._strBrnCode;
    param.CompCode = this._strCompCode;
    param.Keyword = strKeyWord;
    let apiResult: ModelCostCenterResult = null;
    apiResult = await this.CostCenterService.GetArrayCostcenterHeader(param);

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
    await this.getArrayHeader(page);
  }

  public async newDocument(){
    await this.SvDefault.DoActionAsync(async()=> await this.NewDocument());
  }

  private async NewDocument(){
    this._router.navigate(['/CostCenter/New']);
  }

}

