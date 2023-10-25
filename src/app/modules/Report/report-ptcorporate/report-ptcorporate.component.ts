import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { ReportConfig } from 'src/app/model/report/master/reportconfig.interface';
import { DefaultService } from 'src/app/service/default.service';
import { ExportData, ReportService } from 'src/app/service/report-service/report-service';
import { SharedService } from 'src/app/shared/shared.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-report-ptcorporate',
  templateUrl: './report-ptcorporate.component.html',
  styleUrls: ['./report-ptcorporate.component.scss']
})
export class ReportPTCorporateComponent implements OnInit {
  urlSafe: SafeResourceUrl;
  headerCard = "รายงาน";
  urlsegment = "";
  private authPositionRole: any;

  constructor(private reportService: ReportService, public sanitizer: DomSanitizer, private datePipe: DatePipe, private sharedService: SharedService, private authGuard: AuthGuard, private defultService: DefaultService) { }

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  ngOnInit(): void {
    this.authPositionRole = this.defultService.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }
    this.reportService.findReportConfig("ReportPTCorporate")
      .subscribe((data: ExportData<ReportConfig>) => {
        // var userId = "100506";
        // var userName = "Admin";
        //https://mcc.pt.co.th/Page/Report/Rp_IssueDetailByStation.aspx?userId=100506&userName=Admin
        var resultUrl = data.Data['ReportUrl'];
        const url = new URL(resultUrl);
        const origin = url.origin;
        const partName = url.pathname;
        const params = new URLSearchParams(url.search);
        var userId = params.get('userId');
        var userName = params.get('userName');
        var siteCode = this.sharedService.brnCode.split('52').toString();
        var date_format = this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
        var base64UserId = btoa(userId);
        var base64UserName = btoa(userName);
        var base64SiteCode = btoa(siteCode);
        var base64TokenCode = btoa(date_format);
        this.urlsegment = origin + partName + `?userId=${base64UserId}&userName=${base64UserName}&siteCode=${base64SiteCode}&tokenCode=${base64TokenCode}`
        window.open(this.urlsegment, "_blank");
        // this.urlSafe= this.sanitizer.bypassSecurityTrustResourceUrl(urlsegment);
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
  }
}
