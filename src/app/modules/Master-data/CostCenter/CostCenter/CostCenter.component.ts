import { Component, OnInit, ViewChild } from '@angular/core';
import { ModelMasCostCenter } from 'src/app/model/ModelScaffold';
import { FormGroup } from '@angular/forms';
import { ModelCostCenter, ModelCostCenterResource } from '../../CostCenter/CostCenterModel';
import { SharedService } from 'src/app/shared/shared.service';
import { DefaultService } from 'src/app/service/default.service';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { ActivatedRoute } from '@angular/router';
import { CostCenterMasterService } from 'src/app/service/costcenter-service/costcenter-master-service';
import Swal from 'sweetalert2';
import { ModelHiddenButton } from 'src/app/model/ModelCommon';
import * as ModelCommon from 'src/app/model/ModelCommon';

@Component({
  selector: 'app-CostCenter',
  templateUrl: './CostCenter.component.html',
  styleUrls: ['./CostCenter.component.scss']
})
export class CostCenterComponent implements OnInit {
  private _strBrnCode: string = "";
  private _strCompCode: string = "";
  private _strLocCode: string = "";
  private _strUser: string = "";
  private _datSystem: Date = null;
  public HiddenButton: ModelHiddenButton = new ModelHiddenButton();
  public Header: ModelMasCostCenter = new ModelMasCostCenter();
  public strCompName: string = "";
  public selectedStatus: string = "";
  pageSize = 10;
  myGroup: FormGroup;
  isDisable = true;
  private authPositionRole: any;
  action: string = "";

  constructor(
    private _svShared: SharedService,
    public SvDefault: DefaultService,
    private _route: ActivatedRoute,
    private CostCenterService: CostCenterMasterService,
    private sharedService: SharedService,
    private authGuard: AuthGuard,
  ) { }

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
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

    let strGuid: string = "";
    strGuid = (this._route.snapshot.params.DocGuid || "").toString().trim();
    let costCenter: ModelMasCostCenter = null;
    let result: ModelMasCostCenter[] = null;

