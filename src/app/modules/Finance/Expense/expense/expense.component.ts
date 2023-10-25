import { Component, OnInit } from '@angular/core';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { DefaultService } from './../../../../service/default.service';
import * as ModelCommon from 'src/app/model/ModelCommon';
import { NgbDate, NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as ModelBilling from 'src/app/model/ModelBilling';
import { ExportData, ReportService } from 'src/app/service/report-service/report-service';
import { ServiceBilling } from 'src/app/service/billing-service/ServiceBilling.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModelMasDocPattern } from 'src/app/model/ModelCommon';
import { MatDialog } from '@angular/material/dialog';
import { ExpenseService } from 'src/app/service/expense-service/expense-service';
import { ExpenseEss, ExpenseHd, ExpenseTable, FinExpenseDt, FinExpenseHd, SaveExpense } from 'src/app/model/finance/expense.interface';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-expense',
  templateUrl: './expense.component.html',
  styleUrls: ['./expense.component.scss']
})
export class ExpenseComponent implements OnInit {
  constructor(
    private authGuard: AuthGuard,
    public SvDefault: DefaultService,
    private _svBilling: ServiceBilling,
    private reportService: ReportService,
    private _svShared: SharedService,
    private _route: ActivatedRoute,
    public dialog: MatDialog,
    private _svExpenseService: ExpenseService,
  ) {
    const today = new Date();
    this.minDate = { year: today.getFullYear() - 1, month: today.getMonth() + 1, day: today.getDate() };
    this.maxDate = { year: today.getFullYear(), month: today.getMonth() + 1, day: today.getDate() };
  }

  private authPositionRole: any;
  HiddenButton = new ModelCommon.ModelHiddenButton();
  ExpenseDate: NgbDate = new NgbDate(0, 0, 0);
  public ExpenseHeader: ExpenseHd = new ExpenseHd();
  newCategory = '';
  newTitle = 'ค่าใช้จ่ายเบ็ดเตล็ดอื่นๆ';
  btnApprove = true;
  btnBack = true;
  btnCancel = true;
  btnClear = true;
  btnComplete = true;
  btnGetProduct = "";
  btnPrint = true;
  btnReject = true;
  btnSave = true;
  isData = false;
  isAddList = false;
  isExpanded = false;
  finExpenseDts: FinExpenseDt[] = [];
  expenseTable: ExpenseTable[] = [];
  essTable: ExpenseEss[] = [];
  htmlStr: string = '<i class="fa fa-trash"></i>';
  status = "";
  statusOriginal = "";
  maxDate: NgbDateStruct;
  minDate: NgbDateStruct;
  action: string = "";

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  async ngOnInit() {
    await this.SvDefault.DoActionAsync(async () => await this.startAsync(), true);
    // let dateStart = new Date(new Date(this._svShared.systemDate).setDate(new Date(this._svShared.systemDate).getDate() - 1));
    // this.ExpenseDate = new NgbDate(dateStart.getFullYear(), dateStart.getMonth() + 1, dateStart.getDate());
  }

  private async startAsync(): Promise<void> {
    this.authPositionRole = this.SvDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }

