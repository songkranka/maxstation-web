import { Component, Inject, Optional, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import swal from 'sweetalert2';
import { ProductData, ReportService } from 'src/app/service/report-service/report-service';
import { Product } from 'src/app/model/report/master/product.interface';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SharedService } from '../../../../../../shared/shared.service';


interface TableData {
  productId: string;
  productName: string;
}

export interface ProductDialogData {
  productId: string;
  productName: string;
}

@Component({
  selector: 'app-modal-product',
  templateUrl: './modal-product.component.html',
  styleUrls: ['./modal-product.component.scss']
})
export class ModalReportStockProductComponent implements OnInit, AfterViewInit {
  filterValue: string = null;
  dataSource = new MatTableDataSource<TableData>();
  pageEvent: PageEvent;
  displayedColumns: string[] = ['no', 'productId', 'productName'];
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
    public dialogRef: MatDialogRef<ModalReportStockProductComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: ProductDialogData) {
    this.local_data = { ...data };
  }

  ngOnInit(): void {
    this.initDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  initDataSource() {
    this.reportService.findAllMasProduct(this.filterValue, 1, this.pageSize)
      .subscribe((page: ProductData<Product>) => {
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
    this.reportService.findAllMasProduct(value, 1, this.pageSize)
      .subscribe((page: ProductData<Product>) => {
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

      this.reportService.findAllMasProduct(this.filterValue, page, size)
        .subscribe((page: ProductData<Product>) => {
          this.dataSource.data = this.toTableData(page.items);
          this.length = page.totalItems;
        })
    } else {
      this.reportService.findAllMasProduct(this.filterValue, page, size)
        .subscribe((page: ProductData<Product>) => {
          this.dataSource.data = this.toTableData(page.items);
          this.length = page.totalItems;
        })
    }
  }

  navigateToProfile(productId: string, productName: string) {
    this.dialogRef.close({ productId: productId, productName: productName });
  }

  closeDialog() {
    this.dialogRef.close();
  }

  private toTableData(products: Product[]): TableData[] {
    return products.map(p => {
      return {
        productId: p.pdId,
        productName: p.pdName,
      };
    });
  }
}
