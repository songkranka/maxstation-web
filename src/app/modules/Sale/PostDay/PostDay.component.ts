import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { DefaultService } from 'src/app/service/default.service';
import { MasterService } from 'src/app/service/master-service/master.service';
import { ModelMasMapping } from 'src/app/model/ModelScaffold';
import { HttpClient } from '@angular/common/http';
import { AllData, CheckBeforeSave, CsMasMapping, DopPostdayDt, DopPostdayHd, Formula, GetDocumentRequest, GetDopValidDataParam, ModelMecPostPaidValidate, SumInDay } from 'src/app/model/sale/postday.interface';
import { PostDayService } from 'src/app/service/postday-service/postday-service';
import * as moment from 'moment';
import { async } from 'rxjs/internal/scheduler/async';
import { ModalHtmlComponent } from 'src/app/shared/components/ModalHtml/ModalHtml.component';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { MasControlService } from 'src/app/shared/shared-service/mas-control.service';
import { ModalPosPaidValidateComponent } from './ModalPosPaidValidate/ModalPosPaidValidate.component';

//==================== Model ====================
//*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z

@Component({
  selector: 'app-PostDay',
  templateUrl: './PostDay.component.html',
  styleUrls: ['./PostDay.component.scss']
})


export class PostDayComponent implements OnInit {
  //==================== constructor ====================
  //*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z

  listMasMapping: Array<CsMasMapping> = [];
  sumData = new SumInDay();

  postDayHd = new DopPostdayHd();
  listPostDayDtCr: Array<DopPostdayDt> = [];
  listPostDayDtDr: Array<DopPostdayDt> = [];
  listFormula: Array<Formula> = [];
  listCheckBeforeSave: Array<CheckBeforeSave> = [];
  listValidatePostPaid : ModelMecPostPaidValidate[] = [];

  headerCard = "บันทึกปิดสิ้นวัน";
  status = "New";

  btnSave = false;

  compCode = this.sharedService.compCode;
  brnCode = this.sharedService.brnCode;
  locCode = this.sharedService.locCode;
  user = this.sharedService.user;
  systemDate = this.sharedService.systemDate;
  private authPositionRole: any;
  action: string = "";

  constructor(
    private httpClient: HttpClient,
    private sharedService: SharedService,
    private defaultService: DefaultService,
    private masService: MasterService,
    private postDayService: PostDayService,
    private masControlService: MasControlService,
    private authGuard: AuthGuard,
  ) { }

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  async ngOnInit(): Promise<void> {
    await this.defaultService.DoActionAsync(async () => await this.start(), true);
  }

  private async start() {
    this.authPositionRole = this.defaultService.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }
    await this.getMasMappingList();

    this.postDayHd.CompCode = this.compCode;
    this.postDayHd.BrnCode = this.brnCode;
    this.postDayHd.LocCode = this.locCode;
    this.postDayHd.User = this.user;
    this.postDayHd.DocDate = this.defaultService.GetFormatDate(this.systemDate);
    this.postDayHd.CreatedBy = this.user;

