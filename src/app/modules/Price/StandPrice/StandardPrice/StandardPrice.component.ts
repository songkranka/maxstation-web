import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { ModelHiddenButton } from 'src/app/model/ModelCommon';
import { ModelMasBranch, ModelMasDocPatternDt, ModelMasProduct, ModelMasProductPrice, ModelOilStandardPriceDt, ModelOilStandardPriceHd } from 'src/app/model/ModelScaffold';
import { ApproveService } from 'src/app/modules/Master-data/Approve/Approve.service';
import { ModelApproveParam } from 'src/app/modules/Master-data/Approve/ModelApprove';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import Swal from 'sweetalert2';
import { ModelOtherDisplay, ModelStandardPrice, ModelStandardPriceDisplay, ModelStandardPriceProduct } from '../ModelStandardPrice';
import { StandardPriceService } from '../StandardPrice.service';

@Component({
  selector: 'app-StandardPrice',
  templateUrl: './StandardPrice.component.html',
  styleUrls: ['./StandardPrice.component.scss']
})
export class StandardPriceComponent implements OnInit {

  constructor(    
    public SvDefault : DefaultService,
    private _route : ActivatedRoute,
    private _svStandardPrice : StandardPriceService ,
    private _svShared : SharedService,
    private _svApprove : ApproveService,
    private authGuard: AuthGuard,
  ) { 

  }
  public HiddenButton : ModelHiddenButton = new ModelHiddenButton();
  public Header : ModelOilStandardPriceHd = new ModelOilStandardPriceHd();
  public ArrDetail : ModelOilStandardPriceDt[] = [];
  public ArrProduct : ModelMasProduct[] = [];
  public ArrDisplay : ModelStandardPriceDisplay[] = [];
  public ArrOther : ModelOtherDisplay[] = [];
  public ArrDiesel : ModelStandardPriceDisplay[] = [];
  public ArrBenzine : ModelStandardPriceDisplay[] = [];
  public ArrGas : ModelStandardPriceDisplay[] = [];
  public ArrBranch : ModelMasBranch[] = [];
  // public ArrReason : ModelMasReason[]=[];
  private _strBrnCode : string = "";
  private _strCompCode : string = "";
  private _strLocCode : string = "";
  private _strUser : string = "";
  private _datSystem : Date = null;
  private authPositionRole: any;
  action: string = "";

  private _arrFilterDeiselId : string[] = [
    "000001" , "000071" , "000072" , 
    "000073" , "000074"
  ];
  private _arrFilterBenzineId : string[] = [
    "000002","000004" , "000005", 
    "000010","000006" , "000008" ,
  ];
  private _arrFilterGasId : string[] = ["000011"];
  public ShowDate(pInput : Date){
    this.Header.EffectiveDate = <any>this.Header.DocDate;
    // this.Header.DocDate = pInput;   
    console.log(this.Header.EffectiveDate);
    alert(this.Header.EffectiveDate);
  }

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
    let strGuid : string = "";
    strGuid = (this._route.snapshot.params.DocGuid || "").toString().trim();
    await this.loadProduct();
    this.ArrBranch = await this._svStandardPrice.GetArrayBranch(this._strCompCode);
    if(strGuid === "New"){
      this.action = "New";
      await this.newData();      
    }else{
      this.action = "Edit";
      let standardPrice : ModelStandardPrice = null;
      standardPrice = await this._svStandardPrice.GetStandardPrice(strGuid);
      this.displayData(standardPrice);
    }
    
