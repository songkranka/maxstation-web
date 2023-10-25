import { Component, Inject, Optional, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import swal from 'sweetalert2';
import { SharedService } from '../../../../../shared/shared.service';
import { MasterService,  } from '../../../../../service/master-service/master.service';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CompanyCar } from 'src/app/model/master/companycar.interface';
import { ModelMasCompanyCar } from 'src/app/model/ModelScaffold';

export interface DialogData {
    custCode: string;
    custName: string;
  }

@Component({
    selector: 'app-dialog-box-customercar',
    templateUrl: 'dialog-box-customercar.component.html',
    styleUrls: ['dialog-box-customercar.component.scss']
})
export class DialogBoxCustomerCarComponent implements OnInit, AfterViewInit {
    filterValue: string = null;
    dataSource = new MatTableDataSource<ModelMasCompanyCar>();
    pageEvent: PageEvent;
    displayedColumns: string[] = ['no', 'licensePlate'];
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
        public masterService: MasterService,

        public dialogRef: MatDialogRef<DialogBoxCustomerCarComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: DialogData) {
        this.local_data = { ...data };
    }

    ngOnInit(): void {
        // console.log(this.data.custCode);
        this.initDataSource();
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
    }

    public async initDataSource() {
        let companyCars = (await this.masterService.GetCustomerCarList(this.data.custCode, this.filterValue, 1, this.pageSize));
        this.dataSource.data = this.toTableData(companyCars["items"]);
        this.length = companyCars["totalItems"];
    }

    public async findByValue(value: string) {
        let companyCars = (await this.masterService.GetCustomerCarList(this.data.custCode, value, 1, this.pageSize));
        this.dataSource.data = this.toTableData(companyCars["items"]);
        this.length = companyCars["totalItems"];
    }

    public async onPaginateChange(event: PageEvent) {
        this.no = event.pageIndex > 0 ? event.pageIndex * event.pageSize : 0;
        let page = event.pageIndex;
        let size = event.pageSize;

        if (this.filterValue == null) {
            page = page + 1;

            let companyCars = (await this.masterService.GetCustomerCarList(this.data.custCode, this.filterValue, page, size));
            this.dataSource.data = this.toTableData(companyCars["items"]);
            this.length = companyCars["totalItems"];
        } else {
            let companyCars = (await this.masterService.GetCustomerCarList(this.data.custCode, this.filterValue, page, size));
            this.dataSource.data = this.toTableData(companyCars["items"]);
            this.length = companyCars["totalItems"];
        }
    }

    navigateToProfile(licensePlate: string) {
        this.dialogRef.close({ licensePlate: licensePlate });
    }

    closeDialog() {
        this.dialogRef.close();
    }

    private toTableData(companyCar: CompanyCar[]): ModelMasCompanyCar[] {
        return companyCar.map(c => {
            return {
                CarStatus: c.carStatus,
                CarRemark: c.carRemark,
                CompCode: c.compCode,
                CreatedBy: c.createdBy,
                CreatedDate: c.createdDate,
                LicensePlate: c.licensePlate,
                UpdatedBy: c.updatedBy,
                UpdatedDate: c.updatedDate,
            };
        });
    }
}