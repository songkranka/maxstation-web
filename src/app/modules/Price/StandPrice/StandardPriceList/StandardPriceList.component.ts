import { Component, OnInit, ViewChild } from '@angular/core';
import { async } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { ModelMasEmployee, ModelOilStandardPriceHd } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import Swal from 'sweetalert2';
import { ModelStandardPriceParam, ModelStandardPriceResult } from '../ModelStandardPrice';
import { StandardPriceService } from '../StandardPrice.service';

@Component({
  selector: 'app-StandardPriceList',
  templateUrl: './StandardPriceList.component.html',
  styleUrls: ['./StandardPriceList.component.scss']
})
export class StandardPriceListComponent implements OnInit {

  constructor(
    public SvDefault: DefaultService,
    public _svShared: SharedService,
    public _svStandardPrice: StandardPriceService,
    private authGuard: AuthGuard,
  ) {

  }
  filterValue: string = null;
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<ModelOilStandardPriceHd>();
  pageEvent: PageEvent;
  displayedColumns: string[] = ['no', 'docno', 'docdate', 'user', 'actiondate', 'docstatus'];
  no = 0;
  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  private _strBrnCode: string = "";
  private _strCompCode: string = "";
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
      return;
    }
    this._strBrnCode = this.SvDefault.GetString(this._svShared.brnCode);
    this._strCompCode = this.SvDefault.GetString(this._svShared.compCode);
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
    let param: ModelStandardPriceParam = null;
    param = new ModelStandardPriceParam();
    param.Page = numPage;
    param.BrnCode = this._strBrnCode;
    param.CompCode = this._strCompCode;
    param.Keyword = strKeyWord;
    param.FromDate = <any>this.SvDefault.GetFormatDate(this.dateRange?.value?.start);
    param.ToDate = <any>this.SvDefault.GetFormatDate(this.dateRange?.value?.end);
    let apiResult: ModelStandardPriceResult = null;
    apiResult = await this._svStandardPrice.GetArrayHeader(param);
    if (apiResult != null) {
      this.dataSource.data = apiResult.ArrayHeader;
      this._arrEmployee = apiResult.ArrayEmployee;
      this.length = apiResult.TotalItems;
    }
  }
  public GetEmployeeName(pHeader: ModelOilStandardPriceHd) {
    let result: string;
    let funGetEmployeeName: () => void = null;
    funGetEmployeeName = () => {
      result = this.getEmployeeName(pHeader);
    }
    this.SvDefault.DoAction(funGetEmployeeName);
    return result;

  }
  private getEmployeeName(pHeader: ModelOilStandardPriceHd) {
    if (pHeader == null) {
      return "";
    }
    let strEmpCode: string = "";
    strEmpCode = (pHeader.UpdatedBy || pHeader.CreatedBy || "").toString().trim();
    if (strEmpCode === ""
      || !Array.isArray(this._arrEmployee)
      || !this._arrEmployee.length) {
      return strEmpCode;
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
    this.no = pEvent.pageIndex * pEvent.pageSize;
    let numPageIndex: number = pEvent.pageIndex;
    this.pageSize = pEvent.pageSize;
    await this.getArrayHeader(numPageIndex);
  }
  public async OnClickAddDocument() {
    this.SvDefault.DoActionAsync(async () => await this.onClickAddDocument());
  }
  private async onClickAddDocument() {
    let funcShowWarningMessage: (x: ModelOilStandardPriceHd) => void = null;
    funcShowWarningMessage = x => {
      Swal.fire(`ไม่สามารถสร้างเอกสารได้เนื่องจากเอกสารเลขที่ ${x.DocNo} ยังไม่ได้รับการอนุมัติ`, "", "warning");
    };
    let unApproveDoc: ModelOilStandardPriceHd = null;
    if (this.SvDefault.IsArray(this.dataSource?.data)) {
      let arrHeader: ModelOilStandardPriceHd[];
      arrHeader = this.dataSource?.data;
      // unApproveDoc = arrHeader.find(x=> x.ApproveStatus !== 'Y');
      unApproveDoc = arrHeader.find(x => this.SvDefault.GetString(x.ApproveStatus) === '');
      if (unApproveDoc != null) {
        funcShowWarningMessage(unApproveDoc);
        return;
      }
    }
    unApproveDoc = await this._svStandardPrice.GetUnApproveDocument(this._strCompCode);
    if (unApproveDoc != null) {
      funcShowWarningMessage(unApproveDoc);
      return;
    }
    window.location.href = "./StandardPrice/New";
  }

}
