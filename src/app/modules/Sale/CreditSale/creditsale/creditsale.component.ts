import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { valueSelectbox } from "../../../../shared-model/demoModel"
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../../shared/shared.service';
import swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common'
import { disposeEmitNodes } from 'typescript';
import * as moment from 'moment';
import { DefaultService } from 'src/app/service/default.service';
import { async } from '@angular/core/testing';
import { CreditsaleService, ModelCustomerCar } from 'src/app/service/creditsale-service/creditsale-service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PageEvent } from '@angular/material/paginator';
import { CustomerData, CustomerService } from 'src/app/service/customer-service/customer-service';
import { Customer } from 'src/app/model/master/customer.interface';
import { ModelMasBranch, ModelMasCustomer, ModelMasDocPatternDt, ModelMasProduct, ModelSalCreditsaleDt, ModelSalCreditsaleHd, ModelSalQuotationHd, ModelMasCompany, ModelMasCompanyCar } from 'src/app/model/ModelScaffold';
import { ModelSalCreditSal } from 'src/app/model/ModelCommon';
import { CashsaleService } from 'src/app/service/cashsale-service/cashsale-service';
import { ModelCashSaleQuotationDetail } from '../../cashsale/ModelCashSale';
import { element } from 'protractor';
import { AuthGuard } from 'src/app/guards/auth-guard.service';

//==================== Model ====================
//*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z
export class BranchModel extends ModelMasBranch {
}

export class CurrencyModel {
  Currency: string;
  Rate: number;
}

export class CustomerModel extends ModelMasCustomer {
  Address1: string;
  Address2: string;
  Province: string;
  RegisterId: string;
}

export class DetailModel extends ModelSalCreditsaleDt {
  GroupId: string;
}

export class HeaderModel extends ModelSalCreditsaleHd {
  Status: string = "";
  StartDate: Date = null;
  FinishDate: Date = null;
}

interface ShowVAT {
  VatType: string;
  VatTypeName: string;
  VatRate: number;
  TaxBase: number;
  VatAmt: number;
}

export class ProductModel extends ModelMasProduct {
  IsFree: boolean = false;
  UnitBarcode: string = "";
  UnitRatio: number = 0;
  UnitStock: number = 0;
  UnitPrice: number = 0;
}

interface TableData {
  Address: string;
  CustAddr1: string;
  CustAddr2: string;
  CustCode: string;
  CustName: string;
  Phone: string;
  CustPrefix: string;
  CitizenId : string;
}

@Component({
  selector: 'app-creditsale',
  templateUrl: './creditsale.component.html',
  styleUrls: ['./creditsale.component.scss']
})
export class CreditsaleComponent implements OnInit, AfterViewInit {
  //==================== Global Variable ====================
  //*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z
  branchList: BranchModel[];
  branchSelect2: valueSelectbox[];
  currencySelect2: valueSelectbox[];
  currencyList: CurrencyModel[] = [];
  customer: CustomerModel;
  customerList: CustomerModel[] = [];
  quotation: HeaderModel;
  quotationList: HeaderModel[] = [];
  document: HeaderModel = new HeaderModel();
  public ValidEmpClassName  = "";
  headerCard: string;
  lines: DetailModel[] = [];
  myGroup: FormGroup;
  productList: ProductModel[] = [];
  productSelectedList: ProductModel[] = [];
  status = "";
  statusOriginal = "";
  vatGroupList: { [vatGroup: string]: ShowVAT; } = {};
  productMasterList: { [barcode: string]: ProductModel; } = {};

  filterValue: string = null;
  dataSource = new MatTableDataSource<TableData>();
  pageEvent: PageEvent;
  displayedColumns: string[] = ['CustCode', 'CustPrefix', 'CustName', 'Address', 'Phone'];
  no = 0;
  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  //==================== URL ====================
  //*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z
  urlSale = this.sharedService.urlSale;
  urlMas = this.sharedService.urlMas;

  //==================== Button Control ====================
  //*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z
  btnApprove = true;
  btnBack = true;
  btnCancel = true;
  btnClear = true;
  btnComplete = true;
  btnGetQuotation = "";
  btnPrint = true;
  btnReject = true;
  btnSave = true;

  //==================== Input Date ====================
  FinishDate: NgbDate | null;
  FinishDateShow: NgbDate | null;
  hoveredDate: NgbDate | null = null;
  StartDate: NgbDate | null;
  StartDateShow: NgbDate | null;
  //--------------[ Private Variable ]----------------//
  // public ArrCar: ModelMasCompanyCar[] = [];
  public ArrCar: ModelCustomerCar[] = [];
  //==================== constructor ====================
  //*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z
  action: string = "";
  private authPositionRole: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('closebutton') closebutton;

  constructor(
    private calendar: NgbCalendar,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private routerLink: Router,
    private sharedService: SharedService,
    public datepipe: DatePipe,
    public formatter: NgbDateParserFormatter,
    public SvDefault: DefaultService,
    private _svCreditSales: CreditsaleService,
    private customerService: CustomerService,
    private _svCashSale: CashsaleService,
    private authGuard: AuthGuard,
  ) {
    this.branchSelect2 = [];
    this.currencySelect2 = [];
  }

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  //==================== ngOnInit ====================
  async ngOnInit() {
    this.myGroup = new FormGroup({
      currency: new FormControl(),
      remarks: new FormControl(),
      searchCustomer: new FormControl(),
      searchProduct: new FormControl(),
      searchQuotation: new FormControl(),
    });
    await this.SvDefault.DoActionAsync(async () => {
      await this.start();
      this.initDataSource();
    }, true);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  //==================== Function ====================
  async start() {
    this.authPositionRole = this.SvDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }

    this.branchList = [];
    this.branchSelect2 = [];
    this.currencySelect2 = [];
    this.currencyList = [];
    this.customer = new CustomerModel;
    this.customerList = [];
    this.document = new HeaderModel;
    this.headerCard = "";
    this.lines = [];
    this.productList = [];
    this.productSelectedList = [];
    this.status = "";
    this.statusOriginal = "";
    this.vatGroupList = {};

    // this.checkSession();
    this.lines = [];
    this.document = new HeaderModel;
    this.document.BrnCode = this.sharedService.brnCode;
    this.document.CompCode = this.sharedService.compCode;
    this.document.CreatedBy = this.sharedService.user;
    let docGuid = this.route.snapshot.params.DocGuid;

    // this.myGroup = new FormGroup({
    //   currency: new FormControl(),
    //   remarks: new FormControl(),
    //   searchCustomer: new FormControl(),
    //   searchProduct: new FormControl(),
    //   searchQuotation: new FormControl(),
    // });

    if (docGuid == "New") {
      this.action = "New";
      this.status = "สร้าง";
      this.statusOriginal = this.status;
      await this.newDocument();
    } else {
      this.action = "Edit";
      await this.getDocument(docGuid);
    }
    this.headerCard = "เอกสารขายเชื่อ";
    this.getBranch();
    this.getCurrencySelect2();
    // this.branchSelect2;
    // this.currencySelect2;
  }

  initDataSource() {
    this.customerService.findAll(this.filterValue, 1, this.pageSize, "CreditSale")
      .subscribe((page: CustomerData<Customer>) => {
        this.dataSource.data = this.toTableData(page.items);
        this.length = page.totalItems;
      },
        error => {
          swal.fire({
            allowEscapeKey: false,
            allowOutsideClick: false,
            title: "<span class='text-danger'>เกิดข้อผิดพลาด!</span>",
            text: error.message,
          })
        }
      );
  }

  findByValue(value: string) {
    this.customerService.findAll(value, 1, this.pageSize, "CreditSale")
      .subscribe((page: CustomerData<Customer>) => {
        this.dataSource.data = this.toTableData(page.items);
        this.length = page.totalItems;
      });
  }

  onPaginateChange(event: PageEvent) {
    this.no = event.pageIndex > 0 ? event.pageIndex * event.pageSize : 0;
    let page = event.pageIndex;
    let size = event.pageSize;

    if (this.filterValue == null) {
      page = page + 1;

      this.customerService.findAll(this.filterValue, page, size, "CreditSale")
        .subscribe((page: CustomerData<Customer>) => {
          this.dataSource.data = this.toTableData(page.items);
          this.length = page.totalItems;
        })
    } else {
      this.customerService.findAll(this.filterValue, page, size, "CreditSale")
        .subscribe((page: CustomerData<Customer>) => {
          this.dataSource.data = this.toTableData(page.items);
          this.length = page.totalItems;
        })
    }
  }

  private toTableData(customers: Customer[]): TableData[] {
    let result: TableData[] = null;
    result = customers.map(c => {
      return {
        Address: c.address,
        CustAddr1: c.custAddr1,
        CustAddr2: c.custAddr2,
        CustCode: c.custCode,
        CustName: c.custName,
        Phone: c.phone,
        CustPrefix: c.custPrefix,
        CitizenId : c.citizenId,
      };
    });
    return result;
  }

  async selectCustomer(indexs: any) {
    await this.SvDefault.DoActionAsync(async () => {
      let selectCustomer: TableData;
      selectCustomer = indexs;
      this.customer.CustCode = selectCustomer.CustCode;
      // this.customer.CustName =  selectCustomer.CustName;
      this.customer.CustName = `${selectCustomer.CustPrefix} ${selectCustomer.CustName}`;
      this.customer.Address1 = selectCustomer.CustAddr1;
      this.customer.Address2 = selectCustomer.CustAddr2;
      this.customer.CitizenId = selectCustomer.CitizenId;
      // this.customer = indexs;
      await this.addCustomer2();
      // this.ArrCar = await this._svCreditSales.GetCompCar(this.customer.CustCode);
      this.ArrCar = await this._svCreditSales.GetCustomerCar(this.customer.CustCode);
    });

  }

