import { Component, Input, OnInit } from '@angular/core';
import { CsModelInvTranoutHd, ModelGetToDoTaskData, ResponseWarpadTaskData } from 'src/app/model/ModelDashboard';
import { ModelInvRequestHd } from 'src/app/model/ModelScaffold';
import { DashboardService } from 'src/app/service/dashboard-service/dashboard-service';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import { PageEvent } from '@angular/material/paginator';
import { ProductDisplay } from 'src/app/model/master/meter.interface';
import { DomSanitizer } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { BranchMasterService } from 'src/app/service/branch-service/branch-master-service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthGuard } from 'src/app/guards/auth-guard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  productDisplayList: Array<ProductDisplay> = [];
  warpadTaskList: Array<ResponseWarpadTaskData> = [];
  requestList: Array<ModelInvRequestHd> = [];
  transferOutList: Array<CsModelInvTranoutHd> = [];
  lastEffectiveDate: Date = null;
  pageRequest = 1;
  lengthRequest = 0;
  pageSizeRequest = 10;
  pageTransferOut = 1;
  lengthTransferOut = 0;
  pageSizeTransferOut = 10;
  pageEvent: PageEvent;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  branch: string;
  navigationSubscription;
  ArrToDoTask : ModelGetToDoTaskData[] = [];

  constructor(
    public SvDefault: DefaultService,
    public _svDashboard: DashboardService,
    public _svShared: SharedService,
    public branchMasterService: BranchMasterService,
    private _sanitizer: DomSanitizer,
    private router: Router,
    private authGuard: AuthGuard,
    private http: HttpClient
  ) {
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      // If it is a NavigationEnd event re-initalise the component
      if (e instanceof NavigationEnd) {
        this.initialiseInvites();
      }
    });
  }

  async initialiseInvites() {
    // Set default values and re-fetch any data you need.
    await this.SvDefault.DoActionAsync(async () => await this.start(), true);
  }

  ngOnDestroy() {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate()
  }

  async ngOnInit(): Promise<void> {
    await this.SvDefault.DoActionAsync(async () => await this.start(), true);
  }

  private async start() {
    // const jwtToken = localStorage.getItem('jwt');
    // const httpOptions = {
    //   headers: new HttpHeaders({
    //     "Content-Type": "application/json",
    //     "Authorization": `Bearer ${jwtToken}`
    //   })
    // }

    // this.http.post("https://localhost:44309/api/Company/GetAll", null).pipe()
    //   .subscribe((data: any) => {
    //     console.log(data);
    //   });
    await this.getProductDisplay();
    await this.getReqeustList();
    await this.getTransferOutList();
    await this.getWarpadTaskList();
    await this.GetBranch();
    await this.GetToDoTask(this._svShared.user);
  }

  private async GetBranch() {
    let masBranch = await this.branchMasterService.GetBranchDetail(this._svShared.brnCode);
    let branchData = masBranch['Data']
    this.branch = branchData.BrnCode + ': ' + branchData.BrnName;
  }

  private async getProductDisplay() {
    this.productDisplayList = [];
    let response = await this._svDashboard.getProductDisplay(this._svShared.compCode, this._svShared.brnCode, this._svShared.locCode, this.SvDefault.GetFormatDate(this._svShared.systemDate));
    if (response.isSuccess) {
      this.lastEffectiveDate = response.data.lastEffectiveDate;
      response.data.items.forEach(element => {
        this.productDisplayList.push(new ProductDisplay(
          element["pdId"],
          element["pdName"],
          this._sanitizer.bypassSecurityTrustResourceUrl(<string>element["pdImage"]),
          element["unitprice"],
        ));
      });
    }
  }

  private async getWarpadTaskList() {
    let response = await this._svDashboard.getWarpadTaskList(this._svShared.user);
    if (response["statusCode"] == 200) {
      this.warpadTaskList = response["data"];
    }
  }

  private async getReqeustList(page: number = this.pageRequest, pageSize: number = this.pageSizeRequest) {
    this.pageRequest = page;
    this.pageSizeRequest = pageSize;
    let response = await this._svDashboard.getReqeustList(this._svShared.compCode, this._svShared.brnCode, this._svShared.locCode, this.SvDefault.GetFormatDate(this._svShared.systemDate), page, pageSize);
    if (response.isSuccess) {
      this.requestList = response.items;
      this.lengthRequest = response.totalItems;
    }
  }

  private async getTransferOutList(page: number = this.pageTransferOut, pageSize: number = this.pageSizeTransferOut) {
    this.pageTransferOut = page;
    this.pageSizeTransferOut = pageSize;
    let response = await this._svDashboard.getTransferOutList(this._svShared.compCode, this._svShared.brnCode, this._svShared.locCode, this.SvDefault.GetFormatDate(this._svShared.systemDate), page, pageSize);
    if (response.isSuccess) {
      this.transferOutList = response.items;
      this.lengthTransferOut = response.totalItems;
    }
  }

  async onPaginateChange(event: PageEvent, table: string) {
    await this.SvDefault.DoActionAsync(async () => await this.OnPaginateChange(event.pageIndex, event.pageSize, table), true);
  }

  private async OnPaginateChange(page: number, pageSize: number, table: string) {
    switch (table) {
      case "Request":
        await this.getReqeustList(page + 1, pageSize);
        break;
      case "TransferOut":
        await this.getTransferOutList(page + 1, pageSize);
        break;
    }
  }

  splitAtFirstSpace(str) {
    if (!str) return [];
    var i = str.indexOf(' ');
    if (i > 0) {
      return [str.substring(0, i), str.substring(i + 1)];
    }
    else return [str];
  }

  private async GetToDoTask(pStrEmpId : string){
    let apiResult = await this._svDashboard.GetToDoTask(pStrEmpId);
    if(apiResult == null){
      return;
    }
    if(this.SvDefault.IsArray(apiResult.resultData)){
      this.ArrToDoTask = apiResult.resultData.filter(x=> x.TaskStatus === "P");
    }
  }
}
