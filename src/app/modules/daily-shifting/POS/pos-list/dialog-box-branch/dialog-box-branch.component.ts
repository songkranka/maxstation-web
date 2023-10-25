import { Component, Inject, Optional, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import swal from 'sweetalert2';
import { SharedService } from '../../../../../shared/shared.service';
import { MasterDatas, MasterService } from 'src/app/service/master-service/master.service';
// import { Customer } from 'src/app/model/master/customer.interface';
import { CostCenter } from 'src/app/model/master/costcenter.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';

interface TableData {
    brnCode: string,
    brnName: string,
    brnStatus: string,
    compCode: string,
    costCenter: string,
    createdBy: string,
    createdDate: string,
    mapBrnCode: string,
    profitCenter: string,
    updatedBy: string,
    updatedDate: string,
}

export interface CustomerDialogData {
    custCode: number;
    custName: string;
}

@Component({
    selector: 'app-dialog-box-branch',
    templateUrl: 'dialog-box-branch.component.html',
    styleUrls: ['dialog-box-branch.component.scss']
})
export class DialogBoxBranchComponent implements OnInit, AfterViewInit {
    filterValue: string = null;
    dataSource = new MatTableDataSource<TableData>();
    pageEvent: PageEvent;
    displayedColumns: string[] = ['brncode' , 'brnname'];
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
        private masterService: MasterService,

        public dialogRef: MatDialogRef<DialogBoxBranchComponent>,
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
        this.masterService.findCostCenterAll(this.sharedService.compCode, this.sharedService.brnCode, this.filterValue, 1, this.pageSize)
            .subscribe((page: MasterDatas<CostCenter>) => {
                this.dataSource.data = this.toTableData(page['items']);
                this.length = page['totalItems'];
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
        this.masterService.findCostCenterAll(this.sharedService.compCode, this.sharedService.brnCode, value, 1, this.pageSize)
            .subscribe((page: MasterDatas<CostCenter>) => {
                this.dataSource.data = this.toTableData(page['items']);
                this.length = page['totalItems'];
            });
    }

    onPaginateChange(event: PageEvent) {
        this.no = event.pageIndex > 0 ? event.pageIndex * event.pageSize : 0;
        let page = event.pageIndex;
        let size = event.pageSize;

        if (this.filterValue == null) {
            page = page + 1;

            this.masterService.findCostCenterAll(this.sharedService.compCode, this.sharedService.brnCode, this.filterValue, page, size)
                .subscribe((page: MasterDatas<CostCenter>) => {
                    this.dataSource.data = this.toTableData(page['items']);
                    this.length = page['totalItems'];
                })
        } else {
            this.masterService.findCostCenterAll(this.sharedService.compCode, this.sharedService.brnCode, this.filterValue, page, size)
                .subscribe((page: MasterDatas<CostCenter>) => {
                    this.dataSource.data = this.toTableData(page['items']);
                    this.length = page['totalItems'];
                })
        }
    }

    navigateToProfile(userBrnCode: string, brnName: string) {
        this.dialogRef.close({ userBrnCode: userBrnCode, brnName: brnName });
    }

    closeDialog() {
        this.dialogRef.close();
    }

    private toTableData(customers: CostCenter[]): TableData[] {
        return customers.map(c => {
            return {
                brnCode: c.brnCode,
                brnName: c.brnName,
                brnStatus: c.brnStatus,
                compCode: c.compCode,
                costCenter: c.costCenter,
                createdBy: c.createdBy,
                createdDate: c.createdDate,
                mapBrnCode: c.mapBrnCode,
                profitCenter: c.profitCenter,
                updatedBy: c.updatedBy,
                updatedDate: c.updatedDate,
            };
        });
    }
}