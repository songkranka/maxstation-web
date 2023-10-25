import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { DefaultService } from 'src/app/service/default.service';
import { ReportService } from 'src/app/service/report-service/report-service';
import { SharedService } from 'src/app/shared/shared.service';
import * as _moment from 'moment';
import { MatDatepicker } from '@angular/material/datepicker';
import { ModalReportComponent } from '../Modal/modal-report/modal-report.component';
import { ModalCustomerComponent } from '../Modal/modal-customer/modal-customer.component';
import Swal from 'sweetalert2';
const moment = _moment || _moment;

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

@Component({
  selector: 'app-report-customer',
  templateUrl: './report-customer.component.html',
  styleUrls: ['./report-customer.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  encapsulation: ViewEncapsulation.None,
})

export class ReportCustomerComponent implements OnInit {
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  date = new FormControl(moment());
  myGroup: FormGroup;
  headerCard = "รายงานลูกหนี้";
  isPdf: string = "";
  isExcel: string = "";
  private reportUrl: string = "";
  private reportName: string = "";
  excelUrl: string = "";
  hiddenFormControl: boolean = true;
  private authPositionRole: any;
  selectedStatus: number ;
  public toggleForm:boolean;
  parameterMonthly: any;
  parameterDaily: any;
  parameterBranchType: any;
  parameterUnit: any;
  parameterReportType: any;

  constructor(
    public dialog: MatDialog,
    private sharedService: SharedService,
    private defaultService: DefaultService,
    private reportService: ReportService,
    private authGuard: AuthGuard,
  ) { }

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  ngOnInit(): void {
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
      customerIdStart: new FormControl(),
      customerIdEnd: new FormControl(),
      statusOption: new FormControl()
    });
    this.selectedStatus = 0;
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

  ShowModalReportGroup() {
    const dialogRef = this.dialog.open(ModalReportComponent, {
      width: '600px',
      data: { reportGroup: "ReportCustomer" }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.myGroup.controls['reportGroup'].setValue(result.reportName);
      this.reportUrl = result.reportUrl;
      this.reportName = result.reportName;
      this.isPdf = result.isPdf;
      this.isExcel = result.isExcel;
      this.excelUrl = result.excelUrl;
      this.hiddenFormControl = false;
      let jsonData = JSON.parse(result.parameterType);
      this.parameterMonthly = jsonData.Parameter.find((x: string) => x == 'Monthly');
      this.parameterDaily = jsonData.Parameter.find((x: string) => x == 'Daily');
      this.parameterBranchType = jsonData.Parameter.find((x: string) => x == 'Branch');
      this.parameterUnit = jsonData.Parameter.find((x: string) => x == 'Unit');
      this.parameterReportType = jsonData.Parameter.find((x: string) => x == 'ReportType');
    });
  }

  ShowModalCustomerStart() {
    const dialogRef = this.dialog.open(ModalCustomerComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.myGroup.controls['customerIdStart'].setValue(result.custCode);
    });
  }

  ShowModalCustomerEnd() {
    const dialogRef = this.dialog.open(ModalCustomerComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe(result => {
      this.myGroup.controls['customerIdEnd'].setValue(result.custCode);
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
    var dateStart: string = "";
    var dateEnd: string = "";
    var customerIdStart = this.myGroup.get('customerIdStart').value;
    var customerEnd = this.myGroup.get('customerIdEnd').value;

    if (this.parameterMonthly !== undefined && this.parameterMonthly != null) {
      const monthSelect = this.defaultService.GetFormatDate(this.date.value)
      const monthSelectDate = new Date(monthSelect);
      const firstDay = new Date(monthSelectDate.getFullYear(), monthSelectDate.getMonth(), 1);
      const lastDay = new Date(monthSelectDate.getFullYear(), monthSelectDate.getMonth() + 1, 0);
      dateStart = this.defaultService.GetFormatDate(firstDay);
      dateEnd = this.defaultService.GetFormatDate(lastDay);
    }
    else if (this.parameterDaily !== undefined && this.parameterDaily != null) {
      dateStart = this.defaultService.GetFormatDate(this.dateRange?.value?.start);
      dateEnd = this.defaultService.GetFormatDate(this.dateRange?.value?.end);
    }
    Swal.fire({
      title: 'กำลังโหลดข้อมูล กรุณารอสักครู่',
      allowEscapeKey: false,
      allowOutsideClick: false,
    });
    Swal.showLoading();
    await this.reportService.GetReportCustomerPDF(this.sharedService.compCode, this.sharedService.brnCode, dateStart, dateEnd, customerIdStart, customerEnd, this.selectedStatus, this.reportUrl, this.reportName);
  }

  async exportExcel() {
    await this.defaultService.DoActionAsync(async () => await this.ExportExcel(), true);
  }

  private async ExportExcel() {
    if (!this.defaultService.ValidateAuthPositionRole(this.authPositionRole, "isPrint")) {
      this.defaultService.ShowPositionRoleMessage("IsPrint");
      return;
    }
    var dateStart: string = "";
    var dateEnd: string = "";
    var customerIdStart = this.myGroup.get('customerIdStart').value;
    var customerEnd = this.myGroup.get('customerIdEnd').value;

    if (this.parameterMonthly !== undefined && this.parameterMonthly != null) {
      const monthSelect = this.defaultService.GetFormatDate(this.date.value)
      const monthSelectDate = new Date(monthSelect);
      const firstDay = new Date(monthSelectDate.getFullYear(), monthSelectDate.getMonth(), 1);
      const lastDay = new Date(monthSelectDate.getFullYear(), monthSelectDate.getMonth() + 1, 0);
      dateStart = this.defaultService.GetFormatDate(firstDay);
      dateEnd = this.defaultService.GetFormatDate(lastDay);
    }
    else if (this.parameterDaily !== undefined && this.parameterDaily != null) {
      dateStart = this.defaultService.GetFormatDate(this.dateRange?.value?.start);
      dateEnd = this.defaultService.GetFormatDate(this.dateRange?.value?.end);
    }
    Swal.fire({
      title: 'กำลังโหลดข้อมูล กรุณารอสักครู่',
      allowEscapeKey: false,
      allowOutsideClick: false,
    });
    Swal.showLoading();
    await this.reportService.GetReportCustomerExcel(this.sharedService.compCode, this.sharedService.brnCode, dateStart, dateEnd, customerIdStart, customerEnd,  this.selectedStatus, this.excelUrl, this.reportName);
  }
}
