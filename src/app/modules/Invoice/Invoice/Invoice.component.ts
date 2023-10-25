import { Component, OnInit, ViewChild, AfterViewInit, AfterViewChecked } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { HttpClient, HttpParams } from '@angular/common/http'
import { SharedService } from './../../../shared/shared.service';
import { DatePipe } from '@angular/common';
import { CustomerModalComponent, CustomerModalOutput } from './../CustomerModal/CustomerModal.component';
import * as ModelInvoice from './../ModelInvoice';
import { ServiceInvoice } from './../ServiceInvoice.service';
import { Router } from '@angular/router'
import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import { DefaultService } from './../../../service/default.service';
import { FormsModule, FormControl, FormGroup } from "@angular/forms"
import { from, Observable, of } from "rxjs";
import { stringify } from "@angular/compiler/src/util";
import * as moment from "moment";
import { title } from "process";
import { valueSelectbox } from "src/app/shared-model/demoModel";
import { CurrencyModel } from "../../Sale/Quotation/quotation/quotation.component";
import { async } from "rxjs/internal/scheduler/async";
import { ModelException, ModelHiddenButton, ModelProduct } from "src/app/model/ModelCommon";
import { resolve } from "@angular/compiler-cli/src/ngtsc/file_system";
import { ModelGetProductServiceOutput, ModelInsertCreditSalesQuery } from "./../ModelInvoice";
import { ModelMasProduct } from "src/app/model/ModelScaffold";
import { AuthGuard } from "src/app/guards/auth-guard.service";

//----------------------------[ Sub Class ]------------------//

export enum EnumApiStatus {
  Failure = 0, Success = 1, TimeOut = 2
}

export class SAL_CREDITSALE_DT {
  COMP_CODE: string = null;
  BRN_CODE: string = null;
  LOC_CODE: string = null;
  DOC_NO: string = null;
  SEQ_NO: number = null;
  PO_NO: string = null;
  CAR_ID: string = null;
  MILE: number = null;
  PD_ID: string = null;
  PD_BARCODE: string = null;
  PD_NAME: string = null;
  ITEM_TYPE: string = null;
  UNIT_ID: string = null;
  UNIT_NAME: string = null;
  ITEM_QTY: number = null;
  STOCK_QTY: number = null;
  UNIT_PRICE: number = null;
  UNIT_PRICE_CUR: number = null;
  DISC_AMT: number = null;
  DISC_AMT_CUR: number = null;
  SUM_AMT: number = null;
  SUM_AMT_CUR: number = null;
  VAT_TYPE: string = null;
  VAT_RATE: number = null;
  VAT_AMT: number = null;
  VAT_AMT_CUR: number = null;
  TAX_BASE_AMT: number = null;
  TAX_BASE_AMT_CUR: number = null;
}
export class HttpResult<T> {
  totalItems: number = 0;
  items: T[] = null;
}
export class ApiResponse<T> {
  status: EnumApiStatus = EnumApiStatus.Success;
  result: T = null;
  errorMessage: string = "";
  errorStackTrace: string = "";
}
export class ProductService {
  pdId: string = "";
  pdName: string = "";
  pdName2: string = "";
}
//-----------------------[ InvoiceComponent ]---------------------------//
@Component({
  selector: "app-invoice",
  templateUrl: "./Invoice.component.html",
  styleUrls: ["./Invoice.component.scss"],
})
export class InvoiceComponent implements OnInit, AfterViewInit, AfterViewChecked {
  private authPositionRole: any;
  //--------------[ Declare Public Variable ]--------------------//
  ArrCreditSalesDetail: ModelInvoice.ModelCreditSalesDetail[] = [];
  ArrProductService: ProductService[] = [];
  CreditSalesHeader = new ModelInvoice.ModelCreditSalesHeader();
  DocDate: Date = new Date();
  HeaderCard: string = "รายการแจ้งหนี้";
  IntTotalPrice: number = 0;
  IntTotalVat: number = 0;
  IntTotalTaxBase: number = 0;
  IntTotalAmt: number = 0;
  test: string = "";
  HiddenButton = new ModelHiddenButton();
  currencySelect2: valueSelectbox[];
  currencyList: CurrencyModel[] = [];
  myGroup: FormGroup;
  @ViewChild('modalCustomer') _modalCustomer: CustomerModalComponent;
  //--------------[ Declare Private Variable ]----------------//
  private _saoDelete: SweetAlertOptions = {
    allowEnterKey: true,
    allowEscapeKey: true,
    showConfirmButton: true,
    showDenyButton: true,
    confirmButtonText: "ตกลง",
    denyButtonText: "ยกเลิก",
    title: "",
    icon: "question",
    showClass: { popup: "" },
    hideClass: { popup: "" }
  };
  private _arrMasDocPattern: ModelInvoice.ModelMasDocPattern[] = null;
  private _strApiUrl: string = "";
  private _strApiGetProductService = "/api/Invoice/GetProductService";
  private _strApiGetRunningDocNo = "/api/Invoice/GetRunningDocNo";
  private _strCompanyCode: string = "";
  private _strBranchCode: string = "";
  private _strLocationCode: string = "";
  action: string = "";
  //---------------------[ Start ]---------------------------//
  constructor(
    private _activeRoute: ActivatedRoute,
    private _sharedService: SharedService,
    private _date: DatePipe,
    private _httpClient: HttpClient,
    private _serviceInvoice: ServiceInvoice,
    private _router: Router,
    public SvDefault: DefaultService,
    private authGuard: AuthGuard,
  ) {
    this.myGroup = new FormGroup({
      currency: new FormControl(),
      remarks: new FormControl(),
      searchCustomer: new FormControl(),
      searchProduct: new FormControl(),
      searchQuotation: new FormControl(),
    });
    // if(!this.SvDefault.CheckSession()){
    //   return;
    // }

  }

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  async ngOnInit(): Promise<void> {
    await this.SvDefault.DoActionAsync(async () => await this.startAsync(), true);
  };

