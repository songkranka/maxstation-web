import { element } from 'protractor';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpParams } from '@angular/common/http';
import { valueSelectbox } from "../../../../shared-model/demoModel"
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../../shared/shared.service';
import swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common'
import { CashModel, CurrencyModel, DetailModel, HeaderModel, ModelCashTax, ModelCashTaxCancelAndReplace, ProductModel, ShowVAT, } from '../ModelCashTax';
import { DefaultService } from 'src/app/service/default.service';
import { CashtaxService } from 'src/app/service/cashtax-service/cashtax-service';
import { async } from '@angular/core/testing';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { ModelFinBalance, ModelMasCustomer, ModelMasProduct, ModelSalTaxinvoiceDt, ModelSalTaxinvoiceHd, ModelSysPositionRole } from 'src/app/model/ModelScaffold';
import { ModelHiddenButton } from 'src/app/model/ModelCommon';
import { ModelTaxProfile } from 'src/app/model/ModelCommon';
import { PageEvent } from '@angular/material/paginator';
import { ReportService } from 'src/app/service/report-service/report-service';
import { AuthGuard } from 'src/app/guards/auth-guard.service';

interface ReNew {
  IS_RENEW: string;
}

@Component({
  selector: 'app-cashtax',
  templateUrl: './cashtax.component.html',
  styleUrls: ['./cashtax.component.scss']
})

export class CashtaxComponent implements OnInit {
  //==================== Global Variable ====================
  //*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z
  cash: CashModel;
  currencyList: CurrencyModel[] = [];
  cashSale: HeaderModel;
  cashSaleList: HeaderModel[] = [];
  document: HeaderModel;
  date = new Date();
  headerCard: string;
  lines: DetailModel[];
  myGroup: FormGroup;
  productList: ProductModel[] = [];
  productSelectedList: ProductModel[] = [];
  status = "";
  statusOriginal = "";
  vatGroupList: { [vatGroup: string]: ShowVAT; } = {};
  isValidFormSubmitted = null;
  urlReportView = "";

  //==================== URL ====================
  //*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z
  urlSale = this.sharedService.urlSale;
  urlMas = this.sharedService.urlMas;
  urlReport = this.sharedService.urlReport;



  //==================== Button Control ====================
  //*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z
  btnApprove = true;
  btnBack = true;
  btnCancel = true;
  btnGetCashSale = "";
  btnClear = true;
  btnComplete = true;
  btnGetProduct = "";
  btnPrint = true;
  btnReject = true;
  btnCancelAndReplace = true;
  // btnCancelAndReplace = false;
  btnSave = true;

