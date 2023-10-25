import { Component, OnInit, ViewChild } from '@angular/core';
import { async } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModelMasCustomer2 } from 'src/app/model/ModelCommon';
import { ModelInvReturnSupHd, ModelMasEmployee } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ModelSupplierReturn, ModelSupplierReturnResult, ModelSupplierReturnParam } from 'src/app/modules/Inventory/SupplierReturn/ModelSupplierReturn';
import { SupplierReturnService } from 'src/app/service/supplier-return-service/SupplierReturn.service';
import { AuthGuard } from 'src/app/guards/auth-guard.service';

@Component({
  selector: 'app-SupplierReturn-list',
  templateUrl: './SupplierReturn-list.component.html',
  styleUrls: ['./SupplierReturn-list.component.scss']
})
export class SupplierReturnListComponent implements OnInit {

  constructor(
    private _svShared: SharedService,
    private _svSupplierReturn: SupplierReturnService,
    public SvDefault: DefaultService,
    private authGuard: AuthGuard,
  ) {
    this._strBrnCode = (this._svShared.brnCode || "").toString().trim();
    this._strCompCode = (this._svShared.compCode || "").toString().trim();
    this._strLocCode = (this._svShared.locCode || "").toString().trim();
  }
  filterValue: string = null;
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<ModelInvReturnSupHd>();
  pageEvent: PageEvent;
  displayedColumns: string[] = ['no', 'docno', 'actiondate', 'pono', 'Supplier', 'docstatus']; //'docdate', 
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

  ngOnInit() {
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
    await this.getArraySupplierReturnHeader();
  }
  ngAfterViewInit(): void {
    this.SvDefault.DoAction(() => {
      this.dataSource.sort = this.sort;
    });
  }
  public async GetArraySupplierReturnHeader() {
    await this.SvDefault.DoActionAsync(async () => await this.getArraySupplierReturnHeader(), true);
  }

  public async getArraySupplierReturnHeader(pNumPage?: number) {
    this.dataSource.data = [];
    this._arrEmployee = [];
    this.length = 0;
    let numPage: number = pNumPage || 1;
    let strKeyWord: string = (this.filterValue || "").toString().trim();
    let param: ModelSupplierReturnParam = null;
    param = new ModelSupplierReturnParam();
    param.Page = numPage;
    param.ItemsPerPage = this.pageSize;
    param.BrnCode = this._strBrnCode;
    param.CompCode = this._strCompCode;
    param.LocCode = this._strLocCode;
    param.Keyword = strKeyWord;
    param.FromDate = this.SvDefault.GetFormatDate(this.dateRange.value.start);
    param.ToDate = this.SvDefault.GetFormatDate(this.dateRange.value.end);

    let apiResult: ModelSupplierReturnResult = null;
    apiResult = await this._svSupplierReturn.GetArraySupplierReturnHeader(param);
    if (apiResult != null) {
      this.dataSource.data = apiResult.ArraySupplierReturnHeader;
      this._arrEmployee = apiResult.ArrayEmployee;
      this.length = apiResult.TotalItems;
    }

  }
  public GetEmployeeName(pSupplierReturnHeader: ModelInvReturnSupHd) {
    let result: string;
    let funGetEmployeeName: () => void = null;
    funGetEmployeeName = () => {
      result = this.getEmployeeName(pSupplierReturnHeader);
    }
    this.SvDefault.DoAction(funGetEmployeeName);
    return result;

  }
  private getEmployeeName(pSupplierReturnHeader: ModelInvReturnSupHd) {
    if (pSupplierReturnHeader == null) {
      return "";
    }
    let strEmpCode: string = "";
    strEmpCode = (pSupplierReturnHeader.CreatedBy || "").toString().trim();
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
    await this.getArraySupplierReturnHeader(page);
  }
}
