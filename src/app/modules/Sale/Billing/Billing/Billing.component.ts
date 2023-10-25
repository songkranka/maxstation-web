import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as ModelBilling from 'src/app/model/ModelBilling';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {CustomerModalComponent} from './../../../Invoice/CustomerModal/CustomerModal.component'
import * as ModelInvoice from './../../../Invoice/ModelInvoice';
import { from } from 'rxjs';
import { ViewChild } from '@angular/core';
import { NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BillingModalItemComponent } from './../BillingModalItem/BillingModalItem.component';
import { ServiceBilling } from 'src/app/service/billing-service/ServiceBilling.service';
import { ServiceInvoice } from 'src/app/modules/Invoice/ServiceInvoice.service';
import { DefaultService } from './../../../../service/default.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import * as ModelCommon from 'src/app/model/ModelCommon';
import { SharedService } from 'src/app/shared/shared.service';
import { async } from '@angular/core/testing';
import { ModelBilling2, ModelGetBillingModalItemOutput, ModelSaleBillingDetail } from 'src/app/model/ModelBilling';
import { ModelMasDocPattern } from 'src/app/model/ModelCommon';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { ExportData, ReportService } from 'src/app/service/report-service/report-service';
import { ReportConfig } from 'src/app/model/report/master/reportconfig.interface';

@Component({
  selector: 'app-Billing',
  templateUrl: './Billing.component.html',
  styleUrls: ['./Billing.component.scss']
})
export class BillingComponent implements OnInit , AfterViewInit {
  constructor(
    private _matDialog : MatDialog ,
    private _modalService : NgbModal ,
    private _svBilling : ServiceBilling ,
    private _serviceInvoice : ServiceInvoice ,
    public SvDefault : DefaultService ,
    private _route: ActivatedRoute,
    private _router : Router ,
    private _svShared : SharedService,
    private reportService: ReportService,
    private authGuard: AuthGuard,
  ) { }
  ArrBillingDetail : ModelBilling.ModelSaleBillingDetail[] = [];
  ArrDisplayColumn : string[] = ['txDate' , 'docNo' , 'txType' , 'txBrnCode' , 'txAmt' , 'Delete'];
  BillingHeader : ModelBilling.ModelSaleBillingHeader = new ModelBilling.ModelSaleBillingHeader();
  CredittermDate : NgbDate = new NgbDate(0,0,0);
  HiddenButton = new ModelCommon.ModelHiddenButton();
  isPdf: string = "";
  isExcel: string = "";
  reportUrl: string = "";
  excelUrl: string = "";
  reportName: string = "";
  private authPositionRole: any;
  action: string = "";
  @ViewChild('modalCustomer') _modalCustomer : CustomerModalComponent;

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  async ngOnInit() {
    await this.SvDefault.DoActionAsync(async()=> await this.startAsync() , true);
  }

  ngAfterViewInit(){
    this.SvDefault.DoAction(()=> this.SvDefault.RemoveNavBorder());
  }

  private addDays(date : Date, days : number) : NgbDate {
    let dat1 = new Date(date);
    dat1.setDate(dat1.getDate() + days);
    let result = new NgbDate(dat1.getFullYear() , dat1.getMonth() +1 , dat1.getDate());
    return result;
  }
  private calculateSummary(){
    let intTotalAmt = 0;
    if(Array.isArray( this.ArrBillingDetail) && this.ArrBillingDetail.length){
      for (let i = 0; i < this.ArrBillingDetail.length; i++) {
        const bd = this.ArrBillingDetail[i];
        intTotalAmt += bd.TxAmt || 0.00;
      }
    }
    this.BillingHeader.TotalAmt = intTotalAmt;
  }

  DtpCredit_Change(pEvent : NgbDate ){
    this.SvDefault.DoAction(()=>{
      let docDate = new Date( this.BillingHeader.DocDate);
      let d1 = new Date(docDate.getFullYear() , docDate.getMonth() +1 , docDate.getDate() );
      let d2 = new Date(pEvent.year , pEvent.month , pEvent.day);
      let dateDiff = d2.valueOf() - d1.valueOf();
      this.BillingHeader.CreditTerm =  Math.ceil(dateDiff / (1000 * 60 * 60 * 24));
    });
  }

  private async startAsync() : Promise<void> {
    this.authPositionRole = this.SvDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }

