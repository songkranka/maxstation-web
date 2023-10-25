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
import { QueryResult, ReceiveGasListQuery } from '../ModelReceiveGas';
import { ReceiveGasService } from '../ReceiveGas.service';

@Component({
  selector: 'app-ReceiveGasList',
  templateUrl: './ReceiveGasList.component.html',
  styleUrls: ['./ReceiveGasList.component.scss']
})
export class ReceiveGasListComponent implements OnInit {
  filterValue: string = null;
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  dataSource = new MatTableDataSource<ModelInvReceiveProdHd>();
  pageEvent: PageEvent;
  displayedColumns: string[] = ['no', 'docno', 'docdate', 'invno', 'pono', 'vendername', 'docstatus'];
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
    private _svReceiveGas: ReceiveGasService,
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
    await this.getReceiveGasList();
  }
  ngAfterViewInit(): void {
    this.SvDefault.DoAction(() => {
      this.dataSource.sort = this.sort;
    });
  }
  async GetReceiveGasList() {
    await this.SvDefault.DoActionAsync(async () => await this.getReceiveGasList(), true);
  }
  private async getReceiveGasList(pNumPage?: number) {
    // if(this.dateRange?.value?.end == null){
    //   return;
    // }
    let numPage: number = pNumPage || 1;
    let strKeyWord: string = (this.filterValue || "").toString().trim();
    let fromDate: Date = null;
    fromDate = <any>this.SvDefault.GetFormatDate(this.dateRange?.value?.start);
    let toDate: Date = null;
    toDate = <any>this.SvDefault.GetFormatDate(this.dateRange?.value?.end);
    let qryReceiveGas = <ReceiveGasListQuery>{
      BrnCode: this._strBrnCode,
      CompCode: this._strCompCode,
      DocType: "Gas",
      FromDate: fromDate,
      ItemsPerPage: this.pageSize,
      Keyword: strKeyWord,
      LocCode: this._strLocCode,
      Page: numPage,
      ToDate: toDate
    };
    let apiResult: QueryResult<ModelInvReceiveProdHd> = await this._svReceiveGas.GetReceiveGasList(qryReceiveGas);
    this.dataSource.data = apiResult.Items;
    this.length = apiResult.TotalItems;
  }
  async OnPaginateChange(pEvent: PageEvent) {
    await this.SvDefault.DoActionAsync(async () => await this.onPaginateChange(pEvent), true);
  }
  private async onPaginateChange(pEvent: PageEvent) {
    this.no = pEvent.pageIndex * pEvent.pageSize;
    let numPageIndex: number = pEvent.pageIndex;
    this.pageSize = pEvent.pageSize;
    await this.getReceiveGasList(numPageIndex);
  }
}