  private async startAsync() {
    this.authPositionRole = this.SvDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }

    this._strApiUrl = (this._sharedService.urlSale || "").toString().trim();
    this._strCompanyCode = (this._sharedService.compCode || "").toString().trim();
    this._strBranchCode = (this._sharedService.brnCode || "").toString().trim();
    this._strLocationCode = (this._sharedService.locCode || "").toString().trim();

    // let pm = new Promise<ParamMap>((resolve , reject)=>{
    //   let queryParamMap$ = this._activeRoute.queryParamMap.subscribe(x=>{
    //     resolve(x);
    //   } ,e=> reject(e) );
    // });
    // let paramMap: ParamMap = await pm;
    // let strDocNo = (paramMap?.get("DocNo") || "").toString().trim();
    let strGuid = (this._activeRoute.snapshot.params.DocGuid || "").toString().trim();
    if (strGuid === "New") {
      this.action = "New";
      await this.newCreditSaleHeader();
    } else {
      this.action = "Edit";
      // await this.getCreditSale(strDocNo);
      await this.getCreditSaleByGuid(strGuid);
    }
    this.myGroup.controls['currency'].setValue(this.CreditSalesHeader.currency);
    this.myGroup.controls['currency'].disable();
    this.getCurrencySelect2();
    this.HiddenButton = this.SvDefault.GetHiddenButton2(this.CreditSalesHeader.docStatus, this.CreditSalesHeader.post);
  }

  ngAfterViewInit() {
    this.SvDefault.DoAction(() => this.SvDefault.RemoveNavBorder());
  }
  ngAfterViewChecked() {

  }

  async ClearDocument() {
    this.SvDefault.DoActionAsync(async () => {
      if (await this.SvDefault.ShowClearDialogAsync()) {
        await this.startAsync();
      }
    });
  }
  //--------------------------[ Private Function ]--------------------------//
  private getCreditSale3(pStrDocNo: string) {
    fetch(this._sharedService.urlSale + "/api/Invoice/GetCreditSales", {
      method: 'get',
      headers: {
        'Accept': 'application/json, text/plain, */*',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ DocNo: pStrDocNo, LocCode: "", BrnCode: "", CompCode: "" })
    }).then(res => res.json())
      .then(res => console.log(res));
  }
  private async getCreditSaleByGuid(pStrGuid: string) {
    let getCreditSales = await this._serviceInvoice.GetCreditSalesByGuid(pStrGuid);
    if(!this.SvDefault.CheckDocBrnCode(getCreditSales?.result?.creditSaleHeader?.brnCode)){
      return;
    }
    if (getCreditSales.status === ModelInvoice.EnumApiStatus.Success) {
      this.DocDate = <Date>getCreditSales?.result?.creditSaleHeader?.docDate;
      this.CreditSalesHeader = getCreditSales.result?.creditSaleHeader || this.CreditSalesHeader;
      // this.CreditSalesHeader.period = this.CreditSalesHeader?.period?.split("/").reverse().join("-") || "";
      this.ArrCreditSalesDetail = getCreditSales.result?.arrCreditSaleDetail || this.ArrCreditSalesDetail;
      this.ArrCreditSalesDetail.forEach((element) => {

        if (this.CreditSalesHeader.posNo === 'SITE') {
          if (element.meterStart === 0 && element.meterFinish === 1 && element.itemQty === 1) {
            element.isSite = true;
          }
          else {
            element.isSite = false;
          }
        }
      });

      this.CreditSalesHeader.updatedBy = (this._sharedService.user || "").toString().trim();
      this.calculateSummary();
    } else {
      let err = <Error>{
        message: getCreditSales.errorMessage,
        stack: getCreditSales.errorStackTrace
      };
      throw err;
    }
  }

  private async getCreditSale(pStrDocNo: string): Promise<void> {
    Swal.showLoading();
    let getCreditSales = await this._serviceInvoice.GetCreditSales(pStrDocNo).toPromise();
    Swal.close();
    if (getCreditSales.status === ModelInvoice.EnumApiStatus.Success) {
      this.DocDate = <Date>getCreditSales?.result?.creditSaleHeader?.docDate;
      this.CreditSalesHeader = getCreditSales.result?.creditSaleHeader || this.CreditSalesHeader;
      this.CreditSalesHeader.period = this.CreditSalesHeader?.period?.split("/").reverse().join("-") || "";
      this.ArrCreditSalesDetail = getCreditSales.result?.arrCreditSaleDetail || this.ArrCreditSalesDetail;
      this.CreditSalesHeader.updatedBy = (this._sharedService.user || "").toString().trim();
      this.calculateSummary();
    } else {
      let err = <Error>{
        message: getCreditSales.errorMessage,
        stack: getCreditSales.errorStackTrace
      };
      throw err;
    }
    // this._serviceInvoice.GetCreditSales(pStrDocNo).subscribe(x=>{
    // });
  }
  private getProductService(): void {
    if (this._strApiUrl === "") {
      return;
    }
    let _that = this;
    this._httpClient.get<HttpResult<ProductService>>(this._strApiUrl + this._strApiGetProductService).subscribe((pData) => {
      if (pData == null || !pData.hasOwnProperty("items") || !Array.isArray(pData.items) || !pData.items.length) {
        return;
      }
      _that.ArrProductService = pData.items;
    });
  }
  private async newCreditSaleHeader(): Promise<void> {
    this.ArrCreditSalesDetail = [];
    this.CreditSalesHeader = new ModelInvoice.ModelCreditSalesHeader();
    this.CreditSalesHeader.docStatus = ModelInvoice.EnumDocStatus.New;
    this.CreditSalesHeader.createdBy = this._sharedService.user;
    this.CreditSalesHeader.locCode = this._strLocationCode;
    this.CreditSalesHeader.brnCode = this._strBranchCode;
    this.CreditSalesHeader.compCode = this._strCompanyCode;
    // this.CreditSalesHeader.createdDate = new Date();
    this.CreditSalesHeader.docDate = this._sharedService.systemDate;
    this.DocDate = this._sharedService.systemDate;
    this.CreditSalesHeader.guid = this.newGuid();
    // this.CreditSalesHeader.updatedDate = new Date();
    this.CreditSalesHeader.docType = "Invoice";
    if (this._sharedService.systemDate === null) {
      this.CreditSalesHeader.period = "";
    } else {
      let strYear = this._sharedService?.systemDate?.getFullYear()?.toString() || "";
      let strMonth = (this._sharedService.systemDate.getMonth() + 1).toString().padStart(2, "0");
      //this.CreditSalesHeader.period = strYear + "-" + strMonth;
      this.CreditSalesHeader.period = strMonth + "/" + strYear;

    }
    this.CreditSalesHeader.docNo = "";
    this.CreditSalesHeader.discRate = "0";
    let pArrMasDocPattern = await this.SvDefault.GetPatternAsync("Invoice");
    let strPattern = this.SvDefault.GenPatternString(
      this._sharedService.systemDate,
      pArrMasDocPattern,
      this._strCompanyCode,
      this._strBranchCode
    );
    this.CreditSalesHeader.docNo = strPattern;
    this.CreditSalesHeader.docPattern = strPattern;
    this._arrMasDocPattern = pArrMasDocPattern;
    // this.getRunningDocNo(this._strCompanyCode, this._strBranchCode , this._strLocationCode , x=> this.CreditSalesHeader.docNo = x );

  }
  private newGuid(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  private getRunningDocNo(pStrCompanyCode: string, pStrBranchCode: string, pStrLocationCode: string, pCallback: (pStrDocNo: string) => void) {
    let httpParam: HttpParams = new HttpParams();
    httpParam.append("COMP_CODE", this._strCompanyCode);
    httpParam.append("BRN_CODE", this._strBranchCode);
    httpParam.append("LOC_CODE", this._strLocationCode);
    let strApiUrl = this._strApiUrl + this._strApiGetRunningDocNo;
    this._httpClient.get<ApiResponse<string>>(strApiUrl, { params: httpParam }).subscribe(x => {
      switch (x.status) {
        case EnumApiStatus.Success:
          if (typeof (pCallback) === "function") {
            pCallback(x.result);
          }
          break;
        case EnumApiStatus.Failure:
          break;
        case EnumApiStatus.TimeOut:
          break;
        default:
          break;
      }
    });
  }

  private calculateSummary() {
    let fltTotalSubAmt = 0.00;
    let fltTaxBaseAmt = 0.00;
    let fltVatAmt = 0.00;
    let fltNetAmt = 0.00;
    let fltDiscAmt = 0.00;
    if (Array.isArray(this.ArrCreditSalesDetail) && this.ArrCreditSalesDetail.length) {
      for (let i = 0; i < this.ArrCreditSalesDetail.length; i++) {
        let dtItem = this.ArrCreditSalesDetail[i];
        fltTotalSubAmt += dtItem.subAmt || 0.00;
        fltTaxBaseAmt += dtItem.taxBaseAmt || 0.00;
        fltVatAmt += dtItem.vatAmt || 0.00;
        fltNetAmt += dtItem.totalAmt || 0.00;
        fltDiscAmt += (dtItem.subAmt || 0.00) - (dtItem.discHdAmt || 0.00);
      }
    }
    this.CreditSalesHeader.subAmt = fltTotalSubAmt;
    this.CreditSalesHeader.taxBaseAmt = fltTaxBaseAmt;
    this.CreditSalesHeader.vatAmt = fltVatAmt;
    this.CreditSalesHeader.netAmt = fltNetAmt;
    this.CreditSalesHeader.totalAmt = fltDiscAmt;
  }
  CalculateHeaderDiscount = () => this.SvDefault.DoAction(() => {
    for (let i = 0; i < this.ArrCreditSalesDetail.length; i++) {
      let dt = this.ArrCreditSalesDetail[i];
      dt.discHdAmt = dt.subAmt * this.CreditSalesHeader.discAmt / this.CreditSalesHeader.subAmt;
      this.calculateCreditDetail(dt);
    }
    this.calculateSummary();
  });

  private calculateSummaryOld() {
    if (Array.isArray(this.ArrCreditSalesDetail) && this.ArrCreditSalesDetail.length) {
      this.IntTotalPrice = this.ArrCreditSalesDetail?.map(x => x.subAmt)?.reduce((p, c) => p + c) || 0;
      this.IntTotalVat = this.ArrCreditSalesDetail?.map(x => x.vatAmt)?.reduce((p, c) => p + c) || 0;
      this.IntTotalTaxBase = this.ArrCreditSalesDetail?.map(x => x.taxBaseAmt)?.reduce((p, c) => p + c) || 0;
      this.IntTotalAmt = this.ArrCreditSalesDetail?.map(x => x.totalAmt)?.reduce((p, c) => p + c) || 0;
    } else {
      this.IntTotalPrice = 0;
      this.IntTotalVat = 0;
      this.IntTotalTaxBase = 0;
      this.IntTotalAmt = 0;
    }

  }

  private validateData(): boolean {
    let strCusCode = (this.CreditSalesHeader?.custCode || "").toString().trim();
    if (strCusCode === "") {
      Swal.fire("กรุณาเลือกลูกค้า", "", "warning")
        .then(x => setTimeout(() => document.getElementById("btnSearchCustomer").focus(), 500));
      return false;
    }
    let strPeriod = (this.CreditSalesHeader?.period || "").toString().trim();
    if (strPeriod === "") {
      Swal.fire("กรุณาเลือกเดือน", "", "warning")
        .then(x => setTimeout(() => document.getElementById("txtPeriod").focus(), 500));
      return false;
    }
    if (!Array.isArray(this.ArrCreditSalesDetail) || !this.ArrCreditSalesDetail.length) {
      Swal.fire("กรุณาเลือกรายการสินค้า", "", "warning")
        .then(x => setTimeout(() => document.getElementById("btnSearchProduct").focus(), 500));
      return false;
    }

    let creditSaleHeaders = this.ArrCreditSalesDetail.some(x => x.subAmt <= 0);
    if (this.CreditSalesHeader.posNo !== 'SITE' && creditSaleHeaders) {
      Swal.fire("จำนวนเงินต้องมีค่ามากกว่า 0", "", "warning");
      return false;
    }
    else {
      let electricBill = this.ArrCreditSalesDetail.find(x => x.pdId === '90575');
      let waterBill = this.ArrCreditSalesDetail.find(x => x.pdId === '90581');

      if (electricBill != null && electricBill.meterFinish <= 0 && electricBill.itemQty > 0) {
        Swal.fire("มิเตอร์ค่าไฟฟ้าสิ้นสุดต้องมีค่ามากกว่า 0", "", "warning");
        return false;
      }

      if (waterBill != null && waterBill.meterFinish <= 0 && waterBill.itemQty > 0) {
        Swal.fire("มิเตอร์ค่าน้ำประปาสิ้นสุดต้องมีค่ามากกว่า 0", "", "warning");
        return false;
      }
    }

    return true;
  }

  public async CheckSubAmtBeforeSave() {
    let creditSaleHeaders = this.ArrCreditSalesDetail.some(x => x.subAmt <= 0);
    if (this.CreditSalesHeader.posNo === 'SITE' && creditSaleHeaders) {
      Swal.fire({
        allowEscapeKey: false,
        allowOutsideClick: false,
        confirmButtonText: "ตกลง",
        denyButtonText: "ยกเลิก",
        icon: 'warning',
        showDenyButton: true,
        title: 'คุณต้องบันทึกจำนวนเงินเท่ากับ 0 ใช่หรือไม่?',
      }).then(async (result) => {
        if (result.isConfirmed) {
          this.SaveCreditSales();
        }
      })
    }
    else {
      this.SaveCreditSales();
    }
  }

  //-----------------------[ Public Function ]-------------------------------//
  async CancelCreditSales() {
    await this.SvDefault.DoActionAsync(async () => await this.cancelCreditSalesAsync(), true);
  }
  private async cancelCreditSalesAsync(): Promise<void> {
    if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isCancel")) {
      this.SvDefault.ShowPositionRoleMessage("IsCancel");
      return;
    }

    if (await this.SvDefault.ShowCancelDialogAsync()) {
      this.CreditSalesHeader.docStatus = ModelInvoice.EnumDocStatus.Cancel;
      await this.SaveCreditSales();
    }
  }
  async CompleteDocument() {
    await this.SvDefault.DoActionAsync(async () => {
      this.HiddenButton.status = "พร้อมใช้";
      this.CreditSalesHeader.docStatus = ModelInvoice.EnumDocStatus.Ready;
      await this.saveAsync();
    }, true);
  };
  async RejectDocument(): Promise<void> {
    await this.SvDefault.DoActionAsync(async () => {
      this.HiddenButton.status = "แอคทีฟ";
      this.CreditSalesHeader.docStatus = ModelInvoice.EnumDocStatus.Active;
      await this.saveAsync();
    }, true);
  };

  async ApproveDocument() {
    await this.SvDefault.DoActionAsync(async () => {
      this.HiddenButton.status = "พร้อมใช้";
      this.CreditSalesHeader.docStatus = ModelInvoice.EnumDocStatus.Ready;
      await this.saveAsync();
    }, true);
  };
  async SaveCreditSales() {
    await this.SvDefault.DoActionAsync(async () => await this.saveAsync(), true);
  }
  private async saveAsync() {
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
    
    if (!(await this.SvDefault.CheckSessionAsync() && this.validateData())) {
      return;
    }

    let intCurRate: number = this.CreditSalesHeader.curRate || 1;
    for (let i = 0; i < this.ArrCreditSalesDetail.length; i++) {
      let element = this.ArrCreditSalesDetail[i];
      element.seqNo = i + 1;
      element.sumItemAmtCur = element.sumItemAmt * intCurRate;
      element.subAmtCur = element.subAmt * intCurRate;
      element.discAmtCur = element.discAmt * intCurRate;
      element.discHdAmtCur = element.discHdAmt * intCurRate;
      element.taxBaseAmtCur = element.taxBaseAmt * intCurRate;
      element.vatAmtCur = element.vatAmt * intCurRate;
      element.totalAmtCur = element.totalAmt * intCurRate;
      element.unitPriceCur = element.unitPrice * intCurRate;
    }
    this.CreditSalesHeader.discAmtCur = (this.CreditSalesHeader.discAmt * intCurRate) || 0;
    this.CreditSalesHeader.netAmtCur = (this.CreditSalesHeader.netAmt * intCurRate) || 0;
    this.CreditSalesHeader.subAmtCur = (this.CreditSalesHeader.subAmt * intCurRate) || 0;
    this.CreditSalesHeader.taxBaseAmtCur = (this.CreditSalesHeader.taxBaseAmt * intCurRate) || 0;
    this.CreditSalesHeader.totalAmtCur = (this.CreditSalesHeader.totalAmt * intCurRate) || 0;
    this.CreditSalesHeader.vatAmtCur = (this.CreditSalesHeader.vatAmt * intCurRate) || 0;
    // this.CreditSalesHeader.period = this.CreditSalesHeader.period.split("-").reverse().join("/");
    for (let i = 0; i < this.ArrCreditSalesDetail.length; i++) {
      const dt = this.ArrCreditSalesDetail[i];
      if (dt == null) {
        continue;
      }
      dt.isFree = false;
      dt.licensePlate = "";
      dt.mile = 0;
      dt.stockQty = dt.itemQty;
      dt.refPrice = 0;
      dt.refPriceCur = 0;
    }
    switch (this.CreditSalesHeader.docStatus) {
      case ModelInvoice.EnumDocStatus.New:
        this.CreditSalesHeader.post = "N";
        let creditSale: ModelInsertCreditSalesQuery = await this.addNewCreditSales();
        if (creditSale != null && creditSale.creditSaleHeader != null) {
          // creditSale.creditSaleHeader.period = creditSale.creditSaleHeader.period.split("/").reverse().join("-") || "";
          this.CreditSalesHeader = creditSale.creditSaleHeader;
          // this.HiddenButton = this.SvDefault.GetHiddenButton2(this.CreditSalesHeader.docStatus , this.CreditSalesHeader.post);
        }
        break;
      // case ModelInvoice.EnumDocStatus.Active :
      default:
        await this.editCreditSales();
        break;
    }
    await this.SvDefault.ShowSaveCompleteDialogAsync();
    window.location.href = "../Invoice/" + this.CreditSalesHeader.guid;
    // this.CreditSalesHeader.period = this.CreditSalesHeader?.period?.split("/")?.reverse()?.join("-") || "";
    //this.HiddenButton = this.SvDefault.GetHiddenButton2(this.CreditSalesHeader.docStatus, this.CreditSalesHeader.post);
  }

  private async addNewCreditSales(): Promise<ModelInvoice.ModelInsertCreditSalesQuery> {
    // this.CreditSalesHeader.docDate = this._sharedService?.systemDate?.toISOString()?.split("T")[0];
    this.CreditSalesHeader.docDate = this._sharedService?.systemDate?.toLocaleDateString("pt-br").split('/').reverse().join('-');
    this.CreditSalesHeader.createdBy = (this._sharedService?.user || "").toString().trim();
    Swal.showLoading();
    let result: ModelInvoice.ModelInsertCreditSalesQuery = null;
    result = await this._serviceInvoice.InserCreditSales2(this.CreditSalesHeader, this.ArrCreditSalesDetail);
    Swal.close();
    return result;
    //this.CreditSalesHeader = result.CreditSaleHeader;
    // this.ArrCreditSalesDetail = creditSale.ArrCreditSaleDetail;
  }
  AddNewCreditSalesOld() {
    this.CreditSalesHeader.docStatus = ModelInvoice.EnumDocStatus.Active;
    //this.CreditSalesHeader.docDate = this.SvDefault.GetRealDate(this._sharedService.systemDate);
    this.CreditSalesHeader.docDate = this._sharedService?.systemDate?.toISOString()?.slice(0, 10);
    // this.CreditSalesHeader.totalAmt = this.IntTotalPrice;
    Swal.showLoading();
    this._serviceInvoice.InserCreditSales(this.CreditSalesHeader, this.ArrCreditSalesDetail).subscribe(x => {
      Swal.hideLoading();
      if (x.status === ModelInvoice.EnumApiStatus.Success && x.result) {
        Swal.fire("บันทึกสำเร็จ", "", "success");
        //.then(x=> this._router.navigate(["/InvoiceList"]));
      } else {
        Swal.fire("Error", `<h3>${x.errorMessage}</h3><br/><h4>${x.errorStackTrace}</h4>`, "error");
      }
    }, err => {
      Swal.hideLoading();
      console.log(err);
    });
  }

  private async editCreditSales(): Promise<void> {
    this.CreditSalesHeader.updatedDate = new Date();
    this.CreditSalesHeader.updatedBy = this._sharedService.user;
    let x = await this._serviceInvoice.UpdateCreditSales(this.CreditSalesHeader, this.ArrCreditSalesDetail).toPromise()
    if (x.status === ModelInvoice.EnumApiStatus.Success && x.result) {
      Swal.fire("บันทึกสำเร็จ", "", "success");
    } else {
      let err = <Error>{
        message: x.errorMessage,
        stack: x.errorStackTrace
      };
      throw err;
    }

  }

  EditCreditSales() {
    // this.CreditSalesHeader.totalAmt = this.IntTotalPrice;
    this.CreditSalesHeader.updatedDate = new Date();
    this.CreditSalesHeader.updatedBy = this._sharedService.user;
    this._serviceInvoice.UpdateCreditSales(this.CreditSalesHeader, this.ArrCreditSalesDetail).subscribe(x => {
      if (x.status === ModelInvoice.EnumApiStatus.Success && x.result) {
        Swal.fire("บันทึกสำเร็จ", "", "success");
        //.then(x=> this._router.navigate(["/InvoiceList"]));
      } else {
        Swal.fire("Error", `<h3>${x.errorMessage}</h3><br/><h4>${x.errorStackTrace}</h4>`, "error");
      }
    }, err => {
      console.log(err);
    });
  }



  private calculateCreditDetail(pCreditSaleDetail: ModelInvoice.ModelCreditSalesDetail): void {
    let intFinish: number = pCreditSaleDetail.meterFinish || 0.00;
    let intStart: number = pCreditSaleDetail.meterStart || 0.00;
    let intUnitPrice: number = pCreditSaleDetail?.unitPrice || 0.00;
    let intDiscAmt = pCreditSaleDetail.discAmt || 0.00;

    if (intFinish > 0 && intStart > 0) {
      pCreditSaleDetail.itemQty = intFinish - intStart;
    }

    pCreditSaleDetail.sumItemAmt = pCreditSaleDetail.itemQty * intUnitPrice;

    if (pCreditSaleDetail.itemQty < 0) {
      Swal.fire("หน่วยที่ใช้ต้องไม่น้อยกว่า 0", "", "info");
    }
    else if (pCreditSaleDetail.itemQty > 0) {
      if (intDiscAmt < 0) {
        intDiscAmt = 0;
        pCreditSaleDetail.discAmt = intDiscAmt;
        Swal.fire("ห้ามใส่ส่วนลดติดลบ", "", "info");
      } else if (intDiscAmt > pCreditSaleDetail.sumItemAmt) {
        intDiscAmt = pCreditSaleDetail.sumItemAmt;
        pCreditSaleDetail.discAmt = intDiscAmt;
        Swal.fire("ห้ามใส่ส่วนลดเกินราคาสินค้า", "", "info");
      }
    }

    // if (intDiscAmt < 0) {
    //   intDiscAmt = 0;
    //   pCreditSaleDetail.discAmt = intDiscAmt;
    //   Swal.fire("ห้ามใส่ส่วนลดติดลบ", "", "info");
    // } else if (intDiscAmt > pCreditSaleDetail.sumItemAmt) {
    //   intDiscAmt = pCreditSaleDetail.sumItemAmt;
    //   pCreditSaleDetail.discAmt = intDiscAmt;
    //   Swal.fire("ห้ามใส่ส่วนลดเกินราคาสินค้า", "", "info");
    // }

    pCreditSaleDetail.subAmt = pCreditSaleDetail.sumItemAmt - intDiscAmt;  //pCreditSaleDetail.itemQty * intUnitPrice;
    let intVatRate = pCreditSaleDetail.vatRate || 0.00;
    switch (pCreditSaleDetail.vatType) {
      case ModelInvoice.EnumVatType.VI:
        pCreditSaleDetail.totalAmt = pCreditSaleDetail.subAmt - pCreditSaleDetail.discHdAmt;
        pCreditSaleDetail.taxBaseAmt = pCreditSaleDetail.totalAmt * 100 / (pCreditSaleDetail.vatRate + 100);
        pCreditSaleDetail.vatAmt = (pCreditSaleDetail.taxBaseAmt * pCreditSaleDetail.vatRate) / 100;
        break;
      case ModelInvoice.EnumVatType.VE:
        pCreditSaleDetail.taxBaseAmt = pCreditSaleDetail.subAmt - pCreditSaleDetail.discHdAmt;
        pCreditSaleDetail.totalAmt = pCreditSaleDetail.taxBaseAmt * (pCreditSaleDetail.vatRate + 100) / 100;
        pCreditSaleDetail.vatAmt = pCreditSaleDetail.taxBaseAmt * pCreditSaleDetail.vatRate / 100;
        break;
      default:
        pCreditSaleDetail.taxBaseAmt = pCreditSaleDetail.subAmt - pCreditSaleDetail.discHdAmt;
        pCreditSaleDetail.totalAmt = pCreditSaleDetail.taxBaseAmt;
        pCreditSaleDetail.vatAmt = 0;
        break;
    }
  }

  CalculateUnitPrice(pCreditSaleDetail: ModelInvoice.ModelCreditSalesDetail): void {
    this.SvDefault.DoAction(() => {
      this.calculateCreditDetail(pCreditSaleDetail);
      this.calculateSummary();
    });
  }
  CalculateUnitPriceOld(pCreditSaleDetail: ModelInvoice.ModelCreditSalesDetail): void {
    let intFinish: number = pCreditSaleDetail.meterFinish || 0.00;
    let intStart: number = pCreditSaleDetail.meterStart || 0.00;
    pCreditSaleDetail.itemQty = intFinish - intStart;
    let intUnitPrice: number = pCreditSaleDetail?.unitPrice || 0.00;
    pCreditSaleDetail.subAmt = pCreditSaleDetail.itemQty * intUnitPrice;
    let intVatRate = pCreditSaleDetail.vatRate || 0.00;
    switch (pCreditSaleDetail.vatType) {
      case ModelInvoice.EnumVatType.VI:
        pCreditSaleDetail.taxBaseAmt = pCreditSaleDetail.subAmt * 100 / (pCreditSaleDetail.vatRate + 100);
        pCreditSaleDetail.vatAmt = pCreditSaleDetail.subAmt - pCreditSaleDetail.taxBaseAmt;
        pCreditSaleDetail.totalAmt = pCreditSaleDetail.subAmt;
        break;
      case ModelInvoice.EnumVatType.VE:
        pCreditSaleDetail.vatAmt = intVatRate * pCreditSaleDetail.subAmt / 100;
        // pCreditSaleDetail.taxBaseAmt = pCreditSaleDetail.subAmt + pCreditSaleDetail.vatAmt;
        pCreditSaleDetail.totalAmt = pCreditSaleDetail.subAmt + pCreditSaleDetail.vatAmt;
        pCreditSaleDetail.taxBaseAmt = pCreditSaleDetail.subAmt;
        break;
      default:
        pCreditSaleDetail.taxBaseAmt = pCreditSaleDetail.subAmt;
        pCreditSaleDetail.totalAmt = pCreditSaleDetail.subAmt;
        pCreditSaleDetail.vatAmt = 0;
        break;
    }
    this.calculateSummary();
  }
  GetBackgroundRibbon(): string {
    let result = "";
    this.SvDefault.DoAction(() => result = this.SvDefault.GetBackgroundRibbon(this.CreditSalesHeader.docStatus));
    return result;
    // if(this.CreditSalesHeader == null){
    //   return "";
    // }
    // let classStatus = "ribbon-1 ribbon tooltipa statusBase"
    // switch (this.CreditSalesHeader.docStatus) {
    //   case ModelInvoice.EnumDocStatus.Cancel :
    //     classStatus += " statusCancel ";
    //     break;
    //   case ModelInvoice.EnumDocStatus.New :
    //     classStatus += " statusNew ";
    //     break;
    //   case ModelInvoice.EnumDocStatus.Ready :
    //   case ModelInvoice.EnumDocStatus.Active :
    //     classStatus += " statusReady ";
    //     break;
    //   case ModelInvoice.EnumDocStatus.Reference :
    //     classStatus += " statusReference ";
    //     break;
    //   case ModelInvoice.EnumDocStatus.Save :
    //     classStatus += " statusSave ";
    //     break;
    //   default:
    //     break;
    // }
    // return classStatus;
  }
  ReceiveCustomer(pCustomer: ModelInvoice.ModelGetCustomerListOutput) {
    this.SvDefault.DoAction(() => {
      if (pCustomer == null) {
        return;
      }
      let strCusPrefix: string = this.SvDefault.GetString(pCustomer.CustPrefix);
      let strCusName: string = this.SvDefault.GetString(pCustomer.CustName);
      this.CreditSalesHeader.custCode = (pCustomer.CustCode || "").toString().trim();
      this.CreditSalesHeader.custAddr1 = (pCustomer.CustAddr1 || "").toString().trim();
      this.CreditSalesHeader.custAddr2 = (pCustomer.CustAddr2 || "").toString().trim();
      this.CreditSalesHeader.custName = `${strCusPrefix} ${strCusName}`;
      this.CreditSalesHeader.citizenId = this.SvDefault.GetString(pCustomer.CitizenId);
      // this.CreditSalesHeader.custName = (pCustomer.CustName || "").toString().trim();
    });
  }
  async RemoveCreditSalesDetail(pIntRowIndex: number): Promise<void> {
    await this.SvDefault.DoActionAsync(async () => {
      if (this.CreditSalesHeader.docStatus === ModelInvoice.EnumDocStatus.Cancel
        || this.CreditSalesHeader.docStatus === ModelInvoice.EnumDocStatus.Reference) {
        return;
      }
      this._saoDelete.title = "คูณแน่ใจหรือที่จะยกเลิกรายการนี้";
      let sarDelete: SweetAlertResult<any> = await Swal.fire(this._saoDelete);
      if (sarDelete.isConfirmed) {
        this.ArrCreditSalesDetail.splice(pIntRowIndex, 1);
        this.calculateSummary();
      }
    });
  }
  async RemoveCreditSalesDetailAll(): Promise<void> {
    await this.SvDefault.DoActionAsync(async () => {
      if (this.CreditSalesHeader.docStatus === ModelInvoice.EnumDocStatus.Cancel
        || this.CreditSalesHeader.docStatus === ModelInvoice.EnumDocStatus.Reference
        || !Array.isArray(this.ArrCreditSalesDetail)
        || !this.ArrCreditSalesDetail.length) {
        return;
      }
      this._saoDelete.title = "คูณแน่ใจหรือที่จะยกเลิกรายการทั้งหมด";
      let sarDeleteAll: SweetAlertResult<any> = await Swal.fire(this._saoDelete);
      if (sarDeleteAll.isConfirmed) {
        this.ArrCreditSalesDetail = [];
        this.calculateSummary();
      }
    });
  }
  async ShowProductModal() {
    await this.SvDefault.DoActionAsync(async () => await this.showModalProduct());
  }
  private async showModalProduct() {
    let arrSelectProduct = this.ArrCreditSalesDetail.map(x => <ModelMasProduct>{
      //SeqNo: x.seqNo,
      PdId: x.pdId,
      PdName: x.pdName,
      //status: "Select",
      VatRate: x.vatRate,
      VatType: x.vatType
    }) || [];
    let arrAllProduct = await this.SvDefault.GetProductAsync();
    if (!this.SvDefault.IsArray(arrAllProduct)) {
      return;
    }
    let arrAllProduct2 = arrAllProduct.map(x => {
      let product = new ModelMasProduct();
      this.SvDefault.CopyObject(x, product);
      return product;
    });
    let arrSelectProduct2 = await this.SvDefault.ShowModalProduct2(arrAllProduct2, arrSelectProduct, true);
    let arrProduct = arrSelectProduct2.map((v, i) => <ModelGetProductServiceOutput>{
      seqNo: i,
      pdId: v.PdId,
      pdName: v.PdName,
      status: ModelInvoice.EnumProductStatus.Select,
      vatRate: v.VatRate,
      vatType: v.VatType,
    });
    this.SelectProduct(arrProduct);
  }

  async ShowProductModalOld() {
    await this.SvDefault.DoActionAsync(async () => {
      let arrSelectProduct: ModelProduct[] = this.ArrCreditSalesDetail.map(x => <ModelProduct>{
        seqNo: x.seqNo,
        pdId: x.pdId,
        pdName: x.pdName,
        status: "Select",
        vatRate: x.vatRate,
        vatType: x.vatType
      }) || [];
      arrSelectProduct = await this.SvDefault.ShowModalProductAsync(arrSelectProduct);
      if (!(Array.isArray(arrSelectProduct) && arrSelectProduct.length)) {
        return;
      }
      let arrProduct = arrSelectProduct.map(v => <ModelGetProductServiceOutput>{
        seqNo: v.seqNo,
        pdId: v.pdId,
        pdName: v.pdName,
        status: ModelInvoice.EnumProductStatus.Select,
        vatRate: v.vatRate,
        vatType: v.vatType,
      });
      this.SelectProduct(arrProduct);
    });
  }


  SelectProduct(pArrSelectProduct: ModelInvoice.ModelGetProductServiceOutput[]): void {
    this.SvDefault.DoAction(() => {
      if (Array.isArray(pArrSelectProduct) && pArrSelectProduct.length) {
        if (!Array.isArray(this.ArrCreditSalesDetail) || !this.ArrCreditSalesDetail.length) {
          this.ArrCreditSalesDetail = [];
        }
        // let selectCreditSaleDetail: ModelInvoice.ModelCreditSalesDetail[] = pArrSelectProduct
        //   .filter(x => !this.ArrCreditSalesDetail.some(y => x.pdId === y.pdId && x.seqNo === y.seqNo))
        //   .map((x, i) => <ModelInvoice.ModelCreditSalesDetail>{
        //     brnCode: this._strBranchCode,
        //     compCode: this._strCompanyCode,
        //     locCode: this._strLocationCode,
        //     docNo: this.CreditSalesHeader.docNo,
        //     docType: this.CreditSalesHeader.docType,
        //     seqNo: x.seqNo,
        //     pdId: x.pdId,
        //     pdName: x.pdName,
        //     meterFinish: 1,
        //     meterStart: 0,
        //     itemQty: 1,
        //     subAmt: 0,
        //     vatAmt: 0,
        //     vatType: x.vatType,
        //     vatRate: x.vatRate,
        //     taxBaseAmt: 0,
        //     unitPrice: 0,
        //     totalAmt: 0,
        //     discAmt: 0,
        //     discHdAmt: 0,
        //     sumItemAmt: 0,
        //   });
        // this.ArrCreditSalesDetail = [...this.ArrCreditSalesDetail, ...selectCreditSaleDetail];

        let selectCreditSaleDetail: ModelInvoice.ModelCreditSalesDetail[] = pArrSelectProduct
          .map((x, i) => <ModelInvoice.ModelCreditSalesDetail>{
            brnCode: this._strBranchCode,
            compCode: this._strCompanyCode,
            locCode: this._strLocationCode,
            docNo: this.CreditSalesHeader.docNo,
            docType: this.CreditSalesHeader.docType,
            seqNo: x.seqNo,
            pdId: x.pdId,
            pdName: x.pdName,
            meterFinish: 1,
            meterStart: 0,
            itemQty: 1,
            subAmt: 0,
            vatAmt: 0,
            vatType: x.vatType,
            vatRate: x.vatRate,
            taxBaseAmt: 0,
            unitPrice: 0,
            totalAmt: 0,
            discAmt: 0,
            discHdAmt: 0,
            sumItemAmt: 0,
          });

        let listMapNew: ModelInvoice.ModelCreditSalesDetail[] = [];

        selectCreditSaleDetail.forEach(x => {
          let mapData = this.ArrCreditSalesDetail.find(y => y.pdId == x.pdId);
          if (typeof mapData != "undefined") {
            listMapNew.push(mapData)
          } else {
            listMapNew.push(x)
          }
        });

        this.ArrCreditSalesDetail = listMapNew;
        this.calculateSummary();
      }
    });
  }
  SelectProduct2(pArrSelectProduct: ModelInvoice.ModelGetProductServiceOutput[]): void {
    // this.ArrCreditSalesDetail = [];
    if (Array.isArray(pArrSelectProduct) && pArrSelectProduct.length) {
      if (Array.isArray(this.ArrCreditSalesDetail) && this.ArrCreditSalesDetail.length) {
        pArrSelectProduct.filter(x => !this.ArrCreditSalesDetail.some(y => x.pdId === y.pdId))
      } else {
        this.ArrCreditSalesDetail = pArrSelectProduct.map((x, i) => <ModelInvoice.ModelCreditSalesDetail>{
          brnCode: this._sharedService.brnCode,
          compCode: this._sharedService.compCode,
          locCode: this._sharedService.locCode,
          docNo: this.CreditSalesHeader.docNo,
          seqNo: i,
          pdId: x.pdId,
          pdName: x.pdName,
          meterFinish: 1,
          meterStart: 0,
          itemQty: 1,
          subAmt: 0,
          vatAmt: 0,
          vatType: x.vatType,
          vatRate: x.vatRate,
          taxBaseAmt: 0,
          unitPrice: 0,

        });
      }
      this.calculateSummary();
    }
  }
  ShowCustomerModal(): void {
    this.SvDefault.DoAction(() => this._modalCustomer.ShowModal());
  }
  private getCurrencySelect2 = (): void => {
    this.currencySelect2 = [];
    this.currencyList = [
      {
        "Currency": "THB",
        "Rate": 1
      }//,
      // {
      //   "Currency": "USD",
      //   "Rate": 30.6267
      // },
      // {
      //   "Currency": "EUR",
      //   "Rate": 36.6329
      // },
      // {
      //   "Currency": "AUD",
      //   "Rate": 23.7432
      // },
    ];

    this.currencyList.forEach(element => {
      this.currencySelect2.push({ KEY: element.Currency.toString(), VALUE: element.Currency.toString() });
    });
  }


  changeCurrency = () => this.SvDefault.DoAction(() => {
    var cur = this.myGroup.get('currency').value;
    if (cur != "" && cur != null) {
      var curObj = this.currencyList.find((row, index) => row.Currency == cur);
      this.CreditSalesHeader
      this.CreditSalesHeader.currency = curObj.Currency;
      this.CreditSalesHeader.curRate = curObj.Rate;
    }
    else {
      this.CreditSalesHeader.currency = null;
      this.CreditSalesHeader.curRate = 0;
    }
  });
}
