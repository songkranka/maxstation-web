import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { ModelMasBranch } from 'src/app/model/ModelScaffold';
import { BranchMasterService } from 'src/app/service/branch-service/branch-master-service';
import { DefaultService } from 'src/app/service/default.service';
import { ShareDataService } from 'src/app/shared/shared-service/data.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ModelBranchParam, ModelBranchResult } from '../BranchModel';

@Component({
  selector: 'app-branch-tank-list',
  templateUrl: './branch-tank-list.component.html',
  styleUrls: ['./branch-tank-list.component.scss']
})
export class BranchTankListComponent implements OnInit {
  filterValue: string = null;
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<ModelMasBranch>();
  pageEvent: PageEvent;
  displayedColumns: string[] = ['no', 'brnCode', 'brnName', 'fullAddress', 'phone'];
  no = 0;
  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  private _strBrnCode: string = "";
  private _strCompCode: string = "";
  private _strLocCode: string = "";
  public authPositionRole: any;

  constructor(
    private branchservice: BranchMasterService,
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
    this._strLocCode = (this._svShared.locCode || "").toString().trim();
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
    let param: ModelBranchParam = null;
    param = new ModelBranchParam();
    param.Page = numPage;
    param.ItemsPerPage = this.pageSize;
    param.BrnCode = this._strBrnCode;
    param.CompCode = this._strCompCode;
    param.LocCode = this._strLocCode;
    param.Keyword = strKeyWord;
    let apiResult: ModelBranchResult = null;
    apiResult = await this.branchservice.GetArrayBranchHeader(param);

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
    this._router.navigate(['/BranchTank/New']);
  }

}
