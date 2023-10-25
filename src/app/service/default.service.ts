import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http/';
import Swal, { SweetAlertOptions, SweetAlertPosition, SweetAlertResult } from 'sweetalert2';
import * as ModelCommon from './../model/ModelCommon';
import { SharedService } from './../shared/shared.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ModalProductComponent } from './../shared/components/ModalProduct/ModalProduct.component';
import { ModelException, ModelHiddenButton, ModelMaxCardProfile, ModelProduct, ModelTaxProfile } from './../model/ModelCommon';
import { async } from 'rxjs/internal/scheduler/async';
import { promise } from 'selenium-webdriver';
import * as moment from 'moment';
import { ModelMasDocPattern, ModelMasDocPatternDt, ModelMasEmployee, ModelMasProduct, ModelSysPositionRole } from '../model/ModelScaffold';
import { ModalProduct2Component } from '../shared/components/ModalProduct2/ModalProduct2.component';
import { debug } from 'console';
import { Router } from '@angular/router';
import { ProductModel } from '../model/master/product.class';
import { ModalHtmlComponent } from '../shared/components/ModalHtml/ModalHtml.component';
import { MessageService } from './Message.service';
@Injectable({
  providedIn: 'root'
})
export class DefaultService {
  constructor(
    private _svShared: SharedService,
    private _httpClient: HttpClient,
    private _svModal: NgbModal,
    private router: Router,
    private _svMessage : MessageService,
  ) { }

  CheckSession = () => {
    let isInvalidSession: boolean = false;
    isInvalidSession = isInvalidSession || (this._svShared.compCode || "") === "";
    isInvalidSession = isInvalidSession || (this._svShared.brnCode || "") === "";
    isInvalidSession = isInvalidSession || (this._svShared.locCode || "") === "";
    isInvalidSession = isInvalidSession || (this._svShared.user || "") === "";

    if (isInvalidSession) {
      let swalOption = <SweetAlertOptions>{
        allowEscapeKey: false,
        allowOutsideClick: false,
        icon: 'error',
        title: 'กรุณาเข้าสู่ระบบอีกครั้ง',
      };
      Swal.fire(swalOption).then(() => this.router.navigate(["Login"]));
      return false;
    } else {
      return true;
    }
  }
  async CheckSessionAsync(): Promise<boolean> {
    let isInvalidSession: boolean = false;
    isInvalidSession = isInvalidSession || (this._svShared.compCode || "") === "";
    isInvalidSession = isInvalidSession || (this._svShared.brnCode || "") === "";
    isInvalidSession = isInvalidSession || (this._svShared.locCode || "") === "";
    isInvalidSession = isInvalidSession || (this._svShared.user || "") === "";

    if (isInvalidSession && false) {
      let swalOption = <SweetAlertOptions>{
        allowEscapeKey: false,
        allowOutsideClick: false,
        icon: 'error',
        title: 'กรุณาเข้าสู่ระบบอีกครั้ง',
      };
      // Swal.fire(swalOption).then(()=> window.location.href = 'http://www.pt.co.th/intranet/index_intr.php');
      await Swal.fire(swalOption);
      window.location.href = 'http://www.pt.co.th/intranet/index_intr.php';
      return false;
    } else {
      return true;
    }
  }
  public ConvertObject<T>(pInput: any): T {
    let result: T = null;
    result = <T>JSON.parse(JSON.stringify(pInput));
    return result;
  }
  public CopyDeep<T>(pInput: T): T {
    let result: T = null;
    result = this.ConvertObject<T>(pInput);
    return result;
  }
  CopyObject<T1, T2>(pOriginal: T1, pDestination: T2) {
    if (pOriginal == null || pDestination == null) {
      return;
    }
    let arrOriginKey: string[] = Object.keys(pOriginal);
    let arrDestKey: string[] = Object.keys(pDestination);
    for (let iDest = 0; iDest < arrDestKey.length; iDest++) {
      let strDestKey = arrDestKey[iDest];
      for (let iOrigin = 0; iOrigin < arrOriginKey.length; iOrigin++) {
        let strOriginKey = arrOriginKey[iOrigin];
        if (strDestKey === strOriginKey || strDestKey.toLocaleLowerCase() === strOriginKey.toLowerCase()) {
          pDestination[strDestKey] = pOriginal[strOriginKey];
          break;
        }
      }
    }
  }
  /*
  CopyObject<T1 , T2>(pOriginal : T1 , pDestination : T2){
    if(pOriginal == null || pDestination == null){
      return;
    }
    for (let strKey1 in pDestination) {
      let strKey = strKey1.toString();
      if(pDestination.hasOwnProperty(strKey) && pOriginal.hasOwnProperty(strKey)){
        pDestination[strKey1] = pOriginal[strKey1.toString()];
      }
    }
  }*/
  DoAction(pAction: () => void, pIsShowLoading?: boolean) {
    try {
      if (pIsShowLoading) {
        Swal.showLoading();
      }
      pAction();
      if (pIsShowLoading && Swal.isLoading()) {
        Swal.close();
      }
    } catch (ex) {
      console.log(ex);
      let ex2: ModelCommon.ModelException = this.GetModelException(ex);
      this.ShowExceptionDialog(ex2);
    }
  }
  async DoActionAsync(pAction: () => Promise<void>, pIsShowLoading?: boolean) {
    try {
      if (pIsShowLoading) {
        Swal.fire({
          title: 'กำลังโหลดข้อมูล กรุณารอสักครู่',
          allowEscapeKey: false,
          allowOutsideClick: false,
        });
        Swal.showLoading();

        // Swal.fire({
        //   title: 'กำลังโหลดข้อมูล กรุณารอสักครู่',
        //   allowEscapeKey: false,
        //   allowOutsideClick: false,
        //   onOpen: () => {
        //     Swal.showLoading();
        //   }
        // });
      }
      await pAction();

      if (pIsShowLoading && this.IsSweetAlertLoading()) {
        Swal.close();
      }
    } catch (ex) {
      console.log(ex);

      let ex2: ModelCommon.ModelException = this.GetModelException(ex);
      if(ex2.status === 429){
        this.ShowErrorApimDialog(ex2);
      }else{
        this.ShowExceptionDialog(ex2);
      }
    }
  }