    this.status = "";
    this.statusOriginal = "";
    let strGuid = this._route.snapshot.params.DocGuid;
    if (strGuid === "New") {
      this.status = "สร้าง";
      this.action = "New";
      this.statusOriginal = this.status;
      // var docPattern = await this._svExpenseService.GetDocPattern(this._svShared.compCode, this._svShared.brnCode, "Expense", this.SvDefault.GetFormatDate(<any>this._svShared.systemDate));
      // this.ExpenseHeader.DocNo = docPattern['Data'];
      // this.ExpenseHeader.DocPattern = docPattern['Data'];
      var Expense = await this._svExpenseService.GetMasExpenseTable("New", this._svShared.compCode, this._svShared.brnCode, this._svShared.locCode, "New");
      this.expenseTable = Expense['Data'];
      this.ExpenseHeader.CreatedBy = (this._svShared.user || "").toString().trim();
      this.ExpenseHeader.BrnCode = (this._svShared.brnCode || "").toString().trim();
      this.ExpenseHeader.CompCode = (this._svShared.compCode || "").toString().trim();
      this.ExpenseHeader.DocStatus = "New";
      this.HiddenButton = this.SvDefault.GetHiddenButton2(this.ExpenseHeader.DocStatus, this.ExpenseHeader.Post);

      this.btnSave = false;
      this.btnPrint = true;
      this.btnCancel = true;
      this.btnClear = false;
      this.btnBack = false;
      this.btnComplete = true;
      this.btnApprove = true;
      this.btnReject = true;
    }
    else {
      this.action = "Edit";
      this.displayData(this._svShared.compCode, this._svShared.brnCode, this._svShared.locCode, strGuid)
    }
  }

  private async displayData(compCode: string, brnCode: string, locCode: string, guid: string) {
    let ExpenseTable: ExpenseTable[] = null;
    let expenseHd: ExpenseHd[] = null;
    let expenseEssTable: ExpenseEss[] = null;
    this.expenseTable = [];
    this.essTable = [];
    // var docPattern = await this._svExpenseService.GetDocPattern(this._svShared.compCode, this._svShared.brnCode, "Expense", this.SvDefault.GetFormatDate(<any>this._svShared.systemDate));
    expenseHd = await this._svExpenseService.GetExpenseHd(this._svShared.compCode, this._svShared.brnCode, this._svShared.locCode, guid);
    this.ExpenseHeader.CompCode = compCode;
    this.ExpenseHeader.BrnCode = brnCode;
    this.ExpenseHeader.LocCode = locCode;
    let docDate = expenseHd['Data'].DocDate;
    let datExpense = new Date(docDate);
    this.ExpenseDate = new NgbDate(datExpense.getFullYear(), datExpense.getMonth() + 1, datExpense.getDate());
    this.ExpenseHeader.CreatedBy = (this._svShared.user || "").toString().trim();
    this.ExpenseHeader.DocNo = expenseHd['Data'].DocNo;
    this.ExpenseHeader.DocPattern = expenseHd['Data'].DocPattern;
    this.ExpenseHeader.DocDate = expenseHd['Data'].DocDate;
    this.ExpenseHeader.Remark = expenseHd['Data'].Remark;
    this.ExpenseHeader.Guid = expenseHd['Data'].Guid;
    this.ExpenseHeader.WorkType = expenseHd['Data'].WorkType;
    this.ExpenseHeader.DocStatus = expenseHd['Data'].DocStatus;;

    if (this.ExpenseHeader.WorkType === "D") {
      this.ExpenseHeader.WorkStart = "";
      this.ExpenseHeader.WorkFinish = "";
    }
    else {
      this.ExpenseHeader.WorkStart = expenseHd['Data'].WorkStart;
      this.ExpenseHeader.WorkFinish = expenseHd['Data'].WorkFinish;
    }
    ExpenseTable = await this._svExpenseService.GetMasExpenseTable("Edit", compCode, brnCode, locCode, expenseHd['Data'].DocNo);
    this.expenseTable = ExpenseTable['Data'];
    expenseEssTable = await this._svExpenseService.GetExpenseEssTable(compCode, brnCode, locCode, expenseHd['Data'].DocNo);
    this.essTable = expenseEssTable['Data'];
    let countAllExpanded = this.expenseTable.length;

    for (let i = 0; i < countAllExpanded; i++) {
      this.expenseTable[i].IsExpanded = true;
    }

    for (let i = 0; i < this.essTable.length; i++) {
      this.essTable[i].Delete = '<i class="fa fa-trash"></i>'
    }

    this.HiddenButton.status = this.ExpenseHeader.DocStatus;

    //Hidden Button
    // if (this.ExpenseHeader.DocStatus == "Cancel") {
    //   this.status = "ยกเลิก";
    // } else if (this.ExpenseHeader.DocStatus == "Ready") {
    //   this.status = "พร้อมใช้";
    // } else if (this.ExpenseHeader.DocStatus == "Reference") {
    //   this.status = "เอกสารถูกอ้างอิง";
    // } else if (this.ExpenseHeader.DocStatus == "Active") {
    //   this.status = "แอคทีฟ";
    // } else if (this.ExpenseHeader.DocStatus == "Wait") {
    //   this.status = "รออนุมัติ";
    // }

    //Hidden Button
    if (this.ExpenseHeader.DocStatus == "Cancel") {
      this.status = "ยกเลิก";
      this.btnApprove = true;
      this.btnBack = false;
      this.btnCancel = true;
      this.btnClear = true;
      this.btnComplete = true;
      this.btnPrint = false;
      this.btnReject = true;
      this.btnSave = true;
    } else if (this.ExpenseHeader.DocStatus == "Ready") {
      this.status = "พร้อมใช้";
      this.btnApprove = true;
      this.btnBack = false;
      this.btnCancel = false;
      this.btnClear = true;
      this.btnComplete = true;
      this.btnPrint = false;
      this.btnReject = true;
      this.btnSave = true;
    } else if (this.ExpenseHeader.DocStatus == "Reference") {
      this.status = "เอกสารถูกอ้างอิง";
      this.btnApprove = true;
      this.btnBack = false;
      this.btnCancel = true;
      this.btnClear = true;
      this.btnComplete = true;
      this.btnPrint = false;
      this.btnReject = true;
      this.btnSave = true;
    } else if (this.ExpenseHeader.DocStatus == "Active") {
      this.status = "แอคทีฟ";
      this.btnApprove = true;
      this.btnBack = false;
      this.btnCancel = false;
      this.btnClear = true;
      this.btnComplete = false;
      this.btnPrint = false;
      this.btnReject = true;
      this.btnSave = false;
    } else if (this.ExpenseHeader.DocStatus == "Wait") {
      this.status = "รออนุมัติ";
      this.btnApprove = false;
      this.btnBack = false;
      this.btnCancel = true;
      this.btnClear = true;
      this.btnComplete = true;
      this.btnPrint = false;
      this.btnReject = false;
      this.btnSave = true;
    }
  }

  getBackgroundRibbon() {
    let classStatus = "ribbon-1 ribbon tooltipa statusBase"
    if (this.ExpenseHeader.DocStatus == "Cancel") {
      classStatus += " statusCancel ";
    } else if (this.ExpenseHeader.DocStatus == "New") {
      classStatus += " statusNew ";
    } else if (this.ExpenseHeader.DocStatus == "Ready") {
      classStatus += " statusReady ";
    } else if (this.ExpenseHeader.DocStatus == "Reference") {
      classStatus += " statusReference ";
    } else if (this.ExpenseHeader.DocStatus == "Active") {
      classStatus += " statusActive ";
    } else {
      classStatus += " statusNew ";
    }
    return classStatus;
  }

  DtpCredit_Change() {
    let datePicker = new Date;
    datePicker.setDate(this.ExpenseDate.day);
    datePicker.setMonth(this.ExpenseDate.month - 1);
    datePicker.setFullYear(this.ExpenseDate.year);
    let docDate = this.SvDefault.GetFormatDate(<any>datePicker);
    this.ExpenseHeader.DocDate = datePicker;
    this.GetDocPattern(docDate)
  }

  private async GetDocPattern(docDate: string) {
    var docPattern = await this._svExpenseService.GetDocPattern(this._svShared.compCode, this._svShared.brnCode, "Expense", docDate);
    this.ExpenseHeader.DocNo = docPattern['Data'];
    this.ExpenseHeader.DocPattern = docPattern['Data'];
  }

  public ClearCtrlWorkType() {
    if (this.ExpenseHeader.WorkType === "D") {
      this.ExpenseHeader.WorkStart = "";
      this.ExpenseHeader.WorkFinish = "";
    }
  }

  openExpanded() {
    let countAllExpanded = this.expenseTable.length;
    for (let i = 0; i < countAllExpanded; i++) {
      this.expenseTable[i].IsExpanded = true;
    }
  }

  closeExpanded() {
    let countAllExpanded = this.expenseTable.length;
    for (let i = 0; i < countAllExpanded; i++) {
      this.expenseTable[i].IsExpanded = false;
    }
  }

  deleteListTable(categoryId: string | number, deleteListId: number) {
    let indexDeleteExpense = this.expenseTable[categoryId].Body.findIndex((x: { IndexListId: number; }) => x.IndexListId == deleteListId);
    this.expenseTable[categoryId].body.splice(indexDeleteExpense, 1);
  }

  onChangeInput(value: any, id: string, indexListId: number, type: string) {
    // if (id == '0101' && type == 'qty') {
    //   let baseSalaryDailyOT = value / 8;
    //   this.expenseTable[categoryId].body[2].qty = (baseSalaryDailyOT * 1).toFixed(2).toString();
    //   this.expenseTable[categoryId].body[3].qty = (baseSalaryDailyOT * 1.5).toFixed(2).toString();
    //   this.expenseTable[categoryId].body[4].qty = (baseSalaryDailyOT * 2).toFixed(2).toString();
    //   this.expenseTable[categoryId].body[5].qty = (baseSalaryDailyOT * 3).toFixed(2).toString();
    // }

    if (id == '0100' && type == 'Qty') {
      this.expenseTable.find(x => x.Id == id).Body.find((x: { IndexListId: number; }) => x.IndexListId == indexListId).Qty = Number(value);
      var expenseQty = this.expenseTable.find(x => x.Id == id).Body.find((x: { CategoryId: string; }) => x.CategoryId == '0101').Qty;
      this.expenseTable.find(x => x.Id == id).Body.find((x: { CategoryId: string; }) => x.CategoryId == '0103').Qty = Number((((expenseQty / 30) / 8) * 1).toFixed(2));
      this.expenseTable.find(x => x.Id == id).Body.find((x: { CategoryId: string; }) => x.CategoryId == '0104').Qty = Number((((expenseQty / 30) / 8) * 1.5).toFixed(2));
      this.expenseTable.find(x => x.Id == id).Body.find((x: { CategoryId: string; }) => x.CategoryId == '0105').Qty = Number((((expenseQty / 30) / 8) * 2).toFixed(2));
      this.expenseTable.find(x => x.Id == id).Body.find((x: { CategoryId: string; }) => x.CategoryId == '0106').Qty = Number((((expenseQty / 30) / 8) * 3).toFixed(2));
    }

    if (id == '0200' && type == 'Qty') {
      this.expenseTable.find(x => x.Id == id).Body.find((x: { IndexListId: number; }) => x.IndexListId == indexListId).Qty = Number(value);
      var expenseQty = this.expenseTable.find(x => x.Id == id).Body.find((x: { CategoryId: string; }) => x.CategoryId == '0201').Qty;
      this.expenseTable.find(x => x.Id == id).Body.find((x: { CategoryId: string; }) => x.CategoryId == '0203').Qty = Number(((expenseQty / 8) * 1).toFixed(2));
      this.expenseTable.find(x => x.Id == id).Body.find((x: { CategoryId: string; }) => x.CategoryId == '0204').Qty = Number(((expenseQty / 8) * 1.5).toFixed(2));
      this.expenseTable.find(x => x.Id == id).Body.find((x: { CategoryId: string; }) => x.CategoryId == '0205').Qty = Number(((expenseQty / 8) * 2).toFixed(2));
      this.expenseTable.find(x => x.Id == id).Body.find((x: { CategoryId: string; }) => x.CategoryId == '0206').Qty = Number(((expenseQty / 8) * 3).toFixed(2));
    }

    if (type == 'Qty') {
      this.expenseTable.find(x => x.Id == id).Body.find((x: { IndexListId: number; }) => x.IndexListId == indexListId).Qty = Number(((value)).toFixed(2));
    } else if (type == 'Number') {
      this.expenseTable.find(x => x.Id == id).Body.find((x: { IndexListId: number; }) => x.IndexListId == indexListId).Number = Number(value);
    }
  }

  addListTable() {
    // let tempTable = this.expenseTable;
    // let lastArrayOfListTable = (tempTable[this.listTableTmp].body).slice(-1)[0];
    // let lastIndexOfCategory = 0;
    // if (lastArrayOfListTable != undefined) {
    //   lastIndexOfCategory = lastArrayOfListTable.indexListId + 1;
    // }
    // console.log(lastIndexOfCategory);
    // console.log(this.expenseTable);
    // //console.log((this.expenseTable[this.listTableTmp].body).pop());
    // this.expenseTable[this.listTableTmp].body.push({
    //   categoryId: this.listTableTmp,
    //   indexListId: lastIndexOfCategory,
    //   title: this.newTitle,
    //   disabledQty: false,
    //   qty: '',
    //   unit: this.newUnit,
    //   data: this.newData,
    //   number: '',
    //   isDelete: true,
    //   delete: '<i class="fa fa-trash"></i>'
    // });
    // this.isAddList = true;
    // this.newTitle = 'ค่าใช้จ่ายเบ็ดเตล็ดอื่นๆ';
    // this.newUnit = '';
    // this.newData = '';
  }

  addEssList() {
    let lastIndexOfEss = 0;
    if (this.essTable.length > 0) {
      lastIndexOfEss = (this.essTable).slice(-1)[0].Id + 1;
    }

    let expenseEss = new ExpenseEss();
    expenseEss.Id = lastIndexOfEss;
    expenseEss.EssDetail = "";
    expenseEss.Delete = '<i class="fa fa-trash"></i>'
    this.essTable.push(expenseEss);
  }

  deleteEssList(deleteEssId: number) {
    let indexDeleteEss = this.essTable.findIndex(x => x.Id == deleteEssId);
    this.essTable.splice(indexDeleteEss, 1);
  }

  onChangeEssInputId(value: string, indexs: any) {
    this.essTable[indexs].EssNumber = value;
  }

  onChangeEssInputDetail(value: string, indexs: any) {
    this.essTable[indexs].EssDetail = value;
  }

  addCategory(): void {
    // let idExpenseTableCount = this.expenseTable.length;

    // if (this.newCategory != '') {
    //   this.expenseTable.push({ id: idExpenseTableCount, header: this.newCategory, body: this.loadBodyTable('other'), isExpanded: this.isExpanded });
    // }
    // this.newCategory = '';
  }

  public async saveDocument() {
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

    if (!this.validateData()) {
      return;
    }

    let saveExpense = new SaveExpense();
    let finExpenseHd = new FinExpenseHd();
    finExpenseHd.CompCode = (this._svShared.compCode || "").toString().trim();
    finExpenseHd.BrnCode = (this._svShared.brnCode || "").toString().trim();
    finExpenseHd.LocCode = (this._svShared.locCode || "").toString().trim();
    finExpenseHd.DocStatus = "Active";
    finExpenseHd.DocDate = this.ExpenseHeader.DocDate;
    finExpenseHd.WorkType = this.ExpenseHeader.WorkType;
    finExpenseHd.WorkStart = this.ExpenseHeader.WorkStart;
    finExpenseHd.WorkFinish = this.ExpenseHeader.WorkFinish;
    finExpenseHd.Remark = this.ExpenseHeader.Remark;
    finExpenseHd.DocNo = this.ExpenseHeader.DocNo;
    finExpenseHd.DocPattern = this.ExpenseHeader.DocPattern;
    finExpenseHd.CreatedBy = this.ExpenseHeader.CreatedBy;

    saveExpense.FinExpenseHd = finExpenseHd;
    saveExpense.ExpenseTables = this.expenseTable;
    saveExpense.ExpenseEssTables = this.essTable;

    let expenseResponse = await this._svExpenseService.SaveData(saveExpense);
    let statusCode = expenseResponse.StatusCode;
    let message = expenseResponse.Message;


    if (statusCode == "422") {
      this.SvDefault.ShowWarningDialog(message);
    }
    else if (statusCode == "400") {
      Swal.fire(message, "", "warning");
      return;
    }
    else {
      let responseGuid = expenseResponse['Data']['FinExpenseHd'].Guid
      this.displayData((this._svShared.compCode || "").toString().trim(), (this._svShared.brnCode || "").toString().trim(), (this._svShared.locCode || "").toString().trim(), responseGuid);
      await this.SvDefault.ShowSaveCompleteDialogAsync();
    }
  }

  private validateData() {
    if (this.ExpenseHeader.WorkType == null || this.ExpenseHeader.WorkType == "") {
      Swal.fire("คุณยังไม่เลือกเวลาทำงานของสถานี", "", "warning");
      return false;
    }

    if (this.ExpenseHeader.DocDate == undefined) {
      Swal.fire("คุณยังไม่เลือกวันที่เอกสาร", "", "warning");
      return false;
    }

    return true;
  }

  async exportPDF() {
    await this.SvDefault.DoActionAsync(async () => await this.ExportPDF(), true);
  };
  private async ExportPDF() {
    // if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isPrint")) {
    //   this.SvDefault.ShowPositionRoleMessage("IsPrint");
    //   return;
    // }
    await this.reportService.ExportReportBillingePDF(this.ExpenseHeader.CompCode, this.ExpenseHeader.BrnCode, this.ExpenseHeader.DocNo, this._svShared.user, this.ExpenseHeader.DocNo);
  }

  async clearDocument() {
    this.SvDefault.DoActionAsync(async () => {
      if (await this.SvDefault.ShowClearDialogAsync()) {
        await this.startAsync();
      }
    });
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

    
    this.ExpenseHeader.DocStatus = pStrStatus;
    this.ExpenseHeader.UpdatedBy = this._svShared.user;

    let expenseResponse = await this._svExpenseService.UpdateStatus(this.ExpenseHeader);
    let statusCode = expenseResponse.StatusCode;
    let message = expenseResponse.Message;

    if (statusCode == "422") {
      this.SvDefault.ShowWarningDialog(message);
    }
    else if (statusCode == "400") {
      Swal.fire(message, "", "warning");
      return;
    }
    else {
      let responseGuid = this.ExpenseHeader.Guid
      this.displayData((this._svShared.compCode || "").toString().trim(), (this._svShared.brnCode || "").toString().trim(), (this._svShared.locCode || "").toString().trim(), responseGuid);
      await this.SvDefault.ShowSaveCompleteDialogAsync();
    }
  }
}
