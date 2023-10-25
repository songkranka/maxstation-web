import { AfterViewInit, Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Customer } from 'src/app/model/report/master/customer.interface';
import { CustomerData, ReportService } from 'src/app/service/report-service/report-service';
import { SharedService } from 'src/app/shared/shared.service';
import swal from 'sweetalert2';

interface TableData {
  custCode: string;
  custName: string;
}

export interface CustomerDialogData {
  custCode: string;
  custName: string;
}

@Component({
  selector: 'app-modal-customer',
  templateUrl: './modal-customer.component.html',
  styleUrls: ['./modal-customer.component.scss']
})
export class ModalCustomerComponent implements OnInit, AfterViewInit {
  filterValue: string = null;
  dataSource = new MatTableDataSource<TableData>();
  pageEvent: PageEvent;
  displayedColumns: string[] = ['no', 'custCode', 'custName'];
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
    public dialogRef: MatDialogRef<ModalCustomerComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: CustomerDialogData) {
    this.local_data = { ...data }; 
  }

  ngOnInit(): void {
    this.initDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  initDataSource() {
    this.reportService.findAllMasCustomer(this.filterValue, 1, this.pageSize)
      .subscribe((page: CustomerData<Customer>) => {
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
    this.reportService.findAllMasCustomer(value, 1, this.pageSize)
      .subscribe((page: CustomerData<Customer>) => {
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

      this.reportService.findAllMasCustomer(this.filterValue, page, size)
        .subscribe((page: CustomerData<Customer>) => {
          this.dataSource.data = this.toTableData(page.items);
          this.length = page.totalItems;
        })
    } else {
      this.reportService.findAllMasCustomer(this.filterValue, page, size)
        .subscribe((page: CustomerData<Customer>) => {
          this.dataSource.data = this.toTableData(page.items);
          this.length = page.totalItems;
        })
    }
  }

  navigateToProfile(custCode: string, custName: string) {
    this.dialogRef.close({ custCode: custCode, custName: custName });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  private toTableData(customers: Customer[]): TableData[] {
    return customers.map(p => {
      return {
        custCode: p.custCode,
        custName: p.custName,
      };
    });
  }
}
