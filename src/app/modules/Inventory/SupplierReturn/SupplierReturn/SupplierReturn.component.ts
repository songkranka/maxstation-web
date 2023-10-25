import { stripSummaryForJitFileSuffix } from '@angular/compiler/src/aot/util';
import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ModelHiddenButton } from 'src/app/model/ModelCommon';
import { ModelInvReturnOilHd, ModelMasProduct, ModelInvReturnSupDt, ModelInvReturnSupHd, ModelMasBranch, ModelMasDocPatternDt, ModelMasEmployee, ModelMasReason, ModelInvReceiveProdDt, ModelInvReceiveProdHd } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import Swal from 'sweetalert2';
import { ModelSupplierReturnParam, ModelSupplierReturn, ModelSupplierReturnResult } from '../ModelSupplierReturn';
import { SupplierReturnService } from 'src/app/service/supplier-return-service/SupplierReturn.service';
import { ModelSupplierReturnDetail } from 'src/app/model/ModelSupplierReturn';
import { SupplierReturnModalComponent } from '../SupplierReturnModal/SupplierReturnModal.component';
import { ReturnOilService } from 'src/app/modules/Inventory/ReturnOil/ReturnOilService.service';
import { ModalReturnOilPOComponent } from 'src/app/modules/Inventory/ReturnOil/ModalReturnOilPO/ModalReturnOilPO.component';


import { ModalPurchaseOrderComponent } from '../../ReceiveGas/ModalPurchaseOrder/ModalPurchaseOrder.component';
import { AuthGuard } from 'src/app/guards/auth-guard.service';

@Component({
  selector: 'app-SupplierReturn',
  templateUrl: './SupplierReturn.component.html',
  styleUrls: ['./SupplierReturn.component.scss']
})
export class SupplierReturnComponent implements OnInit {

  constructor(
    private _svShared : SharedService ,
    public SvDefault : DefaultService,
    private _route : ActivatedRoute,
    private _svSupplierReturn : SupplierReturnService,
    private _svReturnOil : ReturnOilService,
    private authGuard: AuthGuard,
  ) { }
  DateRequest : Date = null;
  SupplierReturnHeader  = new ModelSupplierReturn();
  public HiddenButton : ModelHiddenButton = new ModelHiddenButton();
  public Header : ModelInvReturnSupHd = new ModelInvReturnSupHd();
  public ArrBranch : ModelMasBranch[]=[];
  public ArrDetail : ModelInvReturnSupDt[] = [];
  public ArrReason : ModelMasReason[]=[];
//   public ArrOilTerminal : ModelMasWarehouse[]=[];
  public StrEmployeeName : string = "";
  private _strBrnCode : string = "";
  private _strCompCode : string = "";
  private _strLocCode : string = "";
  private _strUser : string = "";
  private _datSystem : Date = null;
  private _arrReceiveProdDT : ModelInvReceiveProdDt[] = null;
  private authPositionRole: any;
  action: string = "";

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  async ngOnInit() {
    await this.SvDefault.DoActionAsync(async()=>await this.start(),true);
  }

  private async start(){
    this.authPositionRole = this.SvDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }

