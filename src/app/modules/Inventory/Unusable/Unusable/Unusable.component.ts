import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { ModelHiddenButton, ModelProduct } from 'src/app/model/ModelCommon';
import { ModelInvUnuseDt, ModelInvUnuseHd, ModelMasDocPatternDt, ModelMasProduct, ModelMasReason } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { ModalProductComponent } from 'src/app/shared/components/ModalProduct/ModalProduct.component';
import { SharedService } from 'src/app/shared/shared.service';
import Swal from 'sweetalert2';
import { ModelUnusable } from '../ModelUnusable';
import { UnusableService } from '../Unusable.service';

@Component({
  selector: 'app-Unusable',
  templateUrl: './Unusable.component.html',
  styleUrls: ['./Unusable.component.scss']
})
export class UnusableComponent implements OnInit {

  constructor(
    public SvDefault : DefaultService,
    private _route : ActivatedRoute,
    private _svUnusable : UnusableService ,
    private _svShared : SharedService,
    private authGuard: AuthGuard,
  ) { }
  public HiddenButton : ModelHiddenButton = new ModelHiddenButton();
  public Header : ModelInvUnuseHd = new ModelInvUnuseHd();
  public ArrDetail : ModelInvUnuseDt[] = [];
  public ArrReason : ModelMasReason[]=[];
  private _strBrnCode : string = "";
  private _strCompCode : string = "";
  private _strLocCode : string = "";
  private _strUser : string = "";
  private _datSystem : Date = null;
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

    this.ArrReason = await this._svUnusable.GetArrayReason();
    let strGuid : string = "";
    strGuid = (this._route.snapshot.params.DocGuid || "").toString().trim();
    if(strGuid === "New"){
      this.action = "New";
      await this.newData();
    }else{
      this.action = "Edit";
      let unusable : ModelUnusable = null;
      unusable = await this._svUnusable.GetUnusable(strGuid);
      if(!this.SvDefault.CheckDocBrnCode(unusable?.Header?.BrnCode)){
        return;
      }
      this.displayData(unusable);
    }
  }
  private displayData(pData: ModelUnusable) {
    if (pData == null) {
      return;
    }
    this.Header = pData.Header;
    this.Header.UpdatedBy = this._strUser;
    this.ArrDetail = pData.ArrayDetail;
    this.HiddenButton = this.SvDefault.GetHiddenButton2(this.Header.DocStatus, this.Header.Post);
  }
  public async NewData(){
    await this.SvDefault.DoActionAsync(async()=>await this.newData(),true);
  }
  private async newData() {
    let arrPattern: ModelMasDocPatternDt[] = null;
    arrPattern = await this.SvDefault.GetPatternAsync("Unusable");
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
    let header : ModelInvUnuseHd = null;
    if(this.Header.DocStatus === "New"){
      header = new ModelInvUnuseHd();
      this.SvDefault.CopyObject(this.Header , header);
      header.DocDate = this.SvDefault.GetFormatDate(<any>header.DocDate);
    }else{
      header = this.Header;
    }
    let param : ModelUnusable = null;
    param = new ModelUnusable();
    param.Header = header;
    param.ArrayDetail = this.ArrDetail;
    param = await this._svUnusable.SaveUnusable(param);
    this.displayData(param);
    Swal.fire("บันทึกข้อมูลสำเร็จ" , "", "success");
  }
  public async UpdateStatus(pStrStatus : string){
    await this.SvDefault.DoActionAsync(async()=>await this.updateStatus(pStrStatus),true);
  }
  private async updateStatus(pStrStatus : string){
    pStrStatus = (pStrStatus || "").toString().trim();
    if(pStrStatus === ""){
      return;
    }
    if(pStrStatus === "Cancel" && !await this.SvDefault.ShowCancelDialogAsync()){
      return;
    }
    let header : ModelInvUnuseHd = null;
    header = new ModelInvUnuseHd();
    this.SvDefault.CopyObject(this.Header , header);
    header.DocStatus = pStrStatus;
    header = await this._svUnusable.UpdateStatus(header);
    if(header != null){
      this.Header = header;
      this.HiddenButton = this.SvDefault.GetHiddenButton2(this.Header.DocStatus , this.Header.Post);
    }
    Swal.fire("บันทึกข้อมูลสำเร็จ" , "", "success");
  }
  private validateData() : boolean{
    let funShowError : (strMessage : string)=>void = null;
    funShowError = strMessage =>{
      Swal.fire(strMessage , "" , "error");
    };
    let strReason : string;
    strReason = ( this.Header.ReasonId || "" ).toString().trim();
    if(strReason === ""){
      funShowError("กรุณาเลือกเหตุผลที่โอนกลับ");
      return false;
    }

    if(!(Array.isArray(this.ArrDetail) && this.ArrDetail.length)){
      funShowError("ไม่พบรายการสินค้า");
      return false;
    }
    for (let i = 0; i < this.ArrDetail.length; i++) {
      const dt = this.ArrDetail[i];
      if(dt == null){
        continue;
      }
      if(dt.ItemQty <= 0){
        funShowError(`สินค้า ${dt.UnitBarcode} : ${dt.PdName} ต้องไส่จำนวนมากกว่า 0`);
        return false;
      }
    }
    return true;
  }
  public async ShowModalProduct(){
    await this.SvDefault.DoActionAsync(async()=> await this.showModalProduct());
  }
  private async showModalProduct(){
    let arrAllProduct : ModelMasProduct[] = null;
    Swal.showLoading();
    arrAllProduct = await this._svUnusable.GetArrayProduct();
    if(Swal.isLoading()){
      Swal.close();
    }
    let arrSelectProduct : ModelMasProduct[] = null;
    arrSelectProduct = this.ArrDetail.map(x=>{
      let pd : ModelMasProduct = new ModelMasProduct();
      this.SvDefault.CopyObject(x , pd);
      return pd;
    });
    let arrProduct : ModelMasProduct[] = null;
    arrProduct = await this.SvDefault.ShowModalProduct2(arrAllProduct , arrSelectProduct);
    if(!(Array.isArray(arrProduct) && arrProduct.length)){
      return;
    }
    this.ArrDetail = arrProduct.map(x=>{
      let dt : ModelInvUnuseDt = new ModelInvUnuseDt();
      this.SvDefault.CopyObject(x,dt);
      let unUse = this.ArrDetail.find(y=> y.PdId === x.PdId);
      if(unUse != null){
        dt.ItemQty = this.SvDefault.GetNumber(unUse.ItemQty , 2);
      }
      return dt;
    });
  }
}
