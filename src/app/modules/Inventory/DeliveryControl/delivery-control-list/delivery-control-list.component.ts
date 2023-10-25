import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { ModelInvDeliveryCtrl } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import { DeliveryControlService } from '../DeliveryControl.service';
import { ModelParamSearchDelivery } from '../ModelDelivery';

interface TableData {
  docdate: Date;
  receiveDate: Date;
  docno: string;
  docstatus: string;
  delivery: string;
  driver: string;
}

export class ModelDeliveryMock{
  docNo: string;
  docdate: Date;
  receiveDate: Date;
  delivery: string;
  driver: string;
  docStatus: string;
}

@Component({
  selector: 'app-delivery-control-list',
  templateUrl: './delivery-control-list.component.html',
  styleUrls: ['./delivery-control-list.component.scss']
})
export class DeliveryControlListComponent implements OnInit {
  filterValue: string = null;
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  dataSource = new MatTableDataSource<ModelInvDeliveryCtrl>();
  pageEvent: PageEvent;
  displayedColumns: string[] = ['No' , 'DocNo' , 'DocDate' , 'RealDate' , 'WhName' , 'EmpName' , 'DocStatus'];
  no = 0;
  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  private _strBrnCode: string = "";
  private _strCompCode: string = "";
  private _strLocCode: string = "";
  private authPositionRole: any;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authGuard: AuthGuard,
    public SvDefault: DefaultService,
    private _svShared: SharedService,
    private _svDelivery : DeliveryControlService
  ) { }

  isUserAuthenticated = (): boolean => {
    return true;
    // return this.authGuard.canActivate();
  }

  async ngOnInit() {
    let dateStart = new Date(new Date(this._svShared.systemDate).setDate(new Date(this._svShared.systemDate).getDate() - 1));
    let dateEnd = new Date(this._svShared.systemDate);
    this.dateRange.get('start').setValue(dateStart);
    this.dateRange.get('end').setValue(dateEnd);
    this.SvDefault.DoActionAsync2(async () => await this.start(), true ,2);
  }

  private async start() {
    // this.authPositionRole = this.SvDefault.GetAuthPositionRole();
    // if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
    //   window.location.href = "/NoPermission";
    //   return;
    // }


    this._strBrnCode = (this._svShared.brnCode || "").toString().trim();
    this._strCompCode = (this._svShared.compCode || "").toString().trim();
    this._strLocCode = (this._svShared.locCode || "").toString().trim();
    await this.getArrayHeader();
  }

  ngAfterViewInit(): void {
    this.SvDefault.DoAction(() => {
      this.dataSource.sort = this.sort;
    });
  }

  public async GetArrayHeader() {
    await this.SvDefault.DoActionAsync2(async () => await this.getArrayHeader(), true , 2);
  }

  private async getArrayHeader(pNumPage?: number) {
    //
    let param = new ModelParamSearchDelivery();
    param.BrnCode = this._strBrnCode;
    param.CompCode = this._strCompCode;
    param.LocCode = this._strLocCode;
    param.Keyword = this.SvDefault.GetString( this.filterValue);
    // param.FromDate = this.dateRange
    param.FromDate = <any>this.SvDefault.GetFormatDate(<any>this.dateRange?.value?.start);
    param.ToDate = <any>this.SvDefault.GetFormatDate(<any>this.dateRange?.value?.end);
    param.ItemsPerPage = this.pageSize;
    param.Page = pNumPage || 1;
    let apiResult = await this._svDelivery.SearchDelivery(param);
    if(apiResult != null){
      this.dataSource.data = apiResult.Items;
      this.length = apiResult.TotalItems;
    }
  }

  async OnPaginateChange(pEvent: PageEvent) {
    await this.SvDefault.DoActionAsync(async () => await this.onPaginateChange(pEvent), true);
  }

  private async onPaginateChange(pEvent: PageEvent) {
    this.no = pEvent.pageIndex > 0 ? pEvent.pageIndex * pEvent.pageSize : 0;
    let page = pEvent.pageIndex;
    this.pageSize = pEvent.pageSize;
    if (this.filterValue == null) {
      page = page + 1;
    }
    await this.getArrayHeader(page);
  }
}
