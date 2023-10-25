import { AfterViewInit, Component, Inject, OnInit, Optional, ViewChild } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ModelMasBranch } from "src/app/model/ModelScaffold";
import { MasterService } from "src/app/service/master-service/master.service";
import { SharedService } from '../../../../shared/shared.service';
import { Branch } from 'src/app/model/master/branch.interface';

interface TableData {
    branchCode: string;
    branchName: string;
}

export interface BranchDialogData {
    compCode: string;
}

@Component({
    selector: 'app-dialog-box-branch',
    templateUrl: 'dialog-box-branch.component.html',
    styleUrls: ['dialog-box-branch.component.scss']
})

export class DialogBoxLoginBranchComponent implements OnInit, AfterViewInit {
    filterValue: string = null;

    dataSource = new MatTableDataSource<ModelMasBranch>();
    pageEvent: PageEvent;
    displayedColumns: string[] = ['brnCode', 'brnName'];
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

        public dialogRef: MatDialogRef<DialogBoxLoginBranchComponent>,
        @Optional() @Inject(MAT_DIALOG_DATA) public data: BranchDialogData) {
        // this.local_data = { ...data };
    }

    ngOnInit(): void {
        this.initDataSource();
    }

    ngAfterViewInit(): void {
        this.dataSource.sort = this.sort;
    }

    public async initDataSource() {
        let compCode = this.data.compCode;
        let branchs = (await this.masterService.findBranchAll(this.filterValue, 1, this.pageSize, compCode));
        this.dataSource.data = this.toTableData(branchs['items']);
        this.length = branchs["totalItems"];
    }

    public async findByValue(value: string) {
        let compCode = this.data.compCode;
        let branchs = (await this.masterService.findBranchAll(value, 1, this.pageSize, compCode));
        this.dataSource.data = this.toTableData(branchs['items']);
        this.length = branchs["totalItems"];
    }

    public async onPaginateChange(event: PageEvent) {
        let compCode = this.data.compCode;
        this.no = event.pageIndex > 0 ? event.pageIndex * event.pageSize : 0;
        let page = event.pageIndex;
        let size = event.pageSize;

        if (this.filterValue == null) {
            page = page + 1;

            let reasons = (await this.masterService.findBranchAll(this.filterValue, page, size, compCode));
            this.dataSource.data = this.toTableData(reasons["items"]);
            this.length = reasons["totalItems"];
        } else {
            let reasons = (await this.masterService.findBranchAll(this.filterValue, page, size, compCode));
            this.dataSource.data = this.toTableData(reasons["items"]);
            this.length = reasons["totalItems"];
        }
    }

    navigateToProfile(brnCode: string, locCode: string) {
        this.dialogRef.close({ BrnCode: brnCode, LocCode: locCode});
    }

    closeDialog() {
        this.dialogRef.close();
    }

    private toTableData(branchs: Branch[]): ModelMasBranch[] {
        return branchs.map(c => {
            return {
                Address: c.address,
                BranchNo: c.branchNo,
                BrnCode: c.brnCode,
                LocCode: c.locCode,
                BrnName: c.brnName,
                BrnStatus: c.brnStatus,
                CompCode: c.compCode,
                CreatedBy: c.createdBy,
                CreatedDate: c.createdDate,
                District: c.district,
                Fax: c.fax,
                MapBrnCode: c.mapBrnCode,
                Phone: c.phone,
                Postcode: c.postcode,
                Province: c.province,
                SubDistrict: c.subDistrict,
                PosCount :c.posCount,
                UpdatedBy: c.updatedBy,
                UpdatedDate: c.updatedDate,
                CompanyName: c.companyName,
                CloseDate: c.closeDate,
            };
        });
    }
}