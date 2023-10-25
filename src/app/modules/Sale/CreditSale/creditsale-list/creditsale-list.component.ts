import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SharedService } from '../../../../shared/shared.service';
import swal from 'sweetalert2';
import { CreditsaleData, CreditsaleService } from 'src/app/service/creditsale-service/creditsale-service';
import { Creditsale } from 'src/app/model/creditsale.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import { DefaultService } from 'src/app/service/default.service';
import { async } from '@angular/core/testing';
import { AuthGuard } from 'src/app/guards/auth-guard.service';

interface TableData {
  docdate: Date;
  docno: string;
  docstatus: string;
  vatamtcur: number;
  netAmt: number;
  guid: string;
  customer: string;
}

@Component({
  selector: 'app-creditsale-list',
  templateUrl: './creditsale-list.component.html',
  styleUrls: ['./creditsale-list.component.scss']
})
export class CreditsaleListComponent implements OnInit, AfterViewInit {
  filterValue: string = null;
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  dataSource = new MatTableDataSource<TableData>();
  pageEvent: PageEvent;
  displayedColumns: string[] = ['no', 'docno', 'docdate', 'customer', 'netAmt', 'docstatus'];
  no = 0;
  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  urlSale = this.sharedService.urlSale;
  urlMas = this.sharedService.urlMas;
  private authPositionRole: any;
  @ViewChild(MatSort) sort: MatSort;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    private activatedRoute: ActivatedRoute,
    private creditsaleService: CreditsaleService,
    private router: Router,
    private sharedService: SharedService,
    public SvDefault: DefaultService,
    private authGuard: AuthGuard,
  ) {
  }

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  async ngOnInit() {
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
    await this.findByValue();
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

  async FindByValue() {
    await this.SvDefault.DoActionAsync(async () => this.findByValue(), true);
  }

  async findByValue() {
    let response = await this.creditsaleService.findAll(this.sharedService.brnCode, this.sharedService.compCode, this.sharedService.locCode, this.filterValue, this.dateRange.value.start, this.dateRange.value.end, 1, this.pageSize, this.SvDefault.GetFormatDate(<Date>this.sharedService.systemDate))
      .toPromise();
    response.Data = this.convertDocStatus(response.Data);
    this.dataSource.data = this.toTableData(response.Data);
    this.length = response.TotalItems;
  }

  navigateToProfile(id) {
    this.router.navigate(['/CreditSale/' + id], { relativeTo: this.activatedRoute });
  }


  async OnPaginateChange(event: PageEvent) {
    await this.SvDefault.DoActionAsync(async () => this.onPaginateChange(event), true);
  }

  async onPaginateChange(event: PageEvent) {
    this.no = event.pageIndex > 0 ? event.pageIndex * event.pageSize : 0;
    let page = event.pageIndex || 0;
    this.pageSize = event.pageSize || 0;
    if (this.filterValue == null) {
      page = page + 1;

      let response = await this.creditsaleService.findAll(this.sharedService.brnCode, this.sharedService.compCode, this.sharedService.locCode, this.filterValue, this.dateRange.value.start, this.dateRange.value.end, page, this.pageSize, this.SvDefault.GetFormatDate(<Date>this.sharedService.systemDate))
        .toPromise();
      response.Data = this.convertDocStatus(response.Data);
      this.dataSource.data = this.toTableData(response.Data);
      this.length = response.TotalItems;
    } else {
      let response = await this.creditsaleService.findAll(this.sharedService.brnCode, this.sharedService.compCode, this.sharedService.locCode, this.filterValue, this.dateRange.value.start, this.dateRange.value.end, page, this.pageSize, this.SvDefault.GetFormatDate(<Date>this.sharedService.systemDate))
        .toPromise();
      response.Data = this.convertDocStatus(response.Data);
      this.dataSource.data = this.toTableData(response.Data);
      this.length = response.TotalItems;
    }
  }

  parse(value: any): Date | null {
    if ((typeof value === 'string') && (value.includes('/'))) {
      const str = value.split('/');
      const year = Number(str[2]);
      const month = Number(str[1]) - 1;
      const date = Number(str[0]);

      return new Date(year, month, date);
    } else if ((typeof value === 'string') && value === '') {
      return new Date();
    }
    const timestamp = typeof value === 'number' ? value : Date.parse(value);
    return isNaN(timestamp) ? null : new Date(timestamp);
  }

  private toTableData(obj: Creditsale[]): TableData[] {
    return obj.map(item => {
      return {
        docdate: item.DocDate,
        docno: item.DocNo,
        docstatus: item.DocStatus,
        vatamtcur: item.VatAmtCur,
        netAmt: item.NetAmt,
        guid: item.Guid,
        customer: item.CustCode + " &nbsp; &nbsp; " + item.CustName,
      };
    });
  }

  convertDocStatus(obj: Creditsale[]) {
    obj.forEach(element => {
      if (element.DocStatus == "Active") {
        element.DocStatus = "แอคทีฟ";
      } else if (element.DocStatus == "Wait") {
        element.DocStatus = "รออนุมัติ";
      } else if (element.DocStatus == "Ready") {
        element.DocStatus = "พร้อมใช้";
      } else if (element.DocStatus == "Reference") {
        element.DocStatus = "เอกสารถูกอ้างอิง";
      } else if (element.DocStatus == "Cancel") {
        element.DocStatus = "ยกเลิก";
      }
    });
    return obj;
  }

}