    this.getReportConfig("Billing");
    // let strDocNo = (this._route?.snapshot?.queryParams?.DocNo || "").toString().trim();
    let strGuid = this._route.snapshot.params.DocGuid;
    if(strGuid === "New"){
      this.action = "New";
      this.BillingHeader = new ModelBilling.ModelSaleBillingHeader();
      this.ArrBillingDetail = [];
      this.BillingHeader.CreatedBy = (this._svShared.user || "").toString().trim();
      this.BillingHeader.DocDate = this._svShared.systemDate || new Date();
      this.BillingHeader.BrnCode = (this._svShared.brnCode || "").toString().trim();
      this.BillingHeader.CompCode = (this._svShared.compCode || "").toString().trim();
      this.BillingHeader.LocCode = (this._svShared.locCode || "".toString().trim());
      this.CredittermDate = this.addDays(this.BillingHeader.DocDate, 0);
      let arrPattern : ModelMasDocPattern[]= await this.SvDefault.GetPatternAsync("Billing");
      this.BillingHeader.DocNo = this.SvDefault.GenPatternString( this._svShared.systemDate , arrPattern , this.BillingHeader.CompCode ,  this.BillingHeader.BrnCode);
      this.BillingHeader.DocPattern = this.BillingHeader.DocNo;
    }else{
      this.action = "Edit";
      let headerDetail = await this._svBilling.GetBilling(strGuid);
      if(!this.SvDefault.CheckDocBrnCode(headerDetail?.Header?.BrnCode)){
        return;
      }
      if(headerDetail != null){
        this.BillingHeader = headerDetail.Header;
        this.ArrBillingDetail = headerDetail.ArrDetail;
        this.BillingHeader.UpdatedBy = this.SvDefault.GetString(this._svShared.user);
        this.CredittermDate = this.addDays(<Date>this.BillingHeader.DocDate, this.BillingHeader.CreditTerm);
      }
    }
    this.HiddenButton = this.SvDefault.GetHiddenButton2(this.BillingHeader.DocStatus , this.BillingHeader.Post);
    this.calculateSummary();
  }
  public async UpdateStatus(pStrStatus : string){
    await this.SvDefault.DoActionAsync(async()=> this.updateStatus(pStrStatus),true);
  }
  private async updateStatus(pStrStatus : string){
    pStrStatus = this.SvDefault.GetString(pStrStatus);
    if(pStrStatus === ""){
      return;
    }
    this.BillingHeader.DocStatus = pStrStatus;
    let strGuid = await this._svBilling.UpdateStatus(this.BillingHeader);
    if(strGuid !== ""){
      await this.SvDefault.ShowSaveCompleteDialogAsync();
      window.location.href = `/Billing/${strGuid}`;
      return;
    }
  }

  async approveDocument() {
    await this.SvDefault.DoActionAsync(async()=>{
      this.HiddenButton.status = "พร้อมใช้";
      this.BillingHeader.DocStatus = "Ready";
      await this.saveDocument();
    });
  };

  async saveDocument(){
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
    
    await this.SvDefault.DoActionAsync(async()=>{
      if(!this.validateData()){
        return;
      }
      for (let i = 0; i < this.ArrBillingDetail.length; i++) {
        let dt = this.ArrBillingDetail[i];
        dt.SeqNo = i+1;
      }
      // let modelHeaderDetail =  <ModelCommon.ModelHeaderDetail<ModelBilling.ModelSaleBillingHeader , ModelBilling.ModelSaleBillingDetail>>{
      //   header : this.BillingHeader ,
      //   arrDetail : this.ArrBillingDetail,
      // };
      let billing = <ModelBilling2>{
        Header : this.BillingHeader,
        ArrDetail : this.ArrBillingDetail
      };
      let strGuid = "";
      this.BillingHeader.DocDate = this.SvDefault.GetFormatDate(<Date>this.BillingHeader.DocDate);
      this.BillingHeader.DueDate = new Date(
        this.CredittermDate.year,
        this.CredittermDate.month - 1,
        this.CredittermDate.day
      );
      if(this.BillingHeader.DocStatus === "New"){
        // this.BillingHeader.CreatedDate = new Date();
        strGuid = await this._svBilling.InsertBillingAsync(billing);
      }else{
        // this.BillingHeader.UpdatedDate = new Date();
        strGuid = await this._svBilling.UpdateBillingAsyc(billing);
        //modelHeaderDetail = await this._svBilling.UpdateBillingAsyc(modelHeaderDetail);
      }
      if(strGuid !== ""){
        await this.SvDefault.ShowSaveCompleteDialogAsync();
        window.location.href = `/Billing/${strGuid}`;
        return;
      }
      // if(modelHeaderDetail != null){
      //   this.BillingHeader = modelHeaderDetail.header;
      //   this.ArrBillingDetail = modelHeaderDetail.arrDetail;
      // }
      // this.HiddenButton = this.SvDefault.GetHiddenButton2(this.BillingHeader.DocStatus , this.BillingHeader.Post);
      // await this.SvDefault.ShowSaveCompleteDialogAsync();
    },true);
  }

  async rejectDocument() {
    await this.SvDefault.DoActionAsync(async()=>{
      this.HiddenButton.status = "แอคทีฟ";
      this.BillingHeader.DocStatus = "Active";
      await this.saveDocument();
    });
  };

  async completeDocument () {
    await this.SvDefault.DoActionAsync(async()=>{
      this.HiddenButton.status = "พร้อมใช้";
      this.BillingHeader.DocStatus = "Ready";
      await this.saveDocument();
    });
  };

  async exportPDF() {
    await this.SvDefault.DoActionAsync(async () => await this.ExportPDF(), true);
  };

  private async ExportPDF() {
    if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isPrint")) {
      this.SvDefault.ShowPositionRoleMessage("IsPrint");
      return;
    }

    await this.reportService.ExportReportBillingePDF(this.BillingHeader.CompCode, this.BillingHeader.BrnCode, this.BillingHeader.DocNo, this._svShared.user, this.BillingHeader.DocNo);
  }

  async exportExcel() {
    await this.SvDefault.DoActionAsync(async () => await this.ExportExcel(), true);
  }

  private async ExportExcel() {
    Swal.fire({
      title: 'กำลังโหลดข้อมูล กรุณารอสักครู่',
      allowEscapeKey: false,
      allowOutsideClick: false,
    });
    Swal.showLoading();
    await this.reportService.GetReportBillingExcel(this.BillingHeader.CompCode, this.BillingHeader.BrnCode, this.BillingHeader.DocNo, this._svShared.user, this.BillingHeader.DocNo);
  }

  getReportConfig(reportName: string) {
    this.reportService.findReportConfig(reportName)
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

  async cancelDocument(){
    if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isCancel")) {
      this.SvDefault.ShowPositionRoleMessage("IsCancel");
      return;
    }

    this.SvDefault.DoActionAsync(async()=>{
      if(await this.SvDefault.ShowCancelDialogAsync()){
        this.HiddenButton.status = "ยกเลิก";
        this.BillingHeader.DocStatus = "Cancel";
        await this.saveDocument();
      }
    });
  }
