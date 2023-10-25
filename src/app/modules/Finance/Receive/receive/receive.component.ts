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
import { DefaultService } from 'src/app/service/default.service';
import { ReceiveService } from 'src/app/service/receive-service/receive-service';
import { ModelFinReceiveHd, ModelFinReceivePay, ModelMasMapping } from 'src/app/model/ModelScaffold';
import { ModelMasCustomer2 } from 'src/app/model/ModelCommon';
import { AuthGuard } from 'src/app/guards/auth-guard.service';

//==================== Model ====================
//*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z
export class BranchModel {
  Address: string;
  BrnCode: string;
  BrnName: string;
  BrnStatus: string;
  CompCode: string;
  CreatedBy: string;
  CreatedDate: Date;
  District: string;
  Fax: string;
  Phone: string;
  Postcode: string;
  Province: string;
  SubDistrict: string;
  UpdatedBy: string;
  UpdatedDate: Date;
}

export class ProductModel {
  CreatedBy: string;
  CreatedDate: Date;
  GroupId: string;
  UnitBarcode: string;
  AcctCode: string;
  PdDesc: string;
  PdId: string;
  PdName: string;
  PdStatus: string;
  UnitId: string;
  UnitName: string;
  UpdatedBy: string;
  UpdatedDate: Date;
  VatRate: number;
  VatType: string;
}

export class CurrencyModel {
  Currency: string;
  Rate: number;
}

export class ReceiveTypeModel {
  ReceiveTypeId: any;
  ReceiveTypeName: string;
}

export class PayTypeModel {
  PayTypeId: any;
  PayTypeName: string;
}

export class DocTypeModel {
  DocTypeId: number;
  DocTypeName: string;
}

export class CustomerModel extends ModelMasCustomer2 {
  Province: string = "";
  RegisterId: string = "";
  /*
  AccountId: string;
  Address: string;
  BillType: string;
  BrnCode: string;
  CompCode: string;
  ContactName: string;
  CreatedBy: string;
  CreatedDate: Date;
  CreditLimit: number;
  CreditTerm: number;
  CustCode: string;
  CustName: string;
  CustPrefix: string;
  CustStatus: string;
  District: string;
  DueType: string;
  Fax: string;
  Phone: string;
  Postcode: string;
  SubDistrict: string;
  UpdatedBy: string;
  UpdatedDate: Date;
*/
}

export class DetailModel {
  CompCode: string;
  BrnCode: string;
  LocCode: string;
  DocNo: string;
  SeqNo: number;
  PdId: string;
  PdName: string;
  AccountNo: string;
  Remark: string;
  ItemAmt: number;
  ItemAmtCur: number;
  VatType: string;
  VatRate: number;
  VatAmt: number;
  VatAmtCur: number;
}

export class HeaderModel extends ModelFinReceiveHd {
  CurRate: number = 0;
  Currency: string = "";
  CustPrefix: string = "";
  /*
  CompCode: string;
  BrnCode: string;
  LocCode: string;
  DocNo: string;
  DocStatus: string;
  DocDate:Date;
  ReceiveType: string;
  CustCode: string;
  CustAddr1: string;
  CustAddr2: string;
  CustName: string;
  PayDate:Date;
  PayType: string;
  BankNo: string;
  BankName: string;
  AccountNo: string;
  PayNo: string;
  Remark: string;
  SubAmt:number;
  SubAmtCur:number;
  FeeAmt:number;
  FeeAmtCur:number;
  DiscAmt:number;
  DiscAmtCur:number;
  WhtAmt:number;
  WhtAmtCur:number;
  TotalAmt:number;
  TotalAmtCur:number;
  VatType: string;
  VatAmt:number;
  VatAmtCur:number;
  VatRate:number;
  NetAmt:number;
  NetAmtCur:number;
  Post: string;
  RunNumber:number;
  DocPattern: string;
  Guid: string;
  CreatedBy: string;
  CreatedDate:Date;
  UpdatedBy: string;
  UpdatedDate:Date;

*/
}

export class FinReceivePay extends ModelFinReceivePay {
  /*
  CompCode: string;
  BrnCode: string;
  LocCode: string;
  DocNo: string;
  SeqNo: number;
  ItemType: string;
  BillBrnCode: string;
  BillNo: string;
  TxBrnCode: string;
  TxNo: string;
  TxDate: Date;
  TxAmt: number;
  TxBalance: number;
  PayAmt: number;
  RemainAmt: number;
  */
 Selected: boolean;
}

export class BankModel {
  CompCode: string;
  BankCode: string;
  AccountNo: string;
  BankStatus: string;
  BankName: string;
  CreatedBy: string;
  CreatedDate: Date;
  UpdatedBy: string;
  UpdatedDate: Date;
}

interface ShowVAT {
  VatType: string;
  VatTypeName: string;
  VatRate: number;
  TaxBase: number;
  VatAmt: number;
}

@Component({
  selector: 'app-receive',
  templateUrl: './receive.component.html',
  styleUrls: ['./receive.component.scss']
})
export class ReceiveComponent implements OnInit {
  //==================== Global Variable ====================
  //*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z
  private _arrSpecialCusCode: string[] = ["200210"];
  branchList: BranchModel[];
  branchSelect2: valueSelectbox[];
  bank: BankModel;
  bankList: BankModel[] = [];
  currencyList: CurrencyModel[] = [];
  currencySelect2: valueSelectbox[];
  receiveTypeList: ReceiveTypeModel[] = [];
  receiveTypeSelect2: valueSelectbox[];
  payTypeList: PayTypeModel[] = [];
  payTypeSelect2: valueSelectbox[];
  docTypeList: DocTypeModel[] = [];
  docTypeSelect2: valueSelectbox[];
  receivePayList: FinReceivePay[] = [];
  product: ProductModel;
  productList: ProductModel[] = [];
  productSelect2: valueSelectbox[];
  customer: CustomerModel;
  customerList: CustomerModel[] = [];
  document: HeaderModel;
  documentTX: FinReceivePay;
  headerCard: string;
  headerCardTX: string;
  lines: DetailModel[];
  myGroup: FormGroup;
  status = "";
  rowFocus = 0;
  statusOriginal = "";
  showTXComponent = false;
  vatGroupList: { [vatGroup: string]: ShowVAT; } = {};
  dateRange = new FormGroup({
    payDateStart: new FormControl(),
    payDateEnd: new FormControl()
  });

