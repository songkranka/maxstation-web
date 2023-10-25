import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { async } from 'rxjs/internal/scheduler/async';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { ModelHiddenButton } from 'src/app/model/ModelCommon';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import Swal from 'sweetalert2';
import { CustomerService } from '../Customer.service';
import { ModelCustomer, ModelMasCustomer2, ModelMasCustomerCar2 } from '../ModelCustomer';
import * as XLSX from 'xlsx';
import { ExportData, ReportService } from 'src/app/service/report-service/report-service';
import { ReportConfig } from 'src/app/model/report/master/reportconfig.interface';
@Component({
  selector: 'app-Customer',
  templateUrl: './Customer.component.html',
  styleUrls: ['./Customer.component.scss']
})
export class CustomerComponent implements OnInit {

  constructor(
    public SvDefault: DefaultService,
    private _svShare: SharedService,
    private _svCustomer: CustomerService,
    private _route: ActivatedRoute,
    private authGuard: AuthGuard,
    private reportService: ReportService,
  ) { }

  @ViewChild('UploadLicensePlate')
  UploadLicensePlate: ElementRef<HTMLInputElement>;

  public Customer = new ModelMasCustomer2();
  public ArrCar: ModelMasCustomerCar2[] = [];
  public ArrCarFilter: ModelMasCustomerCar2[] = [];
  public HiddenButton = new ModelHiddenButton();
  public SearchLicensePlate = "";
  isPdf: string = "";
  isExcel: string = "";


  private authPositionRole: any = null;

  async ngOnInit() {
    await this.SvDefault.DoActionAsync(async () => await this.start(), true);
  }

  private async start() {
    if (!this.SvDefault.CheckSession()) {
      return;
    }
    this.authPositionRole = this.SvDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }

    this.reportService.findReportConfig("ReportMasCustomer")
      .subscribe((data: ExportData<ReportConfig>) => {
        this.isPdf = data.Data['IsPdf'];
        this.isExcel = data.Data['IsExcel'];
      },
        error => {
          Swal.fire({
            allowEscapeKey: false,
            allowOutsideClick: false,
            title: "<span class='text-danger'>เกิดข้อผิดพลาด!</span>",
            text: error.message,
          })
        }
      );

