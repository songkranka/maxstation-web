import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStructAdapter } from '@ng-bootstrap/ng-bootstrap/datepicker/adapters/ngb-date-adapter';
import { ModelHiddenButton } from 'src/app/model/ModelCommon';
import { ModelInfPoHeader, ModelInfPoItem, ModelInvReceiveProdDt, ModelInvReceiveProdHd, ModelMasDensity, ModelMasDocPatternDt, ModelMasMapping, ModelMasProduct, ModelMasSupplier, ModelMasUnit } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ModalPurchaseOrderComponent } from '../ModalPurchaseOrder/ModalPurchaseOrder.component';
import { ModelSupplierResult, PoHeaderListQuery, PoItemListParam, PoItemListResult, ReceiveGasQuery } from '../ModelReceiveGas';
import { ReceiveGasService } from '../ReceiveGas.service';
// import $ from 'jquery';
import Swal from 'sweetalert2';
import * as moment from 'moment';
import swal from 'sweetalert2';
import { AuthGuard } from 'src/app/guards/auth-guard.service';

@Component({
  selector: 'app-ReceiveGas',
  templateUrl: './ReceiveGas.component.html',
  styleUrls: ['./ReceiveGas.component.scss']
})
export class ReceiveGasComponent implements OnInit {

  constructor(
    public SvDefault: DefaultService,
    private _svShare: SharedService,
    private _svReceiveGas: ReceiveGasService,
    private _route: ActivatedRoute,
    private authGuard: AuthGuard,
  ) { }
  public HiddenButton: ModelHiddenButton = new ModelHiddenButton();
  public Header: ModelInvReceiveProdHd = new ModelInvReceiveProdHd();
  public ArrDetail: ModelInvReceiveProdDt[] = [];
  public ArrPoItem: ModelInfPoItem[] = [];
  public ArrSupplier: ModelMasSupplier[] = [];
  public NdatInvoice: NgbDate = new NgbDate(0, 0, 0);
  private _strUser: string = "";
  private _strBrnCode: string = "";
  private _strCompCode: string = "";
  private _strLocCode: string = "";
  private _density: ModelMasDensity = null;
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

