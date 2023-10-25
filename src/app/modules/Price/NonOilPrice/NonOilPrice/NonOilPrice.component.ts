import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { ModelBranch, ModelHiddenButton } from 'src/app/model/ModelCommon';
import { ModelMasBranch, ModelMasProduct, ModelPriNonoilDt, ModelPriNonoilHd } from 'src/app/model/ModelScaffold';
import { ApproveService } from 'src/app/modules/Master-data/Approve/Approve.service';
import { ModelApproveParam } from 'src/app/modules/Master-data/Approve/ModelApprove';
import { DefaultService } from 'src/app/service/default.service';
import { MasterService } from 'src/app/service/master-service/master.service';
import { SharedService } from 'src/app/shared/shared.service';
import Swal from 'sweetalert2';
import { ModelNonOilBranch, ModelNonOilDetail } from '../ModelNonOilPrice';
import { NonOilPriceService } from '../NonOilPriceService.service';

@Component({
  selector: 'app-NonOilPrice',
  templateUrl: './NonOilPrice.component.html',
  styleUrls: ['./NonOilPrice.component.scss']
})
export class NonOilPriceComponent implements OnInit {

  constructor(
    public SvDefault : DefaultService,
    private _svNonOil : NonOilPriceService,
    private _svMaster : MasterService,
    private _svShared : SharedService,
    private _route: ActivatedRoute,
    private _svApprove : ApproveService,
    private authGuard: AuthGuard,
  ) { }
  public Header  = new ModelPriNonoilHd();
  public HiddenButton = new ModelHiddenButton();  
  public ArrayDetail : ModelNonOilDetail[] = [];
  private _arrAllProduct : ModelMasProduct[]=[];
  public ArrAllBranch : ModelBranch[]=[];
  private _strCompCode = "";
  private _strBrnCode = "";
  private _strLocCode = "";
  private _strUser = "";
  private _arrDummyProduct = [
    { PdId : "000011" , PdName : "น้ำมันเครื่อง" , UnitName : "ขวด" },
    { PdId : "00123" , PdName : "น้ำกลั่น" , UnitName : "ขวด" },
    { PdId : "0000" , PdName : "น้ำดื่ม" , UnitName : "ลัง" },
    { PdId : "0001" , PdName : "โค้ก" , UnitName : "ป๋อง" },
  ];
  private _arrDummyBranch =[
    { BrnCode : "811" , BrnName : "เชียงใหม่"  },
    { BrnCode : "15G" , BrnName : "เชียงดาว2" },
    { BrnCode : "33K" , BrnName : "จอมทอง1(เชียงใหม่)" },
    { BrnCode : "001" , BrnName : "Tokyu" },
    { BrnCode : "002" , BrnName : "Warshington" },
  ];

  private authPositionRole: any;
  action: string = "";

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  async ngOnInit() {
    await this.SvDefault.DoActionAsync(async()=> await this.start(),true);
  }

  private async start(){
    this.authPositionRole = this.SvDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }

