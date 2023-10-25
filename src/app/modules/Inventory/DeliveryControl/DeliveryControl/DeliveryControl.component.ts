import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { async } from 'rxjs/internal/scheduler/async';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { ModelHiddenButton } from 'src/app/model/ModelCommon';
import { ModelInvDeliveryCtrl, ModelInvDeliveryCtrlDt, ModelInvDeliveryCtrlHd, ModelInvReceiveProdDt, ModelInvReceiveProdHd, ModelMasDocPatternDt, ModelMasMapping, ModelMasProduct } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import Swal from 'sweetalert2';
import { DeliveryControlService } from '../DeliveryControl.service';
import { ModalSearchReceiveComponent } from '../ModalSearchReceive/ModalSearchReceive.component';
import { ModelDeliveryControl } from '../ModelDelivery';

@Component({
  selector: 'app-DeliveryControl',
  templateUrl: './DeliveryControl.component.html',
  styleUrls: ['./DeliveryControl.component.scss']
})
export class DeliveryControlComponent implements OnInit {

  constructor(
    public SvDefault: DefaultService,
    private _svShare: SharedService,
    private _svDelivery: DeliveryControlService,
    private _route: ActivatedRoute,
    private authGuard: AuthGuard,

  ) { }
  public HiddenButton = new ModelHiddenButton();
  public Header = new ModelInvDeliveryCtrlHd();
  public ArrDetail : ModelInvDeliveryCtrlDt[] = [];
  public ArrWareHouse : ModelMasMapping[] = [];
  public ArrReason : ModelMasMapping[] = [];
  public ArrProduct : ModelMasProduct[] =[];
  public NumShowTabIndex : number = 1;
  private _strUser = "";
  private _strBrnCode = "";
  private _strCompCode = "";
  private _strLocCode = "";
  private authPositionRole: any;
  action: string = "";

  async ngOnInit() {
    await this.SvDefault.DoActionAsync(
      async()=> await this.start(),
      true
    );
  }

  private async start() {
    this.authPositionRole = this.SvDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }

    this._strUser = this.SvDefault.GetString(this._svShare.user);
    this._strBrnCode = this.SvDefault.GetString(this._svShare.brnCode || "");
    this._strCompCode = this.SvDefault.GetString(this._svShare.compCode || "");
    this._strLocCode = this.SvDefault.GetString(this._svShare.locCode || "");
    let strGuid: string = "";
    strGuid = this._route.snapshot.params.DocGuid;
    await this.loadDropdown();
    if (strGuid === "New") {
      this.action = "New";
      await this.newData();
    } else {
      this.action = "Edit";
      let delivery = await this._svDelivery.GetDeliveryControl(strGuid);
      if(delivery === null){
        return;
      }
      this.displayData(delivery);
    }
  }
