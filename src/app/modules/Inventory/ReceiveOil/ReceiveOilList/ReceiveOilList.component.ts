import { Component, OnInit, ViewChild } from '@angular/core';
import { async } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { ModelInvReceiveProdHd } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import { QueryResult, ReceiveOilListQuery } from '../ModelReceiveOil';
import { ReceiveOilService } from '../ReceiveOil.service';

@Component({
  selector: 'app-ReceiveOilList',
  templateUrl: './ReceiveOilList.component.html',
  styleUrls: ['./ReceiveOilList.component.scss']
})
export class ReceiveOilListComponent implements OnInit {
  filterValue: string = null;
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  dataSource = new MatTableDataSource<ModelInvReceiveProdHd>();
  pageEvent: PageEvent;
  displayedColumns: string[] = ['no', 'docno', 'docdate', 'invno', 'pono', 'potype', 'vendername', 'docstatus'];
  no = 0;
  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  urlSale = this._svShare.urlSale;
  urlMas = this._svShare.urlMas;
  private authPositionRole: any;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private activatedRoute: ActivatedRoute,
    private _svReceiveOil: ReceiveOilService,
    private router: Router,
    private _svShare: SharedService,
    public SvDefault: DefaultService,
    private authGuard: AuthGuard,
  ) {

  }
  private _strBrnCode: string = "";
  private _strCompCode: string = "";
  private _strLocCode: string = "";

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  async ngOnInit() {
    this.authPositionRole = this.SvDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }
    let dateStart = new Date(new Date(this._svShare.systemDate).setDate(new Date(this._svShare.systemDate).getDate() - 1));
    let dateEnd = new Date(this._svShare.systemDate);
    this.dateRange.get('start').setValue(dateStart);
    this.dateRange.get('end').setValue(dateEnd);
    this.SvDefault.DoActionAsync(async () => await this.start(), true);
  }
  private async start() {
    if (!await this.SvDefault.CheckSessionAsync()) {
      return;
    }
    this._strBrnCode = (this._svShare.brnCode || "").toString().trim();
    this._strCompCode = (this._svShare.compCode || "").toString().trim();
    this._strLocCode = (this._svShare.locCode || "").toString().trim();
    await this.getReceiveOilList();
  }
  ngAfterViewInit(): void {
    this.SvDefault.DoAction(() => {
      this.dataSource.sort = this.sort;
    });
  }
  async GetReceiveOilList() {
    await this.SvDefault.DoActionAsync(async () => await this.getReceiveOilList(), true);
  }
  private async getReceiveOilList(pNumPage?: number) {
    let numPage: number = pNumPage || 1;
    let strKeyWord: string = (this.filterValue || "").toString().trim();
    let startDate: Date = null;
    startDate = <any>this.SvDefault.GetFormatDate(this.dateRange?.value?.start);
    let endDate: Date = null;
    endDate = <any>this.SvDefault.GetFormatDate(this.dateRange?.value?.end);
    let qryReceiveOil = <ReceiveOilListQuery>{
      BrnCode: this._strBrnCode,
      CompCode: this._strCompCode,
      DocType: "Oil",
      FromDate: startDate,
      ItemsPerPage: this.pageSize,
      Keyword: strKeyWord,
      LocCode: this._strLocCode,
      Page: numPage,
      ToDate: endDate
    };
    let apiResult: QueryResult<ModelInvReceiveProdHd> = await this._svReceiveOil.GetReceiveOilList(qryReceiveOil);
    this.dataSource.data = apiResult.Items;
    this.length = apiResult.TotalItems;
  }
  /* 
  private async getReceiveOilList(pNumPage? : number ){
    let numPage : number = pNumPage || 1;
    let strKeyWord : string = (this.filterValue || "").toString().trim();
    let qryReceiveOil = <ReceiveOilListQuery>{
      BrnCode : this._strBrnCode,
      CompCode: this._strCompCode,
      DocType : "Oil",
      FromDate : this.dateRange.value.start ,
      ItemsPerPage : this.pageSize ,
      Keyword : strKeyWord,
      LocCode : this._strLocCode,
      Page : numPage,
      ToDate : this.dateRange.value.end
    };
    let apiResult : QueryResult<ModelInvReceiveProdHd> = await this._svReceiveOil.GetReceiveOilList(qryReceiveOil);
    this.dataSource.data = apiResult.Items;
    this.length = apiResult.TotalItems;
  }
  */
  async OnPaginateChange(pEvent: PageEvent) {
    await this.SvDefault.DoActionAsync(async () => await this.onPaginateChange(pEvent), true);
  }
  private async onPaginateChange(pEvent: PageEvent) {

    // this.no = pEvent.pageIndex * pEvent.pageSize;
    // let numPageIndex: number = pEvent.pageIndex;
    // this.pageSize = pEvent.pageSize;

    this.no = pEvent.pageIndex > 0 ? pEvent.pageIndex * pEvent.pageSize : 0;
    this.pageSize = pEvent.pageSize || 0;
    let numPageIndex = pEvent.pageIndex || 0;
    if (this.filterValue == null) {
      numPageIndex = numPageIndex + 1;
    }

    await this.getReceiveOilList(numPageIndex);
  }
}
