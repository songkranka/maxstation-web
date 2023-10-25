import { Component, Inject, Optional, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import swal from 'sweetalert2';
import { ProductGroupData, ReportService } from 'src/app/service/report-service/report-service';
import { ProductGroup } from 'src/app/model/report/master/productgroup.interface';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SharedService } from '../../../../../../shared/shared.service';

interface TableData {
  groupId: string;
  groupName: string;
}

export interface ProductGroupDialogData {
  groupId: string;
  groupName: string;
}

@Component({
  selector: 'app-modal-product-group',
  templateUrl: './modal-product-group.component.html',
  styleUrls: ['./modal-product-group.component.scss']
})
export class ModalReportStockProductGroupComponent implements OnInit, AfterViewInit {
  filterValue: string = null;
  dataSource = new MatTableDataSource<TableData>();
  pageEvent: PageEvent;
  displayedColumns: string[] = ['no', 'groupId', 'groupName'];
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
    public dialogRef: MatDialogRef<ModalReportStockProductGroupComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ProductGroupDialogData) {
    this.local_data = { ...data };
  }

  ngOnInit(): void {
    this.initDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  initDataSource() {
    this.reportService.findAllMasProductGroup(this.filterValue, 1, this.pageSize)
      .subscribe((page: ProductGroupData<ProductGroup>) => {
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
    this.reportService.findAllMasProductGroup(value, 1, this.pageSize)
      .subscribe((page: ProductGroupData<ProductGroup>) => {
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

      this.reportService.findAllMasProductGroup(this.filterValue, page, size)
        .subscribe((page: ProductGroupData<ProductGroup>) => {
          this.dataSource.data = this.toTableData(page.items);
          this.length = page.totalItems;
        })
    } else {
      this.reportService.findAllMasProductGroup(this.filterValue, page, size)
        .subscribe((page: ProductGroupData<ProductGroup>) => {
          this.dataSource.data = this.toTableData(page.items);
          this.length = page.totalItems;
        })
    }
  }

  navigateToProfile(groupId: string, groupName: string) {
    this.dialogRef.close({ groupId: groupId, groupName: groupName });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  private toTableData(productgroups: ProductGroup[]): TableData[] {
    return productgroups.map(p => {
      return {
        groupId: p.groupId,
        groupName: p.groupName,
      };
    });
  }

}
