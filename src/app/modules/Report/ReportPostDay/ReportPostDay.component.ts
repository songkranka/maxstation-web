import { AfterViewInit, Component, OnInit } from '@angular/core';
import { start } from 'repl';
import { async } from 'rxjs/internal/scheduler/async';
import { DefaultService } from 'src/app/service/default.service';
import { ReportService } from 'src/app/service/report-service/report-service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-ReportPostDay',
  templateUrl: './ReportPostDay.component.html',
  styleUrls: ['./ReportPostDay.component.scss']
})
export class ReportPostDayComponent implements OnInit , AfterViewInit{
  headerCard : string = "";
  isPdf : string = "Y";
  isExcel : string = "Y";
  dataType : number = 0;
  docDate : string = this.defaultService.GetFormatDate(this.sharedService.systemDate);
  compCode = this.sharedService.compCode;
  private authPositionRole: any;
  constructor(
    private sharedService: SharedService,
    private defaultService: DefaultService,
    private reportService: ReportService
  ) {
    this.headerCard = "รายงานตรวจสอบข้อมูลปิดสิ้นวัน";
  }
  ngAfterViewInit(): void {
    //this.dataType = 2;
  }

  async ngOnInit() {
    await this.defaultService.DoActionAsync(async ()=>await this.start(),true);
  }

  private async start(){
    if (!this.defaultService.CheckSession()) {
      return;
    }
    this.authPositionRole = this.defaultService.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }
    let reportConfig = <any>await this.reportService.findReportConfig("ReportPostDay").toPromise();
    if(reportConfig && reportConfig.Data){
      this.isPdf = reportConfig.Data.IsPdf;
      this.isExcel = reportConfig.Data.IsExcel;
    }

  }

  public async exportPDF(){

  }

  public async exportExcel(){
    if (!this.defaultService.ValidateAuthPositionRole(this.authPositionRole, "isPrint")) {
      this.defaultService.ShowPositionRoleMessage("IsPrint");
      return;
    }
    this.defaultService.DoActionAsync(
      async()=> await this.reportService.getReportPostDayExcel(
        this.compCode,
        this.dataType,
        this.docDate
      ) ,
    true);
  }



  public async changeDate(pDatInput : any){
    this.docDate = this.defaultService.GetFormatDate(pDatInput.value);
  }
}
