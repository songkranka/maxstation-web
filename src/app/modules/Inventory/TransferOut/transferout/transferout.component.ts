import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { async } from 'rxjs/internal/scheduler/async';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { ModelHiddenButton } from 'src/app/model/ModelCommon';
import { ModelCheckStockRealtimeParam, ModelGetRequestDtListQueryResource, ModelGetRequestHdListQueryResource, ModelRequestHD, ModelTransferOutDT, ModelTransferOutHD, ModelTransferOutQueryResource } from 'src/app/model/ModelTransferOut';
import { DefaultService } from 'src/app/service/default.service';
import { TransferOutService } from 'src/app/service/transfer-out-service/TransferOut.service';
import { valueSelectbox } from 'src/app/shared-model/demoModel';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { SharedService } from 'src/app/shared/shared.service';
import Swal from 'sweetalert2';
import { textSpanIntersectsWithPosition } from 'typescript';
import { TransferOutModalRequestComponent } from '../transfer-out-modal-request/transfer-out-modal-request.component';

@Component({
  selector: 'app-transferout',
  templateUrl: './transferout.component.html',
  styleUrls: ['./transferout.component.scss']
})
export class TransferOutComponent implements OnInit {

  constructor(
    private _svTransferOut : TransferOutService ,
    private _route: ActivatedRoute,
    private _svDefault : DefaultService ,
    private _svShared : SharedService ,
    private authGuard: AuthGuard,
    private _datePipe: DatePipe,
    private _router : Router ,
  ) { }
  ArrBranchSelect : valueSelectbox[];
  DateRequest : Date = null;
  HiddenButton : ModelHiddenButton = new ModelHiddenButton();
  TransferOutHeader : ModelTransferOutHD = new ModelTransferOutHD();
  private authPositionRole: any;
  action: string = "";

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  ngOnInit() {
    
    // this._svShared.systemDate = new Date("01-01-2000");
    this.start();

  }
  private async newDocument(){
    Swal.showLoading();
    this.TransferOutHeader = new ModelTransferOutHD();
    this.DateRequest = null;
    this.TransferOutHeader.docDate = this._svShared.systemDate;
    this.TransferOutHeader.createdBy = (this._svShared.user || "").toString().trim();
    this.TransferOutHeader.brnCode = (this._svShared.brnCode || "").toString().trim();
    this.TransferOutHeader.compCode = (this._svShared.compCode || "").toString().trim();
    this.TransferOutHeader.locCode = (this._svShared.locCode || "").toString().trim();
    this.TransferOutHeader.post = "N";
    this.HiddenButton = this._svDefault.GetHiddenButton2(this.TransferOutHeader.docStatus , this.TransferOutHeader.post);
    await this.loadDocPattern();
    Swal.close();
    // this._svDefault.GetPattern((pStrDocPattern , pArrMasDocPattern) =>{
    //   this.TransferOutHeader.docNo = pStrDocPattern;
    //   this.TransferOutHeader.docPattern = pStrDocPattern;
    //   Swal.close();
    // } , null , "TransferOut");
  }
  private async loadDocPattern(){
    let arrDocPattern = await this._svDefault.GetPatternAsync("TransferOut");
    if(!this._svDefault.IsArray(arrDocPattern)){
      return;
    }
    let strPattern : string = this._svDefault.GenPatternString(this._svShared.systemDate , arrDocPattern , this._svShared.compCode , this._svShared.brnCode);
    this.TransferOutHeader.docPattern = strPattern;
    this.TransferOutHeader.docNo = strPattern;
  }

  private loadDocument(pStrGuid : string) : void{
    let param = new ModelTransferOutQueryResource();
    param.guid = pStrGuid;
    Swal.showLoading();
    this._svTransferOut.SearchTranOut(param , pData=>{
      if(!(Array.isArray(pData.data) && pData.data.length)){
        return;
      }
      this.TransferOutHeader = pData.data[0];
      if(!this._svDefault.CheckDocBrnCode(this.TransferOutHeader.brnCode)){
        return;
      }
      this.HiddenButton = this._svDefault.GetHiddenButton2(this.TransferOutHeader.docStatus , this.TransferOutHeader.post);
      let paramGetRequestHdList = new ModelGetRequestHdListQueryResource();
      paramGetRequestHdList.compCode = this.TransferOutHeader.compCode;
      paramGetRequestHdList.brnCodeFrom = this.TransferOutHeader.brnCodeTo;
      paramGetRequestHdList.docNo = this.TransferOutHeader.refNo;
      this._svTransferOut.GetRequestHdList(paramGetRequestHdList , pArrRequestHd =>{
        Swal.close();
        if(!(Array.isArray(pArrRequestHd) && pArrRequestHd.length)){
          return;
        }
        this.DateRequest = pArrRequestHd[0].docDate;
      }, pErr =>{
        Swal.fire(pErr.message || "" , "" , "error");
      });
    });
  }
  private start() : void{
    this.authPositionRole = this._svDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }

