import { Component, Inject, Optional, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from '../../../../../shared/shared.service';
import { WithdrawService } from '../../../../../service/withdraw-service/withdraw-service';
import { MasterService } from '../../../../../service/master-service/master.service';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Employee } from 'src/app/model/master/employee.interface';
// import { ModelMasEmployee } from 'src/app/model/ModelScaffold';


export class ModelMasEmployee {
    empCode: string;
    firstName: string;
    lastName: string;
}
export interface EmployeeDialogData {
    custCode: number;
    custName: string;
}

@Component({
    selector: 'app-dialog-box-employee',
    templateUrl: 'dialog-box-employee.component.html',
    styleUrls: ['dialog-box-employee.component.scss']
})
export class DialogBoxEmployeeComponent implements OnInit, AfterViewInit {
    filterValue: string = null;
    dataSource = new MatTableDataSource<ModelMasEmployee>();
    pageEvent: PageEvent;
    displayedColumns: string[] = ['no', 'empcode', 'empname'];
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
        public withdrawService: WithdrawService,
        public masterService: MasterService,

        public dialogRef: MatDialogRef<DialogBoxEmployeeComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: EmployeeDialogData) {
        this.local_data = { ...data };
    }

    ngOnInit(): void {
        this.initDataSource();
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
    }

    public async initDataSource() {
        let employees = (await this.masterService.findEmployeeAll(this.filterValue, 1, this.pageSize));
        this.dataSource.data = this.toTableData(employees["items"]);
        this.length = employees["totalItems"];
    }

    public async findByValue(value: string) {
        let employees = (await this.masterService.findEmployeeAll(value, 1, this.pageSize));
        this.dataSource.data = this.toTableData(employees["items"]);
        this.length = employees["totalItems"];
    }

    public async onPaginateChange(event: PageEvent) {
        this.no = event.pageIndex > 0 ? event.pageIndex * event.pageSize : 0;
        let page = event.pageIndex;
        let size = event.pageSize;

        if (this.filterValue == null) {
            page = page + 1;

            let employees = (await this.masterService.findEmployeeAll(this.filterValue, page, size));
            this.dataSource.data = this.toTableData(employees["items"]);
            this.length = employees["totalItems"];
        } else {
            let employees = (await this.masterService.findEmployeeAll(this.filterValue, page, size));
            this.dataSource.data = this.toTableData(employees["items"]);
            this.length = employees["totalItems"];
        }
    }

    navigateToProfile(empCode: string, firstName: string, lastName: string) {
        
        this.dialogRef.close({ empCode: empCode, firstName: firstName, lastName: lastName });
    }

    closeDialog() {
        this.dialogRef.close();
    }

    private toTableData(employee: Employee[]): ModelMasEmployee[] {
        return employee.map(c => {
            return {
                empCode: c.empCode,
                firstName: c.personFnameThai,
                lastName: c.personLnameThai
            };
        });
    }
}