import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SharedService } from '../../../../shared/shared.service';
import Swal from 'sweetalert2';
import { RequestData, RequestService } from 'src/app/service/request-service/request-service';
import { Request } from 'src/app/model/request.interface';
import { Router, ActivatedRoute } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup } from '@angular/forms';
import { DefaultService } from 'src/app/service/default.service';
import { TransferOutService } from 'src/app/service/transfer-out-service/TransferOut.service';
import { ModelTransferOutHD, ModelTransferOutQueryResource } from 'src/app/model/ModelTransferOut';
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
  selector: 'app-transferout-list',
  templateUrl: './transferout-list.component.html',
  styleUrls: ['./transferout-list.component.scss']
})
export class TransferOutListComponent implements OnInit, AfterViewInit {
  filterValue: string = null;
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  // dataSource = new MatTableDataSource<TableData>();
  dataSource = new MatTableDataSource<ModelTransferOutHD>();
  pageEvent: PageEvent;
  displayedColumns: string[] = ['no', 'docNo', 'docDate', 'updateBy', 'refNo', 'status'];
  no = 0;
  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  urlSale = this._svShared.urlSale;
  urlMas = this._svShared.urlMas;
  private authPositionRole: any;

  @ViewChild(MatSort) sort: MatSort;

  //==================== constructor ====================
  //*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z
  constructor(
    private activatedRoute: ActivatedRoute,
    // private requestService: RequestService,
    private router: Router,
    private _svShared: SharedService,
    public SvDefault: DefaultService,
    private _svTransferOut: TransferOutService,
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
    let dateStart = new Date(new Date(this._svShared.systemDate).setDate(new Date(this._svShared.systemDate).getDate() - 1));
    let dateEnd = new Date(this._svShared.systemDate);
    this.dateRange.get('start').setValue(dateStart);
    this.dateRange.get('end').setValue(dateEnd);
    if (!this.SvDefault.CheckSession()) {
      return;
    };
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

  findByValue(value: string) {
    Swal.fire({
      title: 'กำลังโหลดข้อมูล กรุณารอสักครู่',
      allowEscapeKey: false,
      allowOutsideClick: false,
    });
    Swal.showLoading();
    let param = new ModelTransferOutQueryResource();
    param.brnCode = this._svShared.brnCode || "";
    param.compCode = this._svShared.compCode || "";
    param.locCode = this._svShared.locCode || "";
    param.keyword = this.filterValue || "";
    param.skip = 0;
    param.take = this.pageSize || 0;
    param.fromDate = <any>this.SvDefault.GetFormatDate(this.dateRange?.value?.start);
    param.toDate = <any>this.SvDefault.GetFormatDate(this.dateRange?.value?.end);
    this._svTransferOut.SearchTranOut(param, pResponseData => {
      this.length = pResponseData?.totalItems || 0;
      this.dataSource.data = pResponseData?.data || [];
      Swal.close();
    });
  }

  navigateToProfile(id) {
    this.router.navigate(['/Request/' + id], { relativeTo: this.activatedRoute });
  }

  onPaginateChange(event: PageEvent) {
    this.no = event.pageIndex > 0 ? event.pageIndex * event.pageSize : 0;
    let page = event.pageIndex || 0;
    let size = event.pageSize || 0;

    if (this.filterValue == null) {
      page = page + 1;
    } else {

    }
    Swal.fire({
      title: 'กำลังโหลดข้อมูล กรุณารอสักครู่',
      allowEscapeKey: false,
      allowOutsideClick: false,
    });
    Swal.showLoading();
    let param = new ModelTransferOutQueryResource();
    param.brnCode = this._svShared.brnCode || "";
    param.compCode = this._svShared.compCode || "";
    param.locCode = this._svShared.locCode || "";
    param.keyword = this.filterValue || "";
    param.skip = (page - 1) * size;
    param.take = size;
    param.fromDate = <any>this.SvDefault.GetFormatDate(this.dateRange?.value?.start);
    param.toDate = <any>this.SvDefault.GetFormatDate(this.dateRange?.value?.end);

    this._svTransferOut.SearchTranOut(param, pResponseData => {
      this.length = pResponseData?.totalItems || 0;
      this.dataSource.data = pResponseData?.data || [];
      Swal.close();
    });
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