//   cancelDocumentOld = () => {
//     Swal.fire({
//       allowEscapeKey: false,
//       allowOutsideClick: false,
//       confirmButtonText: "ตกลง",
//       denyButtonText: "ยกเลิก",
//       icon : 'warning',
//       showDenyButton: true,
//       title: 'คุณต้องการยกเลิกเอกสารใช่หรือไม่?',
//     }).then((result) => {
//       if (result.isConfirmed) {
//         this.HiddenButton.status = "ยกเลิก";
//         this.BillingHeader.DocStatus = "Cancel";
//         this.saveDocument();
//       } else if (result.isDenied) {
//       }
//     })
//   };
  async clearDocument() {
    this.SvDefault.DoActionAsync(async()=>{
      if(await this.SvDefault.ShowClearDialogAsync()){
        await this.startAsync();
      }
    });
  }

  GetBackgroundRibbon(): string {
    let result : string ="";
    this.SvDefault.DoAction(()=>result = this.SvDefault.GetBackgroundRibbon(this.BillingHeader?.DocStatus || ""));
    return result;
  }

  private validateData() : boolean {
    let strCusCode = (this.BillingHeader?.CustCode || "").toString().trim();
    if(strCusCode === ""){
      Swal.fire("กรุณาเลือกข้อมูลลูกค้า", "" ,"warning");
      return false;
    }
    let intCreditTerm = (this.BillingHeader?.CreditTerm || 0);
    if(intCreditTerm === 0){
      Swal.fire("กรุณาเลือกวันครบกำหนดชำระ", "" ,"warning");
      return false;
    }
    if(intCreditTerm < 0){
      Swal.fire("วันครบกำหนดชำระ ต้องมากกว่าวันที่ระบบ", "" ,"warning");
      return false;
    }
    if(!(Array.isArray(this.ArrBillingDetail) && this.ArrBillingDetail.length)){
      Swal.fire("กรุณาเลือกเอกสารใบกำกับภาษีอย่างน้อย 1 รายการ", "" ,"warning");
      return false;
    }
    return true;
  }

  OpenDialogCustomer(){
    this.SvDefault.DoAction(()=>this._modalCustomer.ShowModal());
  }

  async OpenBillingModalAsync(){
    await this.SvDefault.DoActionAsync(async()=>await this.openBillingModal());
  }
  private async openBillingModal(){
    let arrSelectItem : ModelGetBillingModalItemOutput[] = null;
    if(Array.isArray(this.ArrBillingDetail) && this.ArrBillingDetail.length){
      arrSelectItem = this.ArrBillingDetail.map( x=> {
        let y = new ModelGetBillingModalItemOutput();
        y.DocDate = x.TxDate;
        y.DocNo = x.TxNo;
        y.DocType = x.TxType;
        y.BrnCode = x.TxBrnCode;
        y.TotalAmt = x.TxAmt;
        y.TotalAmtCur = x.TxAmtCur;
        return y;
      });
    }
    let modalParam = {
      CustomerCode : this.BillingHeader.CustCode ,
      SelectItem : arrSelectItem
    };
    let arrModalOutput : ModelGetBillingModalItemOutput[] = null;
    arrModalOutput = await this.SvDefault.ShowModalAsync<ModelGetBillingModalItemOutput[]>(BillingModalItemComponent ,"xl" , modalParam);
    if(!(Array.isArray(arrModalOutput) && arrModalOutput.length > 0)){
      return;
    }
    let arrDetail = arrModalOutput.map(y=>  <ModelBilling.ModelSaleBillingDetail>{
      BrnCode : this.BillingHeader.BrnCode ,
      CompCode : this.BillingHeader.CompCode ,
      DocNo : this.BillingHeader.DocNo ,
      LocCode : this.BillingHeader.LocCode,
      SeqNo : 0 ,
      TxAmt : y.TotalAmt ,
      TxBrnCode : y.BrnCode ,
      TxDate : y.DocDate,
      TxNo : y.DocNo ,
      TxType : y.DocType ,
      TxAmtCur : y.TotalAmtCur ,
    });
    if(Array.isArray( this.ArrBillingDetail) && this.ArrBillingDetail.length){
      arrDetail = arrDetail.filter( x => !this.ArrBillingDetail.some(
        y=> y.TxBrnCode === x.TxBrnCode
        && y.TxNo === x.TxNo
        && y.TxType === x.TxType
      ));
      this.ArrBillingDetail =[ ...this.ArrBillingDetail , ...arrDetail ];
    }else{
      this.ArrBillingDetail = [...arrDetail];
    }
    this.calculateSummary();
  }

