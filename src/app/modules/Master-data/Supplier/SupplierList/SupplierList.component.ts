import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { ModelMasSupplier } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ModelGetSupplierListParam } from '../ModelSupplier';
import { SupplierService } from '../Supplier.service';

@Component({
  selector: 'app-SupplierList',
  templateUrl: './SupplierList.component.html',
  styleUrls: ['./SupplierList.component.scss']
})
export class SupplierListComponent implements OnInit {

  constructor(
    public SvDefault : DefaultService,
    private _svSupplier : SupplierService,
    private _svShare : SharedService,
    private authGuard: AuthGuard,
  ) { }
  filterValue : string = "";
  @ViewChild(MatSort) sort: MatSort;
  pageEvent: PageEvent;
  dataSource = new MatTableDataSource<ModelMasSupplier>();
  displayedColumns: string[] = ['no', 'PdId' , 'PdName', 'PdType', 'GroupId', 'PdStatus'];

  no = 0;
  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  private _arrSupplier : ModelMasSupplier[] = null;
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
  private async start(){
    this.authPositionRole = this.SvDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }
    //this._arrSupplier = await this._svSupplier.GetArrProductGroup();
    await this.getArraySupplier(0);
  }

  private async getArraySupplier(pNumPage?: number){
    this.dataSource.data = [];
    this.length = 0;
    let numPage: number = pNumPage || 1;
    let strKeyWord: string = this.SvDefault.GetString(this.filterValue);
    let param = new ModelGetSupplierListParam();

    param.PageIndex = numPage;
    param.ItemPerPage = this.pageSize;
    param.KeyWord = strKeyWord;
    // param.BrnCode = this._svShare.brnCode;
    // param.CompCode = this._svShare.compCode;
    let apiResult = await this._svSupplier.GetSupplierList(param);
    if(apiResult != null){
      this.dataSource.data = apiResult.ArrSuplier;
      this.length = apiResult.TotalItem;
    }
  }

  async GetArrayHeader(pNumPage : number){
    await this.SvDefault.DoActionAsync(async()=> await this.getArraySupplier(pNumPage),true);
  }
  async OnPaginateChange(pEvent: PageEvent){
    await this.SvDefault.DoActionAsync(async()=> await this.onPaginateChange(pEvent),true);
  }

  private async onPaginateChange(pEvent: PageEvent) {
    this.no = pEvent.pageIndex > 0 ? pEvent.pageIndex * pEvent.pageSize : 0;
    let page = pEvent.pageIndex+1;
    this.pageSize = pEvent.pageSize;
    await this.getArraySupplier(page);
  }

}
