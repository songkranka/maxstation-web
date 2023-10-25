import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateStructAdapter } from '@ng-bootstrap/ng-bootstrap/datepicker/adapters/ngb-date-adapter';
import { ModelHiddenButton } from 'src/app/model/ModelCommon';
import { ModelInfPoHeader, ModelInfPoItem, ModelInvReceiveProdDt, ModelInvReceiveProdHd, ModelMasDocPatternDt, ModelMasProduct, ModelMasSupplier, ModelMasMapping, ModelMasUnit } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ModalPurchaseReceiveOilComponent } from '../ModalPurchaseOrder/ModalPurchaseReceiveOil.component';
import { PoHeaderListQuery, PoItemListResult, ReceiveOilQuery, PoItemListParam, ModelSupplierResult } from '../ModelReceiveOil';
import { ReceiveOilService } from '../ReceiveOil.service';
import { ReceiveGasService } from '../../ReceiveGas/ReceiveGas.service';
import * as moment from 'moment';
import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import { AuthGuard } from 'src/app/guards/auth-guard.service';

@Component({
    selector: 'app-ReceiveOil',
    templateUrl: './ReceiveOil.component.html',
    styleUrls: ['./ReceiveOil.component.scss']
})
export class ReceiveOilComponent implements OnInit {

    constructor(
        public SvDefault: DefaultService,
        private _svShare: SharedService,
        private _svReceiveOil: ReceiveOilService,
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
        this.ArrSupplier = await this._svReceiveOil.GetArraySupplier();
        strGuid = this._route.snapshot.params.DocGuid;
        if (strGuid === "New") {
            this.action = "New";
            await this.newData();
        } else {
            this.action = "Edit";
            let receiveOil = (await this._svReceiveOil.GetReceiveOil(strGuid)).Data;
            if (receiveOil == null) {
                return;
            }
            this.displayData(receiveOil);
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
        this.Header.UpdatedBy = this._strUser;
        this.Header.Currency = 'THB';
        this.Header.CurRate = 1;
        this.Header.DocType = "Oil";
        this.Header.LocCode = this._strLocCode;
        this.Header.DocDate = datSys;
        this.Header.Post = "N";

        let arrDocPattern: ModelMasDocPatternDt[] = await this.SvDefault.GetPatternAsync("ReceiveOil");
        let strPattern: string = this.SvDefault.GenPatternString(this.Header.DocDate, arrDocPattern, this._strCompCode, this._strBrnCode);
        this.Header.DocNo = strPattern;
        this.Header.DocPattern = strPattern;
        this.HiddenButton = this.SvDefault.GetHiddenButton2("New", "N");
        if (datSys != null) {
            // this.NdatInvoice = new NgbDate(datSys.getFullYear(), datSys.getMonth() + 1, datSys.getDate());
        }
    }

    public async OnSupCodeChange() {
        this.SvDefault.DoAction(() => this.onSupCodeChange());
    }

    private async onSupCodeChange() {

        this.Header.SupName = "";
        this.Header.InvAddress = "";
        this.Header.PayAddress = "";
        this.Header.DueDate = null;
        this.Header.VatType = "";
        let strSupCode: string = "";
        strSupCode = (this.Header.SupCode || "").toString().trim();
        let supplier: ModelMasSupplier = null;
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
        let strTaxAddress: string = "";
        if (Array.isArray(arrMap) && arrMap.length) {
            strPayAddress = arrMap.find(x => x.MapValue === "SupPayAddr")?.MapDesc;
            strPayAddress = (strPayAddress || "").toString().trim();
            strTaxAddress = arrMap.find(x => x.MapValue === "SupTaxAddr")?.MapDesc;
            strTaxAddress = (strTaxAddress || "").toString().trim();
        }
        this.Header.InvAddress = strTaxAddress;
        this.Header.PayAddress = strPayAddress;
    }

    async SaveData() {
        if (this.validateData()) {
            this.SvDefault.DoActionAsync(async () => await this.saveData(), true);
        }
    }
    private async saveData() {
        if (this.action === "New") {
            if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isCreate")) {
                this.SvDefault.ShowPositionRoleMessage("IsCreate");
                return;
            }
        }
        else if (this.action === "Edit") {
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
        }
        let receiveOil: ReceiveOilQuery = new ReceiveOilQuery();
        receiveOil.InvReceiveProdHd = hd;
        receiveOil.InvReceiveProdDts = this.ArrDetail;

        // let receiveOilResponse = (await this._svReceiveOil.SaveReceiveOil(receiveOil)).Data;
        let receiveOilResponse = (await this._svReceiveOil.SaveReceiveOil(receiveOil));
        let statusCode = receiveOilResponse.StatusCode;
        let message = receiveOilResponse.Message;

        if (statusCode == "422") {
            this.SvDefault.ShowWarningDialog(message);
        }
        else {
            let receiveOilData = receiveOilResponse.Data;
            this.displayData(receiveOilData['Resource']);
            await this.SvDefault.ShowSaveCompleteDialogAsync();
        }
    }