    this._strBrnCode = this.SvDefault.GetString(this._svShared.brnCode);
    this._strCompCode  = this.SvDefault.GetString(this._svShared.compCode);
    this._strLocCode  = this.SvDefault.GetString(this._svShared.locCode);
    this._strUser = this.SvDefault.GetString(this._svShared.user);
    this._arrAllProduct = await this._svNonOil.GetNonOilProduct();
    let objBranch = <any>await this._svMaster.getBranchList(this._strCompCode ,this._strLocCode);
    if(objBranch != null && objBranch.hasOwnProperty("Data") && this.SvDefault.IsArray(objBranch.Data)){
      this.ArrAllBranch = objBranch.Data;
    }
    let strGuid = this._route.snapshot.params.DocGuid;
    if(strGuid === "New"){
      this.action = "New";
      await this.newData();
    }else{
      this.action = "Edit";
      await this.getNonOilPrice(strGuid);
    }
  }
  private async getNonOilPrice(pStrGuid : string){
      let nonOilPrice = await this._svNonOil.GetNonOilPrice(pStrGuid);
      if(nonOilPrice== null || nonOilPrice.Header == null || !this.SvDefault.IsArray(nonOilPrice.ArrDetail)){
        return;
      }
      this.Header = nonOilPrice.Header;
      this.ArrayDetail = [];
      for (let i = 0; i < nonOilPrice.ArrDetail.length; i++) {
        const dt = nonOilPrice.ArrDetail[i];
        if(dt == null){
          continue;
        }
        if(this.ArrayDetail.some(x=> x.PdId === dt.PdId)){
          continue;
        }
        let nonOilDt : ModelNonOilDetail = null;
        if(this.SvDefault.IsArray(this.ArrayDetail)){
          nonOilDt = this.ArrayDetail.find(x=> x.PdId === dt.PdId);
        }
        let pd = this._arrAllProduct.find(x=> x.PdId === dt.PdId);
        nonOilDt = <ModelNonOilDetail>{
          PdId : dt.PdId,
          PdName : this.SvDefault.GetString( pd?.PdName),
          UnitId : this.SvDefault.GetString( pd?.UnitId)
        };
        nonOilDt.ArrayBranch = nonOilPrice.ArrDetail.filter(x=> x.PdId === dt.PdId).map(x=><ModelNonOilBranch>{
          AdjustPrice : x.AdjustPrice,
          BeforePrice : x.BeforePrice,
          BrnCode : x.BrnCode,
          CurrentPrice : x.CurrentPrice
        });
        this.ArrayDetail.push(nonOilDt);
      }
      this.HiddenButton = this.SvDefault.GetHiddenButton2(this.Header.DocStatus, "N");
  }

  public async NewData(){
    await this.SvDefault.DoActionAsync(async()=> await this.newData(),true);
  }
  private async newData(){
    let datSys = this._svShared.systemDate;
    this.Header = new ModelPriNonoilHd();
    this.Header.DocStatus = "New";
    this.Header.BrnCode = this._strBrnCode;
    this.Header.CompCode = this._strCompCode;
    this.Header.DocDate = datSys;    
    this.Header.CreatedBy = this._strUser;
    let arrDocPattern = await this.SvDefault.GetPatternAsync("NonOilPrice");
    let strPattern = this.SvDefault.GenPatternString(this.Header.DocDate, arrDocPattern, this._strCompCode, this._strBrnCode);
    this.Header.DocNo = strPattern;
    this.ArrayDetail = [];
    this.HiddenButton = this.SvDefault.GetHiddenButton2("New", "N");
  }

  // public AddProduct(){
  //   let dt = new ModelNonOilDetail();
  //   let numRandomIndex : number = Math.floor(Math.random()* this._arrDummyProduct.length);
  //   let randomProduct = this._arrDummyProduct[numRandomIndex];
  //   dt.PdId = randomProduct.PdId;
  //   dt.PdName = randomProduct.PdName;
  //   dt.UnitName = randomProduct.UnitName;
  //   this.ArrayDetail.push(dt);
  // }
  public async AddProduct(){
    await this.SvDefault.DoActionAsync(async()=>await this.addProduct(),false);
  }
  private async addProduct(){
    //Swal.showLoading();
    let arrProduct = this._arrAllProduct;

    // this.SvDefault
    if(!this.SvDefault.IsArray(arrProduct)){
      return;
    }
    let arrSelect : ModelMasProduct[] = [];
    if(this.SvDefault.IsArray(this.ArrayDetail)){
      arrSelect = this.ArrayDetail.map(x=> {
        let y = new ModelMasProduct();
        this.SvDefault.CopyObject(x,y);
        return y;
      });
    }
    let arrSelectProduct = await this.SvDefault.ShowModalProduct2(arrProduct ,arrSelect);
    if(!this.SvDefault.IsArray(arrSelectProduct)){
      return;
    }
    if(this.SvDefault.IsArray(arrSelectProduct)){
      let arrOldDetail = this.ArrayDetail.filter(x=> arrSelectProduct.some(y=> y.PdId == x.PdId));
      let arrNewDetail = arrSelectProduct.filter( 
        x=> !this.ArrayDetail.some(y=> x.PdId === y.PdId)
      ).map(x=> {
        let dt = new ModelNonOilDetail();
        this.SvDefault.CopyObject(x , dt);
        return dt;
      });
      this.ArrayDetail=[...arrOldDetail , ...arrNewDetail];
    }else{
      this.ArrayDetail=[];
    }
  }
  // public AddBranch(pDetail : ModelNonOilDetail){
  //   let branch = new ModelNonOilBranch();
  //   let numRandomIndex : number = Math.floor(Math.random()* this._arrDummyBranch.length);
  //   let randomBranch = this._arrDummyBranch[numRandomIndex];
  //   branch.BrnCode = randomBranch.BrnCode;
  //   branch.BrnName = randomBranch.BrnName;
  //   branch.BeforePrice = Math.floor(Math.random() * 100);
  //   branch.AdjustPrice = Math.floor(Math.random() * 10);
  //   branch.CurrentPrice = branch.BeforePrice + branch.AdjustPrice;
  //   pDetail.ArrayBranch.push(branch);
  // }
  public AddBranch(pDetail : ModelNonOilDetail){
    this.SvDefault.DoAction(()=> this.addBranch(pDetail));
  }  

  private addBranch(pDetail : ModelNonOilDetail){
    if(pDetail == null || pDetail.ArrayBranch.some(x=> x.BrnCode === "")){
      return;
    }
    pDetail.ArrayBranch.push(new ModelNonOilBranch());
  }

  public OnCurrentPriceChange(pBranch : ModelNonOilBranch){
    //pBranch.AdjustPrice = pBranch.CurrentPrice - pBranch.BeforePrice;
    pBranch.CurrentPrice = pBranch.BeforePrice + pBranch.AdjustPrice
  }
  public async OnBranchChange(pBranch : ModelNonOilBranch , pDetail : ModelNonOilDetail){
    await this.SvDefault.DoActionAsync(async()=> await this.onBranchChange(pBranch , pDetail),true);
  }

  private async onBranchChange(pBranch : ModelNonOilBranch , pDetail : ModelNonOilDetail){
    let dt = new ModelPriNonoilDt();
    dt.BrnCode = pBranch.BrnCode;
    dt.CompCode = this._strCompCode;
    dt.PdId = pDetail.PdId;
    let dt2 = await this._svNonOil.GetNonOilPriceDetail(dt);
    pBranch.BeforePrice = dt2?.CurrentPrice || 0;
    pBranch.AdjustPrice = 0;
    pBranch.CurrentPrice = pBranch.BeforePrice;
  }

  public async SaveData(){
    await this.SvDefault.DoActionAsync(async()=>await this.saveData(),true);
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
    let apiResult = await this._svNonOil.SaveNonOil(this.Header , this.ArrayDetail);
    if(apiResult == null){
      return;
    }
    await this.SvDefault.ShowSaveCompleteDialogAsync()
    window.location.href = "./NonOilPrice/" + (apiResult?.Header?.Guid || "");
  }

  private async validateData(){
    let funcShowError = ( x: string)=> {
      Swal.fire(x,"","warning");
    }
    if(this.Header.ApproveStatus === 'Y'){
      funcShowError("เอกสารนีได้รับการอนุมัติแล้วไม่สารถแก้ใขได้");
      return false;
    }
    if(this.Header.EffectiveDate == null){
      funcShowError("กรุณาเลือกวันที่มีผล");
      return false;
    }
    if(!this.SvDefault.IsArray(this.ArrayDetail)){
      funcShowError("ต้องมีสินค้าอย่างน้อย 1 รายการ");
      return false;
    }
    for (let i = 0; i < this.ArrayDetail.length; i++) {
      const dt = this.ArrayDetail[i];
      if(!this.SvDefault.IsArray(dt.ArrayBranch) || dt.ArrayBranch.some(x=> (x.BrnCode || "") === "")){
        funcShowError(`กรุณาเลือกสาขา ของรายการ ${dt.PdId} : ${dt.PdName} `);
        return false;
      }
      for (let j = 0; j < dt.ArrayBranch.length; j++) {
        const brn = dt.ArrayBranch[j];
        if(brn.AdjustPrice === 0){
          funcShowError(`รายการ ${dt.PdId} : ${dt.PdName} สาขา ${brn.BrnCode} : ${brn.BrnName} มีผลต่างเป็น 0`);
          return false;
        }
      }
      let arrBranch = dt.ArrayBranch.map(x=> x.BrnCode);
      let arrBranchDuplicate : string[] = null;
      arrBranchDuplicate = arrBranch
        .filter((v,i,a)=> a.indexOf(v)!== i)
        .filter((v,i,a)=> a.indexOf(v)=== i);
      if(this.SvDefault.IsArray(arrBranchDuplicate)){
        let strHtmlMessage :string = "";
        strHtmlMessage = arrBranchDuplicate.join("<br/>");
        Swal.fire(`รายการ ${dt.PdId} : ${dt.PdName} รหัสสาขาซ้ำกัน` ,strHtmlMessage , "error");
        return false;
      }
    }
    if(this.Header.DocStatus !== "New"){
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
    }
    return true;
  }

  public async CancelNonOil(){
    await this.SvDefault.DoActionAsync(async()=>await this.cancelNonOil(),true);
  }
  private async cancelNonOil(){
    if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isCancel")) {
      this.SvDefault.ShowPositionRoleMessage("IsCancel");
      return;
    }

    if(this.Header.ApproveStatus === 'Y'){
      Swal.fire("เอกสารนีได้รับการอนุมัติแล้วไม่สารถแก้ใขได้","","warning");
      return;
    }
    if(!await this.SvDefault.ShowCancelDialogAsync()){
      return;
    }
    let header  = new ModelPriNonoilHd();
    this.SvDefault.CopyObject(this.Header , header);
    let header2 = await this._svNonOil.CancelNonOil(header);
    if(header2 != null){
      let strGuid = header2.Guid;
      await this.SvDefault.ShowSaveCompleteDialogAsync()
      window.location.href = "../NonOilPrice/" + strGuid;
    }
  }
}
