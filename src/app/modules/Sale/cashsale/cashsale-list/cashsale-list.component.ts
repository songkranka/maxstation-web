import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SharedService } from '../../../../shared/shared.service';
import swal from 'sweetalert2';
import { CashsaleData, CashsaleService } from 'src/app/service/cashsale-service/cashsale-service';
import { Cashsale } from 'src/app/model/cashsale.interface';
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
  docstatus: string;
  vatamtcur: number;
  guid: string;
  netamt: number;
}

@Component({
  selector: 'app-cashsale-list',
  templateUrl: './cashsale-list.component.html',
  styleUrls: ['./cashsale-list.component.scss']
})
export class CashsaleListComponent implements OnInit, AfterViewInit {
  filterValue: string = null;
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });

  dataSource = new MatTableDataSource<TableData>();
  pageEvent: PageEvent;
  displayedColumns: string[] = ['no', 'docno', 'docdate', 'refNo', 'vatamtcur', 'docstatus'];
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
    private cashsaleService: CashsaleService,
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
    if (!this.SvDefault.CheckSession()) {
      return;
    }
    this.findByValue("");
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  async FindByValue(value: string) {
    await this.SvDefault.DoActionAsync2(async () => this.findByValue(value), true , 2);
  }

  async findByValue(value: string) {
    this.dataSource.data = [];
    this.length = 0;
    let response : any = await this.cashsaleService.findAll(this.sharedService.brnCode, this.sharedService.compCode, value, this.dateRange.value.start, this.dateRange.value.end, 1, this.pageSize, this.SvDefault.GetFormatDate(<Date>this.sharedService.systemDate))
      .toPromise();
    if(!this.SvDefault.IsArray(response?.Items)){
      return;
    }
    // response.Data = this.convertDocStatus(response.items);
    // this.dataSource.data = this.toTableData(response.items);
    // this.length = response.totalItems;
    response.Data = this.convertDocStatus(response.Items);
      this.dataSource.data = this.toTableData(response.Items);
      this.length = response.TotalItems;
  }

  navigateToProfile(id) {
    this.router.navigate(['/Cashsale/' + id], { relativeTo: this.activatedRoute });
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

      let response : any = await this.cashsaleService.findAll(this.sharedService.brnCode, this.sharedService.compCode, this.filterValue, this.dateRange.value.start, this.dateRange.value.end, page, size, this.SvDefault.GetFormatDate(<Date>this.sharedService.systemDate))
        .toPromise();
      response.Data = this.convertDocStatus(response.Items);
      this.dataSource.data = this.toTableData(response.Items);
      this.length = response.TotalItems;
    } else {
      let response : any = await this.cashsaleService.findAll(this.sharedService.brnCode, this.sharedService.compCode, this.filterValue, this.dateRange.value.start, this.dateRange.value.end, page, size, this.SvDefault.GetFormatDate(<Date>this.sharedService.systemDate))
        .toPromise();
      // response.Data = this.convertDocStatus(response.items);
      // this.dataSource.data = this.toTableData(response.items);
      // this.length = response.totalItems;
      response.Data = this.convertDocStatus(response.Items);
      this.dataSource.data = this.toTableData(response.Items);
      this.length = response.TotalItems;
    }
  }

  private toTableData(cashsale: any[]): TableData[] {
    if(!this.SvDefault.IsArray(cashsale)){
      return;
    }
    return cashsale.map(b => {
      return {
        docdate: b.DocDate,
        refNo: b.RefNo,
        docno: b.DocNo,
        docstatus: b.DocStatus,
        vatamtcur: b.VatAmtCur,
        guid: b.Guid,
        netamt: b.NetAmt
      };
    });
  }
  private toTableDataOld(cashsale: Cashsale[]): TableData[] {
    return cashsale.map(b => {
      return {
        docdate: b.docDate,
        refNo: b.refNo,
        docno: b.docNo,
        docstatus: b.docStatus,
        vatamtcur: b.vatAmtCur,
        guid: b.guid,
        netamt: b.netAmt
      };
    });
  }

  convertDocStatus(obj: Cashsale[]) {
    if(!this.SvDefault.IsArray(obj)){
      return;
    }
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