    this._strUser = (this._svShare.user || "").toString().trim();
    this._strBrnCode = (this._svShare.brnCode || "").toString().trim();
    this._strCompCode = (this._svShare.compCode || "").toString().trim();
    this._strLocCode = (this._svShare.locCode || "").toString().trim();
    let strGuid: string = "";
    // this.ArrSupplier = await this._svReceiveGas.GetArraySupplier();
    strGuid = this._route.snapshot.params.DocGuid;
    if (strGuid === "New") {
      this.action = "New";
      await this.newData();
    } else {
      this.action = "Edit";
      let receiveGas: ReceiveGasQuery = await this._svReceiveGas.GetReceiveGas(strGuid);
      if (receiveGas == null) {
        return;
      }
      this.displayData(receiveGas);
    }
  }
  async NewData() {
    this.SvDefault.DoActionAsync(async () => await this.newData(), true);
  }
  private async newData() {
    let datSys = this._svShare.systemDate;
    this.ArrDetail = [];
    this.Header = new ModelInvReceiveProdHd();
    this.Header.DocStatus = "New";
    this.Header.BrnCode = this._strBrnCode;
    this.Header.CompCode = this._strCompCode;
    this.Header.CreatedBy = this._strUser;
    this.Header.DocType = "Gas";
    this.Header.LocCode = this._strLocCode;
    this.Header.DocDate = datSys;
    this.Header.Post = "N";
    this.Header.CurRate = 1.00;
    this.Header.Currency = "THB";
    this.Header.Source = "SAP";
    let arrDocPattern: ModelMasDocPatternDt[] = await this.SvDefault.GetPatternAsync("ReceiveGas");
    let strPattern: string = this.SvDefault.GenPatternString(this.Header.DocDate, arrDocPattern, this._strCompCode, this._strBrnCode);
    this.Header.DocNo = strPattern;
    this.Header.DocPattern = strPattern;
    this.HiddenButton = this.SvDefault.GetHiddenButton2("New", "N");
    if (datSys != null) {
      // this.NdatInvoice = new NgbDate(datSys.getFullYear(), datSys.getMonth() + 1, datSys.getDate());
    }
  }
  public async OnSupCodeChange() {
    this.SvDefault.DoActionAsync(async () => await this.onSupCodeChange(), true);
  }

  private async onSupCodeChange() {
    this.Header.SupName = "";
    this.Header.InvAddress = "";
    this.Header.PayAddress = "";
    this.Header.DueDate = null;
    this.Header.VatType = "";
    this.Header.PayAddrId = "";
    let strSupCode: string = "";
    strSupCode = (this.Header.SupCode || "").toString().trim();
    let supplier: ModelMasSupplier = null;
    // supplier = this.ArrSupplier.find(x=> x.SupCode == strSupCode);
    let supplierResult: ModelSupplierResult = null
    supplierResult = await this._svReceiveGas.GetSupplier(strSupCode, this._strCompCode);
    if (supplierResult == null) {
      return;
    }
    supplier = supplierResult.Supplier;
    if (supplier == null) {
      return;
    }
    let dueDate: Date = null;
    dueDate = moment(this.Header.DocDate).add(supplier.CreditTerm, 'd').toDate();
    this.Header.SupName = supplier.SupName;
    // this.Header.InvAddress = supplier.Address;
    this.Header.DueDate = dueDate;
    let arrVatType: string[] = null;
    arrVatType = ["VE", "VI", "NV"];
    let strVatType: string = "";
    strVatType = (supplier.VatType || "").toString().trim().toUpperCase();
    if (arrVatType.some(x => x === strVatType)) {
      this.Header.VatType = strVatType;
    } else {
      this.Header.VatType = "NV";
    }
    this.calculateSummary();
    let arrMap: ModelMasMapping[] = null;
    arrMap = supplierResult.ArrayMapping;
    let strPayAddress: string = "";
    let strPayAddrId: string = "";
    let strInvAddress: string = "";
    let strInvAddrId: string = "";
    if (this.SvDefault.IsArray(arrMap)) {
      let payAddr: ModelMasMapping = arrMap.find(x => x.MapValue === "SupPayAddr");
      strPayAddrId = this.SvDefault.GetString(payAddr?.MapId);
      strPayAddress = this.SvDefault.GetString(payAddr?.MapDesc);
      let invAddress: ModelMasMapping = arrMap.find(x => x.MapValue === "SupTaxAddr");
      strInvAddrId = this.SvDefault.GetString(invAddress?.MapId);
      strInvAddress = this.SvDefault.GetString(invAddress?.MapDesc);
    }
    this.Header.InvAddrId = strInvAddrId;
    this.Header.InvAddress = strInvAddress;
    this.Header.PayAddrId = strPayAddrId;
    this.Header.PayAddress = strPayAddress;
  }
  async SaveData() {
    if (this.validateField()) {
      this.SvDefault.DoActionAsync(async () => await this.saveData(), true);
    }
  }

  private alertError(alertText: string) {
    swal.fire({
      title: alertText,
      allowOutsideClick: false,
      allowEscapeKey: false,
      icon: 'error'
    })
  }

  private validateField() {
    let result = true;
    let hd: ModelInvReceiveProdHd = this.Header;
    let invoiceDate = this.NdatInvoice;
    let supplierName = this.Header.SupName;
    let docDate = this.Header.DocDate;
    let poDate = this.Header.PoDate;

    if (hd.InvNo === "") {
      this.alertError("กรุณาระบุ ใบกำกับภาษี/ใบส่งของ");
      return false;
    }
    else if(supplierName == "" || supplierName == null) {
      this.alertError("รหัสผู้จัดจำหน่ายไม่ถูกต้อง");
      return false;
    }
     else if (invoiceDate.day == 0 || invoiceDate.month == 0 || invoiceDate.year == 0) {
      this.alertError("กรุณาระบุ วันที่ใบกำกับภาษี/ใบส่งของ");
      return false;
    } else if (!this.SvDefault.IsArray(this.ArrDetail)) {
      this.alertError("ไม่พบรายการสินค้าในใบสั่งซื้อ");
      return false;
    }
    else if (docDate < poDate) {
      this.alertError("ไม่สามารถบันทึกใบรับสินค้าได้ เนื่องจากวันที่ใบสั่งซื้อ มากกว่า วันที่ระบบการขาย");
      return false;
    }
    return result;
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
    
    if (this.Header.DocStatus === "New") {
      this.Header.DocDate = this.SvDefault.GetFormatDate(this._svShare.systemDate);
      this.Header.DueDate = <any>this.SvDefault.GetFormatDate(this.Header.DueDate);
    } else {
      this.Header.DocDate = this.SvDefault.GetFormatDate(<Date>this.Header.DocDate);
      this.Header.DueDate = <any>this.SvDefault.GetFormatDate(this.Header.DueDate);
    }
    let hd: ModelInvReceiveProdHd = this.Header;
    // new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    // this.NdatInvoice
    if (this.NdatInvoice != null) {
      let datInvoice = new Date(this.NdatInvoice.year, this.NdatInvoice.month - 1, this.NdatInvoice.day);
      hd.InvDate = <any>this.SvDefault.GetFormatDate(datInvoice);
    }
    hd.PoDate = <any>this.SvDefault.GetFormatDate(hd.PoDate);
    hd.DueDate = <any>this.SvDefault.GetFormatDate(hd.DueDate);

    hd.NetAmtCur = hd.NetAmt * hd.CurRate;
    hd.SubAmtCur = hd.SubAmt * hd.CurRate;
    hd.VatAmtCur = hd.VatAmt * hd.CurRate;
    hd.DiscAmtCur = hd.DiscAmt * hd.CurRate;
    hd.EtaxAmtCur = hd.EtaxAmt * hd.CurRate;
    hd.TotalAmtCur = hd.TotalAmt * hd.CurRate;
    hd.TaxBaseAmtCur = hd.TaxBaseAmt * hd.CurRate;
    hd.ShippingAmtCur = hd.ShippingAmt * hd.CurRate;
    for (let i = 0; i < this.ArrDetail.length; i++) {
      const dt = this.ArrDetail[i];
      dt.UnitPriceCur = dt.UnitPrice * hd.CurRate;
      dt.SumItemAmtCur = dt.SumItemAmt * hd.CurRate;
      dt.ItemQty = parseInt(dt.ItemQty?.toFixed(0)) || 0;
      dt.StockQty = dt.ItemQty;
    }
    let receiveGas: ReceiveGasQuery = new ReceiveGasQuery();
    receiveGas.Header = hd;
    receiveGas.Details = this.ArrDetail;
    let receiveGasResponse = await this._svReceiveGas.SaveReceiveGas(receiveGas);
    let statusCode = receiveGasResponse.StatusCode;
    let message = receiveGasResponse.Message;
    let receiveGasData = receiveGasResponse.Data;

    if (statusCode == "422") {
      this.SvDefault.ShowWarningDialog(message);
    }
    else {

      this.displayData(receiveGasData);
      await this.SvDefault.ShowSaveCompleteDialogAsync();
    }

    // this.displayData(receiveGas);
    // await this.SvDefault.ShowSaveCompleteDialogAsync();
  }

  private displayData(pInput: ReceiveGasQuery) {
    if (pInput == null || !this.SvDefault.CheckDocBrnCode(pInput.Header.BrnCode)) {
      return;
    }
    if (this.Header != null) {
      this.Header = pInput.Header;
      this.Header.UpdatedBy = this._strUser;
      this.HiddenButton = this.SvDefault.GetHiddenButton2(this.Header.DocStatus, this.Header.Post);
      this.Header.DocDate = new Date(this.Header.DocDate);
      let datInvoice = new Date(this.Header.InvDate);
      if (datInvoice != null) {
        this.NdatInvoice = new NgbDate(datInvoice.getFullYear(), datInvoice.getMonth() + 1, datInvoice.getDate());
      }
    }
    this.ArrDetail = pInput.Details;
  }
  async SetDocStatus(pStrDocStatus: string) {
    await this.SvDefault.DoActionAsync(async () => await this.setDocStatus(pStrDocStatus));
  }

  private async setDocStatus(pStrDocStatus: string) {
    pStrDocStatus = (pStrDocStatus || "").toString().trim();
    if (pStrDocStatus === "" || (pStrDocStatus === "Cancel" && !await this.SvDefault.ShowCancelDialogAsync())) {
      return;
    }
    let headerClone = new ModelInvReceiveProdHd();
    this.SvDefault.CopyObject(this.Header, headerClone);
    headerClone.DocStatus = pStrDocStatus;
    this.Header = await this._svReceiveGas.UpdateStatus(headerClone);
    this.HiddenButton = this.SvDefault.GetHiddenButton2(this.Header.DocStatus, this.Header.Post);
    Swal.fire("บันทึกสำเร๊จ", "", "success");
  }
  public async ShowModalPO() {
    await this.SvDefault.DoActionAsync(async () => await this.showModalPO());
  }
  public ArrPoKey: string[] = [];
  private async showModalPO() {
    this._density = null;
    this.ArrDetail = [];
    let qry: PoHeaderListQuery = null;
    qry = new PoHeaderListQuery();
    qry.CompCode = this._strCompCode;
    qry.BrnCode = this._strBrnCode;
    qry.SystemDate = <any>this.SvDefault.GetFormatDate(<Date>this.Header.DocDate);
    let arrPoHeader: ModelInfPoHeader[] = null;
    Swal.showLoading();
    arrPoHeader = await this._svReceiveGas.GetPoHeaderList(qry);
    if (Swal.isLoading()) {
      Swal.close();
    }
    let param = { ArrPoHeader: arrPoHeader };
    let poHeader = <ModelInfPoHeader>await this.SvDefault.ShowModalAsync(ModalPurchaseOrderComponent, "xl", param);
    if (poHeader != null) {
      this.Header.PoNo = poHeader.PoNumber;
      this.Header.PoDate = new Date(poHeader.DocDate);
      this.Header.SupCode = poHeader.Vendor;
      this.Header.PoTypeId = poHeader.DocType
      this.onSupCodeChange();
      let paramPoItem = new PoItemListParam();
      paramPoItem.CompCode = this._strCompCode;
      paramPoItem.PoNumber = poHeader.PoNumber;
      paramPoItem.SystemDate = <Date>this.Header.DocDate;
      let apiResult: PoItemListResult = null;
      Swal.showLoading();
      apiResult = await this._svReceiveGas.GetPoItemList(paramPoItem);
      if (Swal.isLoading()) {
        Swal.close();
      }
      if (apiResult == null) {
        return;
      }
      this.ArrPoItem = apiResult.ArrPoItem;
      // if (this.SvDefault.IsArray(this.ArrPoItem)) {
      //   this.Header.PoDate = new Date(this.ArrPoItem[0].PoDate);
      // }
      let arrProduct: ModelMasProduct[] = apiResult.ArrProduct;
      this._density = apiResult.Density;
      // let density: ModelMasDensity = apiResult.Density;
      let arrUnit: ModelMasUnit[] = apiResult.ArrUnit;
      let funcGetProduct: (poItem: ModelInfPoItem) => ModelMasProduct = null;
      funcGetProduct = poItem => {
        if (poItem == null || !Array.isArray(arrProduct) || !arrProduct.length) {
          return null;
        }
        let prod: ModelMasProduct = arrProduct.find(x => x.PdId === poItem.Material);
        return prod;
      }
      let funcGetUnit: (x: ModelInfPoItem) => ModelMasUnit = null;
      funcGetUnit = x => {
        if (x == null || !Array.isArray(arrProduct) || !arrProduct.length) {
          return null;
        }
        let unit: ModelMasUnit = arrUnit.find(y => x.PoUnit === y.MapUnitId);
        return unit;
      }

      let funcMapPo: (poItem: ModelInfPoItem) => ModelInvReceiveProdDt = null;
      funcMapPo = x => {
        let prod: ModelMasProduct = null;
        prod = funcGetProduct(x);
        let unit: ModelMasUnit = null;
        unit = funcGetUnit(x);
        let dt: ModelInvReceiveProdDt = new ModelInvReceiveProdDt();
        dt.BrnCode = this.Header.BrnCode;
        dt.CompCode = this.Header.CompCode;
        dt.DocNo = this.Header.DocNo;
        dt.DocType = this.Header.DocType;
        dt.PdId = x.Material;
        dt.PdName = prod?.PdName || x.ShortText || "";
        dt.UnitBarcode = dt.PdId;
        dt.PoQty = (x.Quantity || 0.00);
        dt.WeightQty = dt.PoQty;
        dt.UnitId = unit?.UnitId;
        dt.UnitName = unit?.UnitName;
        dt.WeightPrice = (x.NetPrice || 0.00) / (x.PriceUnit || 1);
        dt.DensityBase = this._density?.DensityBase || 0.54;
        dt.Density = dt.DensityBase;
        dt.ItemQty = x.Quantity;
        dt.UnitPrice = x.PriceUnit;
        dt.StockQty = x.ReceiveFloor;
        dt.SeqNo = parseInt(x.PoItem);
        this.calculateRow(dt);
        this.adjustFreeItem(x , dt);
        return dt;
      };
      if (Array.isArray(this.ArrPoItem) && this.ArrPoItem.length) {
        this.ArrDetail = this.ArrPoItem.map(funcMapPo);
        this.calculateSummary();
        this.Header.ItemCount = this.ArrDetail.length;
      }
    }
  }

  private adjustFreeItem(pPoItem : ModelInfPoItem , pReceiveDt : ModelInvReceiveProdDt) : void{
    if(pPoItem == null || pReceiveDt == null){
      return;
    }
    let strFreeItem : string;
    strFreeItem = this.SvDefault.GetString(pPoItem.FreeItem);
    if(strFreeItem === ""){
      return;
    }
    pReceiveDt.IsFree = true;
    pReceiveDt.DiscAmt = 0;
    pReceiveDt.DiscAmtCur = 0;
    pReceiveDt.DiscHdAmt = 0;
    pReceiveDt.DiscHdAmtCur = 0;
    pReceiveDt.SubAmt = 0;
    pReceiveDt.SubAmtCur = 0;
    pReceiveDt.SumItemAmt = 0;
    pReceiveDt.SumItemAmtCur = 0;
    pReceiveDt.TotalAmt = 0;
    pReceiveDt.TotalAmtCur = 0;
    pReceiveDt.UnitPrice = 0;
    pReceiveDt.UnitPriceCur = 0;
    pReceiveDt.VatAmt = 0;
    pReceiveDt.VatAmtCur = 0;
  }
  public CalculateRow(pReceiveProdDt: ModelInvReceiveProdDt) {
    this.SvDefault.DoAction(() => {
      this.calculateRow(pReceiveProdDt);
      this.calculateSummary();
    });
  }
  private calculateRow(pReceiveProdDt: ModelInvReceiveProdDt) {
    if (pReceiveProdDt == null) {
      return;
    }
    //ปริมาณ(ลิตร) = น้ำหนักเป็นกิโล / ค่าความถ่วงจำเพาะ
    //น้ำหนักเป็นกิโล
    let numWeightQty: number = pReceiveProdDt.WeightQty || 0;
    //ค่าความถ่วงจำเพาะ
    let numDensity: number = 0;
    if (this._density?.CalculateType == "Base") {
      numDensity = this._density?.DensityBase || 0.00;
    } else {
      numDensity = pReceiveProdDt.Density || pReceiveProdDt.DensityBase || 1;
    }

    //ปริมาณ(ลิตร)
    let numItemQty: number = ((numWeightQty / numDensity) || 0.00);
    //ราคาต่อหน่วย(ลิตร) = (น้ำหนักเป็นกิโล * ราคาต่อหน่วยเป็นกิโล) / ปริมาณ(ลิตร)
    //ราคาต่อหน่วยเป็นกิโล
    let numWeightPrice: number = pReceiveProdDt.WeightPrice || 0.00;
    // ราคาต่อหน่วย(ลิตร)
    let numUnitPrice: number = 0;
    // numUnitPrice = numWeightQty * numDensity;
    numUnitPrice = numWeightPrice * numDensity;
    // มูลค่าสินค้า = (weight_qty*unit_price)
    let numSumItemAmt: number = 0;
    // numSumItemAmt = (numWeightQty * numUnitPrice || 0.00);
    numSumItemAmt = (numWeightQty * numWeightPrice);
    pReceiveProdDt.ItemQty = numItemQty;
    pReceiveProdDt.UnitPrice = numUnitPrice;
    pReceiveProdDt.SumItemAmt = numSumItemAmt;
  }

  public CalculateSummary() {
    this.SvDefault.DoAction(() => this.calculateSummary());
  }

  private calculateSummary() {
    if (!Array.isArray(this.ArrDetail) || !this.ArrDetail.length) {
      return;
    }
    let numSubAmt: number = 0.00;
    for (let i = 0; i < this.ArrDetail.length; i++) {
      const dt = this.ArrDetail[i];
      numSubAmt += (dt.SumItemAmt || 0.00);
    }
    let numDisAmt: number = this.Header.DiscAmt || 0.00;
    let numTotalAmt: number = 0.00;
    let numTaxBaseAmt: number = 0.00;
    let numVatAmt: number = 0.00;
    let numShippingAmt: number = this.Header.ShippingAmt || 0.00;
    switch (this.Header.VatType) {
      case "VI":
        numTotalAmt = numSubAmt - numDisAmt;
        numTaxBaseAmt = numTotalAmt * 100 / 107;
        numVatAmt = numTotalAmt * 7 / 107;
        break;
      case "VE":
        numTaxBaseAmt = numSubAmt - numDisAmt;
        numTotalAmt = numTaxBaseAmt * 107 / 100;
        numVatAmt = numTaxBaseAmt * 7 / 100;
        break;
      default:
        numTaxBaseAmt = numSubAmt - numDisAmt;
        numTotalAmt = numTaxBaseAmt;
        numVatAmt = 0.00;
        break;
    }
    this.Header.SubAmt = numSubAmt || 0.00;
    this.Header.TotalAmt = numTotalAmt || 0.00;
    this.Header.TaxBaseAmt = numTaxBaseAmt || 0.00;
    this.Header.VatAmt = numVatAmt || 0.00;
    this.Header.NetAmt = numSubAmt + numShippingAmt;
  }
}

