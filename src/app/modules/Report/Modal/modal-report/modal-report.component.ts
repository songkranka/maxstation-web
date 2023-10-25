import { Component, OnInit, ViewChild, AfterViewInit, Inject, Optional } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ExportData, ReportService } from 'src/app/service/report-service/report-service';
import { SharedService } from 'src/app/shared/shared.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReportConfig } from 'src/app/model/report/master/reportconfig.interface';
import swal from 'sweetalert2';

interface TableData {
  seqNo: number;
  reportName: string;
  reportUrl: string;
}

export interface ReportDialogData {
  seqNo: number;
  reportName: string;
  reportUrl: string;
}

@Component({
  selector: 'app-modal-report',
  templateUrl: './modal-report.component.html',
  styleUrls: ['./modal-report.component.scss']
})
export class ModalReportComponent implements OnInit, AfterViewInit {
  filterValue: string = null;
  dataSource = new MatTableDataSource<TableData>();
  pageEvent: PageEvent;
  displayedColumns: string[] = ['no', 'reportName'];
  no = 0;
  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  urlMas = this.sharedService.urlMas;
  action: string;
  local_data: any;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private sharedService: SharedService,
    private reportService: ReportService,
    public dialogRef: MatDialogRef<ModalReportComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ReportDialogData) {
    this.local_data = { ...data };
  }

  ngOnInit(): void {
    this.initDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  initDataSource() {
    this.reportService.findReportConfigByGroup(this.local_data.reportGroup, this.filterValue, 1, this.pageSize)
      .subscribe((page: ExportData<ReportConfig>) => {
        this.dataSource.data = this.toTableData(page.items);
        this.length = page.totalItems;
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

  findByValue(value: string) {
    this.reportService.findReportConfigByGroup(this.local_data.reportGroup, value, 1, this.pageSize)
      .subscribe((page: ExportData<ReportConfig>) => {
        this.dataSource.data = this.toTableData(page.items);
        this.length = page.totalItems;
      });
  }

  onPaginateChange(event: PageEvent) {
    this.no = event.pageIndex > 0 ? event.pageIndex * event.pageSize : 0;
    let page = event.pageIndex;
    let size = event.pageSize;

    if (this.filterValue == null) {
      page = page + 1;

      this.reportService.findReportConfigByGroup(this.local_data.reportGroup, this.filterValue, page, size)
        .subscribe((page: ExportData<ReportConfig>) => {
          this.dataSource.data = this.toTableData(page.items);
          this.length = page.totalItems;
        })
    } else {
      this.reportService.findReportConfigByGroup(this.local_data.reportGroup, this.filterValue, page, size)
        .subscribe((page: ExportData<ReportConfig>) => {
          this.dataSource.data = this.toTableData(page.items);
          this.length = page.totalItems;
        })
    }
  }

  navigateToProfile(reportName: string, reportUrl: string, parameterType: string, isPdf: string, isExcel: string, excelUrl: string) {
    this.dialogRef.close({reportName: reportName, reportUrl: reportUrl, parameterType: parameterType, isPdf, isExcel, excelUrl});
  }

  closeDialog() {
    this.dialogRef.close();
  }

  private toTableData(reportConfigs: ReportConfig[]): TableData[] {
    return reportConfigs.map(r => {
      return {
        seqNo: r.seqNo,
        reportName: r.reportName,
        reportUrl: r.reportUrl,
        parameterType: r.parameterType,
        isPdf: r.isPdf,
        isExcel: r.isExcel,
        excelUrl: r.excelUrl
      };
    });
  }

}
