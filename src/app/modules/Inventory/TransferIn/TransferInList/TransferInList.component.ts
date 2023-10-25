import { Component, OnInit, ViewChild } from '@angular/core';
import { async } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { ModelSearchTranInQueryResource, ModelTransferInHeader } from 'src/app/model/ModelTransferIn';
import { DefaultService } from 'src/app/service/default.service';
import { TransferInService } from 'src/app/service/transfer-in-service/TransferIn.service';
import { SharedService } from 'src/app/shared/shared.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-TransferInList',
  templateUrl: './TransferInList.component.html',
  styleUrls: ['./TransferInList.component.scss']
})
export class TransferInListComponent implements OnInit {
  constructor(
    public SvDefault: DefaultService,
    private _svShared: SharedService,
    private _svTransferIn: TransferInService,
    private authGuard: AuthGuard,
    private _router: Router
  ) { }

  filterValue: string = null;
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  dataSource = new MatTableDataSource<ModelTransferInHeader>();
  pageEvent: PageEvent;
  displayedColumns: string[] = ['no', 'docNo', 'docDate', 'refno', 'brnCode', 'docStatus'];
  no = 0;
  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  private authPositionRole: any;
  @ViewChild(MatSort) sort: MatSort;

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  async ngOnInit(): Promise<void> {
    this.authPositionRole = this.SvDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }
    let dateStart = new Date(new Date(this._svShared.systemDate).setDate(new Date(this._svShared.systemDate).getDate() - 1));
    let dateEnd = new Date(this._svShared.systemDate);
    this.dateRange.get('start').setValue(dateStart);
    this.dateRange.get('end').setValue(dateEnd);
    await this.SvDefault.DoActionAsync(async () => {
      if (!await this.SvDefault.CheckSessionAsync()) {
        return;
      };
      await this.findByValue();
    });
  }
  ngAfterViewInit(): void {
    this.SvDefault.DoAction(() => {
      this.dataSource.sort = this.sort;
    });
  }

  async findByValue(): Promise<void> {
    await this.SvDefault.DoActionAsync(async () => await this._findByValue(), true);
  }
  private async _findByValue() {
    let param = new ModelSearchTranInQueryResource();
    param.brnCode = (this._svShared.brnCode || "").toString().trim();
    param.compCode = (this._svShared.compCode || "").toString().trim();
    param.locCode = (this._svShared.locCode || "").toString().trim();
    param.keyword = (this.filterValue || "").toString().trim();
    param.skip = 0;
    param.take = this.pageSize || 0;
    param.fromDate = this.SvDefault.GetFormatDate(this.dateRange?.value?.start);
    param.toDate = this.SvDefault.GetFormatDate(this.dateRange?.value?.end);
    // Swal.showLoading();
    let apiResult = await this._svTransferIn.SearchTranIn(param);
    if (apiResult == null || !apiResult?.isSuccess) {
      let err = <Error>{
        message: apiResult.errormessage,
        stack: apiResult.errorStackTrace
      };
      throw err;
      // apiResult?.ShowErrorPopup();
      // return;
    }
    this.length = apiResult?.totalItems || 0;
    this.dataSource.data = apiResult?.data || [];
  }

  async onPaginateChange(event: PageEvent) {
    await this.SvDefault.DoActionAsync(async () => {
      this.no = event.pageIndex > 0 ? event.pageIndex * event.pageSize : 0;
      let page = event.pageIndex || 0;
      let size = event.pageSize || 0;
      if (this.filterValue == null) {
        page++;
      }
      let param = new ModelSearchTranInQueryResource();
      param.brnCode = (this._svShared.brnCode || "").toString().trim();
      param.compCode = (this._svShared.compCode || "").toString().trim();
      param.locCode = (this._svShared.locCode || "").toString().trim();
      param.keyword = (this.filterValue || "").toString().trim();
      param.skip = (page - 1) * size;
      param.take = size;
      param.fromDate = this.dateRange?.value?.start;
      param.toDate = this.dateRange?.value?.end;
      // Swal.showLoading();
      let apiResult = await this._svTransferIn.SearchTranIn(param);
      if (apiResult?.isSuccess) {
        this.length = apiResult?.totalItems || 0;
        this.dataSource.data = apiResult?.data || [];
        // Swal.close();
      } else {
        let err = <Error>{
          message: apiResult.errormessage,
          stack: apiResult.errorStackTrace
        };
        throw err;
        // apiResult?.ShowErrorPopup();
      }
    }, true);
  }

  public async newDocument(){
    await this.SvDefault.DoActionAsync(async()=> await this.NewDocument());
  }

  private async NewDocument(){
    this._router.navigate(['/TransferIn/New']);
  }
}
