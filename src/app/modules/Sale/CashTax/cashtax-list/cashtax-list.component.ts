import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SharedService } from '../../../../shared/shared.service';
import swal from 'sweetalert2';
import { CashtaxData, CashtaxService } from 'src/app/service/cashtax-service/cashtax-service';
import { Cashtax } from 'src/app/model/cashtax.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import { DefaultService } from 'src/app/service/default.service';
import { AuthGuard } from 'src/app/guards/auth-guard.service';

interface TableData {
  docdate: Date;
  docno: string;
  doctype: string;
  custname: string;
  docstatus: string;
  vatamt: number;
  vatamtcur: number;
  guid: string;
  netamt: number;
  netamtcur: number;
}

@Component({
  selector: 'app-cashtax-list',
  templateUrl: './cashtax-list.component.html',
  styleUrls: ['./cashtax-list.component.scss']
})
export class CashtaxListComponent implements OnInit, AfterViewInit {
  filterValue: string = null;
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  dataSource = new MatTableDataSource<TableData>();
  pageEvent: PageEvent;
  displayedColumns: string[] = ['no', 'docno', 'docdate', 'doctype', 'customername', 'netamt', 'docstatus'];
  no = 0;
  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  urlSale = this.sharedService.urlSale;
  urlMas = this.sharedService.urlMas;
  private authPositionRole: any;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private activatedRoute: ActivatedRoute,
    private cashtaxService: CashtaxService,
    private router: Router,
    private sharedService: SharedService,
    public SvDefault: DefaultService,
    private authGuard: AuthGuard,
  ) {

  }

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  ngOnInit(): void {
    this.authPositionRole = this.SvDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }
    let dateStart = new Date(new Date(this.sharedService.systemDate).setDate(new Date(this.sharedService.systemDate).getDate() - 1));
    let dateEnd = new Date(this.sharedService.systemDate);
    this.dateRange.get('start').setValue(dateStart);
    this.dateRange.get('end').setValue(dateEnd);
    this.checkSession();
    this.findByValue("");
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  checkSession = () => {
    if ((this.sharedService.compCode === null || this.sharedService.compCode === undefined || this.sharedService.compCode === "")
      && (this.sharedService.brnCode === null || this.sharedService.brnCode === undefined || this.sharedService.brnCode === "")
      && (this.sharedService.locCode === null || this.sharedService.locCode === undefined || this.sharedService.locCode === "")
      && (this.sharedService.user === null || this.sharedService.user === undefined || this.sharedService.user === "")
    ) {
      swal.fire('กรุณาเข้าสู่ระบบอีกครั้ง', '', 'error')
        .then(() => {
          this.router.navigate(["Login"]);
        });
    }
  };
  GetThaiStatus(pStrInput: string) {
    pStrInput = (pStrInput || "").toString().trim();
    switch (pStrInput) {
      case "Invoice":
        return "ใบแจ้งหนี้"
      case "CreditSale":
        return "ขายเชื่อ"
      // return "ขายสด"
      case "CashSale":
      case "CashTax":
        return "ขายสด"
      default:
        return "";
    }
  }

  async FindByValue(value: string) {
    await this.SvDefault.DoActionAsync(async () => this.findByValue(value), true);
  }

  async findByValue(value: string) {
    let response = await this.cashtaxService.findAll(this.sharedService.brnCode, this.sharedService.compCode, value, this.dateRange.value.start, this.dateRange.value.end, 1, this.pageSize)
      .toPromise();
    response.Data = this.convertDocStatus(response.items);
    this.dataSource.data = this.toTableData(response.items);
    this.length = response.totalItems;
  }

  navigateToProfile(id: string) {
    this.router.navigate(['/Cashtax/' + id], { relativeTo: this.activatedRoute });
  }

  async OnPaginateChange(event: PageEvent) {
    await this.SvDefault.DoActionAsync(async () => this.onPaginateChange(event), true);
  }

  async onPaginateChange(event: PageEvent) {
    this.no = event.pageIndex > 0 ? event.pageIndex * event.pageSize : 0;
    let page = event.pageIndex;
    let size = event.pageSize;

    if (this.filterValue == null) {
      page = page + 1;

      let response = await this.cashtaxService.findAll(this.sharedService.brnCode, this.sharedService.compCode, this.filterValue, this.dateRange.value.start, this.dateRange.value.end, page, size)
        .toPromise();
      response.Data = this.convertDocStatus(response.items);
      this.dataSource.data = this.toTableData(response.items);
      this.length = response.totalItems;
    } else {
      let response = await this.cashtaxService.findAll(this.sharedService.brnCode, this.sharedService.compCode, this.filterValue, this.dateRange.value.start, this.dateRange.value.end, page, size)
        .toPromise();
      response.Data = this.convertDocStatus(response.items);
      this.dataSource.data = this.toTableData(response.items);
      this.length = response.totalItems;
    }
  }

  private toTableData(books: Cashtax[]): TableData[] {
    return books.map(b => {
      return {
        docdate: b.docDate,
        docno: b.docNo,
        doctype: b.docType,
        custcode: b.custCode,
        custname: b.custName,
        docstatus: b.docStatus,
        vatamt: b.vatAmt,
        vatamtcur: b.vatAmtCur,
        guid: b.guid,
        netamt: b.netAmt,
        netamtcur: b.netAmtCur
      };
    });
  }

  convertDocStatus(obj: Cashtax[]) {
    obj.forEach(element => {
      if (element.docStatus == "Active") {
        element.docStatus = "แอคทีฟ";
      } else if (element.docStatus == "Wait") {
        element.docStatus = "รออนุมัติ";
      } else if (element.docStatus == "Ready") {
        element.docStatus = "พร้อมใช้";
      } else if (element.docStatus == "Reference") {
        element.docStatus = "เอกสารถูกอ้างอิง";
      } else if (element.docStatus == "Cancel") {
        element.docStatus = "ยกเลิก";
      }
    });
    return obj;
  }
}