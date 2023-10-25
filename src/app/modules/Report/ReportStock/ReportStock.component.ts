import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { DefaultService } from 'src/app/service/default.service';
import { FormControl, FormGroup } from '@angular/forms';
import { ReportService } from 'src/app/service/report-service/report-service';
import { MatDialog } from '@angular/material/dialog';
import { ModalReportStockProductComponent } from './Modal/Product/modal-product/modal-product.component';
import { ModalReportStockProductGroupComponent } from './Modal/Product/modal-product-group/modal-product-group.component';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { ModalReportComponent } from '../Modal/modal-report/modal-report.component';

import * as _moment from 'moment';
const moment = _moment || _moment;
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepicker } from '@angular/material/datepicker';
import Swal from 'sweetalert2';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

//==================== Model ====================
//*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z

@Component({
  selector: 'app-ReportStock',
  templateUrl: './ReportStock.component.html',
  styleUrls: ['./ReportStock.component.scss'],
  providers: [
    // `MomentDateAdapter` can be automatically provided by importing `MomentDateModule` in your
    // application's root module. We provide it at the component level here, due to limitations of
    // our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})


export class ReportStockComponent implements OnInit {
  myGroup: FormGroup;
  headerCard = "รายงานสรุปการเคลื่อนไหวสินค้า"
  compCode = this.sharedService.compCode;
  brnCode = this.sharedService.brnCode;
  docDate = this.defaultService.GetFormatDate(this.sharedService.systemDate);
  private reportUrl: string = "";
  private reportName: string = "";
  isPdf: string = "";
  isExcel: string = "";
  excelUrl: string = "";
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  date = new FormControl(moment());
  hiddenFormControl: boolean = true;
  parameterMonthly: any;
  parameterDaily: any;
  parameterBranchType: any;
  parameterUnit: any;
  parameterReportType: any;
  parameterDate: any;
  private authPositionRole: any;
  constructor(
    private sharedService: SharedService,
    private defaultService: DefaultService,
    private reportService: ReportService,
    public dialog: MatDialog,
    private authGuard: AuthGuard,
  ) { }

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  setMonthAndYear(
    normalizedMonthAndYear: _moment.Moment,
    datepicker: MatDatepicker<_moment.Moment>
  ) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  async ngOnInit(): Promise<void> {
    await this.defaultService.DoActionAsync(async () => await this.start(), true);
  }

  private async start() {
    if (!this.defaultService.CheckSession()) {
      return;
    }
    this.authPositionRole = this.defaultService.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }
    let dateStart = new Date(new Date(this.sharedService.systemDate).setDate(new Date(this.sharedService.systemDate).getDate() - 1));
    let dateEnd = new Date(this.sharedService.systemDate);
    this.dateRange.get('start').setValue(dateStart);
    this.dateRange.get('end').setValue(dateEnd);
    this.myGroup = new FormGroup({
      reportGroup: new FormControl(),
      productIdStart: new FormControl(),
      productIdEnd: new FormControl(),
      productGroupIdStart: new FormControl(),
      productGroupIdEnd: new FormControl(),
    });
  }

  ShowModalReportGroup() {
    const dialogRef = this.dialog.open(ModalReportComponent, {
      width: '600px',
      data: { reportGroup: "ReportStock" }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.myGroup.controls['reportGroup'].setValue(result.reportName);
      this.reportUrl = result.reportUrl;
      this.reportName = result.reportName;
      this.isPdf = result.isPdf;
      this.isExcel = result.isExcel;
      this.excelUrl = result.excelUrl;
      this.hiddenFormControl = false;
      let jsonData = JSON.parse(result.parameterType)
      this.parameterMonthly = jsonData.Parameter.find((x: string) => x == 'Monthly');
      this.parameterDaily = jsonData.Parameter.find((x: string) => x == 'Daily');
      this.parameterBranchType = jsonData.Parameter.find((x: string) => x == 'Branch');
      this.parameterUnit = jsonData.Parameter.find((x: string) => x == 'Unit');
      this.parameterReportType = jsonData.Parameter.find((x: string) => x == 'ReportType');
      this.parameterDate = jsonData.Parameter.find((x: string) => x == 'Date');
    });
  }

  async exportPDF() {
    await this.defaultService.DoActionAsync(async () => await this.ExportPDF(), true);
  }

  private async ExportPDF() {
    if (!this.defaultService.ValidateAuthPositionRole(this.authPositionRole, "isPrint")) {
      this.defaultService.ShowPositionRoleMessage("IsPrint");
      return;
    }
    var productIdStart = this.myGroup.get('productIdStart').value;
    var productIdEnd = this.myGroup.get('productIdEnd').value;
    var productGroupIdStart = this.myGroup.get('productGroupIdStart').value;
    var productGroupIdEnd = this.myGroup.get('productGroupIdEnd').value;
    var dateStart: string = "";
    var dateEnd: string = "";

    if (this.parameterMonthly !== undefined && this.parameterMonthly != null) {
      const monthSelect = this.defaultService.GetFormatDate(this.date.value)
      const monthSelectDate = new Date(monthSelect);
      const firstDay = new Date(monthSelectDate.getFullYear(), monthSelectDate.getMonth(), 1);
      const lastDay = new Date(monthSelectDate.getFullYear(), monthSelectDate.getMonth() + 1, 0);
      dateStart = this.defaultService.GetFormatDate(firstDay);
      dateEnd = this.defaultService.GetFormatDate(lastDay);
    }
    else if(this.parameterDate === "Date")
    {
      dateStart = this.defaultService.GetFormatDate(this.date.value);
      dateEnd = this.defaultService.GetFormatDate(this.date.value);
    }
    else if(this.parameterDaily !== undefined && this.parameterDaily != null) {
      dateStart = this.defaultService.GetFormatDate(this.dateRange?.value?.start);
      dateEnd = this.defaultService.GetFormatDate(this.dateRange?.value?.end);
    }

    await this.reportService.getReportStockPDF(this.compCode, this.brnCode, dateStart, dateEnd, productIdStart, productIdEnd, productGroupIdStart, productGroupIdEnd, this.reportUrl, this.reportName);
  }

  async exportExcel() {
    await this.defaultService.DoActionAsync(async () => await this.ExportExcel(), true);
  }

  private async ExportExcel() {
    if (!this.defaultService.ValidateAuthPositionRole(this.authPositionRole, "isPrint")) {
      this.defaultService.ShowPositionRoleMessage("IsPrint");
      return;
    }
    var productIdStart = this.myGroup.get('productIdStart').value;
    var productIdEnd = this.myGroup.get('productIdEnd').value;
    var productGroupIdStart = this.myGroup.get('productGroupIdStart').value;
    var productGroupIdEnd = this.myGroup.get('productGroupIdEnd').value;
    var dateStart: string = "";
    var dateEnd: string = "";

    if (this.parameterMonthly !== undefined && this.parameterMonthly != null) {
      const monthSelect = this.defaultService.GetFormatDate(this.date.value)
      const monthSelectDate = new Date(monthSelect);
      const firstDay = new Date(monthSelectDate.getFullYear(), monthSelectDate.getMonth(), 1);
      const lastDay = new Date(monthSelectDate.getFullYear(), monthSelectDate.getMonth() + 1, 0);
      dateStart = this.defaultService.GetFormatDate(firstDay);
      dateEnd = this.defaultService.GetFormatDate(lastDay);

    }
    else if(this.parameterDate === "Date")
    {
      dateStart = this.defaultService.GetFormatDate(this.date.value);
      dateEnd = this.defaultService.GetFormatDate(this.date.value);
    }
    else if(this.parameterDaily !== undefined && this.parameterDaily != null) {
      dateStart = this.defaultService.GetFormatDate(this.dateRange?.value?.start);
      dateEnd = this.defaultService.GetFormatDate(this.dateRange?.value?.end);
    }

    Swal.fire({
      title: 'กำลังโหลดข้อมูล กรุณารอสักครู่',
      allowEscapeKey: false,
      allowOutsideClick: false,
    });
    Swal.showLoading();
    await this.reportService.getReportStockExcel(this.compCode, this.brnCode, dateStart, dateEnd, productIdStart, productIdEnd, productGroupIdStart, productGroupIdEnd,  this.excelUrl, this.reportName);
  }

  changeDate = async (event: any) => {
    this.docDate = this.defaultService.GetFormatDate(event.value);
  }

  ShowModalProductStart() {
    const dialogRef = this.dialog.open(ModalReportStockProductComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.myGroup.controls['productIdStart'].setValue(result.productId);
    });
  }

  ShowModalProductEnd() {
    const dialogRef = this.dialog.open(ModalReportStockProductComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.myGroup.controls['productIdEnd'].setValue(result.productId);
    });
  }

  ShowModalProductGroupStart() {
    const dialogRef = this.dialog.open(ModalReportStockProductGroupComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.myGroup.controls['productGroupIdStart'].setValue(result.groupId);
    });
  }

  ShowModalProductGroupEnd() {
    const dialogRef = this.dialog.open(ModalReportStockProductGroupComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.myGroup.controls['productGroupIdEnd'].setValue(result.groupId);
    });
  }
}