    if (strGuid === "New") {
      this.action = "New";
      await this.newData();
    } else {
      this.action = "Edit";
      this.isDisable = false;
      result = await this.CostCenterService.GetCostCenterByGuid(strGuid);
      costCenter = result["Data"];
      this.displayData(costCenter);
    }
  }

  private displayData(costCenter: ModelMasCostCenter) {
    if (costCenter == null) {
      return;
    }
    this.Header = costCenter;
    this.Header.UpdatedBy = this._strUser;
    this.selectedStatus = this.Header.BrnStatus
    this.HiddenButton = this.SvDefault.GetHiddenButton2(this.selectedStatus, "N");
  }

  public async NewData() {
    await this.SvDefault.DoActionAsync(async () => await this.newData(), true);
  }
  private async newData() {
    this.Header.CompCode = '';
    this.Header.BrnCode = '';
    // this.Header.MapBrnCode = '';
    this.Header.BrnName = '';
    this.Header.CostCenter = '';
    this.Header.ProfitCenter = '';
    this.HiddenButton = this.SvDefault.GetHiddenButton2("New", "N");
  }

  GetHiddenButton2(pStrDocStatus: string, pStrPostStatus: string): ModelHiddenButton {
    let result = new ModelCommon.ModelHiddenButton();
    switch (pStrDocStatus) {
      case "Cancel":
        result.status = "ยกเลิก";
        result.btnBack = false;
        result.btnPrint = false;
        break;
      case "Ready":
        result.status = "พร้อมใช้";
        result.btnBack = false;
        result.btnCancel = false;
        result.btnPrint = false;
        break;
      case "Reference":
        result.status = "เอกสารถูกอ้างอิง";
        result.btnBack = false;
        result.btnPrint = false;
        break;
      case "Active":
        result.status = "แอคทีฟ";
        result.btnBack = false;
        result.btnCancel = false;
        result.btnComplete = false;
        result.btnPrint = false;
        result.btnSave = false;
        break;
      case "Wait":
        result.status = "รออนุมัติ";
        result.btnApprove = false;
        result.btnBack = false;
        result.btnPrint = false;
        result.btnReject = false;
        break;
      default:
        result.status = "สร้าง";
        result.btnSave = false;
        result.btnClear = false;
        result.btnBack = false;
        break;
    }
    return result;
  }

  public async UpdateStatus(pStrStatus : string){
    await this.SvDefault.DoActionAsync(async()=> await this.updateStatus(pStrStatus),true);
  }

  private async updateStatus(pStrStatus : string){
    pStrStatus = this.SvDefault.GetString(pStrStatus);
    if (!await this.validateData()) {
      return;
    }

    if (pStrStatus === "Cancel" && !await this.SvDefault.ShowCancelDialogAsync() ) {
      return;
    }
    if(pStrStatus === "Cancel"){
      if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isCancel")) {
        this.SvDefault.ShowPositionRoleMessage("IsCancel");
        return;
      }
      // if(!await this.SvDefault.ShowCancelDialogAsync()){
      //   return;
      // }
    }

    let masCostCenterReq = new ModelMasCostCenter;
    masCostCenterReq.CompCode = this.Header.CompCode;
    masCostCenterReq.BrnCode = this.Header.BrnCode;
    masCostCenterReq.BrnName = this.Header.BrnName;
    // masCostCenterReq.MapBrnCode = this.Header.MapBrnCode;
    masCostCenterReq.CostCenter = this.Header.CostCenter;
    masCostCenterReq.ProfitCenter = this.Header.ProfitCenter;
    masCostCenterReq.UpdatedBy = this._strUser;
    masCostCenterReq.Guid = this.Header.Guid;

    let costCenterResource = new ModelCostCenterResource;
    costCenterResource.MasCostCenter = masCostCenterReq;

    let costCenterResponse = await this.CostCenterService.UpdateStatus(costCenterResource);
    let statusCode = costCenterResponse.StatusCode;
    let message = costCenterResponse.Message;

    if (statusCode == "422") {
      this.SvDefault.ShowWarningDialog(message);
    }
    else {
      let result: ModelMasCostCenter[] = null;
      let costCenter: ModelMasCostCenter = null;
      result = await this.CostCenterService.GetCostCenterByGuid(costCenterResponse.Data["Guid"]);
      costCenter = result["Data"];
      this.displayData(costCenter);
      await this.SvDefault.ShowSaveCompleteDialogAsync();
    }

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

    let masCostCenterReq = new ModelMasCostCenter;
    masCostCenterReq.CompCode = this.Header.CompCode;
    masCostCenterReq.BrnCode = this.Header.BrnCode;
    masCostCenterReq.BrnName = this.Header.BrnName;
    masCostCenterReq.CostCenter = this.Header.CostCenter;
    masCostCenterReq.ProfitCenter = this.Header.ProfitCenter;
    // masCostCenterReq.MapBrnCode = this.Header.MapBrnCode;
    masCostCenterReq.CreatedBy = this._strUser
    masCostCenterReq.UpdatedBy = this._strUser;
    masCostCenterReq.Guid = this.Header.Guid;

    let costCenterResource = new ModelCostCenterResource;
    costCenterResource.MasCostCenter = masCostCenterReq;


    let costCenterResponse = await this.CostCenterService.SaveData(costCenterResource);
    let statusCode = costCenterResponse.StatusCode;
    let message = costCenterResponse.Message;

    if (statusCode == "422") {
      this.SvDefault.ShowWarningDialog(message);
    }
    else {
      let result: ModelMasCostCenter[] = null;
      let costCenter: ModelMasCostCenter = null;
      result = await this.CostCenterService.GetCostCenterByGuid(costCenterResponse.Data["Guid"]);
      costCenter = result["Data"];
      this.displayData(costCenter);
      await this.SvDefault.ShowSaveCompleteDialogAsync();
    }
  }

  private async validateData() {
    if(this.Header.CompCode === ""){
      await Swal.fire("กรุณากรอกรหัสบริษัท" , "" , "warning");
      return false;
    }
    // if(this.Header.MapBrnCode === ""){
    //   await Swal.fire("กรุณากรอก SAP CODE" , "" , "warning");
    //   return false;
    // }
    if(this.Header.BrnCode === ""){
      await Swal.fire("กรุณากรอกรหัสส่วนงาน" , "" , "warning");
      return false;
    }
    if(this.Header.BrnName === ""){
      await Swal.fire("กรุณากรอกชื่อส่วนงาน" , "" , "warning");
      return false;
    }
    if(this.Header.CostCenter === ""){
      await Swal.fire("กรุณากรอก Cost Center" , "" , "warning");
      return false;
    }
    if(this.Header.ProfitCenter === ""){
      await Swal.fire("กรุณากรอก Profit Center" , "" , "warning");
      return false;
    }
    return true;
  }

}