  async DoActionAsync2(pAction: () => Promise<void>, pIsShowLoading: boolean , pNumMsgCode : number) {
    try {
      if (pIsShowLoading) {
        Swal.fire({
          title: 'กำลังโหลดข้อมูล กรุณารอสักครู่',
          allowEscapeKey: false,
          allowOutsideClick: false,
        });
        Swal.showLoading();
      }
      await pAction();

      if (pIsShowLoading && this.IsSweetAlertLoading()) {
        Swal.close();
      }
    } catch (ex) {
      console.log(ex);
      let ex2: ModelCommon.ModelException = this.GetModelException(ex);
      if(ex2.status === 429){
        this.ShowErrorApimDialog(ex2);
      }else if(pNumMsgCode > 0){
        if(ex2.status === 0){
          pNumMsgCode = 400;
        }
        let strMessage = this._svMessage.GetMessage(pNumMsgCode);
        if(strMessage === ""){
          this.ShowExceptionDialog(ex2);
        }else{
          Swal.fire("" ,pNumMsgCode + " : " + strMessage , "error");
        }
      }else{
        this.ShowExceptionDialog(ex2);
      }
    }
  }

  public IsSweetAlertLoading(): boolean {
    let result: boolean = false;

    let elemLoading: HTMLElement = null;
    elemLoading = Swal.getPopup();
    if (elemLoading == null) {
      result = true;
    } else {
      result = elemLoading.hasAttribute("data-loading");
    }
    return result;
  }
  GetBackgroundRibbon(pStrDocStatus: string) {
    let result: string = "";
    switch (pStrDocStatus) {
      case "Cancel":
        result = "statusCancel";
        break;
      case "New":
        result = "statusNew";
        break;
      case "Ready":
        result = "statusReady";
        break;
      case "Reference":
        result = "statusReference";
        break;
      case "Active":
        result = "statusActive";
        break;
      default:
        result = "statusNew";
        break;
    }
    result += " ribbon-1 ribbon tooltipa statusBase";
    return result;
  }

  async GetBranchListAsync(pStrCompanyCode: string): Promise<ModelCommon.ModelBranch[]> {
    let result: ModelCommon.ModelBranch[] = null;
    pStrCompanyCode = (pStrCompanyCode || "").toString().trim();
    let data: any = { CompCode: pStrCompanyCode }
    let strUrl = (this._svShared.urlMas || "").toString().trim() + "/api/Branch/GetBranchList";
    let apiResult: any = await this._httpClient.post<any>(strUrl, data).toPromise();
    if (apiResult != null
      && apiResult.hasOwnProperty("Data")
      && Array.isArray(apiResult.Data)
      && apiResult.Data.length) {
      result = <ModelCommon.ModelBranch[]>apiResult.Data;
    }
    return result;
  }

  GetHiddenButton(pStrDocStatus: string, pDatDocDate: Date | string): ModelCommon.ModelHiddenButton {
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
    if (pDatDocDate < this._svShared.systemDate) {
      result.status = "ปิดสิ้นวัน";
      result.btnSave = true;
    }
    return result;
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
    pStrPostStatus = (pStrPostStatus || "").toString().trim();
    if (pStrPostStatus === "P") {
      result.status = "ปิดสิ้นวัน";
      result.btnSave = true;
      result.btnCancel = true;
    }
    return result;
  }