  async AddCustomer() {
    await this.SvDefault.DoActionAsync(async () => await this.addCustomer2(), true);
  }
  private async addCustomer2(): Promise<void> {
    let isDocValid: boolean = this.document.CustCode != null
      && this.document.CustCode != ""
      && this.document.CustCode != undefined
      && this.document.CustCode != this.customer.CustCode
      && this.document.QtNo != null
      && this.document.QtNo != ""
      && this.document.QtNo != undefined;
    if (isDocValid) {
      let option = <SweetAlertOptions>{
        allowEscapeKey: false,
        allowOutsideClick: false,
        confirmButtonText: "ตกลง",
        denyButtonText: "ยกเลิก",
        icon: 'info',
        showDenyButton: true,
        title: 'คุณต้องการเปลี่ยนข้อมูลลูกค้าใช่หรือไม่? <br>ระบบจะล้างข้อมูลสินค้าจากใบเสนอราคาออกทั้งหมด',
      };
      let result: SweetAlertResult<any> = await swal.fire(option);
      if (result.isConfirmed) {
        this.document.QtNo = "";
        this.lines = [];
        this.productSelectedList = [];
        this.document.CustCode = this.customer.CustCode;
        this.document.CustName = this.customer.CustName;
        this.document.CustAddr1 = this.customer.Address1;
        this.document.CustAddr2 = this.customer.Address2;
        this.document.CitizenId = this.customer.CitizenId;
        // this.ArrCar = await this._svCreditSales.GetCompCar(this.document?.CustCode || "");
        this.ArrCar = await this._svCreditSales.GetCustomerCar(this.document?.CustCode || "");
      } else if (result.isDenied) {
        this.customer.CustCode = this.document.CustCode;
        this.customer.CustName = this.document.CustName;
        this.customer.Address1 = this.document.CustAddr1;
        this.customer.Address2 = this.document.CustAddr2;
        this.customer.CitizenId = this.document.CitizenId;
      }
      this.calculateDocument();
    } else {
      this.document.CustCode = this.customer.CustCode;
      this.document.CustName = this.customer.CustName;
      this.document.CustAddr1 = this.customer.Address1;
      this.document.CustAddr2 = this.customer.Address2;
      this.document.CitizenId = this.customer.CitizenId;
      this.calculateDocument();
    }
    this.closebutton.nativeElement.click();

  }
  /*
  private async addCustomer2() {
    if(this.document.CustCode != null
      && this.document.CustCode != ""
      && this.document.CustCode != undefined
      && this.document.CustCode != this.customer.CustCode
      && this.document.RefNo != null
      && this.document.RefNo != ""
      && this.document.RefNo != undefined){
      swal.fire({
          allowEscapeKey: false,
          allowOutsideClick: false,
          confirmButtonText: "ตกลง",
          denyButtonText: "ยกเลิก",
          icon : 'info',
          showDenyButton: true,
          title: 'คุณต้องการเปลี่ยนข้อมูลลูกค้าใช่หรือไม่? <br>ระบบจะล้างข้อมูลสินค้าจากใบเสนอราคาออกทั้งหมด',
      }).then((result) => {
        if (result.isConfirmed) {
          this.document.RefNo = "";
          this.lines = [];
          this.productSelectedList = [];
          this.document.CustCode = this.customer.CustCode;
          this.document.CustName = this.customer.CustName;
          this.document.CustAddr1 = this.customer.Address;
        } else if (result.isDenied) {
           this.customer.CustCode = this.document.CustCode;
           this.customer.CustName = this.document.CustName;
           this.customer.Address = this.document.CustAddr1;
        }
        this.calculateDocument();
      })
    } else {
      this.document.CustCode = this.customer.CustCode;
      this.document.CustName = this.customer.CustName;
      this.document.CustAddr1 = this.customer.Address;
      this.calculateDocument();
    }
    this._arrCar = await this._svCreditSales.GetCustomerCar(this.customer?.CustCode || "");
  }
  */
  addItemtoLine() {
    this.productSelectedList = this.productSelectedList.filter((x, i, a) => {
      let ps = a.find(y => y.IsFree === x.IsFree && y.UnitBarcode === x.UnitBarcode);
      return a.indexOf(ps) === i;
    });

    for (let i = 0; i < this.productSelectedList.length; i++) {
      var productObj = this.lines.find((row, index) => row.UnitBarcode == this.productSelectedList[i].UnitBarcode && row.IsFree === this.productSelectedList[i].IsFree);
      if (!productObj) {
        //เพิ่มเฉพาะสินค้าที่ยังไม่เคยเลือก
        let obj = new DetailModel;
        obj.BrnCode = this.document.BrnCode;
        obj.CompCode = this.document.CompCode;
        obj.DiscAmt = 0;
        obj.DiscAmtCur = obj.DiscAmt * this.document.CurRate;
        obj.DocNo = this.document.DocNo;
        obj.DocType = this.document.DocType;
        obj.IsFree = false;
        obj.IsFree = this.productSelectedList[i].IsFree;
        obj.ItemQty = 0;
        obj.LicensePlate = "";
        obj.LocCode = this.document.LocCode;
        obj.MeterFinish = 0;
        obj.MeterStart = 0;
        obj.Mile = 0;
        obj.PdId = this.productSelectedList[i].PdId;
        obj.PdName = this.productSelectedList[i].PdName;
        obj.PoNo = "";
        obj.RefPrice = 0;
        obj.RefPriceCur = obj.RefPrice * this.document.CurRate;
        obj.SeqNo = 0;
        obj.StockQty = 0;
        obj.SubAmt = 0;
        obj.SubAmtCur = obj.SubAmt * this.document.CurRate;
        obj.TaxBaseAmt = 0;
        obj.TaxBaseAmtCur = obj.TaxBaseAmt * this.document.CurRate;
        obj.UnitBarcode = this.productSelectedList[i].UnitBarcode;
        obj.UnitId = this.productSelectedList[i].UnitId;
        obj.UnitName = this.productSelectedList[i].UnitName;
        obj.UnitPrice = obj.IsFree ? 0 : this.productSelectedList[i].UnitPrice;
        obj.UnitPriceCur = obj.UnitPrice * this.document.CurRate;
        obj.VatAmt = 0;
        obj.VatAmtCur = obj.VatAmt * this.document.CurRate;
        obj.VatRate = this.productSelectedList[i].VatRate;
        obj.VatType = this.productSelectedList[i].VatType;
        obj.GroupId = this.productSelectedList[i].GroupId;
        this.lines.push(obj);
      }
    }

    //ตัดข้อมูล productSelectedList ที่ไม่มีใน Lines ออก
    // for(var i = 0; i < this.lines.length; i++){
    //   var line = this.productSelectedList.find((row, index) => row.UnitBarcode == this.lines[i].UnitBarcode);
    //   if(!line){
    //     this.lines.splice(i, 1);
    //   }
    // }
    this.calculateDocument();
    return this.lines;
  }
  addItemtoLineOld() {

    for (let i = 0; i < this.productSelectedList.length; i++) {
      var productObj = this.lines.find((row, index) => row.UnitBarcode == this.productSelectedList[i].UnitBarcode);
      if (!productObj) {
        //เพิ่มเฉพาะสินค้าที่ยังไม่เคยเลือก
        let obj = new DetailModel;
        obj.BrnCode = this.document.BrnCode;
        obj.CompCode = this.document.CompCode;
        obj.DiscAmt = 0;
        obj.DiscAmtCur = obj.DiscAmt * this.document.CurRate;
        obj.DocNo = this.document.DocNo;
        obj.DocType = this.document.DocType;
        obj.IsFree = false;
        obj.ItemQty = 0;
        obj.LicensePlate = "";
        obj.LocCode = this.document.LocCode;
        obj.MeterFinish = 0;
        obj.MeterStart = 0;
        obj.Mile = 0;
        obj.PdId = this.productSelectedList[i].PdId;
        obj.PdName = this.productSelectedList[i].PdName;
        obj.PoNo = "";
        obj.RefPrice = 0;
        obj.RefPriceCur = obj.RefPrice * this.document.CurRate;
        obj.SeqNo = 0;
        obj.StockQty = 0;
        obj.SubAmt = 0;
        obj.SubAmtCur = obj.SubAmt * this.document.CurRate;
        obj.TaxBaseAmt = 0;
        obj.TaxBaseAmtCur = obj.TaxBaseAmt * this.document.CurRate;
        obj.UnitBarcode = this.productSelectedList[i].UnitBarcode;
        obj.UnitId = this.productSelectedList[i].UnitId;
        obj.UnitName = this.productSelectedList[i].UnitName;
        obj.UnitPrice = this.productSelectedList[i].UnitPrice;
        obj.UnitPriceCur = obj.UnitPrice * this.document.CurRate;
        obj.VatAmt = 0;
        obj.VatAmtCur = obj.VatAmt * this.document.CurRate;
        obj.VatRate = this.productSelectedList[i].VatRate;
        obj.VatType = this.productSelectedList[i].VatType;
        this.lines.push(obj);
      }
    }

    //ตัดข้อมูล productSelectedList ที่ไม่มีใน Lines ออก
    for (var i = 0; i < this.lines.length; i++) {
      var line = this.productSelectedList.find((row, index) => row.UnitBarcode == this.lines[i].UnitBarcode);
      if (!line) {
        this.lines.splice(i, 1);
      }
    }
    this.calculateDocument();
    return this.lines;
  }
  approveDocument = () => {
    this.status = "พร้อมใช้";
    this.document.DocStatus = "Ready";
    this.saveDocument();
  };

  calculateDocument = () => {
    let subTotalHD = 0;
    let taxBaseHD = 0;
    let vatAmtHD = 0;
    let totalHD = 0;

    //Cal SubTotal, SubAmt
    this.lines.forEach(element => {
      // if (this.document.RefNo != "" && this.document.RefNo != null && this.document.RefNo != undefined) {
      //   element.DiscAmt = (element.UnitPrice - element.RefPrice) * element.ItemQty;
      // }

      element.SubAmt = parseFloat(((element.UnitPrice * element.ItemQty) - element.DiscAmt).toFixed(2));
      element.SumItemAmt = (element.UnitPrice * element.ItemQty);
      subTotalHD += element.SubAmt;
      // element.SumItemAmt = parseFloat(element.SumItemAmt.toFixed(2)); //hard code from bank
      // element.ItemQty = parseFloat(element.ItemQty.toFixed(2)); //hard code from bank
      // element.DiscAmt = parseFloat(element.DiscAmt.toFixed(2)); //hard code from bank
    });

    //Cal DiscHdAmt, VAT
    this.lines.forEach(element => {
      if (!element.IsFree) {
        element.DiscHdAmt = (element.SubAmt / (subTotalHD || 1)) * this.document.DiscAmt;
        let beforeTax = 0;
        let taxBase = 0;
        let taxAmt = 0;
        if (element.VatType == "VE") {
          beforeTax = element.SubAmt - element.DiscHdAmt;
          taxBase = beforeTax;
          taxAmt = ((taxBase * element.VatRate) / (100 || 1));
        } else if (element.VatType == "VI") {
          beforeTax = element.SubAmt - element.DiscHdAmt;
          taxBase = ((beforeTax * 100) / ((100 + element.VatRate) || 1));
          taxAmt = (((element.SubAmt - element.DiscHdAmt) * element.VatRate) / ((100 + element.VatRate) || 1));
        } else if (element.VatType == "NV") {
          beforeTax = element.SubAmt - element.DiscHdAmt;
          taxBase = 0;
          taxAmt = 0;
        }

        element.TaxBaseAmt = taxBase;
        element.VatAmt = taxAmt;
        element.TotalAmt = beforeTax;
      }
    });

    //Cal NetAmt, VatAmt, TotalAmt
    this.lines.forEach(element => {
      if (!element.IsFree) {
        taxBaseHD += element.TaxBaseAmt;
        vatAmtHD += element.VatAmt;
        totalHD += element.TotalAmt;
      }
    });

    this.document.SubAmt = subTotalHD;
    this.document.TotalAmt = totalHD;
    this.document.TaxBaseAmt = taxBaseHD;
    this.document.VatAmt = vatAmtHD;
    this.document.NetAmt = taxBaseHD + vatAmtHD;

    //Cal By Currency
    this.lines.forEach(element => {
      element.SumItemAmtCur = element.SumItemAmt * this.document.CurRate;
      element.SubAmtCur = element.SubAmt * this.document.CurRate;
      element.DiscAmtCur = element.DiscAmt * this.document.CurRate;
      element.DiscHdAmtCur = element.DiscHdAmt * this.document.CurRate;
      element.TaxBaseAmtCur = element.TaxBaseAmt * this.document.CurRate;
      element.VatAmtCur = element.VatAmt * this.document.CurRate;
      element.TotalAmtCur = element.TotalAmt * this.document.CurRate;
    });

    this.document.SubAmtCur = this.document.SubAmt * this.document.CurRate;
    this.document.DiscAmtCur = this.document.DiscAmt * this.document.CurRate;
    this.document.TotalAmtCur = this.document.TotalAmt * this.document.CurRate;
    this.document.TaxBaseAmtCur = this.document.TaxBaseAmt * this.document.CurRate;
    this.document.VatAmtCur = this.document.VatAmt * this.document.CurRate;
    this.document.NetAmtCur = this.document.NetAmt * this.document.CurRate;

    //Cal VAT By Group
    this.vatGroupList = {};
    this.lines.forEach(element => {
      if (!element.IsFree) {
        let type = "";
        if (element.VatType == "VE") {
          type = "ExcludeVAT";
        } else if (element.VatType == "VI") {
          type = "IncludeVAT";
        } else if (element.VatType == "NV") {
          type = "NoVAT";
        }

        this.vatGroupList[element.VatRate] = {
          VatType: element.VatType,
          VatTypeName: type,
          VatRate: element.VatRate,
          TaxBase: (this.vatGroupList[element.VatRate] == undefined ? 0 : this.vatGroupList[element.VatRate].TaxBase) + element.TaxBaseAmt,
          VatAmt: (this.vatGroupList[element.VatRate] == undefined ? 0 : this.vatGroupList[element.VatRate].VatAmt) + element.VatAmt
        };
      }
    });
  };

