import { Component, OnInit, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { async } from 'rxjs/internal/scheduler/async';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import Swal from 'sweetalert2';
import { ModelGetPositionListParam, ModelMasPosition, ModelPosition } from '../ModelPosition';
import { PositionService } from '../Position.service';

@Component({
  selector: 'app-PositionList',
  templateUrl: './PositionList.component.html',
  styleUrls: ['./PositionList.component.scss']
})
export class PositionListComponent implements OnInit {

  constructor(
    private _svShared: SharedService,
    public SvDefault: DefaultService,
    private _svPosition : PositionService,
    private authGuard: AuthGuard,
  ) {

  }
  filterValue: string = "";
  private authPositionRole: any;
  @ViewChild(MatSort) sort: MatSort;
  dataSource = new MatTableDataSource<ModelMasPosition>();
  pageEvent: PageEvent;
  displayedColumns: string[] = [  'PositionCode', 'PositionName', 'PositionDesc', 'PositionStatus'];
  no = 0;
  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  async ngOnInit() {
    await this.SvDefault.DoActionAsync(async()=> await this.start() , true);
  }
  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  private async start(){
    this.authPositionRole = this.SvDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }
    await this.getArrayPosition(0);
  }

  ngAfterViewInit(){
    this.dataSource.sort = this.sort;
  }

  public async GetArrayPosition(pNumPage?: number){
    await this.SvDefault.DoActionAsync(async()=> await this.getArrayPosition(pNumPage) , true);
  }

  private async getArrayPosition(pNumPage?: number){
    this.dataSource.data = [];
    this.length = 0;
    let numPage: number = pNumPage || 1;
    let strKeyWord: string = this.SvDefault.GetString(this.filterValue);
    let param = new ModelGetPositionListParam();
    param.Page = numPage;
    param.ItemsPerPage = this.pageSize;
    param.Keyword = strKeyWord;
    let apiResult = await this._svPosition.GetPositionList(param);
    if(apiResult != null){
      this.dataSource.data = apiResult.ArrPosition;
      this.length = apiResult.TotalItem;
    }
  }

  async OnPaginateChange(pEvent: PageEvent) {
    await this.SvDefault.DoActionAsync(async () => await this.onPaginateChange(pEvent), true);
  }
  private async onPaginateChange(pEvent: PageEvent) {
    this.no = pEvent.pageIndex > 0 ? pEvent.pageIndex * pEvent.pageSize : 0;
    let page = pEvent.pageIndex+1;
    this.pageSize = pEvent.pageSize;
    // if (this.filterValue == null) {
    //   page = page + 1;
    // }
    await this.getArrayPosition(page);
  }

  public ShowMessage(pStrMessage: string) {
    this.SvDefault.DoAction(()=> this.showMessage(pStrMessage));
  }

  private showMessage(pStrMessage : string){
    pStrMessage = this.SvDefault.GetString(pStrMessage);
    Swal.fire(pStrMessage, "", "warning");
  }
}