  GetModelException(pException: any): ModelException {
    if (pException == null) {
      return null;
    }
    let result = new ModelException();
    result.brnCode = (this._svShared.brnCode || "").toString().trim();
    result.compCode = (this._svShared.compCode || "").toString().trim();
    result.locCode = (this._svShared.locCode || "").toString().trim();
    result.user = (this._svShared.user || "").toString().trim();
    result.status = pException.status || 0;
    let errormessage = "";
    let errorStackTrace = "";
    errormessage = (pException.message || "").toString().trim();
    // stack
    if (typeof pException === "string") {
      errorStackTrace = (pException || "").toString().trim();
    } else if (pException.hasOwnProperty("stack")) {
      errorStackTrace = (pException.stack || "").toString().trim();
    } else if (pException.hasOwnProperty("error") && pException.error != null) {
      if (typeof pException.error === "string") {
        errorStackTrace = (pException.error || "").toString().trim();
      } else if (Array.isArray(pException.error)
        || pException.error.length
        || typeof pException.error[0] === "string"
      ) {
        errorStackTrace = (pException.error[0] || "").toString().trim();
      } else if (pException?.error?.hasOwnProperty("message") && typeof pException?.error?.message === "string") {
        errorStackTrace = (pException?.error?.message || "").toString().trim();
      }
    }
    result.message = errormessage;
    result.stackTrace = errorStackTrace;
    return result;
  }
  async GetMaxCardProfile(pStrMaxCardNo: string): Promise<ModelMaxCardProfile> {
    pStrMaxCardNo = (pStrMaxCardNo || "").toString().trim();
    if (pStrMaxCardNo === "") {
      return;
    }
    pStrMaxCardNo = encodeURI(pStrMaxCardNo);
    let strUrl: string = (this._svShared.urlSale || "").toString().trim() + "/api/Quotation/GetMaxCardProfile?MaxCardID=" + pStrMaxCardNo;
    let result = <ModelMaxCardProfile>await this._httpClient.get(strUrl).toPromise();
    return result;
  }

  async GetTaxProfile(pStrTaxNo: string): Promise<ModelTaxProfile> {
    pStrTaxNo = (pStrTaxNo || "").toString().trim();
    if (pStrTaxNo === "") {
      return;
    }
    let strUrl: string = this._svShared.urlMas + "/api/Customer/GetTaxInfo";
    let data = {
      "tin": pStrTaxNo,
      "branch": "0"
    }
    let result = <ModelTaxProfile>await this._httpClient.post(strUrl, data).toPromise();
    return result;
  }

  /*
  async GetMaxCardProfile(pStrMaxCardNo : string) : Promise<ModelMaxCardProfile>{
    pStrMaxCardNo = (pStrMaxCardNo || "").toString().trim();
    if(pStrMaxCardNo === ""){
      return;
    }
    let body = new URLSearchParams();
    body.set('MaxcardNo', pStrMaxCardNo);
    body.set('MidNo', "3951510000000");
    let options = {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded'),
        mode : "no-cors"
    };
    let strUrl = "https://pcp.pt.co.th:4083/crm_pos_getprofile.asmx/CrmPosGetProfile";
    let result =  <ModelMaxCardProfile>await this._httpClient.post(strUrl , body.toString() , options).toPromise();
    return result;
  }
*/
  GenPatternString(
    pDateInput: Date
    , pArrMasDocPattern: ModelMasDocPatternDt[]
    , pStrCompanyCode: string
    , pStrBranchCode: string
  ): string {
    if (pDateInput == null || !(Array.isArray(pArrMasDocPattern) && pArrMasDocPattern.length)) {
      return "";
    }
    pStrCompanyCode = this.GetString(pStrCompanyCode);
    pStrBranchCode = this.GetString(pStrBranchCode);
    let result = "";
    let arrDocPattern: ModelCommon.ModelMasDocPattern[] = null;
    if (pArrMasDocPattern.length > 1) {
      arrDocPattern = pArrMasDocPattern.sort((a, b) => a.SeqNo - b.SeqNo);
    } else {
      arrDocPattern = pArrMasDocPattern;
    }
    for (let i = 0; i < arrDocPattern.length; i++) {
      let pt = arrDocPattern[i];
      if (pt == null) {
        continue;
      }
      switch (pt.DocCode) {
        case "-":
          result += "-";
          break;
        case "MM":
          result += (pDateInput?.getMonth() + 1)?.toString()?.padStart(2, "0") || "00";
          break;
        case "Comp":
          result += pStrCompanyCode;
          break;
        case "[Pre]":
          result += (pt.DocValue || "").toString().trim();
          break;
        case "dd":
          result += pDateInput?.getDate()?.toString()?.padStart(2, "0") || "00";;
          break;
        case "Brn":
          result += pStrBranchCode;
          break;
        // Date().getFullYear().toString().substr(-2)
        case "yy":
          result += pDateInput?.getFullYear()?.toString()?.substr(-2) || "00";
          break;
        case "yyyy":
          result += pDateInput?.getFullYear()?.toString() || "0000";
          break;
        case "[#]":
          let intRepeat = parseInt(pt.DocValue) || 0;
          if (intRepeat > 0) {
            result += "#".repeat(intRepeat);
          } else {
            result += "#";
          }
          break;
        default:
          break;
      }
    }
    return result;
  }
  async GetPatternAsync(pStrDocType: string): Promise<ModelMasDocPatternDt[]> {
    pStrDocType = (pStrDocType || "").toString().trim();
    if (pStrDocType === "") {
      return null;
    }
    let strUrl = this._svShared.urlMas + "/api/Other/GetPattern";
    let objBody = { "docType": pStrDocType };
    let objGetPattern = await this._httpClient.post(strUrl, objBody).toPromise();
    if (objGetPattern == null) {
      return null;
    }
    let objData: any = null;
    if (objGetPattern.hasOwnProperty("Data")) {
      objData = (<any>objGetPattern).Data;
    }
    if (objData == null) {
      return null;
    }
    let result: ModelMasDocPatternDt[] = null;
    if (objData.hasOwnProperty("MasDocPattern")) {
      let objMasDocPattern = objData.MasDocPattern;
      if (objMasDocPattern != null &&
        objMasDocPattern.hasOwnProperty("MasDocPatternDt")
        && Array.isArray(objMasDocPattern.MasDocPatternDt)
        && objMasDocPattern.MasDocPatternDt.length) {
        result = <ModelMasDocPatternDt[]>objMasDocPattern.MasDocPatternDt;
      }
    } else {
      result = [];
    }
    return result;
  }

