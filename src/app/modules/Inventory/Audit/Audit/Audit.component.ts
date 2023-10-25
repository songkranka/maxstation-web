import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { ModelHiddenButton } from 'src/app/model/ModelCommon';
import { ModelInvAuditDt, ModelInvAuditHd, ModelInvStockDaily, ModelMasDocPatternDt, ModelMasEmployee, ModelMasProduct, ModelSysMenu, ModelSysPositionRole } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import Swal from 'sweetalert2';
import { AuditService } from '../Audit.service';
import { ModelAudit, ModelAuditProduct, ModelAuditProductParam, ModelAuditResult } from '../ModelAudit';
import { MatDialog } from '@angular/material/dialog';
import { ModalReportComponent } from './../../../Report/Modal/modal-report/modal-report.component';
import { ReportService } from 'src/app/service/report-service/report-service';
import { ShareDataService } from 'src/app/shared/shared-service/data.service';
import { AuthGuard } from 'src/app/guards/auth-guard.service';


@Component({
  selector: 'app-Audit',
  templateUrl: './Audit.component.html',
  styleUrls: ['./Audit.component.scss']
})
export class AuditComponent implements OnInit {

  constructor(
    private _svAudit: AuditService,
    private _svShared: SharedService,
    public SvDefault: DefaultService,
    private reportService: ReportService,
    private _route: ActivatedRoute,
    public dialog: MatDialog,
    private shareDataService: ShareDataService,
    private authGuard: AuthGuard,
  ) { }

  public HiddenButton: ModelHiddenButton = new ModelHiddenButton();
  public Header: ModelInvAuditHd = new ModelInvAuditHd();
  public ArrDetail: ModelInvAuditDt[] = [];
  public PositionRole = new ModelSysPositionRole();
  private _strBrnCode: string = "";
  private _strCompCode: string = "";
  private _strLocCode: string = "";
  private _strUser: string = "";
  private _datSystem: Date = null;
  private reportUrl: string = "";
  private reportName: string = "";
  private authPositionRole: any;
  action: string = "";

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  async ngOnInit() {
    await this.SvDefault.DoActionAsync(async () => await this.start(), true);
  }
  private async start() {

    this.authPositionRole = this.SvDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }

    this._strBrnCode = (this._svShared.brnCode || "").toString().trim();
    this._strCompCode = (this._svShared.compCode || "").toString().trim();
    this._strLocCode = (this._svShared.locCode || "").toString().trim();
    this._strUser = (this._svShared.user || "").toString().trim();
    this._datSystem = this._svShared.systemDate;

    // this._strBrnCode = "254";
    // this._strCompCode = "B";
    // this._strLocCode = "001";
    // this._strUser = "10008642";
    // this._datSystem = new Date("2021-05-14");;


