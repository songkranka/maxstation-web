import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { SharedService } from "../../../shared/shared.service";
import { DefaultService } from "src/app/service/default.service";
import { ModelCreditSalesHeader } from "../ModelInvoice";
import { MatTableDataSource } from "@angular/material/table";
import { PageEvent } from "@angular/material/paginator";
import { FormControl, FormGroup } from "@angular/forms";
import { AuthGuard } from "src/app/guards/auth-guard.service";
import { ModelSysMenu } from "src/app/model/ModelScaffold";
import { ShareDataService } from "src/app/shared/shared-service/data.service";

export class Doc {
  checked: boolean = false;
  custName: string = "";
  docNo: string = "";
  docDate: Date = null;
  docStatus: string = "";
  totalAmt: Number = 0.00;
  netAmt: Number = 0.00;
}

export class ProductService {
  pdId: string = "";
  pdName: string = "";
  pdName2: string = "";
}
@Component({
  selector: "app-InvoiceList",
  templateUrl: "./InvoiceList.component.html",
  styleUrls: ["./InvoiceList.component.scss"],
})
export class InvoiceListComponent implements OnInit {
  private _strApiUrl: string = "";
  private _strApiSearchInvoice: string = "/api/Invoice/SearchInvoice";
  private _strBrnCode: string = "";
  private _strCompCode: string = "";
  private _strLocCode: string = "";
  ArrProductService: ProductService[] = [];

  ArrColumnDisplay: string[] = ['index', 'docNo', 'docDate', 'custName', 'netAmt', 'docStatus'];
  DataSource = new MatTableDataSource<ModelCreditSalesHeader>();
  no = 0;
  length = 0;
  pageSize = 10;
  pageEvent: PageEvent;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  filterValue: string = null;
  private authPositionRole: any;

  @ViewChild('txtSearch') _txtSearch: ElementRef<HTMLInputElement>;
  constructor(
    private httpClient: HttpClient,
    private sharedService: SharedService,
    public SvDefault: DefaultService,
    private authGuard: AuthGuard,
  ) {
  }

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }
  
  async ngOnInit(): Promise<void> {
    this.authPositionRole = this.SvDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }
    let dateStart = new Date(new Date(this.sharedService.systemDate).setDate(new Date(this.sharedService.systemDate).getDate() - 1));
    let dateEnd = new Date(this.sharedService.systemDate);
    this.dateRange.get('start').setValue(dateStart);
    this.dateRange.get('end').setValue(dateEnd);
    await this.SvDefault.DoActionAsync(async () => {
      if (!await this.SvDefault.CheckSessionAsync()) {
        return;
      }
      this._strApiUrl = (this.sharedService.urlSale || "").toString().trim();
      this._strBrnCode = (this.sharedService.brnCode || "").toString().trim();
      this._strCompCode = (this.sharedService.compCode || "").toString().trim();
      this._strLocCode = (this.sharedService.locCode || "").toString().trim();

      await this.SearchInvoiceAsync();
    });
  }


  async SearchInvoiceAsync(pNumPage?: number): Promise<void> {
    await this.SvDefault.DoActionAsync(async () => {
      let numPage: number = pNumPage || 1;
      let strKeyWord: string = (this.filterValue || "").toString().trim();
      let startDate = "";
      startDate = <any>this.SvDefault.GetFormatDate(this.dateRange?.value?.start);
      let endDate = "";
      endDate = <any>this.SvDefault.GetFormatDate(this.dateRange?.value?.end);

      if (this._strApiUrl === "") {
        return;
      }

      let param: HttpParams = new HttpParams();
      param = param.append("COMP_CODE", this._strCompCode);
      param = param.append("BRN_CODE", this._strBrnCode);
      if (strKeyWord != "") {
        param = param.append("KeyWord", strKeyWord);
      }
      if (startDate != null) {
        param = param.append("StartDate", startDate);
      }
      if (endDate != null) {
        param = param.append("EndDate", endDate);
      }
      param = param.append("LOC_CODE", this._strLocCode);
      param = param.append("Page", numPage.toString());
      param = param.append("ItemsPerPage", this.pageSize.toString());

      let response: any = await this.httpClient.get(this._strApiUrl + this._strApiSearchInvoice, { params: param }).toPromise();
      let arrCreditSalesHeader = <ModelCreditSalesHeader[]>response.items;
      let listLength = response.totalItems;
      this.length = listLength;
      this.DataSource.data = arrCreditSalesHeader;
    }, true);
  }

  async OnPaginateChange(pEvent: PageEvent) {
    await this.SvDefault.DoActionAsync(async () => await this.onPaginateChange(pEvent), true);
  }
  private async onPaginateChange(pEvent: PageEvent) {

    this.no = pEvent.pageIndex > 0 ? pEvent.pageIndex * pEvent.pageSize : 0;
    this.pageSize = pEvent.pageSize || 0;
    let numPageIndex = pEvent.pageIndex || 0;
    if (this.filterValue == null) {
      numPageIndex = numPageIndex + 1;
    }

    await this.SearchInvoiceAsync(numPageIndex);
  }
}
