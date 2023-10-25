import { Component, OnInit} from '@angular/core';
import { ModelMasCostCenter, ModelMasUnit } from 'src/app/model/ModelScaffold';
import { FormGroup } from '@angular/forms';
import { SharedService } from 'src/app/shared/shared.service';
import { DefaultService } from 'src/app/service/default.service';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { ModelHiddenButton } from 'src/app/model/ModelCommon';
import { UnitService } from 'src/app/service/unit-service/unit-service';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss']
})
export class UnitComponent implements OnInit {
  private authPositionRole: any;
  private _strBrnCode: string = "";
  private _strCompCode: string = "";
  private _strLocCode: string = "";
  private _strUser: string = "";
  private _datSystem: Date = null;
  public HiddenButton: ModelHiddenButton = new ModelHiddenButton();
  public Unit: ModelMasUnit = new ModelMasUnit();
  public strCompName: string = "";
  public selectedStatus: string = "";
  pageSize = 10;
  myGroup: FormGroup;
  isDisable = true;

  constructor(
    private _svShared: SharedService,
    public SvDefault: DefaultService,
    private _route: ActivatedRoute,
    private unitService: UnitService,
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

    let strId: string = "";
    strId = (this._route.snapshot.params.DocGuid || "").toString().trim();
    let unit: ModelMasUnit = null;
    let result: ModelMasUnit[] = null;

    if (strId === "New") {
      await this.newData();
    } else {
      this.isDisable = false;
      result = await this.unitService.GetUnitById(strId);
      unit = result["Data"];
      this.displayData(unit);
    }
  }

  public async NewData() {
    await this.SvDefault.DoActionAsync(async () => await this.newData(), true);
  }

  private async newData() {
    this.Unit.UnitId = '';
    this.Unit.MapUnitId = '';
    this.Unit.UnitName = '';
    this.HiddenButton = this.SvDefault.GetHiddenButton2("New", "N");
  }

  private displayData(param : ModelMasUnit){
    if(param == null){
      return;
    }

    this.Unit = param;
    this.isDisable = false;
    this.HiddenButton = this.SvDefault.GetHiddenButton2(this.Unit.UnitStatus, "N");
  }

  public async SaveData() {
    await this.SvDefault.DoActionAsync(async () => await this.saveData(), true);
  }

  private async saveData() {
    if (!await this.validateData()) {
      return;
    }

    this.Unit.CreatedBy = this.sharedService.user;
    this.Unit.UpdatedBy = this.sharedService.user;
    let unitResponse = await this.unitService.SaveData(this.Unit);
    let statusCode = unitResponse.StatusCode;
    let message = unitResponse.Message;

    if (statusCode == "422") {
      this.SvDefault.ShowWarningDialog(message);
    }
    else {
      let result: ModelMasUnit[] = null;
      let unit: ModelMasUnit = null;
      result = await this.unitService.GetUnitById(unitResponse.Data["UnitId"]);
      unit = result["Data"];
      this.displayData(unit);
      await this.SvDefault.ShowSaveCompleteDialogAsync();
    }
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
    }
    this.Unit.UnitStatus = pStrStatus;
    let unitResponse = await this.unitService.UpdateStatus(this.Unit);
    let statusCode = unitResponse.StatusCode;
    let message = unitResponse.Message;

    if (statusCode == "422") {
      this.SvDefault.ShowWarningDialog(message);
    }
    else {
      let result: ModelMasUnit[] = null;
      let unit: ModelMasUnit = null;
      result = await this.unitService.GetUnitById(unitResponse.Data["UnitId"]);
      unit = result["Data"];
      this.displayData(unit);
      await this.SvDefault.ShowSaveCompleteDialogAsync();
    }

  }

  private async validateData() {
    if(this.Unit.UnitId=== ""){
      await Swal.fire("กรุณากรอกรหัสหน่วยสินค้า" , "" , "warning");
      return false;
    }

    if(this.Unit.MapUnitId === ""){
      await Swal.fire("กรุณากรอก SAP CODE" , "" , "warning");
      return false;
    }
    
    if(this.Unit.UnitName === ""){
      await Swal.fire("กรุณากรอกชื่อหน่วยสินค้า" , "" , "warning");
      return false;
    }

    return true;
  }
}