    let strGuid: string = "";
    strGuid = (this._route.snapshot.params.DocGuid || "").toString().trim();
    if (strGuid === "New") {
      this.action = "New";
      await this.newData();
    } else {
      this.action = "Edit";
      let audit: ModelAudit = null;
      audit = await this._svAudit.GetAudit(strGuid);
      if (!this.SvDefault.CheckDocBrnCode(audit?.Header?.BrnCode)) {
        return;
      }
      this.displayData(audit);
    }
  }

  private displayData(pData: ModelAudit) {
    if (pData == null) {
      return;
    }
    this.Header = pData.Header;
    this.Header.UpdatedBy = this._strUser;
    this.ArrDetail = pData.ArrayDetail;
    this.HiddenButton = this.SvDefault.GetHiddenButton2(this.Header.DocStatus, this.Header.Post);
  }
  public async NewData() {
    await this.SvDefault.DoActionAsync(async () => await this.newData(), true);
  }
  private async newData() {
    // if (!this.SvDefault.ValidatePositionRole(this.PositionRole, "IsCreate")) {
    //   this.SvDefault.ShowPositionRoleMessage("IsCreate");
    //   return;
    // }

    if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isCreate")) {
      this.SvDefault.ShowPositionRoleMessage("IsCreate");
      return;
    }

    let arrPattern: ModelMasDocPatternDt[] = null;
    arrPattern = await this.SvDefault.GetPatternAsync("Audit");
    let strPattern: string = "";
    strPattern = this.SvDefault.GenPatternString(this._datSystem, arrPattern, this._strCompCode, this._strBrnCode);
    let numYear = new Date(this._datSystem).getUTCFullYear();
    let numAuditCount = await this._svAudit.GetAuditCount(this._strCompCode, this._strBrnCode, numYear);
    this.Header.AuditSeq = numAuditCount;
    this.Header.AuditYear = numYear;
    this.Header.BrnCode = this._strBrnCode;
    this.Header.CompCode = this._strCompCode;
    this.Header.CreatedBy = this._strUser;
    this.Header.DocDate = this._datSystem;
    this.Header.DocNo = strPattern;
    this.Header.DocPattern = strPattern;
    this.Header.DocStatus = "New";
    this.Header.LocCode = this._strLocCode;
    this.Header.Post = "N";
    this.HiddenButton = this.SvDefault.GetHiddenButton2("New", "N");
    let arrDetail = await this.getArrayDetail();
    //await this.adjustUnitPriceAndUnitBarcode(arrDetail);
    this.ArrDetail = arrDetail;
  }
  public async SaveData() {
    await this.SvDefault.DoActionAsync(async () => await this.saveData(), true);
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
    
    if (!await this.validateData()) {
      return;
    }
    let header: ModelInvAuditHd = null;
    if (this.Header.DocStatus === "New") {
      // if (!this.SvDefault.ValidatePositionRole(this.PositionRole, "IsCreate")) {
      //   this.SvDefault.ShowPositionRoleMessage("IsCreate");
      //   return;
      // }
      if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isCreate")) {
        this.SvDefault.ShowPositionRoleMessage("IsCreate");
        return;
      }
      header = new ModelInvAuditHd();
      this.SvDefault.CopyObject(this.Header, header);
      header.DocDate = this.SvDefault.GetFormatDate(<any>header.DocDate);
    } else {
      // if (!this.SvDefault.ValidatePositionRole(this.PositionRole, "IsEdit")) {
      //   this.SvDefault.ShowPositionRoleMessage("IsEdit");
      //   return;
      // }
      if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isEdit")) {
        this.SvDefault.ShowPositionRoleMessage("IsEdit");
        return;
      }
      header = this.Header;
    }
    let param: ModelAudit = null;
    param = new ModelAudit();
    param.Header = header;
    let arrDetailFilter: ModelInvAuditDt[] = null;
    arrDetailFilter = this.ArrDetail;//.filter(x=> x.ItemQty > 0 || x.AdjustQty > 0);
    if (this.SvDefault.IsArray(arrDetailFilter)) {
      for (let i = 0; i < arrDetailFilter.length; i++) {
        const dt = this.ArrDetail[i];
        if (dt.PdName.length > 37) {
          dt.PdName = dt.PdName.substring(0, 37);
        }
      }
      await this.adjustUnitPriceAndUnitBarcode( arrDetailFilter);
      param.ArrayDetail = arrDetailFilter;
    }
    param = await this._svAudit.SaveData(param);
    let strGuid: string = "";
    strGuid = this.SvDefault.GetString(param?.Header?.Guid);
    if (strGuid !== "") {
      await this.SvDefault.ShowSaveCompleteDialogAsync();
      strGuid = encodeURI(strGuid);
      window.location.href = `/Audit/${strGuid}`;
    }
    //this.displayData(param);

  }
  private async validateData() {
    if(this.Header.EmpName === ""){
      await Swal.fire("ไม่พบข้อมูลพนักงาน" , "" , "warning");
      return false;
    }
    return true;
  }
  public async UpdateStatus(pStrStatus: string) {
    await this.SvDefault.DoActionAsync(async () => await this.updateStatus(pStrStatus), true);
  }
  private async updateStatus(pStrStatus: string) {
    pStrStatus = (pStrStatus || "").toString().trim();
    if (pStrStatus === "") {
      return;
    }
    if (pStrStatus === "Cancel" && !this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isCancel")) {
      this.SvDefault.ShowPositionRoleMessage("IsCancel");
      return;
    }
    if (pStrStatus === "Cancel" && !await this.SvDefault.ShowCancelDialogAsync()) {
      return;
    }
    let header: ModelInvAuditHd = null;
    header = new ModelInvAuditHd();
    this.SvDefault.CopyObject(this.Header, header);
    header.DocStatus = pStrStatus;
    header = await this._svAudit.UpdateStatus(header);
    if (header != null) {
      this.Header = header;
      this.HiddenButton = this.SvDefault.GetHiddenButton2(this.Header.DocStatus, this.Header.Post);
    }
    //Swal.fire("บันทึกสำเร๊จ", "", "success");
    await this.SvDefault.ShowSaveCompleteDialogAsync();
  }
  private async getArrayDetail(): Promise<ModelInvAuditDt[]> {
    let auditProduct: ModelAuditProduct = null;
    let param: ModelAuditProductParam = new ModelAuditProductParam();
    param.BrnCode = this._strBrnCode;
    param.CompCode = this._strCompCode;
    param.LocCode = this._strLocCode;
    param.StockDate = this.SvDefault.GetFormatDate(<any>this._datSystem);
    auditProduct = await this._svAudit.GetAuditProduct(param);
    if (auditProduct == null) {
      return null;
    }
    let { ArrayProduct, ArrayStockDaily } = auditProduct;
    if (!(this.SvDefault.IsArray(ArrayProduct) && this.SvDefault.IsArray(ArrayStockDaily))) {
      return null;
    }
    ArrayProduct = ArrayProduct.filter(x=> x!= null).map( x=> {
      x.PdId = this.SvDefault.GetString(x.PdId);
      x.GroupId = this.SvDefault.GetString(x.GroupId);
      return x;
    }).sort((a,b)=> (a.GroupId.localeCompare(b.GroupId)*10) + a.PdId.localeCompare(b.PdId) );
    let result: ModelInvAuditDt[] = [];
    for (let i = 0; i < ArrayProduct.length; i++) {
      let pd: ModelMasProduct = ArrayProduct[i];

      let sd: ModelInvStockDaily = null;
      sd = ArrayStockDaily.find(x => x.PdId === pd.PdId && x.UnitId === pd.UnitId);
      if (sd == null) {
        continue;
      }
      let dt: ModelInvAuditDt = new ModelInvAuditDt();
      this.SvDefault.CopyObject(pd, dt);
      // dt.BalanceQty = sd.Balance;
      dt.BalanceQty = sd.Remain;
      dt.ItemQty = 0;
      dt.DiffQty = dt.ItemQty - dt.BalanceQty; //-sd.Balance;
      dt.AdjustQty = 0;
      dt.NoadjQty = 0; //dt.DiffQty;

      result.push(dt);
    }


    // result = ArrayProduct.map(x=>{
    //   let dt : ModelInvAuditDt = new ModelInvAuditDt();
    //   this.SvDefault.CopyObject(x , dt);
    //   return dt;
    // });
    return result;
  }

  private async adjustUnitPriceAndUnitBarcode(param : ModelInvAuditDt[]){
    if(!this.SvDefault.IsArray(param)){
      return;
    }
    for (let i = 0; i < param.length; i++) {
      let auditItem = param[i];
      auditItem.UnitBarcode = this.SvDefault.GetString(auditItem.UnitBarcode);
      auditItem.UnitPrice = this.SvDefault.GetNumber(auditItem.UnitPrice,2);
    }
    let arrProductId = param
      .filter(x=> x.UnitBarcode === "" && x.UnitPrice === 0)
      .map(x=> this.SvDefault.GetString( x.PdId))
      .filter(x=> x !== "")
      .filter((x,i,a)=> a.indexOf(x) === i );
    let arrAllProduct = await this.SvDefault.GetProductAllTypeList({
      BrnCode : this._strBrnCode,
      CompCode : this._strCompCode,
      LocCode : this._strLocCode ,
      SystemDate : this._datSystem,
      ArrProductID : arrProductId
    });
    if(!this.SvDefault.IsArray( arrAllProduct)){
      return;
    }
    arrAllProduct = arrAllProduct.filter(x=> x !== null);
    for (let i = 0; i < arrAllProduct.length; i++) {
      const ap = arrAllProduct[i];
      ap.PdId = this.SvDefault.GetString(ap.PdId);
      ap.UnitBarcode = this.SvDefault.GetString(ap.UnitBarcode);
      ap.UnitPrice = this.SvDefault.GetNumber(ap.UnitPrice , 2);
    }
    for (let i = 0; i < param.length; i++) {
      let auditItem = param[i];
      if(auditItem == null){
        continue;
      }
      let strPdId = this.SvDefault.GetString(auditItem.PdId);
      let pd = arrAllProduct.find(x=> x.PdId === strPdId);
      if(pd == null){
        continue;
      }
      auditItem.UnitBarcode = pd.UnitBarcode;
      auditItem.UnitPrice = pd.UnitPrice;
    }
  }
  public OnItemQtyChange(pAuditDetail: ModelInvAuditDt) {
    this.SvDefault.DoAction(() => this.onItemQtyChange(pAuditDetail));
  }
  private onItemQtyChange(pAuditDetail: ModelInvAuditDt) {
    if (pAuditDetail == null) {
      return;
    }
    pAuditDetail.ItemQty = this.SvDefault.GetNumber(pAuditDetail.ItemQty , 2);
    pAuditDetail.BalanceQty = this.SvDefault.GetNumber(pAuditDetail.BalanceQty , 2);
    let numDiffQty = this.SvDefault.GetNumber(pAuditDetail.ItemQty - pAuditDetail.BalanceQty , 2);
    pAuditDetail.DiffQty = numDiffQty;
    pAuditDetail.AdjustQty = 0.00;
    pAuditDetail.NoadjQty = numDiffQty;
    //pAuditDetail.NoadjQty = pAuditDetail.DiffQty - pAuditDetail.AdjustQty;
  }

  private onItemQtyChangeOld(pAuditDetail: ModelInvAuditDt) {
    if (pAuditDetail == null) {
      return;
    }
    pAuditDetail.DiffQty = pAuditDetail.ItemQty - pAuditDetail.BalanceQty;
    pAuditDetail.AdjustQty = pAuditDetail.ItemQty - pAuditDetail.BalanceQty;
    pAuditDetail.NoadjQty = pAuditDetail.DiffQty - pAuditDetail.AdjustQty;
    //pAuditDetail.NoadjQty = pAuditDetail.DiffQty - pAuditDetail.AdjustQty;
  }
  public OnAdjustQtyChange(pAuditDetail: ModelInvAuditDt) {
    this.SvDefault.DoAction(() => this.onAdjustQtyChange(pAuditDetail));
  }
  private onAdjustQtyChange(pAuditDetail: ModelInvAuditDt) {
    if (pAuditDetail == null) {
      return;
    }
    pAuditDetail.NoadjQty = pAuditDetail.DiffQty - pAuditDetail.AdjustQty;
  }

  public async ShowModalProduct() {
    await this.SvDefault.DoActionAsync(async () => await this.showModalProduct());
  }

  private async showModalProduct() {
    let param: ModelAuditProductParam = new ModelAuditProductParam();
    param.BrnCode = this._strBrnCode;
    param.CompCode = this._strCompCode;
    param.LocCode = this._strLocCode;
    param.StockDate = this.SvDefault.GetFormatDate(<any>this._datSystem);
    let arrProduct: ModelMasProduct[] = null;
    Swal.showLoading();
    arrProduct = await this._svAudit.GetArrayProduct(param);
    if (this.SvDefault.IsSweetAlertLoading()) {
      Swal.close();
    }
    if (!this.SvDefault.IsArray(arrProduct)) {
      return;
    }
    let arrCurrentProduct: ModelMasProduct[] = [];
    if (this.SvDefault.IsArray(this.ArrDetail)) {
      arrCurrentProduct = this.ArrDetail.map(x => {
        let pd: ModelMasProduct = new ModelMasProduct();
        this.SvDefault.CopyObject(x, pd);
        return pd;
      }) || [];

    }
    let arrSelectProduct: ModelMasProduct[] = null;
    arrSelectProduct = await this.SvDefault.ShowModalProduct2(arrProduct, arrCurrentProduct);
    if (!this.SvDefault.IsArray(arrSelectProduct)) {
      return;
    }
    // ModelInvAuditDt
    let arrAuditDetail: ModelInvAuditDt[] = null;
    arrAuditDetail = arrSelectProduct
      .filter(x => !arrCurrentProduct.some(y => x.PdId === y.PdId))
      .map(x => {
        let dt: ModelInvAuditDt = new ModelInvAuditDt();
        this.SvDefault.CopyObject(x, dt);
        return dt;
      });
    this.ArrDetail = [... (this.ArrDetail || []), ...arrAuditDetail];
  }

  ShowModalReport() {
    if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isPrint")) {
      this.SvDefault.ShowPositionRoleMessage("IsPrint");
      return;
    }
    const dialogRef = this.dialog.open(ModalReportComponent, {
      width: '600px',
      data: { reportGroup: "Audit" }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ExportPDF(result.reportName, result.reportUrl)
    });
  }

  private async ExportPDF(reportName: string, reportUrl: string) {
    this.reportUrl = reportUrl;
    this.reportName = reportName;
    await this.reportService.GetReportAuditPDF(this._strCompCode, this._strBrnCode, this.Header.DocNo, this.reportUrl, this.reportName);
  }

  public async GetEmployee() {
    this.SvDefault.DoActionAsync(async () => await this.getEmployee(), false);
  }

  private async getEmployee() {
    this.Header.EmpName = await this.getEmployeeFullName(this.Header.EmpCode);
  }

  private async getEmployeeFullName(pStrEmpCode) {

    pStrEmpCode = this.SvDefault.GetString(pStrEmpCode);
    if (pStrEmpCode === "") {
      return "";
    }
    let emp: ModelMasEmployee = null;
    emp = await this._svAudit.GetEmployee(pStrEmpCode);
    if (emp == null) {
      return "";
    }
    let strEmpFullName: string = "";
    strEmpFullName = `${emp.PrefixThai} ${emp.PersonFnameThai} ${emp.PersonLnameThai}`;
    return strEmpFullName;
  }

  deleteRow = (indexs: any): void => {
    var productObj = this.ArrDetail.find((row, index) => index == indexs);
    // this.productSelectedList = this.productSelectedList.filter((row, index) => row.PdId !== productObj.PdId);
    this.ArrDetail = this.ArrDetail.filter((row, index) => index !== indexs);
  }

  public GetSumDetail(pStrFiledName : string){
    if(!this.SvDefault.IsArray(this.ArrDetail)){
      return 0.00;
    }
    pStrFiledName = this.SvDefault.GetString(pStrFiledName);
    if(pStrFiledName === ""){
      return 0.00;
    }
    let result = 0;
    for (let i = 0; i < this.ArrDetail.length; i++) {
      const auditDt = this.ArrDetail[i];
      if(!auditDt.hasOwnProperty(pStrFiledName)){
        continue;
      }
      let objFiledValue = auditDt[pStrFiledName];
      if(!this.SvDefault.IsNumeric(objFiledValue)){
        continue;
      }
      let numFieldValue = this.SvDefault.GetNumber(objFiledValue,2);
      result += numFieldValue;
    }
    return result;
  }
}