    private displayData(pInput: ReceiveOilQuery[]) {
        if (pInput == null) {
            return;
        }
        let receiveProdHD = <ModelInvReceiveProdHd>pInput['InvReceiveProdHd'];
        if (!this.SvDefault.CheckDocBrnCode(receiveProdHD?.BrnCode)) {
            return;
        }
        if (this.Header != null) {

            this.Header = receiveProdHD;// pInput['InvReceiveProdHd'];
            // this.Header = pInput['InvReceiveProdHd'];
            // this.Header.UpdatedBy = this._strUser;
            this.HiddenButton = this.SvDefault.GetHiddenButton2(this.Header.DocStatus, this.Header.Post);
            if (this.Header.Source == "VRM") {
                this.HiddenButton.btnSave = true;
                this.HiddenButton.btnCancel = true;
            }
            this.Header.DocDate = new Date(this.Header.DocDate);
            let datInvoice = new Date(this.Header.InvDate);
            if (datInvoice != null) {
                this.NdatInvoice = new NgbDate(datInvoice.getFullYear(), datInvoice.getMonth() + 1, datInvoice.getDate());
            }
        }
        this.ArrDetail = pInput['InvReceiveProdDts'];
    }

    async SetDocStatus(pStrDocStatus: string) {
        this.SvDefault.DoActionAsync(async () => {
            if (await this.SvDefault.ShowCancelDialogAsync()) {
                await this.setDocStatus(pStrDocStatus);
            }
        });
    }
    // async SetDocStatus(pStrDocStatus: string) {
    //     await this.SvDefault.DoActionAsync(async () => await this.setDocStatus(pStrDocStatus), true);
    // }

    private async setDocStatus(pStrDocStatus: string) {
        pStrDocStatus = (pStrDocStatus || "").toString().trim();
        if (pStrDocStatus === "") {
            return;
        }

        let headerClone = new ModelInvReceiveProdHd();
        this.SvDefault.CopyObject(this.Header, headerClone);
        headerClone.DocStatus = pStrDocStatus;
        let receiveOil: ReceiveOilQuery = new ReceiveOilQuery();
        receiveOil.InvReceiveProdHd = headerClone;

        let poHeader = (await this._svReceiveOil.UpdateStatus(receiveOil)).Data;

        this.Header = poHeader['Resource'];
        this.HiddenButton = this.SvDefault.GetHiddenButton2(this.Header['InvReceiveProdHd'].DocStatus, this.Header['InvReceiveProdHd'].Post);
        this.Header = this.Header['InvReceiveProdHd'];

    }

    public async ShowModalPO() {
        await this.SvDefault.DoActionAsync(async () => await this.showModalPO());
    }