  calculateDocument2 = () => {
    let subTotalHD = 0;
    let taxBaseHD = 0;
    let vatAmtHD = 0;
    let totalHD = 0;

    //Cal SubTotal, SubAmt
    this.lines.forEach(element => {
      if (this.document.QtNo != "" && this.document.QtNo != null && this.document.QtNo != undefined) {
        element.DiscAmt = (element.UnitPrice - element.RefPrice) * element.ItemQty;
      }
      // element.SumItemAmt = (element.UnitPrice * element.ItemQty);
      // element.SubAmt = ((element.UnitPrice * element.ItemQty) - element.DiscAmt);

      element.SubAmt = element.SumItemAmt - element.DiscAmt;
      element.ItemQty = element.SumItemAmt / element.UnitPrice;
      subTotalHD += element.SubAmt;
      // element.SumItemAmt = parseFloat(element.SumItemAmt?.toFixed(2) || "0") || 0; //hard code from bank
      // element.ItemQty = parseFloat(element.ItemQty?.toFixed(2) || "0") || 0; //hard code from bank
      // element.DiscAmt = parseFloat(element.DiscAmt?.toFixed(2) || "0") || 0; //hard code from bank
    });

    //Cal DiscHdAmt, VAT
    this.lines.forEach(element => {
      if (!element.IsFree) {
        element.DiscHdAmt = (element.SubAmt / (subTotalHD || 1)) * this.document.DiscAmt;
        let beforeTax = 0;
        let taxBase = 0;
        let taxAmt = 0;
        if (element.VatType == "VE") {
          beforeTax = element.SubAmt - element.DiscHdAmt;
          taxBase = beforeTax;
          taxAmt = ((taxBase * element.VatRate) / (100 || 1));
        } else if (element.VatType == "VI") {
          beforeTax = element.SubAmt - element.DiscHdAmt;
          taxBase = ((beforeTax * 100) / ((100 + element.VatRate) || 1));
          taxAmt = (((element.SubAmt - element.DiscHdAmt) * element.VatRate) / ((100 + element.VatRate) || 1));
        } else if (element.VatType == "NV") {
          beforeTax = element.SubAmt - element.DiscHdAmt;
          taxBase = 0;
          taxAmt = 0;
        }

        element.TaxBaseAmt = taxBase;
        element.VatAmt = taxAmt;
        element.TotalAmt = beforeTax;
      }
    });

    //Cal NetAmt, VatAmt, TotalAmt
    this.lines.forEach(element => {
      if (!element.IsFree) {
        taxBaseHD += element.TaxBaseAmt;
        vatAmtHD += element.VatAmt;
        totalHD += element.TotalAmt;
      }
    });

    this.document.SubAmt = subTotalHD;
    this.document.TotalAmt = totalHD;
    this.document.TaxBaseAmt = taxBaseHD;
    this.document.VatAmt = vatAmtHD;
    this.document.NetAmt = taxBaseHD + vatAmtHD;

    //Cal By Currency
    this.lines.forEach(element => {
      element.SumItemAmtCur = element.SumItemAmt * this.document.CurRate;
      element.SubAmtCur = element.SubAmt * this.document.CurRate;
      element.DiscAmtCur = element.DiscAmt * this.document.CurRate;
      element.DiscHdAmtCur = element.DiscHdAmt * this.document.CurRate;
      element.TaxBaseAmtCur = element.TaxBaseAmt * this.document.CurRate;
      element.VatAmtCur = element.VatAmt * this.document.CurRate;
      element.TotalAmtCur = element.TotalAmt * this.document.CurRate;
    });

    this.document.SubAmtCur = this.document.SubAmt * this.document.CurRate;
    this.document.DiscAmtCur = this.document.DiscAmt * this.document.CurRate;
    this.document.TotalAmtCur = this.document.TotalAmt * this.document.CurRate;
    this.document.TaxBaseAmtCur = this.document.TaxBaseAmt * this.document.CurRate;
    this.document.VatAmtCur = this.document.VatAmt * this.document.CurRate;
    this.document.NetAmtCur = this.document.NetAmt * this.document.CurRate;

    //Cal VAT By Group
    this.vatGroupList = {};
    this.lines.forEach(element => {
      if (!element.IsFree) {
        let type = "";
        if (element.VatType == "VE") {
          type = "ExcludeVAT";
        } else if (element.VatType == "VI") {
          type = "IncludeVAT";
        } else if (element.VatType == "NV") {
          type = "NoVAT";
        }

        this.vatGroupList[element.VatRate] = {
          VatType: element.VatType,
          VatTypeName: type,
          VatRate: element.VatRate,
          TaxBase: (this.vatGroupList[element.VatRate] == undefined ? 0 : this.vatGroupList[element.VatRate].TaxBase) + element.TaxBaseAmt,
          VatAmt: (this.vatGroupList[element.VatRate] == undefined ? 0 : this.vatGroupList[element.VatRate].VatAmt) + element.VatAmt
        };
      }
    });
  };
  setProductFree = (indexs: any) => {
    var productObj = this.lines.find((row, index) => index == indexs);
    if (productObj.IsFree) {
      productObj.UnitPrice = 0;
      productObj.DiscAmt = 0;
    } else {
      var data =
      {
        "CompCode": this.document.CompCode,
        "BrnCode": this.document.BrnCode,
        "LocCode": this.document.LocCode,
        "PDBarcodeList": productObj.UnitBarcode,
        "SystemDate": this.SvDefault.GetFormatDate(<Date>this.document.DocDate)
      }
      // this.httpClient.post(this.urlMas + "/api/Product/GetProductListWithOutMaterialCode", data)
      this.httpClient.post(this.urlSale + "/api/CreditSale/GetProductListWithOutMaterialCode", data)
        .subscribe(
          response => {
            // console.log(response);
            for (let i = 0; i < response["Data"].length; i++) {
              productObj.UnitPrice = response["Data"][i].UnitPrice;
            }
            this.calculateDocument();
          },
          error => {
            console.log("Error", error);
            this.calculateDocument();
          }
        );
    }
    this.calculateDocument();
  };

  calculateRow = (indexs: any) => {
    let productObj = this.lines.find((row, index) => index == indexs);
    let msg = "";
    if (productObj.ItemQty < 0) {
      productObj.ItemQty = 0;
      msg = "ไม่อนุญาตให้กรอกจำนวนน้อยกว่า 0";

    } else if (productObj.DiscAmt < 0) {
      productObj.DiscAmt = 0;
      msg = "ไม่อนุญาตให้กรอกส่วนลดน้อยกว่า 0";
    }

    if (msg != "") {
      swal.fire({
        title: msg,
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'error'
      })
        .then(() => {
          this.calculateDocument();
          this.validateRow();
        });
    } else {
      this.calculateDocument();
      this.validateRow();
    }
  };
  calculateRow2 = (indexs: any) => {
    let productObj = this.lines.find((row, index) => index == indexs);
    let msg = "";
    if (productObj.ItemQty < 0) {
      productObj.ItemQty = 0;
      msg = "ไม่อนุญาตให้กรอกจำนวนน้อยกว่า 0";

    } else if (productObj.DiscAmt < 0) {
      productObj.DiscAmt = 0;
      msg = "ไม่อนุญาตให้กรอกส่วนลดน้อยกว่า 0";
    }

    if (msg != "") {
      swal.fire({
        title: msg,
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'error'
      })
        .then(() => {
          this.calculateDocument2();
          this.validateRow();
        });
    } else {
      this.calculateDocument2();
      this.validateRow();
    }
  };
  validateRow = () => {
    let chkErr = false;
    this.lines.forEach(element => {
      if (element.DiscAmt >= element.SumItemAmt && element.DiscAmt != 0) {
        // chkErr = true;
        // element.DiscAmt = 0;
      }
    });

    if (chkErr) {
      swal.fire({
        title: "ไม่อนุญาตให้กรอกส่วนลดมากกว่าหรือเท่ากับจำนวนเงิน<br> ระบบจะเปลี่ยนส่วนลดให้เป็น 0 อัตโนมัติ",
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'error'
      })
        .then(() => {
          this.calculateDocument();
        });
    };
  };

  calculateTaxBase = (obj: DetailModel) => {
    let resp = 0;
    if (obj.VatType == "VI") {
      let tb = (obj.ItemQty * obj.UnitPrice) - obj.DiscAmt;
      let vatAmt = (tb * obj.VatRate) / (100 + obj.VatRate)
      tb = tb - vatAmt;
      resp = tb;
    } else if (obj.VatType == "VE") {
      resp = (obj.ItemQty * obj.UnitPrice) - obj.DiscAmt
    }
    return resp;
  };

  calculateVatAmt = (obj: DetailModel) => {
    let resp = 0;
    if (obj.VatType == "VI") {
      let tb = (obj.ItemQty * obj.UnitPrice) - obj.DiscAmt;
      resp = (tb * obj.VatRate) / (100 + obj.VatRate)
    } else if (obj.VatType == "VE") {
      let tb = (obj.ItemQty * obj.UnitPrice) - obj.DiscAmt;
      resp = (tb * obj.VatRate) / (100)
    }
    return resp;
  };

  cancelDocument = () => {
    if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isCancel")) {
      this.SvDefault.ShowPositionRoleMessage("IsCancel");
      return;
    }