    let docGuid = (this._route.snapshot.params.DocGuid || "").toString().trim();
    if(docGuid === "New"){
      this.action = "New";
      this.newDocument();
    }else{
      this.action = "Edit";
      this.loadDocument(docGuid);
      // let param = new ModelTransferOutQueryResource();
      // param.guid = docGuid;
      // this._svTransferOut.SearchTranOut(param , pData=>{
      //   if(!(Array.isArray(pData.data) && pData.data.length)){
      //     return;
      //   }
      //   this.TransferOutHeader = pData.data[0];
      //   this.HiddenButton = this._svDefault.GetHiddenButton(this.TransferOutHeader.docStatus , this.TransferOutHeader.docDate);
      // });
    }
  }
  ShowModal(){
    this._svDefault.ShowModal<ModelRequestHD>(TransferOutModalRequestComponent , "lg" , pRequestHeader => {
      this.TransferOutHeader.refNo = pRequestHeader.docNo;
      this.TransferOutHeader.brnCodeTo = pRequestHeader.brnCodeTo;
      this.TransferOutHeader.brnNameTo = pRequestHeader.brnNameTo;
      this.DateRequest = pRequestHeader.docDate;
      let param = <ModelGetRequestDtListQueryResource>{
        brnCode : pRequestHeader.brnCode ,
        compCode : pRequestHeader.compCode ,
        docNo : pRequestHeader.docNo ,
        docTypeId : pRequestHeader.docTypeId ,
        locCode : pRequestHeader.locCode ,
      };
      this.loadRequestData(param);
    } );
  }

  private loadRequestData(pStrGuid : ModelGetRequestDtListQueryResource) : void{
    Swal.showLoading();
    this._svTransferOut.GetRequestDtList(pStrGuid , arrRequestDetail =>{
      if(Array.isArray(arrRequestDetail) && arrRequestDetail.length){
        this.TransferOutHeader.listTransOutDt = arrRequestDetail.map( x => <ModelTransferOutDT>{
          brnCode : (this._svShared.brnCode || "").toString().trim() ,
          compCode : (this._svShared.compCode  || "").toString().trim(),
          docNo : (this.TransferOutHeader.docNo  || "").toString().trim(),
          itemQty : 0.00 ,
          locCode : (this._svShared.locCode  || "").toString().trim(),
          pdId : x.pdId ,
          pdName : x.pdName ,
          seqNo : x.seqNo ,
          stockQty : x.stockQty ,
          stockRemain : x.stockRemain ,
          unitBarcode : x.unitBarcode ,
          unitId : x.unitId ,
          unitName : x.unitName ,
          refQty : x.itemQty,
        }); //Array Map
      };//if(Array.isArray(arrRequestDetail) && arrRequestDetail.length){
      Swal.close();
    }); //GetRequestDtList()
  }

  public OnKeyUp(event){
    console.log(event);

  }
  public numericOnly(event): boolean {
    let patt = /^([0-9])$/;
    let result = patt.test(event.key);
    return result;
}
  private async validateData(pTransferOutHeader : ModelTransferOutHD) {
    if(pTransferOutHeader == null){
      return false;
    }
    if((pTransferOutHeader.refNo || "") === ""){
      Swal.fire("กรุณาเลือกเอกสารร้องขอ" , "" , "warning");
      return false;
    }
    if(!(Array.isArray(pTransferOutHeader.listTransOutDt) && pTransferOutHeader.listTransOutDt.length )  ){
      Swal.fire("ไม่พบรายการร้องขอ" , "" , "warning");
      return false;
    }
    if(pTransferOutHeader.listTransOutDt.some( x=> x.itemQty > x.refQty || x.itemQty < 0)){
      Swal.fire("ห้ามกรอกข้อมูลปริมาณโอนจ่ายมากกว่าปริมาณที่ร้องขอ " , "" , "warning");
      return false;
    }
    if(pTransferOutHeader.listTransOutDt.some( x=> x.itemQty === 0)){
      Swal.fire("ปริมาณโอนจ่ายต้องมากกว่า 0 " , "" , "warning");
      return false;
    }
    let arrCheckStock = pTransferOutHeader.listTransOutDt.map( dt => <any>{
      PD_ID : dt.pdId,
      UNIT_ID : dt.unitId,
      UNIT_BARCODE : dt.unitBarcode,
      ITEM_QTY : dt.itemQty
    });
    let strCsr = JSON.stringify(arrCheckStock);
    let csrParam = <ModelCheckStockRealtimeParam>{
      BrnCode : pTransferOutHeader.brnCode,
      CompCode : pTransferOutHeader.compCode,
      DocDate : <any>this._svDefault.GetFormatDate(<any>pTransferOutHeader.docDate),
      Json : strCsr
    };
    let arrStockRealtime = await this._svTransferOut.CheckStockRealTime(csrParam);
    if(this._svDefault.IsArray(arrStockRealtime)){
      let strErrorMessage = "";
      for (let i = 0; i < arrStockRealtime.length; i++) {
        let sr = arrStockRealtime[i];
        let toDt = pTransferOutHeader.listTransOutDt.find(
          x=> x.pdId === sr.PdId
          && x.unitBarcode === sr.UnitBarCode
          && x.unitId === sr.UnitId
        );
        let strPdName = this._svDefault.GetString(toDt?.pdName);
        let strUnitName = this._svDefault.GetString(toDt?.unitName);
        strErrorMessage += `สินค้า ${sr.PdId} : ${strPdName} คงเหลือในสต็อก ${sr.Remain} ${strUnitName} \r\n`
      }
      await Swal.fire(strErrorMessage , "" , "error");
      return false;
    }
    return true;
  }
  GetBackgroundRibbon() {
    return this._svDefault.GetBackgroundRibbon(this.TransferOutHeader?.docStatus || "");
  }
  private updateData(pTransferOutHeader : ModelTransferOutHD){
    Swal.showLoading();
    this.TransferOutHeader.updatedBy = (this._svShared.user || "").toString().trim();
    this._svTransferOut.UpdateTransferOut(this.TransferOutHeader ,
      // (y)=>Swal.fire("บันทึกสำเร็จ" , "" , "success").then( x=> this._router.navigate(["TransferOut",y]))
      (y)=>Swal.fire("บันทึกสำเร็จ" , "" , "success").then( x=> {
        let strUrl = "../TransferOut/" + y;
        window.location.href = strUrl;
        // console.log(strUrl);
        // this._router.navigate([strUrl]);
      })
    );
  }
  private insertData(pTransferOutHeader : ModelTransferOutHD){
    Swal.showLoading();
    // this.TransferOutHeader.docDate = this._svDefault.GetRealDate( this.TransferOutHeader.docDate);
     this.TransferOutHeader.docDate = this._svDefault.GetFormatDate( <Date>this.TransferOutHeader.docDate);
    this._svTransferOut.InsertTransferOut(this.TransferOutHeader ,
      (y)=>Swal.fire("บันทึกสำเร็จ" , "" , "success").then( x=> {
        let strUrl = "../TransferOut/" + y['Data'];
        window.location.href = strUrl;
      })
    );
  }

  async saveDocument(){
    if(this.action === "New"){
      if (!this._svDefault.ValidateAuthPositionRole(this.authPositionRole, "isCreate")) {
        this._svDefault.ShowPositionRoleMessage("IsCreate");
        return;
      }
    }
    else if(this.action === "Edit"){
      if (!this._svDefault.ValidateAuthPositionRole(this.authPositionRole, "isEdit")) {
        this._svDefault.ShowPositionRoleMessage("IsEdit");
        return;
      }
    }

    let isValid = await this.validateData(this.TransferOutHeader);
    if(!isValid){
      return;
    }
    if(this.TransferOutHeader.docStatus === "New"){
      this.insertData(this.TransferOutHeader);
    }else{
      this.updateData(this.TransferOutHeader);
    }
  }
  approveDocument(){

  }
  rejectDocument(){

  }

  completeDocument(){

  }

  printDocument(){
    if (!this._svDefault.ValidateAuthPositionRole(this.authPositionRole, "isPrint")) {
      this._svDefault.ShowPositionRoleMessage("IsPrint");
      return;
    }

  }
  async cancelDocument(){
    if (!this._svDefault.ValidateAuthPositionRole(this.authPositionRole, "isCancel")) {
      this._svDefault.ShowPositionRoleMessage("IsCancel");
      return;
    }

    await this._svDefault.DoActionAsync(async()=>{
      if(await this._svDefault.ShowCancelDialogAsync()){
        this.TransferOutHeader.docStatus = "Cancel";
        this.updateData(this.TransferOutHeader);
      }
    });
  }
  clearDocument(){
    this._svDefault.ShowClearDialog(()=>{
      this.start();
    });
  }
}
