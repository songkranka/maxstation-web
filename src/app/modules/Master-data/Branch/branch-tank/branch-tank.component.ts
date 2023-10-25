import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModelHiddenButton } from 'src/app/model/ModelCommon';
import { HttpClient } from '@angular/common/http';
import { ModelMasBranchTank, ModelMasBranch, ModelMasBranchDisp } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import * as moment from 'moment';
import { BranchMasterService } from 'src/app/service/branch-service/branch-master-service';
import swal from 'sweetalert2';
import { ModelBranchTankResource } from '../BranchModel';

export class ProductModel {
  CreatedBy: string;
  CreatedDate: Date;
  GroupId: string;
  UnitBarcode: string;
  AcctCode: string;
  PdDesc: string;
  PdId: string;
  PdName: string;
  PdStatus: string;
  UnitId: string;
  UnitName: string;
  UpdatedBy: string;
  UpdatedDate: Date;
  VatRate: number;
  VatType: string;
}

@Component({
  selector: 'app-branch-tank',
  templateUrl: './branch-tank.component.html',
  styleUrls: ['./branch-tank.component.scss']
})
export class BranchTankComponent implements OnInit {
  private authPositionRole: any;
  private _strBrnCode: string = "";
  private _strCompCode: string = "";
  private _strLocCode: string = "";
  private _strUser: string = "";
  private _datSystem: Date = null;
  public Header: ModelMasBranch = new ModelMasBranch();
  public HiddenButton: ModelHiddenButton = new ModelHiddenButton();
  rowFocus = 0;
  linesTank: ModelMasBranchTank[];
  date = new FormControl(moment());
  myGroup: FormGroup;
  productList: ProductModel[] = [];
  urlMas = this.sharedService.urlMas;
  product: ProductModel;
  linesDisp: ModelMasBranchDisp[];
  tankId: number = 0;
  statusDataList: Array<any> = [];
  action: string = "";

  constructor(
    private authGuard: AuthGuard,
    public SvDefault: DefaultService,
    private _svShared: SharedService,
    private _route: ActivatedRoute,
    private httpClient: HttpClient,
    private sharedService: SharedService,
    private _svBranch: BranchMasterService,
  ) {
    this.statusDataList = [
      { code: "Active", name: "เปิดใช้" },
      { code: "Hold", name: "ปิดชั่วคราว" },
      { code: "Cancel", name: "ยกเลิก" }
    ]
   }

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
    this._datSystem = this._svShared.systemDate;
    this.myGroup = new FormGroup({
      searchProduct: new FormControl(),
      searchTX: new FormControl(),
      branchTX: new FormControl(),
    });

    let guid: string = "";
    this.linesTank = [];
    this.linesDisp = [];
    guid = (this._route.snapshot.params.DocGuid || "").toString().trim();
    