private displayData(pInput: ModelDeliveryControl) {
    if (pInput == null || !this.SvDefault.CheckDocBrnCode(pInput.Header.BrnCode)) {
      return;
    }
    this.Header = pInput.Header;
    this.ArrDetail = pInput.ArrDetail;
    if (this.Header != null) {
      this.Header.UpdatedBy = this._strUser;
      this.HiddenButton = this.SvDefault.GetHiddenButton2(this.Header.DocStatus, this.Header.Post);
      this.Header.DocDate = new Date(this.Header.DocDate);
    }
    if(this.ArrDetail == null){
      this.initDetail();
    }
  }

  private initDetail(){
    this.ArrDetail = [];
    for (let i = 1; i <= 8; i++) {
      let dt = new ModelInvDeliveryCtrlDt();
      dt.SeqNo = i;
      this.ArrDetail.push(dt);
    }
  }

  private async loadDropdown(){
    let arrApiResult = await this._svDelivery.GetMasMapping();
    if(this.SvDefault.IsArray(arrApiResult)){
      this.ArrWareHouse = arrApiResult
        .filter(x=> x.MapValue === "DeliveryCtrlWarehouse")
        .sort((a,b)=> (a.MapId.length - b.MapId.length) *10 + a.MapId.localeCompare(b.MapId));
      this.ArrReason = arrApiResult.filter(x=> x.MapValue === "DeliveryCtrlCollect");
    }
    this.ArrProduct = await this._svDelivery.GetProducts() || [];
  }

  async NewData() {
    this.SvDefault.DoActionAsync(async () => await this.newData(), true);
  }
  private async newData() {
    let datSys = this._svShare.systemDate;

    this.Header = new ModelInvDeliveryCtrlHd();
    this.Header.DocStatus = "New";
    this.Header.BrnCode = this._strBrnCode;
    this.Header.CompCode = this._strCompCode;
    this.Header.CreatedBy = this._strUser;
    this.Header.LocCode = this._strLocCode;
    this.Header.DocDate = datSys;
    this.Header.Post = "N";
    let arrDocPattern: ModelMasDocPatternDt[]
      = await this.SvDefault.GetPatternAsync("DeliveryCtrl");
    let strPattern: string = this.SvDefault.GenPatternString(
      this.Header.DocDate,
      arrDocPattern,
      this._strCompCode,
      this._strBrnCode
    );
    this.Header.DocNo = strPattern;
    this.Header.DocPattern = strPattern;
    this.HiddenButton = this.SvDefault.GetHiddenButton2("New", "N");
    this.initDetail();
  }
  async SetDocStatus(pStrDocStatus: string) {
    await this.SvDefault.DoActionAsync(async () => await this.setDocStatus(pStrDocStatus));
  }

  private async setDocStatus(pStrDocStatus: string) {
    pStrDocStatus = (pStrDocStatus || "").toString().trim();
    if (pStrDocStatus === "" || (pStrDocStatus === "Cancel" && !await this.SvDefault.ShowCancelDialogAsync())) {
      return;
    }
    let headerClone = new ModelInvDeliveryCtrlHd();
    this.SvDefault.CopyObject(this.Header, headerClone);
    headerClone.DocStatus = pStrDocStatus;
    this.Header = await this._svDelivery.UpdateStatus(headerClone);
    this.HiddenButton = this.SvDefault.GetHiddenButton2(this.Header.DocStatus, this.Header.Post);
    await this.SvDefault.ShowSaveCompleteDialogAsync();
  }

  async SaveData() {
    await this.SvDefault.DoActionAsync2(async () => await this.saveData(), true , 1);
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

    if(!this.validateData()){
      return;
    }
    if (this.Header.DocStatus === "New") {
      this.Header.DocDate = this.SvDefault.GetFormatDate(this._svShare.systemDate);
    }
    this.Header.RealDate = <any>this.SvDefault.GetFormatDateTime(this.Header.RealDate);

    if(this.SvDefault.IsArray(this.ArrWareHouse)){
      let wh = this.ArrWareHouse.find(x=> x.MapId === this.Header.WhId);
      this.Header.WhName = this.SvDefault.GetString(wh?.MapDesc);
    }
    if( this.Header.CtrlCorrect === 'N' && this.SvDefault.IsArray(this.ArrReason)){
      let reason = this.ArrReason.find(x=> x.MapId === this.Header.CtrlCorrectReasonId);
      this.Header.CtrlCorrectReasonDesc = this.SvDefault.GetString(reason?.MapDesc);
    }else{
      this.Header.CtrlCorrectReasonId = "";
      this.Header.CtrlCorrectReasonDesc = "";
    }
    let param = <ModelDeliveryControl>{
      Header : this.Header,
      ArrDetail : this.ArrDetail,
    };
    let apiResult = await this._svDelivery.SaveDeliveryControl(param);
    if(apiResult == null){
      return;
    }
    this.displayData(apiResult);
    this.SvDefault.ShowSaveCompleteDialogAsync();
  }
  public async ShowModalSearchReceive(){
    await this.SvDefault.DoActionAsync(async()=> await this.showModalSearchReceive(), false);
  }

  private validateData(){
    this.Header.ReceiveNo = this.SvDefault.GetString(this.Header.ReceiveNo);
    if(this.Header.ReceiveNo === ""){
      Swal.fire("อ้างอิงใบรับน้ำมันใส ห้ามมีค่าว่าง","" , "warning");
      return false;
    }
    if(this.Header.RealDate == null){
      Swal.fire("คุณยังไม่เลือกวันที่ลงน้ำมันจริง","" , "warning");
      return false;
    }
    if(this.Header.WhId === "" ){
      Swal.fire("คุณยังไม่เลือกรับน้ำมันจากคลัง","" , "warning");
      return false;
    }
    this.Header.CarNo = this.SvDefault.GetString(this.Header.CarNo);
    if(this.Header.CarNo === ""){
      Swal.fire("เบอร์รถ ห้ามมีค่าว่าง","" , "warning");
      return false;
    }
    this.Header.EmpName = this.SvDefault.GetString(this.Header.EmpName);
    if(this.Header.EmpName === ""){
      Swal.fire("ชื่อพนักงานขับรถ ห้ามมีค่าว่าง","" , "warning");
      return false;
    }
    this.Header.LicensePlate = this.SvDefault.GetString(this.Header.LicensePlate);
    if(this.Header.LicensePlate === ""){
      Swal.fire("ทะเบียนรถ ห้ามมีค่าว่าง","" , "warning");
      return false;
    }
    switch (this.Header.CtrlCorrect) {
      case "":
        Swal.fire("คุณยังไม่เลือกหัวข้อ 1. ลงน้ำมันถูกต้องตามผลิดภัณฑ์ทุกชนิดหรือไม่ ","" , "warning");
        return false;
      case "N" :
        if(this.Header.CtrlCorrectReasonId === "" && this.Header.CtrlCorrectOther === ""){
          Swal.fire("คุณยังไม่เลือกสาเหตุที่ลงน้ำมันผิด ","" , "warning");
          return false;
        }
        break;
      default:
        break;
    }


    // switch (this.Header.CtrlFull) {
    //   case "":
    //     Swal.fire("คุณยังไม่เลือกหัวข้อ 2.ส่งน้ำมันครบจำนวนหรือไม่ ","" , "warning");
    //     return false;
    //   case "L" : case "O" :
    //     if(this.Header.CtrlFullMm ===0 || this.Header.CtrlFullLt ===0){
    //       Swal.fire("จำนวนขาดหรือเกิน ห้ามมีค่า 0","" , "warning");
    //       return false;
    //     }
    //     this.Header.CtrlFullContact = this.SvDefault.GetString(this.Header.CtrlFullContact);
    //     if(Math.abs(this.Header.CtrlFullLt) > 50 && this.Header.CtrlFullContact === ""){
    //       //ระบุชื่อเจ้าหน้าที่คลังที่ติดต่อได้
    //       Swal.fire("กรุณาระบุชื่อเจ้าหน้าที่คลังที่ติดต่อได้","" , "warning");
    //       return false;
    //     }
    //     break;
    //   default:
    //     break;
    // }
    switch (this.Header.CtrlOntime) {
      case "":
        Swal.fire("คุณยังไม่เลือกหัวข้อ 2. ส่งน้ำมันตรงเวลาหรือไม่ (Delivered on commitment)  ","" , "warning");
        return false;
      case "B" : case "L" :
        if(this.Header.CtrlOntimeLate === 0){
          Swal.fire("กรณีน้ำมันติดหรือช้าให้ระบุเป็นจำนวนนาที ห้ามมีค่า 0","" , "warning");
          return false;
        }
        break;
      default:
        break;
    }
    switch (this.Header.CtrlDoc) {
      case "":
        Swal.fire("คุณยังไม่เลือกหัวข้อ 3. ตั๋วรับน้ำมัน (Documentation accuracy) ","" , "warning");
        return false;
      case "N":
        this.Header.CtrlDocDesc = this.SvDefault.GetString(this.Header.CtrlDocDesc);
        if(this.Header.CtrlDocDesc === ""){
          Swal.fire("กรณีเอกสารไม่ถูกต้องให้ระบุรายละเอียดเพิ่มเติม เพื่อวิเคราะห์หาสาเหตุต่อไป ห้ามมีค่าว่าง ","" , "warning");
          return false;
        }
        break;
      default:
        break;
    }

    // if(this.Header.CtrlApi === ""){
    //   Swal.fire("คุณยังไม่เลือกหัวข้อ 5. ค่า API ","" , "warning");
    //   return false;
    // }else if(this.Header.CtrlApi === 'N'){
    //   this.Header.CtrlApiDesc = this.SvDefault.GetString(this.Header.CtrlApiDesc);
    //   if(this.Header.CtrlApiDesc === ""){
    //     Swal.fire("กรณีค่า API ไม่ผ่าน ได้ดำเนินการอย่างไรต่อ ","" , "warning");
    //   return false;
    //   }
    // }
    // if(this.Header.CtrlEthanol === ""){
    //   Swal.fire("คุณยังไม่เลือกหัวข้อ 6. เอทานอล ","" , "warning");
    //   return false;
    // }
    if(this.Header.CtrlSeal === ""){
      Swal.fire("คุณยังไม่เลือกหัวข้อ 4. ซีล (Perfect condition) ","" , "warning");
      return false;
    }
    if(!(this.Header.CtrlSealStart && this.Header.CtrlSealFinish)){
      Swal.fire("ข้อ 4.หมายเลขซีล ห้ามมีค่าว่าง","" , "warning");
      return false;
    }
    let strMessage : string = "";
    for (let i = 0; i < this.ArrDetail.length; i++) {
      const dt = this.ArrDetail[i];
      if(dt == null){
        continue;
      }
      dt.PdId = this.SvDefault.GetString(dt.PdId);
      if(dt.PdId === ""){
        continue;
      }
      dt.PdName = this.ArrProduct?.find(x=> x.PdId === dt.PdId)?.PdName || "";
      switch (dt.CtrlFull) {
        case "":
          strMessage = `ที่ช่อง ${dt.SeqNo} คุณยังไม่เลือกหัวข้อ 5.ส่งน้ำมันครบจำนวนหรือไม่`;
          Swal.fire(strMessage,"" , "warning");
          return false;
      case "L" : case "O" :
        if(dt.CtrlFullMm ===0 || dt.CtrlFullLt ===0){
          strMessage = `ที่ช่อง ${dt.SeqNo} จำนวนขาดหรือเกิน ห้ามมีค่า 0`;
          Swal.fire(strMessage,"" , "warning");
          return false;
        }
        dt.CtrlFullContact = this.SvDefault.GetString(dt.CtrlFullContact);
        if(Math.abs(dt.CtrlFullLt) > 50 && dt.CtrlFullContact === ""){
          strMessage = `ที่ช่อง ${dt.SeqNo} กรุณาระบุชื่อเจ้าหน้าที่คลังที่ติดต่อได้`;
          Swal.fire(strMessage,"" , "warning");
          return false;
        }
        break;
      default:
        break;
      }
      if(dt.CtrlApi === ""){
        strMessage = `ที่ช่อง ${dt.SeqNo} คุณยังไม่เลือกหัวข้อ 6. ค่า API `;
        Swal.fire(strMessage,"" , "warning");
        return false;
      }
      //dt.CtrlApiStart = this.SvDefault.GetNumber(dt.CtrlApiStart , 2);

      if(!dt.CtrlApiStart){
        strMessage = `ที่ช่อง ${dt.SeqNo} API ต้นทาง ห้ามมีค่า 0`;
        Swal.fire(strMessage,"" , "warning");
        return false;
      }
      if(!dt.CtrlApiFinish){
        strMessage = `ที่ช่อง ${dt.SeqNo} API ปลายทาง ห้ามมีค่า 0`;
        Swal.fire(strMessage,"" , "warning");
        return false;
      }
      if(dt.CtrlApi === 'N'){
        dt.CtrlApiDesc = this.SvDefault.GetString(dt.CtrlApiDesc);
        if(dt.CtrlApiDesc === ""){
          strMessage = `ที่ช่อง ${dt.SeqNo} กรณีค่า API ไม่ผ่าน ได้ดำเนินการอย่างไรต่อ `;
          Swal.fire(strMessage,"" , "warning");
          return false;
        }
      }
      if(dt.CtrlEthanol === ""){
        strMessage = `ที่ช่อง ${dt.SeqNo} คุณยังไม่เลือกหัวข้อ 7. เอทานอล `;
        Swal.fire(strMessage,"" , "warning");
        return false;
      }
      if(!dt.CtrlEthanolQty){
        strMessage = `ที่ช่อง ${dt.SeqNo} ปริมาณเอทานอล ห้ามมีค่า 0`;
        Swal.fire(strMessage,"" , "warning");
        return false;
      }
    }

    return true;
  }

  private async showModalSearchReceive(){
    let receive = await this.SvDefault.ShowModalAsync<ModelInvReceiveProdHd>(ModalSearchReceiveComponent, "xl", null);
    if(receive == null){
      return;
    }
    this.Header.ReceiveNo = this.SvDefault.GetString(receive.DocNo);
  }

  public async GetEmployee(){
    await this.SvDefault.DoActionAsync(async()=> await this.getEmployee() , true);
  }

  private async getEmployee(){
    this.Header.EmpName = "";
    this.Header.EmpCode = this.SvDefault.GetString(this.Header.EmpCode);
    if(this.Header.EmpCode === ""){
      return;
    }
    let emp = await this.SvDefault.GetEmployee(this.Header.EmpCode);
    if(emp == null){
      return;
    }
    this.Header.EmpName = this.SvDefault.GetEmployeeFullName(emp);
  }

  public ClearCtrlCorrect(){
    if(this.Header.CtrlCorrect === "Y"){
      this.Header.CtrlCorrectReasonId = "";
      this.Header.CtrlCorrectReasonDesc = "";
      this.Header.CtrlCorrectOther = "";
    }
  }

  public ClearCtrlFull(param : ModelInvDeliveryCtrlDt){
    if(param == null){
      return;
    }
    if(param.CtrlFull === 'F'){
      param.CtrlFullContact = "";
      param.CtrlFullLt = 0;
      param.CtrlFullMm = 0;
    }
  }
}
