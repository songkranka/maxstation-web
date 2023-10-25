import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { async } from 'rxjs/internal/scheduler/async';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { ModelCustomerCar } from 'src/app/service/creditsale-service/creditsale-service';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import { CustomerService } from '../Customer.service';
import { ModelGetCustomerLisParam, ModelMasCustomer2 } from '../ModelCustomer';

@Component({
  selector: 'app-CustomerList',
  templateUrl: './CustomerList.component.html',
  styleUrls: ['./CustomerList.component.scss']
})
export class CustomerListComponent implements OnInit {

  constructor(
    public SvDefault : DefaultService,
    private _svCustomer : CustomerService,
    private _svShare : SharedService,
    private authGuard: AuthGuard,
  ) { }

  filterValue : string = "";
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<ModelMasCustomer2>();
  pageEvent: PageEvent;
  // displayedColumns: string[] = ['no', 'docno', 'doctype' ,  'docdate', 'user', 'docstatus'];
  displayedColumns: string[] = ['no', 'custCode', 'custName', 'tel','creditLimit', 'custStatus'];
  no = 0;
  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  private authPositionRole : any = null;
  
  async ngOnInit() {
    await this.SvDefault.DoActionAsync(async()=>await this.start(),true);
  }
  ngAfterViewInit(){
    this.dataSource.sort = this.sort;
  }

  isUserAuthenticated():boolean{
    return true;
  }

  async GetArrayHeader(pNumPage : number){
    await this.SvDefault.DoActionAsync(async()=> await this.getArrayCustomer(pNumPage) , true);
  }

  async OnPaginateChange(pEvent: PageEvent){
    await this.SvDefault.DoActionAsync(async () => await this.onPaginateChange(pEvent), true);
  }
  private async onPaginateChange(pEvent: PageEvent) {
    this.no = pEvent.pageIndex > 0 ? pEvent.pageIndex * pEvent.pageSize : 0;
    let page = pEvent.pageIndex+1;
    this.pageSize = pEvent.pageSize;
    // if (this.filterValue == null) {
    //   page = page + 1;
    // }
    await this.GetArrayHeader(page);
  }
  private async start(){
    this.authPositionRole = this.SvDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }
    await this.getArrayCustomer(0);
  }
  private async getArrayCustomer(pNumPage?: number){
    this.dataSource.data = [];
    this.length = 0;
    let numPage: number = pNumPage || 1;
    let strKeyWord: string = this.SvDefault.GetString(this.filterValue);
    let param = new ModelGetCustomerLisParam();

    param.PageIndex = numPage;
    param.ItemPerPage = this.pageSize;
    param.KeyWord = strKeyWord;
    param.BrnCode = this._svShare.brnCode;
    param.CompCode = this._svShare.compCode;
    let apiResult = await this._svCustomer.GetCustomerList2(param);
    if(apiResult != null){
      this.dataSource.data = apiResult.ArrCustomer;
      this.length = apiResult.TotalItem;
    }
  }
}