  GetPattern(
    pOnComplete: (pStrPattern: string, pArrMasDocPattern: ModelMasDocPatternDt[]) => void,
    pOnError?: (e: Error) => void,
    pStrDocType?: string,
  ) {
    if (typeof (pOnComplete) !== "function") {
      return;
    }
    let strUrl: string = this._svShared.urlMas + "/api/Other/GetPattern";
    let objBody = { "docType": pStrDocType || "Invoice" };
    let pattern$ = this._httpClient.post(strUrl, objBody).subscribe(x => {
      pattern$?.unsubscribe();
      if (x == null) {
        return;
      }
      let objData: any = null;
      if (x.hasOwnProperty("Data")) {
        objData = (<any>x).Data;
      }
      if (objData == null) {
        return;
      }
      let strPattern: string = "";
      if (objData.hasOwnProperty("Pattern")) {
        strPattern = (objData.Pattern || "").toString().trim();
      }
      let arrMasDocPattern: ModelMasDocPatternDt[];
      if (objData.hasOwnProperty("MasDocPattern")) {
        let objMasDocPattern = objData.MasDocPattern;
        if (objMasDocPattern.hasOwnProperty("MasDocPatternDt")
          && Array.isArray(objMasDocPattern.MasDocPatternDt)
          && objMasDocPattern.MasDocPatternDt.length) {
          arrMasDocPattern = <ModelMasDocPatternDt[]>objMasDocPattern.MasDocPatternDt;
        }
      } else {
        arrMasDocPattern = [];
      }
      this.DoAction(() => pOnComplete(strPattern, arrMasDocPattern));
    }, e => {
      pattern$?.unsubscribe();
      let ex2 = this.GetModelException(e);
      this.ShowExceptionDialog(ex2);
      // if(e == null || e == NaN){
      //   return;
      // }
      // let ex= <Error>{
      //   message : (e?.message || "") ,
      //   stack : (e?.error?.message || "")
      // };

      // if(typeof(pOnError) === "function"){
      //   pOnError(ex);
      // }else{
      //   Swal.fire(ex.message ,ex.stack , "error");
      // }

    });
  }
  GetProduct(
    pOnComplete: (pArrProduct: ModelCommon.ModelProduct[]) => void,
    pOnError?: ((pException: Error) => void)
  ): void {
    if (typeof (pOnComplete) !== "function") {
      return;
    }
    let strUrl: string = this._svShared.urlSale + "/api/Invoice/GetProductService";
    let product$ = this._httpClient.get<ModelCommon.ModelProduct[]>(strUrl).subscribe(pArrProduct => {
      product$?.unsubscribe();
      pOnComplete(pArrProduct);
    }, pException => {
      product$?.unsubscribe();
      if (pException == null) {
        return;
      }
      let strHeader = (pException.message || "").toString().trim();
      let strMessage = (pException.error || "").toString().trim();
      if (typeof (pOnError) === "function") {
        pOnError(<Error>{
          message: strHeader,
          stack: strMessage
        });
      } else {
        Swal.fire(strHeader, `<pre>${strMessage}</pre>`, "error");
      }
    });
  }
  async GetProductAsync(): Promise<ModelProduct[]> {
    let strUrl: string = (this._svShared.urlSale || "").toString().trim() + "/api/Invoice/GetProductService";
    let result = <ModelProduct[]>await this._httpClient.get(strUrl).toPromise();
    return result;
  }