    swal.fire({
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: "ตกลง",
      denyButtonText: "ยกเลิก",
      icon: 'warning',
      showDenyButton: true,
      title: 'คุณต้องการยกเลิกเอกสารใช่หรือไม่?',
    }).then((result) => {
      if (result.isConfirmed) {
        this.status = "ยกเลิก";
        this.document.DocStatus = "Cancel";
        this.saveDocument();
      } else if (result.isDenied) {
      }
    })
  };

  changeCurrency = () => {
    var cur = this.myGroup.get('currency').value;
    if (cur != "" && cur != null) {
      var curObj = this.currencyList.find((row, index) => row.Currency == cur);
      this.document.Currency = curObj.Currency;
      this.document.CurRate = curObj.Rate;
    }
    else {
      this.document.Currency = null;
      this.document.CurRate = 0;
    }
  };

  checkSession = () => {
    if ((this.sharedService.compCode === null || this.sharedService.compCode === undefined || this.sharedService.compCode === "")
      && (this.sharedService.brnCode === null || this.sharedService.brnCode === undefined || this.sharedService.brnCode === "")
      && (this.sharedService.locCode === null || this.sharedService.locCode === undefined || this.sharedService.locCode === "")
      && (this.sharedService.user === null || this.sharedService.user === undefined || this.sharedService.user === "")
    ) {
      swal.fire({
        allowEscapeKey: false,
        allowOutsideClick: false,
        icon: 'error',
        title: 'กรุณาเข้าสู่ระบบอีกครั้ง',
      })
        .then(() => {
          this.routerLink.navigate(["Login"]);
        });
    }
  };

  clearDocument = () => {
    swal.fire({
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: "ตกลง",
      denyButtonText: "ยกเลิก",
      icon: 'warning',
      showDenyButton: true,
      title: 'คุณต้องการล้างข้อมูลที่กรอกไว้ ใช่หรือไม่?',
    }).then((result) => {
      if (result.isConfirmed) {
        this.start();
        this.calculateDocument();
      } else if (result.isDenied) {
      }
    })
  };

  completeDocument = () => {
    this.status = "พร้อมใช้";
    this.document.DocStatus = "Ready";
    this.saveDocument();
  };

  deleteRow = (indexs: any): void => {
    var productObj = this.lines.find((row, index) => index == indexs);
    this.productSelectedList = this.productSelectedList.filter((row, index) => row.PdId !== productObj.PdId);
    this.lines = this.lines.filter((row, index) => index !== indexs);
    this.calculateDocument();
  }

  deleteSelected = (indexs: any): void => {
    var productObj = this.productSelectedList.find((row, index) => index == indexs);
    this.productSelectedList = this.productSelectedList.filter((row, index) => index !== indexs);
    this.productList.push(productObj);
    this.calculateDocument();
  }

  getBackgroundRibbon() {
    let classStatus = "ribbon-1 ribbon tooltipa statusBase"
    if (this.document.DocStatus == "Cancel") {
      classStatus += " statusCancel ";
    } else if (this.document.DocStatus == "New") {
      classStatus += " statusNew ";
    } else if (this.document.DocStatus == "Ready") {
      classStatus += " statusReady ";
    } else if (this.document.DocStatus == "Reference") {
      classStatus += " statusReference ";
    } else if (this.document.DocStatus == "Active") {
      classStatus += " statusActive ";
    } else {
      classStatus += " statusNew ";
    }
    return classStatus;
  }

  getBranch = (): void => {
    var data = {
      "CompCode": this.document.CompCode,
      "LocCode": this.document.LocCode
    }
    this.httpClient.post(this.urlMas + "/api/Branch/GetBranchList", data)
      .subscribe(
        response => {
          // console.log("BranchList : ", response);
          this.branchSelect2 = [];
          this.branchList = [];
          for (let i = 0; i < response["Data"].length; i++) {
            this.branchSelect2.push({
              KEY: response["Data"][i].BrnCode.trim() + " : " + response["Data"][i].BrnName.trim(),
              VALUE: response["Data"][i].BrnCode.trim()
            });
            /*
            this.branchList.push({
              Address: response["Data"][i].BrnCode.trim(),
              BrnCode: response["Data"][i].BrnCode.trim(),
              BrnName: response["Data"][i].BrnName.trim(),
              BrnStatus: response["Data"][i].BrnCode.trim(),
              CompCode: response["Data"][i].BrnCode.trim(),
              CreatedBy: response["Data"][i].BrnCode.trim(),
              CreatedDate: response["Data"][i].BrnCode.trim(),
              District: response["Data"][i].BrnCode.trim(),
              Fax: response["Data"][i].BrnCode.trim(),
              Phone: response["Data"][i].BrnCode.trim(),
              Postcode: response["Data"][i].BrnCode.trim(),
              Province: response["Data"][i].BrnCode.trim(),
              SubDistrict: response["Data"][i].BrnCode.trim(),
              UpdatedBy: response["Data"][i].BrnCode.trim(),
              UpdatedDate: response["Data"][i].BrnCode.trim(),
              MapBrnCode : ""
            });*/
          }
        },
        error => {
          console.log("Error", error);
        }
      );
  }

  getCurrencySelect2 = (): void => {
    this.currencySelect2 = [];
    this.currencyList = [
      {
        "Currency": "THB",
        "Rate": 1
      }//,
      // {
      //   "Currency": "USD",
      //   "Rate": 30.6267
      // },
      // {
      //   "Currency": "EUR",
      //   "Rate": 36.6329
      // },
      // {
      //   "Currency": "AUD",
      //   "Rate": 23.7432
      // },
    ];

    this.currencyList.forEach(element => {
      this.currencySelect2.push({ KEY: element.Currency.toString(), VALUE: element.Currency.toString() });
    });
  }

  getCustomerList() {
    this.customerList = [];
    var data =
    {
      "CompCode": this.document.CompCode,
      "LocCode": this.document.LocCode,
      "Keyword": this.myGroup.get('searchCustomer').value,
    }
    this.httpClient.post(this.urlMas + "/api/Customer/GetCustomerList", data)
      .subscribe(
        response => {
          // console.log(response);
          for (let i = 0; i < response["Data"].length; i++) {
            let obj = new CustomerModel();
            obj.AccountId = response["Data"][i].AccountId;
            obj.Address = response["Data"][i].Address;
            obj.Address1 = response["Data"][i].Address1;
            obj.Address2 = response["Data"][i].Address2;
            obj.BillType = response["Data"][i].BillType;
            obj.BrnCode = response["Data"][i].BrnCode;
            obj.CompCode = response["Data"][i].CompCode;
            obj.ContactName = response["Data"][i].ContactName;
            obj.CreatedBy = response["Data"][i].CreatedBy;
            obj.CreatedDate = response["Data"][i].CreatedDate;
            obj.CreditLimit = response["Data"][i].CreditLimit;
            obj.CreditTerm = response["Data"][i].CreditTerm;
            obj.CustCode = response["Data"][i].CustCode;
            obj.CustName = response["Data"][i].CustName;
            obj.CustPrefix = response["Data"][i].CustPrefix;
            obj.CustStatus = response["Data"][i].CustStatus;
            obj.District = response["Data"][i].District;
            obj.DueType = response["Data"][i].DueType;
            obj.Fax = response["Data"][i].Fax;
            obj.Phone = response["Data"][i].Phone;
            obj.Postcode = response["Data"][i].Postcode;
            obj.Province = response["Data"][i].Province;
            obj.RegisterId = response["Data"][i].RegisterId;
            obj.SubDistrict = response["Data"][i].SubDistrict;
            obj.UpdatedBy = response["Data"][i].UpdatedBy;
            obj.UpdatedDate = response["Data"][i].UpdatedDate;
            this.customerList.push(obj);
          }

          //Hilight Row
          let indexCus = this.customerList.findIndex(x => x.CustCode == this.document.CustCode)
          this.hilightRowCustomer(indexCus);
        },
        error => {
          console.log("Error", error);
        }
      );
  }

  async getDocument(pStrDocGuid: string) {
    let response: ModelSalCreditSal = await this._svCreditSales.GetCreditSale(pStrDocGuid);
    if(!this.SvDefault.CheckDocBrnCode(response?.BrnCode)){
      return;
    }
    if (response == null) {
      return;
    }
    this.SvDefault.CopyObject(response, this.document);
    this.document.DocDate = new Date(response.DocDate);
    this.document.UpdatedBy = this.sharedService.user;
    this.myGroup.controls['currency'].setValue(response.Currency);
    this.myGroup.controls['currency'].disable();
    this.myGroup.controls['remarks'].setValue(response.Remark);
    // this.ArrCar = await this._svCreditSales.GetCompCar(this.document.CustCode);
    this.ArrCar = await this._svCreditSales.GetCustomerCar(this.document.CustCode);
    if (Array.isArray(response.SalCreditsaleDt) && response.SalCreditsaleDt.length) {
      let arrBarcode: string[] = [];
      this.lines = response.SalCreditsaleDt.map(x => {
        x.Mile = x.Mile || 0;
        let dt = new DetailModel();
        var data =
        {
          "PdId": x.PdId,
        }

        this.httpClient.post(this.urlMas + "/api/Product/FindById", data)
          .subscribe(
            response => {
              dt.GroupId = response["groupId"];
            },
            error => {
              console.log("Error", error);
            }
          );

        this.SvDefault.CopyObject(x, dt);
        arrBarcode.push((dt.UnitBarcode || "").toString().trim());
        return dt;
      });
      let pDBarcodeList = arrBarcode.filter(x => x !== "").join(",");
      this.getProductSelectedList(pDBarcodeList);
    }
    this.calculateDocument2();
    this.hiddenButton();
  }
  private hiddenButton() {
    let objHidden = this.SvDefault.GetHiddenButton2(this.document.DocStatus, this.document.Post);
    this.status = objHidden.status;
    this.btnApprove = objHidden.btnApprove;
    this.btnBack = objHidden.btnBack;
    this.btnCancel = objHidden.btnCancel;
    this.btnClear = objHidden.btnClear;
    this.btnComplete = objHidden.btnComplete;
    this.btnPrint = objHidden.btnPrint;
    this.btnReject = objHidden.btnReject;
    this.btnSave = objHidden.btnSave;
  }
  /*
   getDocument(docGuid: string = "") {
    let req = {
      "Guid": docGuid
    }
    this.httpClient.post(this.urlSale + "/api/CreditSale/GetCreditSale", req)
      .subscribe(
        response => {
          this.document.BrnCode = response["Data"].BrnCode;
          this.document.CompCode = response["Data"].CompCode;
          this.document.CreatedBy = response["Data"].CreatedBy;
          this.document.CreatedDate = new Date(response["Data"].CreatedDate);
          this.document.CurRate = response["Data"].CurRate;
          this.document.Currency = response["Data"].Currency;
          this.document.CustAddr1 = response["Data"].CustAddr1;
          this.document.CustAddr2 = response["Data"].CustAddr2;
          this.document.CustCode = response["Data"].CustCode;
          this.document.CustName = response["Data"].CustName;
          this.document.DiscAmt = response["Data"].DiscAmt;
          this.document.DiscAmtCur = response["Data"].DiscAmtCur;
          this.document.DiscRate = response["Data"].DiscRate;
          this.document.DocDate = new Date(response["Data"].DocDate);
          this.document.DocNo = response["Data"].DocNo;
          this.document.DocType = response["Data"].DocType;
          this.document.DocPattern = response["Data"].DocPattern;
          this.document.DocStatus = response["Data"].DocStatus;
          this.document.Guid = response["Data"].Guid;
          this.document.ItemCount = response["Data"].ItemCount;
          this.document.LocCode = response["Data"].LocCode;
          this.document.NetAmt = response["Data"].NetAmt;
          this.document.NetAmtCur = response["Data"].NetAmtCur;
          this.document.Post = response["Data"].Post;
          this.document.Period = response["Data"].Period;
          this.document.RefNo = response["Data"].RefNo;
          this.document.Remark = response["Data"].Remark;
          this.document.RunNumber = response["Data"].RunNumber;
          this.document.SubAmt = response["Data"].SubAmt;
          this.document.SubAmtCur = response["Data"].SubAmtCur;
          this.document.TaxBaseAmt = response["Data"].TaxBaseAmt;
          this.document.TaxBaseAmtCur = response["Data"].TaxBaseAmtCur;
          this.document.TotalAmt = response["Data"].TotalAmt;
          this.document.TotalAmtCur = response["Data"].TotalAmtCur;
          this.document.TxNo = response["Data"].TxNo;
          this.document.UpdatedBy = this.sharedService.user;
          this.document.UpdatedDate = new Date(response["Data"].UpdatedDate);
          this.document.VatAmt = response["Data"].VatAmt;
          this.document.VatAmtCur = response["Data"].VatAmtCur;
          this.document.VatRate = response["Data"].VatRate;

          this.myGroup.controls['currency'].setValue(response["Data"].Currency);
          this.myGroup.controls['currency'].disable();
          this.myGroup.controls['remarks'].setValue(response["Data"].Remark);

          let pDBarcodeList = "";
          let rqList = response["Data"].SalCreditsaleDt;
          this.lines = [];
          for (let i = 0; i < rqList.length; i++) {
            let obj = new DetailModel;
            obj.BrnCode = rqList[i].BrnCode;
            obj.CompCode = rqList[i].CompCode;
            obj.DiscAmt = rqList[i].DiscAmt;
            obj.DiscAmtCur = rqList[i].DiscAmtCur;
            obj.DiscHdAmt = rqList[i].DiscHdAmt;
            obj.DiscHdAmtCur = rqList[i].DiscHdAmtCur;
            obj.DocNo = rqList[i].DocNo;
            obj.DocType = rqList[i].DocType;
            obj.IsFree = rqList[i].IsFree;
            obj.ItemQty = rqList[i].ItemQty;
            obj.LicensePlate = rqList[i].LicensePlate;
            obj.LocCode = rqList[i].LocCode;
            obj.MeterFinish = rqList[i].MeterFinish;
            obj.MeterStart = rqList[i].MeterStart;
            obj.Mile = rqList[i].Mile;
            obj.PdId = rqList[i].PdId;
            obj.PdName = rqList[i].PdName;
            obj.PoNo = rqList[i].PoNo;
            obj.RefPrice = rqList[i].RefPrice;
            obj.RefPriceCur = rqList[i].RefPriceCur;
            obj.SeqNo = rqList[i].SeqNo;
            obj.StockQty = rqList[i].StockQty;
            obj.SubAmt = rqList[i].SumAmt;
            obj.SubAmtCur = rqList[i].SumAmtCur;
            obj.SumItemAmt = rqList[i].SumItemAmt;
            obj.SumItemAmtCur = rqList[i].SumItemAmtCur;
            obj.TaxBaseAmt = rqList[i].TaxBaseAmt;
            obj.TaxBaseAmtCur = rqList[i].TaxBaseAmtCur;
            obj.TotalAmt = rqList[i].TotalAmt;
            obj.TotalAmtCur = rqList[i].TotalAmtCur;
            obj.UnitBarcode = rqList[i].UnitBarcode;
            obj.UnitId = rqList[i].UnitId;
            obj.UnitName = rqList[i].UnitName;
            obj.UnitPrice = rqList[i].UnitPrice;
            obj.UnitPriceCur = rqList[i].UnitPriceCur;
            obj.VatAmt = rqList[i].VatAmt;
            obj.VatAmtCur = rqList[i].VatAmtCur;
            obj.VatRate = rqList[i].VatRate;
            obj.VatType = rqList[i].VatType;
            this.lines.push(obj);

            pDBarcodeList += obj.UnitBarcode;
            if (i == rqList.length - 1) {
              pDBarcodeList += "";
            } else {
              pDBarcodeList += ",";
            }
          }
          this.getProductSelectedList(pDBarcodeList);
          this.calculateDocument2();

          if (this.document.Post.toLocaleLowerCase() == "p") {
            this.status = "ปิดสิ้นวัน";
            this.btnApprove = true;
            this.btnBack = false;
            this.btnCancel = true;
            this.btnClear = true;
            this.btnComplete = true;
            this.btnPrint = false;
            this.btnReject = true;
            this.btnSave = true;
          }
          else {
            if (this.document.DocStatus == "Cancel") {
              this.status = "ยกเลิก";
              this.btnApprove = true;
              this.btnBack = false;
              this.btnCancel = true;
              this.btnClear = true;
              this.btnComplete = true;
              this.btnPrint = false;
              this.btnReject = true;
              this.btnSave = true;
            } else if (this.document.DocStatus == "Ready") {
              this.status = "พร้อมใช้";
              this.btnApprove = true;
              this.btnBack = false;
              this.btnCancel = false;
              this.btnClear = true;
              this.btnComplete = true;
              this.btnPrint = false;
              this.btnReject = true;
              this.btnSave = true;
            } else if (this.document.DocStatus == "Reference") {
              this.status = "เอกสารถูกอ้างอิง";
              this.btnApprove = true;
              this.btnBack = false;
              this.btnCancel = true;
              this.btnClear = true;
              this.btnComplete = true;
              this.btnPrint = false;
              this.btnReject = true;
              this.btnSave = true;
            } else if (this.document.DocStatus == "Active") {
              this.status = "แอคทีฟ";
              this.btnApprove = true;
              this.btnBack = false;
              this.btnCancel = false;
              this.btnClear = true;
              this.btnComplete = false;
              this.btnPrint = false;
              this.btnReject = true;
              this.btnSave = false;
            } else if (this.document.DocStatus == "Wait") {
              this.status = "รออนุมัติ";
              this.btnApprove = false;
              this.btnBack = false;
              this.btnCancel = true;
              this.btnClear = true;
              this.btnComplete = true;
              this.btnPrint = false;
              this.btnReject = false;
              this.btnSave = true;
            }
          }

          //Set HeaderCard
          // this.headerCard = this.document.DocNo;
          this.headerCard = "เอกสารขายเชื่อ";
          this.statusOriginal = this.status;

          //ถ้าวันที่ระบบมากกว่าวันที่เอกสาร แสดงว่ามีการปิดสิ้นวันเเล้ว
          // if(this.document.DocDate < this.sharedService.systemDate){
          // if(moment(this.document.DocDate).isBefore(this.sharedService.systemDate ,"day")){
          //   this.status = "ปิดสิ้นวัน";
          //   this.statusOriginal = this.status;
          //   this.btnSave = true;
          // }
        },
        error => {
          console.log("Error", error);
        }
      );
  }
*/
  async getPatternAsync(pDocument: HeaderModel): Promise<void> {
    if (pDocument == null) {
      return;
    }
    let arrDocPattern: ModelMasDocPatternDt[] = await this.SvDefault.GetPatternAsync("CreditSale");
    let strPattern: string = this.SvDefault.GenPatternString(<Date>pDocument.DocDate, arrDocPattern, pDocument.CompCode, pDocument.BrnCode);
    pDocument.DocNo = strPattern;
    pDocument.DocPattern = strPattern;
  }

  getPattern = (): void => {
    var req =
    {
      "BrnCode": this.document.BrnCode,
      "CompCode": this.document.CompCode,
      "LocCode": this.document.LocCode,
      "DocDate": this.document.DocDate,
      "DocNo": this.document.DocNo,
      "DocType": "CreditSale"
    }

    var pattern = ""
    this.httpClient.post(this.urlMas + "/api/Other/GetPattern", req)
      .subscribe(
        response => {
          pattern = response["Data"].Pattern;
          this.document.DocNo = pattern;
          this.document.DocPattern = pattern;
        },
        error => {
          console.log("Error", error);
        }
      );
  }
  async getProductList(): Promise<void> {
    await this.SvDefault.DoActionAsync(async () => {
      this.productList = [];
      this.productSelectedList = [];
      let param = {
        "CompCode": this.document.CompCode,
        "LocCode": this.document.LocCode,
        "BrnCode": this.document.BrnCode,
        "Keyword": this.myGroup.get('searchProduct').value,
        "SystemDate": this.SvDefault.GetFormatDate(<Date>this.document.DocDate)
      };
      let strUrl: string = "";
      // strUrl = this.urlMas + "/api/Product/GetProductListWithOutMaterialCode";
      strUrl = this.urlMas + "/api/Product/GetProductAllTypeList";
      let apiResult = <any>await this.httpClient.post(strUrl, param).toPromise();
      if (apiResult == null || !apiResult.hasOwnProperty("Data") || !Array.isArray(apiResult.Data) || !apiResult.Data.length) {
        return;
      }
      this.productList = (<ProductModel[]>apiResult.Data).map(x => {
        x.IsFree = false;
        return x;
      });
      // if(Array.isArray(this.productSelectedList) && this.productSelectedList.length){
      //   this.productSelectedList = this.productSelectedList
      //     .filter(x =>  this.lines.some(y=> x.UnitBarcode === y.UnitBarcode && x.IsFree === y.IsFree));
      // }

    });
  }

  getProductListOld() {
    this.productList = [];
    var data =
    {
      "CompCode": this.document.CompCode,
      "LocCode": this.document.LocCode,
      "BrnCode": this.document.BrnCode,
      "Keyword": this.myGroup.get('searchProduct').value,
      "SystemDate": this.SvDefault.GetFormatDate(<Date>this.document.DocDate)
    }
    this.httpClient.post(this.urlMas + "/api/Product/GetProductAllTypeList", data)
      .subscribe(
        response => {
          // console.log(response);
          for (let i = 0; i < response["Data"].length; i++) {
            let obj = new ProductModel();
            obj.CreatedBy = response["Data"][i].CreatedBy;
            obj.CreatedDate = response["Data"][i].CreatedDate;
            obj.GroupId = response["Data"][i].GroupId;
            obj.UnitBarcode = response["Data"][i].UnitBarcode;
            obj.UnitPrice = response["Data"][i].UnitPrice;
            obj.PdDesc = response["Data"][i].PdDesc;
            obj.PdId = response["Data"][i].PdId;
            obj.PdName = response["Data"][i].PdName;
            obj.PdStatus = response["Data"][i].PdStatus;
            obj.UnitId = response["Data"][i].UnitId;
            obj.UnitName = response["Data"][i].UnitName;
            obj.UpdatedBy = response["Data"][i].UpdatedBy;
            obj.UpdatedDate = response["Data"][i].UpdatedDate;
            obj.VatRate = response["Data"][i].VatRate;
            obj.VatType = response["Data"][i].VatType;
            var pdl = this.productSelectedList.filter((row, index) => row.UnitBarcode == obj.UnitBarcode);
            if (pdl.length == 0) {
              this.productList.push(obj);
            }
          }
        },
        error => {
          console.log("Error", error);
        }
      );
  }

  getProductSelectedList(pDBarcodeList: string = "") {
    this.productSelectedList = [];
    var data =
    {
      "CompCode": this.document.CompCode,
      "LocCode": this.document.LocCode,
      "BrnCode": this.document.BrnCode,
      "PDBarcodeList": pDBarcodeList,
      "SystemDate": this.SvDefault.GetFormatDate(<Date>this.document.DocDate)
    }

    this.httpClient.post(this.urlSale + "/api/CreditSale/GetProductListWithOutMaterialCode", data)
      // this.httpClient.post(this.urlMas + "/api/Product/GetProductListWithOutMaterialCode", data)
      .subscribe(
        response => {
          // console.log(response);
          this.productMasterList = {};
          for (let i = 0; i < (<any>response).length; i++) {
            let obj = new ProductModel();
            obj.PdId = response[i].PdId;
            obj.UnitBarcode = response[i].UnitBarcode;
            obj.UnitPrice = response[i].UnitPrice;
            obj.PdName = response[i].PdName;
            obj.PdStatus = response[i].PdStatus;
            obj.PdDesc = response[i].PdDesc;
            obj.UnitId = response[i].UnitId;
            obj.UnitName = response[i].UnitName;
            obj.GroupId = response[i].GroupId;
            obj.VatType = response[i].VatType;
            obj.VatRate = response[i].VatRate;
            obj.CreatedDate = response[i].CreatedDate;
            obj.CreatedBy = response[i].CreatedBy;
            obj.UpdatedDate = response[i].UpdatedDate;
            obj.UpdatedBy = response[i].UpdatedBy;
            obj.GroupId = response[i].GroupId;
            this.productMasterList[obj.UnitBarcode] = obj;
            this.productSelectedList.push(obj);
          }
          if (this.document.QtNo != "" && this.document.QtNo != null && this.document.QtNo != undefined) {
            this.setUnitPriceFromProductMaster();
          }
        },
        error => {
          console.log("Error", error);
        }
      );
  }
  setUnitPriceFromProductMaster() {
    for (let i = 0; i < this.lines.length; i++) {
      const element = this.lines[i];
      element.UnitPrice = this.productMasterList[element.UnitBarcode]?.UnitPrice || 0.00;
    }
    let morethanPriceCur: DetailModel[] = this.lines.filter(x => x.RefPrice > x.UnitPrice);
    if (Array.isArray(morethanPriceCur) && morethanPriceCur.length) {
      let bdStr: string = morethanPriceCur
        .map(x => `รหัสสินค้า ${x.UnitBarcode} : ${x.PdName} <br/>`)
        .join("") + "มีราคาสินค้าที่เสนอสูงกว่าราคาปัจจุบัน";
      let swOption = <SweetAlertOptions>{
        title: bdStr,
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'warning'
      };
      swal.fire(swOption);
      if (morethanPriceCur.length === this.lines.length) {
        this.lines = [];
        this.document.QtNo = "";
      } else {
        this.lines = this.lines.filter(x => !morethanPriceCur.includes(x));
      }
    }
    for (let i = 0; i < this.lines.length; i++) {
      const obj = this.lines[i];
      if (obj.UnitPrice < obj.RefPrice) {
        continue;
      }
      obj.DiscAmt = (obj.UnitPrice - obj.RefPrice) * obj.ItemQty;
    }
    this.calculateDocument();
  }
  /*
  setUnitPriceFromProductMaster() {
    let morethanPriceCur = [];
    this.lines.forEach(element => {
      element.UnitPrice = this.productMasterList[element.UnitBarcode].UnitPrice;
      //ตรวจสอบราคาที่เสนอสูงกว่าราคาปัจจุบัน
      if (element.RefPrice > element.UnitPrice) {
        morethanPriceCur.push(element);
      }
    });

    if (morethanPriceCur.length > 0) {
      let bdStr = "";
      morethanPriceCur.forEach(element => {
        bdStr += "รหัสสินค้า " + element.UnitBarcode + " : " + element.PdName + "<br>";
      });

      bdStr += "มีราคาสินค้าที่เสนอสูงกว่าราคาปัจจุบัน<br> ระบบจะทำการเปลี่ยนแสดงราคาที่เสนอเท่ากับราคาปัจจุบันอัตโนมัติ";
      disposeEmitNodes
      swal.fire({
        title: bdStr,
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'error'
      })
        .then(() => {
          this.lines.forEach(element => {
            if (element.RefPrice > element.UnitPrice) {
              element.RefPrice = element.UnitPrice;
              element.DiscAmt = 0;
              this.calculateDocument();
            }
          });
        });
    } else {
      this.calculateDocument();
    }
  }
*/
  hilightRowCustomer(indexs) {
    if (indexs == null) {
      indexs = this.customerList.findIndex(e => e.CustCode === this.customer.CustCode);
    }
    if (indexs != null) {
      const slides = document.getElementsByClassName('trCustomerStyle');
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i] as HTMLElement;
        if (i == indexs) {
          slide.style.backgroundColor = "#9fdb95";
        } else {
          slide.style.backgroundColor = "#fff";
        }
      }
    }
  }

  hilightRowQuotation(indexs) {
    if (indexs == null) {
      indexs = this.quotationList.findIndex(e => e.DocNo === this.quotation.DocNo);
    }
    if (indexs != null) {
      const slides = document.getElementsByClassName('trQuotationStyle');
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i] as HTMLElement;
        if (i == indexs) {
          slide.style.backgroundColor = "#9fdb95";
        } else {
          slide.style.backgroundColor = "#fff";
        }
      }
    }
  }

  isHovered(date: NgbDate) {
    return this.StartDate && !this.FinishDate && this.hoveredDate && date.after(this.StartDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.FinishDate && date.after(this.StartDate) && date.before(this.FinishDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.StartDate) || (this.FinishDate && date.equals(this.FinishDate)) || this.isInside(date) || this.isHovered(date);
  }

  async newDocument() {
    this.document.BrnCode = this.sharedService.brnCode;
    this.document.CompCode = this.sharedService.compCode;
    this.document.CreatedBy = this.sharedService.user;
    this.document.CreatedDate = new Date();
    this.document.CurRate = 1;
    this.document.Currency = "THB";
    this.document.CustAddr1 = "";
    this.document.CustAddr2 = "";
    this.document.CustCode = "";
    this.document.CustName = "";
    this.document.DiscAmt = 0;
    this.document.DiscAmtCur = 0;
    this.document.DiscRate = null;
    this.document.DocDate = this.sharedService.systemDate;
    this.document.DocNo = "";
    this.document.DocType = "CreditSale";
    this.document.DocPattern = "";
    this.document.DocStatus = "New";
    this.document.Guid = "1f8f68b6-e7ff-42f0-8b35-27bb2cc57f93"; //ต้องใส่หลอกไว้ งั้น Model ไม่รองรับ
    this.document.ItemCount = 0;
    this.document.LocCode = this.sharedService.locCode;
    this.document.NetAmt = 0;
    this.document.NetAmtCur = 0;
    this.document.Post = "N";
    this.document.QtNo = null;
    this.document.Remark = "";
    this.document.RunNumber = 0;
    this.document.SubAmt = 0;
    this.document.SubAmtCur = 0;
    this.document.TotalAmt = 0;
    this.document.TotalAmtCur = 0;
    this.document.TxNo = null;
    this.document.UpdatedBy = this.sharedService.user;;
    this.document.UpdatedDate = new Date();
    this.document.VatAmt = 0;
    this.document.VatAmtCur = 0;
    this.document.VatRate = 0;

    //Set Input
    this.myGroup.controls['currency'].setValue(this.document.Currency);
    this.myGroup.controls['currency'].disable();

    // this.getPattern();
    await this.getPatternAsync(this.document)
    //Set Hidden Button
    this.btnSave = false;
    this.btnPrint = true;
    this.btnCancel = true;
    this.btnClear = false;
    this.btnBack = false;
    this.btnComplete = true;
    this.btnApprove = true;
    this.btnReject = true;

    //Set HeaderCard
    this.headerCard = "เอกสารขายเชื่อ";
  }

  printDocument = () => {
    if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isPrint")) {
      this.SvDefault.ShowPositionRoleMessage("IsPrint");
      return;
    }
    
    swal.fire({
      title: 'ฟังก์ชันการพิมพ์เอกสาร กำลังอยู่ในขั้นตอนการพัฒนา',
      allowOutsideClick: false, //Lock Screen
      allowEscapeKey: false,
      icon: 'info'
    })
      .then(() => {
      });
  };

  rejectDocument = () => {
    this.status = "แอคทีฟ";
    this.document.DocStatus = "Active";
    this.saveDocument();
  };

  rejectDocStatus = () => {
    this.status = this.statusOriginal;
    if (this.status == "สร้าง") {
      this.document.DocStatus = "New";
    } else if (this.status == "แอคทีฟ") {
      this.document.DocStatus = "Active";
    } else if (this.status == "รออนุมัติ") {
      this.document.DocStatus = "Wait";
    } else if (this.status == "พร้อมใช้") {
      this.document.DocStatus = "Ready";
    } else if (this.status == "เอกสารถูกอ้างอิง") {
      this.document.DocStatus = "Reference";
    } else if (this.status == "ยกเลิก") {
      this.document.DocStatus = "Cancel";
    }
  };

  saveDocument = (isValidate: boolean = false): void => {
    if(this.action === "New"){
      if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isCreate")) {
        this.SvDefault.ShowPositionRoleMessage("IsCreate");
        return;
      }
    }
    else if(this.action === "Edit"){
      if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isEdit")) {
        this.SvDefault.ShowPositionRoleMessage("IsEdit");
        return;
      }
    }
    
    if (isValidate) {
      if (!this.validateData()) {
        return;
      }
    }

    var data =
    {
      "CompCode": this.document.CompCode,
      "BrnCode": this.document.BrnCode,
      "LocCode": this.document.LocCode,
      "DocNo": this.document.DocNo,
      "DocType": this.document.DocType,
      "DocStatus": this.document.DocStatus,
      "DocDate": this.document.DocDate,
      "Period": this.document.Period,
      "RefNo": this.document.RefNo,
      "QtNo": this.document.QtNo,
      "CustCode": this.document.CustCode,
      "CustName": this.document.CustName,
      "CustAddr1": this.document.CustAddr1,
      "CustAddr2": this.document.CustAddr2,
      "ItemCount": this.document.ItemCount,
      "Remark": this.myGroup.get('remarks').value,
      "Currency": this.document.Currency,
      "CurRate": this.document.CurRate,
      "SubAmt": this.document.SubAmt,
      "SubAmtCur": this.document.SubAmtCur,
      "DiscRate": this.document.DiscRate,
      "DiscAmt": this.document.DiscAmt,
      "DiscAmtCur": this.document.DiscAmtCur,
      "TotalAmt": this.document.TotalAmt,
      "TotalAmtCur": this.document.TotalAmtCur,
      "TaxBaseAmt": this.document.TaxBaseAmt,
      "TaxBaseAmtCur": this.document.TaxBaseAmtCur,
      "VatRate": this.document.VatRate,
      "VatAmt": this.document.VatAmt,
      "VatAmtCur": this.document.VatAmtCur,
      "NetAmt": this.document.NetAmt,
      "NetAmtCur": this.document.NetAmtCur,
      "TxNo": this.document.TxNo,
      "Post": this.document.Post,
      "RunNumber": this.document.RunNumber,
      "DocPattern": this.document.DocPattern,
      "Guid": this.document.Guid,
      "CreatedBy": this.document.CreatedBy,
      "CreatedDate": this.document.CreatedDate,
      "UpdatedBy": this.document.UpdatedBy,
      "UpdatedDate": this.document.UpdatedDate,
      "SalCreditsaleDt": this.lines,
      "CitizenId" : this.document.CitizenId,
      "EmpCode" : this.document.EmpCode,
      "EmpName" : this.document.EmpName,
    };

    const headers = { 'content-type': 'application/json' }
    const body = JSON.stringify(data);
    if (this.document.DocStatus == "New") {
      data.DocStatus = "Active";
      this.httpClient.post(this.urlSale + "/api/CreditSale/CreateCreditSale", data)
        .subscribe(
          response => {
            swal.fire({
              allowEscapeKey: false,
              allowOutsideClick: false,
              icon: 'success',
              title: 'บันทึกข้อมูลสำเร็จ',
            })
              .then(() => {
                var docGuid = response["Data"].Guid;
                this.getDocument(docGuid);
                this.routerLink.navigate(['/CreditSale/' + docGuid]);
              });
          },
          error => {
            console.log("Error", error);
            swal.fire({
              allowEscapeKey: false,
              allowOutsideClick: false,
              icon: 'error',
              title: 'มีข้อผิดพลาด<br> ' + error.error.message,
            })
              .then(() => {
                this.rejectDocStatus();
              });
          }
        );
    } else if (this.document.DocStatus == "Active"
      || this.document.DocStatus == "Wait"
      || this.document.DocStatus == "Cancel"
      || this.document.DocStatus == "Ready") {
        console.log(data);

      this.httpClient.put(this.urlSale + "/api/CreditSale/UpdateCreditSale", data)
        .subscribe(
          response => {
            swal.fire({
              allowEscapeKey: false,
              allowOutsideClick: false,
              icon: 'success',
              title: 'แก้ไขข้อมูลสำเร็จ',
            })
              .then(() => {
                var docGuid = this.document.Guid;
                this.getDocument(docGuid);
                this.routerLink.navigate(['/CreditSale/' + docGuid]);
              });
          },
          error => {
            console.log("Error", error);
            swal.fire({
              allowEscapeKey: false,
              allowOutsideClick: false,
              icon: 'error',
              title: 'มีข้อผิดพลาด<br> ' + error.error.message,
            })
              .then(() => {
                this.rejectDocStatus();
              });
          }
        );
    }
  }
  selectedCustomer(indexs: any) {
    this.SvDefault.DoAction(() => {
      var obj = this.customerList[indexs];
      this.customer = obj;
      this.hilightRowCustomer(indexs);
      // let arrCar: ModelCustomerCar[] = await this._svCreditSales.GetCustomerCar(obj.CustCode);
      // console.log(arrCar);

    });
  }
  /*
  selectedCustomer = (indexs: any):void => {
    var obj = this.customerList[indexs];
    this.customer = obj;
    this.hilightRowCustomer(indexs);
  }
  */
  selectedProductList = (indexs: any): void => {
    let pd = JSON.parse(JSON.stringify(this.productList[indexs]));
    this.productSelectedList.push(pd);
    // this.productList.splice(indexs, 1);
  }
  selectedProductListOld = (indexs: any): void => {
    this.productSelectedList.push(this.productList[indexs]);
    this.productList.splice(indexs, 1);
  }

  validateData(): boolean {
    let pass = true;
    let msg = "";

    //----- check input itemqty---------------//
    let checkItemQty = false;
    this.lines.forEach(x => {
      if (x.ItemQty == 0) {
        checkItemQty = true;
      }
    });
    //----- check input itemqty---------------//
    if (this.document.CustCode == "" || this.document.CustCode == null || this.document.CustCode == undefined) {
      pass = false;
      msg = "กรุณาเลือกข้อมูลลูกค้า";
    } else if (this.lines.length == 0) { //ตรวจสอบการเลือกสินค้า
      pass = false;
      msg = "กรุณาเลือกสินค้า";
    } else if (this.lines.length > 0 && checkItemQty) {
      pass = false;
      msg = "กรุณากรอกปริมาณให้ครบถ้วนก่อนบันทึก";
    } else if (this.document.DiscAmt >= this.document.SubAmt) {
      pass = false;
      msg = "ไม่อนุญาต<br>ให้ส่วนลดท้ายเอกสารมากกว่าหรือเท่ากับรวมจำนวนเงิน <br> กรุณาใส่ส่วนลดท้ายเอกสารให้ถูกต้อง";
    } else {
      //ตรวจสอบการกรอกจำนวนสินค้า
      if (this.lines.length > 0) {
        for (var i = 0; i < this.lines.length; i++) {
          if (!pass) {
            break;
          }
          // validate po
          let strPo: string = (this.lines[i].PoNo || "").toString().trim();
          if (strPo === "") {
            pass = false;
            msg = "ช่องใบสั่งซื้อต้องห้ามว่าง";
            break;
          }
          //validate qty > 0
          if ((this.lines[i].ItemQty || 0) <= 0 && !this.lines[i].IsFree) {
            pass = false;
            msg = "ช่องปริมาณต้องห้ามว่าง และมีค่ามากกว่า 0";
            break;
          }
          else if (this.lines[i].GroupId != "0000") {
            if ((this.lines[i].ItemQty % 1) != 0) {
              pass = false;
              msg = `รหัสสินค้า ${this.lines[i].UnitBarcode} : ${this.lines[i].PdName} ช่องปริมาณต้องเป็นจำนวนเต็ม`;
              break;
            }
          }
          // Validate LicensePlate
          if(this.SvDefault.IsArray(this.ArrCar)){
            let strLicensePlate = this.SvDefault.GetString(this.lines[i]?.LicensePlate);
            if (strLicensePlate === "") {
              let strProductId: string = (this.lines[i]?.PdId || "").toString().trim();
              let strProductName: string = (this.lines[i]?.PdName || "").toString().trim();
              pass = false;
              msg = `กรุณากรอกทะเบียนรถที่รายการ : ${strProductId} - ${strProductName}`;
              break;
            } else if (!this.ArrCar.some(x => x.licensePlate === strLicensePlate)) {
              pass = false;
              msg = `ไม่พบข้อมูลทะเบียนรถ : ${strLicensePlate}`;
              break;
            }
          }
          // let isOil = this.productSelectedList.some(x => x.GroupId === "0000" && x.UnitBarcode === this.lines[i]?.UnitBarcode);
          // if (isOil && Array.isArray(this._arrCar) && this._arrCar.length) { //disable check license plate
          //   let strLicensePlate = (this.lines[i]?.LicensePlate || "").toString().trim();
          //   if (strLicensePlate === "") {
          //     let strProductId: string = (this.lines[i]?.PdId || "").toString().trim();
          //     let strProductName: string = (this.lines[i]?.PdName || "").toString().trim();
          //     pass = false;
          //     msg = `กรุณากรอกทะเบียนรถที่รายการ : ${strProductId} - ${strProductName}`;
          //     break;
          //   } else if (!this._arrCar.some(x => x.licensePlate === strLicensePlate)) {
          //     pass = false;
          //     msg = `ไม่พบข้อมูลทะเบียนรถ : ${strLicensePlate}`;
          //     break;
          //   }
          // }

          let customerCompany = new ModelMasCompany;
          let req = {
            "CustCode": this.document.CustCode
          }
          this.httpClient.post(this.sharedService.urlMas + "/api/Company/FindCustomerCompanyById", req)
            .subscribe(
              response => {
                let responseData = response["Data"]
                if (responseData != null) {
                  customerCompany = responseData;
                }

              },
              error => {
                console.log("Error", error);
              }
            );

          let isOil = this.productSelectedList.some(x => x.GroupId === "0000" && x.UnitBarcode === this.lines[i]?.UnitBarcode);

          if (isOil = true || customerCompany.CustCode == "" || customerCompany.CustCode == null || customerCompany.CustCode == undefined) {
            let strLicensePlate = (this.lines[i]?.LicensePlate || "").toString().trim();
            if (strLicensePlate === "") {
              let strProductId: string = (this.lines[i]?.PdId || "").toString().trim();
              let strProductName: string = (this.lines[i]?.PdName || "").toString().trim();
              pass = false;
              msg = `กรุณากรอกทะเบียนรถที่รายการ : ${strProductId} - ${strProductName}`;
              break;
            }
          }

          //---------------------
          if (this.lines[i].ItemQty <= 0 && !this.lines[i].IsFree) {
            pass = false;
            msg = "กรุณากรอกจำนวนสินค้า <br>" + this.lines[i].UnitBarcode + " : " + this.lines[i].PdName;
            break;
          } else {
            pass = true;
          }
          // validate mile below 0
          this.lines[i].Mile = this.lines[i].Mile || 0;
          if (this.lines[i].Mile < 0) {
            pass = false;
            msg = "ไม่อนุญาตกรอก เลขไมล์ติดลบ";
            break;
          }
          // Validate Free Item
          for (let j = i + 1; j < this.lines.length; j++) {
            if (this.lines[i].PdId === this.lines[j].PdId && this.lines[i].IsFree === this.lines[j].IsFree) {
              msg = `${this.lines[i].IsFree ? "ของแถม" : "สินค้า"} รหัส : ${this.lines[j].PdId} (${this.lines[j].PdName})  ซ้ำกัน`;
              pass = false;
              break;
            }
          }
          //
        }
      }


    }

    if (!pass) {
      swal.fire({
        title: msg,
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'error'
      })
        .then(() => {
        });
    }
    return pass;
  }
  /*
  validateData = (): boolean => {
    let pass = false;
    let msg = "";

    if(this.document.CustCode == "" || this.document.CustCode == null || this.document.CustCode == undefined) {
      pass = false;
      msg = "กรุณาเลือกข้อมูลลูกค้า";
    } else if(this.lines.length == 0){ //ตรวจสอบการเลือกสินค้า
      pass = false;
      msg = "กรุณาเลือกสินค้า";
    } else if(this.document.DiscAmt >= this.document.SubAmt){
      pass = false;
      msg = "ไม่อนุญาต<br>ให้ส่วนลดท้ายเอกสารมากกว่าหรือเท่ากับรวมจำนวนเงิน <br> กรุณาใส่ส่วนลดท้ายเอกสารให้ถูกต้อง";
    } else {
      //ตรวจสอบการกรอกจำนวนสินค้า
      if(this.lines.length > 0){
        for(var i = 0; i < this.lines.length; i++){
          if(this.lines[i].ItemQty <= 0 && !this.lines[i].IsFree){
            pass = false;
            msg = "กรุณากรอกจำนวนสินค้า <br>" + this.lines[i].UnitBarcode + " : " + this.lines[i].PdName;
            break;
          } else {
            pass = true;
          }
        }
      }
    }

    if(!pass){
      swal.fire({
        title: msg,
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon : 'error'
      })
      .then(()=>{
      });
    }
    return pass;
  }
  */
  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    alert();
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  getBackground() {
    let classStatus = "ribbon-1 ribbon tooltipa statusBase"
    if (this.document.DocStatus == "Cancel") {
      classStatus += " statusCancel ";
    } else if (this.document.DocStatus == "New") {
      classStatus += " statusNew ";
    } else if (this.document.DocStatus == "Ready") {
      classStatus += " statusReady ";
    } else if (this.document.DocStatus == "Reference") {
      classStatus += " statusReference ";
    } else if (this.document.DocStatus == "Active") {
      classStatus += " statusActive ";
    } else {
      classStatus += " statusNew ";
    }
    return classStatus;
  }

  getQutationValidate() {
    this.btnGetQuotation = "";
    if (this.document.CustCode == "" || this.document.CustCode == null || this.document.CustCode == undefined) {
      this.btnGetQuotation = "";
      swal.fire({
        title: 'กรุณาเลือกข้อมูลลูกค้า',
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'error'
      })
        .then(() => {
          this.btnGetQuotation = "";
        });
    } else if (this.route.snapshot.params.DocGuid != "New") {
      swal.fire({
        title: 'ไม่อนุญาตให้เปลี่ยนใบเสนอราคา<br>เมื่อมีการบันทึกเอกสารเรียบร้อยเเล้ว',
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'error'
      })
        .then(() => {
          this.btnGetQuotation = "";
        });
    } else {
      this.btnGetQuotation = "modal-getQuotation";
      this.getQuotationList();
    }
  }

  getQuotationList() {
    this.quotationList = [];
    let req =
    {
      "BrnCode": this.document.BrnCode,
      "CompCode": this.document.CompCode,
      "DocDate": this.SvDefault.GetFormatDate(<Date>this.document.DocDate),
      "LocCode": this.document.LocCode,
      "CustCode": this.document.CustCode,
      "Keyword": this.myGroup.get('searchQuotation').value,
    }
    this.httpClient.post(this.urlSale + "/api/Quotation/GetQuotationHdRemainList", req)
      .subscribe(
        response => {
          // console.log(response);
          for (let i = 0; i < response["Data"].length; i++) {
            let obj = new HeaderModel();
            obj.BrnCode = response["Data"][i].BrnCode;
            obj.CompCode = response["Data"][i].CompCode;
            obj.CustCode = response["Data"][i].CustCode;
            obj.CustName = response["Data"][i].CustName;
            obj.CreatedBy = response["Data"][i].CreatedBy;
            obj.CreatedDate = response["Data"][i].CreatedDate;
            obj.DocDate = response["Data"][i].DocDate;
            obj.DocNo = response["Data"][i].DocNo;
            obj.DocStatus = response["Data"][i].DocStatus;
            obj.Guid = response["Data"][i].Guid;
            obj.LocCode = response["Data"][i].LocCode;
            obj.Post = response["Data"][i].Post;
            obj.Remark = response["Data"][i].Remark;
            obj.RunNumber = response["Data"][i].RunNumber;
            obj.UpdatedBy = response["Data"][i].UpdatedBy;
            obj.UpdatedDate = response["Data"][i].UpdatedDate;
            obj.StartDate = response["Data"][i].StartDate;
            obj.FinishDate = response["Data"][i].FinishDate;

            if (obj.DocStatus == "Active") {
              obj.Status = "แอคทีฟ";
            } else if (obj.DocStatus == "Wait") {
              obj.Status = "รออนุมัติ";
            } else if (obj.DocStatus == "Ready") {
              obj.Status = "พร้อมใช้";
            } else if (obj.DocStatus == "Cancel") {
              obj.Status = "ยกเลิก";
            } else if (obj.DocStatus == "Reference") {
              obj.Status = "เอกสารถูกอ้างอิง";
            }
            obj.DocStatus = "status" + obj.DocStatus;

            this.quotationList.push(obj);
          }
        },
        error => {
          console.log("Error", error);
        }
      );
    return this.quotationList;
  }
  /*
  private async getQuotationAsync(){
    if(this.quotation == null){
      return;
    }
    let quotationHeader = new ModelSalQuotationHd();
    this.SvDefault.CopyObject(this.quotation , quotationHeader);
    let arrQuotationDeatil: ModelCashSaleQuotationDetail[] = await this._svCashSale.GetQuotationDetail(quotationHeader);
    if(!(Array.isArray(arrQuotationDeatil) && arrQuotationDeatil.length)){
      return;
    }

  }
*/
  getQuotation(docGuid: string = "") {
    let req = {
      "Guid": docGuid
    }
    this.httpClient.post(this.urlSale + "/api/Quotation/GetQuotation", req)
      .subscribe(
        response => {
          this.lines = [];
          let pDBarcodeList = "";
          let rqList = response["Data"].SalQuotationDt;
          for (let i = 0; i < rqList.length; i++) {
            if (rqList[i].StockRemain > 0) {
              //เฉพาะที่เหลือยอด Remain เท่านั้น
              let obj = new DetailModel;
              obj.BrnCode = this.document.BrnCode;
              obj.CompCode = this.document.CompCode;
              obj.DiscAmt = rqList[i].DiscAmt;
              obj.DiscAmtCur = obj.DiscAmt * this.document.CurRate;
              obj.DocNo = this.document.DocNo;
              obj.DocType = this.document.DocType;
              obj.IsFree = rqList[i].IsFree;
              obj.ItemQty = rqList[i].StockRemain;
              obj.LicensePlate = "";
              obj.LocCode = this.document.LocCode;
              obj.MeterFinish = 0;
              obj.MeterStart = 0;
              obj.Mile = 0;
              obj.PdId = rqList[i].PdId;
              obj.PdName = rqList[i].PdName;
              obj.PoNo = "";
              obj.RefPrice = rqList[i].UnitPrice;
              obj.RefPriceCur = obj.RefPrice * this.document.CurRate;
              obj.SeqNo = 0;
              obj.StockQty = 0;
              obj.SubAmt = 0;
              obj.SubAmtCur = obj.SubAmt * this.document.CurRate;
              obj.TaxBaseAmt = 0;
              obj.TaxBaseAmtCur = obj.TaxBaseAmt * this.document.CurRate;
              obj.UnitBarcode = rqList[i].UnitBarcode;
              obj.UnitId = rqList[i].UnitId;
              obj.UnitName = rqList[i].UnitName;
              obj.UnitPrice = 0;
              obj.UnitPriceCur = obj.UnitPrice * this.document.CurRate;
              obj.VatAmt = 0;
              obj.VatAmtCur = obj.VatAmt * this.document.CurRate;
              obj.VatRate = rqList[i].VatRate;
              obj.VatType = rqList[i].VatType;

              //คำนวณราคาที่ลดไปจากปัจจุบัน
              // obj.DiscAmt = (obj.UnitPrice - obj.RefPrice) * obj.ItemQty;
              pDBarcodeList += obj.UnitBarcode;
              if (i == rqList.length - 1) {
                pDBarcodeList += "";
              } else {
                pDBarcodeList += ",";
              }

              this.lines.push(obj);
            }
          }
          this.calculateStockQty(pDBarcodeList);
          this.getProductSelectedList(pDBarcodeList);
          this.calculateDocument();
        },
        error => {
          console.log("Error", error);
        }
      );
  }

  calculateStockQty = (pDBarcodeList: string = ""): void => {
    var data =
    {
      "CompCode": this.document.CompCode,
      "LocCode": this.document.LocCode,
      "BrnCode": this.document.BrnCode,
      "PDBarcodeList": pDBarcodeList,
      "DocDate": this.SvDefault.GetFormatDate(<Date>this.document.DocDate)
    }
    this.httpClient.post(this.urlMas + "/api/ProductUnit/GetProductUnitList", data)
      .subscribe(
        response => {
          let pdList = [];
          // console.log(response);
          for (let i = 0; i < response["Data"].length; i++) {
            let obj = new ProductModel();
            obj.PdId = response["Data"][i].PdId;
            obj.UnitBarcode = response["Data"][i].UnitBarcode;
            obj.UnitId = response["Data"][i].UnitId;
            obj.UnitName = response["Data"][i].UnitName;
            obj.UnitRatio = response["Data"][i].UnitRatio;
            obj.UnitStock = response["Data"][i].UnitStock;
            obj.PdId = response["Data"][i].PdId;
            pdList.push(obj);
          }

          this.lines.forEach(element => {
            let pd = pdList.find(x => x.UnitBarcode == element.UnitBarcode);
            if (pd != null) {
              element.ItemQty = (element.ItemQty * pd.UnitRatio) / pd.UnitStock
            }
          });
        },
        error => {
          console.log("Error", error);
        }
      );
  }

  selectedQuotation = (indexs: any): void => {
    var obj = this.quotationList[indexs];
    this.quotation = obj;
    this.hilightRowQuotation(indexs);
  }

  addQuotation() {

    if ((this.document.QtNo != undefined
      && this.document.QtNo != null
      && this.document.QtNo != ""
      && this.document.QtNo != this.quotation.DocNo)
      || (this.lines.length > 0 && this.document.QtNo != this.quotation.DocNo)
    ) {
      swal.fire({
        allowEscapeKey: false,
        allowOutsideClick: false,
        confirmButtonText: "ตกลง",
        denyButtonText: "ยกเลิก",
        icon: 'info',
        showDenyButton: true,
        title: 'คุณต้องการเปลี่ยนใบเสนอราคาใช่หรือไม่? <br>ระบบจะล้างข้อมูลสินค้าจากใบเสนอราคาเดิมออกทั้งหมด',
      }).then((result) => {
        if (result.isConfirmed) {
          this.getQuotation(this.quotation.Guid);
          this.document.QtNo = this.quotation.DocNo;
          this.lines = [];
          this.productSelectedList = [];
        } else if (result.isDenied) {
          this.quotation.DocNo = this.document.QtNo;
        }
      })
    } else {
      this.getQuotation(this.quotation.Guid);
      this.document.QtNo = this.quotation.DocNo;
    }
  }

  public async FindEmp(){
    this.document.EmpCode = this.SvDefault.GetString(this.document.EmpCode);
    if(this.document.EmpCode === ""){
      this.document.EmpName = ""
      return;
    }
    let emp = await this.SvDefault.GetEmployee(this.document.EmpCode);
    if(emp == null){
      this.document.EmpName = "ไม่พบข้อมูลพนักงาน";
      this.ValidEmpClassName = 'text-red';
    }else{
      this.document.EmpName = this.SvDefault.GetEmployeeFullName(emp);
      this.ValidEmpClassName = 'text-dark';
    }
  }
}