    let strGuid: string = "";
    strGuid = this.SvDefault.GetString(this._route.snapshot.params.DocGuid);
    if (strGuid === "New") {
      this.newData();
    } else {
      let cus = await this._svCustomer.GetCustomer(strGuid);
      this.displayData(cus);
    }
  }

  private newData() {
    let strCompCode = this.SvDefault.GetString(this._svShare.compCode);
    let strBrnCode = this.SvDefault.GetString(this._svShare.brnCode);
    this.Customer.CompCode = strCompCode;
    this.Customer.BrnCode = strBrnCode;
    this.Customer.CreatedBy = this.SvDefault.GetString(this._svShare.user);
    this.Customer.UpdatedBy = this.Customer.CreatedBy;
    this.Customer.CustStatus = "New";
    this.HiddenButton = this.SvDefault.GetHiddenButton2("New", "N");
  }

  public NewData() {
    this.SvDefault.DoAction(() => this.newData());
  }

  private displayData(param: ModelCustomer) {
    if (param == null) {
      return;
    }
    this.Customer = param.Customer;
    this.ArrCar = param.ArrCustomerCar;
    this.ArrCarFilter = [...this.ArrCar];
    this.HiddenButton = this.SvDefault.GetHiddenButton2(this.Customer.CustStatus, "N");
  }

  public async UpdateStatus(pStrStatus: string) {
    await this.SvDefault.DoActionAsync(async () => await this.updateStatus(pStrStatus), true);
  }

  private async updateStatus(pStrStatus: string) {
    pStrStatus = this.SvDefault.GetString(pStrStatus);

    // if (pStrStatus === "Cancel" && !this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isCancel")) {
    if (pStrStatus === "Cancel" && !await this.SvDefault.ShowCancelDialogAsync()) {
      return;
    }
    if (pStrStatus === "Cancel") {
      if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isCancel")) {
        this.SvDefault.ShowPositionRoleMessage("IsCancel");
        return;
      }
      if (!await this.SvDefault.ShowCancelDialogAsync()) {
        return;
      }
    }

    this.adjustData();
    if (!this.validateData()) {
      return;
    }
    let cus = new ModelMasCustomer2();
    this.SvDefault.CopyObject(this.Customer, cus);
    cus.CustStatus = pStrStatus;
    cus = await this._svCustomer.UpdateStatus(cus);
    if (cus == null) {
      return;
    }
    this.Customer = cus;
    this.HiddenButton = this.SvDefault.GetHiddenButton2(pStrStatus, "N");
    await this.SvDefault.ShowSaveCompleteDialogAsync();
  }

  private adjustData() {
    let strCustCode = "";
    if (this.Customer != null) {
      let arrExceptCol = ["CreditLimit", "CreditTerm", "Guid", "CreatedDate", "UpdatedDate"];
      for (const key in this.Customer) {
        if (arrExceptCol.includes(key) || !Object.prototype.hasOwnProperty.call(this.Customer, key)) {
          continue;
        }
        this.Customer[key] = this.SvDefault.GetString(this.Customer[key]);
      }
      strCustCode = this.Customer.CustCode;
    }
    if (this.SvDefault.IsArray(this.ArrCar)) {
      this.ArrCar = this.ArrCar.filter(x => x != null);
    }
    if (this.SvDefault.IsArray(this.ArrCar)) {
      let arrCarExceptCol = ["CustCode", "CreatedDate", "UpdatedDate"];
      for (let i = 0; i < this.ArrCar.length; i++) {
        let car = this.ArrCar[i];
        car.CustCode = strCustCode;
        for (const key in car) {
          if (arrCarExceptCol.includes(key) || !Object.prototype.hasOwnProperty.call(car, key)) {
            continue;
          }
          car[key] = this.SvDefault.GetString(car[key]);
        }
      }
    }
  }

  private validateData() {
    let strCuscode = this.SvDefault.GetString(this.Customer?.CustCode);
    if (strCuscode === "") {
      Swal.fire("", "รหัสลูกค้าห้ามมีค่าว่าง", "warning");
      return false;
    }
    this.Customer.CustCode = strCuscode;
    let strCusName = this.SvDefault.GetString(this.Customer?.CustName);
    if (strCusName === "") {
      Swal.fire("", "ชื่อลูกค้าห้ามมีค่าว่าง", "warning");
      return false;
    }
    this.Customer.CustName = strCusName;
    if (this.SvDefault.IsArray(this.ArrCar)) {
      for (let i = 0; i < this.ArrCar.length; i++) {
        let car = this.ArrCar[i];
        car.LicensePlate = this.SvDefault.GetString(car.LicensePlate);
        if (car.LicensePlate === "") {
          Swal.fire("", "ทะเบียนรถห้ามมีค่าว่าง", "warning");
          return false;
        }
      }
      for (let i = 0; i < this.ArrCar.length; i++) {
        let carI = this.ArrCar[i];
        for (let j = i + 1; j < this.ArrCar.length; j++) {
          let carJ = this.ArrCar[j];
          if (carI.LicensePlate === carJ.LicensePlate) {
            Swal.fire("", `ทะเบียนรถ ${carI.LicensePlate} ซ้ำกัน`, "warning");
            return false;
          }
        }
      }
    }

    return true;
  }

  public async SaveData() {
    await this.SvDefault.DoActionAsync(async () => await this.saveData(), true);
  }

  private async saveData() {
    this.adjustData();
    if (!this.validateData()) {
      return;
    }
    let customer = this.cloneCustomerData();
    if (customer == null) {
      return;
    }
    if (customer.Customer.CustStatus === "New") {
      if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isCreate")) {
        this.SvDefault.ShowPositionRoleMessage("IsCreate");
        return;
      }
      let strCuscode = this.SvDefault.GetString(customer.Customer.CustCode);
      let isDuplicate = strCuscode !== "" && await this._svCustomer.CheckDuplicateCustCode(strCuscode);
      if (isDuplicate) {
        Swal.fire("", "รหัสลูกค้าซ้ำกัน", "warning");
        return;
      }
      customer.Customer.CustStatus = "Active";
      customer = await this._svCustomer.InsertCustomer(customer);

    } else {
      if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isEdit")) {
        this.SvDefault.ShowPositionRoleMessage("IsEdit");
        return;
      }
      customer = await this._svCustomer.UpdateCustomer(customer);
    }
    this.displayData(customer);
    await this.SvDefault.ShowSaveCompleteDialogAsync();
  }

  private cloneCustomerData() {
    let result = new ModelCustomer();
    if (this.Customer != null) {
      this.SvDefault.CopyObject(this.Customer, result.Customer);
    }
    if (this.SvDefault.IsArray(this.ArrCar)) {
      result.ArrCustomerCar = this.ArrCar.map(x => {
        let car = new ModelMasCustomerCar2();
        this.SvDefault.CopyObject(x, car);
        return car;
      });
    }
    return result;
  }

  public ShowModalReport(){
    if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isPrint")) {
      this.SvDefault.ShowPositionRoleMessage("IsPrint");
      return;
    }
  }

  public AddCar() {
    this.SvDefault.DoAction(() => this.addCar());
  }

  private addCar() {
    if (this.ArrCar == null) {
      this.ArrCar = [];
    }
    let isAddRow = true;
    for (let i = 0; i < this.ArrCar.length; i++) {
      let car = this.ArrCar[i];
      car.LicensePlate = this.SvDefault.GetString(car.LicensePlate);
      if (car.LicensePlate === "") {
        isAddRow = false;
      }
    }
    if (isAddRow) {
      //this.ArrCar.push(new ModelMasCustomerCar2());
      let car = new ModelMasCustomerCar2();
      car.CarStatus = "Active";
      car.CustCode = this.Customer.CustCode;
      this.ArrCar.push(car);
    }
    this.SearchLicensePlate = "";
    this.filterCar();
  }

  public FilterCar() {
    this.SvDefault.DoAction(() => this.filterCar());
  }

  private filterCar() {
    this.SearchLicensePlate = this.SvDefault.GetString(this.SearchLicensePlate);
    if (this.SearchLicensePlate === "") {
      this.ArrCarFilter = [...this.ArrCar];
      return;
    }
    this.ArrCarFilter = this.ArrCar.filter(x => {
      let strLicessePlate = this.SvDefault.GetString(x?.LicensePlate);
      if (strLicessePlate === "") {
        return false;
      }
      let searchIndex = strLicessePlate.indexOf(this.SearchLicensePlate);
      return searchIndex >= 0;
    });
  }

  public LoadFile(evt: any) {
    var files = evt?.target?.files;
    this.parseExcel(files[0]);
  }
  private parseExcel(file) {
    let reader = new FileReader();
    let that = this;
    reader.onload = async (e) => {
      await that.SvDefault.DoActionAsync(async () => await that.reader_Onload(e));
    }
    reader.onerror = function (ex) {
      let ex2 = that.SvDefault.GetModelException(ex);
      that.SvDefault.ShowExceptionDialog(ex2);
      console.log(ex);
    };

    reader.readAsBinaryString(file);
  }

  private async reader_Onload(e: ProgressEvent<FileReader>) {
    let data = e.target.result;
    let workbook = XLSX.read(data, {
      type: 'binary'
    });

    if (workbook == null || workbook.SheetNames.length === 0) {
      return;
    }
    let sheetName = workbook.SheetNames[0];
    let sheet = workbook.Sheets[sheetName];
    if (sheet == null) {
      return;
    }
    let rang = XLSX.utils.decode_range(sheet['!ref']);
    let intRowCount = this.SvDefault.GetNumber(rang?.e?.r, 0) + 1;

    this.ArrCar = this.ArrCar.map(x => {
      x.LicensePlate = this.SvDefault.GetString(x.LicensePlate);
      return x;
    }).filter(x => x.LicensePlate !== "");
    for (let j = 1; j <= intRowCount; j++) {
      let strLicensePlate = this.SvDefault.GetString(sheet["A" + j]?.v);
      if (this.ArrCar.some(x => x.LicensePlate === strLicensePlate)) {
        continue;
      }
      let car = new ModelMasCustomerCar2();
      car.CarStatus = "Active";
      car.LicensePlate = strLicensePlate;
      car.CustCode = this.Customer.CustCode;
      this.ArrCar.push(car);
    }
    this.SearchLicensePlate = "";
    this.filterCar();
    this.UploadLicensePlate.nativeElement.value = "";
  }

  public RemoveCar(param: ModelMasCustomerCar2) {
    this.SvDefault.DoAction(() => this.removeCar(param));
  }

  private removeCar(param: ModelMasCustomerCar2) {
    if (param == null) {
      return;
    }
    this.ArrCar = this.ArrCar.filter(x => x.LicensePlate !== param.LicensePlate);
    this.ArrCarFilter = this.ArrCarFilter.filter(x => x != param);
  }

  async exportExcel() {
    if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isPrint")) {
      this.SvDefault.ShowPositionRoleMessage("IsPrint");
      return;
    }
    await this.SvDefault.DoActionAsync(async () => await this.ExportExcel(), true);
  }

  private async ExportExcel() {
    await this.reportService.getReportMasCustomerExcel(this.Customer.CustCode);
  }
}
