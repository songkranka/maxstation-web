import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import swal from 'sweetalert2';
import { DefaultService } from 'src/app/service/default.service';
import { MasterService } from 'src/app/service/master-service/master.service';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { FormControl, FormGroup } from '@angular/forms';
import { ExportData, ReportService } from 'src/app/service/report-service/report-service';
import { ReportConfig } from 'src/app/model/report/master/reportconfig.interface';
import { AuthGuard } from 'src/app/guards/auth-guard.service';

//==================== Model ====================
//*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z

@Component({
  selector: 'app-ReportSummarySale',
  templateUrl: './ReportSummarySale.component.html',
  styleUrls: ['./ReportSummarySale.component.scss']
})


export class ReportSummarySaleComponent implements OnInit {

  headerCard = "รายงานสรุปการขายประจำวัน"
  listPeriod = [];
  periodNo = 0;

  btnPrint = true;
  btnExcel = true;
  isPdf: string = "";
  isExcel: string = "";

  compCode = this.sharedService.compCode;
  brnCode = this.sharedService.brnCode;
  docDate = this.defaultService.GetFormatDate(this.sharedService.systemDate);
  private authPositionRole: any;

  //==================== constructor ====================
  //*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z

  constructor(
    private sharedService: SharedService,
    private defaultService: DefaultService,
    private reportService: ReportService,
    private authGuard: AuthGuard,
  ) { }

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  async ngOnInit(): Promise<void> {
    this.authPositionRole = this.defaultService.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }
    await this.defaultService.DoActionAsync(async () => await this.start(), true);
  }

  private async start() {
    if (!this.defaultService.CheckSession()) {
      return;
    }

    this.reportService.findReportConfig("ReportSummarySale")
      .subscribe((data: ExportData<ReportConfig>) => {
        this.isPdf = data.Data['IsPdf'];
        this.isExcel = data.Data['IsExcel'];
      },
        error => {
          swal.fire({
            allowEscapeKey: false,
            allowOutsideClick: false,
            title: "<span class='text-danger'>เกิดข้อผิดพลาด!</span>",
            text: error.message,
          })
        }
      );

    this.getPeriod();
  }

  private async getPeriod() {
    this.listPeriod = await this.reportService.getPeriodReportSummarySaleExcel(this.compCode, this.brnCode, this.docDate);
    if (this.listPeriod.length <= 0) {
      // swal.fire({
      //   allowEscapeKey: false,
      //   allowOutsideClick: false,
      //   icon: 'warning',
      //   title: 'ไม่พบข้อมูลกะ',
      // })
      //   .then(async () => {
      //     this.btnPrint = true;
      //     this.btnExcel = true;
      //   });
      this.btnPrint = true;
      this.btnExcel = true;
    } else {
      this.btnPrint = false;
      this.btnExcel = false;
    }
  }

  async exportPDF() {
    await this.defaultService.DoActionAsync(async () => await this.ExportPDF(), true);
  }

  private async ExportPDF() {
    if (!this.defaultService.ValidateAuthPositionRole(this.authPositionRole, "isPrint")) {
      this.defaultService.ShowPositionRoleMessage("IsPrint");
      return;
    }
    await this.reportService.getReportSummarySalePDF(this.compCode, this.brnCode, this.docDate, +this.periodNo);
  }

  async exportExcel() {
    await this.defaultService.DoActionAsync(async () => await this.ExportExcel(), true);
  }

  private async ExportExcel() {
    if (!this.defaultService.ValidateAuthPositionRole(this.authPositionRole, "isPrint")) {
      this.defaultService.ShowPositionRoleMessage("IsPrint");
      return;
    }
    await this.reportService.getReportSummarySaleExcel(this.compCode, this.brnCode, this.docDate, +this.periodNo);
  }

  changeDate = async (event: any) => {
    this.docDate = this.defaultService.GetFormatDate(event.value);
    await this.defaultService.DoActionAsync(async () => await this.getPeriod(), true);
  }
}