  //==================== URL ====================
  //*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z
  urlFinance = this.sharedService.urlFinance;
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
  hiddenColumn = false;
  ArrFinReceivePay: ModelFinReceivePay[] = [];
  ArrFinPayType : ModelMasMapping[] = [];
  ArrFinReceiveType : ModelMasMapping[] = [];
  //==================== Component Control ====================
  bankNo = true;
  bankName = true;
  accNo = true;
  payNo = true;
  chequeDate = true;
  //==================== Input Date ====================
  FinishDate: NgbDate | null;
  FinishDateShow: NgbDate | null;
  hoveredDate: NgbDate | null = null;
  StartDate: NgbDate | null;
  StartDateShow: NgbDate | null;
  private authPositionRole: any;
  action: string = "";

  //==================== constructor ====================
  //*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z
  constructor(
    private calendar: NgbCalendar,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private routerLink: Router,
    private sharedService: SharedService,
    public datepipe: DatePipe,
    public formatter: NgbDateParserFormatter,
    public SvDefault: DefaultService,
    private _svReceive: ReceiveService,
    private authGuard: AuthGuard,
  ) {
    this.branchSelect2 = [];
    this.currencySelect2 = [];
    this.receiveTypeSelect2 = [];
    this.payTypeSelect2 = [];
    this.productSelect2 = [];
    this.docTypeSelect2 = [];
    this.FinishDate = calendar.getNext(calendar.getToday(), 'd', 14);
    this.FinishDateShow = this.FinishDate;
    this.StartDate = calendar.getToday();
    this.StartDateShow = this.StartDate;
  }

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  //==================== ngOnInit ====================
  ngOnInit(): void {
    this.start();
  }

  //==================== Function ====================
  async start() {
    this.branchList = [];
    this.branchSelect2 = [];
    this.currencyList = [];
    this.currencySelect2 = [];
    this.receiveTypeList = [];
    this.receiveTypeSelect2 = [];
    this.receivePayList = [];
    this.docTypeSelect2 = [];
    this.productList = [];
    this.productSelect2 = [];
    this.bankList = [];
    this.customer = new CustomerModel;
    this.customerList = [];
    this.document = new HeaderModel;
    this.documentTX = new FinReceivePay;
    this.headerCard = "";
    this.headerCardTX = "";
    this.lines = [];
    this.status = "";
    this.statusOriginal = "";
    this.vatGroupList = {};

    this.authPositionRole = this.SvDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }

    this.lines = [];
    this.document = new HeaderModel;
    this.documentTX = new FinReceivePay;
    this.document.BrnCode = this.sharedService.brnCode;
    this.document.CompCode = this.sharedService.compCode;
    this.document.CreatedBy = this.sharedService.user;
    let docGuid = this.route.snapshot.params.DocGuid;

    this.myGroup = new FormGroup({
      receiveType: new FormControl(),
      payType: new FormControl(),
      docType: new FormControl(),
      payDate: new FormControl(),
      currency: new FormControl(),
      remarks: new FormControl(),
      searchCustomer: new FormControl(),
      searchBank: new FormControl(),
      searchProduct: new FormControl(),
      searchTX: new FormControl(),
      branchTX: new FormControl(),
    });
    let arrMapping = await this._svReceive.GetMasMapping();
    if(this.SvDefault.IsArray(arrMapping)){
      this.ArrFinPayType = arrMapping.filter(x=> x.MapValue === "FinPayType") || [];
      this.ArrFinReceiveType = arrMapping.filter(x=> x.MapValue === "FinReceiveType") || [];
    }
    if (docGuid == "New") {
      this.action = "New";
      this.status = "สร้าง";
      this.statusOriginal = this.status;
      this.newDocument();
    } else {
      this.action = "Edit";
      this.getDocument(docGuid);
    }

