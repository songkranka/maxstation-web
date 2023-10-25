import { element } from 'protractor';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { valueSelectbox } from "../../../../shared-model/demoModel"
import { ActivatedRoute,Router } from '@angular/router';
import { SharedService } from '../../../../shared/shared.service';
import swal, { SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common'
import * as moment from 'moment';
import { DefaultService } from 'src/app/service/default.service';
import { ModelMasCustomer2, ModelMaxCardProfile, ModelSalQuotationHd2 } from 'src/app/model/ModelCommon';
import { ApiResponse } from 'src/app/modules/Invoice/Invoice/Invoice.component';
import Swal from 'sweetalert2';
import { async } from '@angular/core/testing';
import { ModelMasBranch, ModelMasCustomer, ModelMasEmployee, ModelMasPayType, ModelSalQuotationDt, ModelSalQuotationHd, ModelSysApproveStep } from 'src/app/model/ModelScaffold';
import { CustomerModel } from 'src/app/model/sale/quotation.interface';
import { QuotationService } from 'src/app/service/quotation-service/quotation-service';
import { ApproveService } from 'src/app/modules/Master-data/Approve/Approve.service';
import { ModelApproveParam } from 'src/app/modules/Master-data/Approve/ModelApprove';
import { AuthGuard } from 'src/app/guards/auth-guard.service';

//==================== Model ====================
//*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z
export class BranchModel {
  Address: string;
  BrnCode: string;
  BrnName: string;
  BrnStatus: string;
  CompCode: string;
  CreatedBy: string;
  CreatedDate: Date;
  District: string;
  Fax: string;
  Phone: string;
  Postcode: string;
  Province: string;
  SubDistrict: string;
  UpdatedBy: string;
  UpdatedDate: Date;
}

interface ShowVAT {
  VatType: string;
  VatTypeName: string;
  VatRate: number;
  TaxBase: number;
  VatAmt: number;
}

export class CurrencyModel {
  Currency: string;
  Rate:number;
}



export class DetailModel extends ModelSalQuotationDt {
  /*
  BrnCode: string;
  CompCode: string;
  DiscAmt: number;
  DiscAmtCur: number;
  DiscHdAmt: number;
  DiscHdAmtCur: number;
  DocNo: string;
  ItemQty: number;
  IsFree: boolean;
  LocCode: string;
  UnitBarcode: string;
  PdId: string;
  PdName: string;
  SeqNo: number;
  StockQty: number;
  StockRemain: number;
  TotalAmt: number;
  TotalAmtCur: number;
  SumItemAmt: number;
  SumItemAmtCur: number;
  SubAmt: number;
  SubAmtCur: number;
  TaxBaseAmt: number;
  TaxBaseAmtCur: number;
  UnitId: string;
  UnitName: string;
  UnitPrice: number;
  UnitPriceCur: number;
  VatAmt: number;
  VatAmtCur: number;
  VatRate: number;
  VatType: string;
*/
}

export class HeaderModel extends ModelSalQuotationHd {
  CustPrefix: string;
  /*
  BrnCode: string;
  BrnCodeFrom: string;
  BrnNameFrom: string;
  CompCode: string;
  CreatedBy: string;
  CreatedDate:Date;
  CurRate:number;
  Currency: string;
  CustAddr1: string;
  CustAddr2: string;
  CustCode: string;
  CustName: string;
  DiscAmt:number;
  DiscAmtCur:number;
  DiscRate: string;
  DocDate:Date;
  DocNo: string;
  DocPattern: string;
  DocStatus: string;
  FinishDate:Date;
  Guid: string;
  ItemCount:number;
  LocCode: string;
  NetAmt:number;
  NetAmtCur:number;
  Post: string;
  Remark: string;
  RunNumber:number;
  StartDate:Date;
  SubAmt:number;
  SubAmtCur:number;
  TaxBaseAmt: number;
  TaxBaseAmtCur: number;
  TotalAmt:number;
  TotalAmtCur:number;
  UpdatedBy: string;
  UpdatedDate:Date;
  VatAmt:number;
  VatAmtCur:number;
  VatRate:number;
  DocType : string;
  MaxCardId : string;
  CitizenId : string;
  Phone : string;
  */
}

export class ProductModel {
  CreatedBy: string;
  CreatedDate: Date;
  GroupId: string;
  UnitBarcode: string;
  UnitPrice:number;
  PdDesc: string;
  PdId: string;
  PdName: string;
  PdStatus: string;
  UnitId: string;
  UnitName: string;
  UpdatedBy: string;
  UpdatedDate: Date;
  VatRate:number;
  VatType: string;
}

@Component({
  selector: 'app-quotation',
  templateUrl: './quotation.component.html',
  styleUrls: ['./quotation.component.scss']
})

export class QuotationComponent implements OnInit {
  //==================== Global Variable ====================
  //*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z
  branchList: BranchModel[];
  branchSelect2: valueSelectbox[];
  currencySelect2: valueSelectbox[];
  currencyList: CurrencyModel[]=[];
  customer: CustomerModel;
  customerList: CustomerModel[]=[];
  document : HeaderModel;
  headerCard : string;
  lines: DetailModel[];
  myGroup: FormGroup;
  productList: ProductModel[]=[];
  productSelectedList: ProductModel[]=[];
  status = "";
  statusOriginal = "";
  vatGroupList: { [vatGroup: string] : ShowVAT; } = {};
  btnGetProductList = "";

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

  //==================== Input Date ====================
  FinishDate: NgbDate | null;
  FinishDateShow : NgbDate | null;
  hoveredDate: NgbDate | null = null;
  StartDate: NgbDate | null;
  StartDateShow  : NgbDate | null;

  MinDate : NgbDate = null;
  public ArrayPayType : ModelMasPayType[] = [];
  public ArrayEmployee : ModelMasEmployee[]=[];
  public DictEmployee : {[key:string] : string };
  private authPositionRole: any;
  action: string = "";
//==================== constructor ====================
  //*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z
  constructor(
    private calendar: NgbCalendar,
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private routerLink:Router,
    private sharedService: SharedService,
    public datepipe: DatePipe,
    public formatter: NgbDateParserFormatter,
    public SvDefault : DefaultService,
    private _svQuotation : QuotationService,
    private _svApprove : ApproveService,
    private authGuard: AuthGuard,
  ) {
    this.branchSelect2=[];
    this.currencySelect2= [];
    this.FinishDate = calendar.getNext(calendar.getToday(), 'd', 14);
    this.FinishDateShow = this.FinishDate;
    this.StartDate = calendar.getToday();
    this.StartDateShow = this.StartDate;
  }

  private _strMaxCardId : string = "";

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  //==================== ngOnInit ====================
  async ngOnInit() {
    this.SvDefault.DoAction(()=>this.start());
    await this.SvDefault.DoActionAsync(async()=>{
      //await this.loadEmployee();
      this.ArrayPayType = await this._svQuotation.GetArrayPayType();
    });
  }

  //==================== Function ====================
  public async OnEnterEmpCode(){
    await this.SvDefault.DoActionAsync(async()=> await this.onEnterEmpCode(),true);
  }
  private async onEnterEmpCode(){
    let emp : ModelMasEmployee = null;
    emp = await this._svQuotation.GetEmployee(this.document.EmpCode);
    if(emp == null){
      Swal.fire(`ไม่พบพนักงาน รหัส ${this.document.EmpCode}`,"","warning");
      this.document.EmpCode = "";
      this.document.EmpName = "";
      return;
    }
    let strPrefix : string = "";
    strPrefix = this.SvDefault.GetString(emp.PrefixThai);

    let strFirstName : string = "";
    strFirstName =  this.SvDefault.GetString(emp.PersonFnameThai);

    let strLastName : string = "";
    strLastName =   this.SvDefault.GetString(emp.PersonLnameThai);

    let strEmpName : string = "";
    strEmpName = `${strPrefix} ${strFirstName} ${strLastName}`;
    this.document.EmpName = strEmpName;
  }

  private async loadEmployee(){
    this.ArrayEmployee = await this._svQuotation.GetArrayEmployee();
    if(!(Array.isArray(this.ArrayEmployee) && this.ArrayEmployee.length)){
      return;
    }
    if(this.DictEmployee == null){
      this.DictEmployee = {};
    }
    for (let i = 0; i < this.ArrayEmployee.length; i++) {
      const emp = this.ArrayEmployee[i];
      if(emp == null){
        continue;
      }
      let strEmpCode : string = "";
      strEmpCode = (emp.EmpCode || "").toString().trim();
      if(this.DictEmployee.hasOwnProperty(strEmpCode)){
        continue;
      }
      let strPrefix : string = "";
      strPrefix = (emp.PrefixThai || "").toString().trim();

      let strFirstName : string = "";
      strFirstName = (emp.PersonFnameThai || "").toString().trim();

      let strLastName : string = "";
      strLastName =  (emp.PersonLnameThai || "").toString().trim();

      let strEmpName : string = "";
      strEmpName = `${strPrefix} ${strFirstName} ${strLastName}`;
      this.DictEmployee[strEmpCode] = strEmpName;
    }
  }
  public OnEmployeeCodeChange(){
    this.SvDefault.DoAction(()=>this.onEmployeeCodeChange());
  }
  private onEmployeeCodeChange() {
    let strEmpCode: string = "";
    strEmpCode = (this.document.EmpCode || "").toString().trim();
    if (strEmpCode === "" || !this.DictEmployee.hasOwnProperty(strEmpCode)) {
      this.document.EmpName = "";
    } else {
      this.document.EmpName = this.DictEmployee[strEmpCode];
    }
  }

  start(){
    this.branchList = [];
    this.branchSelect2 = [];
    this.currencySelect2 = [];
    this.currencyList =[];
    this.customer = new CustomerModel;
    this.customerList = [];
    this.document = new HeaderModel;
    this.headerCard = "เอกสารใบเสนอราคา";
    this.lines = [];
    this.productList = [];
    this.productSelectedList = [];
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
    this.document.BrnCode = this.sharedService.brnCode;
    this.document.CompCode = this.sharedService.compCode;
    this.document.CreatedBy = this.sharedService.user;
    let docGuid = this.route.snapshot.params.DocGuid;

    // alert(this.sharedService.test());
    this.myGroup = new FormGroup({
      branchFrom: new FormControl(),
      currency: new FormControl(),
      remarks: new FormControl(),
      searchCustomer: new FormControl(),
      searchProduct: new FormControl(),
    });

    if(docGuid == "New"){
      this.action = "New";
      this.status = "สร้าง";
      this.statusOriginal = this.status;
      this.newDocument();
    } else {
      this.action = "Edit";
      this.getDocument(docGuid);
    }

    this.getBranch();
    this.getCurrencySelect2();
    this.branchSelect2;
    this.currencySelect2;
  }

  addCustomer() {
    this.document.CustCode = this.customer.CustCode;
    this.document.CustPrefix = this.customer.CustPrefix;
    this.document.CustName = this.customer.CustName;
    // this.document.CustAddr1 = this.customer.Address;
    this.document.CustAddr1 = this.customer.CustAddr1;
    this.document.CustAddr2 = this.customer.CustAddr2;
    this.document.Phone = this.customer.Phone;
    this.document.CitizenId = this.customer.CitizenId;
    //this.document.MaxCardId = "";
    this.document.InvName = this.document.CustName;
    this.document.InvAddr1 = this.document.CustAddr1;
    this.document.InvAddr2 = this.document.CustAddr2
  }

    addItemtoLine() {
    for(let i = 0; i < this.productSelectedList.length; i++){
      var productObj = this.lines.find((row, index) => row.UnitBarcode == this.productSelectedList[i].UnitBarcode);
      if(!productObj){
        //เพิ่มเฉพาะสินค้าที่ยังไม่เคยเลือก
        let obj = new DetailModel ;
        obj.BrnCode = this.document.BrnCode;
        obj.CompCode = this.document.CompCode;
        obj.DiscAmt = 0;
        obj.DiscAmtCur = obj.DiscAmt * this.document.CurRate;
        obj.DocNo = this.document.DocNo;
        obj.IsFree = false;
        obj.ItemQty = 0;
        obj.LocCode = this.document.LocCode;
        obj.PdId = this.productSelectedList[i].PdId;
        obj.PdName = this.productSelectedList[i].PdName;
        obj.SeqNo = 0;
        obj.StockQty = 0;
        obj.SumItemAmt = 0;
        obj.SumItemAmtCur = obj.SumItemAmt * this.document.CurRate;
        obj.SubAmt = 0;
        obj.SubAmtCur = obj.SubAmt * this.document.CurRate;
        obj.TaxBaseAmt = 0;
        obj.TaxBaseAmtCur = obj.TaxBaseAmt * this.document.CurRate;
        obj.UnitBarcode = this.productSelectedList[i].UnitBarcode;
        obj.UnitId = this.productSelectedList[i].UnitId;
        obj.UnitName = this.productSelectedList[i].UnitName;
        obj.UnitPrice = this.productSelectedList[i].UnitPrice;
        obj.UnitPriceCur = obj.UnitPrice * this.document.CurRate;
        obj.RefPrice = obj.UnitPrice;
        obj.RefPriceCur = obj.UnitPriceCur;
        obj.VatAmt = 0;
        obj.VatAmtCur = obj.VatAmt * this.document.CurRate;
        obj.VatRate = this.productSelectedList[i].VatRate;
        obj.VatType = this.productSelectedList[i].VatType;
        this.lines.push(obj);
      }
    }

    //ตัดข้อมูล productSelectedList ที่ไม่มีใน Lines ออก
    for(var i = 0; i < this.lines.length; i++){
      var line = this.productSelectedList.find((row, index) => row.UnitBarcode == this.lines[i].UnitBarcode);
      if(!line){
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
        element.SubAmt = ((element.UnitPrice * element.ItemQty) - element.DiscAmt);
        element.SumItemAmt = (element.UnitPrice * element.ItemQty);
        subTotalHD += element.SubAmt;
    });

    //Cal DiscHdAmt, VAT
    this.lines.forEach(element => {
      if(!element.IsFree){
        element.DiscHdAmt = (element.SubAmt / (subTotalHD || 1)) * this.document.DiscAmt;
        let beforeTax = 0;
        let taxBase = 0;
        let taxAmt = 0;
        if(element.VatType == "VE"){
          beforeTax = element.SubAmt - element.DiscHdAmt;
          taxBase = beforeTax;
          taxAmt = ((taxBase * element.VatRate) / (100 || 1));
        } else if(element.VatType == "VI"){
          beforeTax = element.SubAmt - element.DiscHdAmt;
          taxBase = ((beforeTax * 100) / ((100 + element.VatRate) || 1));
          taxAmt = (((element.SubAmt - element.DiscHdAmt) * element.VatRate) / ((100 + element.VatRate) || 1));
        } else if(element.VatType == "NV"){
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
      if(!element.IsFree){
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
      if(!element.IsFree){
        let type = "";
        if(element.VatType == "VE"){
          type = "ExcludeVAT";
        } else if(element.VatType == "VI"){
          type = "IncludeVAT";
        } else if(element.VatType == "NV"){
          type = "NoVAT";
        }

        this.vatGroupList[element.VatRate] = {
          VatType: element.VatType,
          VatTypeName: type,
          VatRate: element.VatRate,
          TaxBase: (this.vatGroupList[element.VatRate] == undefined ? 0 : this.vatGroupList[element.VatRate].TaxBase ) + element.TaxBaseAmt,
          VatAmt: (this.vatGroupList[element.VatRate] == undefined ? 0 : this.vatGroupList[element.VatRate].VatAmt ) + element.VatAmt
        };
      }
    });
  };

  calculateRow = (indexs: any) => {
    var productObj = this.lines.find((row, index) => index == indexs);
    if(productObj.ItemQty < 0){
      productObj.ItemQty = 0;
      swal.fire({
        title: "ไม่อนุญาตให้กรอกจำนวนน้อยกว่า 0",
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon : 'error'
      })
      .then(()=>{
      });
    }
    this.calculateDocument();
  };

  /*
  cancelDocument = () => {
    swal.fire({
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: "ตกลง",
      denyButtonText: "ยกเลิก",
      icon : 'warning',
      showDenyButton: true,
      title: 'คุณต้องการยกเลิกเอกสารใช่หรือไม่?',
    }).then((result) => {
      if (result.isConfirmed) {
        this.status = "ยกเลิก";
        this.document.DocStatus = "Cancel";
        this.saveDocument();
      } else if (result.isDenied) {
      }
    })
  };
  */
  public async cancelDocument(){
    if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isCancel")) {
      this.SvDefault.ShowPositionRoleMessage("IsCancel");
      return;
    }

    let swOption : SweetAlertOptions = {
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: "ตกลง",
      denyButtonText: "ยกเลิก",
      icon : 'warning',
      showDenyButton: true,
      title: 'คุณต้องการยกเลิกเอกสารใช่หรือไม่?',
    }
    let swResult : SweetAlertResult = await swal.fire(swOption);
    if(swResult.isConfirmed && await this.validateBeforeCancel()){
      this.status = "ยกเลิก";
      this.document.DocStatus = "Cancel";
      this.saveDocument();
    }
  }
  private async validateBeforeCancel(){
    let arrAppStep : ModelSysApproveStep[] = await this._svQuotation.GetApproveStep(this.document);
    if(!this.SvDefault.IsArray(arrAppStep)){
      return true;
    }
    let arrAppStepFilterStatusY = arrAppStep.filter(x=> x.ApprStatus === "Y");
    if(!this.SvDefault.IsArray(arrAppStepFilterStatusY)){
      return true;
    }
    let strEmp : string = arrAppStepFilterStatusY.map(x=> `${x.EmpCode} : ${x.EmpName}`).join("<br/>");
    swal.fire("ไม่อนุญาติให้ยกเลิก เนื่องจากเอกสารนี้มีการอนุมัติโดย",strEmp,"warning");
    return false;
  }
  changeBranchFrom = () => {
    if(this.lines.length > 0){
      swal.fire({
        allowEscapeKey: false,
        allowOutsideClick: false,
        confirmButtonText: "ตกลง",
        denyButtonText: "ยกเลิก",
        icon : 'warning',
        showDenyButton: true,
        title: 'คุณต้องการเปลี่ยนสาขาที่รับใช่หรือไม่? <br> ระบบจะทำการลบรายการสินค้าที่เลือกออกทั้งหมด',
      }).then((result) => {
        if (result.isConfirmed) {
          this.lines = [];
          this.productSelectedList = [];
          this.document.BrnCodeFrom = this.myGroup.get('branchFrom').value;
          this.calculateDocument();
        } else if (result.isDenied) {
          this.myGroup.get('branchFrom').setValue(this.document.BrnCodeFrom);
        }
      })
    }
  };

  changeCurrency = () => {
    var cur = this.myGroup.get('currency').value;
    if(cur != "" && cur != null){
      var curObj = this.currencyList.find((row, index) => row.Currency == cur);
      this.document.Currency = curObj.Currency;
      this.document.CurRate = curObj.Rate;
    }
    else{
      this.document.Currency = null;
      this.document.CurRate = 0;
    }
  };

  checkSession = () => {
    if((this.sharedService.compCode === null || this.sharedService.compCode === undefined || this.sharedService.compCode === "")
      &&(this.sharedService.brnCode === null || this.sharedService.brnCode === undefined || this.sharedService.brnCode === "")
      && (this.sharedService.locCode === null || this.sharedService.locCode === undefined || this.sharedService.locCode === "")
      && (this.sharedService.user === null || this.sharedService.user === undefined || this.sharedService.user === "")
      ){
        swal.fire({
          allowEscapeKey: false,
          allowOutsideClick: false,
          icon : 'error',
          title: 'กรุณาเข้าสู่ระบบอีกครั้ง',
        })
        .then(()=>{
          this.routerLink.navigate(["Login"]);
        });
    }
  };

  clearDocument = () => {
    swal.fire({
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: "ตกลง",
      denyButtonText: "ยกเลิก",
      icon : 'warning',
      showDenyButton: true,
      title: 'คุณต้องการล้างข้อมูลที่กรอกไว้ ใช่หรือไม่?',
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

  deleteRow = (indexs: any):void => {
    var productObj = this.lines.find((row, index) => index == indexs);
    this.productSelectedList = this.productSelectedList.filter((row, index) => row.PdId !== productObj.PdId);
    this.lines = this.lines.filter((row, index) => index !== indexs);
    this.calculateDocument();
  }

  deleteSelected = (indexs: any):void => {
    var productObj = this.productSelectedList.find((row, index) => index == indexs);
    this.productSelectedList = this.productSelectedList.filter((row, index) => index !== indexs);
    this.productList.push(productObj);
    this.calculateDocument();
  }

  getBackgroundRibbon() {
    let classStatus = "ribbon-1 ribbon tooltipa statusBase"
    if(this.document.DocStatus == "Cancel"){
      classStatus += " statusCancel ";
    } else if(this.document.DocStatus == "New"){
      classStatus += " statusNew ";
    } else if(this.document.DocStatus == "Ready"){
      classStatus += " statusReady ";
    } else if(this.document.DocStatus == "Reference"){
      classStatus += " statusReference ";
    } else if(this.document.DocStatus == "Active"){
      classStatus += " statusActive ";
    } else {
      classStatus += " statusNew ";
    }
    return classStatus;
  }

  getBranch = ():void => {
    var data = {
      "CompCode": this.document.CompCode,
      "LocCode": this.document.LocCode,
    }
    this.httpClient.post(this.urlMas + "/api/Branch/GetBranchList",data)
    .subscribe(
      response  => {
        console.log("BranchList : ", response);
        this.branchSelect2=[];
        this.branchList=[];
        for (let i = 0; i < response["Data"].length ; i++)
        {
          this.branchSelect2.push({
            KEY: response["Data"][i].BrnCode.trim() + " : " + response["Data"][i].BrnName.trim() ,
            VALUE: response["Data"][i].BrnCode.trim()
          });

          this.branchList.push({
                  Address: response["Data"][i].BrnCode.trim(),
                  BrnCode: response["Data"][i].BrnCode.trim(),
                  BrnName: response["Data"][i].BrnName.trim(),
                  BrnStatus: response["Data"][i].BrnCode.trim(),
                  CompCode: response["Data"][i].BrnCode.trim(),
                  CreatedBy: response["Data"][i].BrnCode.trim(),
                  CreatedDate: response["Data"][i].BrnCode.trim(),
                  District: response["Data"][i].BrnCode.trim(),
                  Fax: response["Data"][i].BrnCode.trim(),
                  Phone: response["Data"][i].BrnCode.trim(),
                  Postcode: response["Data"][i].BrnCode.trim(),
                  Province: response["Data"][i].BrnCode.trim(),
                  SubDistrict: response["Data"][i].BrnCode.trim(),
                  UpdatedBy: response["Data"][i].BrnCode.trim(),
                  UpdatedDate: response["Data"][i].BrnCode.trim(),

          });
        }
      },
      error  => {
        console.log("Error", error);
      }
    );
  }

  getCurrencySelect2 = ():void => {
    this.currencySelect2=[];
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
      this.currencySelect2.push({  KEY: element.Currency.toString(),  VALUE: element.Currency.toString() });
    });
  }
  async GetMaxCardProfile(){
    await this.SvDefault.DoActionAsync(async()=> await this.getMaxCardProfile(this.document.MaxCardId) , true);
  }
  private async getMaxCardProfile(pStrMaxCardNo : string){
    let apiResult: ModelMaxCardProfile = await this.SvDefault.GetMaxCardProfile(pStrMaxCardNo);
    if(apiResult == null){
      return;
    }
    if(apiResult.response?.resCode !== "00"){
      Swal.fire((apiResult.response?.resMsg || "").toString().trim(),"" , "warning");
      this.document.MaxCardId = "";
      return;
    }
    this._strMaxCardId = pStrMaxCardNo;
    this.document.CitizenId = (apiResult.data?.CitizenID || "").toString().trim();
    this.document.Phone = (apiResult.data?.PhoneNo || "").toString().trim();
    this.document.CustName = (apiResult.data?.FName || "").toString().trim() + " " + (apiResult.data?.LName || "").toString().trim();
    this.document.CustAddr1 = "";
    this.document.CustAddr2 = "";
    this.document.InvName = this.document.CustName;
  }
  public async GetMaxCardForCreditSale(){
    await this.SvDefault.DoActionAsync(async()=> await this.getMaxCardForCreditSale(this.document.MaxCardId) , true);
  }
  private async getMaxCardForCreditSale(pStrMaxCardNo : string){
    let apiResult: ModelMaxCardProfile = await this.SvDefault.GetMaxCardProfile(pStrMaxCardNo);
    if(apiResult == null){
      return;
    }
    if(apiResult.response?.resCode !== "00"){
      Swal.fire((apiResult.response?.resMsg || "").toString().trim(),"" , "warning");
      this.document.MaxCardId = "";
      return;
    }
    this._strMaxCardId = pStrMaxCardNo;
  }
  async getCustomerList(){
    this.SvDefault.DoActionAsync(async()=> await this._getCustomerList());
  }
  private async _getCustomerList(){
    this.customerList = await this._svQuotation.GetCustomerList(this.myGroup.get('searchCustomer').value);
  }
/*
  getCustomerList2()
    {
      this.customerList = [];
      var data =
        {
          "CompCode": this.document.CompCode,
          "LocCode": this.document.LocCode,
          "Keyword": this.myGroup.get('searchCustomer').value,
        }
      this.httpClient.post(this.urlMas + "/api/Customer/GetCustomerList",data)
      .subscribe(
        response  => {
          console.log(response);
          for (let i = 0; i < response["Data"].length ; i++)
          {
            let obj = new CustomerModel();
              obj.AccountId = response["Data"][i].AccountId;
              obj.Address = response["Data"][i].Address;
              obj.BillType = response["Data"][i].BillType;
              obj.BrnCode = response["Data"][i].BrnCode;
              obj.CompCode = response["Data"][i].CompCode;
              obj.ContactName = response["Data"][i].ContactName;
              obj.CreatedBy = response["Data"][i].CreatedBy;
              obj.CreatedDate = response["Data"][i].CreatedDate;
              obj.CreditLimit = response["Data"][i].CreditLimit;
              obj.CreditTerm = response["Data"][i].CreditTerm;
              obj.CustCode = response["Data"][i].CustCode;
              obj.CustName = response["Data"][i].CustName;
              obj.CustPrefix = response["Data"][i].CustPrefix;
              obj.CustStatus = response["Data"][i].CustStatus;
              obj.District = response["Data"][i].District;
              obj.DueType = response["Data"][i].DueType;
              obj.Fax = response["Data"][i].Fax;
              obj.Phone = response["Data"][i].Phone;
              obj.Postcode = response["Data"][i].Postcode;
              obj.Province = response["Data"][i].Province;
              obj.RegisterId = response["Data"][i].RegisterId;
              obj.SubDistrict = response["Data"][i].SubDistrict;
              obj.UpdatedBy = response["Data"][i].UpdatedBy;
              obj.UpdatedDate = response["Data"][i].UpdatedDate;
            this.customerList.push(obj);
          }
        },
        error  => {
          console.log("Error", error);
        }
      );
    }
*/
  getDocument(docGuid:string = "")
  {
    let req = {
      "Guid": docGuid
    }
    this.httpClient.post(this.urlSale + "/api/Quotation/GetQuotation",req)
    .subscribe(
      response  => {
        if(response == null || !response.hasOwnProperty("Data")){
          return;
        }
        let doc = <HeaderModel>response["Data"];
        if(!this.SvDefault.CheckDocBrnCode(doc?.BrnCode)){
          return;
        }
        this.document = doc;// <HeaderModel>response["Data"];
        this._strMaxCardId = this.document.MaxCardId;
        this.document.CreatedDate = new Date(response["Data"].CreatedDate);
        this.document.DocDate = new Date(response["Data"].DocDate);
        this.document.FinishDate = new Date(response["Data"].FinishDate);
        this.document.StartDate = new Date(response["Data"].StartDate);
        this.document.UpdatedDate = new Date(response["Data"].UpdatedDate);
        this.MinDate = <NgbDate>{
          day : this.document?.DocDate?.getDate() ,
          month :this.document?.DocDate?.getMonth()+1 ,
          year : this.document?.DocDate?.getFullYear()
        };
      

        this.document.UpdatedBy = this.sharedService.user;
        this.myGroup.controls['branchFrom'].setValue(response["Data"].BrnCodeFrom);
        this.myGroup.controls['currency'].setValue(response["Data"].Currency);
        this.myGroup.controls['currency'].disable();
        this.myGroup.controls['remarks'].setValue(response["Data"].Remark);

        //Set DatePicker StartDate
        this.StartDate.day = this.document.StartDate.getDate();
        this.StartDate.month = this.document.StartDate.getMonth() + 1;
        this.StartDate.year = this.document.StartDate.getUTCFullYear();
        if(this.StartDate != null) {
          this.StartDateShow = this.StartDate;
          this.document.StartDate = new Date(this.StartDate.year, this.StartDate.month - 1, this.StartDate.day);
        }

        //Set DatePicker FinishDate
        this.FinishDate.day = this.document.FinishDate.getDate();
        this.FinishDate.month = this.document.FinishDate.getMonth() + 1;
        this.FinishDate.year = this.document.FinishDate.getUTCFullYear();
        if(this.FinishDate != null){
          this.FinishDateShow = this.FinishDate;
          this.document.FinishDate = new Date(this.FinishDate.year, this.FinishDate.month - 1, this.FinishDate.day);
        }
        let pDBarcodeList = "";
        let rqList = response["Data"].SalQuotationDt;
        if(Array.isArray(rqList) && rqList.length){
          this.lines = <DetailModel[]>rqList;
          pDBarcodeList = this.lines.map( x=> (x.UnitBarcode || "").toString().trim())
            .filter( x=> x!== "").join(",");
        }else{
          this.lines = [];
        }
        this.getProductSelectedList(pDBarcodeList);
        this.calculateDocument();

        //Hidden Button
        if(this.document.DocStatus == "Cancel"){
          this.status = "ยกเลิก";
          this.btnApprove = true;
          this.btnBack = false;
          this.btnCancel = true;
          this.btnClear = true;
          this.btnComplete = true;
          this.btnPrint = false;
          this.btnReject = true;
          this.btnSave = true;
        } else if(this.document.DocStatus == "Ready"){
          this.status = "พร้อมใช้";
          this.btnApprove = true;
          this.btnBack = false;
          this.btnCancel = false;
          this.btnClear = true;
          this.btnComplete = true;
          this.btnPrint = false;
          this.btnReject =true;
          this.btnSave = true;
        } else if(this.document.DocStatus == "Reference"){
          this.status = "เอกสารถูกอ้างอิง";
          this.btnApprove = true;
          this.btnBack = false;
          this.btnCancel = true;
          this.btnClear = true;
          this.btnComplete = true;
          this.btnPrint = false;
          this.btnReject = true;
          this.btnSave = true;
        } else if(this.document.DocStatus == "Active"){
          this.status = "แอคทีฟ";
          this.btnApprove = true;
          this.btnBack = false;
          this.btnCancel = false;
          this.btnClear = true;
          this.btnComplete = false;
          this.btnPrint = false;
          this.btnReject = true;
          this.btnSave = false;
        } else if(this.document.DocStatus == "Wait"){
          this.status = "รออนุมัติ";
          this.btnApprove = false;
          this.btnBack = false;
          this.btnCancel = true;
          this.btnClear = true;
          this.btnComplete = true;
          this.btnPrint = false;
          this.btnReject = false;
          this.btnSave = true;
        }

        this.headerCard = "เอกสารใบเสนอราคา";
        this.statusOriginal = this.status;
      },
      error  => {
        console.log("Error", error);
      }
    );
  }

  getPattern = ():void => {
    var req =
    {
      "BrnCode": this.document.BrnCode,
      "CompCode": this.document.CompCode,
      "DocDate": this.document.DocDate,
      "DocNo": this.document.DocNo,
      "DocType": "Quotation",
      "LocCode": this.document.LocCode,
    }

    var pattern = ""
    this.httpClient.post(this.urlMas + "/api/Other/GetPattern",req)
    .subscribe(
      response  => {
        pattern = response["Data"].Pattern;
        this.document.DocNo = pattern;
        this.document.DocPattern = pattern;
      },
      error  => {
        console.log("Error", error);
      }
    );
  }

  getProductListValidate()
  {
    this.btnGetProductList = "";
    let brnFrom = this.myGroup.get('branchFrom').value;
    this.document.BrnCodeFrom = brnFrom;
    if(this.document.BrnCodeFrom == "" || this.document.BrnCodeFrom == null || this.document.BrnCodeFrom == undefined) {
      this.btnGetProductList = "";
      swal.fire({
        title: 'กรุณาเลือกสาขาที่ต้องการรับสินค้า',
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon : 'error'
      })
      .then(()=>{
        this.btnGetProductList = "";
      });
    } else {
      this.btnGetProductList = "modal-getProduct";
      this.getProductList();
    }
  }

  getProductList()
  {
    this.productList = [];
    var data =
      {
        "CompCode": this.document.CompCode,
        "LocCode": this.document.LocCode,
        "BrnCode": this.document.BrnCodeFrom,
        "Keyword": this.myGroup.get('searchProduct').value,
        "SystemDate": this.SvDefault.GetFormatDate(<Date>this.document.DocDate)
      }
    this.httpClient.post(this.urlMas + "/api/Product/GetProductList",data)
    .subscribe(
      response  => {
        console.log(response);
        for (let i = 0; i < response["Data"].length ; i++)
        {
          let obj = new ProductModel();
          obj.CreatedBy = response["Data"][i].CreatedBy;
          obj.CreatedDate = response["Data"][i].CreatedDate;
          obj.GroupId = response["Data"][i].GroupId;
          obj.UnitBarcode = response["Data"][i].UnitBarcode;
          obj.UnitPrice = response["Data"][i].UnitPrice;
          obj.PdDesc = response["Data"][i].PdDesc;
          obj.PdId = response["Data"][i].PdId;
          obj.PdName = response["Data"][i].PdName;
          obj.PdStatus = response["Data"][i].PdStatus;
          obj.UnitId = response["Data"][i].UnitId;
          obj.UnitName = response["Data"][i].UnitName;
          obj.UpdatedBy = response["Data"][i].UpdatedBy;
          obj.UpdatedDate = response["Data"][i].UpdatedDate;
          obj.VatRate = response["Data"][i].VatRate;
          obj.VatType = response["Data"][i].VatType;
          var pdl = this.productSelectedList.filter((row, index) => row.UnitBarcode == obj.UnitBarcode);
          if(pdl.length == 0){
            this.productList.push(obj);
          }
        }
    },
    error  => {
      console.log("Error", error);
    }
    );
  }

  getProductSelectedList(pDBarcodeList:string = "")
  {
    this.productSelectedList = [];
    var data =
      {
        "CompCode": this.document.CompCode,
        "LocCode": this.document.LocCode,
        "BrnCode": this.document.BrnCodeFrom,
        "PDBarcodeList": pDBarcodeList,
        "SystemDate": this.SvDefault.GetFormatDate(<Date>this.document.DocDate)
      }
    this.httpClient.post(this.urlMas + "/api/Product/GetProductList",data)
    .subscribe(
      response  => {
        console.log(response);
        for (let i = 0; i < response["Data"].length ; i++)
        {
          let obj = new ProductModel();
          obj.PdId = response["Data"][i].PdId;
          obj.UnitBarcode = response["Data"][i].UnitBarcode;
          obj.UnitPrice = response["Data"][i].UnitPrice;
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
      error  => {
        console.log("Error", error);
      }
    );
  }

  hilightRow(indexs){
    if(indexs == null){
      indexs = this.customerList.findIndex(e => e.CustCode === this.customer.CustCode);
    }
    if(indexs != null){
      const slides = document.getElementsByClassName('trStyle');
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i] as HTMLElement;
        if(i == indexs){
          slide.style.backgroundColor = "#9fdb95";
        }else{
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
    this.document.BrnCodeFrom = "";
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
    this.document.DiscRate = "";
    this.document.DocDate = this.sharedService.systemDate;
    this.MinDate = <NgbDate>{
      day : this.document?.DocDate?.getDate() ,
      month :this.document?.DocDate?.getMonth()+1 ,
      year : this.document?.DocDate?.getFullYear()
    };
    this.document.DocNo = "";
    this.document.DocStatus = "New";
    this.document.FinishDate = new Date();
    this.document.Guid = "1f8f68b6-e7ff-42f0-8b35-27bb2cc57f93"; //ต้องใส่หลอกไว้ งั้น Model ไม่รองรับ
    this.document.ItemCount = 0;
    this.document.LocCode = this.sharedService.locCode;
    this.document.NetAmt = 0;
    this.document.NetAmtCur = 0;
    this.document.Post = "N";
    this.document.Remark = "";
    this.document.RunNumber = 0;
    this.document.StartDate = this.sharedService.systemDate;
    this.document.SubAmt = 0;
    this.document.SubAmtCur = 0;
    this.document.TaxBaseAmt = 0;
    this.document.TaxBaseAmtCur = 0;
    this.document.TotalAmt = 0;
    this.document.TotalAmtCur = 0;
    this.document.UpdatedBy = this.sharedService.user;
    this.document.UpdatedDate = new Date();
    this.document.VatAmt = 0;
    this.document.VatAmtCur = 0;
    this.document.VatRate = 0;
    this.document.DocType = "CashSale";
    //Set Input
    this.myGroup.controls['currency'].setValue(this.document.Currency);
    this.myGroup.controls['currency'].disable();

    //Set Input
    this.myGroup.controls['branchFrom'].setValue(this.document.BrnCode);
    this.myGroup.controls['branchFrom'].disable();

    if(this.FinishDate != null){
      this.FinishDateShow = this.FinishDate;
      this.document.FinishDate = new Date(this.FinishDate.year, this.FinishDate.month - 1, this.FinishDate.day);
    }

    if(this.StartDate != null) {
      this.StartDateShow = this.StartDate;
      this.document.StartDate = new Date(this.StartDate.year, this.StartDate.month - 1, this.StartDate.day);
    }

    //this.getPattern();

    //Set Hidden Button
    this.btnSave = false;
    this.btnPrint = true;
    this.btnCancel = true;
    this.btnClear = false;
    this.btnBack = false;
    this.btnComplete = true;
    this.btnApprove = true;
    this.btnReject = true;

    //Set HeaderCard
    this.headerCard = "เอกสารใบเสนอราคา";
    let arrPattern = await this.SvDefault.GetPatternAsync("Quotation");
    let strPattern = this.SvDefault.GenPatternString(this.sharedService.systemDate , arrPattern , this.sharedService.compCode , this.sharedService.brnCode);
    this.document.DocNo =strPattern;
    this.document.DocPattern = strPattern;
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

    if(this.FinishDate != null){
      this.FinishDateShow = this.FinishDate;
      this.document.FinishDate = new Date(this.FinishDate.year, this.FinishDate.month - 1, this.FinishDate.day);
    }

    if(this.StartDate != null) {
      this.StartDateShow = this.StartDate;
      this.document.StartDate = new Date(this.StartDate.year, this.StartDate.month - 1, this.StartDate.day);
    }
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
      icon : 'info'
    })
    .then(()=>{
    });
  };

  rejectDocument = () => {
    this.status = "แอคทีฟ";
    this.document.DocStatus = "Active";
    this.saveDocument();
  };

  rejectDocStatus = () => {
    this.status = this.statusOriginal;
    if(this.status == "สร้าง"){
      this.document.DocStatus = "New";
    } else if(this.status == "แอคทีฟ"){
      this.document.DocStatus = "Active";
    } else if(this.status == "รออนุมัติ"){
      this.document.DocStatus = "Wait";
    } else if(this.status == "พร้อมใช้"){
      this.document.DocStatus = "Ready";
    } else if(this.status == "เอกสารถูกอ้างอิง"){
      this.document.DocStatus = "Reference";
    } else if(this.status == "ยกเลิก"){
      this.document.DocStatus = "Cancel";
    }
  };

  private loadDocToData(pHeader : HeaderModel , pData : any ) : void{
    if(pHeader == null || pData == null){
      return;
    }
    let arrHeaderKey : string[] = null;
    arrHeaderKey = Object.keys(pHeader);
    let arrDataKey : string[] = null;
    arrDataKey = Object.keys(pData);
    let arrDiffKey : string[] = null;
    arrDiffKey = arrHeaderKey.filter(x=> !arrDataKey.includes(x));
    if(!(Array.isArray(arrDiffKey) && arrDiffKey.length)){
      return;
    }
    for (let i = 0; i < arrDiffKey.length; i++) {
      const strDiffKey = (arrDiffKey[i] || "").toString().trim();
      if(strDiffKey === ""){
        continue;
      }
      pData[strDiffKey] = pHeader[strDiffKey];
    }
  }

  async saveDocument(){
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
    if(await this.validateData()){
      this.document.PosRewardFlag = 'M';
      this.document.PosPrintFlag = 'M';
      let brnFrom = this.branchList.find(e => e.BrnCode === this.myGroup.get('branchFrom').value);
      let data : any = {};
      data =
      {
        "BrnCode": this.document.BrnCode,
        "BrnCodeFrom": this.myGroup.get('branchFrom').value,
        "BrnNameFrom" : brnFrom.BrnName,
        "CompCode": this.document.CompCode,
        "CreatedBy": this.document.CreatedBy,
        "CreatedDate": this.document.CreatedDate,
        "CurRate": this.document.CurRate,
        "Currency": this.document.Currency,
        "CustAddr1": this.document.CustAddr1,
        "CustAddr2": this.document.CustAddr2,
        "CustCode": this.document.CustCode,
        "CustName": this.document.CustName,
        "DiscAmt": this.document.DiscAmt,
        "DiscAmtCur": this.document.DiscAmtCur,
        "DiscRate": this.document.DiscRate,
        "DocDate": this.SvDefault.GetFormatDate( <Date>this.document.DocDate),
        "DocNo": this.document.DocNo,
        "DocStatus": this.document.DocStatus,
        "DocPattern": this.document.DocPattern,
        "FinishDate": this.SvDefault.GetFormatDate(this.document.FinishDate),
        "Guid": this.document.Guid,
        "ItemCount": this.lines.length,
        "LocCode": this.document.LocCode,
        "NetAmt": this.document.NetAmt,
        "NetAmtCur": this.document.NetAmtCur,
        "Post": this.document.Post,
        "Remark": this.myGroup.get('remarks').value,
        "RunNumber": this.document.RunNumber,
        "StartDate": this.SvDefault.GetFormatDate(this.document.StartDate),
        "SubAmt": this.document.SubAmt,
        "SubAmtCur": this.document.SubAmtCur,
        "TotalAmt": this.document.TotalAmt,
        "TotalAmtCur": this.document.TotalAmtCur,
        "TaxBaseAmt": this.document.TaxBaseAmt,
        "TaxBaseAmtCur": this.document.TaxBaseAmtCur,
        "UpdatedBy": this.document.UpdatedBy,
        "UpdatedDate": this.document.UpdatedDate,
        "VatAmt": this.document.VatAmt,
        "VatAmtCur": this.document.VatAmtCur,
        "VatRate": this.document.VatRate,
        "SalQuotationDt": this.lines ,
        "MaxCardId" : this.document.MaxCardId,
        "DocType" : this.document.DocType,
        "CitizenId" : this.document.CitizenId ,
        "Phone" : this.document.Phone ,
        "EmpCode" : this.document.EmpCode,
        "EmpName" : this.document.EmpName ,
        "PayTypeId" : this.document.PayTypeId ,
      };
      this.loadDocToData(this.document , data);
      const headers = { 'content-type': 'application/json'}
      const body=JSON.stringify(data);
      if(this.document.DocStatus == "New"){
        data.DocStatus = "Active";
        this.httpClient.post(this.urlSale + "/api/Quotation/CreateQuotation",data)
        .subscribe(
          response  => {
            swal.fire({
              allowEscapeKey: false,
              allowOutsideClick: false,
              icon : 'success',
              title: 'บันทึกข้อมูลสำเร็จ',
            })
            .then(()=>{
              var docGuid = response["Data"].Guid;
              this.getDocument(docGuid);
              this.routerLink.navigate(['/Quotation/' + docGuid]);
            });
        },
        error  => {
            console.log("Error", error);
            swal.fire({
              title: 'มีข้อผิดพลาด<br> ' + error.error.message,
              allowOutsideClick: false,
              allowEscapeKey: false,
              icon : 'error'
            })
            .then(()=>{
              this.rejectDocStatus();
            });
          }
        );
      } else if(this.document.DocStatus == "Active"
      || this.document.DocStatus == "Wait"
      || this.document.DocStatus == "Cancel"
      || this.document.DocStatus == "Ready") {
        this.httpClient.put(this.urlSale + "/api/Quotation/UpdateQuotation",data)
        .subscribe(
          response  => {
            swal.fire({
            allowEscapeKey: false,
            allowOutsideClick: false,
            icon : 'success',
            title: 'แก้ไขข้อมูลสำเร็จ',
          })
          .then(()=>{
            var docGuid = this.document.Guid;
            this.getDocument(docGuid);
            this.routerLink.navigate(['/Quotation/' + docGuid]);
          });
        },
        error  => {
          console.log("Error", error);
          swal.fire({
            allowEscapeKey: false,
            allowOutsideClick: false,
            icon : 'error',
            title: 'มีข้อผิดพลาด<br> ' + error.error.message,
          })
          .then(()=>{
            this.rejectDocStatus();
          });
        }
        );
      }
    }
  }

  selectedCustomer = (indexs: any):void => {
    var obj = this.customerList[indexs];
    this.customer = obj;
    this.hilightRow(indexs);
  }

  selectedProductList = (indexs: any):void => {
    this.productSelectedList.push(this.productList[indexs]);
    this.productList.splice(indexs, 1);
  }

  setProductFree = (indexs: any) => {
    var productObj = this.lines.find((row, index) => index == indexs);
    if(productObj.IsFree){
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
    this.httpClient.post(this.urlMas + "/api/Product/GetProductList",data)
    .subscribe(
      response  => {
        console.log(response);
        for (let i = 0; i < response["Data"].length ; i++)
        {
          productObj.UnitPrice = response["Data"][i].UnitPrice;
        }
        this.calculateDocument();
      },
      error  => {
        console.log("Error", error);
        this.calculateDocument();
      }
    );
    }
    this.calculateDocument();
  };

  private async validateData() {
    let funcShowError : (msg : String) => void = null;
    funcShowError = msg => {
      let swOption : SweetAlertOptions = <SweetAlertOptions>{
        title : msg,
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon : 'error'
      }
      swal.fire(swOption);
    }
    let brnFrom : string = (this.myGroup?.get('branchFrom')?.value || "").toString().trim();
    let strDocType = (this.document.DocType || "").toString().trim();
    let strCusCode = (this.document.CustCode || "").toString().trim();
    let strMaxCardId = (this.document.MaxCardId || "").toString().trim();
    // if(this.document.CustCode == "" || this.document.CustCode == null || this.document.CustCode == undefined) { //ตรวจสอบการเลือกลูกค้า
    if(strDocType === "CashSale"){
      if(strMaxCardId === ""){
        funcShowError("กรุณาไส่รหัส MaxCard");
        return false;
      }else if(this._strMaxCardId !== strMaxCardId){
        funcShowError("รหัส MaxCard ไม่ถูกต้อง");
        return false;
      }
    }else if(strDocType === "CreditSale"){
      if(strCusCode === ""){
        funcShowError("กรุณาเลือกข้อมูลลูกค้า");
        return false;
      }else if( strMaxCardId !== "" &&  this._strMaxCardId !== strMaxCardId ){
        funcShowError("รหัส MaxCard ไม่ถูกต้อง");
        return false;
      }
    }
    if(brnFrom === "") { //ตรวจสอบการเลือกสาขา
      funcShowError("กรุณาเลือกสาขาที่รับสินค้าได้");
      return false;
    }
    if(this.lines.length == 0){ //ตรวจสอบการเลือกสินค้า
      funcShowError("กรุณาเลือกสินค้า");
      return false;
    } else {
      //ตรวจสอบการกรอกจำนวนสินค้า
      if(this.lines.length > 0){
        for(var i = 0; i < this.lines.length; i++){
          if(this.lines[i].ItemQty <= 0 && !this.lines[i].IsFree){
            funcShowError("กรุณากรอกจำนวนสินค้า <br>" + this.lines[i].UnitBarcode + " : " + this.lines[i].PdName);
            return false;
          }
          if(Array.isArray(this.productSelectedList) && this.productSelectedList.length){
            let prod : ProductModel = null;
            prod = this.productSelectedList.find(x=> x.UnitBarcode === this.lines[i].UnitBarcode);
            if(prod != null && prod.UnitPrice < this.lines[i].UnitPrice){
              funcShowError(`สินค้า ${this.lines[i].UnitBarcode} : ${this.lines[i].PdName} ราคา/หน่วย ห้ามเกิน ${prod.UnitPrice}`);
               return false;
            }
          }
        }
      }
    }
    let strEmpCode = this.SvDefault.GetString(this.document.EmpCode);
    if(strEmpCode === ""){
      funcShowError("กรุณากรอกรหัสผู้ขาย");
      return false;
    }
    var paramApprove = new ModelApproveParam();
    paramApprove.BrnCode = this.document.BrnCode;
    paramApprove.CompCode = this.document.CompCode;
    paramApprove.DocNo = this.document.DocNo;
    paramApprove.DocType = "Quotation";
    paramApprove.LocCode = this.document.LocCode;
    let arrStep = await this._svApprove.ValidateApproveDocument(paramApprove);
    if(this.SvDefault.IsArray(arrStep)){
      let strMessage = "เอกสารนี้ถูกอนุมัติโดย"
        + arrStep.map(x=> "<br/>" + x.EmpName).join("")
        + "<br/>ไม่สามารถบันทึกได้";
      funcShowError(strMessage);
      return false;
    }
    return true;
  }
  /*
  validateData = (): boolean => {
    let pass = true;
    let msg = "";
    let brnFrom = this.myGroup.get('branchFrom').value;
    let strDocType = (this.document.DocType || "").toString().trim();
    let strCusCode = (this.document.CustCode || "").toString().trim();
    let strMaxCardId = (this.document.MaxCardId || "").toString().trim();
    // if(this.document.CustCode == "" || this.document.CustCode == null || this.document.CustCode == undefined) { //ตรวจสอบการเลือกลูกค้า
    if(strDocType === "CashSale"){
      if(strMaxCardId === ""){
        pass = false;
        msg = "กรุณาไส่รหัส MaxCard";
      }else if(this._strMaxCardId !== strMaxCardId){
        pass = false;
        msg = "รหัส MaxCard ไม่ถูกต้อง";
      }
    }else if(strDocType === "CreditSale"){
      if(strCusCode === ""){
        pass = false;
        msg = "กรุณาเลือกข้อมูลลูกค้า";
      }else if( strMaxCardId !== "" &&  this._strMaxCardId !== strMaxCardId ){
        pass = false;
        msg = "รหัส MaxCard ไม่ถูกต้อง";
      }
    }if(brnFrom == "" || brnFrom == null) { //ตรวจสอบการเลือกสาขา
      pass = false;
      msg = "กรุณาเลือกสาขาที่รับสินค้าได้";
    }
    else if(this.lines.length == 0){ //ตรวจสอบการเลือกสินค้า
      pass = false;
      msg = "กรุณาเลือกสินค้า";
    } else {
      //ตรวจสอบการกรอกจำนวนสินค้า
      if(this.lines.length > 0){
        for(var i = 0; i < this.lines.length; i++){

          if(this.lines[i].ItemQty <= 0 && !this.lines[i].IsFree){
            pass = false;
            msg = "กรุณากรอกจำนวนสินค้า <br>" + this.lines[i].UnitBarcode + " : " + this.lines[i].PdName;
            break;
          }
          if(Array.isArray(this.productSelectedList) && this.productSelectedList.length){
            let prod : ProductModel = null;
            prod = this.productSelectedList.find(x=> x.UnitBarcode === this.lines[i].UnitBarcode);
            if(prod != null && prod.UnitPrice < this.lines[i].UnitPrice){
               pass = false;
               msg = `สินค้า ${this.lines[i].UnitBarcode} : ${this.lines[i].PdName} ห้ามเกิน ${prod.UnitPrice} ${prod.UnitName}`;
            }
          }
          //pass = true;
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
  }*/
  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    alert();
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }


  /////////////////
  getBackground() {
    let classStatus = "ribbon-1 ribbon tooltipa statusBase"
    if(this.document.DocStatus == "Cancel"){
      classStatus += " statusCancel ";
    } else if(this.document.DocStatus == "New"){
      classStatus += " statusNew ";
    } else if(this.document.DocStatus == "Ready"){
      classStatus += " statusReady ";
    } else if(this.document.DocStatus == "Reference"){
      classStatus += " statusReference ";
    } else if(this.document.DocStatus == "Active"){
      classStatus += " statusActive ";
    } else {
      classStatus += " statusNew ";
    }
    return classStatus;
  }

  OnDoctypeChange(){
    this.SvDefault.DoAction(()=>{
      this.document.CustCode = "";
      this.document.MaxCardId = "";
      this.document.CustName = "";
      this.document.CustAddr1 = "";
      this.document.CitizenId = "";
      this.document.Phone = "";
      this.document.CustAddr2 = "";
      this.document.InvAddr1 = "";
      this.document.InvAddr2 = "";
      this.document.InvName = "";
      switch (this.document.DocType) {
        case "CashSale":
          this.document.PayTypeId = 1;
          break;
        case "CreditSale":
          this.document.PayTypeId = 4;
          break;
        default:
          break;
      }
    });
  }
}
