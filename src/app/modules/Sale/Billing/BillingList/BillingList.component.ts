import { Component, OnInit } from "@angular/core";
import { async } from "@angular/core/testing";
import { FormControl, FormGroup } from "@angular/forms";
import { PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { ENGINE_METHOD_CIPHERS } from "constants";
import * as moment from "moment";
import { AuthGuard } from "src/app/guards/auth-guard.service";
import {
  ModelSaleBillingHeader,
  ModelSearchBillingInput,
} from "src/app/model/ModelBilling";
import { ModelMasEmployee, ModelSalBillingHd } from "src/app/model/ModelScaffold";
import { ServiceBilling } from "src/app/service/billing-service/ServiceBilling.service";
import { DefaultService } from "src/app/service/default.service";
import { SharedService } from "src/app/shared/shared.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-BillingList",
  templateUrl: "./BillingList.component.html",
  styleUrls: ["./BillingList.component.scss"],
})
export class BillingListComponent implements OnInit {
  private _arrEmp: ModelMasEmployee[] = [];
  filterValue: string = null;
  dataSource = new MatTableDataSource<ModelSalBillingHd>();
  pageEvent: PageEvent;
  no = 0;
  length = 0;
  pageSize = 10;
  displayedColumns: string[] = [
    // "check",
    "no",
    "docno",
    "docdate",
    "custCode",
    "custName",
    "totalAmt",
    "docstatus",
  ];
  pageSizeOptions: number[] = [5, 10, 25, 100];
  IsLoading = false;
  private authPositionRole: any;

  constructor(
    private _router: Router,
    private activatedRoute: ActivatedRoute,
    private _svBilling: ServiceBilling,
    private _svShared: SharedService,
    public SvDefault: DefaultService,
    private authGuard: AuthGuard,
  ) { }
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  async ngOnInit() {
    // let dateStart = new Date(new Date(this._svShared.systemDate).setMonth(new Date(this._svShared.systemDate).getMonth() - 1));
    // let dateEnd = new Date(this._svShared.systemDate);
    // this.dateRange.get('start').setValue(dateStart);
    // this.dateRange.get('end').setValue(dateEnd);
    // if (!this.SvDefault.CheckSession()) {
    //   return;
    // }
    // this.findByValue();
    this.authPositionRole = this.SvDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }
    await this.SvDefault.DoActionAsync(async () => await this.start(), true);
  }

  private async start() {
    let dateStart = new Date(new Date(this._svShared.systemDate).setDate(new Date(this._svShared.systemDate).getDate() - 1));
    let dateEnd = new Date(this._svShared.systemDate);
    this.dateRange.get('start').setValue(dateStart);
    this.dateRange.get('end').setValue(dateEnd);
    if (!this.SvDefault.CheckSession()) {
      return;
    }
    //await this.FindByValueAsync();
    await this.findByValueAsync();
  }

  public async FindByValueAsync(pNumPage?: number) {
    await this.SvDefault.DoActionAsync(async () => await this.findByValueAsync(pNumPage), true);
  }

  private async findByValueAsync(pNumPage?: number) {
    let numPage: number = pNumPage || 1;
    let strKeyWord = this.SvDefault.GetString(this.filterValue);
    let startDate = <any>this.SvDefault.GetFormatDate(this.dateRange?.value?.start);
    let endDate = <any>this.SvDefault.GetFormatDate(this.dateRange?.value?.end);
    let param = <ModelSearchBillingInput>{
      keyword: strKeyWord,
      page: numPage,
      itemsPerPage: this.pageSize,
      brnCode: this._svShared.brnCode || "",
      compCode: this._svShared.compCode || "",
      locCode: this._svShared.locCode || "",
      fromDate: startDate,
      toDate: endDate
    };
    let apiResult = await this._svBilling.SearchBillingAsync(param);
    if (apiResult != null) {
      this.dataSource.data = apiResult.ArrHeader;
      this.length = apiResult.TotalItems;
      this._arrEmp = apiResult.ArrEmployee;
    }
  }
  public GetEmpName(pStrEmpCode: string) {
    let result = "";
    this.SvDefault.DoAction(() => {
      result = this.getEmpName(pStrEmpCode);
    });
    return result;
  }

  private getEmpName(pStrEmpCode: string) {
    if (!this.SvDefault.IsArray(this._arrEmp)) {
      return "";
    }
    let emp = this._arrEmp.find(x => x.EmpCode === pStrEmpCode);
    let result = `${emp.PrefixThai} ${emp.PersonFnameThai} ${emp.PersonLnameThai}`;
    return result;
  }

  // findByValue(pNumPage?: number) {
  //   let numPage: number = pNumPage || 1;
  //   let strKeyWord: string = (this.filterValue || "").toString().trim();
  //   let startDate: Date = null;
  //   startDate = <any>this.SvDefault.GetFormatDate(this.dateRange?.value?.start);
  //   let endDate: Date = null;
  //   endDate = <any>this.SvDefault.GetFormatDate(this.dateRange?.value?.end);

  //   let modelSearchBillingInput = <ModelSearchBillingInput>{
  //     keyword: strKeyWord,
  //     page: numPage,
  //     itemsPerPage: this.pageSize,
  //     brnCode: this._svShared.brnCode || "",
  //     compCode: this._svShared.compCode || "",
  //     locCode: this._svShared.locCode || "",
  //     fromDate: startDate,
  //     toDate: endDate
  //   };
  //   Swal.showLoading();
  //   this._svBilling.SearchBilling(modelSearchBillingInput, (x) => {
  //     this.dataSource.data = x["items"];
  //     this.length = x["totalItems"];
  //     Swal.close();
  //   });
  //   // this.cashsaleService.findAll(this.sharedService.brnCode, this.sharedService.compCode, value, this.dateRange.value.start, this.dateRange.value.end, 1, this.pageSize)
  //   // .subscribe((page: CashsaleData<Cashsale>) => {
  //   //   this.dataSource.data = this.toTableData(page.items);
  //   //   this.length = page.totalItems;
  //   // });
  // }




  async changeEvent() {
    await this.SvDefault.DoActionAsync(async () => {
      if (this.dateRange?.value?.end == null) {
        return;
      }
      //this.findByValue();
      await this.FindByValueAsync();
    }, true);

  }
  navigateToProfile(id) {
    this._router.navigate(["/Cashsale/" + id], {
      relativeTo: this.activatedRoute,
    });
  }
  public async OnPaginateChange(event: PageEvent) {
    await this.SvDefault.DoActionAsync(async () => await this.onPaginateChange(event), true);
  }
  private async onPaginateChange(event: PageEvent) {
    this.no = event.pageIndex > 0 ? event.pageIndex * event.pageSize : 0;
    let page = event.pageIndex;
    this.pageSize = event.pageSize;
    if (this.filterValue == null) {
      page = page + 1;

      await this.findByValueAsync(page);
    }
  }
}
