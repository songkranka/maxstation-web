import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { ModelInvUnuseHd, ModelMasEmployee } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ModelUnusableParam, ModelUnusableResult } from '../ModelUnusable';
import { UnusableService } from '../Unusable.service';

@Component({
  selector: 'app-UnusableList',
  templateUrl: './UnusableList.component.html',
  styleUrls: ['./UnusableList.component.scss']
})
export class UnusableListComponent implements OnInit {

  constructor(
    private _svUnusable: UnusableService,
    private _svShared: SharedService,
    public SvDefault: DefaultService,
    private authGuard: AuthGuard,
  ) {

  }
  filterValue: string = null;
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<ModelInvUnuseHd>();
  pageEvent: PageEvent;
  displayedColumns: string[] = ['no', 'docno', 'docdate', 'user', 'actiondate', 'docstatus'];
  no = 0;
  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  private _strBrnCode: string = "";
  private _strCompCode: string = "";
  private _strLocCode: string = "";
  private _arrEmployee: ModelMasEmployee[] = null;
  private authPositionRole: any;

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  async ngOnInit() {
    this.authPositionRole = this.SvDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }
    let dateStart = new Date(new Date(this._svShared.systemDate).setDate(new Date(this._svShared.systemDate).getDate() - 1));
    let dateEnd = new Date(this._svShared.systemDate);
    this.dateRange.get('start').setValue(dateStart);
    this.dateRange.get('end').setValue(dateEnd);
    this.SvDefault.DoActionAsync(async () => await this.start(), true);
  }
  private async start() {
    if (!await this.SvDefault.CheckSession()) {
      return
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
    this._arrEmployee = [];
    this.length = 0;
    let numPage: number = pNumPage || 1;
    let strKeyWord: string = (this.filterValue || "").toString().trim();
    let param: ModelUnusableParam = null;
    param = new ModelUnusableParam();
    param.Page = numPage;
    param.ItemsPerPage = this.pageSize;
    param.BrnCode = this._strBrnCode;
    param.CompCode = this._strCompCode;
    param.LocCode = this._strLocCode;
    param.Keyword = strKeyWord;
    param.FromDate = <any>this.SvDefault.GetFormatDate(<any>this.dateRange?.value?.start);
    param.ToDate = <any>this.SvDefault.GetFormatDate(<any>this.dateRange?.value?.end);
    let apiResult: ModelUnusableResult = null;
    apiResult = await this._svUnusable.GetArrayHeader(param);
    if (apiResult != null) {
      this.dataSource.data = apiResult.ArrayHeader;
      this._arrEmployee = apiResult.ArrayEmployee;
      this.length = apiResult.TotalItems;
    }

  }
  public GetEmployeeName(pHeader: ModelInvUnuseHd) {
    let result: string;
    let funGetEmployeeName: () => void = null;
    funGetEmployeeName = () => {
      result = this.getEmployeeName(pHeader);
    }
    this.SvDefault.DoAction(funGetEmployeeName);
    return result;

  }
  private getEmployeeName(pHeader: ModelInvUnuseHd) {
    if (pHeader == null) {
      return "";
    }
    let strEmpCode: string = "";
    strEmpCode = (pHeader.UpdatedBy || pHeader.CreatedBy || "").toString().trim();
    if (strEmpCode === ""
      || !Array.isArray(this._arrEmployee)
      || !this._arrEmployee.length) {
      return "";
    }
    let employee: ModelMasEmployee = null;
    employee = this._arrEmployee.find(x => x.EmpCode === strEmpCode);
    if (employee == null) {
      return strEmpCode;
    }
    let result: string = null;
    result = `${strEmpCode} : ${employee.PrefixThai} ${employee.PersonFnameThai} ${employee.PersonLnameThai}`;
    return result;
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
}
