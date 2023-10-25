import { Component, OnInit, ViewChild, AfterViewInit, AfterViewChecked } from "@angular/core";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { HttpClient, HttpParams } from '@angular/common/http'
import { SharedService } from './../../../../shared/shared.service';
import { DatePipe } from '@angular/common';
import { CustomerModalComponent, CustomerModalOutput } from './../CustomerModal/CustomerModal.component';
import * as ModelCreditNote from './../ModelCreditNote';
import { ServiceCreditNote } from './../../../../service/creditnote-service/ServiceCreditNote.service';
import { Router } from '@angular/router'
import Swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import { DefaultService } from './../../../../service/default.service';
import { FormsModule, FormControl, FormGroup } from "@angular/forms"
import { from, Observable, of } from "rxjs";
import { stringify } from "@angular/compiler/src/util";
import * as moment from "moment";
import { title } from "process";
import { valueSelectbox } from "src/app/shared-model/demoModel";
import { CurrencyModel } from "../../../Sale/Quotation/quotation/quotation.component";
import { async } from "rxjs/internal/scheduler/async";
import { ModelException, ModelHiddenButton, ModelProduct } from "src/app/model/ModelCommon";
import { resolve } from "@angular/compiler-cli/src/ngtsc/file_system";
import { CreditNoteQueryResource2, CreditNoteQueryResource2 as ModelCreditNoteQueryResource2, ModelGetProductServiceOutput, ModelInsertCreditSalesQuery, ModelSalCndnHdTwo } from "./../ModelCreditNote";
/** Model **/
import { CreditNoteHdModel } from 'src/app/model/sale/creditnotehd.class';
import { DocPatternModel } from 'src/app/model/master/docpattern.class';
import { ModelFinBalance, ModelMasReason, ModelSalCndnDt, ModelSalTaxinvoiceDt, ModelSalTaxinvoiceHd } from "src/app/model/ModelScaffold";
import { ModalCashTaxComponent } from "../ModalCashTax/ModalCashTax.component";
import { AuthGuard } from "src/app/guards/auth-guard.service";
import { ExportData, ReportService } from "src/app/service/report-service/report-service";
import { ReportConfig } from "src/app/model/report/master/reportconfig.interface";

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
//-----------------------[ CreditNoteComponent ]---------------------------//

@Component({
  selector: 'app-creditnote',
  templateUrl: './creditnote.component.html',
  styleUrls: ['./creditnote.component.scss']
})
export class CreditnoteComponent implements OnInit, AfterViewInit, AfterViewChecked {

  urlSale = this._sharedService.urlSale;

  //--------------[ Declare Public Variable ]--------------------//
  ArrCreditSalesDetail: ModelCreditNote.ModelCreditSalesDetail[] = [];
  ArrProductService: ProductService[] = [];
  CreditNoteHeader = new ModelCreditNote.ModelCreditNoteHeader();
  DocDate: Date = new Date();
  HeaderCard: string = "บันทึกลดหนี้ลูกหนี้";
  IntTotalPrice: number = 0;
  IntTotalVat: number = 0;
  IntTotalTaxBase: number = 0;
  IntTotalAmt: number = 0;
  test: string = "";

  docTypeList: DocPatternModel[];
  reasonDescList: CreditNoteHdModel[];
  docTypeSelect2: valueSelectbox[];
  reasonDescSelect2: valueSelectbox[];

  currencySelect2: valueSelectbox[];
  currencyList: CurrencyModel[] = [];
  myGroup: FormGroup;

  public ArrReason: ModelMasReason[] = null;

  isPdf: string = "";
  isExcel: string = "";
  reportUrl: string = "";
  excelUrl: string = "";
  reportName: string = "";
  private authPositionRole: any;
  action: string = "";

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
  private _arrMasDocPattern: ModelCreditNote.ModelMasDocPattern[] = null;
  private _strApiUrl: string = "";
  private _strApiGetProductService = "/api/Invoice/GetProductService";
  private _strApiGetRunningDocNo = "/api/Invoice/GetRunningDocNo";
  private _strCompanyCode: string = "";
  private _strBranchCode: string = "";
  private _strLocationCode: string = "";
  //---------------------[ Start ]---------------------------//
  constructor(
    private _activeRoute: ActivatedRoute,
    private _sharedService: SharedService,
    private _date: DatePipe,
    private _httpClient: HttpClient,
    private _serviceCreditNote: ServiceCreditNote,
    private _router: Router,
    public SvDefault: DefaultService,
    private authGuard: AuthGuard,
    private reportService: ReportService,
  ) { }
  CreditNote: ModelCreditNoteQueryResource2 = new ModelCreditNoteQueryResource2();
  HiddenButton: ModelHiddenButton = new ModelHiddenButton();

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  async ngOnInit() {
    await this.SvDefault.DoAction(async () => await this.start(), true);
  };
  private async start() {
    this.authPositionRole = this.SvDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }

