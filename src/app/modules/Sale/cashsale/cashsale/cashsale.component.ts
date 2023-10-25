import { element } from 'protractor';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { valueSelectbox } from "../../../../shared-model/demoModel"
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../../shared/shared.service';
import swal from 'sweetalert2';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common'
import * as moment from 'moment';
import { DefaultService } from 'src/app/service/default.service';
import { async } from '@angular/core/testing';
import { ModelHiddenButton, ModelMasDocPattern, ModelSalQuotationHd2 } from 'src/app/model/ModelCommon';
import { ModalQuotationComponent } from '../ModalQuotation/ModalQuotation.component';
import { CashsaleService } from 'src/app/service/cashsale-service/cashsale-service';
import Swal from 'sweetalert2';
import { CurrencyModel, DetailModel, HeaderModel, ModelCashSaleQuotationDetail, ModelCashSaleResource2, ProductModel, ShowVAT } from '../ModelCashSale';
import { ModelMasProduct, ModelSalCashsaleDt, ModelSalCashsaleHd, ModelSalQuotationDt, ModelSalQuotationHd } from 'src/app/model/ModelScaffold';
import { join } from '@angular/compiler-cli/src/ngtsc/file_system';
import { AuthGuard } from 'src/app/guards/auth-guard.service';

@Component({
  selector: 'app-cashsale',
  templateUrl: './cashsale.component.html',
  styleUrls: ['./cashsale.component.scss']
})
export class CashsaleComponent implements OnInit {
  //==================== Global Variable ====================
  //*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z
  currencyList: CurrencyModel[] = [];
  document = new HeaderModel();
  headerCard: string = "บันทึกขายสด";
  lines: DetailModel[] = [];
  myGroup: FormGroup;
  productList: ProductModel[] = [];
  productSelectedList: ProductModel[] = [];
  status = "";
  statusOriginal = "";
  vatGroupList: { [vatGroup: string]: ShowVAT; } = {};
  public ValidEmpClassName  = "";
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
  btnGetProduct = "";
  btnPrint = true;
  btnReject = true;
  btnSave = true;
  action: string = "";
  private authPositionRole: any;

  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private routerLink: Router,
    private sharedService: SharedService,
    public datepipe: DatePipe,
    public formatter: NgbDateParserFormatter,
    public SvDefault: DefaultService,
    public _svCashSale: CashsaleService,
    private authGuard: AuthGuard,
  ) { }
  private _modelCashSaleReource = new ModelCashSaleResource2();

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  async ngOnInit() {
    await this.SvDefault.DoActionAsync(async () => await this.start(), true);
    // if(!this.SvDefault.CheckSession()){
    //   return;
    // }
    // // this.checkSession();
    // this.document = new HeaderModel;
    // this.document.BrnCode = this.sharedService.brnCode;
    // this.document.CompCode = this.sharedService.compCode;
    // this.document.CreatedBy = this.sharedService.user;
    // this.document.LocCode = this.sharedService.locCode;
    // let docGuid = this.route.snapshot.params.DocGuid;
    // this.lines = [];

    // if (docGuid == "New") {
    //   this.newDocument();
    //   this.status = "สร้าง";
    //   this.statusOriginal = this.status;
    // } else {
    //   this.getDocument(docGuid);
    // }

    // this.myGroup = new FormGroup({
    //   //       branchFrom: new FormControl(),
    //   //       currency: new FormControl(),
    //         taxno: new FormControl(),
    //   //       custname: new FormControl(),
    //   //       custaddr1: new FormControl(),
    //   //       custaddr2: new FormControl(),
    //         searchProduct: new FormControl(),
    //   //       searchCash: new FormControl(),
    // });
  }
  private async start() {
    this.authPositionRole = this.SvDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }

    this.myGroup = new FormGroup({
      taxno: new FormControl(),
      searchProduct: new FormControl(),
      currency: new FormControl(),
    });
    
    let docGuid = this.route.snapshot.params.DocGuid;
    this.lines = [];

    if (docGuid == "New") {
      this.action = "New";
      await this.newDocumentAsync();
    } else {
      this.action = "Edit";
      await this.getDocumentAsync(docGuid);
    }
    this.hiddenButton();

  }
  private hiddenButton() {
    let hidden: ModelHiddenButton = this.SvDefault.GetHiddenButton2(this.document.DocStatus, this.document.Post);
    this.btnApprove = hidden.btnApprove;
    this.btnCancel = hidden.btnCancel;
    this.btnClear = hidden.btnClear;
    this.btnComplete = hidden.btnComplete;
    this.btnPrint = hidden.btnPrint;
    this.btnReject = hidden.btnReject;
    this.btnSave = hidden.btnSave;
    this.btnBack = hidden.btnBack;
    this.status = hidden.status;
    this.statusOriginal = this.status;
  }

  //==================== Function ====================
  addItemtoLine() {
    this.SvDefault.DoAction(() => {
      this.productSelectedList = this.productSelectedList.filter((x, i, a) => {
        let ps = a.find(y => y.IsFree === x.IsFree && y.UnitBarcode === x.UnitBarcode);
        return a.indexOf(ps) === i;
      });
      for (let i = 0; i < this.productSelectedList.length; i++) {
        var productObj = this.lines.find((row, index) => row.UnitBarcode == this.productSelectedList[i].UnitBarcode && row.IsFree === this.productSelectedList[i].IsFree);
        if (!productObj) {
          let obj = new DetailModel;
          obj.BrnCode = this.document.BrnCode;
          obj.CompCode = this.document.CompCode;
          obj.DiscAmt = 0;
          obj.DiscAmtCur = obj.DiscAmt * this.document.CurRate;
          obj.DiscHdAmt = 0;
          obj.DiscHdAmtCur = 0;
          obj.DocNo = this.document.DocNo;
          obj.ItemQty = 0;
          obj.IsFree = this.productSelectedList[i].IsFree;;
          obj.LocCode = this.document.LocCode;
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
          obj.UnitPrice = obj.IsFree ? 0 : this.productSelectedList[i].UnitPrice;
          obj.UnitPriceCur = obj.UnitPrice * this.document.CurRate;
          obj.VatAmt = 0;
          obj.VatAmtCur = obj.VatAmt * this.document.CurRate;
          obj.VatRate = this.productSelectedList[i].VatRate;
          obj.VatType = this.productSelectedList[i].VatType;
          obj.RefPrice = 0;
          obj.RefPriceCur = 0;
          obj.GroupId = this.productSelectedList[i].GroupId;
          this.lines.push(obj);
        }
      }

      //ตัดข้อมูล productSelectedList ที่ไม่มีใน Lines ออก
      // for (var i = 0; i < this.lines.length; i++) {
      //   var line = this.productSelectedList.find((row, index) => row.PdId == this.lines[i].PdId);
      //   if (!line) {
      //     this.lines.splice(i, 1);
      //   }
      // }
      this.calculateDocument();
      // return this.lines;
    });
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
    //calculate sumAmtCur
    // this.lines.forEach(element => {
    //   element.SumAmtCur = element.SumAmt * this.document.CurRate;
    // });

    //Cal SubTotal, SubAmt
    this.lines.forEach(element => {
      if (this.document.RefNo != "" && this.document.RefNo != null && this.document.RefNo != undefined) {
        //element.DiscAmt = element.UnitPrice * element.ItemQty;
      }

      element.SumItemAmt = (element.UnitPrice * element.ItemQty);
      // element.SubAmt =  ((element.UnitPrice * element.ItemQty) - element.DiscAmt);
      element.SubAmt = (element.SumItemAmt - element.DiscAmt);
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
          beforeTax = parseFloat(element.SubAmt.toFixed(2)) - parseFloat(element.DiscHdAmt.toFixed(2)); //element.SubAmt - element.DiscHdAmt;
          taxBase = beforeTax;
          taxAmt = ((taxBase * element.VatRate) / (100 || 1));
        } else if (element.VatType == "VI") {
          beforeTax = parseFloat(element.SubAmt.toFixed(2)) - parseFloat(element.DiscHdAmt.toFixed(2)); //element.SubAmt - element.DiscHdAmt;
          taxBase = ((beforeTax * 100) / ((100 + element.VatRate) || 1));
          taxAmt = (((element.SubAmt - element.DiscHdAmt) * element.VatRate) / ((100 + element.VatRate) || 1));
        } else if (element.VatType == "NV") {
          beforeTax = parseFloat(element.SubAmt.toFixed(2)) - parseFloat(element.DiscHdAmt.toFixed(2)); //element.SubAmt - element.DiscHdAmt;
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
  private calculateDocument4() {
    let subTotalHD = 0;
    let taxBaseHD = 0;
    let vatAmtHD = 0;
    let totalHD = 0;

    //Cal SubTotal, SubAmt
    this.lines.forEach(element => {
      element.UnitPrice = element.UnitPrice || 0.00;
      element.RefPrice = element.RefPrice || 0.00;
      element.ItemQty = element.ItemQty || 0.00;
      if (this.document.RefNo != "" && this.document.RefNo != null && this.document.RefNo != undefined) {
        //element.DiscAmt = element.UnitPrice * element.ItemQty;
      }
      // element.SumItemAmt = (element.UnitPrice * element.ItemQty);
      element.SubAmt = (element.SumItemAmt - element.DiscAmt);
      // let numItemQty = 0;
      // numItemQty  = element.SumItemAmt;
      // if(element.UnitPrice !== 0){ // แก้ bug /0
      //   numItemQty /= element.UnitPrice;
      // }
      // element.ItemQty = numItemQty;

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
          beforeTax = parseFloat(element.SubAmt.toFixed(2)) - parseFloat(element.DiscHdAmt.toFixed(2)); //element.SubAmt - element.DiscHdAmt;
          taxBase = beforeTax;
          taxAmt = ((taxBase * element.VatRate) / (100 || 1));
        } else if (element.VatType == "VI") {
          beforeTax = parseFloat(element.SubAmt.toFixed(2)) - parseFloat(element.DiscHdAmt.toFixed(2)); //element.SubAmt - element.DiscHdAmt;
          taxBase = ((beforeTax * 100) / ((100 + element.VatRate) || 1));
          taxAmt = (((element.SubAmt - element.DiscHdAmt) * element.VatRate) / ((100 + element.VatRate) || 1));
        } else if (element.VatType == "NV") {
          beforeTax = parseFloat(element.SubAmt.toFixed(2)) - parseFloat(element.DiscHdAmt.toFixed(2)); //element.SubAmt - element.DiscHdAmt;
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
      element.UnitPrice = element.UnitPrice || 0.00;
      element.RefPrice = element.RefPrice || 0.00;
      element.ItemQty = element.ItemQty || 0.00;
      if (this.document.RefNo != "" && this.document.RefNo != null && this.document.RefNo != undefined) {
        //element.DiscAmt = element.UnitPrice * element.ItemQty;
      }
      element.SumItemAmt = (element.UnitPrice * element.ItemQty);
      element.SubAmt = (element.SumItemAmt - element.DiscAmt);
      let numItemQty = 0;
      numItemQty = element.SumItemAmt;
      if (element.UnitPrice !== 0) { // แก้ bug /0
        numItemQty /= element.UnitPrice;
      }
      element.ItemQty = numItemQty;

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
          beforeTax = parseFloat(element.SubAmt.toFixed(2)) - parseFloat(element.DiscHdAmt.toFixed(2)); //element.SubAmt - element.DiscHdAmt;
          taxBase = beforeTax;
          taxAmt = ((taxBase * element.VatRate) / (100 || 1));
        } else if (element.VatType == "VI") {
          beforeTax = parseFloat(element.SubAmt.toFixed(2)) - parseFloat(element.DiscHdAmt.toFixed(2)); //element.SubAmt - element.DiscHdAmt;
          taxBase = ((beforeTax * 100) / ((100 + element.VatRate) || 1));
          taxAmt = (((element.SubAmt - element.DiscHdAmt) * element.VatRate) / ((100 + element.VatRate) || 1));
        } else if (element.VatType == "NV") {
          beforeTax = parseFloat(element.SubAmt.toFixed(2)) - parseFloat(element.DiscHdAmt.toFixed(2)); //element.SubAmt - element.DiscHdAmt;
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
  calculateRow2 = (indexs: any) => {
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
    this.calculateDocument2();
  };
  CalculateRow4(indexs: any) {
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
    //productObj.SumAmt = ((productObj.ItemQty * productObj.UnitPrice) - productObj.DiscAmt);
    this.calculateDocument4();
  };
  CalculateRow3(indexs: number) {
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
    productObj.ItemQty = (productObj.SumItemAmt) / numUnitPrice;
    productObj.SubAmt = productObj.SumItemAmt - productObj.DiscAmt
    // productObj.SumAmt = ((productObj.ItemQty * productObj.UnitPrice) - productObj.DiscAmt);
    this.calculateDocument4();
  }

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
      this.saveDocument(false);
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
        this.myGroup.controls['taxno'].setValue("");
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
    this.SvDefault.DoAction(() => {
      this.productSelectedList = this.productSelectedList.filter((row, index) => index !== indexs);
    });
    // var productObj = this.productSelectedList.find((row, index) => index == indexs);
    // this.productList.push(productObj);
    // this.calculateDocument();
  }
  // deleteSelected = (indexs: any): void => {
  //   var productObj = this.productSelectedList.find((row, index) => index == indexs);
  //   this.productSelectedList = this.productSelectedList.filter((row, index) => index !== indexs);
  //   this.productList.push(productObj);
  //   this.calculateDocument();
  // }

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
  private async getDocumentAsync(pStrGuid: string) {
    this._modelCashSaleReource = await this._svCashSale.GetCashSale2(pStrGuid);
    if(!this.SvDefault.CheckDocBrnCode(this._modelCashSaleReource?.CashSaleHeader?.BrnCode)){
      return null;
    }
    if (this._modelCashSaleReource == null) {
      return null;
    }

    if (this._modelCashSaleReource.CashSaleHeader != null) {
      this.SvDefault.CopyObject(this._modelCashSaleReource.CashSaleHeader, this.document);
      this.document.DocDate = new Date(this.document.DocDate);
      this.document.UpdatedBy = this.sharedService.user;
      this.myGroup.controls['taxno'].setValue(this.document.RefNo);
    }
    if (Array.isArray(this._modelCashSaleReource.ArrCashSaleDetail) && this._modelCashSaleReource.ArrCashSaleDetail.length) {
      this.lines = this._modelCashSaleReource.ArrCashSaleDetail.map(x => {
        let obj = new DetailModel();
        this.SvDefault.CopyObject(x, obj);
        obj.DiscAmtCur = obj.DiscAmt * this.document.CurRate;
        obj.TaxBaseAmtCur = obj.TaxBaseAmt * this.document.CurRate;
        obj.VatAmtCur = obj.VatAmt * this.document.CurRate;
        obj.SumAmt = ((obj.ItemQty * obj.UnitPrice || 0) - obj.DiscAmt);
        obj.SumAmtCur = obj.SumAmt * this.document.CurRate;
        obj.UnitPriceCur = obj.UnitPrice * this.document.CurRate;

        var data =
        {
          "PdId": x.PdId,
        }

        this.httpClient.post(this.urlMas + "/api/Product/FindById", data)
          .subscribe(
            response => {
              obj.GroupId = response["groupId"];
            },
            error => {
              console.log("Error", error);
            }
          );
        return obj;
      });
      //this.calculateDocument();
    }
  }
  getDocument(docGuid: string = "") {
    let req = {
      "Guid": docGuid
    }
    this.httpClient.post(this.urlSale + "/api/CashSale/CashSale", req)
      .subscribe(
        response => {
          this.document.BrnCode = response["Data"].BrnCode;
          this.document.CompCode = response["Data"].CompCode;
          this.document.CreatedBy = response["Data"].CreatedBy;
          this.document.CreatedDate = new Date(response["Data"].CreatedDate);
          this.document.CurRate = response["Data"].CurRate;
          this.document.Currency = response["Data"].Currency;
          this.document.DiscAmt = response["Data"].DiscAmt;
          this.document.DiscAmtCur = response["Data"].DiscAmtCur;
          this.document.DiscRate = response["Data"].DiscRate;
          this.document.DocDate = new Date(response["Data"].DocDate);
          this.document.DocNo = response["Data"].DocNo;
          this.document.DocPattern = response["Data"].DocPattern;
          this.document.DocStatus = response["Data"].DocStatus;
          this.document.Guid = response["Data"].Guid;
          this.document.ItemCount = response["Data"].ItemCount;
          this.document.LocCode = response["Data"].LocCode;
          this.document.NetAmt = response["Data"].NetAmt;
          this.document.NetAmtCur = response["Data"].NetAmtCur;
          this.document.Post = response["Data"].Post;
          // this.document.RefNo = response["Data"].RefNo;
          this.document.RunNumber = response["Data"].RunNumber;
          this.document.SubAmt = response["Data"].SubAmt;
          this.document.SubAmtCur = response["Data"].SubAmtCur;
          this.document.TaxBaseAmt = response["Data"].TaxBaseAmt;
          this.document.TaxBaseAmtCur = response["Data"].TaxBaseAmtCur;
          this.document.TotalAmt = response["Data"].TotalAmt;
          this.document.TotalAmtCur = response["Data"].TotalAmtCur;
          this.document.UpdatedBy = response["Data"].UpdatedBy;
          this.document.UpdatedDate = new Date(response["Data"].UpdatedDate);
          this.document.VatAmt = response["Data"].VatAmt;
          this.document.VatAmtCur = response["Data"].VatAmtCur;
          this.document.VatRate = response["Data"].VatRate;
          this.document.QtNo = (response["Data"]?.QtNo || "").toString().trim();
          this.myGroup.controls['taxno'].setValue(response["Data"].RefNo);

          let pDListID = "";
          let rqList = response["Data"].SalCashsaleDt;

          for (let i = 0; i < rqList.length; i++) {
            let obj = new DetailModel;
            obj.BrnCode = rqList[i].BrnCode;
            obj.CompCode = rqList[i].CompCode;
            obj.DiscAmt = rqList[i].DiscAmt;
            obj.DiscAmtCur = obj.DiscAmt * this.document.CurRate;
            obj.DiscHdAmt = rqList[i].DiscHdAmt;
            obj.DiscHdAmtCur = rqList[i].DiscHdAmtCur;
            obj.DocNo = this.document.DocNo;
            obj.ItemQty = rqList[i].ItemQty;
            obj.IsFree = rqList[i].IsFree;
            obj.LocCode = this.document.LocCode;
            obj.PdId = rqList[i].PdId;
            obj.PdName = rqList[i].PdName;
            obj.SeqNo = rqList[i].SeqNo;
            obj.StockQty = rqList[i].StockQty;
            obj.SubAmt = rqList[i].SubAmt;
            obj.SubAmtCur = rqList[i].SubAmtCur;
            obj.TaxBaseAmtCur = obj.TaxBaseAmt * this.document.CurRate;
            obj.TaxBaseAmt = rqList[i].TaxBaseAmt;
            obj.VatAmt = rqList[i].VatAmt;
            obj.VatAmtCur = obj.VatAmt * this.document.CurRate;
            obj.VatRate = rqList[i].VatRate;
            obj.VatType = rqList[i].VatType;
            obj.SumAmt = ((obj.ItemQty * obj.UnitPrice || 0) - obj.DiscAmt);
            obj.SumAmtCur = obj.SumAmt * this.document.CurRate;
            obj.SumItemAmt = rqList[i].SumItemAmt;
            obj.SumItemAmtCur = rqList[i].SumItemAmtCur;
            obj.TotalAmt = rqList[i].TotalAmt;
            obj.TotalAmtCur = rqList[i].TotalAmtCur;
            obj.UnitId = rqList[i].UnitId;
            obj.UnitBarcode = rqList[i].UnitBarcode;
            obj.UnitName = rqList[i].UnitName;
            obj.UnitPrice = rqList[i].UnitPrice;
            obj.UnitPriceCur = obj.UnitPrice * this.document.CurRate;
            obj.RefPrice = rqList[i].RefPrice || 0;
            obj.RefPriceCur = obj.RefPrice * this.document.CurRate;
            obj.GroupId = rqList[i].GroupId;
            this.lines.push(obj);

            pDListID += obj.PdId;
            if (i == rqList.length - 1) {
              pDListID += "";
            } else {
              pDListID += ",";
            }
          }

          this.getProductSelectedList(pDListID);
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
          this.statusOriginal = this.status;

          // //ถ้าวันที่ระบบมากกว่าวันที่เอกสาร แสดงว่ามีการปิดสิ้นวันเเล้ว
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

  getPattern = (): void => {
    var req =
    {
      "BrnCode": this.document.BrnCode,
      "CompCode": this.document.CompCode,
      "LocCode": this.document.LocCode,
      "DocDate": this.document.DocDate,
      "DocNo": this.document.DocNo,
      "DocType": "CashSale"
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
  async getProductList() {
    await this.SvDefault.DoActionAsync(async () => {
      this.productSelectedList = []
      this.productList = [];
      let strKeyWord = this.SvDefault.GetString( this.myGroup.get('searchProduct').value);
      var data =
      {
        "CompCode": this.document.CompCode,
        "LocCode": this.document.LocCode,
        "BrnCode": this.document.BrnCode,
        "Keyword": strKeyWord,
        // "Keyword": this.myGroup.get('searchProduct').value,
        "SystemDate": this.SvDefault.GetFormatDate(<Date>this.document.DocDate)
      }
      let strUrl = (this.urlMas || "").toString().trim() + "/api/Product/GetProductAllTypeList"
      let response = <any>await this.httpClient.post(strUrl, data).toPromise();
      if (response != null && response.hasOwnProperty("Data") && Array.isArray(response.Data) && response.Data.length) {
        let arrProduct = <ProductModel[]>(response?.Data || []);
        for (let i = 0; i < arrProduct.length; i++) {
          const product = arrProduct[i];
          product.IsFree = false;
        }
        arrProduct = arrProduct.filter(x=>x.PdId.includes(strKeyWord) || x.PdName.includes(strKeyWord));
        this.productList = arrProduct;
      }
    });
  }
  /*
    getProductList() {
      // this.productSelectedList = []
      this.productList = [];
      var data =
      {
        "CompCode": this.document.CompCode,
        "LocCode": this.document.LocCode,
        "BrnCode": this.document.BrnCode,
        "Keyword": this.myGroup.get('searchProduct').value,
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
  */
  getProductSelectedList(pDListID: string = "") {
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

  async GetQuotation(): Promise<void> {
    await this.SvDefault.DoActionAsync(async () => await this.getQuotation());
  }
  private async getQuotation() {
    Swal.showLoading();
    this.lines = [];
    this.calculateDocument2();
    let arrQuotation: ModelSalQuotationHd[] = await this._svCashSale.GetQuotationListByCashSale(this.document);
    if (Swal.isLoading) {
      Swal.close();
    }
    if (!(Array.isArray(arrQuotation) && arrQuotation.length)) {
      return;
    }
    let paramModalQuotation = {
      "ArrQuotation": arrQuotation
    };
    let selectQuotation = await this.SvDefault.ShowModalAsync<ModelSalQuotationHd>(ModalQuotationComponent, "xl", paramModalQuotation);
    if (selectQuotation == null) {
      return;
    }
    this._modelCashSaleReource.QuotationHeader = selectQuotation;
    this.document.QtNo = (selectQuotation?.DocNo || "").toString().trim();
    Swal.showLoading();
    let arrQtDetail: ModelCashSaleQuotationDetail[] = await this._svCashSale.GetQuotationDetail(selectQuotation);
    if (Swal.isLoading) {
      Swal.close();
    }
    if (!(Array.isArray(arrQtDetail) && arrQtDetail.length)) {
      return;
    }
    this._modelCashSaleReource.ArrQuotationDetail = arrQtDetail.map(x => {
      let qdt = new ModelSalQuotationDt();
      this.SvDefault.CopyObject(x, qdt);
      return qdt;
    });
    let arrDetail2: DetailModel[] = [];
    let arrDetailPriceIssue: DetailModel[] = [];
    for (let i = 0; i < arrQtDetail.length; i++) {
      let dt1 = arrQtDetail[i];
      if (dt1.StockRemain <= 0) {
        continue;
      }
      let dt2 = new DetailModel();
      this.SvDefault.CopyObject(dt1, dt2);
      dt2.RefPrice = parseFloat(<any>dt1.UnitPrice || 0.00) || 0.00;
      dt2.RefPriceCur = parseFloat(<any>dt1.UnitPriceCur || 0.00) || 0.00;
      if (dt1.MasProductPrice != null) {
        dt2.UnitPrice = dt1.MasProductPrice.Unitprice || 0.00;
        dt2.UnitPriceCur = dt2.UnitPrice * (this.document.CurRate || 0.00);
        if (dt2.UnitPrice < dt2.RefPrice) {
          arrDetailPriceIssue.push(dt2);
          continue;
        }
      }
      arrDetail2.push(dt2);
    }
    if (arrDetailPriceIssue.length > 0) {
      let strMessage = arrDetailPriceIssue
        .map(x => `รหัสสินค้า : ${x.PdId} : ${x.PdName} ${x.ItemQty} ${x.UnitName} <br/>`)
        .join("") + "มีราคาที่เสนอสูงกว่าราคาปัจุบัน";
      Swal.fire("", strMessage, "warning");
    }
    if (arrDetail2.length > 0) {
      this.lines = arrDetail2;
      this.calculateDocument2();
    }
    else {
      this.document.QtNo = "";
    }
  }
  /*
  private async getQuotation(){

    Swal.showLoading();
    let arrQuotation : ModelSalQuotationHd[] = await this._svCashSale.GetQuotationListByCashSale(this.document);
    if(Swal.isLoading){
      Swal.close();
    }
    if(!(Array.isArray(arrQuotation) && arrQuotation.length)){
      return;
    }
    let paramModalQuotation = {
      "ArrQuotation" : arrQuotation
    };
    let selectQuotation = await this.SvDefault.ShowModalAsync<ModelSalQuotationHd>(ModalQuotationComponent , "xl" , paramModalQuotation);
    if(selectQuotation == null){
      return;
    }
    this._modelCashSaleReource.QuotationHeader = selectQuotation;
    this.document.QtNo = (selectQuotation?.DocNo || "").toString().trim();
    Swal.showLoading();
    let arrQtDetail : ModelCashSaleQuotationDetail[] = await this._svCashSale.GetQuotationDetail(selectQuotation);
    if(Swal.isLoading){
      Swal.close();
    }
    if(!(Array.isArray(arrQtDetail) && arrQtDetail.length)){
      return;
    }
    this._modelCashSaleReource.ArrQuotationDetail = arrQtDetail.map(x=>{
      let qdt = new ModelSalQuotationDt();
      this.SvDefault.CopyObject(x,qdt);
      return qdt;
    });
    let arrDetail2 : DetailModel[] = [];
    for (let i = 0; i < arrQtDetail.length; i++) {
      let dt1 = arrQtDetail[i];
      if(dt1.StockRemain <= 0){
        continue;
      }
      let dt2 = new DetailModel();
      this.SvDefault.CopyObject(dt1 , dt2);
      dt2.RefPrice =  parseFloat(<any>dt1.UnitPrice || 0.00) || 0.00;
      dt2.RefPriceCur = parseFloat(<any>dt1.UnitPriceCur || 0.00) || 0.00;
      if(dt1.MasProductPrice != null){
        dt2.UnitPrice = dt1.MasProductPrice.Unitprice || 0.00;
        dt2.UnitPriceCur = dt2.UnitPrice * (this.document.CurRate || 0.00);
        if(dt2.UnitPrice > dt2.RefPrice){
          dt2.DiscAmt = (dt2.UnitPrice - dt2.RefPrice) * dt2.ItemQty;
        }
      }
      arrDetail2.push(dt2);
    }
    this.lines = arrDetail2;
    this.calculateDocument2();
  }
*/
  private async newDocumentAsync() {
    this.document = new HeaderModel();
    this.document.BrnCode = this.sharedService.brnCode;
    this.document.CompCode = this.sharedService.compCode;
    this.document.LocCode = this.sharedService.locCode;
    this.document.CreatedBy = this.sharedService.user;
    this.document.CurRate = 1;
    this.document.Currency = "THB";
    this.document.DocDate = this.sharedService.systemDate;
    this.document.DocStatus = "New";
    this.document.Post = "N";
    this.document.EmpCode = "";
    this.document.EmpName = "";

    let arrDocPattern = await this.SvDefault.GetPatternAsync("CashSale");
    let strDocPattern = this.SvDefault.GenPatternString(this.sharedService.systemDate, arrDocPattern, this.sharedService.compCode, this.sharedService.brnCode);
    this.document.DocNo = strDocPattern;
    this.document.DocPattern = strDocPattern;
  }

  newDocument = (): void => {
    this.document.BrnCode = this.sharedService.brnCode;
    this.document.CompCode = this.sharedService.compCode;
    this.document.CreatedBy = this.sharedService.user;
    this.document.CreatedDate = new Date();
    this.document.CurRate = 1;
    this.document.Currency = "THB";
    this.document.DiscAmt = 0;
    this.document.DiscAmtCur = 0;
    this.document.DiscRate = "";
    this.document.DocDate = this.sharedService.systemDate;
    this.document.DocNo = "";
    this.document.DocPattern = "";
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
    this.document.TaxBaseAmt = null;
    this.document.TaxBaseAmtCur = null;
    this.document.TotalAmt = 0;
    this.document.TotalAmtCur = 0;
    this.document.VatAmt = 0;
    this.document.VatAmtCur = 0;
    this.document.VatRate = 0;

    this.getPattern();

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
    this.headerCard = "บันทึกขายสด";
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
  async saveDocument(isValidate: boolean = true) {
    await this.SvDefault.DoActionAsync2(async () => await this._saveDocument(isValidate), true,1);
  }
  private async _saveDocument(isValidate: boolean = true) {
    //this.calculateDocument2();
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
    if (this._modelCashSaleReource == null) {
      this._modelCashSaleReource = new ModelCashSaleResource2();
    }
    if (this._modelCashSaleReource.CashSaleHeader == null) {
      this._modelCashSaleReource.CashSaleHeader = new ModelSalCashsaleHd();
    }
    this.SvDefault.CopyObject(this.document, this._modelCashSaleReource.CashSaleHeader);
    this._modelCashSaleReource.CashSaleHeader.DocDate = this.SvDefault.GetFormatDate(<Date>this.document.DocDate);
    this._modelCashSaleReource.CashSaleHeader.RefNo = (<any>this.myGroup?.get('taxno')?.value || "").toString().trim();
    let strQtNo = (this.document.QtNo || "").toString().trim();
    if (strQtNo === "") {
      this._modelCashSaleReource.QuotationHeader = null;
      this._modelCashSaleReource.ArrQuotationDetail = null;
    } else if (this._modelCashSaleReource.QuotationHeader != null) {
      let qtHeader: ModelSalQuotationHd = this._modelCashSaleReource.QuotationHeader;
      qtHeader.UpdatedBy = (this.sharedService.user || "").toString().trim();
      qtHeader.DocStatus = "Reference";
      qtHeader.DocDate = this.SvDefault.GetFormatDate(<Date>qtHeader.DocDate);
    }
    await this._svCashSale.SetStockQty(this.lines);
    if (Array.isArray(this._modelCashSaleReource.ArrQuotationDetail) && this._modelCashSaleReource.ArrQuotationDetail.length) {
      let arrStockDecrease: number[] = [];
      for (let i = 0; i < this._modelCashSaleReource.ArrQuotationDetail.length; i++) {
        let qtDetail: ModelSalQuotationDt = this._modelCashSaleReource.ArrQuotationDetail[i];
        let numInCreaseRemain: number = 0;
        if (this.document.DocStatus !== "New") {
          let csIncrease: ModelSalCashsaleDt = this._modelCashSaleReource.ArrCashSaleDetail?.find(x => x.UnitBarcode === qtDetail.UnitBarcode);
          numInCreaseRemain = csIncrease?.StockQty || 0.00;
        }
        let numDecreaseRemain: number = 0;
        let strDecreaseProductName: string = "";
        if (!["Cancel", "Reject"].includes(this.document.DocStatus)) {
          let csDecrease: DetailModel = this.lines?.find(x => x.UnitBarcode === qtDetail.UnitBarcode);
          numDecreaseRemain = csDecrease?.StockQty || 0.00;
          strDecreaseProductName = (csDecrease?.PdName || "").toString().trim();
        }
        let numStockDecrease: number = numDecreaseRemain - numInCreaseRemain;
        if (qtDetail.StockRemain < numStockDecrease) {
          let strMessage: string = `ไม่อนุญาติให้ ${strDecreaseProductName} ไส่จำนวน เกินใบเสนอราคา`;
          Swal.fire(strMessage, "", "warning");
          return;
        }
        arrStockDecrease.push(numStockDecrease);
      }
      for (let i = 0; i < this._modelCashSaleReource.ArrQuotationDetail.length; i++) {
        let qtDetail: ModelSalQuotationDt = this._modelCashSaleReource.ArrQuotationDetail[i];
        qtDetail.StockRemain -= arrStockDecrease[i];
      }
      if (this._modelCashSaleReource.QuotationHeader != null && this._modelCashSaleReource.ArrQuotationDetail.every(x => x.StockQty === x.StockRemain)) {
        this._modelCashSaleReource.QuotationHeader.DocStatus = "Active";
      }
    }
    if (Array.isArray(this.lines) && this.lines.length > 0) {
      let numSeqNo = 1;
      this._modelCashSaleReource.ArrCashSaleDetail = this.lines.map(x => {
        let csDetail = new ModelSalCashsaleDt();
        this.SvDefault.CopyObject(x, csDetail);
        csDetail.SumItemAmtCur = csDetail.SumItemAmt * this.document.CurRate;
        csDetail.DocNo = this._modelCashSaleReource.CashSaleHeader.DocNo;
        csDetail.BrnCode = this._modelCashSaleReource.CashSaleHeader.BrnCode;
        csDetail.CompCode = this._modelCashSaleReource.CashSaleHeader.CompCode;
        csDetail.LocCode = this._modelCashSaleReource.CashSaleHeader.LocCode;
        csDetail.StockQty = x.StockQty;
        csDetail.SeqNo = numSeqNo++;
        return csDetail;
      });
    }
    this._modelCashSaleReource = await this._svCashSale.SaveCashSale2(this._modelCashSaleReource);
    this.SvDefault.CopyObject(this._modelCashSaleReource.CashSaleHeader, this.document);
    this.hiddenButton();
    await this.SvDefault.ShowSaveCompleteDialogAsync();
  }
  saveDocumentOld = (): void => {
    if (this.validateData()) {
      this.lines.forEach(element => {
        element.SumItemAmtCur = element.SumItemAmt * this.document.CurRate;
      });
      var data =
      {
        "CompCode": this.document.CompCode,
        "BrnCode": this.document.BrnCode,
        "LocCode": this.document.LocCode,
        "DocNo": this.document.DocNo,
        "DocStatus": this.document.DocStatus,
        "DocDate": this.document.DocDate,
        // "RefNo": this.document.RefNo,
        "RefNo": this.myGroup.get('taxno').value,
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
        "VatRate": this.document.VatRate,
        "VatAmt": this.document.VatAmt,
        "VatAmtCur": this.document.VatAmtCur,
        "NetAmt": this.document.NetAmt,
        "NetAmtCur": this.document.NetAmtCur,
        "Post": this.document.Post,
        "RunNumber": this.document.RunNumber,
        "DocPattern": this.document.DocPattern,
        "Guid": this.document.Guid,
        "CreatedBy": this.document.CreatedBy,
        "CreatedDate": this.document.CreatedDate,
        "UpdatedBy": this.document.UpdatedBy,
        "UpdatedDate": this.document.UpdatedDate,
        "QtNo": this.document.QtNo,
        "SalCashsaleDt": this.lines
      };

      const headers = { 'content-type': 'application/json' }
      const body = JSON.stringify(data);
      if (this.document.DocStatus == "New") {
        data.DocStatus = "Active";
        this.httpClient.post(this.urlSale + "/api/CashSale/CreateCashSale", data)
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
                  this.getDocument(docGuid);
                  this.routerLink.navigate(['/Cashsale/' + docGuid]);
                });
            },
            error => {
              swal.fire({
                allowEscapeKey: false,
                allowOutsideClick: false,
                title: 'มีข้อผิดพลาด',
                text: error.message
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
        this.httpClient.put(this.urlSale + "/api/CashSale/UpdateCashSale/" + req.guid, data)
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
                  this.getDocument(docGuid);
                  this.routerLink.navigate(['/Cashsale/' + docGuid]);
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

  // selectedCash = (indexs: any): void => {
  //   var obj = this.cashList[indexs];
  //   this.cash = obj;
  //   this.hilightRow(indexs);
  // }
  selectedProductList = (indexs: any): void => {
    this.SvDefault.DoAction(() => {
      let objSelect = <ProductModel>{ ...this.productList[indexs] };
      this.productSelectedList.push(objSelect);
    });
  }
  // selectedProductList = (indexs: any):void => {
  //   this.productSelectedList.push(this.productList[indexs]);
  //   this.productList.splice(indexs, 1);
  // }

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
    let pass = true;
    let msg = "";

    if (this.lines.length == 0) { //ตรวจสอบการเลือกสินค้า
      pass = false;
      msg = "กรุณาเลือกสินค้า";
    } else {
      //ตรวจสอบการกรอกจำนวนสินค้า
      if (this.lines.length > 0) {
        for (var i = 0; i < this.lines.length; i++) {
          if (!pass) {
            break;
          }
          // if(this.lines[i].ItemQty <= 0 && !this.lines[i].IsFree){
          //   pass = false;
          //   msg = "กรุณากรอกจำนวนสินค้า <br>" + this.lines[i].UnitBarcode + " : " + this.lines[i].PdName;
          //   break;
          // } else {
          //   pass = true;
          // }
          //validate qty > 0
          if ((this.lines[i].ItemQty || 0) <= 0) {
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
        }

        // Validate Free Item
        for (let j = i + 1; j < this.lines.length; j++) {
          if (this.lines[i].PdId === this.lines[j].PdId && this.lines[i].IsFree === this.lines[j].IsFree) {
            msg = `${this.lines[i].IsFree ? "ของแถม" : "สินค้า"} รหัส : ${this.lines[j].PdId} (${this.lines[j].PdName})  ซ้ำกัน`;
            pass = false;
            break;
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
