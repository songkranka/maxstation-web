import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { async } from 'rxjs/internal/scheduler/async';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { ModelMasProduct, ModelMasProductGroup } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ProductService } from '../Product.service';

@Component({
  selector: 'app-ProductList',
  templateUrl: './ProductList.component.html',
  styleUrls: ['./ProductList.component.scss']
})
export class ProductListComponent implements OnInit {

  constructor(
    public SvDefault : DefaultService,
    private _svProduct : ProductService,
    private _svShare : SharedService,
    private authGuard: AuthGuard,
  ) { }

  filterValue : string = "";
  @ViewChild(MatSort) sort: MatSort;
  pageEvent: PageEvent;
  dataSource = new MatTableDataSource<ModelMasProduct>();
  displayedColumns: string[] = ['no', 'PdId' , 'PdName', 'PdType', 'GroupId', 'PdStatus'];

  no = 0;
  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  private _arrProductGroup : ModelMasProductGroup[] = null;
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
    this._arrProductGroup = await this._svProduct.GetArrProductGroup();
    await this.getArrayProduct(0);
  }

  async GetArrayHeader(pNumPage : number){
    await this.SvDefault.DoActionAsync(async()=> await this.getArrayProduct(pNumPage),true);
  }

  async OnPaginateChange(pEvent: PageEvent){
    await this.SvDefault.DoActionAsync(async()=> await this.onPaginateChange(pEvent),true);
  }

  private async getArrayProduct(pNumPage?: number){
    this.dataSource.data = [];
    this.length = 0;
    let numPage: number = pNumPage || 1;
    let strKeyWord: string = this.SvDefault.GetString(this.filterValue);
    let apiResult = await this._svProduct.GetArrProduct(strKeyWord , numPage , this.pageSize);
    if(apiResult != null){
      this.dataSource.data = apiResult.items;
      this.length = apiResult.totalItems;
    }
  }

  private async onPaginateChange(pEvent: PageEvent) {
    this.no = pEvent.pageIndex > 0 ? pEvent.pageIndex * pEvent.pageSize : 0;
    let page = pEvent.pageIndex+1;
    this.pageSize = pEvent.pageSize;
    await this.getArrayProduct(page);
  }



  public GetProductType(pStrProductype : string){
    pStrProductype = this.SvDefault.GetString(pStrProductype);
    switch (pStrProductype) {
      case "Service":
        return "บริการ";
      case "Product" :
        return "สินค้า";
      default:
        return "";
        break;
    }
  }

  public GetProductGroupName(pStrGroupId : string){
    pStrGroupId = this.SvDefault.GetString(pStrGroupId);
    if(!this.SvDefault.IsArray(this._arrProductGroup)){
      return pStrGroupId;
    }
    if(pStrGroupId === ""){
      return "";
    }
    let pg = this._arrProductGroup.find(x=> x.GroupId === pStrGroupId);
    if(pg == null){
      return pStrGroupId;
    }
    let result = this.SvDefault.GetString(pg.GroupName);
    return result;
  }
}
