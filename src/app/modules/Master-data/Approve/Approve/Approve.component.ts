import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { ModelBranch } from 'src/app/model/ModelCommon';
import { ModelSysApproveConfig, ModelSysApproveHd, ModelSysApproveStep } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import Swal from 'sweetalert2';
import { ApproveService } from '../Approve.service';
import { ModelApprove, ModelApproveStep } from '../ModelApprove';

declare var window : any;
@Component({
  selector: 'app-Approve',
  templateUrl: './Approve.component.html',
  styleUrls: ['./Approve.component.scss']
})
export class ApproveComponent implements OnInit {

  constructor(
    public SvDefault : DefaultService,
    private _route : ActivatedRoute,
    private _svApprove : ApproveService ,
    private _svShared : SharedService,
    private authGuard: AuthGuard,
  ) { 

  }
  private _strBrnCode : string = "";
  private _strCompCode : string = "";
  private _strLocCode : string = "";
  private _strUser : string = "";
  private _datSystem : Date = null;
  public Header  = new ModelSysApproveHd();
  public ArrStep : ModelApproveStep[] = [];
  public ArrConfig : ModelSysApproveConfig[] = [];
  public ArrBranch : ModelBranch[] = [];
  private authPositionRole: any;
  action: string = "";

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  async ngOnInit() {
    await this.SvDefault.DoActionAsync(async()=> await this.start() , true);
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
    await this.loadConfig();
    this.ArrBranch = await this.SvDefault.GetBranchListAsync("");
    // this.ArrBranch = await this.SvDefault.GetBranchListAsync(this._strCompCode);
    if(strGuid === "New"){
      this.action = "New";
      await this.newData();
    }else{
      this.action = "Edit";
      let approve = await this._svApprove.GetApproveByGuid(strGuid);
      await this.displayData(approve);
    }
  }
  private async newData(){
    let arrPattern = await this.SvDefault.GetPatternAsync("Approve");
    let strPattern = this.SvDefault.GenPatternString(this._datSystem, arrPattern, this._strCompCode, this._strBrnCode);
    this.Header.BrnCode = this._strBrnCode;
    this.Header.CompCode = this._strCompCode;
    this.Header.CreatedBy = this._strUser;
    this.Header.DocDate = this._datSystem;
    this.Header.DocNo = strPattern;
    this.Header.LocCode = this._strLocCode;
    let arrStep = await this._svApprove.GetPendingApprove(this._strUser);
    if(this.SvDefault.IsArray(arrStep)){
      this.ArrStep = arrStep.map(x=> {
        let st = new ModelApproveStep();
        this.SvDefault.CopyObject(x,st);
        st.UpdatedBy = this._strUser;
        st.BrnName = this.ArrBranch?.find(y=> y.BrnCode === x.BrnCode)?.BrnName || "";
        st.DocName = this.ArrConfig?.find(y=>y.DocType === x.DocType)?.DocName || "";
        return st;
      });
    }
  }
  public GetBranchName(pStrBrnCode : string){
    return this.SvDefault.DoAction(()=> this.getBranchName(pStrBrnCode));
  }
  private getBranchName(pStrBrnCode : string){
    pStrBrnCode = this.SvDefault.GetString(pStrBrnCode);
    if(pStrBrnCode === "" || !this.SvDefault.IsArray(this.ArrBranch)){
      return pStrBrnCode;
    }
    let result = this.ArrBranch.find(x=> x.BrnCode === pStrBrnCode)?.BrnName || pStrBrnCode;
    console.log(result);
    
    return result;
  }
  public GetDocTypeName(pStrDocType : string){
    return this.SvDefault.DoAction(()=> this.getDocTypeName(pStrDocType));
  }
  private getDocTypeName(pStrDocType : string){
    pStrDocType = this.SvDefault.GetString(pStrDocType);
    if(!this.SvDefault.IsArray(this.ArrConfig)){
      return pStrDocType
    }
    let result = this.ArrConfig.find(x=> x.DocType === pStrDocType)?.DocName || pStrDocType;
    console.log(result);
    return result;
  }
  private async displayData(pData : ModelApprove){
    if (pData == null) {
      return;
    }
    this.Header = pData.Header;
    this.Header.UpdatedBy = this._strUser;
    if(this.SvDefault.IsArray(pData.ArrayStep)){
      this.ArrStep = pData.ArrayStep.map(x=>{
        let st = new ModelApproveStep();
        this.SvDefault.CopyObject(x, st);
        st.IsCheck = true;
        st.BrnName = this.ArrBranch?.find(y=> y.BrnCode === x.BrnCode)?.BrnName || "";
        st.DocName = this.ArrConfig?.find(y=>y.DocType === x.DocType)?.DocName || "";
        return st;
      });
    }
  }
  private async loadConfig(){
    this.ArrConfig = await this._svApprove.GetArrayConfig();
  }

  public GetRibbon(){
    let result: string = "";
    switch(this.Header?.ApprStatus || ""){
      case "Y" :
        result = "statusReady";
        break;
      case 'N': case 'C' :
        result = "statusCancel"
        break;
      default :
        result = "statusNew";
        break;
    }
    result += " ribbon-1 ribbon tooltipa statusBase ";
    return result;
  }

  public GetStatusText(){
    let result = "";
    switch(this.Header?.ApprStatus || ""){
      case "Y" :
        result =  "อนุมัติ";
        break;
      case 'N': case 'C' :
        result =  "ยกเลิก"
        break;
      default :
      result =  "สร้าง";
      break;
    }
    
    return result;
  }
  public async SaveData(pStrApproveStatus : string){
    await this.SvDefault.DoActionAsync(async()=>await this.saveData(pStrApproveStatus));
  }
  private async saveData(pStrApproveStatus : string){
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

    let arrFilterStep = this.ArrStep.filter(x=> x.IsCheck);
    if(!this.SvDefault.IsArray(arrFilterStep)){
      Swal.fire("กรุณาเลือกอย่างน้อย 1 รายการ","","warning");
      return;
    }
    this.Header.ApprStatus = pStrApproveStatus;
    // for (let i = 0; i < arrFilterStep.length; i++) {
    //   const step = arrFilterStep[i];
    //   step.ApprStatus = pStrApproveStatus;    
    // }
    let approve = new ModelApprove();
    approve.Header = this.Header;
    approve.ArrayStep = arrFilterStep;
    Swal.showLoading();
    let approve2 = await this._svApprove.SaveApprove(approve);
    if(this.SvDefault.IsSweetAlertLoading()){
      Swal.close();
    }
    let strGuid = this.SvDefault.GetString( approve2?.Header?.Guid);
    if(strGuid !== ""){
      await this.SvDefault.ShowSaveCompleteDialogAsync();
      document.location.href = "./Approve/" + strGuid;
    }
  }
  public GoToDetailPage(pStep : ModelApproveStep){
    this.SvDefault.DoAction(()=>this.goToDetailPage(pStep));
  }
  
  private goToDetailPage(pStep : ModelApproveStep){
    let strUrl : string = "../";
    switch (pStep.DocType) {
      case "Quotation" : 
        strUrl += "Quotation";
        break;
      case "Request":
        strUrl += "Request";
        break;
      case "OilPrice" : 
        strUrl += "StandardPrice";
        break;
      default:
        break;
    }
    strUrl += "/" + pStep.Guid;
    window.open(strUrl,'_blank' );
  }

}