    if (guid === "New") {
      this.action = "New";
      await this.newData();
    } else {
      this.action = "Edit";
      let branchModel: ModelMasBranch = null;
      let branchMaster = await this._svBranch.GetBranchByGuid(guid);
      let branchDetail = await this._svBranch.GetBranchDetail(this._strBrnCode);
      branchModel = branchMaster["Data"];
      this.Header = branchModel;
      this.Header.CompanyName = branchDetail['Data'].CompanyName;
      this.displayData(branchModel.CompCode, branchModel.BrnCode);
    }
  }

  private displayData(compCode: string, brnCode: string) {
    
    this.HiddenButton = this.SvDefault.GetHiddenButton2(this.Header.BrnStatus, "Y");
    this.ShowModelTank(compCode, brnCode);
    this.ShowModelDisp(compCode, brnCode);
  }

  private async ShowModelTank(CompCode: string, BrnCode: string) {
    CompCode = (CompCode || "").toString().trim();
    BrnCode = (BrnCode || "").toString().trim();
    if (CompCode === "") {
      return null;
    }
    if (BrnCode === "") {
      return null;
    }
    let arrDetailTank: ModelMasBranchTank[] = null;
    arrDetailTank = await this._svBranch.GetTankByBranch(CompCode, BrnCode);

    let TankList = arrDetailTank["Data"];
    this.linesTank = [];

    for (let i = 0; i < TankList.length; i++) {
      let obj = new ModelMasBranchTank;
      obj.BrnCode = TankList[i].BrnCode;
      obj.Capacity = TankList[i].Capacity;
      obj.CapacityMin = TankList[i].CapacityMin;
      obj.CompCode = TankList[i].CompCode;
      obj.CreatedBy = TankList[i].CreatedBy;
      obj.CreatedDate = TankList[i].CreatedDate;
      obj.PdId = TankList[i].PdId;
      obj.PdName = TankList[i].PdName;
      obj.TankId = TankList[i].TankId;
      obj.TankStatus = TankList[i].TankStatus;
      obj.UpdatedBy = TankList[i].UpdatedBy;
      obj.UpdatedDate = TankList[i].UpdatedDate;
      this.linesTank.push(obj);
    }
  }

  private async ShowModelDisp(CompCode: string, BrnCode: string) {
    CompCode = (CompCode || "").toString().trim();
    BrnCode = (BrnCode || "").toString().trim();
    if (CompCode === "") {
      return null;
    }
    if (BrnCode === "") {
      return null;
    }
    let arrDetailDisp: ModelMasBranchDisp[] = null;
    arrDetailDisp = await this._svBranch.GetDispByBranch(CompCode, BrnCode);

    let DispList = arrDetailDisp["Data"];
    this.linesDisp = [];
    for (let i = 0; i < DispList.length; i++) {
      let obj = new ModelMasBranchDisp;
      obj.BrnCode = DispList[i].BrnCode;
      obj.CompCode = DispList[i].CompCode;
      obj.CreatedBy = DispList[i].CreatedBy;
      obj.CreatedDate = DispList[i].CreatedDate;
      obj.DispId = DispList[i].DispId;
      obj.DispStatus = DispList[i].DispStatus;
      obj.MeterMax = DispList[i].MeterMax;
      obj.PdId = DispList[i].PdId;
      obj.PdName = DispList[i].PdName;
      obj.SerialNo = DispList[i].SerialNo;
      obj.TankId = DispList[i].TankId;
      obj.UnitBarcode = DispList[i].UnitBarcode;
      obj.UnitId = DispList[i].UnitId;
      obj.UpdatedBy = DispList[i].UpdatedBy;
      obj.UpdatedDate = DispList[i].UpdatedDate;
      obj.HoseId = DispList[i].HoseId;
      this.linesDisp.push(obj);
    }
  }

  public async NewData() {
    await this.SvDefault.DoActionAsync(async () => await this.newData(), true);
  }

  private async newData() {
    this.Header.CompCode = this._strCompCode;
    this.Header.BrnCode = this._strBrnCode;
    this.Header.CreatedBy = this._strUser;
    this.HiddenButton = this.SvDefault.GetHiddenButton2("New", "N");
  }

  public async addrowTank() {
    let tanks = this.linesTank[this.linesTank.length - 1];

    if(tanks != undefined){
      this.tankId = Number(tanks.TankId)
    }
    
    this.tankId++;
    let row1 = new ModelMasBranchTank();
    row1.CompCode = this.Header.CompCode;
    row1.BrnCode = this.Header.BrnCode;
    row1.TankId = this.format(this.tankId);
    row1.TankStatus = "Active";
    row1.PdId = "";
    row1.PdName = "";
    row1.Capacity = 0;
    row1.CapacityMin = 0;
    this.linesTank.push(row1);
  }

  format(tankNumber: any) {
    return tankNumber = this.padLeft(tankNumber, "0", 2);
  }

  padLeft(text: string, padChar: string, size: number): string {
    return (String(padChar).repeat(size) + text).substr(size * -1, size);
  }

  setRowFocus(indexs: any) {
    this.rowFocus = indexs;
    this.getProductList();
  }

  getProductList() {
    this.productList = [];
    this.httpClient.post(this.urlMas + "/api/Product/GetProductOilType", null)
      .subscribe(
        response => {
          for (let i = 0; i < response["Data"].length; i++) {
            let obj = new ProductModel();
            obj.CreatedBy = response["Data"][i].CreatedBy;
            obj.CreatedDate = response["Data"][i].CreatedDate;
            obj.GroupId = response["Data"][i].GroupId;
            obj.UnitBarcode = response["Data"][i].UnitBarcode;
            obj.PdDesc = response["Data"][i].PdDesc;
            obj.PdId = response["Data"][i].PdId;
            obj.PdName = response["Data"][i].PdName;
            obj.PdStatus = response["Data"][i].PdStatus;
            obj.UnitId = response["Data"][i].UnitId;
            obj.UnitName = response["Data"][i].UnitName;
            obj.UpdatedBy = response["Data"][i].UpdatedBy;
            obj.UpdatedDate = response["Data"][i].UpdatedDate;
            obj.VatRate = response["Data"][i].VatRate;
            obj.VatType = response["Data"][i].VatType;
            obj.AcctCode = response["Data"][i].AcctCode;
            this.productList.push(obj);
          }
        },
        error => {
          console.log("Error", error);
        }
      );
  }

  selectedProduct = (indexs: any): void => {
    var obj = this.productList[indexs];
    this.product = obj;
    this.hilightRowProduct(indexs);
  }

  hilightRowProduct(indexs) {
    if (indexs == null) {
      indexs = this.productList.findIndex(e => e.PdId === this.product.PdId);
    }
    if (indexs != null) {
      const slides = document.getElementsByClassName('trPdStyle');
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i] as HTMLElement;
        if (i == indexs) {
          slide.style.backgroundColor = "#9fdb95";
        } else {
          slide.style.backgroundColor = "#fff";
        }
      }
    }
  }

  onTankChange(indexs: any, tankId: any) {
    let tank: ModelMasBranchTank = this.linesTank.find(tank => tank.TankId === tankId);
    this.linesDisp[indexs].PdId = tank.PdId;
  }

  addProduct() {
    this.linesTank[this.rowFocus].PdId = this.product.PdId;
    this.linesTank[this.rowFocus].PdName = this.product.PdName;
  }

  deleteRow = (indexs: any): void => {
    this.linesTank = this.linesTank.filter((row, index) => index !== indexs);
  }

  public async addrowDisp() {
    let row2 = new ModelMasBranchDisp();
    row2.CompCode = this.Header.CompCode;
    row2.BrnCode = this.Header.BrnCode;
    row2.DispId = "";
    row2.SerialNo = "";
    row2.TankId = "";
    row2.PdId = "";
    row2.PdName = "";
    row2.DispStatus = "Active";
    this.linesDisp.push(row2);
  }

  deleteRowDisp = (indexs: any): void => {
    this.linesDisp = this.linesDisp.filter((row, index) => index !== indexs);
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
    
    if (this.validateData()) {
      let masBranchTanks: ModelMasBranchTank[] = [];
      let masBranchDisps: ModelMasBranchDisp[] = [];

      for (let i = 0; i < this.linesTank.length; i++) {
        let masBranchTank: ModelMasBranchTank = this.linesTank[i];
        masBranchTank.CompCode = this.Header.CompCode;
        masBranchTank.BrnCode = this.Header.BrnCode;
        masBranchTank.CreatedBy = this._strUser;
        masBranchTank.UpdatedBy = this._strUser;
        masBranchTanks.push(masBranchTank);
      }

      for (let i = 0; i < this.linesDisp.length; i++) {
        let masBranchDisp: ModelMasBranchDisp = this.linesDisp[i];
        masBranchDisp.CompCode = this.Header.CompCode;
        masBranchDisp.BrnCode = this.Header.BrnCode;
        masBranchDisp.CreatedBy = this._strUser;
        masBranchDisp.UpdatedBy = this._strUser;
        masBranchDisp.HoseId = Number(masBranchDisp.HoseId);
        masBranchDisps.push(masBranchDisp);
      }

      let branchTankResource = new ModelBranchTankResource;
      branchTankResource.MasBranchTanks = masBranchTanks;
      branchTankResource.MasBranchDisps = masBranchDisps;
      let branchTankResponse = await this._svBranch.SaveTankData(branchTankResource);
      let statusCode = branchTankResponse.StatusCode;
      let message = branchTankResponse.Message;

      if (statusCode == "422") {
        this.SvDefault.ShowWarningDialog(message);
      }
      else {
        this.displayData(this.Header.CompCode, this.Header.BrnCode);
        await this.SvDefault.ShowSaveCompleteDialogAsync();
      }
    }
  }

  validateData = (): boolean => {
    let pass = false;
    let msg = "";

    if (this.linesTank.length == 0) {
      pass = false;
      msg = "กรุณาเพิ่มรายการถังน้ำมัน";
    }
    if (this.linesDisp.length == 0) {
      pass = false;
      msg = "กรุณาเพิ่มรายละเอียดหัวจ่าย";
    }
    else {
      if (this.linesTank.length > 0) {
        for (var i = 0; i < this.linesTank.length; i++) {
          if (this.linesTank[i].PdName == "") {
            pass = false;
            msg = "กรุณาเลือกรหัสสินค้า<br>";
            break;
          } else {
            pass = true;
          }
          if (this.linesTank[i].Capacity == 0) {
            pass = false;
            msg = `กรุณากรอกความจุ ${this.linesTank[i].PdName}` + "<br>";
            break;
          } else {
            pass = true;
          }
          if (this.linesTank[i].CapacityMin == 0) {
            pass = false;
            msg = `กรุณากรอกปริมาณน้ำมันดูดไม่ขึ้น ${this.linesTank[i].PdName}` + "<br>";
            break;
          } else {
            pass = true;
          }
          if (this.linesTank[i].TankStatus == "") {
            pass = false;
            msg = `กรุณาเลือกสถานะ ${this.linesTank[i].PdName}` + "<br>";
            break;
          } else {
            pass = true;
          }
        }
      }
      if (this.linesDisp.length > 0) {
        for (var i = 0; i < this.linesDisp.length; i++) {
          if (this.linesDisp[i].DispId == "") {
            pass = false;
            msg = "กรุณากรอกรหัสหัวจ่าย<br>";
            break;
          } else {
            pass = true;
          }
          if (this.linesDisp[i].SerialNo == "") {
            pass = false;
            msg = "กรุณากรอก Serial Number<br>";
            break;
          } else {
            pass = true;
          }
          if (this.linesDisp[i].HoseId == 0) {
            pass = false;
            msg = "กรุณากรอก HoseId<br>";
            break;
          } else {
            pass = true;
          }
          if (this.linesDisp[i].TankId == "") {
            pass = false;
            msg = `กรุณาเลือกรหัสถัง ${this.linesDisp[i].DispId}` + "<br>";
            break;
          } else {
            pass = true;
          }
          if (this.linesDisp[i].DispStatus == "") {
            pass = false;
            msg = `กรุณาเลือกสถานะ ${this.linesDisp[i].DispId}` + "<br>";
            break;
          } else {
            pass = true;
          }
        }
      }
    }
    if (!pass) {
      swal.fire({
        title: msg,
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'error'
      })
    }
    return pass;
  }
}