  GetSysDateString() {
    return this.GetFormatDate(this._svShared.systemDate);
  }
  GetFormatDate(pDateInput: Date): string {
    if (pDateInput == null) {
      return null;
    }
    let result: string = moment(pDateInput).format('YYYY-MM-DD');
    return result;
  }
  GetFormatDateTime(pDateInput: Date): string {
    if (pDateInput == null) {
      return null;
    }
    let result: string = moment(pDateInput).format('YYYY-MM-DDTHH:mmZ');
    return result;
  }
  GetFormatPhoneNumber(pStrPhoneInput: string): string {
    pStrPhoneInput = (pStrPhoneInput || "").toString().trim();
    if (pStrPhoneInput === "") {
      return "";
    }
    return pStrPhoneInput.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
  }
  // GetRealDate(pDateInput: Date): Date {
  //   if (!this.IsValidDate(pDateInput)) {
  //     return null;
  //   }
  //   let strJson = pDateInput.toJSON();
  //   strJson = strJson.split("T")[0] + "T00:00:00.000Z";
  //   let result = new Date(strJson);
  //   return result;
  //   /*
  //   let result = new Date(pDateInput.getTime() - (pDateInput.getTimezoneOffset() * 60000));
  //   return result;
  //   */
  // }
  GetThaiDocStatus(pStrDocStatus: string): string {
    switch (pStrDocStatus) {
      case "Active": return "แอคทีฟ";
      case "New": return "สร้าง";
      case "Wait": return "รออนุมัติ";
      case "Ready": return "พร้อมใช้";
      case "Reference": return "เอกสารถูกอ้างอิง";
      case "Cancel": return "ยกเลิก";
      default: return pStrDocStatus;
    }
  }
  IsValidDate(pDateInput: Date): boolean {
    return pDateInput && Object.prototype.toString.call(pDateInput) === "[object Date]" && !isNaN(<number>(<any>pDateInput));
  }
  IsNumeric(param : any) {
    return !isNaN(parseFloat(param)) && isFinite(param);
  }
  RemoveNavBorder() {
    let arrNav = document.getElementsByTagName("nav");
    if (arrNav.length) {
      let navHeader = <HTMLDivElement>arrNav[0];
      if (navHeader && !navHeader?.className.includes("border-0")) {
        navHeader.className += " border-0";
      }
    }
  }

  ShowCancelDialog(pOnCancel: () => void) {
    if (typeof pOnCancel !== "function") {
      return;
    }
    let swalOption = <SweetAlertOptions>{
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: "ตกลง",
      denyButtonText: "ยกเลิก",
      icon: 'warning',
      showDenyButton: true,
      title: 'คุณต้องการยกเลิกเอกสารใช่หรือไม่?',
    };
    Swal.fire(swalOption).then((result) => {
      if (result.isConfirmed) {
        pOnCancel();
      } else if (result.isDenied) {
      }
    })
  }
  async ShowCancelDialogAsync(): Promise<boolean> {
    let swalOption = <SweetAlertOptions>{
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: "ตกลง",
      denyButtonText: "ยกเลิก",
      icon: 'question',
      showDenyButton: true,
      title: 'คุณต้องการยกเลิกเอกสารใช่หรือไม่?',
    };
    let result: SweetAlertResult<any> = await Swal.fire(swalOption);
    if (result.isConfirmed) {
      return true;
    } else if (result.isDenied) {
      return false;
    }
  }
  async ShowConfirmDialog(pStrMessage: string) {
    pStrMessage = (pStrMessage || "").toString().trim();
    let swalOption = <SweetAlertOptions>{
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: "ตกลง",
      denyButtonText: "ยกเลิก",
      icon: 'warning',
      showDenyButton: true,
      title: pStrMessage,
    };
    let result: SweetAlertResult<any> = await Swal.fire(swalOption);
    return result.isConfirmed;
  }