    this.getReportConfig("CreditNote");
    this.ArrReason = await this._serviceCreditNote.GetArrayReason();
    let pm = new Promise<ParamMap>((resolve, reject) => {
      let queryParamMap$ = this._activeRoute.queryParamMap.subscribe(x => {
        resolve(x);
      }, e => reject(e));
    });
    let paramMap: ParamMap = await pm;
    let strGuid = (paramMap?.get("Guid") || "").toString().trim();
    let strUser = (this._sharedService.user || "").toString().trim();
    if (strGuid === "") {
      this.CreditNote = new ModelCreditNoteQueryResource2();
      let strCompCode: string = (this._sharedService.compCode || "").toString().trim();
      let strBrnCoded: string = (this._sharedService.brnCode || "").toString().trim();
      let strLocCode: string = (this._sharedService.locCode || "").toString().trim();
      let header: ModelSalCndnHdTwo = this.CreditNote.CreditNoteHeader;
      if (header == null) {
        header = new ModelSalCndnHdTwo();
        this.CreditNote.CreditNoteHeader = header;
      }
      header.CurRate = 1;
      header.CreatedBy = strUser;
      header.CompCode = strCompCode;
      header.BrnCode = strBrnCoded;
      header.LocCode = strLocCode;
      header.DocStatus = "New";
      header.DocType = "CreditNote";
      header.DocDate = this._sharedService.systemDate;
      await this.genPattern("CreditNote");
      // let arrPattern = await this.SvDefault.GetPatternAsync("CreditNote");
      // let strPattern = this.SvDefault.GenPatternString(this._sharedService.systemDate , arrPattern ,this._sharedService.compCode , this._sharedService.brnCode );
      // header.DocNo =strPattern;
      // header.DocPattern = strPattern;
      this.action = "New";
    } else {
      this.action = "Edit";
      let cn = await this._serviceCreditNote.GetCreditNote(strGuid);
      if(!this.SvDefault.CheckDocBrnCode(cn?.CreditNoteHeader?.BrnCode)){
        return;
      }
      this.CreditNote = cn;
      // this.CreditNote = await this._serviceCreditNote.GetCreditNote(strGuid);
      if (this.CreditNote.CreditNoteHeader != null) {
        this.CreditNote.CreditNoteHeader.UpdatedBy = strUser;
      }
    }
    this.HiddenButton = this.SvDefault.GetHiddenButton2(this.CreditNote?.CreditNoteHeader?.DocStatus, this.CreditNote?.CreditNoteHeader?.Post);
  }
  ngAfterViewInit() {
    this.SvDefault.DoAction(() => {
      this.SvDefault.RemoveNavBorder();
    });
  }

  getReportConfig(reportGroup: string) {
    this.reportService.findReportConfig(reportGroup)
    .subscribe((data: ExportData<ReportConfig>) => {
      this.isPdf = data.Data['IsPdf'];
      this.isExcel = data.Data['IsExcel'];
      this.reportUrl = data.Data['ReportUrl'];
      this.reportName = data.Data['ReportName'];
    },
      error => {
        Swal.fire({
          allowEscapeKey: false,
          allowOutsideClick: false,
          title: "<span class='text-danger'>เกิดข้อผิดพลาด!</span>",
          text: error.message,
        })
      }
    );
  }

  public async GenPattern(pStrType: string) {
    await this.SvDefault.DoActionAsync(async () => await this.genPattern(pStrType), true);
  }

  private async genPattern(pStrType: string) {
    let header: ModelSalCndnHdTwo = this.CreditNote.CreditNoteHeader;
    if (header.DocStatus !== "New") {
      return;
    }
    let arrPattern = await this.SvDefault.GetPatternAsync(pStrType);
    let strPattern = this.SvDefault.GenPatternString(this._sharedService.systemDate, arrPattern, this._sharedService.compCode, this._sharedService.brnCode);
    header.DocNo = strPattern;
    header.DocPattern = strPattern;
    this.calculateDetail();
    // if(this.SvDefault.IsArray(this.CreditNote.ArrCreditNoteDetail)){
    //   for (let i = 0; i < this.CreditNote.ArrCreditNoteDetail.length; i++) {
    //     let cnItem = this.CreditNote.ArrCreditNoteDetail[i];
    //     if(cnItem == null){
    //       continue;
    //     }
    //     this.calculateRow(cnItem);
    //   }
    //   this.calculateSummary2();
    // }
  }
  public CalculateDetail(){
    this.SvDefault.DoAction(()=> this.calculateDetail());
  }

  private calculateDetail(){
    if(this.SvDefault.IsArray(this.CreditNote.ArrCreditNoteDetail)){
      let header = this.CreditNote.CreditNoteHeader;
      for (let i = 0; i < this.CreditNote.ArrCreditNoteDetail.length; i++) {
        let cnItem = this.CreditNote.ArrCreditNoteDetail[i];
        if(cnItem == null){
          continue;
        }
        switch (header.ReasonId) {
          case "01":
            cnItem.AfterQty = cnItem.BeforeQty;
            break;
          case "02":
            cnItem.AfterAmt = cnItem.BeforeAmt;
            break;
          default:
            cnItem.AfterQty = cnItem.BeforeQty;
            cnItem.AfterAmt = cnItem.BeforeAmt;
            break;
        }
        this.calculateRow(cnItem);
      }
      this.calculateSummary2();
    }
  }

  ngAfterViewChecked() {

  }
  public async ShowTaxModal() {
    this.SvDefault.DoActionAsync(async () => await this.showTaxModal());
  }
  private async showTaxModal() {
    let strCustCode = this.SvDefault.GetString(this.CreditNote?.CreditNoteHeader?.CustCode);
    if(strCustCode === ""){
      Swal.fire("รหัสลูกค้าห้ามมีค่าว่าง","","warning")
      return;
    }
    // Swal.showLoading();
    // let arrTaxHeader: ModelSalTaxinvoiceHd[] = await this._serviceCreditNote.GetTaxInvoiceList(this.CreditNote);
    // if (Swal.isLoading) {
    //   Swal.close();
    // }
    let modalParam = {
      // ArrTaxInvoice: arrTaxHeader
      CompCode : this._sharedService.compCode,
      CustCode : strCustCode
    };
    let tax = <ModelSalTaxinvoiceHd>await this.SvDefault.ShowModalAsync(ModalCashTaxComponent, "xl", modalParam);
    if (tax == null) {
      return;
    }
    this.CreditNote.CreditNoteHeader.TxNo = tax.DocNo;
    Swal.showLoading();
    let arrTaxDetail: ModelSalTaxinvoiceDt[] = await this._serviceCreditNote.GetTaxInvoiceDetailList(tax);
    if (Swal.isLoading) {
      Swal.close();
    }
    let funcMapTaxDetail: (x: ModelSalTaxinvoiceDt) => ModelSalCndnDt = null;
    funcMapTaxDetail = x => {
      let dt = new ModelSalCndnDt();
      dt.PdId = x.PdId;
      dt.PdName = x.PdName;
      dt.BeforeQty = x.ItemQty;
      dt.BeforePrice = x.UnitPrice;
      dt.AfterPrice = dt.BeforePrice;
      dt.BeforeAmt = x.SumItemAmt;
      dt.VatType = x.VatType;
      dt.VatRate = x.VatRate;
      dt.AfterQty = dt.BeforeQty;
      dt.AfterAmt = dt.BeforeAmt;
      // dt.BeforeAmt = dt.BeforeQty * dt.BeforePrice;
      this.calculateRow(dt);
      return dt;
    }
    if (this.SvDefault.IsArray(arrTaxDetail)) {
      this.CreditNote.ArrCreditNoteDetail = arrTaxDetail.map(funcMapTaxDetail);
      this.calculateSummary2();
    }
    // if(Array.isArray(arrTaxDetail) && arrTaxDetail.length){
    //   this.CreditNote.ArrCreditNoteDetail= arrTaxDetail.map(x=> {
    //     let dt = new ModelSalCndnDt();
    //     dt.PdId = x.PdId;
    //     dt.PdName = x.PdName;
    //     dt.BeforeQty = x.ItemQty;
    //     dt.BeforePrice = x.UnitPrice;
    //     dt.AfterPrice = dt.BeforePrice;
    //     dt.BeforeAmt = dt.BeforeQty * dt.BeforePrice;
    //     this.calculateRow(dt);
    //     return dt;
    //   });
    //}
  }
  private calculateSummary2() {
    let header = this.CreditNote?.CreditNoteHeader;
    if (header == null || !this.SvDefault.IsArray(this.CreditNote.ArrCreditNoteDetail)) {
      return;
    }
    let arrDetail: ModelSalCndnDt[] = this.CreditNote?.ArrCreditNoteDetail;
    let intSumNetAmt: number = 0.00;
    let numSumVatAmt : number = 0.00;
    for (let i = 0; i < arrDetail.length; i++) {
      const dt = arrDetail[i];
      intSumNetAmt += this.SvDefault.GetNumber(dt.AdjustAmt , 2);
      numSumVatAmt += this.SvDefault.GetNumber(dt.VatAmt , 2);
    }
    header.NetAmt = this.SvDefault.GetNumber( intSumNetAmt , 2);
    header.VatAmt = this.SvDefault.GetNumber(numSumVatAmt , 2);
    header.SubAmt = this.SvDefault.GetNumber(intSumNetAmt - numSumVatAmt , 2)
    // header.SubAmt = intSumNetAmt * 100 / 107;
    // header.VatAmt = header.NetAmt - header.SubAmt;
  }
  private calculateSummary2Old() {
    let header = this.CreditNote?.CreditNoteHeader;
    let arrDetail: ModelSalCndnDt[] = this.CreditNote?.ArrCreditNoteDetail;
    if (header == null || !this.SvDefault.IsArray(this.CreditNote.ArrCreditNoteDetail)) {
      return;
    }
    let intSumNetAmt: number = 0.00;
    if (arrDetail.length === 1) {
      intSumNetAmt = arrDetail[0].AdjustAmt || 0.00;
    } else {
      intSumNetAmt = arrDetail.map(x => x.AdjustAmt || 0.00).reduce((p, c) => p + c);
    }
    header.NetAmt = intSumNetAmt;
    header.SubAmt = intSumNetAmt * 100 / 107;
    header.VatAmt = header.NetAmt - header.SubAmt;
  }
  RemoveItem(pItem: ModelSalCndnDt) {
    this.SvDefault.DoAction(() => this.removeItem(pItem));
  }
  private async removeItem(pItem: ModelSalCndnDt) {
    if (pItem == null || !await this.SvDefault.ShowConfirmDialog("คุณแน่ใจหรือ ที่จะลบ ?")) {
      return;
    }
    this.CreditNote.ArrCreditNoteDetail = this.CreditNote.ArrCreditNoteDetail.filter(x => x !== pItem);
  }

  private changeReson(pStrReasonId : string){
    pStrReasonId = this.SvDefault.GetString(pStrReasonId);
    if(pStrReasonId === ""){
      return;
    }
    switch (pStrReasonId) {
      case "01":

        break;
      case "02":
        break;
      default:
        break;
    }
  }

  CalculateRow(pRow: ModelSalCndnDt) {
    this.SvDefault.DoAction(() => {
      this.calculateRow(pRow);
      this.calculateSummary2();
    });
  }
  private calculateRow(pRow: ModelSalCndnDt) {
    if (pRow == null) {
      return;
    }
    let header = this.CreditNote?.CreditNoteHeader;
    if(header == null){
      return;
    }

    // switch (header.ReasonId) {
    //   case "01":
    //     pRow.AfterQty = pRow.BeforeQty;
    //     break;
    //   case "02":
    //     pRow.AfterAmt = pRow.BeforeAmt;
    //     break;
    //   default:
    //     pRow.AfterQty = pRow.BeforeQty;
    //     pRow.AfterAmt = pRow.BeforeAmt;
    //     break;
    // }
    pRow.AfterQty = this.SvDefault.GetNumber(pRow.AfterQty , 2);
    pRow.AfterAmt = this.SvDefault.GetNumber(pRow.AfterAmt , 2);
    if(pRow.AfterQty === 0){
      pRow.AfterPrice = 0;
    }else{
      pRow.AfterPrice = this.SvDefault.GetNumber(pRow.AfterAmt / pRow.AfterQty , 2 );
    }

    // this.CreditNote.CreditNoteHeader.Doc
    // if(this.CreditNoteHeader.docType === "CreditNote"){
    if(header.DocType === "CreditNote"){
      pRow.AdjustQty = pRow.BeforeQty - pRow.AfterQty;
      pRow.AdjustAmt = pRow.BeforeAmt - pRow.AfterAmt;
    }else{
      pRow.AdjustQty = pRow.AfterQty - pRow.BeforeQty;
      pRow.AdjustAmt = pRow.AfterAmt - pRow.BeforeAmt;
    }
    pRow.AdjustQty = this.SvDefault.GetNumber(pRow.AdjustQty , 2);
    pRow.AdjustAmt = this.SvDefault.GetNumber(pRow.AdjustAmt , 2);
    this.calculateVat(pRow);
  }

  private calculateRowOld(pRow: ModelSalCndnDt) {
    if (pRow == null) {
      return;
    }
    // this.CreditNote.CreditNoteHeader.Doc
    // if(this.CreditNoteHeader.docType === "CreditNote"){
    if(this.CreditNote.CreditNoteHeader.DocType === "CreditNote"){
      pRow.AdjustQty =pRow.BeforeQty - pRow.AfterQty;
      pRow.AdjustAmt = pRow.BeforeAmt - pRow.AfterAmt;
    }else{
      pRow.AdjustQty = pRow.AfterQty + pRow.BeforeQty;
      pRow.AdjustAmt = pRow.AfterAmt + pRow.BeforeAmt;
    }
    // pRow.AdjustAmt = pRow.AfterAmt - pRow.BeforeAmt;
    this.calculateVat(pRow);
  }

  private calculateVat(param: ModelSalCndnDt){
    if(param == null){
      return;
    }
    param.AdjustAmt = this.SvDefault.GetNumber( param.AdjustAmt , 2);
    param.VatRate = this.SvDefault.GetNumber(param.VatRate , 2);
    if(param.AdjustAmt === 0){
      return;
    }
    let numVatAmt = 0;
    let numTaxBaseAmt = 0;
    let numTotalAmt = 0;
    switch (param.VatType) {
      case "VI":
        numTaxBaseAmt = (param.AdjustAmt * 100) / (100 + param.VatRate);
        numTaxBaseAmt = this.SvDefault.GetNumber(numTaxBaseAmt , 2);
        numTotalAmt = param.AdjustAmt;
        numVatAmt = numTotalAmt - numTaxBaseAmt;
        numVatAmt = this.SvDefault.GetNumber(numVatAmt , 2);
        break;
      case "VE":
        numTaxBaseAmt = param.AdjustAmt;
        numVatAmt = (numTaxBaseAmt * param.VatRate) / 100;
        numVatAmt = this.SvDefault.GetNumber(numVatAmt , 2);
        numTotalAmt = numTaxBaseAmt + numVatAmt;
        numTotalAmt = this.SvDefault.GetNumber(numTotalAmt , 2);
        break;
      default:
        numTaxBaseAmt = param.AdjustAmt;
        numTotalAmt = param.AdjustAmt;
        break;
    }
    let numCurRate = this.SvDefault.GetNumber( this.CreditNote?.CreditNoteHeader?.CurRate , 2);
    let numTaxBaseAmtCur = this.SvDefault.GetNumber( numTaxBaseAmt * numCurRate , 2);
    let numVatAmtCur = this.SvDefault.GetNumber( numVatAmt * numCurRate , 2);
    let numTotalAmtCur = this.SvDefault.GetNumber( numTotalAmt * numCurRate , 2);
    param.VatAmt = numVatAmt;
    param.VatAmtCur = numVatAmtCur;
    param.TotalAmt = numTotalAmt;
    param.TotalAmtCur = numTotalAmtCur;
    param.TaxBaseAmt = numTaxBaseAmt;
    param.TaxBaseAmtCur = numTaxBaseAmt;
  }

  async SaveData() {
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
    
    let header: ModelSalCndnHdTwo = this.CreditNote.CreditNoteHeader;
    if (header == null || !this.validateData()) {
      return;
    }
    header.DocDate = this.SvDefault.GetFormatDate(<Date>header.DocDate);
    header.ReasonId = this.SvDefault.GetString(header.ReasonId);
    if (header.ReasonId !== "" && this.SvDefault.IsArray(this.ArrReason)) {
      let strReasonDesc: string = "";
      let reason: ModelMasReason = null;
      reason = this.ArrReason.find(x => x.ReasonId === header.ReasonId);
      strReasonDesc = this.SvDefault.GetString(reason?.ReasonDesc);
      header.ReasonDesc = strReasonDesc;
    }
    header.NetAmtCur = header.NetAmt * header.CurRate;
    header.SubAmtCur = header.SubAmt * header.CurRate;
    header.VatAmtCur = header.VatAmt * header.CurRate;
    let arrDetail: ModelSalCndnDt[] = this.CreditNote.ArrCreditNoteDetail;
    if (Array.isArray(arrDetail) && arrDetail.length) {
      for (let i = 0; i < arrDetail.length; i++) {
        let dt = arrDetail[i];
        dt.BrnCode = header.BrnCode;
        dt.CompCode = header.CompCode;
        dt.LocCode = header.LocCode;
        dt.DocNo = header.DocNo;
        dt.AfterAmtCur = dt.AfterAmt * header.CurRate;
        dt.AdjustAmtCur = dt.AdjustAmt * header.CurRate;
        dt.BeforeAmtCur = dt.BeforeAmt * header.CurRate;
      }
    }
    let finBalance: ModelFinBalance = this.CreditNote.FinBalance;
    if (finBalance == null) {
      finBalance = new ModelFinBalance();
      this.CreditNote.FinBalance = finBalance;
    }
    this.SvDefault.CopyObject(header, finBalance);
    finBalance.BalanceAmt = header.NetAmt;
    finBalance.BalanceAmtCur = header.NetAmtCur;
    this.CreditNote = await this._serviceCreditNote.SaveCreditNote(this.CreditNote);
    header = this.CreditNote?.CreditNoteHeader;
    this.HiddenButton = this.SvDefault.GetHiddenButton2(this.CreditNote?.CreditNoteHeader?.DocStatus, this.CreditNote?.CreditNoteHeader?.Post);
    await this.SvDefault.ShowSaveCompleteDialogAsync();
  }

  async ClearData() {
    this.SvDefault.DoActionAsync(async () => await this.clearData());
  }
  private async clearData() {
    if (!await this.SvDefault.ShowClearDialogAsync()) {
      return;
    }
    await this.start();
  }
  async CompleteData() {
    await this.SvDefault.DoActionAsync(async () => {
      this.CreditNote.CreditNoteHeader.DocStatus = "Ready";
      await this.saveData();
    }, true);
  }
  async CancelData() {
    await this.SvDefault.DoActionAsync(async () => {
      if (!await this.SvDefault.ShowCancelDialogAsync()) {
        return;
      }
      this.CreditNote.CreditNoteHeader.DocStatus = "Cancel";
      await this.saveData();
    }, true);
  }
  async ApproveData() {
    await this.SvDefault.DoActionAsync(async () => {
      this.CreditNote.CreditNoteHeader.DocStatus = "Ready";
      await this.saveData();
    }, true);
  }
  async RejectData() {
    await this.SvDefault.DoActionAsync(async () => {
      this.CreditNote.CreditNoteHeader.DocStatus = "Reject";
      await this.saveData();
    }, true);
  }
  //--------------------------------------------------------------------------//
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
  private async getCreditSale(pStrDocNo: string): Promise<void> {
    Swal.showLoading();
    let getCreditSales = await this._serviceCreditNote.GetCreditSales(pStrDocNo).toPromise();
    Swal.close();
    if (getCreditSales.status === ModelCreditNote.EnumApiStatus.Success) {
      this.DocDate = <Date>getCreditSales?.result?.creditSaleHeader?.docDate;
      this.CreditNoteHeader = getCreditSales.result?.creditSaleHeader || this.CreditNoteHeader;
      this.CreditNoteHeader.period = this.CreditNoteHeader?.period?.split("/").reverse().join("-") || "";
      this.ArrCreditSalesDetail = getCreditSales.result?.arrCreditSaleDetail || this.ArrCreditSalesDetail;
      this.CreditNoteHeader.updatedBy = (this._sharedService.user || "").toString().trim();
      this.calculateSummary();
    } else {
      let err = <Error>{
        message: getCreditSales.errorMessage,
        stack: getCreditSales.errorStackTrace
      };
      throw err;
    }
    // this._serviceCreditNote.GetCreditSales(pStrDocNo).subscribe(x=>{
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
    this.CreditNoteHeader = new ModelCreditNote.ModelCreditNoteHeader();
    this.CreditNoteHeader.docStatus = ModelCreditNote.EnumDocStatus.New;
    this.CreditNoteHeader.createdBy = this._sharedService.user;
    this.CreditNoteHeader.locCode = this._strLocationCode;
    this.CreditNoteHeader.brnCode = this._strBranchCode;
    this.CreditNoteHeader.compCode = this._strCompanyCode;
    // this.CreditNoteHeader.createdDate = new Date();
    this.CreditNoteHeader.docDate = this._sharedService.systemDate;
    this.DocDate = this._sharedService.systemDate;
    this.CreditNoteHeader.guid = this.newGuid();
    // this.CreditNoteHeader.updatedDate = new Date();
    this.CreditNoteHeader.docType = "CreditNote";
    this.CreditNoteHeader.period = "";
    this.CreditNoteHeader.docNo = "";
    this.CreditNoteHeader.discRate = "0";
    let pArrMasDocPattern = await this.SvDefault.GetPatternAsync("CreditNote");
    let strPattern = this.SvDefault.GenPatternString(
      this._sharedService.systemDate,
      pArrMasDocPattern,
      this._strCompanyCode,
      this._strBranchCode
    );
    this.CreditNoteHeader.docNo = strPattern;
    this.CreditNoteHeader.docPattern = strPattern;
    this._arrMasDocPattern = pArrMasDocPattern;
    // this.getRunningDocNo(this._strCompanyCode, this._strBranchCode , this._strLocationCode , x=> this.CreditNoteHeader.docNo = x );

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
      fltTotalSubAmt = fltNetAmt * 100 / 107;
      fltVatAmt = fltNetAmt - fltTotalSubAmt;
    }
    this.CreditNoteHeader.subAmt = fltTotalSubAmt;
    this.CreditNoteHeader.taxBaseAmt = fltTaxBaseAmt;
    this.CreditNoteHeader.vatAmt = fltVatAmt;
    this.CreditNoteHeader.netAmt = fltNetAmt;
    this.CreditNoteHeader.totalAmt = fltDiscAmt;
  }
  CalculateHeaderDiscount = () => this.SvDefault.DoAction(() => {
    for (let i = 0; i < this.ArrCreditSalesDetail.length; i++) {
      let dt = this.ArrCreditSalesDetail[i];
      dt.discHdAmt = dt.subAmt * this.CreditNoteHeader.discAmt / this.CreditNoteHeader.subAmt;
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

  private validateData() {
    if(this.CreditNote.CreditNoteHeader.ReasonId === ""){
      Swal.fire("กรุณาเลือกสาเหตุที่ เพิ่ม/ลดหนี้", "", "warning");
      return false;
    }
    if(!this.SvDefault.IsArray(this.CreditNote.ArrCreditNoteDetail)){
      Swal.fire("กรุณาเลือกรายการสินค้า", "", "warning");
      return false;
    }
    if(this.CreditNote.ArrCreditNoteDetail.some(x=>x.AdjustQty < 0)){
      Swal.fire("ปริมาณรวม ห้ามมีค่าน้อยกว่า 0", "", "warning");
      return false;
    }
    if(this.CreditNote.ArrCreditNoteDetail.some(x=>x.AdjustAmt < 0)){
      Swal.fire("มูลค่ารวม ห้ามมีค่าน้อยกว่า 0", "", "warning");
      return false;
    }
    return true;
  }

  private validateDataOld(): boolean {
    let strCusCode = (this.CreditNoteHeader?.custCode || "").toString().trim();
    if (strCusCode === "") {
      Swal.fire("กรุณาเลือกลูกค้า", "", "warning")
        .then(x => setTimeout(() => document.getElementById("btnSearchCustomer").focus(), 500));
      return false;
    }
    let strPeriod = (this.CreditNoteHeader?.period || "").toString().trim();
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
    if (this.ArrCreditSalesDetail.some(x => x.subAmt <= 0)) {
      Swal.fire("จำนวนเงินต้องมีค่ามากกว่า 0", "", "warning");
      return false;
    }
    if(this.CreditNote.CreditNoteHeader.ReasonId === ""){
      Swal.fire("กรุณาเลือกสาเหตุที่ เพิ่ม/ลดหนี้", "", "warning");
      return false;
    }
    return true;
  }
  //-----------------------[ Public Function ]-------------------------------//
  CancelCreditSales = async () => await this.SvDefault.DoActionAsync(async () => {
    if (!await this.SvDefault.CheckSessionAsync()) {
      return;
    }
    // this.CreditNoteHeader.updatedDate = new Date();
    this.CreditNoteHeader.docStatus = ModelCreditNote.EnumDocStatus.Cancel;
    this.CreditNoteHeader.period = this.CreditNoteHeader.period.split("-").reverse().join("/");
    for (let i = 0; i < this.ArrCreditSalesDetail.length; i++) {
      this.ArrCreditSalesDetail[i].seqNo = i;
    }
    let updateCreditSales: ModelCreditNote.ModelApiResult<boolean> = await this._serviceCreditNote.UpdateCreditSales(this.CreditNoteHeader, this.ArrCreditSalesDetail).toPromise();
    if (updateCreditSales.status === ModelCreditNote.EnumApiStatus.Success && updateCreditSales.result) {
      Swal.fire("ยกเลิกเอกสารสำเร็จ", "", "success")
      // .then(x=> this._router.navigate(["/InvoiceList"]));
    } else {
      let err = <Error>{
        stack: updateCreditSales.errorStackTrace,
        message: updateCreditSales.errorMessage
      };
      throw err;
    }
  });

  async SaveCreditSales() {
    await this.SvDefault.DoActionAsync(async () => {
      if (!(await this.SvDefault.CheckSessionAsync() && this.validateData())) {
        return;
      }
      let intCurRate: number = this.CreditNoteHeader.curRate || 1;
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
      this.CreditNoteHeader.discAmtCur = (this.CreditNoteHeader.discAmt * intCurRate) || 0;
      this.CreditNoteHeader.netAmtCur = (this.CreditNoteHeader.netAmt * intCurRate) || 0;
      this.CreditNoteHeader.subAmtCur = (this.CreditNoteHeader.subAmt * intCurRate) || 0;
      this.CreditNoteHeader.taxBaseAmtCur = (this.CreditNoteHeader.taxBaseAmt * intCurRate) || 0;
      this.CreditNoteHeader.totalAmtCur = (this.CreditNoteHeader.totalAmt * intCurRate) || 0;
      this.CreditNoteHeader.vatAmtCur = (this.CreditNoteHeader.vatAmt * intCurRate) || 0;
      // this.CreditNoteHeader.
      this.CreditNoteHeader.period = this.CreditNoteHeader.period.split("-").reverse().join("/");
      switch (this.CreditNoteHeader.docStatus) {
        case ModelCreditNote.EnumDocStatus.New:
          let creditSale: ModelInsertCreditSalesQuery = await this.addNewCreditSales();
          if (creditSale != null && creditSale.creditSaleHeader != null) {
            creditSale.creditSaleHeader.period = creditSale.creditSaleHeader.period.split("/").reverse().join("-") || "";
            this.CreditNoteHeader = creditSale.creditSaleHeader;
          }
          // this.CreditNoteHeader =
          break;
        case ModelCreditNote.EnumDocStatus.Active:
          await this.editCreditSales();
        default:
          break;
      }

    }, true);
  }
  private async addNewCreditSales(): Promise<ModelCreditNote.ModelInsertCreditSalesQuery> {
    // this.CreditNoteHeader.docDate = this._sharedService?.systemDate?.toISOString()?.split("T")[0];
    this.CreditNoteHeader.docDate = this._sharedService?.systemDate?.toLocaleDateString("pt-br").split('/').reverse().join('-');
    this.CreditNoteHeader.createdBy = (this._sharedService?.user || "").toString().trim();
    Swal.showLoading();
    let result: ModelCreditNote.ModelInsertCreditSalesQuery = null;
    result = await this._serviceCreditNote.InserCreditSales2(this.CreditNoteHeader, this.ArrCreditSalesDetail);
    Swal.close();
    return result;
    //this.CreditNoteHeader = result.CreditSaleHeader;
    // this.ArrCreditSalesDetail = creditSale.ArrCreditSaleDetail;
  }
  AddNewCreditSalesOld() {
    this.CreditNoteHeader.docStatus = ModelCreditNote.EnumDocStatus.Active;
    //this.CreditNoteHeader.docDate = this.SvDefault.GetRealDate(this._sharedService.systemDate);
    this.CreditNoteHeader.docDate = this._sharedService?.systemDate?.toISOString()?.slice(0, 10);
    // this.CreditNoteHeader.totalAmt = this.IntTotalPrice;
    Swal.showLoading();
    this._serviceCreditNote.InserCreditSales(this.CreditNoteHeader, this.ArrCreditSalesDetail).subscribe(x => {
      Swal.hideLoading();
      if (x.status === ModelCreditNote.EnumApiStatus.Success && x.result) {
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
    this.CreditNoteHeader.updatedDate = new Date();
    this.CreditNoteHeader.updatedBy = this._sharedService.user;
    let x = await this._serviceCreditNote.UpdateCreditSales(this.CreditNoteHeader, this.ArrCreditSalesDetail).toPromise()
    if (x.status === ModelCreditNote.EnumApiStatus.Success && x.result) {
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
    // this.CreditNoteHeader.totalAmt = this.IntTotalPrice;
    this.CreditNoteHeader.updatedDate = new Date();
    this.CreditNoteHeader.updatedBy = this._sharedService.user;
    this._serviceCreditNote.UpdateCreditSales(this.CreditNoteHeader, this.ArrCreditSalesDetail).subscribe(x => {
      if (x.status === ModelCreditNote.EnumApiStatus.Success && x.result) {
        Swal.fire("บันทึกสำเร็จ", "", "success");
        //.then(x=> this._router.navigate(["/InvoiceList"]));
      } else {
        Swal.fire("Error", `<h3>${x.errorMessage}</h3><br/><h4>${x.errorStackTrace}</h4>`, "error");
      }
    }, err => {
      console.log(err);
    });
  }



  private calculateCreditDetail(pCreditSaleDetail: ModelCreditNote.ModelCreditSalesDetail): void {
    let intFinish: number = pCreditSaleDetail.meterFinish || 0.00;
    let intStart: number = pCreditSaleDetail.meterStart || 0.00;
    pCreditSaleDetail.itemQty = intFinish - intStart;
    let intUnitPrice: number = pCreditSaleDetail?.unitPrice || 0.00;
    pCreditSaleDetail.sumItemAmt = pCreditSaleDetail.itemQty * intUnitPrice;
    let intDiscAmt = pCreditSaleDetail.discAmt || 0.00;
    if (intDiscAmt < 0) {
      intDiscAmt = 0;
      pCreditSaleDetail.discAmt = intDiscAmt;
      Swal.fire("ห้ามไส่ส่วนลดติดลบ", "", "info");
    } else if (intDiscAmt > pCreditSaleDetail.sumItemAmt) {
      intDiscAmt = pCreditSaleDetail.sumItemAmt;
      pCreditSaleDetail.discAmt = intDiscAmt;
      Swal.fire("ห้ามไส่ส่วนลดเกินราคาสินค้า", "", "info");
    }
    pCreditSaleDetail.subAmt = pCreditSaleDetail.sumItemAmt - intDiscAmt;  //pCreditSaleDetail.itemQty * intUnitPrice;
    let intVatRate = pCreditSaleDetail.vatRate || 0.00;
    switch (pCreditSaleDetail.vatType) {
      case ModelCreditNote.EnumVatType.VI:
        pCreditSaleDetail.totalAmt = pCreditSaleDetail.subAmt - pCreditSaleDetail.discHdAmt;
        pCreditSaleDetail.taxBaseAmt = pCreditSaleDetail.totalAmt * 100 / (pCreditSaleDetail.vatRate + 100);
        pCreditSaleDetail.vatAmt = (pCreditSaleDetail.taxBaseAmt * pCreditSaleDetail.vatRate) / 100;
        break;
      case ModelCreditNote.EnumVatType.VE:
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
  CalculateUnitPrice(pCreditSaleDetail: ModelCreditNote.ModelCreditSalesDetail): void {
    this.SvDefault.DoAction(() => {
      this.calculateCreditDetail(pCreditSaleDetail);
      this.calculateSummary();
    });
  }
  CalculateUnitPriceOld(pCreditSaleDetail: ModelCreditNote.ModelCreditSalesDetail): void {
    let intFinish: number = pCreditSaleDetail.meterFinish || 0.00;
    let intStart: number = pCreditSaleDetail.meterStart || 0.00;
    pCreditSaleDetail.itemQty = intFinish - intStart;
    let intUnitPrice: number = pCreditSaleDetail?.unitPrice || 0.00;
    pCreditSaleDetail.subAmt = pCreditSaleDetail.itemQty * intUnitPrice;
    let intVatRate = pCreditSaleDetail.vatRate || 0.00;
    switch (pCreditSaleDetail.vatType) {
      case ModelCreditNote.EnumVatType.VI:
        pCreditSaleDetail.taxBaseAmt = pCreditSaleDetail.subAmt * 100 / (pCreditSaleDetail.vatRate + 100);
        pCreditSaleDetail.vatAmt = pCreditSaleDetail.subAmt - pCreditSaleDetail.taxBaseAmt;
        pCreditSaleDetail.totalAmt = pCreditSaleDetail.subAmt;
        break;
      case ModelCreditNote.EnumVatType.VE:
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
    this.SvDefault.DoAction(() => result = this.SvDefault.GetBackgroundRibbon(this.CreditNoteHeader.docStatus));
    return result;
    // if(this.CreditNoteHeader == null){
    //   return "";
    // }
    // let classStatus = "ribbon-1 ribbon tooltipa statusBase"
    // switch (this.CreditNoteHeader.docStatus) {
    //   case ModelCreditNote.EnumDocStatus.Cancel :
    //     classStatus += " statusCancel ";
    //     break;
    //   case ModelCreditNote.EnumDocStatus.New :
    //     classStatus += " statusNew ";
    //     break;
    //   case ModelCreditNote.EnumDocStatus.Ready :
    //   case ModelCreditNote.EnumDocStatus.Active :
    //     classStatus += " statusReady ";
    //     break;
    //   case ModelCreditNote.EnumDocStatus.Reference :
    //     classStatus += " statusReference ";
    //     break;
    //   case ModelCreditNote.EnumDocStatus.Save :
    //     classStatus += " statusSave ";
    //     break;
    //   default:
    //     break;
    // }
    // return classStatus;
  }
  ReceiveCustomer(pCustomer: ModelCreditNote.ModelGetCustomerListOutput) {
    this.SvDefault.DoAction(() => this.receiveCustomer(pCustomer));
    // this.SvDefault.DoAction(() => {
    //   if (pCustomer == null) {
    //     return;
    //   }
    //   this.CreditNote.CreditNoteHeader.CustCode = (pCustomer.CustCode || "").toString().trim();
    //   this.CreditNote.CreditNoteHeader.CustAddr1 = (pCustomer.Address || "").toString().trim();
    //   this.CreditNote.CreditNoteHeader.CustPrefix = (pCustomer.CustPrefix || "").toString().trim();
    //   this.CreditNote.CreditNoteHeader.CustName = (pCustomer.CustName || "").toString().trim();
    // });
  }

  private receiveCustomer(pCustomer: ModelCreditNote.ModelGetCustomerListOutput){
    if (pCustomer == null) {
      return;
    }
    let header = this.CreditNote?.CreditNoteHeader;
    if(header == null){
      return;
    }
    header.CustCode = this.SvDefault.GetString(pCustomer.CustCode);
    header.CustAddr1 = this.SvDefault.GetString(pCustomer.CustAddr1);
    header.CustAddr2 = this.SvDefault.GetString(pCustomer.CustAddr2);
    header.CustPrefix = this.SvDefault.GetString(pCustomer.CustPrefix);
    header.CustName = this.SvDefault.GetString(pCustomer.CustName);
    header.CitizenId = this.SvDefault.GetString( pCustomer.CitizenId);
  }


  async RemoveCreditSalesDetail(pIntRowIndex: number): Promise<void> {
    await this.SvDefault.DoActionAsync(async () => {
      if (this.CreditNoteHeader.docStatus === ModelCreditNote.EnumDocStatus.Cancel
        || this.CreditNoteHeader.docStatus === ModelCreditNote.EnumDocStatus.Reference) {
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
      if (this.CreditNoteHeader.docStatus === ModelCreditNote.EnumDocStatus.Cancel
        || this.CreditNoteHeader.docStatus === ModelCreditNote.EnumDocStatus.Reference
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
    await this.SvDefault.DoActionAsync(async () => {
      let arrModelProduct: ModelProduct[] = await this.SvDefault.ShowModalProductAsync();
      let arrProduct = arrModelProduct.map(v => <ModelCreditNote.ModelGetProductServiceOutput>{
        pdId: v.pdId,
        pdName: v.pdName,
        status: ModelCreditNote.EnumProductStatus.Select,
        vatRate: v.vatRate,
        vatType: v.vatType,
      });
      this.SelectProduct(arrProduct);
    });
  }
  SelectProduct(pArrSelectProduct: ModelCreditNote.ModelGetProductServiceOutput[]): void {
    this.SvDefault.DoAction(() => {
      if (Array.isArray(pArrSelectProduct) && pArrSelectProduct.length) {
        if (!Array.isArray(this.ArrCreditSalesDetail) || !this.ArrCreditSalesDetail.length) {
          this.ArrCreditSalesDetail = [];
        }
        let selectCreditSaleDetail: ModelCreditNote.ModelCreditSalesDetail[] = pArrSelectProduct
          .filter(x => !this.ArrCreditSalesDetail.some(y => x.pdId === y.pdId))
          .map((x, i) => <ModelCreditNote.ModelCreditSalesDetail>{
            brnCode: this._strBranchCode,
            compCode: this._strCompanyCode,
            locCode: this._strLocationCode,
            docNo: this.CreditNoteHeader.docNo,
            docType: this.CreditNoteHeader.docType,
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
            totalAmt: 0,
            discAmt: 0,
            discHdAmt: 0,
            sumItemAmt: 0,
          });
        this.ArrCreditSalesDetail = [...this.ArrCreditSalesDetail, ...selectCreditSaleDetail];
        this.calculateSummary();
      }
    });
  }
  SelectProduct2(pArrSelectProduct: ModelCreditNote.ModelGetProductServiceOutput[]): void {
    // this.ArrCreditSalesDetail = [];
    if (Array.isArray(pArrSelectProduct) && pArrSelectProduct.length) {
      if (Array.isArray(this.ArrCreditSalesDetail) && this.ArrCreditSalesDetail.length) {
        pArrSelectProduct.filter(x => !this.ArrCreditSalesDetail.some(y => x.pdId === y.pdId))
      } else {
        this.ArrCreditSalesDetail = pArrSelectProduct.map((x, i) => <ModelCreditNote.ModelCreditSalesDetail>{
          brnCode: this._sharedService.brnCode,
          compCode: this._sharedService.compCode,
          locCode: this._sharedService.locCode,
          docNo: this.CreditNoteHeader.docNo,
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


  GetDocTypeCreditNote = (): void => {

    this._httpClient.get(this.urlSale + "/api/CreditNote/GetDocTypeCreditNote")
      .subscribe(
        response => {
          console.log("GetDocTypeCreditNote : ", response);
          this.docTypeSelect2 = [];
          for (let i = 0; i < response["items"].length; i++) {
            this.docTypeSelect2.push({
              KEY: response["items"][i].docType.trim(),
              VALUE: response["items"][i].docType.trim()
            });

          }
        },
        error => {
          console.log("Error", error);
        }
      );
  }


  GetReasonCreditNote = (): void => {
    var data = {
      "reasonGroup": this.myGroup.get('docType').value
    }
    this._httpClient.post(this.urlSale + "/api/CreditNote/GetReasonCreditNote", data)
      .subscribe(
        response => {
          console.log("GetReasonCreditNote : ", response);
          this.reasonDescSelect2 = [];
          for (let i = 0; i < response["items"].length; i++) {
            this.reasonDescSelect2.push({
              KEY: response["items"][i].docType.trim(),
              VALUE: response["items"][i].docType.trim()
            });

            this.docTypeList.push({
              DocId: response["items"][i].DocId.trim(),
              DocType: response["items"][i].docType.trim(),
              Pattern: response["items"][i].Pattern.trim()
            });

          }
        },
        error => {
          console.log("Error", error);
        }
      );
  }


  changeCurrency = () => this.SvDefault.DoAction(() => {
    var cur = this.myGroup.get('currency').value;
    if (cur != "" && cur != null) {
      var curObj = this.currencyList.find((row, index) => row.Currency == cur);
      this.CreditNoteHeader
      this.CreditNoteHeader.currency = curObj.Currency;
      this.CreditNoteHeader.curRate = curObj.Rate;
    }
    else {
      this.CreditNoteHeader.currency = null;
      this.CreditNoteHeader.curRate = 0;
    }
  });



  clearDocument = () => {
    Swal.fire({
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: "ตกลง",
      denyButtonText: "ยกเลิก",
      icon: 'warning',
      showDenyButton: true,
      title: 'คุณต้องการล้างข้อมูลที่กรอกไว้ ใช่หรือไม่?',
    }).then((result) => {
      if (result.isConfirmed) {
        //this.start();
        //this.calculateDocument();
      } else if (result.isDenied) {
      }
    })
  };


  public GetDisableAfterAmt(){
    let header = this.CreditNote.CreditNoteHeader;
    if(header.ReasonId===''){
      return true;
    }
    if(header.ReasonId==='02'){
      return true;
    }
    return false;
  }

  public GetDisableAfterQty(){
    let header = this.CreditNote.CreditNoteHeader;
    if(header.ReasonId===''){
      return true;
    }
    if(header.ReasonId==='01'){
      return true;
    }
    return false;
  }


  async exportPDF() {
    await this.SvDefault.DoActionAsync(async () => await this.ExportPDF(), true);
  };

  private async ExportPDF() {
    if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isPrint")) {
      this.SvDefault.ShowPositionRoleMessage("IsPrint");
      return;
    }
    let header: ModelSalCndnHdTwo = this.CreditNote.CreditNoteHeader;
    await this.reportService.ExportReportCreditNotePDF(header.CompCode, header.BrnCode, header.LocCode, header.DocNo, this._sharedService.user, this.reportName, this.reportUrl);
  }

}


