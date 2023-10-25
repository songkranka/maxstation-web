import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { start } from 'repl';
import { async } from 'rxjs/internal/scheduler/async';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { ModelHiddenButton } from 'src/app/model/ModelCommon';
import { ModelSysMenu } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import Swal from 'sweetalert2';
import { ModalPositionJsonComponent } from '../ModalPositionJson/ModalPositionJson.component';
import { ModelAutPositionRole, ModelMasPosition, ModelPosition, BranchConfig, SaveUnlock } from '../ModelPosition';
import { PositionService } from '../Position.service';

@Component({
  selector: 'app-Position',
  templateUrl: './Position.component.html',
  styleUrls: ['./Position.component.scss']
})
export class PositionComponent implements OnInit {

  constructor(
    public SvDefault : DefaultService ,
    private _svPosition : PositionService,
    private _route: ActivatedRoute,
    private _svShared : SharedService,
    private authGuard: AuthGuard,
  ) { }

  public Position = new ModelMasPosition();
  public EmpName : string = "";
  public ArrRole : ModelAutPositionRole[] = [];
  public ArrBranchConfig : BranchConfig[] = [];
  public HiddenButton = new ModelHiddenButton();
  private _arrMenu : ModelSysMenu[] = [];
  private authPositionRole: any;
  action: string = "";

