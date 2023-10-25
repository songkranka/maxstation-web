import { stripSummaryForJitFileSuffix } from '@angular/compiler/src/aot/util';
import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModelHiddenButton } from 'src/app/model/ModelCommon';
import { HttpClient } from '@angular/common/http';
import { ModelMasBranchTank, ModelMasBranchDisp, ModelMasBranchTax, ModelMasCompany, ModelMasBranch, ModelMasDocPatternDt, ModelMasEmployee, ModelMasReason, ModelInvReceiveProdDt, ModelInvReceiveProdHd, ModelMasBranchConfig } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import Swal from 'sweetalert2';
import { BranchMasterService } from 'src/app/service/branch-service/branch-master-service';
import { ModelBranch, ModelBranchResource, ModelBranchTaxResource } from "src/app/modules/Master-data/Branch/BranchModel";
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import * as _moment from 'moment';
const moment = _moment || _moment;
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { getuid } from 'process';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-Branch',
  templateUrl: './Branch.component.html',
  styleUrls: ['./Branch.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class BranchComponent implements OnInit {
  private authPositionRole: any;
  private _strBrnCode: string = "";
  private _strCompCode: string = "";
  private _strLocCode: string = "";
  private _strUser: string = "";
  private _datSystem: Date = null;
  public HiddenButton: ModelHiddenButton = new ModelHiddenButton();
  public Header: ModelMasBranch = new ModelMasBranch();
  public ArrCompany: ModelMasCompany[] = [];
  public strCompName: string = "";
  public selectedStatus: string = "";
  myGroup: FormGroup;
  date = new FormControl(moment());
  isDisabled = true;
  isDisableBranch = true;
  action: string = "";

  constructor(
    private _svShared: SharedService,
    public SvDefault: DefaultService,
    private _route: ActivatedRoute,
    private _svBranch: BranchMasterService,
    private httpClient: HttpClient,
    private sharedService: SharedService,
    private authGuard: AuthGuard,
  ) { }

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  setMonthAndYear(
    normalizedMonthAndYear: _moment.Moment,
    datepicker: MatDatepicker<_moment.Moment>
  ) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  async ngOnInit() {
    await this.SvDefault.DoActionAsync(async () => await this.start(), true);
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
    this._strUser = (this._svShared.user || "").toString().trim();
    this._datSystem = this._svShared.systemDate;
    this.myGroup = new FormGroup({
      // brasnchOption: new FormControl()
    });

    this.ArrCompany = await this.getCompanyDDL();
    let strGuid: string = "";
    let Branch: ModelMasBranch = null;
    let result: ModelMasBranch[] = null;
    strGuid = (this._route.snapshot.params.BrnCode || "").toString().trim();

    if (strGuid === "New") {
      this.action = "New";
      await this.newData();
    } else {
      this.action = "Edit";
      this.isDisableBranch = false;
      result = await this._svBranch.GetBranchByGuid(strGuid);
      Branch = result["Data"];
      this.getBranch(Branch.CompCode.toString());
      this.displayData(Branch);
    }
  }

  private displayData(branch: ModelMasBranch) {
    if (branch == null) {
      return;
    }
    this.Header = branch;
    this.Header.UpdatedBy = this._strUser;
    this.HiddenButton = this.SvDefault.GetHiddenButton2(this.Header.BrnStatus, "Y");
    this.date = new FormControl(this.Header.CloseDate)
    this.selectedStatus = this.Header.BrnStatus
  }

  public async NewData() {
    await this.SvDefault.DoActionAsync(async () => await this.newData(), true);
  }
  private async newData() {
    let arrPattern: ModelMasDocPatternDt[] = null;
    arrPattern = await this.SvDefault.GetPatternAsync("Branch");
    // this.Header.BrnCode = this._strBrnCode;
    this.Header.CompCode = this._strCompCode;
    this.Header.CreatedBy = this._strUser;
    this.HiddenButton = this.SvDefault.GetHiddenButton2("New", "N");
    this.getBranch(this.Header.CompCode);
    this.selectedStatus = "Active";
  }

  private async getCompanyDDL(): Promise<ModelMasCompany[]> {
    let result: ModelMasCompany[] = null;
    result = await this._svBranch.GetCompanyDDL();
    return result["Data"];
  }

  private async getBranch(CompCode: string) {
    let arrCompany: ModelMasCompany = null;
    arrCompany = await this._svBranch.GetCompany(CompCode);
    this.strCompName = arrCompany["Data"]["CompName"];
  }

  getBranchChange() {
    this.getBranch(this.Header.CompCode);
  }

  public async SaveData() {
    await this.SvDefault.DoActionAsync(async () => await this.saveData(), true);
  }

  private async saveData() {
    if(this.action === "New"){
      if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isCreate")) {
        this.SvDefault.ShowPositionRoleMessage("IsCreate");
        return;
      }
    }
    else if(this.action === "Edit"){
      if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isEdit")) {
        this.SvDefault.ShowPositionRoleMessage("IsEdit");
        return;
      }
    }

    if (!await this.validateData()) {
      return;
    }

    let masBranchConfigReq = new ModelMasBranchConfig;
    masBranchConfigReq.CompCode = this.Header.BrnCode;
    masBranchConfigReq.BrnCode = this.Header.BrnCode;
    masBranchConfigReq.IsPos = "N";
    masBranchConfigReq.IsLockMeter = "N";
    masBranchConfigReq.Trader = "";
    masBranchConfigReq.TraderPosition = "";
    masBranchConfigReq.ReportTaxType = "";
    masBranchConfigReq.CreatedBy = this._strUser;
    masBranchConfigReq.UpdatedBy = this._strUser;

    this.Header.LocCode = this._strLocCode;
    this.Header.BrnStatus = this.selectedStatus;

    if (this.Header.BrnStatus == "Cancel") {
      this.Header.CloseDate = this.date.value;
    }

    let branchResource = new ModelBranchResource;
    branchResource.MasBranchConfig = masBranchConfigReq;
    branchResource.MasBranch = this.Header;

    let branchResponse = await this._svBranch.SaveData(branchResource);
    let statusCode = branchResponse.StatusCode;
    let message = branchResponse.Message;

    if (statusCode == "422") {
      this.SvDefault.ShowWarningDialog(message);
    }
    else {
      let result: ModelMasBranch[] = null;
      let Branch: ModelMasBranch = null;
      result = await this._svBranch.GetBranchByGuid(branchResponse.Data["Guid"]);
      Branch = result["Data"];
      this.getBranch(Branch.CompCode.toString());
      this.displayData(Branch);
      await this.SvDefault.ShowSaveCompleteDialogAsync();
    }
  }

  private async validateData() {
    if(this.Header.BrnCode === ""){
      await Swal.fire("กรุณากรอกรหัสสาขา" , "" , "warning");
      return false;
    }
    if(this.Header.BrnName === ""){
      await Swal.fire("กรุณากรอกชื่อสาขา" , "" , "warning");
      return false;
    }
    return true;
  }
}