    await this.getDocument();
  }

  private async getMasMappingList() {

    let responseData = (await this.masService.getMasMappingList("PostDay")).Data;
    responseData.forEach(x => {
      this.listMasMapping.push(new CsMasMapping(x.MapDesc, +x.MapId));
    });
  }

  private async getDocument() {
    this.listPostDayDtCr = [];
    this.listPostDayDtDr = [];
    this.listFormula = [];
    this.listCheckBeforeSave = [];
    this.systemDate = this.sharedService.systemDate;
    let systDate = this.defaultService.GetFormatDate(this.systemDate);
    let request = new GetDocumentRequest(this.postDayHd.CompCode, this.postDayHd.BrnCode, this.postDayHd.LocCode, this.postDayHd.DocDate, systDate);
    let responseData = await this.postDayService.getDocument(request);
    this.listValidatePostPaid = responseData?.Data?.ListValidatePostPaid || [];
    if (responseData.Data.DopPostdayHd != null) {
      this.postDayHd.Remark = responseData.Data.DopPostdayHd.Remark;
      this.postDayHd.CashAmt = responseData.Data.DopPostdayHd.CashAmt;
      this.postDayHd.DiffAmt = responseData.Data.DopPostdayHd.DiffAmt;
      this.postDayHd.DepositAmt = responseData.Data.DopPostdayHd.DepositAmt;
      this.postDayHd.ChequeAmt = responseData.Data.DopPostdayHd.ChequeAmt;
      this.listPostDayDtCr = responseData.Data.CrItems;
      this.listPostDayDtDr = responseData.Data.DrItems;
      this.listFormula = responseData.Data.FormulaItems;
      this.listCheckBeforeSave = responseData.Data.CheckBeforeSaveItems;
      this.action = "New";
    } else {
      //init data
      this.action = "Edit";
      this.postDayHd.Remark = "";
      this.postDayHd.CashAmt = responseData.Data.SumData.SumCashAmt;
      this.postDayHd.DiffAmt = responseData.Data.SumData.SumDiffAmt;
      this.postDayHd.DepositAmt = responseData.Data.SumData.SumCashDepositAmt;
      this.postDayHd.ChequeAmt = responseData.Data.SumData.SumChequeAmt;
      this.listPostDayDtCr = [];
      this.listPostDayDtDr = [];
      this.listFormula = responseData.Data.FormulaItems;
      this.listCheckBeforeSave = responseData.Data.CheckBeforeSaveItems;
      // this.listPostDayDtCr.push(new DopPostdayDt(0, this.postDayHd.BrnCode, this.postDayHd.CompCode, this.postDayHd.DocDate, 0, 0, 0, "CR", this.postDayHd.LocCode, 1, 0, + this.listMasMapping[0].MapId, this.listMasMapping[0].MapDesc));
      // this.listPostDayDtDr.push(new DopPostdayDt(0, this.postDayHd.BrnCode, this.postDayHd.CompCode, this.postDayHd.DocDate, 0, 0, 0, "DR", this.postDayHd.LocCode, 1, 0, + this.listMasMapping[0].MapId, this.listMasMapping[0].MapDesc));
    }
    if (moment(this.postDayHd.DocDate).isBefore(this.defaultService.GetFormatDate(this.systemDate))) {
      this.btnSave = true;
    } else {
      this.btnSave = false;
    }
  }

  addDopPostDt = (docType: any, mapId: any): void => {

    let map = this.listMasMapping.find(x => { return x.MapId == mapId });
    if (typeof map != "undefined") {
      if (docType == "CR") {
        let seq = this.listPostDayDtCr.length;
        this.listPostDayDtCr.push(new DopPostdayDt(0, this.postDayHd.BrnCode, this.postDayHd.CompCode, this.postDayHd.DocDate, 0, 0, 0, "CR", this.postDayHd.LocCode, (seq + 1), 0, + map.MapId, map.MapDesc));
      }
      else {
        let seq = this.listPostDayDtDr.length;
        this.listPostDayDtDr.push(new DopPostdayDt(0, this.postDayHd.BrnCode, this.postDayHd.CompCode, this.postDayHd.DocDate, 0, 0, 0, "DR", this.postDayHd.LocCode, (seq + 1), 0, + map.MapId, map.MapDesc));
      }
    }
  }


  deleteDopPostDt = (indexs: any, docType: any): void => {
    if (docType == "CR") {
      this.listPostDayDtCr.splice(indexs, 1);
    }
    else {
      this.listPostDayDtDr.splice(indexs, 1);
    }
  }

  changeDate = async (event: any) => {
    this.postDayHd.DocDate = this.defaultService.GetFormatDate(event.value);
    await this.defaultService.DoActionAsync(async () => this.ChangeDate(), true);
  }

  ChangeDate = async () => {
    await this.getDocument();
  }

  // async saveDocument() {

  //   swal.fire({
  //     allowEscapeKey: false,
  //     allowOutsideClick: false,
  //     confirmButtonText: "ตกลง",
  //     denyButtonText: "ยกเลิก",
  //     icon: 'warning',
  //     showDenyButton: true,
  //     title: 'คุณต้องการบันทึกปิดสิ้นวัน ใช่หรือไม่?',
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       if (this.validateBeforeSaveDocument()) {
  //         await this.defaultService.DoActionAsync(async () => this.SaveDocument(), true);
  //       }
  //     }
  //   });
  // }
  async saveDocument() {
    if(this.action === "New"){
      if (!this.defaultService.ValidateAuthPositionRole(this.authPositionRole, "isCreate")) {
        this.defaultService.ShowPositionRoleMessage("IsCreate");
        return;
      }
    }
    else if(this.action === "Edit"){
      if (!this.defaultService.ValidateAuthPositionRole(this.authPositionRole, "isEdit")) {
        this.defaultService.ShowPositionRoleMessage("IsEdit");
        return;
      }
    }

    let swOption = <SweetAlertOptions<any, any>>{
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: "ตกลง",
      denyButtonText: "ยกเลิก",
      icon: 'warning',
      showDenyButton: true,
      title: 'คุณต้องการบันทึกปิดสิ้นวัน ใช่หรือไม่?',
    };
    let modalResult = await swal.fire(swOption);
    if (modalResult.isConfirmed && this.validateBeforeSaveDocument()) {
      await this.defaultService.DoActionAsync(async () => await this.SaveDocument(), true);
    }
  }

  private validateBeforeSaveDocument(): boolean {
    // return true;
    //check compare summary
    let checkCompare = this.listFormula.find(x => { return x.DestinationAmount != x.SourceAmount });
    if (typeof checkCompare != "undefined") {
      swal.fire({
        allowEscapeKey: false,
        allowOutsideClick: false,
        icon: 'warning',
        title: 'ไม่สามารถบันทึกข้อมูลได้ เนื่องจากตารางเปรียบเทียบรายการบันทึกข้อมูล มีข้อมูลที่ไม่เท่ากัน',
      });
      return false;
    }

    //check condition
    let checkCondition = this.listCheckBeforeSave.find(x => { return x.PassValue == "No" });
    if (typeof checkCondition != "undefined") {
      swal.fire({
        allowEscapeKey: false,
        allowOutsideClick: false,
        icon: 'warning',
        title: 'ไม่สามารถบันทึกข้อมูลได้ เนื่องจากไม่ผ่านการตรวจสอบทั้งหมด',
      });
      return false;
    }

    return true;
  }

  // public async SaveDocument() {
  //   let allData = new AllData();

  //   this.postDayHd.CashAmt = 100;
  //   this.postDayHd.DiffAmt = 200;
  //   this.postDayHd.DepositAmt = 300;
  //   this.postDayHd.ChequeAmt = 600;

  //   allData.DopPostdayHd = this.postDayHd;
  //   allData.CrItems = this.listPostDayDtCr;
  //   allData.DrItems = this.listPostDayDtDr;
  //   allData.FormulaItems = this.listFormula;

  //   this.httpClient.post(this.sharedService.urlPostDay + "/api/PostDay/SaveDocument", allData)
  //     .subscribe(
  //       response => {
  //         if (response["Status"] == 'Success') {
  //           swal.fire({
  //             allowEscapeKey: false,
  //             allowOutsideClick: false,
  //             icon: 'success',
  //             title: 'บันทึกข้อมูลสำเร็จ',
  //           })
  //             .then(() => {
  //               this.btnSave = true;
  //             });
  //         }
  //         else {
  //           swal.fire({
  //             allowEscapeKey: false,
  //             allowOutsideClick: false,
  //             icon: 'error',
  //             title: response["Message"],
  //           });
  //         }
  //       },
  //       error => {
  //         swal.fire({
  //           allowEscapeKey: false,
  //           allowOutsideClick: false,
  //           title: '<span class="text-danger">เกิดข้อผิดพลาด</span>',
  //           text: error.error.message
  //         });
  //       }
  //     );
  // }
  private async SaveDocument() {
    let allData = new AllData();

    // this.postDayHd.CashAmt = 100;
    // this.postDayHd.DiffAmt = 200;
    // this.postDayHd.DepositAmt = 300;
    // this.postDayHd.ChequeAmt = 600;

    for (let i = 0; i < this.listPostDayDtCr.length; i++) {
      this.listPostDayDtCr[i].DocNo = Number(this.listPostDayDtCr[i].DocNo)
      this.listPostDayDtCr[i].DocStart = Number(this.listPostDayDtCr[i].DocStart)
      this.listPostDayDtCr[i].DocFinish = Number(this.listPostDayDtCr[i].DocFinish)
      this.listPostDayDtCr[i].Total = Number(this.listPostDayDtCr[i].Total)
    }

    for (let i = 0; i < this.listPostDayDtDr.length; i++) {
      this.listPostDayDtDr[i].DocNo = Number(this.listPostDayDtDr[i].DocNo)
      this.listPostDayDtDr[i].DocStart = Number(this.listPostDayDtDr[i].DocStart)
      this.listPostDayDtDr[i].DocFinish = Number(this.listPostDayDtDr[i].DocFinish)
      this.listPostDayDtDr[i].Total = Number(this.listPostDayDtDr[i].Total)
    }
    allData.DopPostdayHd = this.postDayHd;
    allData.CrItems = this.listPostDayDtCr;
    allData.DrItems = this.listPostDayDtDr;
    allData.FormulaItems = this.listFormula;
    allData.CheckBeforeSaveItems = this.listCheckBeforeSave;

    // this.httpClient.post(this.sharedService.urlPostDay + "/api/PostDay/SaveDocument", allData)
    //   .subscribe(
    //     response => {
    //       if (response["StatusCode"] == 200) {
    //         swal.fire({
    //           allowEscapeKey: false,
    //           allowOutsideClick: false,
    //           icon: 'success',
    //           title: 'บันทึกข้อมูลสำเร็จ',
    //         })
    //           // .then(() => {
    //           //   this.btnSave = true;
    //           // });
    //       }
    //       else {
    //         swal.fire({
    //           allowEscapeKey: false,
    //           allowOutsideClick: false,
    //           icon: 'error',
    //           title: response["Message"],
    //         });
    //       }
    //     },
    //     error => {
    //       swal.fire({
    //         allowEscapeKey: false,
    //         allowOutsideClick: false,
    //         title: '<span class="text-danger">เกิดข้อผิดพลาด</span>',
    //         text: error.error.messages
    //       });
    //     }
    //   );
    let closeDayResponse = await this.postDayService.SaveCloseday(allData);

    if (closeDayResponse.StatusCode == "200") {
      this.btnSave = true;
      let masControlResponse = await this.masControlService.UpdateCtrlValue(this.compCode, this.brnCode, this.locCode, this.systemDate, this.user);

      if (masControlResponse.StatusCode == "200") {
        let docDate = moment(masControlResponse.Data["CtrlValue"], "DD/MM/YYYY").toDate();
        this.sharedService.systemDate = docDate;
        const expired = ((1000 * 60) * 60);
        localStorage.removeItem('systemDate');
        this.setWithExpiry("systemDate", this.defaultService.GetFormatDate(docDate), expired);
        await this.defaultService.ShowSaveCompleteDialogAsync();
      }
    }


  }

  async ShowSaveCompleteDialogAsync(): Promise<void> {
    let swalOption = <SweetAlertOptions>{
      allowEscapeKey: false,
      allowOutsideClick: false,
      icon: 'success',
      title: 'บันทึกข้อมูลสำเร็จ',
    };
    await swal.fire(swalOption);
  }

  setWithExpiry = (key, value, ttl) => {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    }
    localStorage.setItem(key, JSON.stringify(item));
  }


  getBackgroundRibbon() {
    let classStatus = "ribbon-1 ribbon tooltipa statusBase"
    if (this.status == "Cancel") {
      classStatus += " statusCancel ";
    } else if (this.status == "New") {
      classStatus += " statusNew ";
    } else if (this.status == "Ready") {
      classStatus += " statusReady ";
    } else if (this.status == "Reference") {
      classStatus += " statusReference ";
    } else if (this.status == "Active") {
      classStatus += " statusActive ";
    } else {
      classStatus += " statusNew ";
    }
    return classStatus;
  }

  async GetDopValidData(pCheck: CheckBeforeSave) {
    let dopValidData = null
    await this.defaultService.DoActionAsync(async () => { dopValidData = await this.getDopValidData(pCheck) }, true);
    await this.defaultService.DoActionAsync(async () => this.showModalHtml(dopValidData, pCheck.Label), false);
  }

  private async getDopValidData(pCheck: CheckBeforeSave) {
    if (pCheck == null) {
      return;
    }
    let param = new GetDopValidDataParam();
    param.BrnCode = "'" + this.defaultService.EncodeSql(this.sharedService.brnCode) + "'";
    param.CompCode = "'" + this.defaultService.EncodeSql(this.sharedService.compCode) + "'";
    param.LocCode = "'" + this.defaultService.EncodeSql(this.sharedService.locCode) + "'";
    param.DocDate = "'" + this.defaultService.EncodeSql(this.postDayHd.DocDate) + "'";
    param.ValidNo = pCheck.ValidNo;
    let result = await this.postDayService.GetDopValidData(param);
    return result;
  }

  private conVertToHtmlTable(pInput: object): string {
    if (!this.defaultService.IsArray(pInput)) {
      return "";
    }
    let arrKey = Object.keys(pInput[0]);
    if (!this.defaultService.IsArray(arrKey)) {
      return "";
    }
    let strHtmlHeader = '<thead><tr>' + arrKey.map(x => `<th class="text-center">${x}</th>`).join("") + "</tr></thead>"
    let strHtmlBody = "<tbody>";
    for (let i = 0; i < (<any>pInput).length; i++) {
      let dataRow = (<any>pInput)[i];
      let strHtmlRow = "<tr>" + arrKey.map(x => `<td class="align-middle">${dataRow[x]}</td>`).join("") + "</tr>";
      strHtmlBody += strHtmlRow;
    }
    strHtmlBody += "</tbody>";
    let result = "<table class='table table-hover table-sm'>" + strHtmlHeader + strHtmlBody + "</table>";
    return result;
  }

  private async showModalHtml(pInput: object, pStrModalHeader: string = "") {
    let strHtml = this.conVertToHtmlTable(pInput);
    if (strHtml === "") {
      return;
    }
    let param = {
      HeaderInput: pStrModalHeader,
      HtmlInput: strHtml
    }
    await this.defaultService.ShowModalAsync(ModalHtmlComponent, "sm", param);
  }

  public IsDisplayModalHtmlRow(param : CheckBeforeSave){
    let result = param.PassValue === "No" && param.HaveValidSql && param.ValidNo !== 23;
    return result;
  }

  public IsDisplayModalPostPaidRow(param : CheckBeforeSave){
    let result = param.PassValue === "No" && param.ValidNo === 23;
    return result;
  }

  public IsDisplayTextRedRow(param : CheckBeforeSave){
    let result = param.PassValue === "No" && !param.HaveValidSql && param.ValidNo !== 23;
    return result;
  }

  public IsDisplayNormalRow(param : CheckBeforeSave){
    let result = param.PassValue === "Yes";
    return result;
  }

  public async ShowModalValidatePostPaid(){
    if(!this.defaultService.IsArray(this.listValidatePostPaid)){
      return;
    }
    let param = {
      ListPostPaid: this.listValidatePostPaid,
    }
    await this.defaultService.ShowModalAsync(ModalPosPaidValidateComponent, "lg", param);
    //this.showModalHtml(this.listValidatePostPaid , "รายละเอียดการตรวจสอบ");
  }
}