  ShowClearDialog(pOnClear: () => void) {
    if (typeof pOnClear !== "function") {
      return;
    }
    let swalOption = <SweetAlertOptions>{
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: "ตกลง",
      denyButtonText: "ยกเลิก",
      icon: 'warning',
      showDenyButton: true,
      title: 'คุณต้องการล้างข้อมูลที่กรอกไว้ ใช่หรือไม่?',
    }
    Swal.fire(swalOption).then((result) => {
      if (result.isConfirmed) {
        pOnClear();
      } else if (result.isDenied) {
      }
    })
  }
  async ShowClearDialogAsync(): Promise<boolean> {
    let swalOption = <SweetAlertOptions>{
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: "ตกลง",
      denyButtonText: "ยกเลิก",
      icon: 'warning',
      showDenyButton: true,
      title: 'คุณต้องการล้างข้อมูลที่กรอกไว้ ใช่หรือไม่?',
    }
    let result: SweetAlertResult<any> = await Swal.fire(swalOption);
    if (result.isConfirmed) {
      return true;
    } else if (result.isDenied) {
      return false;
    }
  }
  async ShowSaveCompleteDialogAsync(): Promise<void> {
    let swalOption = <SweetAlertOptions>{
      allowEscapeKey: false,
      allowOutsideClick: false,
      icon: 'success',
      title: 'บันทึกข้อมูลสำเร็จ',
    };
    await Swal.fire(swalOption);
  }
  EncodeHtml(pStrInput: string) {
    pStrInput = (pStrInput || "").toString().trim();
    return String(pStrInput).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  EncodeSql(pStrInput: string) {
    let result = this.GetString(pStrInput);
    if(result === ""){
      return "";
    }
    result = result.replace(/'/g,"''");
    return result;
  }

  ShowWarningDialog(message: string) {
    if (message == null || (message === "")) {
      return;
    }
    let strTitle = `<span class="mx-0 px-0"><span class="text-bold text-warning text-lg">Warning</span><br/></span>`;
    let strHtml = `<pre class="mx-0 px-0 text-dark text-justify text-xs">${message}</pre>`;
    let swalOption = <SweetAlertOptions>{
      width: "50%",
      html: strHtml,
      title: strTitle,
    };
    if (Swal.isVisible() && !Swal.isLoading()) {
    } else {
      Swal.fire(swalOption);
    }
  }

  ShowExceptionDialog(pException: ModelException) {
    if (pException == null || (pException.message === "" && pException.stackTrace === "")) {
      // Swal.close();
      return;
    }
    let strTitle = `<span class="mx-0 px-0"><span class="text-bold text-danger text-lg">เกิดข้อผิดพลาด</span><br/>${this.EncodeHtml(pException.message)}</span>`;
    let strHtml = `<pre class="mx-0 px-0 text-dark text-justify text-xs">${this.EncodeHtml(pException.stackTrace)}</pre>`;

    let swalOption = <SweetAlertOptions>{
      width: "90%",
      html: strHtml,
      // icon : "error",
      // iconColor : "gray",
      title: strTitle,
      // position : "bottom",
      // showClass: { popup : ""} ,
      // hideClass : {popup : ""}
    };
    if (Swal.isVisible() && !Swal.isLoading()) {
      // Swal.getValidationMessage
    } else {
      Swal.fire(swalOption);
    }
    // Swal.fire(pException.message , `<pre>${pException.stackTrace}</pre>` , "error");
  }
  ShowModal<T>(pContent: any, pStrSize: "xl" | "lg" | "xs" | "sm", pOncomplete: (x: T) => void, pInput?: any) {
    if (pContent == null) {
      return;
    }
    let modalRef: NgbModalRef = this._svModal.open(pContent, { size: pStrSize });
    if (pInput != null) {
      for (const key in pInput) {
        if (Object.prototype.hasOwnProperty.call(pInput, key)) {
          modalRef.componentInstance[key] = pInput[key];
        }
      }
    }
    if (typeof (pOncomplete) === "function") {
      modalRef.result.then(x => pOncomplete(x), r => { }).catch(x => { });
    }
  }
  async ShowModalAsync<T>(pContent: any, pStrSize: "xl" | "lg" | "xs" | "sm", pInput?: any): Promise<T> {
    if (pContent == null) {
      return;
    }
    let modalRef: NgbModalRef = this._svModal.open(pContent, { size: pStrSize });
    if (pInput != null) {
      for (const key in pInput) {
        if (Object.prototype.hasOwnProperty.call(pInput, key)) {
          modalRef.componentInstance[key] = pInput[key];
        }
      }
    }
    return <T>await modalRef.result;
  }
  ShowModalProduct(pOncomplete: (pArrSelectProduct: ModelCommon.ModelProduct[]) => void) {
    this.ShowModal<ModelCommon.ModelProduct[]>(ModalProductComponent, "xl", pOncomplete);
  }

  async ShowModalProductAsync(pArrSelectProduct?: ModelProduct[]): Promise<ModelProduct[]> {
    // @Input() ArrSelectProduct :  ModelCommon.ModelProduct[] = [];
    let param = {
      ArrSelectProduct: pArrSelectProduct
    };
    return await this.ShowModalAsync<ModelProduct[]>(ModalProductComponent, "xl", param);
  }

  public async ShowModalProduct2(pArrProduct: ModelMasProduct[], pArrSelectProduct?: ModelMasProduct[] , pCanDuplicate? : boolean ) {
    let param = {
      ArrProduct: pArrProduct,
      ArrSelectProduct: pArrSelectProduct,
      CanDuplicate : pCanDuplicate
    };
    return await this.ShowModalAsync<ModelMasProduct[]>(ModalProduct2Component, "xl", param);
  }
  public IsArray(pInput: any): boolean {
    let result: boolean;
    result = Array.isArray(pInput) && !!pInput.length;
    return result;
  }

  public GetString(pInput: any): string {
    let result: string = "";
    result = (pInput || "").toString().trim();
    return result;
  }

  public GetNumber(pInput : number , pIntDigit : number) : number{
    if(pInput === null){
      return 0;
    }
    //let result = <any>pInput.toFixed(pIntDigit) * 1;
    let result = pInput.toLocaleString("en-US", {maximumFractionDigits: pIntDigit,useGrouping: false});
    return parseFloat(result);
  }

  // public async GetClientIp(){
  //   let strUrl = this._svShared.urlMas + "/api/Approve/GetIp"
  //   let result = await this._httpClient.get(strUrl,{responseType:"text"}).toPromise();
  //   return result;
  // }

  public DownLoadFile(fileName: string, data: any, type: string) {

    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);

    let a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.removeChild(a);
  }

  public async GetPositionRole(pStrEmpCode : string , pStrRouteUrl : string){
    let strUrl = this._svShared.urlMas + `/api/Menu/GetPositionRole/${pStrEmpCode}/${pStrRouteUrl}`;
    let result = await this._httpClient.get<ModelSysPositionRole>(strUrl).toPromise();
    return result;
  }

  public GetAuthPositionRole(): any {
    let menuId = localStorage.getItem("menuId");
    let positionRoleObject = localStorage.getItem('positionroles')
    let positionRoleData = JSON.parse(positionRoleObject)
    return positionRoleData.find((x: { menuId: string; }) => x.menuId == menuId);
  }

  public ShowPositionRoleMessage(pCheckMode : "IsCreate" | "IsView" | "IsEdit" | "IsCancel" | "IsPrint"){
    let strMessage = "";
    switch (pCheckMode) {
      case "IsCancel" :
        strMessage = "คุณไม่มีสิทธ์ยกเลิกเอกสาร";
        break;
      case "IsCreate" :
        strMessage = "คุณไม่มีสิทธ์สร้างเอกสาร";
        break;
      case "IsEdit" :
        strMessage = "คุณไม่มีสิทธ์แก้ไขเอกสาร";
        break;
      case "IsPrint" :
        strMessage = "คุณไม่มีสิทธ์พิมพ์เอกสาร";
        break;
      case "IsView" :
        strMessage = "คุณไม่มีสิทธ์ใช้งานหน้านี้";
        break;
    }
    Swal.fire("" , strMessage , "warning");
  }
  public ValidatePositionRole(pPositionRole : ModelSysPositionRole , pCheckMode : "IsCreate" | "IsView" | "IsEdit" | "IsCancel" | "IsPrint"){
    if(pPositionRole == null){
      return false;
    }
    return pPositionRole[pCheckMode] === "Y";
    // switch (pCheckMode) {
    //   case "Cancel":
    //     return pPositionRole.IsCancel === 'Y';
    //   case "Create" :
    //     return pPositionRole.IsCreate === 'Y';
    //   case "Edit" :
    //     return pPositionRole.IsEdit === 'Y';
    //   case "Print" :
    //     return pPositionRole.IsPrint === "Y";
    //   case "View" :
    //     return


    //   default:
    //     break;
    // }
    //return true;
  }

  public ValidateAuthPositionRole(pPositionRole : any , pCheckMode : "isCreate" | "isView" | "isEdit" | "isCancel" | "isPrint"){
    if(pPositionRole == null){
      return false;
    }
    return pPositionRole[pCheckMode] === "Y";
  }

  public CheckDocBrnCode(pStrBrnCode : string ){
    pStrBrnCode = this.GetString(pStrBrnCode);

    if(pStrBrnCode === "" || pStrBrnCode !== this._svShared.brnCode){
      let swalOption = <SweetAlertOptions>{
        allowEscapeKey: false,
        allowOutsideClick: false,
        icon: 'error',
        title: 'เอกสารนี้มีรหัสสาขาไม่ถูกต้อง กรุณาเข้าสู่ระบบอีกครั้ง',
      };
      Swal.fire(swalOption).then(() => this.router.navigate(["Login"]));
      return false;
    }
    return true;
  }

  public GetEmployeeFullName(pEmployee : ModelMasEmployee) {

    if (pEmployee == null) {
      return null;
    }
    let strEmpFullName: string = "";
    let strPrefix = this.GetString(pEmployee.PrefixThai);
    let strFirstName = this.GetString(pEmployee.PersonFnameThai);
    let strLastName = this.GetString(pEmployee.PersonLnameThai);
    strEmpFullName = `${strPrefix} ${strFirstName} ${strLastName}`;
    return strEmpFullName;
  }

  public async GetEmployee(pStrEmpCode : string): Promise<ModelMasEmployee>{
    pStrEmpCode = this.GetString(pStrEmpCode);
    if(pStrEmpCode === ""){
      return null;
    }
    pStrEmpCode = encodeURI(pStrEmpCode);
    let strUrlInv = this.GetString( this._svShared.urlInv);
    let strUrl = strUrlInv + "/api/Audit/GetEmployee/" + pStrEmpCode;
    let result : ModelMasEmployee = null;
    result = await this._httpClient.get<ModelMasEmployee>(strUrl).toPromise();
    return result;
  }

  public async GetProductAllTypeList(param : {
    CompCode : string,
    LocCode : string,
    BrnCode : string,
    ArrProductID : string[],
    SystemDate : Date
  }){
    if(param == null){
      return null;
    }
    let strCompCode = this.GetString(param.CompCode);
    let strLocCode = this.GetString(param.LocCode);
    let strBrnCode = this.GetString(param.BrnCode);
    let strProductId = "";
    if(this.IsArray(param.ArrProductID)){
      strProductId = param.ArrProductID.join(",");
    }
    let strSystemDate = this.GetFormatDate(param.SystemDate);
    var data =
    {
      "CompCode": strCompCode,
      "LocCode": strLocCode,
      "BrnCode": strBrnCode,
      "PDListID": strProductId,
      "SystemDate": strSystemDate
    }
    let strUrl = this._svShared.urlMas + "/api/Product/GetProductAllTypeList";
    let apiResult = await this._httpClient.post(strUrl, data).toPromise();
    let result : ProductModel[] = [];
    if(apiResult != null && apiResult.hasOwnProperty("Data") && this.IsArray(apiResult["Data"])){
      result =(<any[]>apiResult["Data"]).map(x=>{
        let pd = new ProductModel();
        this.CopyObject(x , pd);
        return pd;
      });
    }
    return result;
  }

  public GetSummaryArray(pArray : any[] , pStrFieldName : string){
    if(!this.IsArray(pArray)){
      return 0.00;
    }
    pStrFieldName = this.GetString(pStrFieldName);
    if(pStrFieldName === ""){
      return 0.00;
    }
    let result = 0;
    for (let i = 0; i < pArray.length; i++) {
      const item = pArray[i];
      if(item == null){
        continue;
      }
      if(!item.hasOwnProperty(pStrFieldName)){
        continue;
      }
      let objFiledValue = item[pStrFieldName];
      if(!this.IsNumeric(objFiledValue)){
        continue;
      }
      let numFieldValue = this.GetNumber(objFiledValue,2);
      result += numFieldValue;
    }
    return result;
  }

  public ConVertToHtmlTable(pInput: object): string {
    if (!this.IsArray(pInput)) {
      return "";
    }
    let arrKey = Object.keys(pInput[0]);
    if (!this.IsArray(arrKey)) {
      return "";
    }
    let strHtmlHeader = '<thead><tr>' + arrKey.map(x => `<th class="text-center">${x}</th>`).join("") + "</tr></thead>"
    let strHtmlBody = "<tbody>";
    for (let i = 0; i < (<any>pInput).length; i++) {
      let dataRow = (<any>pInput)[i];
      let strHtmlRow = "<tr>" + arrKey.map(x => `<td class="align-middle">${dataRow[x]}</td>`).join("") + "</tr>";
      strHtmlBody += strHtmlRow;
    }
    strHtmlBody += "</tbody>";
    let result = "<table class='table table-hover table-sm'>" + strHtmlHeader + strHtmlBody + "</table>";
    return result;
  }

  public async ShowModalHtml(
    pInput: object,
    pStrModalHeader: string = "" ,
    pStrSize: "xl" | "lg" | "xs" | "sm" = "xl"
  ) {
    let strHtml = this.ConVertToHtmlTable(pInput);
    if (strHtml === "") {
      return;
    }
    let param = {
      HeaderInput: pStrModalHeader,
      HtmlInput: strHtml
    }
    await this.ShowModalAsync(ModalHtmlComponent, pStrSize, param);
  }
  public ShowErrorApimDialog(pException : ModelException){
    if(pException == null || pException.status !== 429){
      return;
    }
    let strMessage = this.GetString(pException.stackTrace);
    strMessage = strMessage
      .replace("Rate limit is exceeded. Try again in","เนื่องจากมีผู้เข้าใช้งานระบบเป็นจำนวนมาก<br/>กรุณาทำรายการในอีก")
      .replace("seconds.","วินาที ถัดไป");
    Swal.fire("",strMessage , "warning");
  }
  public ValidateApim(pInput : any){
    if(pInput == null){
      return true;
    }
    if(!pInput.hasOwnProperty("statusCode")){
      return true;
    }
    if(pInput["statusCode"] !== 429){
      return true;
    }
    let strMessage = this.GetString(pInput["message"]);
    strMessage = strMessage
      .replace("Rate limit is exceeded. Try again in","เนื่องจากมีผู้เข้าใช้งานระบบเป็นจำนวนมาก<br/>กรุณาทำรายการในอีก")
      .replace("seconds.","วินาที ถัดไป");
    Swal.fire("",strMessage , "warning");
    return false;
  }
}