    this._strBrnCode = (this._svShared.brnCode || "").toString().trim();
    this._strCompCode = (this._svShared.compCode || "").toString().trim();
    this._strLocCode = (this._svShared.locCode || "").toString().trim();
    this._strUser = (this._svShared.user  || "").toString().trim();
    this._datSystem = this._svShared.systemDate;
    this.ArrBranch = await this.getArrayBranch();
    // this.ArrOilTerminal = await this.getArrayOilTerminal();
    this.ArrReason = await this.getArrayReason();
    let strGuid : string = "";
    strGuid = (this._route.snapshot.params.DocGuid || "").toString().trim();
    if(strGuid === "New"){
      this.action = "New";
      await this.newData();
    }else{
      this.action = "Edit";
      let SupplierReturn : ModelSupplierReturn = null;
      SupplierReturn =  await this._svSupplierReturn.GetSupplierReturn(strGuid);
      if(!this.SvDefault.CheckDocBrnCode(SupplierReturn?.Header?.BrnCode)){
        return;
      }
      this.displayData(SupplierReturn);
      this.loadreceiveHeader(SupplierReturn);
    }
    this.StrEmployeeName = await this.getEmployeeName(this.Header?.CreatedBy);
  }
  private displayData(supplierReturn: ModelSupplierReturn) {
    if (supplierReturn == null) {
      return;
    }
    this.Header = supplierReturn.Header;
    this.Header.UpdatedBy = this._strUser;
    this.ArrDetail = supplierReturn.ArrayDetail;
    this.HiddenButton = this.SvDefault.GetHiddenButton2(this.Header.DocStatus, this.Header.Post);
  }
  private async loadreceiveHeader(supplierReturn: ModelSupplierReturn){
    if (supplierReturn == null) {
      return;
    }
    let receiveHD : ModelInvReceiveProdHd = new ModelInvReceiveProdHd();
    receiveHD.BrnCode = supplierReturn.Header.BrnCode;
    receiveHD.CompCode = supplierReturn.Header.CompCode;
    receiveHD.DocDate = supplierReturn.Header.DocDate;
    receiveHD.DocNo = supplierReturn.Header.RefNo;
    receiveHD.LocCode = supplierReturn.Header.LocCode;
    receiveHD.PoNo = supplierReturn.Header.PoNo;
    receiveHD.SupCode = supplierReturn.Header.SupCode;
    receiveHD.SupName = supplierReturn.Header.SupName;
    this._arrReceiveProdDT = await this._svSupplierReturn.GetArrayReceiveProdDt(receiveHD);
  }
  public async NewData(){
    await this.SvDefault.DoActionAsync(async()=>await this.newData(),true);
  }
  private async newData() {
    let arrPattern: ModelMasDocPatternDt[] = null;
    arrPattern = await this.SvDefault.GetPatternAsync("ReturnSup");
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
    this.HiddenButton = this.SvDefault.GetHiddenButton2("New" , "N");
  }
  private async getArrayBranch(){
    let result : ModelMasBranch[] = null;
    result = await this._svSupplierReturn.GetArrayBranch();
    return result;
  }
  private async getArrayReason(): Promise<ModelMasReason[]>{
  let result : ModelMasReason[] = null;
  result = await this._svSupplierReturn.GetArrayReason();
  return result;
  }

  private async getEmployeeName(pStrEmpCode : string){
    let emp : ModelMasEmployee = null;
    emp = await this._svSupplierReturn.GetEmployee(pStrEmpCode);
    let result : string = "";
    if(emp == null){
      result = pStrEmpCode;
    }else{
      result = `${pStrEmpCode} : ${emp.PrefixThai} ${emp.PersonFnameThai} ${emp.PersonLnameThai}`;
    }
    return result;
  }
  public async SaveData(){
    await this.SvDefault.DoActionAsync(async()=> await this.saveData(),true);
  }
  private async saveData(){
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
    
    if(!this.validateData()){
      return;
    }
    let header : ModelInvReturnSupHd = null;
    if(this.Header.DocStatus === "New"){
      header = new ModelInvReturnSupHd();
      this.SvDefault.CopyObject(this.Header , header);
      header.DocDate = this.SvDefault.GetFormatDate(<any>header.DocDate);
    }else{
      header = this.Header;
    }
    let param : ModelSupplierReturn = null;
    param = new ModelSupplierReturn();
    param.Header = header;
    param.ArrayDetail = this.ArrDetail;
    param = await this._svSupplierReturn.SaveSupplierReturn(param);
    this.displayData(param);
    Swal.fire("บันทึกสำเร็จ" , "", "success");
  }

  public async ShowModalPO(){
    await this.SvDefault.DoActionAsync(async()=> await this.showModalPO());
  }
  private async showModalPO(){
    Swal.showLoading();

    let arrReceiveProd : ModelInvReceiveProdHd[] = null;
    arrReceiveProd = await this._svSupplierReturn.GetArrayReceiveProduct(this.Header);

    if(Swal.isLoading()){
      Swal.close();
    }
    if(!(Array.isArray(arrReceiveProd) && arrReceiveProd.length)){
      Swal.fire("ไม่พบเอกสาร PO","" , "warning");
      return;
    }
    let param = {
      ArrPoHeader : arrReceiveProd
    };
    let receiveHD : ModelInvReceiveProdHd = null;
    receiveHD =  await this.SvDefault.ShowModalAsync<ModelInvReceiveProdHd>(ModalReturnOilPOComponent , "lg"  , param);
    if(receiveHD == null){
      return;
    }
    Swal.showLoading();
    this._arrReceiveProdDT = await this._svSupplierReturn.GetArrayReceiveProdDt(receiveHD);
    if(Swal.isLoading()){
      Swal.close();
    }
    this.Header.PoNo = receiveHD.PoNo;
    this.Header.SupCode = receiveHD.SupCode;
    this.Header.SupName = receiveHD.SupName;
    this.Header.RefNo = receiveHD.DocNo;
    this.ArrDetail =[];
  }

  public async UpdateStatus(pStrStatus :string){
    await this.SvDefault.DoActionAsync(async() => await this.updateStatus(pStrStatus),true);
  }
  private async updateStatus(pStrStatus : string){
    pStrStatus = (pStrStatus || "").toString().trim();
    if(pStrStatus === ""){
      return;
    }
    if(pStrStatus === "Cancel" && !await this.SvDefault.ShowCancelDialogAsync()){
      return;
    }
    let header : ModelInvReturnSupHd = null;
    header = new ModelInvReturnSupHd();
    this.SvDefault.CopyObject(this.Header , header);
    header.DocStatus = pStrStatus;
    header = await this._svSupplierReturn.UpdateStatus(header);
    if(header != null){
      this.Header = header;
      this.HiddenButton = this.SvDefault.GetHiddenButton2(this.Header.DocStatus , this.Header.Post);
    }
    Swal.fire("บันทึกสำเร็จ" , "", "success").then(function() {
      window.location.reload();
    });
  }
  private validateData() : boolean{
    let funShowError : (strMessage : string)=>void = null;
    funShowError = strMessage =>{
      Swal.fire(strMessage , "" , "error");
    };
    let strReason : string;
    strReason = ( this.Header.ReasonId || "" ).toString().trim();
    if(strReason === ""){
      funShowError("กรุณาเลือกเหตุผลที่คืน");
      return false;
    }
    let strPoNo : string;
    strPoNo = (this.Header.PoNo || "").toString().trim();
    if(strPoNo === ""){
      funShowError("กรุณาเลือกใบสั่งซื้อ");
      return false;
    }
    if(!(Array.isArray(this.ArrDetail) && this.ArrDetail.length)){
      funShowError("ไม่พบรายการสินค้า กรุณาเปลี่ยนใบสั่งซื้อ");
      return false;
    }
    for (let i = 0; i < this.ArrDetail.length; i++) {
      const dt = this.ArrDetail[i];
      if(dt == null){
        continue;
      }
      if(dt.ItemQty > dt.RefQty){
        funShowError(`สินค้า ${dt.PdId} : ${dt.PdName} มี ปริมาณที่คืน เกิน ปริมาณในใบสั่งซื้อ`);
        return false;
      }
      if(dt.ItemQty < 0){
        funShowError(`สินค้า ${dt.PdId} : ${dt.PdName} มี ปริมาณที่คืน ติดลบ `);
        return false;
      }
      if(dt.ItemQty === 0){
        funShowError(`สินค้า ${dt.PdId} : ${dt.PdName} มี ปริมาณที่คืน เท่ากับ 0`);
        return false;
      }
    }
    return true;
  }

  public async ShowModalProduct(){
    await this.SvDefault.DoActionAsync(async()=>await this.showModalProduct(),false);
  }
  private async showModalProduct(){
    let funcShowAlertNoItem : ()=> void = null;
    funcShowAlertNoItem = ()=>{
      Swal.fire(`เอกสารเลขที่ ${this.Header.PoNo} ไม่มีรายการสินค้า` , "" , "warning");
    }
    if(!Array.isArray(this._arrReceiveProdDT) || !this._arrReceiveProdDT.length){
      if(this.Header.PoNo === ""){
        Swal.fire("กรุณาเลือกเลขที่เอกสารสั่งซื้อ" , "" , "warning");
      }else{
        funcShowAlertNoItem();
      }
      return;
    }
    let arrProdId : string[] = null;
    arrProdId = this._arrReceiveProdDT
      .map(x=> (x.PdId || "").toString().trim())
      .filter((x,i,a)=> a.indexOf(x)===i);
    if(!Array.isArray(arrProdId) || !arrProdId.length){
      funcShowAlertNoItem();
      return;
    }
    let arrSelectProd : ModelMasProduct[] = null;
    let funcMapDetail : (x : ModelInvReturnSupDt)=> ModelMasProduct = null;
    funcMapDetail = x=> {
      let pd : ModelMasProduct = new ModelMasProduct();
      this.SvDefault.CopyObject(x , pd);
      return pd;
    }
    arrSelectProd = this.ArrDetail.map(funcMapDetail);
    let arrProd : ModelMasProduct[] = null;
    Swal.showLoading();
    arrProd = await this._svReturnOil.GetArrayProduct(arrProdId);
    if(Swal.isLoading()){
      Swal.close();
    }
    if(!Array.isArray(arrProd) || !arrProd.length){
      funcShowAlertNoItem();
      return;
    }

    arrSelectProd = await this.SvDefault.ShowModalProduct2(arrProd , arrSelectProd);
    if(!Array.isArray(arrSelectProd) || !arrSelectProd.length){
      return;
    }
    let funcFilter : ( x : ModelInvReceiveProdDt) => boolean = null;
    funcFilter = x => arrSelectProd.some(y=> x.PdId === y.PdId)
      && !this.ArrDetail.some(y=> x.PdId === y.PdId);
    let funcMapData : ( v : ModelInvReceiveProdDt , i : number) => ModelInvReturnSupDt = null;
    funcMapData = (x,i)=>{
      let dt : ModelInvReturnSupDt = new ModelInvReturnSupDt();
      this.SvDefault.CopyObject(x , dt);
      let selectProd : ModelMasProduct = arrSelectProd.find(y=> y.PdId === x.PdId);
      this.SvDefault.CopyObject(selectProd , dt);
      dt.SeqNo = i+1;
      dt.RefQty = x.ItemQty-x.ReturnQty;
      dt.ItemQty =  x.ItemQty-x.ReturnQty;
      return dt;
    };
    let arrReturnOilDt : ModelInvReturnSupDt[] = null;
    arrReturnOilDt = this._arrReceiveProdDT.filter(funcFilter).map(funcMapData);
    if(!Array.isArray(arrReturnOilDt) || !arrReturnOilDt.length){
      return;
    }
    this.ArrDetail = [...this.ArrDetail , ... arrReturnOilDt];
  }
}
