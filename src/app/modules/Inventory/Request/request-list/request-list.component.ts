
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SharedService } from '../../../../shared/shared.service';
import swal from 'sweetalert2';
import { RequestData, RequestService } from 'src/app/service/request-service/request-service';
import { Request } from 'src/app/model/request.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import { DefaultService } from 'src/app/service/default.service';
import { AuthGuard } from 'src/app/guards/auth-guard.service';

//==================== Model ====================
//*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z
interface TableData {
  docdate: Date;
  docno: string;
  docstatus: string;
  doctype: string;
  vatamtcur: number;
  netAmt: number;
  guid: string;
}

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss']
})

export class RequestListComponent implements OnInit, AfterViewInit {
  filterValue: string = null;
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  dataSource = new MatTableDataSource<TableData>();
  pageEvent: PageEvent;
  displayedColumns: string[] = ['no', 'docno', 'docdate', 'doctype', 'docstatus'];
  no = 0;
  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  urlSale = this.sharedService.urlSale;
  urlMas = this.sharedService.urlMas;
  private authPositionRole: any;

  @ViewChild(MatSort) sort: MatSort;

  //==================== constructor ====================
  //*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z
  constructor(
    private activatedRoute: ActivatedRoute,
    private requestService: RequestService,
    private router: Router,
    private sharedService: SharedService,
    public SvDefault: DefaultService,
    private authGuard: AuthGuard,
  ) { }

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  //==================== ngOnInit ====================
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
  };

  //==================== Function ====================
  //*** กรุณาเรียงชื่อฟังก์ชันตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z

  //       "BrnCode": this.sharedService.brnCode,
  //       "CompCode": this.sharedService.compCode,
  //       "DocDate": this.sharedService.systemDate,
  //       "DocNo": "",
  //       "DocType": "Request",
  //       "Keyword" : this.keyword,
  //       "LocCode": this.sharedService.locCode,
  //       "PdGroupID": "",

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
  }

  async FindByValue(value: string) {
    await this.SvDefault.DoActionAsync(async () => this.findByValue(value), true);
  }

  async findByValue(value: string) {
    let response = await this.requestService.findAll(this.sharedService.brnCode, this.sharedService.compCode, this.sharedService.locCode, this.filterValue, this.dateRange.value.start, this.dateRange.value.end, 1, this.pageSize)
      .toPromise();
    response.Data = this.convertDocStatus(response.Data);
    this.dataSource.data = this.toTableData(response.Data);
    this.length = response.totalItems;
  }

  navigateToProfile(id) {
    this.router.navigate(['/Request/' + id], { relativeTo: this.activatedRoute });
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

      let response = await this.requestService.findAll(this.sharedService.brnCode, this.sharedService.compCode, this.sharedService.locCode, this.filterValue, this.dateRange.value.start, this.dateRange.value.end, page, size)
        .toPromise();
      response.Data = this.convertDocStatus(response.Data);
      this.dataSource.data = this.toTableData(response.Data);
      this.length = response.totalItems;
    } else {
      let response = await this.requestService.findAll(this.sharedService.brnCode, this.sharedService.compCode, this.sharedService.locCode, this.filterValue, this.dateRange.value.start, this.dateRange.value.end, page, size)
        .toPromise();
      response.Data = this.convertDocStatus(response.Data);
      this.dataSource.data = this.toTableData(response.Data);
      this.length = response.totalItems;
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

  private toTableData(obj: Request[]): TableData[] {
    return obj.map(item => {
      return {
        docdate: item.DocDate,
        docno: item.DocNo,
        docstatus: item.DocStatus,
        doctype: item.PdGroupName,
        vatamtcur: 0,
        netAmt: item.NetAmt,
        guid: item.Guid,
      };
    });
  }

  convertDocStatus(obj: Request[]) {
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