OpnenBillingModal(){

    this._svBilling.ShowModal<ModelBilling.ModelGetBillingModalItemOutput[]>(BillingModalItemComponent , "xl" , x=>{
      let arrDetail = x.map(y=>  <ModelBilling.ModelSaleBillingDetail>{
        BrnCode : this.BillingHeader.BrnCode ,
        CompCode : this.BillingHeader.CompCode ,
        DocNo : this.BillingHeader.DocNo ,
        LocCode : this.BillingHeader.LocCode,
        SeqNo : 0 ,
        TxAmt : y.TotalAmt ,
        TxBrnCode : y.BrnCode ,
        TxDate : y.DocDate,
        TxNo : y.DocNo ,
        TxType : y.DocType ,
        TxAmtCur : y.TotalAmtCur ,
      });
      if(Array.isArray( this.ArrBillingDetail) && this.ArrBillingDetail.length){
        arrDetail = arrDetail.filter( x => !this.ArrBillingDetail.some(
          y=> y.LocCode === x.LocCode
          && y.BrnCode === x.BrnCode
          && y.CompCode === x.CompCode && x.DocNo === y.DocNo
        ));
        this.ArrBillingDetail =[ ...this.ArrBillingDetail , ...arrDetail ];
      }else{
        this.ArrBillingDetail = [...arrDetail];
      }
      this.calculateSummary();
    } ,{
      CustomerCode : this.BillingHeader.CustCode
    });
  }
  ReceiveCustomer(pCustomer : ModelInvoice.ModelGetCustomerListOutput){
    this.SvDefault.DoAction(()=>{
      this.BillingHeader.CustCode = pCustomer.CustCode;
      //this.BillingHeader.custPrefix = pCustomer.CustPrefix;
      this.BillingHeader.CustName = pCustomer.CustName;
      this.BillingHeader.CustAddr1 = pCustomer.Address;
      this.BillingHeader.CustAddr2 = pCustomer.CustAddr2;
      this.BillingHeader.CitizenId = pCustomer.CitizenId;
    });
  }
  private removeBillingDetail(pRow : any) : void{
    if(pRow == null){
      return;
    }
    this.ArrBillingDetail = this.ArrBillingDetail.filter(x=> x !== pRow);
    this.calculateSummary();
  }

  RemoveBillingDetail(pRow : any) : void{
    this.SvDefault.DoAction(()=>this.removeBillingDetail(pRow));
  }
}