    public ArrPoKey: string[] = [];
    private async showModalPO() {
        this.ArrDetail = [];
        let qry: PoHeaderListQuery = null;
        qry = new PoHeaderListQuery();
        qry.CompCode = this._strCompCode;
        qry.BranchCode = this._strBrnCode;
        // qry.SystemDate = <Date>this.Header.DocDate;
        let systemDate = <any>this.SvDefault.GetFormatDate(this._svShare.systemDate);
        qry.SystemDate = systemDate;
        let arrPoHeader: ModelInfPoHeader[] = null;
        Swal.showLoading();
        let poHeaders = (await this._svReceiveOil.GetPoHeaderList(qry)).Data;
        arrPoHeader = poHeaders['InfPoHeaders'];
        if (Swal.isLoading()) {
            Swal.close();
        }
        let param = { ArrPoHeader: arrPoHeader };
        let poHeader = <ModelInfPoHeader>await this.SvDefault.ShowModalAsync(ModalPurchaseReceiveOilComponent, "xl", param);
        if (poHeader != null) {
            this.Header.PoNo = poHeader.PoNumber;
            this.Header.PoDate = new Date(poHeader.DocDate);
            this.Header.SupCode = poHeader.Vendor;
            this.Header.PoTypeId = poHeader.DocType;
            this.onSupCodeChange();

            let paramPoItem = new PoItemListParam();
            paramPoItem.CompCode = this._strCompCode;
            paramPoItem.PoNumber = poHeader.PoNumber;
            paramPoItem.SystemDate = <Date>this.Header.DocDate;
            // let apiResult: PoItemListResult = null;
            Swal.showLoading();
            let poResult = (await this._svReceiveOil.GetPoItemList(paramPoItem)).Data;

            if (Swal.isLoading()) {
                Swal.close();
            }
            if (poResult == null) {
                return;
            }
            this.ArrPoItem = poResult['InfPoItems'];
            // if (this.SvDefault.IsArray(this.ArrPoItem)) {
            //     this.Header.PoDate = new Date(this.ArrPoItem[0].PoDate);
            // }
            let arrProduct: ModelMasProduct[] = poResult['MasProducts'];
            let funcGetProduct: (poItem: ModelInfPoItem) => ModelMasProduct = null;
            funcGetProduct = poItem => {
                if (poItem == null || !Array.isArray(arrProduct) || !arrProduct.length) {
                    return null;
                }
                let prod: ModelMasProduct = arrProduct.find(x => x.PdId === poItem.Material);
                return prod;
            }
            let arrMasUnit: ModelMasUnit[] = (<any>poResult).MasUnits;
            let funcGetUnitName: (unitId: string) => string = null;
            funcGetUnitName = unitId => {
                if (!this.SvDefault.IsArray(arrMasUnit)) {
                    return "";
                }
                let unit: ModelMasUnit = null;
                unit = arrMasUnit.find(x => x.MapUnitId === unitId);
                let strUnitName: string = this.SvDefault.GetString(unit?.UnitName);
                return strUnitName;
            };
            let funcGetUnit: (x: ModelInfPoItem) => ModelMasUnit = null;
            funcGetUnit = x => {
                if (x == null || !Array.isArray(arrProduct) || !arrProduct.length) {
                    return null;
                }
                let unit: ModelMasUnit = arrMasUnit.find(y => x.PoUnit === y.MapUnitId);
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
                dt.PoQty = (x.Quantity || 0.00);
                dt.Density = dt.DensityBase;
                // dt.ItemQty = x.Quantity;
                dt.ItemQty = this.numberRoundDecimal(x.Quantity, 0);
                dt.StockQty = Number(x.Floor);
                dt.UnitBarcode = x.Material;
                dt.UnitName = unit?.UnitName;
                dt.UnitId = unit?.UnitId;
                // dt.UnitPrice = x.NetPrice / x.PriceUnit
                // dt.UnitId = x.PoUnit;
                // dt.UnitName = funcGetUnitName(dt.UnitId);
                let unitPrice = x.NetPrice / x.PriceUnit
                dt.UnitPrice = this.numberRoundDecimal(unitPrice, 2);
                dt.SeqNo = parseInt(x.PoItem);
                this.adjustFreeItem(x, dt);
                this.calculateRow(dt);
                return dt;
            };
            if (Array.isArray(this.ArrPoItem) && this.ArrPoItem.length) {
                this.ArrDetail = this.ArrPoItem.map(funcMapPo);
                this.calculateSummary();
            }
        }
    }
    private adjustFreeItem(pPoItem: ModelInfPoItem, pReceiveDt: ModelInvReceiveProdDt): void {
        if (pPoItem == null || pReceiveDt == null) {
            return;
        }
        let strFreeItem: string;
        strFreeItem = this.SvDefault.GetString(pPoItem.FreeItem);
        if (strFreeItem === "") {
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

        let numSumItemAmt: number = (pReceiveProdDt.ItemQty * pReceiveProdDt.UnitPrice || 0.00);
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

            if (!dt.IsFree) {
                numSubAmt += (dt.SumItemAmt || 0.00);
            }
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

    validateData = (): boolean => {
        let pass = false;
        let msg = "";
        let poNo = this.Header.PoNo;
        let invNo = this.Header.InvNo;
        let invoiceDate = this.NdatInvoice;
        let supplierName = this.Header.SupName;
        let supplierCode = this.Header.SupCode;
        let docDate = this.Header.DocDate;
        let poDate = this.Header.PoDate;


        if (poNo == "" || poNo == null) {
            pass = false;
            msg = "กรุณากรอกเลือกใบสั่งซื้อ";
        }
        else if (invNo == "" || invNo == null) {
            pass = false;
            msg = "กรุณากรอกใบกำกับภาษี/ใบส่งของ";
        }
        else if (supplierName == "" || supplierName == null) {
            pass = false;
            msg = "รหัสผู้จัดจำหน่ายไม่ถูกต้อง";
        }
        else if (invoiceDate.day == 0 || invoiceDate.month == 0 || invoiceDate.year == 0) {
            pass = false;
            msg = "กรุณาระบุวันที่ใบกำกับภาษี/ใบส่งของ";
        }
        else if (!this.SvDefault.IsArray(this.ArrDetail)) {
            pass = false;
            msg = "ไม่พบรายการสินค้าในใบสั่งซื้อ";
        }
        else if (docDate < poDate) {
            pass = false;
            msg = "ไม่สามารถบันทึกใบรับสินค้าได้ เนื่องจากวันที่ใบสั่งซื้อ มากกว่า วันที่ระบบการขาย";
        }
        else {
            pass = true;
        }
        // if(!this.SvDefault.IsArray(this.ArrDetail)){

        // }

        if (!pass) {
            Swal.fire({
                title: msg,
                allowOutsideClick: false,
                allowEscapeKey: false,
                icon: 'error'
            })
                .then(() => {
                });
        }
        return pass;
    }

    numberRoundDecimal(v, n) {
        return Math.round((v + Number.EPSILON) * Math.pow(10, n)) / Math.pow(10, n)
    }
}
