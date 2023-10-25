import { Component, Inject, Optional, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from '../../../../../shared/shared.service';
import { MasterService } from '../../../../../service/master-service/master.service';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Reason } from 'src/app/model/master/reason.interface';
import { ModelMasReason } from 'src/app/model/ModelScaffold';


export interface ReasonDialogData {
    pluNumber: string;
    // reasonDesc: string;
}

@Component({
    selector: 'app-dialog-box-reason',
    templateUrl: 'dialog-box-reason.component.html',
    styleUrls: ['dialog-box-reason.component.scss']
})
export class DialogBoxReasonComponent implements OnInit, AfterViewInit {
    filterValue: string = null;
    dataSource = new MatTableDataSource<ModelMasReason>();
    pageEvent: PageEvent;
    displayedColumns: string[] = ['no', 'reasonId' ,'reasonDesc'];
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

        public dialogRef: MatDialogRef<DialogBoxReasonComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: ReasonDialogData) {
        // this.local_data = { ...data };
    }

    ngOnInit(): void {
        this.initDataSource();
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
    }

    public async initDataSource() {
        // console.log("DialogData" + " " + this.data.pluNumber);
        let pluNumber = this.data.pluNumber;
        let reasons = (await this.masterService.findReasonAll(this.filterValue, 1, this.pageSize, pluNumber));
        this.dataSource.data = this.toTableData(reasons['items']);

        this.length = reasons["totalItems"];
    }

    public async findByValue(value: string) {
        let pluNumber = this.data.pluNumber;
        let reasons = (await this.masterService.findReasonAll(value, 1, this.pageSize, pluNumber));
        this.dataSource.data = this.toTableData(reasons['items']);
        this.length = reasons["totalItems"];
    }

    public async onPaginateChange(event: PageEvent) {
        let pluNumber = this.data.pluNumber;
        this.no = event.pageIndex > 0 ? event.pageIndex * event.pageSize : 0;
        let page = event.pageIndex;
        let size = event.pageSize;

        if (this.filterValue == null) {
            page = page + 1;

            let reasons = (await this.masterService.findReasonAll(this.filterValue, page, size, pluNumber));
            this.dataSource.data = this.toTableData(reasons["items"]);
            this.length = reasons["totalItems"];
        } else {
            let reasons = (await this.masterService.findReasonAll(this.filterValue, page, size, pluNumber));
            this.dataSource.data = this.toTableData(reasons["items"]);
            this.length = reasons["totalItems"];
        }
    }

    navigateToProfile(reasonId: string) {
        this.dialogRef.close({ reason: reasonId });
    }

    closeDialog() {
        this.dialogRef.close();
    }

    private toTableData(reasons: Reason[]): ModelMasReason[] {
        return reasons.map(c => {
            return {
                ReasonGroup: c.reasonGroup,
                ReasonId: c.reasonId,
                ReasonStatus: c.reasonStatus,
                ReasonDesc: c.reasonDesc,
                IsValidate: c.isValidate,
                CreatedDate: c.createdDate,
                CreatedBy: c.createdBy,
                UpdatedDate: c.updatedDate,
                UpdatedBy: c.updatedBy
            };
        });
    }
}