  pageEvent: PageEvent;
  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  public PositionRole: ModelSysPositionRole = new ModelSysPositionRole();
  public CashTaxForCancel: ModelCashTax = null;
  public FinBalance: ModelFinBalance = null;
  private authPositionRole: any;
  action: string = "";

  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private routerLink: Router,
    private sharedService: SharedService,
    public datepipe: DatePipe,
    public formatter: NgbDateParserFormatter,
    public SvDefault: DefaultService,
    private _svCashTax: CashtaxService,
    private reportService: ReportService,
    private authGuard: AuthGuard,
  ) {

  }

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  async ngOnInit() {
    this.myGroup = new FormGroup({
      branchFrom: new FormControl(),
      currency: new FormControl(),
      citizenid: new FormControl(),
      custname: new FormControl(),
      custaddr1: new FormControl(),
      custaddr2: new FormControl(),
      searchProduct: new FormControl(),
      searchCash: new FormControl(),
      date: new FormControl(this.date),
    });
    this.SvDefault.DoAction(async () => await this.start(), true);
  }

  private async start() {
    this.authPositionRole =  this.SvDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }

    this.document = new HeaderModel;
    this.document.BrnCode = this.sharedService.brnCode;
    this.document.CompCode = this.sharedService.compCode;
    this.document.CreatedBy = this.sharedService.user;
    this.document.LocCode = this.sharedService.locCode;
    let docGuid = this.route.snapshot.params.DocGuid;

    this.lines = [];

    if (docGuid == "New") {
      this.action = "New";
      await this.newDocument();
      this.status = "สร้าง";
      this.statusOriginal = this.status;
    } else {
      this.action = "Edit";
      await this.getDocumentAsync(docGuid);
      // this.getDocument(docGuid);
    }
    await this.hiddenButton();
  }

  onFormSubmit() {
    // this.isValidFormSubmitted = false;
    // if (this.myGroup.invalid) {
    //    return;
    // }
    // this.isValidFormSubmitted = true;
    // //save
    // this.myGroup.reset();
  }

  get citizenid() {
    return this.myGroup.get('citizenid');
  }
  //==================== Function ====================

  addCashSale() {
    if ((this.document.RefNo != undefined
      && this.document.RefNo != null
      && this.document.RefNo != "")
      || (this.lines.length > 0 && this.document.RefNo != this.cashSale.DocNo)
    ) {
      swal.fire({
        allowEscapeKey: false,
        allowOutsideClick: false,
        confirmButtonText: "ตกลง",
        denyButtonText: "ยกเลิก",
        icon: 'info',
        showDenyButton: true,
        title: 'คุณต้องการเปลี่ยนเอกสารขายสดใช่หรือไม่? <br>ระบบจะล้างข้อมูลสินค้าจากเอกสารขายสดเดิมออกทั้งหมด',
      }).then((result) => {
        if (result.isConfirmed) {
          this.getCashSale(this.cashSale.Guid);
          this.document.RefNo = this.cashSale.DocNo;
          this.lines = [];
          this.productSelectedList = [];
        } else if (result.isDenied) {
          this.cashSale.DocNo = this.document.RefNo;
        }
      })
    } else {
      this.getCashSale(this.cashSale.Guid);
      this.document.RefNo = this.cashSale.DocNo;
    }
  }

  addItemtoLine() {
    for (let i = 0; i < this.productSelectedList.length; i++) {
      var productObj = this.lines.find((row, index) => row.PdId == this.productSelectedList[i].PdId);
      if (!productObj) {
        //เพิ่มเฉพาะสินค้าที่ยังไม่เคยเลือก
        let obj = new DetailModel;
        obj.BrnCode = this.document.BrnCode;
        obj.CarId = "";
        obj.CompCode = this.document.CompCode;
        obj.DiscAmt = 0;
        obj.DiscAmtCur = obj.DiscAmt * this.document.CurRate;
        obj.DiscHdAmt = 0;
        obj.DiscHdAmtCur = 0;
        obj.DocNo = this.document.DocNo;
        obj.ItemQty = 0;
        obj.IsFree = false;
        obj.LocCode = this.document.LocCode;
        obj.LicensePlate = "";
        obj.PdId = this.productSelectedList[i].PdId;
        obj.PdName = this.productSelectedList[i].PdName;
        obj.SeqNo = i;
        obj.StockQty = 0;
        obj.SumAmt = ((obj.ItemQty * obj.UnitPrice || 0) - obj.DiscAmt); //edit
        obj.SumAmtCur = obj.SumAmt * this.document.CurRate;
        obj.SumItemAmt = 0;
        obj.SumItemAmtCur = 0;
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
      var line = this.productSelectedList.find((row, index) => row.PdId == this.lines[i].PdId);
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
  private calculateDocument2() {
    let subTotalHD = 0;
    let taxBaseHD = 0;
    let vatAmtHD = 0;
    let totalHD = 0;

    //Cal SubTotal, SubAmt
    this.lines.forEach(element => {
      // element.SubAmt =  parseFloat(((element.UnitPrice * element.ItemQty) - element.DiscAmt).toFixed(2));
      // element.SumItemAmt = (element.UnitPrice * element.ItemQty);
      subTotalHD += element.SumItemAmt;
    });

    //Cal DiscHdAmt, VAT
    this.lines.forEach(element => {
      if (!element.IsFree) {
        element.DiscHdAmt = (element.SumItemAmt / (subTotalHD || 1)) * this.document.DiscAmt;
        let beforeTax = 0;
        let taxBase = 0;
        let taxAmt = 0;
        if (element.VatType == "VE") {
          beforeTax = parseFloat(element.SumItemAmt.toFixed(2)) - parseFloat(element.DiscHdAmt.toFixed(2)); //element.SubAmt - element.DiscHdAmt;
          taxBase = beforeTax;
          taxAmt = ((taxBase * element.VatRate) / (100 || 1));
        } else if (element.VatType == "VI") {
          beforeTax = parseFloat(element.SumItemAmt.toFixed(2)) - parseFloat(element.DiscHdAmt.toFixed(2)); //element.SubAmt - element.DiscHdAmt;
          taxBase = ((beforeTax * 100) / ((100 + element.VatRate) || 1));
          taxAmt = (((element.SumItemAmt - element.DiscHdAmt) * element.VatRate) / ((100 + element.VatRate) || 1));
        } else if (element.VatType == "NV") {
          beforeTax = parseFloat(element.SumItemAmt.toFixed(2)) - parseFloat(element.DiscHdAmt.toFixed(2)); //element.SubAmt - element.DiscHdAmt;
          //taxBase = 0;
          taxBase = beforeTax;
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

  calculateDocument = () => {
    let subTotalHD = 0;
    let taxBaseHD = 0;
    let vatAmtHD = 0;
    let totalHD = 0;

    //Cal SubTotal, SubAmt
    this.lines.forEach(element => {
      element.SubAmt = parseFloat(((element.UnitPrice * element.ItemQty) - element.DiscAmt).toFixed(2));
      element.SumItemAmt = (element.UnitPrice * element.ItemQty);
      subTotalHD += element.SumItemAmt;
    });

    //Cal DiscHdAmt, VAT
    this.lines.forEach(element => {
      if (!element.IsFree) {
        element.DiscHdAmt = (element.SumItemAmt / (subTotalHD || 1)) * this.document.DiscAmt;
        let beforeTax = 0;
        let taxBase = 0;
        let taxAmt = 0;
        if (element.VatType == "VE") {
          beforeTax = parseFloat(element.SumItemAmt.toFixed(2)) - parseFloat(element.DiscHdAmt.toFixed(2)); //element.SubAmt - element.DiscHdAmt;
          taxBase = beforeTax;
          taxAmt = ((taxBase * element.VatRate) / (100 || 1));
        } else if (element.VatType == "VI") {
          beforeTax = parseFloat(element.SumItemAmt.toFixed(2)) - parseFloat(element.DiscHdAmt.toFixed(2)); //element.SubAmt - element.DiscHdAmt;
          taxBase = ((beforeTax * 100) / ((100 + element.VatRate) || 1));
          taxAmt = (((element.SumItemAmt - element.DiscHdAmt) * element.VatRate) / ((100 + element.VatRate) || 1));
        } else if (element.VatType == "NV") {
          beforeTax = parseFloat(element.SumItemAmt.toFixed(2)) - parseFloat(element.DiscHdAmt.toFixed(2)); //element.SubAmt - element.DiscHdAmt;
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

  calculateRow = (indexs: any) => {
    var productObj = this.lines.find((row, index) => index == indexs);
    if (productObj.ItemQty < 0) {
      productObj.ItemQty = 0;
      swal.fire({
        title: "ไม่อนุญาตให้กรอกจำนวนน้อยกว่าหรือเท่ากับ 0",
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'error'
      })
        .then(() => {
        });
    }

    productObj.SumAmt = ((productObj.ItemQty * productObj.UnitPrice) - productObj.DiscAmt);
    this.calculateDocument();
  };

  calculateDocumentProductValue = () => {
    let subTotalHD = 0;
    let taxBaseHD = 0;
    let vatAmtHD = 0;
    let totalHD = 0;

    //Cal SubTotal, SubAmt
    this.lines.forEach(element => {
      // element.SubAmt =  parseFloat(((element.UnitPrice * element.ItemQty) - element.DiscAmt).toFixed(2));
      // element.SumItemAmt = (element.UnitPrice * element.ItemQty);
      subTotalHD += element.SumItemAmt;
    });

    //Cal DiscHdAmt, VAT
    this.lines.forEach(element => {
      if (!element.IsFree) {
        element.DiscHdAmt = (element.SumItemAmt / (subTotalHD || 1)) * this.document.DiscAmt;
        let beforeTax = 0;
        let taxBase = 0;
        let taxAmt = 0;
        if (element.VatType == "VE") {
          beforeTax = parseFloat(element.SumItemAmt.toFixed(2)) - parseFloat(element.DiscHdAmt.toFixed(2)); //element.SubAmt - element.DiscHdAmt;
          taxBase = beforeTax;
          taxAmt = ((taxBase * element.VatRate) / (100 || 1));
        } else if (element.VatType == "VI") {
          beforeTax = parseFloat(element.SumItemAmt.toFixed(2)) - parseFloat(element.DiscHdAmt.toFixed(2)); //element.SubAmt - element.DiscHdAmt;
          taxBase = ((beforeTax * 100) / ((100 + element.VatRate) || 1));
          taxAmt = (((element.SumItemAmt - element.DiscHdAmt) * element.VatRate) / ((100 + element.VatRate) || 1));
        } else if (element.VatType == "NV") {
          beforeTax = parseFloat(element.SumItemAmt.toFixed(2)) - parseFloat(element.DiscHdAmt.toFixed(2)); //element.SubAmt - element.DiscHdAmt;
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

  calculateRowProductValue = (indexs: any) => {
    var productObj = this.lines.find((row, index) => index == indexs);
    if (productObj.ItemQty < 0) {
      productObj.ItemQty = 0;
      swal.fire({
        title: "ไม่อนุญาตให้กรอกจำนวนน้อยกว่าหรือเท่ากับ 0",
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'error'
      })
        .then(() => {
        });
    }

    let numUnitPrice = (productObj.UnitPrice || 0.00);
    if (numUnitPrice === 0) {
      numUnitPrice = 1;
    }
    productObj.ItemQty = (productObj.SubAmt) / numUnitPrice;
    productObj.SumItemAmt = productObj.SubAmt - productObj.DiscAmt

    // productObj.SumAmt = ((productObj.ItemQty * productObj.UnitPrice) - productObj.DiscAmt);
    this.calculateDocumentProductValue();
  };

  calculateDocumentDiscount = () => {
    let subTotalHD = 0;
    let taxBaseHD = 0;
    let vatAmtHD = 0;
    let totalHD = 0;

    //Cal SubTotal, SubAmt
    this.lines.forEach(element => {
      // element.SubAmt =  parseFloat(((element.UnitPrice * element.ItemQty) - element.DiscAmt).toFixed(2));
      // element.SumItemAmt = (element.UnitPrice * element.ItemQty);
      element.SumItemAmt = (element.SubAmt - element.DiscAmt);
      subTotalHD += element.SumItemAmt;
    });

    //Cal DiscHdAmt, VAT
    this.lines.forEach(element => {
      if (!element.IsFree) {
        element.DiscHdAmt = (element.SumItemAmt / (subTotalHD || 1)) * this.document.DiscAmt;
        let beforeTax = 0;
        let taxBase = 0;
        let taxAmt = 0;
        if (element.VatType == "VE") {
          beforeTax = parseFloat(element.SumItemAmt.toFixed(2)) - parseFloat(element.DiscHdAmt.toFixed(2)); //element.SubAmt - element.DiscHdAmt;
          taxBase = beforeTax;
          taxAmt = ((taxBase * element.VatRate) / (100 || 1));
        } else if (element.VatType == "VI") {
          beforeTax = parseFloat(element.SumItemAmt.toFixed(2)) - parseFloat(element.DiscHdAmt.toFixed(2)); //element.SubAmt - element.DiscHdAmt;
          taxBase = ((beforeTax * 100) / ((100 + element.VatRate) || 1));
          taxAmt = (((element.SumItemAmt - element.DiscHdAmt) * element.VatRate) / ((100 + element.VatRate) || 1));
        } else if (element.VatType == "NV") {
          beforeTax = parseFloat(element.SumItemAmt.toFixed(2)) - parseFloat(element.DiscHdAmt.toFixed(2)); //element.SubAmt - element.DiscHdAmt;
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

  calculateRowDiscount = (indexs: any) => {
    var productObj = this.lines.find((row, index) => index == indexs);
    if (productObj.ItemQty < 0) {
      productObj.ItemQty = 0;
      swal.fire({
        title: "ไม่อนุญาตให้กรอกจำนวนน้อยกว่าหรือเท่ากับ 0",
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'error'
      })
        .then(() => {
        });
    }

    // productObj.SumAmt = ((productObj.ItemQty * productObj.UnitPrice) - productObj.DiscAmt);
    this.calculateDocumentDiscount();
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

    this.SvDefault.ShowCancelDialog(() => {
      this.status = "ยกเลิก";
      this.document.DocStatus = "Cancel";
      this.saveDocument();
    });
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
        this.lines = [];
        this.productSelectedList = [];
        this.myGroup.get('branchFrom').setValue(null);
        this.myGroup.controls['citizenid'].setValue("");
        this.myGroup.controls['custname'].setValue("");
        this.myGroup.controls['custaddr1'].setValue("");
        this.myGroup.controls['custaddr2'].setValue("");
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
  getCashSale(docGuid: string = "") {
    let req = {
      "Guid": docGuid
    }
    this.httpClient.post(this.urlSale + "/api/CashSale/CashSale", req)
      .subscribe(
        response => {
          this.lines = [];
          let pDBarcodeList = "";
          let rqList = response["Data"].SalCashsaleDt;
          for (let i = 0; i < rqList.length; i++) {
            //   if(rqList[i].StockRemain > 0){
            //     //เฉพาะที่เหลือยอด Remain เท่านั้น
            let obj = new DetailModel;
            obj.BrnCode = this.document.BrnCode;
            obj.CompCode = this.document.CompCode;
            obj.DiscAmt = rqList[i].DiscAmt;
            obj.DiscAmtCur = obj.DiscAmt * this.document.CurRate;
            obj.DocNo = this.document.DocNo;
            obj.IsFree = rqList[i].IsFree;
            obj.ItemQty = rqList[i].ItemQty;
            obj.LicensePlate = "";
            obj.LocCode = this.document.LocCode;
            obj.PdId = rqList[i].PdId;
            obj.PdName = rqList[i].PdName;
            obj.SeqNo = 0;
            obj.StockQty = 0;
            obj.SubAmt = 0;
            obj.SubAmtCur = obj.SubAmt * this.document.CurRate;
            obj.TaxBaseAmt = 0;
            obj.TaxBaseAmtCur = obj.TaxBaseAmt * this.document.CurRate;
            obj.UnitBarcode = rqList[i].UnitBarcode;
            obj.UnitId = rqList[i].UnitId;
            obj.UnitName = rqList[i].UnitName;
            obj.UnitPrice = rqList[i].UnitPrice;
            obj.UnitPriceCur = obj.UnitPrice * this.document.CurRate;
            obj.VatAmt = 0;
            obj.VatAmtCur = obj.VatAmt * this.document.CurRate;
            obj.VatRate = rqList[i].VatRate;
            obj.VatType = rqList[i].VatType;

            //     //คำนวณราคาที่ลดไปจากปัจจุบัน
            //     // obj.DiscAmt = (obj.UnitPrice - obj.RefPrice) * obj.ItemQty;
            pDBarcodeList += obj.UnitBarcode;
            if (i == rqList.length - 1) {
              pDBarcodeList += "";
            } else {
              pDBarcodeList += ",";
            }

            this.lines.push(obj);
            //   }
          }
          // this.getProductSelectedList(pDBarcodeList);
          this.calculateDocument();
        },
        error => {
          console.log("Error", error);
        }
      );
  }

  getCashSaleValidate() {
    this.btnGetCashSale = "";
    // if(this.document.CustCode == "" || this.document.CustCode == null || this.document.CustCode == undefined) {
    //   this.btnGetCashSale = "";
    //   swal.fire({
    //     title: 'กรุณาเลือกข้อมูลลูกค้า',
    //     allowOutsideClick: false,
    //     allowEscapeKey: false,
    //     icon : 'error'
    //   })
    //   .then(()=>{
    //     this.btnGetCashSale = "";
    //   });
    // } else if(this.route.snapshot.params.DocGuid != "New") {
    if (this.document.DocStatus != "New" || this.CashTaxForCancel != null) {
      // if(this.route.snapshot.params.DocGuid != "New") {
      swal.fire({
        title: 'ไม่อนุญาตให้เปลี่ยนเอกสารขายสด<br>เมื่อมีการบันทึกเอกสารเรียบร้อยเเล้ว',
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'error'
      })
        .then(() => {
          this.btnGetCashSale = "";
        });
    } else {
      this.btnGetCashSale = "modal-getCash";
      this.getCashList();
    }
  }

  getCashList(page: number = 1) {
    this.cashSaleList = [];
    let req =
    {
      "BrnCode": this.document.BrnCode,
      "CompCode": this.document.CompCode,
      "LocCode": this.document.LocCode,
      "page": page,
      "itemsPerPage": this.pageSize,
      "Keyword": this.myGroup.get('searchCash').value,
    }
    this.httpClient.post(this.urlSale + "/api/CashSale/GetCashSaleActive", req)
      .subscribe(
        response => {
          for (let i = 0; i < response["items"].length; i++) {
            let obj = new HeaderModel();
            obj.DocNo = response["items"][i].docNo;
            obj.RefNo = response["items"][i].refNo;
            obj.Guid = response["items"][i].guid;

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
            this.cashSaleList.push(obj);
          }

          this.length = response["totalItems"];
        },
        error => {
          console.log("Error", error);
        }
      );
    return this.cashSaleList;
  }


  onPaginateChange(event: PageEvent) {
    let page = event.pageIndex;
    this.pageSize = event.pageSize;

    if (this.myGroup.get('searchCash').value == null) {
      page = page + 1;
    }

    this.getCashList(page);
  }

  private async getDocumentAsync(docGuid: string = "") {
    this.urlReportView = this.sharedService.urlViewer + '/taxinvoice/PrintDoc/' + this.sharedService.user + '/' + docGuid;
    let req = {
      "Guid": docGuid
    }
    this.document = new HeaderModel();
    this.lines = [];
    var response = <any>await this.httpClient.post(this.urlSale + "/api/CashTax/CashTax", req).toPromise();
    if (response != null && response.hasOwnProperty("Data")) {
      let objData = response.Data;
      if (!this.SvDefault.CheckDocBrnCode(objData?.BrnCode)) {
        return;
      }
      this.SvDefault.CopyObject(objData, this.document);
      this.document.DocDate = new Date(this.document.DocDate);
      this.myGroup.get('date').setValue(this.document.DocDate);
      this.myGroup.controls['citizenid'].setValue(this.document.CitizenId);
      this.myGroup.controls['custname'].setValue(this.document.CustName);
      this.myGroup.controls['custaddr1'].setValue(this.document.CustAddr1);
      this.myGroup.controls['custaddr2'].setValue(this.document.CustAddr2);
      if (objData.hasOwnProperty("SalTaxinvoiceDt")) {
        let rqList = <ModelSalTaxinvoiceDt[]>response["Data"].SalTaxinvoiceDt;
        if (Array.isArray(rqList) && rqList.length) {
          this.lines = rqList.filter(x => x != null).map(x => {
            let dt = new DetailModel();
            this.SvDefault.CopyObject(x, dt);
            // dt.DiscAmtCur = dt.DiscAmt * this.document.CurRate;
            // dt.SumAmt = ((dt.ItemQty * dt.UnitPrice || 0) - dt.DiscAmt);
            // dt.SumAmtCur = dt.SumAmt * this.document.CurRate;
            // dt.TaxBaseAmtCur = dt.TaxBaseAmt * this.document.CurRate;
            // dt.UnitPriceCur = dt.UnitPrice * this.document.CurRate;
            // dt.VatAmtCur = dt.VatAmt * this.document.CurRate;
            return dt;
          });
          let pDListID = this.lines.map(x => x.PdId).join(",");
          this.getProductSelectedList(pDListID);
        }
        //this.status = "แอคทีฟ";
      }
    }
    this.calculateDocument2();
  }

  async GetCustomer() {
    await this.SvDefault.DoActionAsync(async () => await this.getCustomer());
  }

  async getCustomer() {
    // if (this.document.CitizenId == "" || this.document.CitizenId == null) {
      let customer: ModelMasCustomer = await this._svCashTax.GetCustomerByCustCode(this.document.CustCode);
      if (customer != null) {
        this.document.CitizenId = customer.CitizenId;
        this.myGroup.controls['custname'].setValue(customer.CustName);
        this.myGroup.controls['custaddr1'].setValue(customer.CustAddr1);
        this.myGroup.controls['custaddr2'].setValue(customer.CustAddr2);
      }
    // }
  }

  getDocument(docGuid: string = "") {
    this.urlReportView = this.sharedService.urlViewer + '/taxinvoice/PrintDoc/' + this.sharedService.user + '/' + docGuid;
    let req = {
      "Guid": docGuid
    }
    this.httpClient.post(this.urlSale + "/api/CashTax/CashTax", req)
      .subscribe(
        response => {
          this.document.BrnCode = response["Data"].BrnCode;
          this.document.CompCode = response["Data"].CompCode;
          this.document.CreatedBy = response["Data"].CreatedBy;
          this.document.CreatedDate = new Date(response["Data"].CreatedDate);
          this.document.CurRate = response["Data"].CurRate;
          this.document.Currency = response["Data"].Currency;
          this.document.CustCode = response["Data"].CustCode;
          this.document.CustName = response["Data"].CustName;
          this.document.CustAddr1 = response["Data"].CustAddr1;
          this.document.CustAddr2 = response["Data"].CustAddr2;
          this.document.DiscAmt = response["Data"].DiscAmt;
          this.document.DiscAmtCur = response["Data"].DiscAmtCur;
          this.document.DiscRate = response["Data"].DiscRate;
          this.document.DocDate = new Date(response["Data"].DocDate);
          this.document.DocNo = response["Data"].DocNo;
          this.document.DocPattern = response["Data"].DocPattern;
          this.document.DocStatus = response["Data"].DocStatus;
          this.document.DocType = response["Data"].DocType;
          this.document.Guid = response["Data"].Guid;
          this.document.ItemCount = response["Data"].ItemCount;
          this.document.LocCode = response["Data"].LocCode;
          this.document.NetAmt = response["Data"].NetAmt;
          this.document.NetAmtCur = response["Data"].NetAmtCur;
          this.document.Post = response["Data"].Post;
          this.document.RefNo = response["Data"].RefNo;
          this.document.RunNumber = response["Data"].RunNumber;
          this.document.SubAmt = response["Data"].SubAmt;
          this.document.SubAmtCur = response["Data"].SubAmtCur;
          this.document.TaxBaseAmt = response["Data"].TaxBaseAmt;
          this.document.TaxBaseAmtCur = response["Data"].TaxBaseAmtCur;
          this.document.CitizenId = response["Data"].CitizenId;
          this.document.TotalAmt = response["Data"].TotalAmt;
          this.document.TotalAmtCur = response["Data"].TotalAmtCur;
          this.document.UpdatedBy = response["Data"].UpdatedBy;
          this.document.UpdatedDate = new Date(response["Data"].UpdatedDate);
          this.document.VatAmt = response["Data"].VatAmt;
          this.document.VatAmtCur = response["Data"].VatAmtCur;
          this.document.VatRate = response["Data"].VatRate;

          this.myGroup.controls['citizenid'].setValue(response["Data"].CitizenId);
          this.myGroup.controls['custname'].setValue(response["Data"].CustName);
          this.myGroup.controls['custaddr1'].setValue(response["Data"].CustAddr1);
          this.myGroup.controls['custaddr2'].setValue(response["Data"].CustAddr2);
          let pDListID = "";
          let rqList = response["Data"].SalTaxinvoiceDt;

          for (let i = 0; i < rqList.length; i++) {
            let obj = new DetailModel;
            obj.BrnCode = rqList[i].BrnCode;
            obj.CompCode = rqList[i].CompCode;
            obj.DiscAmt = rqList[i].DiscAmt;
            obj.DocNo = this.document.DocNo;
            obj.ItemQty = rqList[i].ItemQty;
            obj.LicensePlate = rqList[i].LicensePlate;
            obj.LocCode = this.document.LocCode;
            obj.UnitBarcode = rqList[i].UnitBarcode;
            obj.IsFree = rqList[i].IsFree;
            obj.PdId = rqList[i].PdId;
            obj.PdName = rqList[i].PdName;
            obj.SeqNo = rqList[i].SeqNo;
            obj.StockQty = rqList[i].StockQty;
            obj.TaxBaseAmt = rqList[i].TaxBaseAmt;
            obj.UnitId = rqList[i].UnitId;
            obj.UnitName = rqList[i].UnitName;
            obj.UnitPrice = rqList[i].UnitPrice;
            obj.VatAmt = rqList[i].VatAmt;
            obj.VatRate = rqList[i].VatRate;
            obj.VatType = rqList[i].VatType;
            obj.DiscAmtCur = obj.DiscAmt * this.document.CurRate;
            obj.SumAmt = ((obj.ItemQty * obj.UnitPrice || 0) - obj.DiscAmt);
            obj.SumAmtCur = obj.SumAmt * this.document.CurRate;
            obj.TaxBaseAmtCur = obj.TaxBaseAmt * this.document.CurRate;
            obj.UnitPriceCur = obj.UnitPrice * this.document.CurRate;
            obj.VatAmtCur = obj.VatAmt * this.document.CurRate;
            this.lines.push(obj);

            pDListID += obj.PdId;
            if (i == rqList.length - 1) {
              pDListID += "";
            } else {
              pDListID += ",";
            }
          }

          this.getProductSelectedList(pDListID);
          this.calculateDocument();

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
              this.btnComplete = true;
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
          this.headerCard = this.document.DocNo;
          this.statusOriginal = this.status;
        },
        error => {
          console.log("Error", error);
        }
      );
  }

  dateAddEvent() {
    this.getPattern();
  }

  getPattern = (): void => {
    var req =
    {
      "BrnCode": this.document.BrnCode,
      "CompCode": this.document.CompCode,
      "LocCode": this.document.LocCode,
      "DocDate": this.SvDefault.GetFormatDate(this.myGroup.get('date').value),
      "DocNo": this.document.DocNo,
      "DocType": this.document.DocType === 'CashTax' ? "CashTax" : "TaxInvoice"
      // "DocType": "CashTax"
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

  getProductList() {
    // this.productSelectedList = [];
    this.productList = [];
    var data =
    {
      "CompCode": this.document.CompCode,
      "LocCode": this.document.LocCode,
      "BrnCode": this.document.BrnCode,
      "Keyword": this.myGroup.get('searchProduct').value,
      "SystemDate": this.SvDefault.GetFormatDate(<Date>this.myGroup.get('date').value) //this.SvDefault.GetFormatDate(<Date>this.document.DocDate)
    }
    this.httpClient.post(this.urlMas + "/api/Product/GetProductAllTypeList", data)
      .subscribe(
        response => {
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
            var pdl = this.productSelectedList.filter((row, index) => row.PdId == obj.PdId);
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

  getProductSelectedList(pDListID: string = "") {

    this.productSelectedList = [];
    var data =
    {
      "CompCode": this.document.CompCode,
      "LocCode": this.document.LocCode,
      "BrnCode": this.document.BrnCode,
      "PDListID": pDListID,
      "SystemDate": this.SvDefault.GetFormatDate(<Date>this.document.DocDate)
    }

    this.httpClient.post(this.urlMas + "/api/Product/GetProductAllTypeList", data)
      .subscribe(
        response => {
          for (let i = 0; i < response["Data"].length; i++) {
            let obj = new ProductModel();
            obj.PdId = response["Data"][i].PdId;
            obj.UnitBarcode = response["Data"][i].UnitBarcode;
            obj.UnitPrice = response["Data"][i].UnitPrice;
            obj.PdName = response["Data"][i].PdName;
            obj.PdStatus = response["Data"][i].PdStatus;
            obj.PdDesc = response["Data"][i].PdDesc;
            obj.UnitId = response["Data"][i].UnitId;
            obj.UnitName = response["Data"][i].UnitName;
            obj.GroupId = response["Data"][i].GroupId;
            obj.VatType = response["Data"][i].VatType;
            obj.VatRate = response["Data"][i].VatRate;
            obj.CreatedDate = response["Data"][i].CreatedDate;
            obj.CreatedBy = response["Data"][i].CreatedBy;
            obj.UpdatedDate = response["Data"][i].UpdatedDate;
            obj.UpdatedBy = response["Data"][i].UpdatedBy;
            this.productSelectedList.push(obj);
          }
        },
        error => {
          console.log("Error", error);
        }
      );
  }

  getUnitPrice = (pdId: string): number => {
    let unitPrice = 0;
    var data =
    {
      "CompCode": this.document.CompCode,
      "BrnCode": this.document.BrnCode,
      "LocCode": this.document.LocCode,
      "PDListID": pdId,
      "SystemDate": this.SvDefault.GetFormatDate(<Date>this.document.DocDate)
    }
    this.httpClient.post(this.urlMas + "/api/Product/GetProductAllTypeList", data)
      .subscribe(
        response => {
          for (let i = 0; i < response["Data"].length; i++) {
            unitPrice = response["Data"][i].UnitPrice;
          }
        },
        error => {
          console.log("Error", error);
        }
      );
    return unitPrice;
  }
  async GetTaxProfile() {
    await this.SvDefault.DoActionAsync(async () => await this.getTaxProfile(this.document.CitizenId), true);
  }
  private async getTaxProfile(citizenid: string) {
    let apiResult: ModelTaxProfile = await this.SvDefault.GetTaxProfile(citizenid);
    if (apiResult == null) {
      return;
    }

    if (apiResult?.statusCode !== 200) {
      // Swal.fire((apiResult?.message || "").toString().trim(),"" , "warning");
      this.myGroup.controls['custaddr1'].setValue("");
      this.myGroup.controls['custaddr2'].setValue("");
      return;
    }

    // this.document.CitizenId = (apiResult.data?.nid || "").toString().trim();
    let custname = (apiResult.data?.branchTitleName + " " + apiResult.data?.branchName).trim();
    let custaddr1 = "";
    let custaddr2 = "";
    if (apiResult.data?.provinceName.includes("กรุงเทพ")) {
      custaddr1 += (apiResult.data?.houseNumber) + " ";
      custaddr1 += (apiResult.data?.mooNumber == "" ? "" : "หมู่" + apiResult.data?.mooNumber) + " ";
      custaddr1 += (apiResult.data?.buildingName == "" ? "" : "อาคาร" + apiResult.data?.buildingName) + " ";
      custaddr1 += (apiResult.data?.floorNumber == "" ? "" : "ชั้น" + apiResult.data?.floorNumber) + " ";
      custaddr1 += (apiResult.data?.streetName == "" ? "" : "ถ." + apiResult.data?.streetName) + " ";
      custaddr1 += (apiResult.data?.thumbolName == "" ? "" : "แขวง" + apiResult.data?.thumbolName) + " ";

      custaddr2 = ("เขต" + apiResult.data?.amphurName + " " + apiResult.data?.provinceName + " " + apiResult.data?.postCode).trim();
    } else {
      custaddr1 += (apiResult.data?.houseNumber) + " ";
      custaddr1 += (apiResult.data?.mooNumber == "" ? "" : "หมู่" + apiResult.data?.mooNumber) + " ";
      custaddr1 += (apiResult.data?.buildingName == "" ? "" : "อาคาร" + apiResult.data?.buildingName) + " ";
      custaddr1 += (apiResult.data?.floorNumber == "" ? "" : "ชั้น" + apiResult.data?.floorNumber) + " ";
      custaddr1 += (apiResult.data?.streetName == "" ? "" : "ถ." + apiResult.data?.streetName) + " ";
      custaddr1 += (apiResult.data?.thumbolName == "" ? "" : "ต." + apiResult.data?.thumbolName) + " ";

      custaddr2 = ("อ." + apiResult.data?.amphurName + " จ." + apiResult.data?.provinceName + " " + apiResult.data?.postCode).trim();
    }

    this.myGroup.controls['custname'].setValue(custname);
    this.myGroup.controls['custaddr1'].setValue(custaddr1.trim());
    this.myGroup.controls['custaddr2'].setValue(custaddr2.trim());
    this.document.CustCode = this.SvDefault.GetString(apiResult.data?.custCode);
  }

  // getTaxProfile = ():void => {
  //   let citizenid = this.document.CitizenId
  //   var data =
  //     {
  //       "tin":citizenid,
  //       "branch": "0"
  //     }
  //   this.httpClient.post(this.urlMas + "/api/Customer/GetTaxInfo",data)
  //   .subscribe(
  //     response  => {
  //       let result = <ModelTaxProfile>response;
  //       console.log("getTaxProfile >>>" + JSON.stringify(result) );
  //     },
  //     error  => {
  //       console.log("Error : ", error);
  //     }
  //   );
  // }

  hilightRow(indexs) {
    if (indexs == null) {
      indexs = this.cashSaleList.findIndex(e => e.DocNo === this.cashSale.DocNo);
    }
    if (indexs != null) {
      const slides = document.getElementsByClassName('trCashSaleStyle');
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

  async newDocument() {
    this.document.BrnCode = this.sharedService.brnCode;
    this.document.CompCode = this.sharedService.compCode;
    this.document.CreatedBy = this.sharedService.user;
    this.document.CreatedDate = new Date();
    this.document.CurRate = 1;
    this.document.Currency = "THB";
    this.document.CustCode = "";
    this.document.CustName = "";
    this.document.CustAddr1 = "";
    this.document.CustAddr2 = "";
    this.document.DiscAmt = 0;
    this.document.DiscAmtCur = 0;
    this.document.DiscRate = "";
    this.document.DocDate = this.SvDefault.GetFormatDate(this.date);
    this.document.DocNo = "";
    this.document.DocPattern = "";
    this.document.DocType = "CashTax"
    this.document.DocStatus = "New";
    this.document.Guid = "1f8f68b6-e7ff-42f0-8b35-27bb2cc57f93"; //ต้องใส่หลอกไว้ งั้น Model ไม่รองรับ
    this.document.ItemCount = 0;
    this.document.LocCode = this.sharedService.locCode;
    this.document.NetAmt = 0;
    this.document.NetAmtCur = 0;
    this.document.Post = "N";
    this.document.RefNo = null;
    this.document.SubAmt = 0;
    this.document.SubAmtCur = 0;
    this.document.CitizenId = null;
    this.document.TaxBaseAmt = null;
    this.document.TaxBaseAmtCur = null;
    this.document.TotalAmt = 0;
    this.document.TotalAmtCur = 0;
    this.document.VatAmt = 0;
    this.document.VatAmtCur = 0;
    this.document.VatRate = 0;
    let arrPattern = await this.SvDefault.GetPatternAsync("CashTax");
    let strDocPattern: string = this.SvDefault.GenPatternString(this.date, arrPattern, this.sharedService.compCode, this.sharedService.brnCode);
    this.document.DocNo = strDocPattern;
    this.document.DocPattern = strDocPattern;
    //Set HeaderCard
    this.headerCard = "บันทึกขายสด(ใบกำกับภาษีเต็มรูป)";
  }
  private async hiddenButton() {
    let objHidden: ModelHiddenButton = this.SvDefault.GetHiddenButton2(this.document?.DocStatus, this.document?.Post);
    this.btnSave = objHidden.btnSave;
    this.btnPrint = objHidden.btnPrint;
    this.btnCancel = objHidden.btnCancel;
    this.btnClear = objHidden.btnClear;
    this.btnBack = objHidden.btnBack;
    this.btnComplete = objHidden.btnComplete;
    this.btnApprove = objHidden.btnApprove;
    this.btnReject = objHidden.btnReject;
    this.status = objHidden.status;
    if (this.document.DocStatus === "Active") {
      let cashtax: ModelCashTax = this.copyDocument();

      // let finBalance: ModelFinBalance = await this._svCashTax.GetFinBalanceByCashTax(cashtax);
      // this.btnCancelAndReplace = finBalance != null && finBalance.BalanceAmt > 0;

      // this.PositionRole = await this.SvDefault.GetPositionRole(this.sharedService.user , "CashtaxList");
      // let jsonObj: any = JSON.parse(this.PositionRole.JsonData);
      // let sysPosit: ReNew = <ReNew>jsonObj;

      // if(sysPosit != null && sysPosit.IS_RENEW == "Y")
      // {
      //   this.btnCancelAndReplace = false;
      // }
      // else
      // {
      //   this.btnCancelAndReplace = true;
      // }

      
      let jsonObj: any = JSON.parse(this.authPositionRole.jsonData);
      let sysPosit: ReNew = <ReNew>jsonObj;

      if (sysPosit != null && sysPosit.IS_RENEW == "Y") {
        this.btnCancelAndReplace = false;
      }
      else {
        this.btnCancelAndReplace = true;
      }
    } else {
      this.btnCancelAndReplace = true;
    }
  }

  async exportPDF() {
    await this.SvDefault.DoActionAsync(async () => await this.ExportPDF(), true);
  }

  private async ExportPDF() {

    await this.reportService.ExportReportTaxInvoicePDF(this.document.CompCode, this.document.BrnCode, this.document.DocNo, this.route.snapshot.params.DocGuid, this.sharedService.user);
  }


  printDocument = () => {
    if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isPrint")) {
      this.SvDefault.ShowPositionRoleMessage("IsPrint");
      return;
    }
    
    let param: HttpParams = new HttpParams();
    param = param.append("guid", this.route.snapshot.params.DocGuid);
    param = param.append("compCode", this.document.CompCode);
    param = param.append("brnCode", this.document.BrnCode);
    param = param.append("locCode", this.document.LocCode);
    param = param.append("printby", this.sharedService.user);
    this.httpClient.get(this.urlReport + "/api/TaxInvoice/Print", { params: param })
      .subscribe(
        response => {
          let base64String = response["Data"].FileContents;
          let fileName = response["Data"].FileDownloadName;
          // this.downloadPdf(base64String, fileName);
        },
        error => {
          console.log("Error", error);
          swal.fire({
            allowEscapeKey: false,
            allowOutsideClick: false,
            // icon : 'error',
            title: 'เกิดข้อผิดพลาด!',
            text: "Print max 3",
          })
        }
      );
  };

  // downloadPdf(base64String, fileName) {
  //   if (window.navigator && window.navigator.msSaveOrOpenBlob) {
  //     // Download PDF in IE
  //     let byteChar = atob(base64String);
  //     let byteArray = new Array(byteChar.length);
  //     for (let i = 0; i < byteChar.length; i++) {
  //       byteArray[i] = byteChar.charCodeAt(i);
  //     }
  //     let uIntArray = new Uint8Array(byteArray);
  //     let blob = new Blob([uIntArray], { type: 'application/pdf' });
  //     window.navigator.msSaveOrOpenBlob(blob, '${fileName}.pdf');
  //   } else {
  //     // Download PDF in Chrome etc.
  //     const source = 'data:application/pdf;base64,' + base64String;
  //     const link = document.createElement("a");
  //     link.href = source;
  //     link.download = `${fileName}.pdf`
  //     link.click();
  //   }
  // }

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

  async PrepareCancelAndReplace() {
    await this.SvDefault.DoActionAsync(async () => await this.prepareCancelAndReplace());
  }
  private async prepareCancelAndReplace() {
    let strMessage: string = "คุณแน่ใจหรือ ที่จะยกเลิกเอกสารใบนี้ แล้วออกใบใหม่ทดแทน";
    let swOption = <SweetAlertOptions>{
      showCancelButton: true,
      title: strMessage,
      icon: "question",
    };
    let swResult: SweetAlertResult<any> = await Swal.fire(swOption);
    if (!swResult.isConfirmed) {
      return;
    }
    Swal.showLoading();
    let cashtax: ModelCashTax = this.copyDocument();
    let finBalance: ModelFinBalance = await this._svCashTax.GetFinBalanceByCashTax(cashtax);

    if (finBalance != null && finBalance.BalanceAmt < finBalance.NetAmt) {
      await Swal.fire("รายการนี้ถูกต้ดหนี้แล้ว ไม่อนุญาตุให้ยกเลิก", "", "warning");
      return;
    }

    this.CashTaxForCancel = cashtax;
    this.FinBalance = finBalance;
    this.document.DocStatus = "New";
    this.getPattern();
    this.btnSave = false;
    this.btnPrint = true;
    this.btnCancel = true;
    this.btnClear = false;
    this.btnBack = false;
    this.btnComplete = true;
    this.btnApprove = true;
    this.btnReject = true;
    this.status = "สร้าง";
    this.statusOriginal = this.status;
    this.btnCancelAndReplace = true;
    this.headerCard = "บันทึกขายสด(ใบกำกับภาษีเต็มรูป)";
    if (Swal.isLoading) {
      Swal.close();
    }
    // this.route.snapshot.params.DocGuid = "New"
  }

  private copyDocument(): ModelCashTax {
    let result = new ModelCashTax();
    this.SvDefault.CopyObject(this.document, result);
    result.DocDate = this.SvDefault.GetFormatDate(<Date>this.document.DocDate);
    result.CustName = this.myGroup.get('custname').value;
    result.CustAddr1 = this.myGroup.get('custaddr1').value;
    result.CustAddr2 = this.myGroup.get('custaddr2').value;
    result.CitizenId = this.myGroup.get('citizenid').value;
    result.CreatedBy = this.sharedService.user;
    if (Array.isArray(this.lines) && this.lines.length) {
      result.SalTaxinvoiceDt = this.lines.map(x => {
        let dt = new ModelSalTaxinvoiceDt();
        this.SvDefault.CopyObject(x, dt);
        return dt;
      });
    }
    return result;
  }

  async CancelAndReplace() {
    await this.SvDefault.DoActionAsync(async () => await this.cancelAndReplace(), true);
  }
  private async cancelAndReplace() {
    if (!this.validateData()) {
      return;
    }
    let modelCancelAndReplace = <ModelCashTaxCancelAndReplace>{
      CancelCashTax: this.CashTaxForCancel,
      NewCashTax: this.copyDocument(),
      FinBalance: this.FinBalance,
    };

    let apiResult: ModelCashTaxCancelAndReplace = await this._svCashTax.CancelAndReplaceAsync(modelCancelAndReplace);
    await Swal.fire("ยกเลิกและออกทดแทน สำเร็จ", "", "success");
    this.SvDefault.CopyObject(apiResult.NewCashTax, this.document);
    // this.status = "แอคทีฟ";

    if (modelCancelAndReplace.CancelCashTax.Post.toLocaleLowerCase() == "p") {
      this.status = "ปิดสิ้นวัน";
    }
    else {
      if (modelCancelAndReplace.CancelCashTax.DocStatus == "Cancel") {
        this.status = "ยกเลิก";
      } else if (modelCancelAndReplace.CancelCashTax.DocStatus == "Ready") {
        this.status = "พร้อมใช้";
      } else if (modelCancelAndReplace.CancelCashTax.DocStatus == "Reference") {
        this.status = "เอกสารถูกอ้างอิง";
      } else if (modelCancelAndReplace.CancelCashTax.DocStatus == "Active") {
        this.status = "แอคทีฟ";
      } else if (modelCancelAndReplace.CancelCashTax.DocStatus == "Wait") {
        this.status = "รออนุมัติ";
      }
    }
    this.btnApprove = true;
    this.btnBack = false;
    this.btnCancel = false;
    this.btnClear = true;
    this.btnComplete = true;
    this.btnPrint = false;
    this.btnReject = true;
    this.btnSave = false;
    this.btnCancelAndReplace = true;
    this.statusOriginal = this.status;
    let strGuid = (apiResult?.NewCashTax?.Guid || "").toString().trim();
    if (strGuid !== "") {
      this.routerLink.navigate(['/Cashtax/' + strGuid]);
    }
    this.CashTaxForCancel = null;
    this.FinBalance = null;
  }

  saveDocument = (): void => {
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
    
    if (this.validateData()) {
      var data =
      {
        "CompCode": this.document.CompCode,
        "BrnCode": this.document.BrnCode,
        "LocCode": this.document.LocCode,
        "DocNo": this.document.DocNo,
        "DocType": this.document.DocType,
        "DocStatus": this.document.DocStatus,
        // "DocDate": this.SvDefault.GetFormatDate(<Date>this.document.DocDate),
        "DocDate": this.SvDefault.GetFormatDate(this.myGroup.get('date').value),
        // "DocDate": this.SvDefault.GetFormatDate(this.date),
        "CustCode": this.document.CustCode,
        "CustName": this.myGroup.get('custname').value,
        "CustAddr1": this.myGroup.get('custaddr1').value,
        "CustAddr2": this.myGroup.get('custaddr2').value,
        "ItemCount": this.document.ItemCount,
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
        "CitizenId": this.myGroup.get('citizenid').value,
        "VatRate": this.document.VatRate,
        "VatAmt": this.document.VatAmt,
        "VatAmtCur": this.document.VatAmtCur,
        "NetAmt": this.document.NetAmt,
        "NetAmtCur": this.document.NetAmtCur,
        "Post": this.document.Post,
        "RunNumber": this.document.RunNumber,
        "RefNo": this.document.RefNo,
        "DocPattern": this.document.DocPattern,
        "Guid": this.document.Guid,
        "CreatedBy": this.document.CreatedBy,
        "CreatedDate": this.document.CreatedDate,
        "UpdatedBy": this.document.UpdatedBy,
        "UpdatedDate": this.document.UpdatedDate,
        "SalTaxinvoiceDt": this.lines
      };

      const headers = { 'content-type': 'application/json' }
      const body = JSON.stringify(data);
      if (this.document.DocStatus == "New") {
        data.DocStatus = "Active";
        this.httpClient.post(this.urlSale + "/api/CashTax/CreateCashTax", data)
          .subscribe(
            response => {
              swal.fire({
                allowEscapeKey: false,
                allowOutsideClick: false,
                icon: 'success',
                title: 'บันทึกข้อมูลสำเร็จ',
              })
                .then(() => {
                  this.lines = [];
                  var docGuid = response["Data"].Guid;
                  this.getDocumentAsync(docGuid);
                  this.routerLink.navigate(['/Cashtax/' + docGuid]);
                });

            },
            error => {
              console.log("Error", error);
              swal.fire({
                allowEscapeKey: false,
                allowOutsideClick: false,
                icon: 'error',
                title: 'มีข้อผิดพลาด',
                text: error.error.messge
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
        let req = {
          "guid": this.route.snapshot.params.DocGuid
        }
        this.httpClient.put(this.urlSale + "/api/CashTax/UpdateCashTax/" + req.guid, data)
          .subscribe(
            response => {
              swal.fire({
                allowEscapeKey: false,
                allowOutsideClick: false,
                icon: 'success',
                title: 'แก้ไขข้อมูลสำเร็จ',
              })
                .then(() => {
                  this.lines = [];
                  var docGuid = response["Data"].Guid;
                  this.getDocumentAsync(docGuid);
                  this.routerLink.navigate(['/Cashtax/' + docGuid]);
                });
            },
            error => {
              console.log("Error", error);
              swal.fire({
                allowEscapeKey: false,
                allowOutsideClick: false,
                icon: 'error',
                title: 'มีข้อผิดพลาด',
              })
                .then(() => {
                  this.rejectDocStatus();
                });
            }
          );
      }
    }
  }

  selectedCash = (indexs: any): void => {
    var obj = this.cashSaleList[indexs];
    this.cashSale = obj;
    this.hilightRow(indexs);
  }

  selectedProductList = (indexs: any): void => {
    this.productSelectedList.push(this.productList[indexs]);
    this.productList.splice(indexs, 1);
  }

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
        "PDListID": productObj.PdId,
        "SystemDate": this.SvDefault.GetFormatDate(<Date>this.document.DocDate)
      }
      this.httpClient.post(this.urlMas + "/api/Product/GetProductAllTypeList", data)
        .subscribe(
          response => {
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

  validateData = (): boolean => {
    let pass = false;
    let msg = "";
    let taxno = this.myGroup.get('citizenid').value;
    let custname = this.myGroup.get('custname').value;
    let custaddr1 = this.myGroup.get('custaddr1').value;

    if (taxno == "" || taxno == null) {
      pass = false;
      msg = "กรุณากรอกเลขผู้เสียภาษี";
    }
    else if (custname == "" || custname == null) {
      pass = false;
      msg = "กรุณากรอกชื่อลูกค้า";
    }
    else if (custaddr1 == "" || custaddr1 == null) {
      pass = false;
      msg = "กรุณากรอกที่อยู่ลูกค้า";
    }
    else if (this.lines.length == 0) { //ตรวจสอบการเลือกสินค้า
      pass = false;
      msg = "กรุณาเลือกสินค้า";
    } else {
      //ตรวจสอบการกรอกจำนวนสินค้า
      if (this.lines.length > 0) {
        for (var i = 0; i < this.lines.length; i++) {
          if (this.lines[i].ItemQty <= 0 && !this.lines[i].IsFree) {
            pass = false;
            msg = "กรุณากรอกจำนวนสินค้า <br>" + this.lines[i].UnitBarcode + " : " + this.lines[i].PdName;
            break;
          } else {
            pass = true;
          }
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
}
