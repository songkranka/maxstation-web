import { stripSummaryForJitFileSuffix } from '@angular/compiler/src/aot/util';
import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { ModelHiddenButton } from 'src/app/model/ModelCommon';
import { ModelInfPoHeader, ModelInfPoItem, ModelInvReceiveProdDt, ModelInvReceiveProdHd, ModelInvReturnOilDt, ModelInvReturnOilHd, ModelMasBranch, ModelMasDocPatternDt, ModelMasEmployee, ModelMasProduct, ModelMasProductUnit, ModelMasReason, ModelMasUnit, ModelMasWarehouse } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import Swal from 'sweetalert2';
import { ModalPurchaseOrderComponent } from '../../ReceiveGas/ModalPurchaseOrder/ModalPurchaseOrder.component';
import { ModalReturnOilPOComponent } from '../ModalReturnOilPO/ModalReturnOilPO.component';
import { ModelGetArrayPoItemResult, ModelReturnOil } from '../ModelReturnOil';
import { ReturnOilService } from '../ReturnOilService.service';

@Component({
  selector: 'app-ReturnOil',
  templateUrl: './ReturnOil.component.html',
  styleUrls: ['./ReturnOil.component.scss']
})
export class ReturnOilComponent implements OnInit {

  constructor(
    private _svShared: SharedService,
    public SvDefault: DefaultService,
    private _route: ActivatedRoute,
    private _svReturnOil: ReturnOilService,
    private authGuard: AuthGuard,
  ) { }
  public HiddenButton: ModelHiddenButton = new ModelHiddenButton();
  public Header: ModelInvReturnOilHd = new ModelInvReturnOilHd();
  public ArrBranch: ModelMasBranch[] = [];
  public ArrDetail: ModelInvReturnOilDt[] = [];
  public ArrOilTerminal: ModelMasWarehouse[] = [];
  public ArrProduct: ModelMasProduct[] = [];
  public ArrReason: ModelMasReason[] = [];
  public ArrUnit: ModelMasUnit[] = [];
  public StrEmployeeName: string = "";
  private _strBrnCode: string = "";
  private _strCompCode: string = "";
  private _strLocCode: string = "";
  private _strUser: string = "";
  private _datSystem: Date = null;
  private _arrReceiveProdDT: ModelInvReceiveProdDt[] = null;
  private authPositionRole: any;
  action: string = "";

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
    this.ArrBranch = await this.getArrayBranch();
    this.ArrOilTerminal = await this.getArrayOilTerminal(this._strCompCode);
    this.ArrReason = await this.getArrayReason();
    let strGuid: string = "";
    strGuid = (this._route.snapshot.params.DocGuid || "").toString().trim();
    if (strGuid === "New") {
      this.action = "New";
      await this.newData();
    } else {
      this.action = "Edit";
      let returnOil: ModelReturnOil = null;
      returnOil = await this._svReturnOil.GetReturnOil(strGuid);
      if(!this.SvDefault.CheckDocBrnCode(returnOil?.Header?.BrnCode)){
        return;
      }
      this.displayData(returnOil);
    }
    this.StrEmployeeName = await this.getEmployeeName(this.Header?.CreatedBy);
  }
  private displayData(returnOil: ModelReturnOil) {
    if (returnOil == null) {
      return;
    }
    this.Header = returnOil.Header;
    this.Header.UpdatedBy = this._strUser;
    this.ArrDetail = returnOil.ArrayDetail;
    this.HiddenButton = this.SvDefault.GetHiddenButton2(this.Header.DocStatus, this.Header.Post);
  }
  public async NewData() {
    await this.SvDefault.DoActionAsync(async () => await this.newData(), true);
  }
  private async newData() {
    let arrPattern: ModelMasDocPatternDt[] = null;
    arrPattern = await this.SvDefault.GetPatternAsync("ReturnOil");
    let strPattern: string = "";
    strPattern = this.SvDefault.GenPatternString(this._datSystem, arrPattern, this._strCompCode, this._strBrnCode);
    this.Header.BrnCode = this._strBrnCode;
    this.Header.CompCode = this._strCompCode;
    this.Header.CreatedBy = this._strUser;
    this.Header.DocDate = this._datSystem;
    this.Header.DocNo = strPattern;
    this.Header.DocPattern = strPattern;
    this.Header.DocStatus = "New";
    this.Header.LocCode = this._strLocCode;
    this.Header.Post = "N";
    this.HiddenButton = this.SvDefault.GetHiddenButton2("New", "N");

    this.Header.BrnCodeTo = "";
    this.Header.PoNo = "";
    this.Header.ReasonId = "";
    this.Header.Remark = "";
    this.ArrDetail = [];
  }

  private async getArrayBranch() {
    let result: ModelMasBranch[] = null;
    result = await this._svReturnOil.GetArrayBranch();
    return result;
  }

  private async getArrayOilTerminal(compCode: string): Promise<ModelMasWarehouse[]> {
    let result: ModelMasWarehouse[] = null;
    result = await this._svReturnOil.GetArrayOilTerminal(compCode);
    return result;
  }

  private async getArrayReason(): Promise<ModelMasReason[]> {
    let result: ModelMasReason[] = null;
    result = await this._svReturnOil.GetArrayReason();
    return result;
  }
  private async getEmployeeName(pStrEmpCode: string) {
    let emp: ModelMasEmployee = null;
    emp = await this._svReturnOil.GetEmployee(pStrEmpCode);
    let result: string = "";
    if (emp == null) {
      result = pStrEmpCode;
    } else {
      result = `${pStrEmpCode} : ${emp.PrefixThai} ${emp.PersonFnameThai} ${emp.PersonLnameThai}`;
    }
    return result;
  }
  public GetProductName(pStrUnitBarcode: string) {
    pStrUnitBarcode = (pStrUnitBarcode || "").toString().trim();
    if (pStrUnitBarcode === "") {
      return "";
    }
    if (!(Array.isArray(this.ArrProduct) && this.ArrProduct.length)) {
      return pStrUnitBarcode;
    }
    let result: string = pStrUnitBarcode;
    for (let i = 0; i < this.ArrProduct.length; i++) {
      const pd = this.ArrProduct[i];
      if (pd == null) {
        continue;
      }
      let strProductId: string = "";
      strProductId = (pd.PdId || "").toString().trim();
      if (strProductId === pStrUnitBarcode) {
        result = pd.PdName;
        break;
      }
    }
    return result;
  }

  public GetUnitName(pStrPoUnit: string) {
    let result: string = "";
    result = this.ArrUnit?.find(x => x.MapUnitId === pStrPoUnit)?.UnitName || pStrPoUnit;
    return result;
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
    
    if (!this.validateData()) {
      return;
    }
    let header: ModelInvReturnOilHd = null;
    if (this.Header.DocStatus === "New") {
      header = new ModelInvReturnOilHd();
      this.SvDefault.CopyObject(this.Header, header);
      header.DocDate = this.SvDefault.GetFormatDate(<any>header.DocDate);
    } else {
      header = this.Header;
    }
    let param: ModelReturnOil = null;
    param = new ModelReturnOil();
    param.Header = header;
    for (let i = 0; i < this.ArrDetail.length; i++) {
      let obj = new ModelInvReturnOilDt;
      obj.BrnCode = this.ArrDetail[i].BrnCode
      obj.BrnCodeFrom = this.ArrDetail[i].BrnCodeFrom
      obj.BrnNameFrom = this.ArrDetail[i].BrnNameFrom
      obj.CompCode = this.ArrDetail[i].CompCode
      obj.DocNo = this.ArrDetail[i].DocNo
      obj.ItemQty = Number(this.ArrDetail[i].ItemQty)
      obj.LocCode = this.ArrDetail[i].LocCode
      obj.PdId = this.ArrDetail[i].PdId
      obj.PdName = this.ArrDetail[i].PdName
      obj.RefQty = this.ArrDetail[i].RefQty
      obj.SeqNo = this.ArrDetail[i].SeqNo
      obj.StockQty = this.ArrDetail[i].StockQty
      obj.UnitBarcode = this.ArrDetail[i].UnitBarcode
      obj.UnitId = this.ArrDetail[i].UnitId
      obj.UnitName = this.ArrDetail[i].UnitName
      param.ArrayDetail.push(obj);
    }
    // param.ArrayDetail = this.ArrDetail;
    param = await this._svReturnOil.SaveReturnOil(param);
    this.displayData(param);
    Swal.fire("บันทึกสำเร็จ", "", "success");
  }

  public async ShowModalPO() {
    await this.SvDefault.DoActionAsync(async () => await this.showModalPO());
  }
  private async showModalPO() {
    Swal.showLoading();

    let arrReceiveProd: ModelInvReceiveProdHd[] = null;
    arrReceiveProd = await this._svReturnOil.GetArrayReceiveProduct(this.Header);

    if (Swal.isLoading()) {
      Swal.close();
    }
    if (!(Array.isArray(arrReceiveProd) && arrReceiveProd.length)) {
      Swal.fire("ไม่พบเอกสาร PO", "", "warning");
      return;
    }
    let param = {
      ArrPoHeader: arrReceiveProd
    };
    let receiveHD: ModelInvReceiveProdHd = null;
    receiveHD = await this.SvDefault.ShowModalAsync<ModelInvReceiveProdHd>(ModalReturnOilPOComponent, "lg", param);
    if (receiveHD == null) {
      return;
    }
    Swal.showLoading();
    this._arrReceiveProdDT = await this._svReturnOil.GetArrayReceiveProdDt(receiveHD);
    if (Swal.isLoading()) {
      Swal.close();
    }
    this.Header.PoNo = receiveHD.PoNo;
    this.Header.RefNo = receiveHD.DocNo;
    this.ArrDetail = [];
  }

  public async UpdateStatus(pStrStatus: string) {
    await this.SvDefault.DoActionAsync(async () => await this.updateStatus(pStrStatus), true);
  }
  private async updateStatus(pStrStatus: string) {
    pStrStatus = (pStrStatus || "").toString().trim();
    if (pStrStatus === "") {
      return;
    }
    if (pStrStatus === "Cancel" && !await this.SvDefault.ShowCancelDialogAsync()) {
      return;
    } else {
      Swal.showLoading();
    }
    let header: ModelInvReturnOilHd = null;
    header = new ModelInvReturnOilHd();
    this.SvDefault.CopyObject(this.Header, header);
    header.DocStatus = pStrStatus;
    header = await this._svReturnOil.UpdateStatus(header);
    if (header != null) {
      this.Header = header;
      this.HiddenButton = this.SvDefault.GetHiddenButton2(this.Header.DocStatus, this.Header.Post);
    }
    Swal.fire("บันทึกสำเร็จ", "", "success");
  }
  private validateData(): boolean {

    let checkValidate = this.ArrReason.find(x => { return x.ReasonId == this.Header.ReasonId });

    let funShowError: (strMessage: string) => void = null;
    funShowError = strMessage => {
      Swal.fire(strMessage, "", "warning");
    };

    let strWareHouse: string;
    strWareHouse = (this.Header.BrnCodeTo || "").toString().trim();
    if (strWareHouse === "") {
      funShowError("กรุณาเลือกคลัง");
      return false;
    }
    let strReason: string;
    strReason = (this.Header.ReasonId || "").toString().trim();
    if (strReason === "") {
      funShowError("กรุณาเลือกเหตุผลที่โอนกลับ");
      return false;
    }

    if (typeof checkValidate != "undefined") {
      let strPoNo: string;
      strPoNo = (this.Header.PoNo || "").toString().trim();
      if (strPoNo === "" && checkValidate.IsValidate == "Y") {
        funShowError("กรุณาเลือกใบสั่งซื้อ");
        return false;
      }
    }

    if (!(Array.isArray(this.ArrDetail) && this.ArrDetail.length)) {
      funShowError("ไม่พบรายการสินค้า กรุณาเปลี่ยนใบสั่งซื้อ");
      return false;
    }
    for (let i = 0; i < this.ArrDetail.length; i++) {
      const dt = this.ArrDetail[i];
      if (dt == null) {
        continue;
      }
      if (dt.ItemQty <= 0) {
        funShowError(`สินค้า ${dt.UnitBarcode} : ${dt.PdName} ห้ามไส่ปริมาณน้อยกว่าหรือเท่ากับ 0`);
        return false;
      }
      if (typeof checkValidate != "undefined") {
        if (dt.ItemQty > dt.RefQty && checkValidate.IsValidate == "Y") {
          funShowError(`สินค้า ${dt.UnitBarcode} : ${dt.PdName} มี ปริมาณที่โอนกลับ เกิน ปริมาณในใบสั่งซื้อ`);
          return false;
        }
      }
    }
    return true;
  }

  private async GetProductWithoutPO() {
    let funcShowAlertNoItem: () => void = null;
    funcShowAlertNoItem = () => {
      Swal.fire(`เอกสารเลขที่ ${this.Header.PoNo} ไม่มีรายการสินค้า`, "", "warning");
    }
    // this._arrReceiveProdDT = await this._svReturnOil.GetArrayProductWithoutPO();
     let arrReceiveProdDT2 = await this._svReturnOil.GetArrayProductWithoutPO();
    let arrProdId: string[] = null;
    arrProdId = arrReceiveProdDT2
      .map(x => (x.PdId || "").toString().trim())
      .filter((x, i, a) => a.indexOf(x) === i);
    if (!Array.isArray(arrProdId) || !arrProdId.length) {
      funcShowAlertNoItem();
      return;
    }
    let arrSelectProd: ModelMasProduct[] = null;
    let funcMapDetail: (x: ModelInvReturnOilDt) => ModelMasProduct = null;
    funcMapDetail = x => {
      let pd: ModelMasProduct = new ModelMasProduct();
      this.SvDefault.CopyObject(x, pd);
      return pd;
    }
    arrSelectProd = this.ArrDetail.map(funcMapDetail);
    let arrProd: ModelMasProduct[] = null;
    Swal.showLoading();
    arrProd = await this._svReturnOil.GetArrayProduct(arrProdId);
    if (Swal.isLoading()) {
      Swal.close();
    }
    if (!Array.isArray(arrProd) || !arrProd.length) {
      funcShowAlertNoItem();
      return;
    }

    arrSelectProd = await this.SvDefault.ShowModalProduct2(arrProd, arrSelectProd);
    if (!Array.isArray(arrSelectProd) || !arrSelectProd.length) {
      return;
    }
    let funcFilter: (x: ModelInvReceiveProdDt) => boolean = null;
    funcFilter = x => arrSelectProd.some(y => x.PdId === y.PdId)
      && !this.ArrDetail.some(y => x.PdId === y.PdId);
    let funcMapData: (v: ModelInvReceiveProdDt, i: number) => ModelInvReturnOilDt = null;
    funcMapData = (x, i) => {
      let dt: ModelInvReturnOilDt = new ModelInvReturnOilDt();
      this.SvDefault.CopyObject(x, dt);
      let selectProd: ModelMasProduct = arrSelectProd.find(y => y.PdId === x.PdId);
      this.SvDefault.CopyObject(selectProd, dt);
      dt.SeqNo = i + 1;
      dt.RefQty = 0;
      dt.ItemQty = dt.RefQty;
      return dt;
    };
    let arrReturnOilDt: ModelInvReturnOilDt[] = null;
    // arrReturnOilDt = this._arrReceiveProdDT.filter(funcFilter).map(funcMapData);
    arrReturnOilDt = arrReceiveProdDT2.filter(funcFilter).map(funcMapData);
    if (!Array.isArray(arrReturnOilDt) || !arrReturnOilDt.length) {
      return;
    }
    this.ArrDetail = [...this.ArrDetail, ...arrReturnOilDt];
  }

  public changeReason() {
    //this._arrReceiveProdDT = [];
    this.ArrDetail = [];
  }

  public async ShowModalProduct() {
    await this.SvDefault.DoActionAsync(async () => await this.showModalProduct(), false);
  }
  private async showModalProduct() {
    let funcShowAlertNoItem: () => void = null;
    funcShowAlertNoItem = () => {
      Swal.fire(`เอกสารเลขที่ ${this.Header.PoNo} ไม่มีรายการสินค้า`, "", "warning");
    }
    let isCheckValidate = this.SvDefault.IsArray(this.ArrReason)
      && this.ArrReason.some(x=> x.ReasonId === this.Header.ReasonId && x.IsValidate === 'Y');
    if(isCheckValidate){
      if (this.Header.PoNo === "") {
        Swal.fire("กรุณาเลือกเลขที่เอกสารสั่งซื้อ", "", "warning");
        return;
      }
    }else{
      this.GetProductWithoutPO();
      return;
    }
    // if (!Array.isArray(this._arrReceiveProdDT) || !this._arrReceiveProdDT.length) {
    //   if (this.Header.PoNo === "") {
    //     let checkValidate = this.ArrReason.find(x => { return x.ReasonId == this.Header.ReasonId });
    //     if (typeof checkValidate != "undefined") {
    //       if (checkValidate.IsValidate == "Y") {
    //         Swal.fire("กรุณาเลือกเลขที่เอกสารสั่งซื้อ", "", "warning");
    //       } else {
    //         this.GetProductWithoutPO();
    //       }
    //     } else {
    //       Swal.fire("กรุณาเลือกเหตุผลที่โอนกลับ", "", "warning");
    //     }
    //   } else {
    //     funcShowAlertNoItem();
    //   }
    //   return;
    // }
    let arrProdId: string[] = null;
    arrProdId = this._arrReceiveProdDT
      .map(x => (x.PdId || "").toString().trim())
      .filter((x, i, a) => a.indexOf(x) === i);
    if (!Array.isArray(arrProdId) || !arrProdId.length) {
      funcShowAlertNoItem();
      return;
    }
    let arrSelectProd: ModelMasProduct[] = null;
    let funcMapDetail: (x: ModelInvReturnOilDt) => ModelMasProduct = null;
    funcMapDetail = x => {
      let pd: ModelMasProduct = new ModelMasProduct();
      this.SvDefault.CopyObject(x, pd);
      return pd;
    }
    arrSelectProd = this.ArrDetail.map(funcMapDetail);
    let arrProd: ModelMasProduct[] = null;
    Swal.showLoading();
    arrProd = await this._svReturnOil.GetArrayProduct(arrProdId);
    if (Swal.isLoading()) {
      Swal.close();
    }
    if (!Array.isArray(arrProd) || !arrProd.length) {
      funcShowAlertNoItem();
      return;
    }

    arrSelectProd = await this.SvDefault.ShowModalProduct2(arrProd, arrSelectProd);
    if (!Array.isArray(arrSelectProd) || !arrSelectProd.length) {
      return;
    }
    let funcFilter: (x: ModelInvReceiveProdDt) => boolean = null;
    funcFilter = x => arrSelectProd.some(y => x.PdId === y.PdId)
      && !this.ArrDetail.some(y => x.PdId === y.PdId);
    let funcMapData: (v: ModelInvReceiveProdDt, i: number) => ModelInvReturnOilDt = null;
    funcMapData = (x, i) => {
      let dt: ModelInvReturnOilDt = new ModelInvReturnOilDt();
      this.SvDefault.CopyObject(x, dt);
      let selectProd: ModelMasProduct = arrSelectProd.find(y => y.PdId === x.PdId);
      this.SvDefault.CopyObject(selectProd, dt);
      dt.SeqNo = i + 1;
      dt.RefQty = x.StockQty;
      dt.ItemQty = dt.RefQty;
      return dt;
    };
    let arrReturnOilDt: ModelInvReturnOilDt[] = null;
    arrReturnOilDt = this._arrReceiveProdDT.filter(funcFilter).map(funcMapData);
    if (!Array.isArray(arrReturnOilDt) || !arrReturnOilDt.length) {
      return;
    }
    this.ArrDetail = [...this.ArrDetail, ...arrReturnOilDt];
  }

}