    this.getBranch();
    this.getReceiveTypeSelect2();
    this.getPayTypeSelect2();
    this.getDocTypeSelect2();
    this.getCurrencySelect2();
    this.changeReceiveType();
    this.changePayType();
    this.receiveTypeSelect2;
    this.currencySelect2;
  }

  getBranch = (): void => {
    var data = {
      "CompCode": this.document.CompCode,
      "LocCode": this.document.LocCode,
    }
    this.httpClient.post(this.urlMas + "/api/Branch/GetBranchList", data)
      .subscribe(
        response => {
          console.log("BranchList : ", response);
          this.branchSelect2 = [];
          this.branchList = [];
          for (let i = 0; i < response["Data"].length; i++) {
            this.branchSelect2.push({
              KEY: response["Data"][i].BrnCode.trim() + " : " + response["Data"][i].BrnName.trim(),
              VALUE: response["Data"][i].BrnCode.trim()
            });

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
            });
          }
        },
        error => {
          console.log("Error", error);
        }
      );
  }

  addRow() {
    let row = new DetailModel();
    row.CompCode = this.document.CompCode;
    row.BrnCode = this.document.BrnCode;
    row.LocCode = this.document.LocCode;
    row.DocNo = this.document.DocNo;
    row.SeqNo = 0;
    row.PdId = "";
    row.PdName = "";
    row.AccountNo = "";
    row.Remark = "";
    row.ItemAmt = 0;
    row.ItemAmtCur = row.ItemAmt * this.document.CurRate;
    this.lines.push(row);
  }

  addCustomer() {
    let strCusCode: string = (this.customer.CustCode || "").toString().trim();
    if (this._arrSpecialCusCode.includes(strCusCode)) {
      this.document.CustName = "";
      this.document.CustAddr1 = "";
      this.document.CustAddr2 = "";
    } else {
      // this.document.CustName = this.customer.CustName;
      this.document.CustPrefix = this.customer.CustPrefix;
      this.document.CustName = this.customer.CustName;
      this.document.CustAddr1 = this.customer.CustAddr1;
      this.document.CustAddr2 = this.customer.CustAddr2;
    }
    this.document.CustCode = strCusCode;
    this.receivePayList = [];
  }

  addProduct() {
    this.lines[this.rowFocus].PdId = this.product.PdId;
    this.lines[this.rowFocus].PdName = this.product.PdName;
    this.lines[this.rowFocus].AccountNo = this.product.AcctCode;
    this.lines[this.rowFocus].VatType = this.product.VatType;
    this.lines[this.rowFocus].VatRate = this.product.VatRate;
  }

  addBank() {
    this.document.BankNo = this.bank.BankCode;
    this.document.BankName = this.bank.BankName;
    this.document.AccountNo = this.bank.AccountNo;
    if (this.document.BankNo == "") {
      this.bankName = true;
      this.accNo = true;
    } else {
      this.bankName = false;
      this.accNo = false;
    }
  }

  approveDocument = () => {
    this.status = "พร้อมใช้";
    this.document.DocStatus = "Ready";
    this.saveDocument();
  };

  calculateFIFO = () => {
    let netAmt = this.document.NetAmt;
    this.receivePayList.forEach(element => {
      if (netAmt < element.TxBalance && netAmt > 0) {
        element.Selected = true;
        element.PayAmt = netAmt;
        element.RemainAmt = element.TxBalance - element.PayAmt;
        netAmt -= element.PayAmt;
      } else if (netAmt >= element.TxBalance && netAmt > 0) {
        element.Selected = true;
        element.PayAmt = element.TxBalance;
        element.RemainAmt = element.TxBalance - element.PayAmt;
        netAmt -= element.PayAmt;
      }
    });
  };

  calculateDocument = () => {
    let subTotalHD = 0;
    let vatAmtHD = 0;
    let taxBaseHD = 0;
    let otherHD = ((this.document.FeeAmt + this.document.DiscAmt) + this.document.WhtAmt); // ค่าอื่นๆ ที่ใช้สำหรับกระจายเข้าไปในเเต่ละรายการ
    this.lines.forEach(element => {
      subTotalHD += element.ItemAmt;
      element.ItemAmtCur = element.ItemAmt * this.document.CurRate;
    });

    //Cal DiscHdAmt, VAT
    this.lines.forEach(element => {
      let otherValueFromHD = (element.ItemAmt / (subTotalHD || 1)) * otherHD;
      let beforeTax = 0;
      let taxBase = 0;
      let taxAmt = 0;
      if (element.VatType == "VE") {
        beforeTax = element.ItemAmt + otherValueFromHD; //เอกสารอื่นจะเป็นการลบ เเต่อันนี้จะเป็นการบวก เพราะทั้ง ค่าธรรมเนียม, ส่วนลดจ่าย เเละ ภาษีหัก ณ ที่จ่าย เป็นการบวกเพิ่มทั้งหมด
        taxBase = beforeTax;
        taxAmt = ((taxBase * element.VatRate) / (100 || 1));
      } else if (element.VatType == "VI") {
        beforeTax = element.ItemAmt + otherValueFromHD; //เอกสารอื่นจะเป็นการลบ เเต่อันนี้จะเป็นการบวก เพราะทั้ง ค่าธรรมเนียม, ส่วนลดจ่าย เเละ ภาษีหัก ณ ที่จ่าย เป็นการบวกเพิ่มทั้งหมด
        taxBase = ((beforeTax * 100) / ((100 + element.VatRate) || 1));
        taxAmt = (((element.ItemAmt + otherValueFromHD) * element.VatRate) / ((100 + element.VatRate) || 1));
      } else if (element.VatType == "NV") {
        beforeTax = element.ItemAmt + otherValueFromHD; //เอกสารอื่นจะเป็นการลบ เเต่อันนี้จะเป็นการบวก เพราะทั้ง ค่าธรรมเนียม, ส่วนลดจ่าย เเละ ภาษีหัก ณ ที่จ่าย เป็นการบวกเพิ่มทั้งหมด
        // taxBase = 0;
        taxBase = beforeTax;
        taxAmt = 0;
      }
      element.VatAmt = taxAmt;
      element.VatAmtCur = element.VatAmt * this.document.CurRate;
      vatAmtHD += element.VatAmt;
      taxBaseHD += taxBase;
    });

    this.document.SubAmt = subTotalHD;
    this.document.TotalAmt = ((((this.document.SubAmt + this.document.FeeAmt) + this.document.DiscAmt) + this.document.WhtAmt));
    // this.document.VatAmt = vatAmtHD;
    // this.document.NetAmt = (taxBaseHD + this.document.VatAmt);
    //ISSUE 83
    if(this.showTXComponent){
      this.document.NetAmt = this.document.SubAmt + this.document.FeeAmt + this.document.DiscAmt + this.document.WhtAmt;
    }else{
      this.document.NetAmt = this.document.SubAmt - this.document.FeeAmt - this.document.DiscAmt - this.document.WhtAmt;
    }
    this.document.VatAmt = this.lines
      .map( x=> {
        switch (x.VatType) {
          case "VI":
            return (x.ItemAmt || 0.00) * 7 / 107;
          case "VE" :
            return (x.ItemAmt || 0.00) * 7 / 100;
          default:
            return 0;
        }
      }).reduce((a,c)=> a+c , 0);

    this.document.SubAmtCur = this.document.SubAmt * this.document.CurRate;
    this.document.FeeAmtCur = this.document.FeeAmt * this.document.CurRate;
    this.document.DiscAmtCur = this.document.DiscAmt * this.document.CurRate;
    this.document.WhtAmtCur = this.document.WhtAmt * this.document.CurRate;
    this.document.VatAmtCur = this.document.VatAmt * this.document.CurRate;
    this.document.TotalAmtCur = this.document.TotalAmt * this.document.CurRate;
    this.document.NetAmtCur = this.document.NetAmt * this.document.CurRate;

    //Cal VAT By Group
    this.vatGroupList = {};
    this.lines.forEach(element => {
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
        TaxBase: 0,
        VatAmt: (this.vatGroupList[element.VatRate] == undefined ? 0 : this.vatGroupList[element.VatRate].VatAmt) + element.VatAmt
      };
    });
  };

  calculateRow = (indexs: any) => {
    // var row = this.lines.find((row, index) => index == indexs);
    // let msg = "";
    // let error = false;
    // if (row.ItemAmt < 0) {
    //   row.ItemAmt = 0;
    //   error = true;
    //   msg = "ไม่อนุญาตให้กรอกจำนวนเงินน้อยกว่า 0";
    // }
    // if (error) {
    //   swal.fire({
    //     title: msg,
    //     allowOutsideClick: false,
    //     allowEscapeKey: false,
    //     icon: 'error'
    //   })
    //     .then(() => {
    //     });
    // }
    this.calculateDocument();
  };

  calculateRowTX = (indexs: any) => {
    var row = this.receivePayList.find((row, index) => index == indexs);
    let msg = "";
    let error = false;
    if (row.PayAmt < 0) {
      row.PayAmt = 0;
      error = true;
      msg = "ไม่อนุญาตให้กรอกจำนวนเงินน้อยกว่า 0";
    } else if (row.PayAmt > row.TxBalance) {
      row.PayAmt = 0;
      error = true;
      msg = "ไม่อนุญาตให้กรอกจำนวนเงินมากกว่าจำนวนค้างจ่าย";
    }
    row.RemainAmt = row.TxBalance - row.PayAmt;
    if (error) {
      swal.fire({
        title: msg,
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'error'
      })
        .then(() => {
        });
    }
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

  changeEvent() {
    console.log(this.dateRange.value.payDateStart);
    console.log(this.dateRange.value.payDateEnd);
  }

  changeReceiveType = () => {
    let receiveType = this.myGroup.get('receiveType').value;
    if (this.document.ReceiveType != receiveType && this.document.ReceiveType != "" && this.document.ReceiveType != null && this.lines.length > 0) {
      swal.fire({
        allowEscapeKey: false,
        allowOutsideClick: false,
        confirmButtonText: "ตกลง",
        denyButtonText: "ยกเลิก",
        icon: 'info',
        showDenyButton: true,
        title: 'คุณต้องการเปลี่ยนประเภทการรับใช่หรือไม่? <br>ระบบจะล้างรายการออกทั้งหมด',
      }).then((result) => {
        if (result.isConfirmed) {
          if (receiveType == "รับชำระ") {
            this.showTXComponent = true;
          } else if (receiveType == "รับเงินล่วงหน้า") {
            this.receivePayList = [];
            this.showTXComponent = false;
          } else if (receiveType == "รับอื่นๆ") {
            this.receivePayList = [];
            this.showTXComponent = false;
          }
          this.lines = [];
          this.document.ReceiveType = receiveType;
        } else if (result.isDenied) {
          this.myGroup.controls['receiveType'].setValue(this.document.ReceiveType);
        }
      })
    } else {
      if (receiveType == "รับชำระ") {
        this.showTXComponent = true;
      } else if (receiveType == "รับเงินล่วงหน้า") {
        this.receivePayList = [];
        this.showTXComponent = false;
      } else if (receiveType == "รับอื่นๆ") {
        this.receivePayList = [];
        this.showTXComponent = false;
      }
      this.lines = [];
      this.document.ReceiveType = receiveType;
    }
  };

  changePayType = () => {
    let payType = this.myGroup.get('payType').value;
    this.chequeDate = true;
    if (payType == "เงินสด") {
      this.bankName = true;
      this.accNo = true;
      this.bankNo = true;
      this.payNo = true;

      this.document.BankNo = "";
      this.document.BankName = "";
      this.document.AccountNo = "";
      this.document.PayNo = "";
    } else if (payType == "เช็ค") {
      if (this.document.BankNo == "") {
        this.bankName = true;
        this.accNo = true;
      } else {
        this.bankName = false;
        this.accNo = false;
      }
      this.bankNo = false;
      this.payNo = false;
      this.chequeDate = false;
    } else if (payType == "บัตรเครดิต") {
      if (this.document.BankNo == "") {
        this.bankName = true;
        this.accNo = true;
      } else {
        this.bankName = false;
        this.accNo = false;
      }
      this.bankNo = false;
      this.payNo = true;
      this.document.PayNo = "";
    }
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
    this.lines = this.lines.filter((row, index) => index !== indexs);
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

  getCurrencySelect2 = (): void => {
    this.currencySelect2 = [];
    this.currencyList = [
      {
        "Currency": "THB",
        "Rate": 1
      },
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

  getReceiveTypeSelect2 = (): void => {
    this.receiveTypeSelect2 = [];
    this.receiveTypeList = [
      {
        "ReceiveTypeId": "006",
        "ReceiveTypeName": "รับชำระ"
      },
      {
        "ReceiveTypeId": "007",
        "ReceiveTypeName": "รับเงินล่วงหน้า"
      },
      {
        "ReceiveTypeId": "008",
        "ReceiveTypeName": "รับอื่นๆ"
      },
    ];
    if(this.SvDefault.IsArray(this.ArrFinReceiveType)){
      this.receiveTypeList = this.ArrFinReceiveType.map(x=><ReceiveTypeModel>{
        ReceiveTypeId : x.MapId,
        ReceiveTypeName : x.MapDesc
      });
    }
    this.receiveTypeList.forEach(element => {
      this.receiveTypeSelect2.push({ KEY: element.ReceiveTypeName.toString(), VALUE: element.ReceiveTypeName.toString() });
    });
  }

  setRowFocus(indexs: any) {
    this.rowFocus = indexs;
    this.getProductList();
  }

  getProductList() {
    let docTypeId = "";
    let receiveType = this.myGroup.get('receiveType').value;
    if (receiveType == "รับชำระ") {
      docTypeId = "006";
    } else if (receiveType == "รับเงินล่วงหน้า") {
      docTypeId = "007";
    } else if (receiveType == "รับอื่นๆ") {
      docTypeId = "008";
    }

    this.productList = [];
    var data =
    {
      "CompCode": this.document.CompCode,
      "BrnCode": this.document.BrnCode,
      "LocCode": this.document.LocCode,
      "Keyword": this.myGroup.get('searchProduct').value,
      "DocumentTypeID": docTypeId
    }
    this.httpClient.post(this.urlMas + "/api/Product/GetProductServiceList", data)
      .subscribe(
        response => {
          console.log(response);
          for (let i = 0; i < response["Data"].length; i++) {
            let obj = new ProductModel();
            obj.CreatedBy = response["Data"][i].CreatedBy;
            obj.CreatedDate = response["Data"][i].CreatedDate;
            obj.GroupId = response["Data"][i].GroupId;
            obj.UnitBarcode = response["Data"][i].UnitBarcode;
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
            obj.AcctCode = response["Data"][i].AcctCode;
            this.productList.push(obj);
          }
        },
        error => {
          console.log("Error", error);
        }
      );
  }

  getTaxInvoiceList() {
    let docTypeFilter = "";
    if (this.myGroup.get('docType').value == "1") {
      docTypeFilter = "TaxInvoice";
    } else if (this.myGroup.get('docType').value == "2") {
      docTypeFilter = "Billing";
    }

    this.receivePayList = [];
    var data =
    {
      "CompCode": this.document.CompCode,
      "LocCode": this.document.LocCode,
      "BrnCode": this.myGroup.get('branchTX').value,
      "DocType": "Invoice,CreditSale,CreditNote,DebitNote",
      "Keyword": this.myGroup.get('searchTX').value,
      "CustCode": this.document.CustCode,
      "DocTypeFilter": docTypeFilter,
      "FromDate": this.SvDefault.GetFormatDate(<any>this.dateRange.get("payDateStart").value),
      "ToDate": this.SvDefault.GetFormatDate(<any>this.dateRange.get("payDateEnd").value)
    }
    this.httpClient.post(this.urlFinance + "/api/Receive/GetRemainFinBalanceList", data)
      .subscribe(
        response => {
          //console.log(response);
          if (response["Data"].length == 0) {
            swal.fire({
              title: "ไม่พบข้อมูลการตั้งหนี้",
              allowOutsideClick: false,
              allowEscapeKey: false,
              icon: 'error'
            })
              .then(() => {
              });
          }
          /*
          for (let i = 0; i < response["Data"].length; i++) {
            let obj = new FinReceivePay();
            obj.CompCode = response["Data"][i].CompCode;
            obj.BrnCode = response["Data"][i].BrnCode;
            obj.LocCode = response["Data"][i].LocCode;
            obj.DocNo = response["Data"][i].DocNo;
            obj.SeqNo = response["Data"][i].SeqNo;
            obj.ItemType = response["Data"][i].ItemType;
            obj.BillBrnCode = response["Data"][i].BillBrnCode;
            obj.BillNo = response["Data"][i].BillNo;
            obj.TxBrnCode = response["Data"][i].TxBrnCode;
            obj.TxNo = response["Data"][i].TxNo;
            obj.TxDate = response["Data"][i].TxDate;
            obj.TxAmt = response["Data"][i].TxAmt;
            obj.TxBalance = response["Data"][i].TxBalance;
            obj.PayAmt = 0;
            obj.RemainAmt = 0;
            obj.Selected = false;
            this.receivePayList.push(obj);
          }*/
          if(this.SvDefault.IsArray(response["Data"])){
            let arrData = <any[]>response["Data"];
            //this.receivePayList =arrData.map( x=> <FinReceivePay>x);
            this.receivePayList = arrData.map( x=> {
              let frp = new FinReceivePay();
              this.SvDefault.CopyObject(x , frp);
              frp.Selected = false;
              return frp;
            });

          }
        },
        error => {
          console.log("Error", error);
          swal.fire({
            title: "ไม่สามารถเรียกข้อมูลได้ เนื่องจาก" + error.error.message,
            allowOutsideClick: false,
            allowEscapeKey: false,
            icon: 'error'
          })
            .then(() => {
            });
        }
      );
  }

  getPayTypeSelect2 = (): void => {
    this.payTypeSelect2 = [];
    this.payTypeList = [
      {
        "PayTypeId": 1,
        "PayTypeName": "เงินสด"
      },
      {
        "PayTypeId": 2,
        "PayTypeName": "เช็ค"
      },
      {
        "PayTypeId": 3,
        "PayTypeName": "บัตรเครดิต"
      },
    ];
    if(this.SvDefault.IsArray(this.ArrFinPayType)){
      this.payTypeList = this.ArrFinPayType.map( x=> <PayTypeModel>{
        "PayTypeId": x.MapId,
        "PayTypeName": x.MapDesc
      } );
    }
    this.payTypeList.forEach(element => {
      this.payTypeSelect2.push({ KEY: element.PayTypeName.toString(), VALUE: element.PayTypeName.toString() });
    });
  }

  getDocTypeSelect2 = (): void => {
    this.docTypeSelect2 = [];
    this.docTypeList = [
      {
        "DocTypeId": 1,
        "DocTypeName": "ใบกำกับภาษี"
      },
      {
        "DocTypeId": 2,
        "DocTypeName": "ใบวางบิล"
      }
    ];

    this.docTypeList.forEach(element => {
      this.docTypeSelect2.push({ KEY: element.DocTypeName.toString(), VALUE: element.DocTypeId.toString() });
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
          console.log(response);
          for (let i = 0; i < response["Data"].length; i++) {
            let obj = new CustomerModel();
            obj.AccountId = response["Data"][i].AccountId;
            obj.Address = response["Data"][i].Address;
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
        },
        error => {
          console.log("Error", error);
        }
      );
  }

  getBankList() {
    this.bankList = [];
    var data =
    {
      "CompCode": this.document.CompCode,
      "Keyword": this.myGroup.get('searchBank').value,
    }
    this.httpClient.post(this.urlMas + "/api/Bank/GetBankList", data)
      .subscribe(
        response => {
          console.log(response);
          for (let i = 0; i < response["Data"].length; i++) {
            let obj = new BankModel();
            obj.CompCode = response["Data"][i].CompCode;
            obj.BankCode = response["Data"][i].BankCode;
            obj.AccountNo = response["Data"][i].AccountNo;
            obj.BankName = response["Data"][i].BankName;
            obj.BankStatus = response["Data"][i].BankStatus;
            obj.CreatedBy = response["Data"][i].CreatedBy;
            obj.CreatedDate = response["Data"][i].CreatedDate;
            obj.UpdatedBy = response["Data"][i].UpdatedBy;
            obj.UpdatedDate = response["Data"][i].UpdatedDate;
            this.bankList.push(obj);
          }
        },
        error => {
          console.log("Error", error);
        }
      );
  }
  private async getArrFinReceivePay() {
    let finHd: ModelFinReceiveHd = new ModelFinReceiveHd();
    this.SvDefault.CopyObject(this.document, finHd);
    this.ArrFinReceivePay = await this._svReceive.GetFinReceivePays(finHd);
  }
  getDocument(docGuid: string = "") {
    let req = {
      "Guid": docGuid
    }
    this.httpClient.post(this.urlFinance + "/api/Receive/Receive", req)
      .subscribe(
        response => {
          this.SvDefault.CopyObject(response["Data"] , this.document);
          if(!this.SvDefault.CheckDocBrnCode(this.document.BrnCode)){
            return;
          };
          // this.document.BillNo = response["Data"].BillNo;
          // this.document.CompCode = response["Data"].CompCode;
          // this.document.BrnCode = response["Data"].BrnCode;
          // this.document.LocCode = response["Data"].LocCode;
          // this.document.DocNo = response["Data"].DocNo;
          // this.document.DocStatus = response["Data"].DocStatus;

          // this.document.ReceiveType = response["Data"].ReceiveType;
          // this.document.CustCode = response["Data"].CustCode;
          // this.document.CustAddr1 = response["Data"].CustAddr1;
          // this.document.CustAddr2 = response["Data"].CustAddr2;
          // this.document.CustPrefix = response["Data"].CustPrefix;
          // this.document.CustName = response["Data"].CustName;
          // this.document.PayType = response["Data"].PayType;
          // this.document.BankNo = response["Data"].BankNo;
          // this.document.BankName = response["Data"].BankName;
          // this.document.AccountNo = response["Data"].AccountNo;
          // this.document.PayNo = response["Data"].PayNo;
          // this.document.Remark = response["Data"].Remark;
          // this.document.SubAmt = response["Data"].SubAmt;
          // this.document.SubAmtCur = response["Data"].SubAmtCur;
          // this.document.FeeAmt = response["Data"].FeeAmt;
          // this.document.FeeAmtCur = response["Data"].FeeAmtCur;
          // this.document.DiscAmt = response["Data"].DiscAmt;
          // this.document.DiscAmtCur = response["Data"].DiscAmtCur;
          // this.document.WhtAmt = response["Data"].WhtAmt;
          // this.document.WhtAmtCur = response["Data"].WhtAmtCur;
          // this.document.TotalAmt = response["Data"].TotalAmt;
          // this.document.TotalAmtCur = response["Data"].TotalAmtCur;
          // this.document.VatType = response["Data"].VatType;
          // this.document.VatAmt = response["Data"].VatAmt;
          // this.document.VatAmtCur = response["Data"].VatAmtCur;
          // this.document.VatRate = response["Data"].VatRate;
          // this.document.NetAmt = response["Data"].NetAmt;
          // this.document.NetAmtCur = response["Data"].NetAmtCur;
          // this.document.Post = response["Data"].Post;
          // this.document.RunNumber = response["Data"].RunNumber;
          // this.document.DocPattern = response["Data"].DocPattern;
          // this.document.Guid = response["Data"].Guid;
          // this.document.CreatedBy = response["Data"].CreatedBy;
          this.document.DocDate = new Date(response["Data"].DocDate);
          this.document.PayDate = new Date(response["Data"].PayDate);
          this.document.CreatedDate = new Date(response["Data"].CreatedDate);
          this.document.UpdatedBy = this.sharedService.user;
          this.document.UpdatedDate = new Date(response["Data"].UpdatedDate);
          // this.document.CurRate = 1;
          // this.document.Currency = "THB";
          this.getArrFinReceivePay();
          this.myGroup.controls['currency'].setValue(this.document.Currency);
          this.myGroup.controls['currency'].disable();
          this.myGroup.controls['remarks'].setValue(response["Data"].Remark);
          this.myGroup.controls['receiveType'].setValue(response["Data"].ReceiveType);
          this.myGroup.controls['payType'].setValue(response["Data"].PayType);
          this.myGroup.controls['docType'].setValue("1");
          this.changePayType();
          this.changeReceiveType();
          let paydate = {
            "day": this.document.PayDate.getDate(),
            "month": this.document.PayDate.getMonth() + 1,
            "year": this.document.PayDate.getUTCFullYear(),
          }
          this.myGroup.controls['payDate'].setValue(paydate);

          let rqList = response["Data"].FinReceiveDt;
          this.lines = [];
          for (let i = 0; i < rqList.length; i++) {
            let obj = new DetailModel;
            obj.CompCode = rqList[i].CompCode;
            obj.BrnCode = rqList[i].BrnCode;
            obj.LocCode = rqList[i].LocCode;
            obj.DocNo = rqList[i].DocNo;
            obj.SeqNo = rqList[i].SeqNo;
            obj.PdId = rqList[i].PdId;
            obj.PdName = rqList[i].PdName;
            obj.AccountNo = rqList[i].AccountNo;
            obj.Remark = rqList[i].Remark;
            obj.ItemAmt = rqList[i].ItemAmt;
            obj.ItemAmtCur = rqList[i].ItemAmtCur;
            obj.VatType = rqList[i].VatType;
            obj.VatRate = rqList[i].VatRate;
            obj.VatAmt = rqList[i].VatAmt;
            obj.VatAmtCur = rqList[i].VatAmtCur;
            this.lines.push(obj);
          }

          let payList = response["Data"].FinReceivePay;
          this.receivePayList = [];
          for (let i = 0; i < payList.length; i++) {
            let obj = new FinReceivePay;
            obj.CompCode = payList[i].CompCode;
            obj.BrnCode = payList[i].BrnCode;
            obj.LocCode = payList[i].LocCode;
            obj.DocNo = payList[i].DocNo;
            obj.SeqNo = payList[i].SeqNo;
            obj.ItemType = payList[i].ItemType;
            obj.BillBrnCode = payList[i].BillBrnCode;
            obj.BillNo = payList[i].BillNo;
            obj.TxBrnCode = payList[i].TxBrnCode;
            obj.TxNo = payList[i].TxNo;
            obj.TxDate = payList[i].TxDate;
            obj.TxAmt = payList[i].TxAmt;
            obj.TxBalance = payList[i].TxBalance;
            obj.PayAmt = payList[i].PayAmt;
            obj.RemainAmt = payList[i].RemainAmt;
            obj.Selected = true;
            this.receivePayList.push(obj);
          }
          this.calculateDocument();

          //Hidden Column
          this.hiddenColumn = true;

          //Hidden Button
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

          //Set HeaderCard
          this.headerCard = this.document.DocNo;
          this.headerCardTX = this.document.DocNo;
          this.statusOriginal = this.status;

          //ถ้าวันที่ระบบมากกว่าวันที่เอกสาร แสดงว่ามีการปิดสิ้นวันเเล้ว
          // if(this.document.DocDate < this.sharedService.systemDate){
          //   this.status = "ปิดสิ้นวัน";
          //   this.statusOriginal = this.status;
          //   this.btnSave = true;
          // }
          if (this.document.Post === "P") {
            this.status = "ปิดสิ้นวัน";
            this.statusOriginal = this.status;
            this.btnSave = true;
            this.btnCancel = true;
          }
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
      "DocDate": this.SvDefault.GetFormatDate(<any>this.document.DocDate),
      "DocNo": this.document.DocNo,
      "DocType": "Receive",
      "LocCode": this.document.LocCode,
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

  getPatternTX = (): void => {
    var req =
    {
      "BrnCode": this.document.BrnCode,
      "CompCode": this.document.CompCode,
      "DocDate": this.document.DocDate,
      "DocNo": this.document.DocNo,
      "DocType": "CreditNote",
      "LocCode": this.document.LocCode,
    }

    var pattern = ""
    this.httpClient.post(this.urlMas + "/api/Other/GetPattern", req)
      .subscribe(
        response => {
          pattern = response["Data"].Pattern;
          this.documentTX.DocNo = pattern;
          // this.documentTX.DocPattern = pattern;
        },
        error => {
          console.log("Error", error);
        }
      );
  }

  hilightRowCustomer(indexs) {
    if (indexs == null) {
      indexs = this.customerList.findIndex(e => e.CustCode === this.customer.CustCode);
    }
    if (indexs != null) {
      const slides = document.getElementsByClassName('trStyle');
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

  hilightRowProduct(indexs) {
    if (indexs == null) {
      indexs = this.productList.findIndex(e => e.PdId === this.product.PdId);
    }
    if (indexs != null) {
      const slides = document.getElementsByClassName('trPdStyle');
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

  hilightRowBank(indexs) {
    if (indexs == null) {
      indexs = this.bankList.findIndex(e => e.BankCode === this.bank.BankCode);
    }
    if (indexs != null) {
      const slides = document.getElementsByClassName('trBankStyle');
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

  onDateSelection(date: NgbDate) {
    if (!this.StartDate && !this.FinishDate) {
      this.StartDate = date;
    } else if (this.StartDate && !this.FinishDate && date && date.after(this.StartDate)) {
      this.FinishDate = date;
    } else {
      this.FinishDate = null;
      this.StartDate = date;
    }

    if (this.FinishDate != null) {
      this.FinishDateShow = this.FinishDate;
      // this.document.FinishDate = new Date(this.FinishDate.year, this.FinishDate.month - 1, this.FinishDate.day);
    }

    if (this.StartDate != null) {
      this.StartDateShow = this.StartDate;
      // this.document.StartDate = new Date(this.StartDate.year, this.StartDate.month - 1, this.StartDate.day);
    }
  }

  newDocument = (): void => {
    this.document.CompCode = this.sharedService.compCode;
    this.document.BrnCode = this.sharedService.brnCode;
    this.document.LocCode = this.sharedService.locCode;
    this.document.DocNo = "";
    this.document.DocStatus = "New";
    this.document.DocDate = this.sharedService.systemDate;
    this.document.ReceiveType = "";
    this.document.CustCode = "";
    this.document.CustAddr1 = "";
    this.document.CustAddr2 = "";
    this.document.CustName = "";
    this.document.PayDate = new Date();
    this.document.PayType = "";
    this.document.BankNo = "";
    this.document.BankName = "";
    this.document.AccountNo = "";
    this.document.PayNo = "";
    this.document.Remark = "";
    this.document.SubAmt = 0;
    this.document.SubAmtCur = 0;
    this.document.FeeAmt = 0;
    this.document.FeeAmtCur = 0;
    this.document.DiscAmt = 0;
    this.document.DiscAmtCur = 0;
    this.document.WhtAmt = 0;
    this.document.WhtAmtCur = 0;
    this.document.TotalAmt = 0;
    this.document.TotalAmtCur = 0;
    this.document.VatType = "VE";
    this.document.VatAmt = 0;
    this.document.VatAmtCur = 0;
    this.document.VatRate = 7;
    this.document.NetAmt = 0;
    this.document.NetAmtCur = 0;
    this.document.Post = "N";
    this.document.RunNumber = 0;
    this.document.DocPattern = "";
    this.document.Guid = "1f8f68b6-e7ff-42f0-8b35-27bb2cc57f93"; //ต้องใส่หลอกไว้ งั้น Model ไม่รองรับ
    this.document.CreatedBy = this.sharedService.user;
    this.document.CreatedDate = new Date();
    this.document.UpdatedBy = this.sharedService.user;
    this.document.UpdatedDate = new Date();
    this.document.CurRate = 1;
    this.document.Currency = "THB";

    //Set Input
    this.myGroup.controls['receiveType'].setValue("รับชำระ");
    this.myGroup.controls['payType'].setValue("เงินสด");
    this.myGroup.controls['docType'].setValue("1");
    this.myGroup.controls['currency'].setValue(this.document.Currency);
    this.myGroup.controls['currency'].disable();
    this.getPattern();

    if (this.FinishDate != null) {
      this.FinishDateShow = this.FinishDate;
      // this.document.FinishDate = new Date(this.FinishDate.year, this.FinishDate.month - 1, this.FinishDate.day);
    }

    if (this.StartDate != null) {
      this.StartDateShow = this.StartDate;
      // this.document.StartDate = new Date(this.StartDate.year, this.StartDate.month - 1, this.StartDate.day);
    }

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
    this.headerCard = "เอกสารรับชำระเงิน";
    this.headerCardTX = "เอกสารตัดหนี้";
  }

  printDocument = () => {
    if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isPrint")) {
      this.SvDefault.ShowPositionRoleMessage("IsPrint");
      return;
    }
    this._svReceive.GetReportReceivePay(this.document.CompCode , this.document.BrnCode , this.document.DocNo);
    // swal.fire({
    //   title: 'ฟังก์ชันการพิมพ์เอกสาร กำลังอยู่ในขั้นตอนการพัฒนา',
    //   allowOutsideClick: false, //Lock Screen
    //   allowEscapeKey: false,
    //   icon: 'info'
    // })
    //   .then(() => {
    //   });
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
    
    this.calculateDocument();
    if (this.validateData()) {
      let strPayType: string = "";
      strPayType = (this.myGroup.get('payType').value || "").toString().trim();
      let payDate: Date = null;
      if (strPayType === "เช็ค") {
        let payDateObj = this.myGroup.get('payDate').value;
        payDate = new Date(payDateObj.year + "-" + payDateObj.month + "-" + payDateObj.day);
        // if (this.SvDefault.IsValidDate(payDateObj)) {
        // }
      }
      var data =
      {
        "CompCode": this.document.CompCode,
        "BrnCode": this.document.BrnCode,
        "LocCode": this.document.LocCode,
        "DocNo": this.document.DocNo,
        "DocStatus": this.document.DocStatus,
        "DocDate": this.SvDefault.GetFormatDate(<any>this.document.DocDate),
        "ReceiveType": this.myGroup.get('receiveType').value,
        "CustCode": this.document.CustCode,
        "CustAddr1": this.document.CustAddr1,
        "CustAddr2": this.document.CustAddr2,
        "CustName": this.document.CustName,
        "PayDate": this.SvDefault.GetFormatDate(payDate),
        "PayType": this.myGroup.get('payType').value,
        "BankNo": this.document.BankNo,
        "BankName": this.document.BankName,
        "AccountNo": this.document.AccountNo,
        "PayNo": this.document.PayNo,
        "Remark": this.myGroup.get('remarks').value,
        "SubAmt": this.document.SubAmt,
        "SubAmtCur": this.document.SubAmtCur,
        "FeeAmt": this.document.FeeAmt,
        "FeeAmtCur": this.document.FeeAmtCur,
        "DiscAmt": this.document.DiscAmt,
        "DiscAmtCur": this.document.DiscAmtCur,
        "WhtAmt": this.document.WhtAmt,
        "WhtAmtCur": this.document.WhtAmtCur,
        "TotalAmt": this.document.TotalAmt,
        "TotalAmtCur": this.document.TotalAmtCur,
        "VatType": this.document.VatType,
        "VatAmt": this.document.VatAmt,
        "VatAmtCur": this.document.VatAmtCur,
        "VatRate": this.document.VatRate,
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
        "CurRate": this.document.CurRate,
        "Currency": this.document.Currency,
        "FinReceiveDt": this.lines,
        "FinReceivePay": this.receivePayList.filter(x => x.Selected == true),
        "BillNo": this.document.BillNo,
        "PayTypeId" : "",
        "ReceiveTypeId" : "",
      };
      if(this.SvDefault.IsArray(this.ArrFinPayType)){
        data.PayTypeId = this.ArrFinPayType.find(x=> x.MapDesc ===  data.PayType)?.MapId || "";
      }
      if(this.SvDefault.IsArray(this.ArrFinReceiveType)){
        data.ReceiveTypeId = this.ArrFinReceiveType.find(x=> x.MapDesc ===  data.ReceiveType)?.MapId || "";
      }

      const headers = { 'content-type': 'application/json' }
      const body = JSON.stringify(data);
      if (this.document.DocStatus == "New") {
        data.DocStatus = "Active";
        this.httpClient.post(this.urlFinance + "/api/Receive/CreateReceive", data)
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
                  this.routerLink.navigate(['/Receive/' + docGuid]);
                });
            },
            error => {
              console.log("Error", error);
              swal.fire({
                title: 'มีข้อผิดพลาด<br> ',
                allowOutsideClick: false,
                allowEscapeKey: false,
                icon: 'error',
                text: error.error['messages']
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
        this.httpClient.put(this.urlFinance + "/api/Receive/UpdateReceive", data)
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
                  this.routerLink.navigate(['/Receive/' + docGuid]);
                });
            },
            error => {
              console.log("Error", error);
              let strError = this.SvDefault.GetString( error.error);
              swal.fire({
                allowEscapeKey: false,
                allowOutsideClick: false,
                icon: 'error',
                title: 'มีข้อผิดพลาด<br> ',
                text: error.error['messages']
              })
                .then(() => {
                  this.rejectDocStatus();
                });
            }
          );
      }
    }
  }

  selectedCustomer = (indexs: any): void => {
    var obj = this.customerList[indexs];
    this.customer = obj;
    this.hilightRowCustomer(indexs);
  }

  selectedProduct = (indexs: any): void => {
    var obj = this.productList[indexs];
    this.product = obj;
    this.hilightRowProduct(indexs);
  }

  selectedBank = (indexs: any): void => {
    var obj = this.bankList[indexs];
    this.bank = obj;
    this.hilightRowBank(indexs);
  }

  validateFee = (): void => {
    if (this.document.FeeAmt < 0) {
      this.document.FeeAmt = 0;
      swal.fire({
        title: "ไม่อนุญาตให้กรอกค่าธรรมเนียมน้อยกว่า 0",
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'error'
      })
        .then(() => {
        });
    }
    this.calculateDocument();
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

  validateDisc = (): void => {
    if (this.document.DiscAmt < 0) {
      this.document.DiscAmt = 0;
      swal.fire({
        title: "ไม่อนุญาตให้กรอกส่วนลดจ่ายน้อยกว่า 0",
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'error'
      })
        .then(() => {
        });
    }
    this.calculateDocument();
  }

  validateWht = (): void => {
    if (this.document.WhtAmt < 0) {
      this.document.WhtAmt = 0;
      swal.fire({
        title: "ไม่อนุญาตให้กรอกภาษีหัก ณ ที่จ่ายน้อยกว่า 0",
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'error'
      })
        .then(() => {
        });
    }
    this.calculateDocument();
  }

  validateData = (): boolean => {
    let pass = false;
    let msg = "";
    let receiveType = this.myGroup.get('receiveType').value;
    let payType = this.myGroup.get('payType').value;
    let payDate = this.myGroup.get('payDate').value;
    let sumTxPayAmt = 0;
    this.receivePayList.forEach(element => {
      if (element.Selected) {
        sumTxPayAmt += element.PayAmt;
      }
    });

    if (this.document.CustCode == "" || this.document.CustCode == null || this.document.CustCode == undefined) {
      pass = false;
      msg = "กรุณาเลือกข้อมูลลูกค้า";
    } else if(this.document.SubAmt < 0)
    {
      pass = false;
      msg = "จำนวนเงินชำระต้องมากกว่าหรือเท่ากับ 0";
    } else if (receiveType == "" || receiveType == null) {
      pass = false;
      msg = "กรุณาเลือกประเภทการรับ";
    } else if (payType == "" || payType == null) {
      pass = false;
      msg = "กรุณาเลือกประเภทตราสาร";
    } else if (payType != "เงินสด" && (this.document.BankNo == "" || this.document.BankNo == null || this.document.BankNo == undefined)) {
      pass = false;
      msg = "กรุณาเลือกธนาคาร";
    } else if (payType === "เช็ค" && (payDate == "" || payDate == null)) {
      pass = false;
      msg = "กรุณาเลือกวันที่ตราสาร";
    }
    else if (this.lines.length == 0) { //ตรวจสอบการเลือกสินค้า
      pass = false;
      msg = "กรุณาเพิ่มรายการ";
    } else if (receiveType == "รับชำระ" && this.receivePayList.length == 0) {
      pass = false;
      msg = "กรุณาเลือกรายการตัดหนี้";
    } else if (receiveType == "รับชำระ" && sumTxPayAmt != this.document.NetAmt) {
      pass = false;
      msg = "กรุณาตัดหนี้ให้พอดีตามจำนวนที่ชำระ";
    } else {
      //ตรวจสอบการกรอกจำนวนสินค้า
      if (this.lines.length > 0) {
        for (var i = 0; i < this.lines.length; i++) {
          if (this.lines[i].PdId == "") {
            pass = false;
            msg = "กรุณาเลือกรหัสรายการ <br>";
            break;
          } else {
            pass = true;
          }

          // if (this.lines[i].ItemAmt <= 0) {
          //   pass = false;
          //   msg = "กรุณากรอกจำนวน <br>" + this.lines[i].PdId + " : " + this.lines[i].PdName;
          //   break;
          // } else {
          //   pass = true;
          // }
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
  public ShowCustomeInput(): boolean {
    let strCusCode: string = (this.document.CustCode || "").toString().trim();
    let result: boolean = this._arrSpecialCusCode.includes(strCusCode);
    return result;
  }
}