    if(this.Header.DocType === "Other"){
      this.loadArrayOther();
    }else{
      this.loadArrayDisplay();
    }
  }
  private loadArrayDisplay(){
    if(!(this.SvDefault.IsArray(this.ArrProduct) && this.SvDefault.IsArray(this.ArrDetail))){
      return;
    }
    this.ArrDisplay = this.ArrProduct.map(x=>{
      let dp = new ModelStandardPriceDisplay();
      dp.Product =x;
      
      let spdt : ModelOilStandardPriceDt = null;
      spdt = this.ArrDetail.find(y=> y.PdId === x.PdId);
      if(spdt == null){
        spdt = new ModelOilStandardPriceDt();
        spdt.BrnCode = this._strBrnCode;
        spdt.CompCode = this._strCompCode;
        spdt.PdId = x.PdId;      
      }else if(this.Header.DocStatus === "New"){
        spdt.BeforePrice = spdt.CurrentPrice;
        spdt.AdjustPrice = 0.00;
      }
      dp.StandardPriceDt = spdt;
      return dp;
    });
    this.ArrBenzine = this.ArrDisplay.filter(x=> this._arrFilterBenzineId.includes( x.Product.PdId));
    this.ArrDiesel = this.ArrDisplay.filter(x=> this._arrFilterDeiselId.includes( x.Product.PdId));
    this.ArrGas = this.ArrDisplay.filter(x=> this._arrFilterGasId.includes( x.Product.PdId));
  }
  private loadArrayOther(){
    this.ArrOther = [];
    if(!(this.SvDefault.IsArray(this.ArrProduct) && this.SvDefault.IsArray(this.ArrDetail))){
      return;
    }
    let arrBranch : string[] = null;
    arrBranch = this.ArrDetail.map(x=>x.BrnCode).filter((x,y,z)=> z.indexOf(x) === y);
    if(!this.SvDefault.IsArray(arrBranch)){
      return;
    }
    for (let i = 0; i < arrBranch.length; i++) {
      let strBrnCode = arrBranch[i];
      let opd = new ModelOtherDisplay(); 
      opd.BrnCode = strBrnCode;
      for (let j = 0; j < this.ArrProduct.length; j++) {
        let product = this.ArrProduct[j];
        let spdt : ModelOilStandardPriceDt = null;
        spdt = this.ArrDetail.find(y=> y.PdId === product.PdId && y.BrnCode === strBrnCode);
        if(spdt == null){
          spdt = new ModelOilStandardPriceDt();
          spdt.BrnCode = strBrnCode;
          spdt.CompCode = this._strCompCode;
          spdt.PdId = product.PdId;      
        }else if(this.Header.DocStatus === "New"){
          spdt.BeforePrice = spdt.CurrentPrice;
          spdt.AdjustPrice = 0.00;
        }
        let dp = new ModelStandardPriceDisplay();
        dp.Product = product;
        dp.StandardPriceDt = spdt;
        if(this._arrFilterBenzineId.includes(product.PdId)){
          opd.ArrBenzine.push(dp);
        }else if(this._arrFilterDeiselId.includes(product.PdId)){
          opd.ArrDiesel.push(dp);
        }else if(this._arrFilterGasId.includes(product.PdId)){
          opd.ArrGas.push(dp);
        }
      }
      this.ArrOther.push(opd);
    }
    if(this.SvDefault.IsArray(this.ArrOther)){
      let ot : ModelOtherDisplay = this.ArrOther[0];
      this.ArrBenzine = ot.ArrBenzine;
      this.ArrDiesel = ot.ArrDiesel;
      this.ArrGas = ot.ArrGas;
    }
    // this.ArrOther = arrBranch.map(strBranch=>{
    //   let opd = new ModelOtherDisplay(); 
    //   opd.BrnCode = strBranch;
    //   opd.ArrBenzine = this.ArrBenzine.filter(x=> x.StandardPriceDt.BrnCode === strBranch);
    //   opd.ArrDiesel = this.ArrDiesel.filter(x=> x.StandardPriceDt.BrnCode === strBranch);
    //   opd.ArrGas = this.ArrGas.filter(x=> x.StandardPriceDt.BrnCode === strBranch);
    //   return opd;
    // });

  }
  private async loadProduct(){
    let pp  = new ModelMasProductPrice();
    pp.BrnCode = this._strBrnCode;
    pp.CompCode = this._strCompCode;
    let sdp  : ModelStandardPriceProduct = null;
    sdp = await this._svStandardPrice.GetArrayProduct(pp);
    if(sdp == null){
      return;
    }
    //this.ArrDetail = sdp.ArrayStandardPriceDetail;
    this.ArrProduct = sdp.ArrayProduct;
    this.ArrDetail = this.ArrProduct.map(x=>{
      let dt : ModelOilStandardPriceDt = new ModelOilStandardPriceDt();
      dt.PdId = x.PdId;
      dt.BrnCode = this._strBrnCode;
      dt.CompCode = this._strCompCode;
      dt.DocNo = this.Header.DocNo;      
      return dt;
    });
  }
  public OnAdjPriceChange(pStandardPriceDt :ModelOilStandardPriceDt){
    this.SvDefault.DoAction(()=>this.onAdjPriceChange(pStandardPriceDt));
  }
  private onAdjPriceChange(pStandardPriceDt :ModelOilStandardPriceDt){
    if(pStandardPriceDt == null){
      return;
    }
    pStandardPriceDt.CurrentPrice = pStandardPriceDt.BeforePrice + pStandardPriceDt.AdjustPrice;
  }
  public OnAddBranchClick(){
    this.SvDefault.DoAction(()=> this.onAddBranchClick());
  }
  private onAddBranchClick(){
    let spd = new ModelOtherDisplay();   
    spd.ArrBenzine = this.SvDefault.CopyDeep(this.ArrBenzine);
    spd.ArrDiesel = this.SvDefault.CopyDeep(this.ArrDiesel);
    spd.ArrGas = this.SvDefault.CopyDeep(this.ArrGas);
    this.ArrOther.push(spd);
  }
  private displayData(pData: ModelStandardPrice) {
    if (pData == null) {
      return;
    }
    this.Header = pData.Header;
    this.Header.UpdatedBy = this._strUser;
    this.ArrDetail = pData.ArrayDetail;
    this.HiddenButton = this.SvDefault.GetHiddenButton2(this.Header.DocStatus, "N");
  }
  public async NewData(){
    await this.SvDefault.DoActionAsync(async()=>await this.newData(),true);
  }
  private async newData() {
    let arrPattern: ModelMasDocPatternDt[] = null;
    arrPattern = await this.SvDefault.GetPatternAsync("StandardPrice");
    let strPattern: string = "";
    strPattern = this.SvDefault.GenPatternString(this._datSystem, arrPattern, this._strCompCode, this._strBrnCode);
    this.Header.BrnCode = this._strBrnCode;
    this.Header.CompCode = this._strCompCode;
    this.Header.CreatedBy = this._strUser;
    this.Header.DocDate = this._datSystem;
    this.Header.EffectiveDate = this._datSystem;
    this.Header.DocNo = strPattern;
    this.Header.DocStatus = "Oil";
    // this.Header.DocPattern = strPattern;
    this.Header.DocStatus = "New";
    // this.Header.LocCode = this._strLocCode;
    // this.Header.Post = "N";
    this.HiddenButton = this.SvDefault.GetHiddenButton2("New" , "N");
  }
  public async UpdateStatus(pStrStatus : string){
    await this.SvDefault.DoActionAsync(async()=>await this.updateStatus(pStrStatus),true);
  }
  private async updateStatus(pStrStatus : string): Promise<void>{
    if(this.Header.ApproveStatus === 'Y'){
      Swal.fire("เอกสารนีได้รับการอนุมัติแล้วไม่สารถแก้ใขได้","","warning");
      return;
    }
    pStrStatus = (pStrStatus || "").toString().trim();
    if(pStrStatus === ""){
      return;
    }
    if(pStrStatus === "Cancel" && !await this.SvDefault.ShowCancelDialogAsync()){
      return;
    }
    let header : ModelOilStandardPriceHd = null;
    header = new ModelOilStandardPriceHd();
    this.SvDefault.CopyObject(this.Header , header);
    header.DocStatus = pStrStatus;
    let strGuid : string = "";
    strGuid = await this._svStandardPrice.UpdateStatus(header);
    await this.SvDefault.ShowSaveCompleteDialogAsync()
    window.location.href = "../StandardPrice/" + strGuid;
  }
  private async validateData(){
    if(this.Header.ApproveStatus === 'Y'){
      Swal.fire("เอกสารนีได้รับการอนุมัติแล้วไม่สารถแก้ใขได้","","warning");
      return false;
    }
    if(this.Header.DocType === "Other"){
      let arrBranch : string[] = null;
      arrBranch = this.ArrOther.map(x=> x.BrnCode);
      if(!this.SvDefault.IsArray(arrBranch)){
        Swal.fire("กรุณาเลือกสาขา" ,"" , "error");
        return false;
      }
      if(arrBranch.includes("")){
        Swal.fire("รหัสสาขาห้ามมีค่าว่าง" ,"" , "error");
        return false;
      }
      let arrBranchDuplicate : string[] = null;
      arrBranchDuplicate = arrBranch
        .filter((v,i,a)=> a.indexOf(v)!== i)
        .filter((v,i,a)=> a.indexOf(v)=== i);
      if(this.SvDefault.IsArray(arrBranchDuplicate)){
        let strHtmlMessage :string = "";
        strHtmlMessage = arrBranchDuplicate.join("<br/>");
        Swal.fire("รหัสสาขาซ้ำกัน" ,strHtmlMessage , "error");
        return false;
      }
    }
    var paramApprove = new ModelApproveParam();
    paramApprove.BrnCode = this.Header.BrnCode;
    paramApprove.CompCode = this.Header.CompCode;
    paramApprove.DocNo = this.Header.DocNo;
    paramApprove.DocType = "OilPrice";
    paramApprove.LocCode = "";
    let arrStep = await this._svApprove.ValidateApproveDocument(paramApprove);
    if(this.SvDefault.IsArray(arrStep)){
      let msg = arrStep.map(x=> x.EmpName + "<br/>").join("")
        + "ไม่สามารถบันทึกได้";
      Swal.fire("เอกสารนี้ถูกอนุมัติโดย" , msg , "warning");
      return false;
    }
    return true;
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
    
    if(!await this.validateData()){
      return;
    }
    let header : ModelOilStandardPriceHd = null;
    header = new ModelOilStandardPriceHd();
    this.SvDefault.CopyObject(this.Header , header);
    if(this.Header.DocStatus === "New"){
      header.DocDate = this.SvDefault.GetFormatDate(<any>header.DocDate);
    }else{
      //header = this.Header;
    }
    header.EffectiveDate = <any>this.SvDefault.GetFormatDate(header.EffectiveDate);
    header.ApproveDate = <any>this.SvDefault.GetFormatDate(header.ApproveDate);
    let param : ModelStandardPrice = null;
    param = new ModelStandardPrice();
    param.Header = header;
    
    param.ArrayDetail = this.ArrDisplay?.map(x=>x.StandardPriceDt) 
      || this.ArrDetail;
    switch (header.DocType) {
      case "Oil":
        param.ArrayDetail = param.ArrayDetail.filter(
          x=> this._arrFilterBenzineId.includes(x.PdId) 
          || this._arrFilterDeiselId.includes(x.PdId)
        );
        break;
      case "Gas" :
        param.ArrayDetail = param.ArrayDetail.filter(x=> this._arrFilterGasId.includes(x.PdId));
        break;
      case "Other" :
        param.ArrayDetail = this.converArrayOtherToArrayDetail(this.ArrOther); 
        break;
      default:
        break;
    }
    let strGuid : string = "";
    strGuid = await this._svStandardPrice.SaveStandardPrice(param);
    await this.SvDefault.ShowSaveCompleteDialogAsync()
    window.location.href = "../StandardPrice/" + strGuid;
  }

  private converArrayOtherToArrayDetail(pArrOther : ModelOtherDisplay[]) : ModelOilStandardPriceDt[]{
    //let arrDiesel = pArrOther.map(x=> x.)
    let funcSetBrnCode : (spd : ModelStandardPriceDisplay[] , brnCode : string) => void;
    funcSetBrnCode = ( spd , brnCode ) =>{
      for (let j = 0; j < spd.length; j++) {
        const item : ModelStandardPriceDisplay = spd[j];
        item.StandardPriceDt.BrnCode = brnCode;
      }
    }
    let result : ModelOilStandardPriceDt[] = [];
    for (let i = 0; i < pArrOther.length; i++) {
      const other : ModelOtherDisplay = pArrOther[i];
      funcSetBrnCode(other.ArrDiesel , other.BrnCode);
      funcSetBrnCode(other.ArrBenzine , other.BrnCode);
      funcSetBrnCode(other.ArrGas , other.BrnCode);
      let arrDiesel : ModelOilStandardPriceDt[] = other.ArrDiesel.map(x=> x.StandardPriceDt);
      let arrBenzine : ModelOilStandardPriceDt[] = other.ArrBenzine.map(x=> x.StandardPriceDt);
      let arrGas : ModelOilStandardPriceDt[] = other.ArrGas.map(x=> x.StandardPriceDt);
      result = [...result , ...arrDiesel , ...arrBenzine , ...arrGas];
    }
    return result;
  }
  public async OnBranchChange(pOther : ModelOtherDisplay){
    await this.SvDefault.DoActionAsync(async()=> await this.onBranchChange(pOther),true);
  }
  private async onBranchChange(pOther : ModelOtherDisplay){
    let strBrnCode = this.SvDefault.GetString(pOther.BrnCode);
    let arrDetail : ModelOilStandardPriceDt[] = null;
    let funcClearPrice : ( x : ModelStandardPriceDisplay[] )=> void = null;
    funcClearPrice = x => {
      for (let i = 0; i < x.length; i++) {
        const e = x[i];
        e.StandardPriceDt.AdjustPrice = 0.00;
        e.StandardPriceDt.BeforePrice = 0.00;
        e.StandardPriceDt.CurrentPrice = 0.00;
      }
    }
    funcClearPrice(pOther.ArrBenzine);
    funcClearPrice(pOther.ArrDiesel);
    funcClearPrice(pOther.ArrGas);
    arrDetail = await this._svStandardPrice.GetArrayStandardPriceDetail(this._strCompCode , strBrnCode);
    if(!this.SvDefault.IsArray(arrDetail)){
      return;
    }
    let funcMapPrice : (x : ModelStandardPriceDisplay[] , y : ModelOilStandardPriceDt[]) => void = null;
    funcMapPrice =  (arrDp,arrDt)=>{
        for (let i = 0; i < arrDp.length; i++) {
          const dp : ModelStandardPriceDisplay = arrDp[i];
          const dt: ModelOilStandardPriceDt = arrDt.find(x=> x.PdId === dp.StandardPriceDt.PdId);
          if(dt == null){
            continue;
          }
          dp.StandardPriceDt.BeforePrice = dt.CurrentPrice;
          dp.StandardPriceDt.CurrentPrice = dt.CurrentPrice;
        }
    };
    funcMapPrice(pOther.ArrBenzine , arrDetail);
    funcMapPrice(pOther.ArrDiesel , arrDetail);
    funcMapPrice(pOther.ArrGas , arrDetail);
  }
}
