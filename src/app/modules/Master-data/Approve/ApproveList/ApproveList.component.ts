import { Component, OnInit, ViewChild } from '@angular/core';
import { async } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { ModelMasEmployee, ModelSysApproveConfig, ModelSysApproveHd, ModelSysApproveStep } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ApproveService } from '../Approve.service';
import { ModelSearchApproveParam } from '../ModelApprove';

@Component({
  selector: 'app-ApproveList',
  templateUrl: './ApproveList.component.html',
  styleUrls: ['./ApproveList.component.scss']
})
export class ApproveListComponent implements OnInit {

  constructor(
    private _svShared: SharedService,
    public SvDefault: DefaultService,
    private _svApprove: ApproveService,
    private authGuard: AuthGuard,
  ) { }
  filterValue: string = null;
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<ModelSysApproveHd>();
  pageEvent: PageEvent;
  // displayedColumns: string[] = ['no', 'docno', 'doctype' ,  'docdate', 'user', 'docstatus'];
  displayedColumns: string[] = ['no', 'docno', 'docdate', 'user', 'docstatus'];
  no = 0;
  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  private _strBrnCode: string = "";
  private _strCompCode: string = "";
  private _strLocCode: string = "";
  private _strEmpCode: string = "";
  private _arrEmployee: ModelMasEmployee[] = [];
  private _arrConfig: ModelSysApproveConfig[] = [];
  private _arrStep: ModelSysApproveStep[] = [];
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
    this._strEmpCode = this.SvDefault.GetString(this._svShared.user);
    this._arrConfig = await this._svApprove.GetArrayConfig();
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
    let param = new ModelSearchApproveParam();
    param.PageIndex = numPage;
    param.ItemPerPage = this.pageSize;
    param.EmpCode = this._strEmpCode;
    param.KeyWord = strKeyWord;
    param.StartDate = <any>this.SvDefault.GetFormatDate(<any>this.dateRange?.value?.start);
    param.EndDate = <any>this.SvDefault.GetFormatDate(<any>this.dateRange?.value?.end);

    let apiResult = await this._svApprove.SearchApprove(param);
    if (apiResult == null) {
      return;
    }
    this._arrEmployee = apiResult.ArrEmployee;
    this.dataSource.data = apiResult.ArrApproveHeader;
    // this._arrStep = apiResult.ArrayStep;
    this.length = apiResult.TotalItem;
  }
  private async getArrayHeaderOld(pNumPage?: number) {
    /*
    this.dataSource.data = [];
    this._arrEmployee = [];
    this.length = 0;   
    let numPage : number = pNumPage || 1;
    let strKeyWord : string = (this.filterValue || "").toString().trim();
    let param : ModelUnusableParam = null;
    param = new ModelUnusableParam();
    param.Page = numPage;
    param.ItemsPerPage = this.pageSize;
    param.BrnCode = this._strBrnCode;
    param.CompCode = this._strCompCode;
    param.LocCode = this._strLocCode;
    param.Keyword = strKeyWord;
    param.FromDate = <any>this.SvDefault.GetFormatDate(<any>this.dateRange?.value?.start);
    param.ToDate = <any>this.SvDefault.GetFormatDate(<any>this.dateRange?.value?.end);
    */
    let apiResult = await this._svApprove.GetArraySysApprove(this._strEmpCode);
    if (apiResult != null) {
      this._arrEmployee = apiResult.ArrayEmployee;
      this.dataSource.data = apiResult.ArrayHeader;
      this._arrStep = apiResult.ArrayStep;
      this.length = apiResult.ArrayHeader?.length || 0.00;
    }

  }
  public GetEmployeeName(pHeader: ModelSysApproveHd) {
    if (pHeader == null || !this.SvDefault.IsArray(this._arrEmployee)) {
      return "";
    }
    let emp = this._arrEmployee.find(x => x.EmpCode === pHeader.CreatedBy);
    if (emp == null) {
      return "";
    }
    let result = `${emp.PrefixThai} ${emp.PersonFnameThai} ${emp.PersonLnameThai}`;
    return result;
    // if(emp != null)
  }
  public GetDocName(pHeader: ModelSysApproveHd) {
    if (pHeader == null || !this.SvDefault.IsArray(this._arrStep) || !this.SvDefault.IsArray(this._arrConfig)) {
      return "";
    }
    let step = this._arrStep.find(x => x.ApprCode === pHeader.DocNo);
    if (step == null) {
      return "";
    }
    let config = this._arrConfig.find(x => x.DocType === step.DocType);
    return this.SvDefault.GetString(config?.DocName);
  }
  public async OnPaginateChange(x) {
    await this.SvDefault.DoActionAsync(async () => await this.onPaginateChange(x), true);
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
