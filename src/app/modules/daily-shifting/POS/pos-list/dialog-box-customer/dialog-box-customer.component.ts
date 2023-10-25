import { Component, Inject, Optional, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import swal from 'sweetalert2';
import { SharedService } from '../../../../../shared/shared.service';
import { CustomerData, CustomerService } from 'src/app/service/customer-service/customer-service';
import { Customer } from 'src/app/model/master/customer.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';

interface TableData {
    custCode: string;
    custName: string;
}

export interface CustomerDialogData {
    custCode: number;
    custName: string;
}

@Component({
    selector: 'app-dialog-box-customer',
    templateUrl: 'dialog-box-customer.component.html',
    styleUrls: ['dialog-box-customer.component.scss']
})
export class DialogBoxCustomerComponent implements OnInit, AfterViewInit {
    filterValue: string = null;

    dataSource = new MatTableDataSource<TableData>();
    pageEvent: PageEvent;
    displayedColumns: string[] = ['no', 'custcode', 'custname'];
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
        private customerService: CustomerService,

        public dialogRef: MatDialogRef<DialogBoxCustomerComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: CustomerDialogData) {
        this.local_data = { ...data };
        // this.action = this.local_data.action;
    }

    ngOnInit(): void {
        this.initDataSource();
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
    }

    initDataSource() {
        this.customerService.findAll(this.filterValue, 1, this.pageSize)
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
        this.customerService.findAll(value, 1, this.pageSize)
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

            this.customerService.findAll(this.filterValue, page, size)
                .subscribe((page: CustomerData<Customer>) => {
                    this.dataSource.data = this.toTableData(page.items);
                    this.length = page.totalItems;
                })
        } else {
            this.customerService.findAll(this.filterValue, page, size)
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
        return customers.map(c => {
            return {
                custCode: c.custCode,
                custName: c.custName,
            };
        });
    }
}