  async ngOnInit() {
    this.SvDefault.DoActionAsync(async()=> await this.start() , true);
  }
  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }
  async start(){
    this.authPositionRole = this.SvDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }
    let strGuid: string = "";
    strGuid = this.SvDefault.GetString(this._route.snapshot.params.DocGuid);

    this._arrMenu = await this._svPosition.GetSysMenuList();
    if (strGuid === "New") {
      this.action = "New";
      this.ArrBranchConfig = await this._svPosition.GetBranchConfigDesc();
      this.newData();
    } else {
      this.action = "Edit";
      let pos = await this._svPosition.GetPosition(strGuid);
      this.displayData(pos);
      this.ArrBranchConfig = await this._svPosition.GetBranchConfig(strGuid);
    }
    this.EmpName = await this.getEmpName(this.Position);
  }

  private displayData(param : ModelPosition){
    if(param == null){
      return;
    }
    this.Position = param.Position;
    // this.Position.UpdatedBy = this.SvDefault.GetString(this._svShared.user);
    if(this.SvDefault.IsArray(this._arrMenu)){
      this.ArrRole = param.ArrPositionRole
        .filter(x=> this._arrMenu.some(y=> x.MenuId === y.MenuId));
        this.addNewMenuToRole();
    }else{
      this.ArrRole = param.ArrPositionRole;
    }
    this.HiddenButton = this.SvDefault.GetHiddenButton2(this.Position.PositionStatus, "N");

  }

  private addNewMenuToRole(){
    if(!(this.SvDefault.IsArray(this.ArrRole) && this.SvDefault.IsArray(this._arrMenu))){
      return;
    }
    let haveNewRole = false;
    for (let i = 0; i < this._arrMenu.length; i++) {
      let menu = this._arrMenu[i];
      if(this.ArrRole.some(x=> x.MenuId === menu.MenuId)){
        continue;
      }
      haveNewRole = true;
      let role = new ModelAutPositionRole();
      role.IsCancel = "N";
      role.IsCreate = "N";
      role.IsEdit = "N";
      role.IsPrint = "N";
      role.IsView = "N";
      role.MenuId = menu.MenuId;
      this.ArrRole.push(role);
    }
    if(haveNewRole){
      this.ArrRole = this.ArrRole.sort((x,y)=>x.MenuId.localeCompare(y.MenuId));
    }
    //this.ArrRole.sort()
  }

  private newData(){
    this.Position.CreatedBy = this.Position.UpdatedBy;
    this.Position.PositionStatus = "New"
    this.Position.PositionCode = "#";
    this.HiddenButton = this.SvDefault.GetHiddenButton2("New", "N");
    if(this.SvDefault.IsArray(this._arrMenu)){
      this.ArrRole = this._arrMenu.map(x=>{
        let role = new ModelAutPositionRole();
        role.IsCancel = "N";
        role.IsCreate = "N";
        role.IsEdit = "N";
        role.IsPrint = "N";
        role.IsView = "N";
        role.MenuId = x.MenuId;
        return role;
      });
    }
  }

  public NewData(){
    this.SvDefault.DoAction(()=>this.newData());
  }

  public async UpdateStatus(pStrStatus : string){
    await this.SvDefault.DoActionAsync(async()=> await this.updateStatus(pStrStatus),true);
  }

  private async updateStatus(pStrStatus : string){
    pStrStatus = this.SvDefault.GetString(pStrStatus);
    if (pStrStatus === "Cancel" && !this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isCancel")) {
      this.SvDefault.ShowPositionRoleMessage("IsCancel");
      return;
    }
    this.adjustData();
    if( pStrStatus === ""
    || this.Position == null
    || !this.validateData()
    || !await this.SvDefault.ShowCancelDialogAsync()){
      return;
    }

    let pos = new ModelMasPosition();
    this.SvDefault.CopyObject(this.Position , pos);
    pos.PositionStatus = pStrStatus;
    if( await this._svPosition.ChangeStatus(pos)){
      this.Position = pos;
      this.HiddenButton = this.SvDefault.GetHiddenButton2(pStrStatus, "N");
      await this.SvDefault.ShowSaveCompleteDialogAsync();
    }
    //this.displayData(pos);
    //window.location.href = "/Position/" + this.Position.PositionCode;
  }

  public async ShowModalReport(){
    await this.SvDefault.DoActionAsync(async()=> await this.showModalReport());
  }

  private showModalReport(){
    if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isPrint")) {
      this.SvDefault.ShowPositionRoleMessage("IsPrint");
      return;
    }
  }

  public SaveData(){
    this.SvDefault.DoActionAsync(async()=> await this.saveData() , true);
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
    
    this.adjustData();
    if(!this.validateData()){
      return;
    }
    let position = this.getModelPosition();
    if(position == null){
      return;
    }
    if(position.Position.PositionStatus === "New"){
      if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isCreate")) {
        this.SvDefault.ShowPositionRoleMessage("IsCreate");
        return;
      }
      position.Position.PositionStatus = "Active";
      position = await this._svPosition.InsertPosition(position);
      let paramaSaveUnlock = new SaveUnlock;
      paramaSaveUnlock.PositionCode = position.Position.PositionCode
      paramaSaveUnlock._UnlockPosition = this.ArrBranchConfig;
      await this._svPosition.InsertUnlock(paramaSaveUnlock);

    }else{
      if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isEdit")) {
        this.SvDefault.ShowPositionRoleMessage("IsEdit");
        return;
      }
      position = await this._svPosition.UpdatePosition(position);
      let paramaSaveUnlock = new SaveUnlock;
      paramaSaveUnlock.PositionCode = position.Position.PositionCode
      paramaSaveUnlock._UnlockPosition = this.ArrBranchConfig;
      await this._svPosition.UpdateUnlock(paramaSaveUnlock);
    }
    this.displayData(position);
    this.EmpName = await this.getEmpName(this.Position);
    await this.SvDefault.ShowSaveCompleteDialogAsync();
  }
  private adjustData(){
    let strPosName = "";
    let strCreateBy = "";
    let strUpdateBy = "";
    let strPosCode = "";
    if(this.Position != null){
      this.Position.PositionDesc = this.SvDefault.GetString(this.Position.PositionDesc);
      strPosName = this.SvDefault.GetString(this.Position.PositionName);
      this.Position.PositionName = strPosName;
      strCreateBy = this.SvDefault.GetString(this.Position.CreatedBy);
      this.Position.CreatedBy = strCreateBy;
      // strUpdateBy = this.SvDefault.GetString(this.Position.UpdatedBy);
      strUpdateBy = this.SvDefault.GetString(this._svShared.user);
      this.Position.UpdatedBy = strUpdateBy;
      strPosCode = this.Position.PositionCode;
    }
    if(this.SvDefault.IsArray(this.ArrRole)){
      this.ArrRole = this.ArrRole.filter(x=> x!= null);
      for (let i = 0; i < this.ArrRole.length; i++) {
        const roleItem = this.ArrRole[i];
        roleItem.CreatedBy = strCreateBy;
        roleItem.PostnameThai = strPosName;
        roleItem.UpdatedBy = strUpdateBy;
        roleItem.PositionCode = strPosCode;
        roleItem.JsonData = this.SvDefault.GetString(roleItem.JsonData);
      }
    }
  }
  private validateData(){
    if(this.Position != null){
      if(this.Position.PositionName === ""){
        Swal.fire("" , "กรุณาระบุชื่อตำแหน่ง" , "error");
        return false;
      }
    }
    return true;
  }
  private getModelPosition(){
    let result = new ModelPosition();
    if(this.Position != null){
      this.SvDefault.CopyObject(this.Position , result.Position);
    }
    if(this.SvDefault.IsArray(this.ArrRole)){
      result.ArrPositionRole = this.ArrRole.map(x=>{
        let role = new ModelAutPositionRole();
        this.SvDefault.CopyObject(x,role);
        return role;
      });
    }
    return result;
  }


  public CheckBoxChange(pIsCheck : boolean , pRole : ModelAutPositionRole , pStrPropName : string){
    this.SvDefault.DoAction(()=>this.checkBoxChange(pIsCheck , pRole , pStrPropName));
  }

  private checkBoxChange(pIsCheck : boolean , pRole : ModelAutPositionRole , pStrPropName : string){
    pStrPropName = this.SvDefault.GetString(pStrPropName);
    if( pStrPropName === "" || pRole == null || !pRole.hasOwnProperty(pStrPropName)){
      return;
    }
    pRole[pStrPropName] = pIsCheck?"Y" : "N";

  }

  public ChangeStatus(pIsCheck : boolean , pRole : BranchConfig , pStrPropName : string){
    this.SvDefault.DoAction(()=>this.changeStatus(pIsCheck , pRole , pStrPropName));
  }

  private changeStatus(pIsCheck : boolean , pRole : BranchConfig , pStrPropName : string){
    pStrPropName = this.SvDefault.GetString(pStrPropName);
    if( pStrPropName === "" || pRole == null || !pRole.hasOwnProperty(pStrPropName)){
      return;
    }
    pRole[pStrPropName] = pIsCheck?"Y" : "N";
  }

  public DisplayMenuName(pStrMenuId : string){
    let result = ""
    this.SvDefault.DoAction(()=>result = this.displayMenuName(pStrMenuId));
    return result;
  }

  private displayMenuName(pStrMenuId : string){
    pStrMenuId =this.SvDefault.GetString(pStrMenuId);
    if(pStrMenuId === "" || !this.SvDefault.IsArray(this._arrMenu)){
      return "";
    }
    let menu = this._arrMenu.find(x=> x.MenuId === pStrMenuId);
    let result = this.SvDefault.GetString(menu?.MenuName);
    return result;

  }

  public DisplayConfigName(configId : string){
    let result = ""
    this.SvDefault.DoAction(()=>result = this.displayConfigName(configId));
    return result;
  }

  private displayConfigName(configId : string){
    configId =this.SvDefault.GetString(configId);
    if(configId === "" || !this.SvDefault.IsArray(this.ArrBranchConfig)){
      return "";
    }
    let BranchConfig = this.ArrBranchConfig.find(x => x.ConfigId === configId);
    let result = this.SvDefault.GetString(BranchConfig?.ConfigName);
    return result;

  }

  public SelectAll(pStrColName : string){
    this.SvDefault.DoAction(()=>this.selectAll(pStrColName));
  }

  private selectAll(pStrColName : string){
    pStrColName = this.SvDefault.GetString(pStrColName);
    if(pStrColName === "" || !this.SvDefault.IsArray(this.ArrRole)){
      return;
    }
    let role = this.ArrRole.find(x=> x!= null);
    if(role == null){
      return;
    }
    if(!role.hasOwnProperty(pStrColName)){
      return;
    }
    let strNewState = role[pStrColName] === "Y" ? "N" : "Y";
    for (let i = 0; i < this.ArrRole.length; i++) {
      let roleItem = this.ArrRole[i];
      if(roleItem == null){
        continue;
      }
      roleItem[pStrColName] = strNewState;
    }
  }

  public async ShowCheckboxModal(param : ModelAutPositionRole){
    await this.SvDefault.DoActionAsync(async()=> await this.showCheckboxModal(param));
  }

  private async showCheckboxModal(param : ModelAutPositionRole){
    if(param == null){
      return;
    }
    let strJson = this.SvDefault.GetString(param.JsonData);
    let strJsonOutput = await this.SvDefault.ShowModalAsync<string>(
      ModalPositionJsonComponent ,
      "sm",
      {StrJson : strJson}
    );
    param.JsonData = strJsonOutput;
  }
  public async GetEmpName(){
    let result = "";
    await this.SvDefault.DoActionAsync(async()=>{
      result = await this.getEmpName(this.Position)
    });
    return result;
  }

  private async getEmpName(param : ModelMasPosition){
    if(param == null){
      return "";
    }
    let strEmpCode =  this.SvDefault.GetString(param.CreatedBy || param.UpdatedBy);
    if(strEmpCode === ""){
      return "";
    }
    let emp = await this.SvDefault.GetEmployee(strEmpCode);
    return this.SvDefault.GetEmployeeFullName(emp);
  }

}
