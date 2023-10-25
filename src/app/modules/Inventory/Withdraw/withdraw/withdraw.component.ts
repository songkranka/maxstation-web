import { element } from 'protractor';
import { Component, OnInit, HostListener } from '@angular/core';
import { HttpParams, HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { valueSelectbox } from "../../../../shared-model/demoModel"
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../../shared/shared.service';
import swal, { SweetAlertOptions } from 'sweetalert2';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe, JsonPipe } from '@angular/common'
import { debug } from 'console';
/** Model **/
import { BranchModel } from 'src/app/model/master/branch.class';
import { ProductModel } from 'src/app/model/master/product.class';
import { WithdrawHdModel } from 'src/app/model/inventory/withdrawhd.class';
import { SelectedProduct, WithdrawDtModel } from 'src/app/model/inventory/withdrawdt.class';
import * as moment from 'moment';
import { DefaultService } from 'src/app/service/default.service';
import { WithdrawService } from 'src/app/service/withdraw-service/withdraw-service';
import { ModelMasEmployee, ModelMasReason, ModelMasCompanyCar } from 'src/app/model/ModelScaffold';
import { async } from '@angular/core/testing';
import { QuotationService } from 'src/app/service/quotation-service/quotation-service';
import { MasterService } from 'src/app/service/master-service/master.service';
import { ModelCustomerCar } from 'src/app/service/creditsale-service/creditsale-service';
import { ModalLicensePlateComponent } from '../ModalLicensePlate/ModalLicensePlate.component';
import { AuthGuard } from 'src/app/guards/auth-guard.service';



export class ReasonModel {
  ReasonId: string;
  ReasonStatus: string;
  ReasonDesc: string;
  ReasonGroup: string;
}

interface ShowVAT {
  VatType: string;
  VatTypeName: string;
  VatRate: number;
  TaxBase: number;
  VatAmt: number;
}

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.scss']
})
export class WithdrawComponent implements OnInit {

  //==================== Global Variable ====================
  //*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z
  branchList: BranchModel[];
  branchSelect2: valueSelectbox[];
  document: WithdrawHdModel;
  headerCard: string;
  lines: WithdrawDtModel[];
  myGroup: FormGroup;
  productList: ProductModel[] = [];
  productSelectedList: ProductModel[] = [];
  reasonList: ReasonModel[];
  reasonSelect2: valueSelectbox[];
  status = "";
  statusOriginal = "";
  vatGroupList: { [vatGroup: string]: ShowVAT; } = {};
  carLicenseSelect: valueSelectbox[];
  listSelectedProduct: Array<SelectedProduct> = [];

  //==================== URL ====================
  //*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z
  urlInv = this.sharedService.urlInv;
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
  public ArrayEmployee: ModelMasEmployee[] = [];
  public DictEmployee: { [key: string]: string };
  public StrEmployeeName: string = "";
  filterValue: string = null;
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
    private _svWithDraw: WithdrawService,
    private _svQuotation: QuotationService,
    private _svMasterService: MasterService,
    private authGuard: AuthGuard,
  ) {
    this.branchSelect2 = [];
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
    // this.checkSession();
    this.document = new WithdrawHdModel;
    this.document.BrnCode = this.sharedService.brnCode;
    this.document.CompCode = this.sharedService.compCode;
    this.document.CreatedBy = this.sharedService.user;
    this.document.LocCode = this.sharedService.locCode;
    let docGuid = this.route.snapshot.params.DocGuid;
    this.lines = [];

    if (docGuid == "New") {
      this.action = "New";
      this.newDocument();
      this.status = "สร้าง";
      this.statusOriginal = this.status;
    } else {
      this.action = "Edit";
      this.getDocument(docGuid);
    }

    this.getBranch();
    this.getReasons();
    // this.loadEmployee();
    this.myGroup = new FormGroup({
      useBrnCode: new FormControl(),
      useBy: new FormControl(),
      reasonId: new FormControl(),
      remark: new FormControl(),
      empCode: new FormControl(),
      //       currency: new FormControl(),
      //       taxno: new FormControl(),
      //       custname: new FormControl(),
      //       custaddr1: new FormControl(),
      //       custaddr2: new FormControl(),
      searchProduct: new FormControl(),
      //       searchCash: new FormControl(),
    });
  }

  //==================== Function ====================
  private _arrReason: ModelMasReason[] = null;
  private async getReasons() {
    this._arrReason = await this._svWithDraw.GetReasons();
    if (!(Array.isArray(this._arrReason) && this._arrReason.length)) {
      return;
    }
    this.reasonSelect2 = this._arrReason.map(x => <valueSelectbox>{
      KEY: `${x.ReasonId} : ${x.ReasonDesc}`,
      VALUE: x.ReasonId
    });
  }
  addItemtoLine() {
    let lines: Array<WithdrawDtModel> = [];
    let listSelectedProduct: Array<SelectedProduct> = [];
    for (let i = 0; i < this.productSelectedList.length; i++) {
      var productObj = this.lines.find((row, index) => row.PdId == this.productSelectedList[i].PdId && row.UnitId == this.productSelectedList[i].UnitId);
      if (!productObj) {
        let obj = new WithdrawDtModel;
        obj.BrnCode = this.document.BrnCode;
        obj.CompCode = this.document.CompCode;
        obj.DocNo = this.document.DocNo;
        obj.ItemQty = 0;
        obj.LocCode = "";
        obj.LocCode = this.document.LocCode;
        obj.PdId = this.productSelectedList[i].PdId;
        obj.PdName = this.productSelectedList[i].PdName;
        obj.SeqNo = i;
        obj.StockQty = 0;
        obj.UnitBarcode = this.productSelectedList[i].UnitBarcode;
        obj.UnitId = this.productSelectedList[i].UnitId;
        obj.UnitName = this.productSelectedList[i].UnitName;
        obj.GroupId = this.productSelectedList[i].GroupId
        lines.push(obj);
        listSelectedProduct.push(new SelectedProduct(obj.PdId, obj.UnitId));
      } else {
        let obj = new WithdrawDtModel;
        obj.BrnCode = this.document.BrnCode;
        obj.CompCode = this.document.CompCode;
        obj.DocNo = this.document.DocNo;
        obj.ItemQty = productObj.ItemQty;
        obj.LocCode = "";
        obj.LocCode = this.document.LocCode;
        obj.PdId = this.productSelectedList[i].PdId;
        obj.PdName = this.productSelectedList[i].PdName;
        obj.SeqNo = i;
        obj.StockQty = 0;
        obj.UnitBarcode = this.productSelectedList[i].UnitBarcode;
        obj.UnitId = this.productSelectedList[i].UnitId;
        obj.UnitName = this.productSelectedList[i].UnitName;
        lines.push(obj);
        listSelectedProduct.push(new SelectedProduct(obj.PdId, obj.UnitId));
      }
    }

    this.lines = lines;
    this.listSelectedProduct = listSelectedProduct;
    this.calculateDocument();
  }

  approveDocument = () => {
    this.status = "พร้อมใช้";
    this.document.DocStatus = "Ready";
    this.saveDocument();
  };

  calculateDocument = () => {
    // let subTotalHD = 0;
    // let taxBaseHD = 0;
    // let vatAmtHD = 0;
    // let totalHD = 0;

    //Cal SubTotal, SubAmt
    // this.lines.forEach(element => {
    //   element.SubAmt = ((element.UnitPrice * element.ItemQty) - element.DiscAmt);
    //   element.SumItemAmt = (element.UnitPrice * element.ItemQty);
    //   subTotalHD += element.SubAmt;
    // });

    //Cal DiscHdAmt,
    // this.lines.forEach(element => {
    //   if (!element.IsFree) {
    //     element.DiscHdAmt = (element.SubAmt / subTotalHD || 1) * this.document.DiscAmt
    //     let beforeTax = 0;
    //     let taxBase = 0;
    //     let taxAmt = 0;
    //     if (element.VatType == "VE") {
    //       beforeTax = element.SubAmt - element.DiscHdAmt;
    //       taxBase = beforeTax;
    //       taxAmt = ((taxBase * element.VatRate) / 100 || 1);
    //     } else if (element.VatType == "VI") {
    //       beforeTax = element.SubAmt - element.DiscHdAmt;
    //       taxBase = ((beforeTax * 100) / (100 + element.VatRate) || 1);
    //       taxAmt = (((element.SubAmt - element.DiscHdAmt) * element.VatRate) / (100 + element.VatRate) || 1);
    //     } else if (element.VatType == "VN") {
    //       beforeTax = element.SubAmt - element.DiscHdAmt;
    //       taxBase = 0;
    //       taxAmt = 0;
    //     }

    //     element.TaxBaseAmt = taxBase;
    //     element.VatAmt = taxAmt;
    //     element.TotalAmt = beforeTax;
    //   }
    // });

    //Cal NetAmt, VatAmt, TotalAmt
    // this.lines.forEach(element => {
    //   if (!element.IsFree) {
    //     taxBaseHD += element.TaxBaseAmt;
    //     vatAmtHD += element.VatAmt;
    //     totalHD += element.TotalAmt;
    //   }
    // });


    //Cal By Currency
    // this.lines.forEach(element => {
    //   element.SumItemAmtCur = element.SumItemAmt * this.document.CurRate;
    //   element.SubAmtCur = element.SubAmt * this.document.CurRate;
    //   element.DiscAmtCur = element.DiscAmt * this.document.CurRate;
    //   element.DiscHdAmtCur = element.DiscHdAmt * this.document.CurRate;
    //   element.TaxBaseAmtCur = element.TaxBaseAmt * this.document.CurRate;
    //   element.VatAmtCur = element.VatAmt * this.document.CurRate;
    //   element.TotalAmtCur = element.TotalAmt * this.document.CurRate;
    // });

    // this.document.SubAmtCur = this.document.SubAmt * this.document.CurRate;
    // this.document.DiscAmtCur = this.document.DiscAmt * this.document.CurRate;
    // this.document.TotalAmtCur = this.document.TotalAmt * this.document.CurRate;
    // this.document.TaxBaseAmtCur = this.document.TaxBaseAmt * this.document.CurRate;
    // this.document.VatAmtCur = this.document.VatAmt * this.document.CurRate;
    // this.document.NetAmtCur = this.document.NetAmt * this.document.CurRate;

    //Cal VAT By Group
    // this.vatGroupList = {};
    // this.lines.forEach(element => {
    //   if (!element.IsFree) {
    //     let type = "";
    //     if (element.VatType == "VE") {
    //       type = "ExcludeVAT";
    //     } else if (element.VatType == "VI") {
    //       type = "IncludeVAT";
    //     } else if (element.VatType == "VN") {
    //       type = "NoVAT";
    //     }

    //     this.vatGroupList[element.VatRate] = {
    //       VatType: element.VatType,
    //       VatTypeName: type,
    //       VatRate: element.VatRate,
    //       TaxBase: (this.vatGroupList[element.VatRate] == undefined ? 0 : this.vatGroupList[element.VatRate].TaxBase) + element.TaxBaseAmt,
    //       VatAmt: (this.vatGroupList[element.VatRate] == undefined ? 0 : this.vatGroupList[element.VatRate].VatAmt) + element.VatAmt
    //     };
    //   }
    // });

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

    //productObj.SumAmt = ((productObj.ItemQty * productObj.UnitPrice) - productObj.DiscAmt);
    this.calculateDocument();
  };

  // calculateTaxBase = (obj: WithdrawDtModel) => {
  //   let resp = 0;
  //   if (obj.VatType == "VI") {
  //     let tb = (obj.ItemQty * obj.UnitPrice) - obj.DiscAmt;
  //     let vatAmt = (tb * obj.VatRate) / (100 + obj.VatRate)
  //     tb = tb - vatAmt;
  //     resp = tb;
  //   } else if (obj.VatType == "VE") {
  //     resp = (obj.ItemQty * obj.UnitPrice) - obj.DiscAmt
  //   }
  //   return resp;
  // };

  // calculateVatAmt = (obj: WithdrawDtModel) => {
  //   let resp = 0;
  //   if (obj.VatType == "VI") {
  //     let tb = (obj.ItemQty * obj.UnitPrice) - obj.DiscAmt;
  //     resp = (tb * obj.VatRate) / (100 + obj.VatRate)
  //   } else if (obj.VatType == "VE") {
  //     let tb = (obj.ItemQty * obj.UnitPrice) - obj.DiscAmt;
  //     resp = (tb * obj.VatRate) / (100)
  //   }
  //   return resp;
  // };
  public async CancelDocument() {
    await this.SvDefault.DoActionAsync(async () => await this.cancelDocument());
  }
  private async cancelDocument() {
    if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isCancel")) {
      this.SvDefault.ShowPositionRoleMessage("IsCancel");
      return;
    }

    if (!await this.SvDefault.ShowCancelDialogAsync()) {
      return;
    }
    this.status = "ยกเลิก";
    this.document.DocStatus = "Cancel";
    this.saveDocument();
  }
  // cancelDocument = () => {
  //   this.SvDefault.ShowCancelDialog(()=>{
  //     this.status = "ยกเลิก";
  //     this.document.DocStatus = "Cancel";
  //     this.saveDocument();
  //   });
  // };


  changeBranch = () => {
    let brnFrom = this.document.UseBrnCode;
    if (brnFrom == "" || brnFrom == null) {
      this.document.UseBrnCode = this.myGroup.get('useBrnCode').value;
    } else {
      if (this.lines.length > 0) {
        swal.fire({
          allowEscapeKey: false,
          allowOutsideClick: false,
          confirmButtonText: "ตกลง",
          denyButtonText: "ยกเลิก",
          icon: 'info',
          showDenyButton: true,
          title: 'คุณต้องการเปลี่ยนรับโอนสินค้าจากสาขาใช่หรือไม่? <br>เนื่องจากระบบจะล้างข้อมูลสินค้าที่เลือกออกทั้งหมด',
        }).then((result) => {
          if (result.isConfirmed) {
            this.document.UseBrnCode = this.myGroup.get('useBrnCode').value;
            this.lines = [];
            this.productSelectedList = [];
          } else if (result.isDenied) {
            this.myGroup.controls['useBrnCode'].setValue(this.document.UseBrnCode);
          }
        })
      } else {
        this.document.UseBrnCode = this.myGroup.get('useBrnCode').value;
      }
    }
  };

  ChangeReason() {
    this.SvDefault.DoAction(() => this.changeReason());
  }
  changeReason() {
    if (!(Array.isArray(this._arrReason) && this._arrReason.length)) {
      return;
    }
    this.document.ReasonId = (this.myGroup?.get('reasonId')?.value || "").toString().trim();
    if (this.document.ReasonId === "") {
      return;
    }
    let objReason: ModelMasReason = null;
    objReason = this._arrReason.find(x => x.ReasonId === this.document.ReasonId);
    this.document.ReasonDesc = (objReason?.ReasonDesc || "").toString().trim();
    this.lines = [];
    this.productSelectedList = [];
  }

  // changeReason = () => {

  //   let reasonId = this.document.ReasonId;
  //   if(reasonId == "" || reasonId == null){
  //     this.document.ReasonId = this.myGroup.get('reasonId').value;
  //   } else {
  //       if(this.lines.length > 0){
  //         swal.fire({
  //           allowEscapeKey: false,
  //           allowOutsideClick: false,
  //           confirmButtonText: "ตกลง",
  //           denyButtonText: "ยกเลิก",
  //           icon : 'info',
  //           showDenyButton: true,
  //           title: 'คุณต้องการเปลี่ยนรับโอนสินค้าจากสาขาใช่หรือไม่? <br>เนื่องจากระบบจะล้างข้อมูลสินค้าที่เลือกออกทั้งหมด',
  //         }).then((result) => {
  //           if (result.isConfirmed) {
  //             this.document.UseBrnCode = this.myGroup.get('useBrnCode').value;
  //             this.lines = [];
  //             this.productSelectedList = [];
  //           } else if (result.isDenied) {
  //             this.myGroup.controls['useBrnCode'].setValue(this.document.UseBrnCode);
  //           }
  //         })
  //       } else {
  //         this.document.ReasonId = this.myGroup.get('reasonId').value;
  //       }
  //   }
  // };

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
    this.listSelectedProduct = this.listSelectedProduct.filter((row, index) => !(row.PdId == productObj.PdId && row.UnitId == productObj.UnitId));
    this.lines = this.lines.filter((row, index) => index !== indexs);
    this.calculateDocument();
  }

  deleteSelected = (indexs: any): void => {
    var productObj = this.productSelectedList.find((row, index) => index == indexs);
    this.productSelectedList = this.productSelectedList.filter((row, index) => index !== indexs);
    this.listSelectedProduct = this.listSelectedProduct.filter((row, index) => !(row.PdId == productObj.PdId && row.UnitId == productObj.UnitId));
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


  getBranch = (step_id: string = ""): void => {
    var data =
    {
      "compCode": this.document.CompCode || this.sharedService.compCode,
      "brnCode": this.document.BrnCode || this.sharedService.brnCode
    }
    this.httpClient.post(this.urlMas + "/api/Dropdown/GetCostCenters", data)
      .subscribe(
        response => {
          this.branchSelect2 = [];
          this.branchList = [];
          for (let i = 0; i < response["Data"].length; i++) {
            this.branchSelect2.push({
              KEY: response["Data"][i].BrnCode.trim() + " : " + response["Data"][i].BrnName.trim(),
              VALUE: response["Data"][i].BrnCode.trim(),
            });

            //               this.branchList.push({
            //                 Address: response["Data"][i].BrnCode.trim(),
            //                 BrnCode: response["Data"][i].BrnCode.trim(),
            //                 BrnName: response["Data"][i].BrnName.trim(),
            //                 BrnStatus: response["Data"][i].BrnCode.trim(),
            //                 CompCode: response["Data"][i].BrnCode.trim(),
            //                 CreatedBy: response["Data"][i].BrnCode.trim(),
            //                 CreatedDate: response["Data"][i].BrnCode.trim(),
            //                 District: response["Data"][i].BrnCode.trim(),
            //                 Fax: response["Data"][i].BrnCode.trim(),
            //                 Phone: response["Data"][i].BrnCode.trim(),
            //                 Postcode: response["Data"][i].BrnCode.trim(),
            //                 Province: response["Data"][i].BrnCode.trim(),
            //                 SubDistrict: response["Data"][i].BrnCode.trim(),
            //                 UpdatedBy: response["Data"][i].BrnCode.trim(),
            //                 UpdatedDate: response["Data"][i].BrnCode.trim(),
            //               });
          }
        },
        error => {
          console.log("Error", error);
        }
      );
  }

  getDocument(docGuid: string = "") {

    this.httpClient.get(this.urlInv + "/api/Withdraw/GetWithdraw/" + docGuid + "/" + this.sharedService.compCode + "/" + this.sharedService.brnCode + "/" + this.sharedService.locCode)
      .subscribe(
        response => {
          this.SvDefault.CopyObject(response["Data"], this.document);
          if(!this.SvDefault.CheckDocBrnCode(this.document.BrnCode)){
            return;
          }
          this.document.BrnCode = response["Data"].BrnCode;
          this.document.CompCode = response["Data"].CompCode;
          this.document.CreatedBy = response["Data"].CreatedBy;
          this.document.CreatedDate = new Date(response["Data"].CreatedDate);
          this.document.DocDate = new Date(response["Data"].DocDate);
          this.document.DocNo = response["Data"].DocNo;
          this.document.DocPattern = response["Data"].DocPattern;
          this.document.DocStatus = response["Data"].DocStatus;
          this.document.Guid = response["Data"].Guid;
          this.document.LocCode = response["Data"].LocCode;
          this.document.Post = response["Data"].Post;
          this.document.ReasonDesc = response["Data"].ReasonDesc;
          this.document.ReasonId = response["Data"].ReasonId;
          this.myGroup.controls['reasonId'].setValue(this.document.ReasonId);
          this.document.Remark = response["Data"].Remark;
          this.document.RunNumber = response["Data"].RunNumber;
          this.document.UpdatedBy = response["Data"].UpdatedBy;
          this.document.UpdatedDate = new Date(response["Data"].UpdatedDate);
          this.document.UseBrnCode = response["Data"].UseBrnCode;
          this.document.UseBrnName = response["Data"].UseBrnName;
          this.document.EmpCode = response["Data"].EmpCode;
          //this.document.UseBy = response["Data"].UseBy;
          this.document.UpdatedBy = (this.sharedService.user || "").toString().trim();
          this.myGroup.controls['useBrnCode'].setValue(response["Data"].UseBrnCode);
          this.myGroup.controls['useBy'].setValue(response["Data"].UseBy);
          this.myGroup.controls['remark'].setValue(response["Data"].Remark);
          this.myGroup.controls['empCode'].setValue(response["Data"].EmpCode);

          this.lines = [];
          // let pDListID = "";
          let rqList = response["Data"].InvWithdrawDt;

          for (let i = 0; i < rqList.length; i++) {
            let obj = new WithdrawDtModel;
            obj.BrnCode = rqList[i].BrnCode;
            obj.CompCode = rqList[i].CompCode;
            obj.DocNo = this.document.DocNo;
            obj.ItemQty = rqList[i].ItemQty;
            // obj.LicensePlate = rqList[i].LicensePlate;
            obj.LocCode = this.document.LocCode;
            obj.PdId = rqList[i].PdId;
            obj.PdName = rqList[i].PdName;
            obj.SeqNo = rqList[i].SeqNo;
            obj.StockQty = rqList[i].StockQty;
            obj.UnitBarcode = rqList[i].UnitBarcode;
            obj.UnitId = rqList[i].UnitId;
            obj.UnitName = rqList[i].UnitName;
            obj.GroupId = rqList[i].GroupId;
            this.lines.push(obj);

            this.listSelectedProduct.push(new SelectedProduct(obj.PdId, obj.UnitId));

            // pDListID += obj.PdId;
            // if (i == rqList.length - 1) {
            //   pDListID += "";
            // } else {
            //   pDListID += ",";
            // }
          }

          // this.getProductSelectedList(pDListID);
          this.calculateDocument();

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
          // this.headerCard = this.document.DocNo;
          this.headerCard = "บันทึกเบิกใช้ในกิจการ";
          this.statusOriginal = this.status;

          if (this.document.Post === "P") {
            this.status = "ปิดสิ้นวัน";
            this.statusOriginal = this.status;
            this.btnSave = true;
            this.btnCancel = true;
          }

          // this.onEmployeeCodeChange();
          let empCode = response["Data"].EmpCode;
          this.FindByEmployeeId(empCode);
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
      "DocDate": this.SvDefault.GetFormatDate(<any>this.document.DocDate),
      "DocNo": this.document.DocNo,
      "DocType": "Withdraw"
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
  async GetProductList() {
    await this.SvDefault.DoActionAsync(async () => await this.getProductList(), true);
  }

  private async getProductList() {
    // this.productList = [];
    // let arrReasonGroup: ModelMasReasonGroup[] =null;
    // arrReasonGroup = await this._svWithDraw.GetReasonGroups(this.document?.ReasonId);
    // if(!(Array.isArray(arrReasonGroup) && arrReasonGroup.length)){
    //   return;
    // }
    // let arrProduct : ProductModel[]= null;
    // arrProduct = await this._svWithDraw.GetProduct(this.myGroup?.get('searchProduct')?.value);
    // if(!(Array.isArray(arrProduct) && arrProduct.length)){
    //   return;
    // }
    // if(Array.isArray(this.productSelectedList) && this.productSelectedList.length){
    //   arrProduct = arrProduct.filter(x=> !this.productSelectedList.some(y=> y.PdId === x.PdId) );
    // }
    // arrProduct = arrProduct.filter(x=> arrReasonGroup.some(y=> y.GroupId === x.GroupId));
    // this.productList = arrProduct;

    this.productList = [];
    let arrProduct: ProductModel[] = null;
    let filterArrProduct: Array<ProductModel> = [];
    let filterSelectArrProduct: Array<ProductModel> = [];
    arrProduct = await this._svWithDraw.GetProductWithReason(this.document.CompCode, this.document.LocCode, this.document.BrnCode, this.document?.ReasonId, "Withdraw", this.myGroup?.get('searchProduct')?.value);

    if (!(Array.isArray(arrProduct) && arrProduct.length)) {
      return;
    }

    arrProduct.forEach(x => {
      var match = this.listSelectedProduct.find(y => y.PdId == x.PdId && y.UnitId == x.UnitId);
      if (typeof match == "undefined") {
        filterArrProduct.push(x);
      } else {
        filterSelectArrProduct.push(x);
      }
    });

    this.productList = filterArrProduct;
    this.productSelectedList = filterSelectArrProduct;
  }
  /*
    GetProductList() {
      this.productList = [];
      var data =
      {
        "CompCode": this.document.CompCode,
        "LocCode": this.document.LocCode,
        "BrnCode": this.document.BrnCode,
        "Keyword": this.myGroup.get('searchProduct').value,
      }
      this.httpClient.post(this.urlMas + "/api/Product/GetProductList", data)
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
    this.httpClient.post(this.urlMas + "/api/Product/GetProductList", data)
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
    this.httpClient.post(this.urlMas + "/api/Product/GetProductList", data)
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

  // hilightRow(indexs) {
  //   if (indexs == null) {
  //     indexs = this.cashList.findIndex(e => e.DocNo === this.cash.DocNo);
  //   }
  //   if (indexs != null) {
  //     const slides = document.getElementsByClassName('trStyle');
  //     for (let i = 0; i < slides.length; i++) {
  //       const slide = slides[i] as HTMLElement;
  //       if (i == indexs) {
  //         slide.style.backgroundColor = "#9fdb95";
  //       } else {
  //         slide.style.backgroundColor = "#fff";
  //       }
  //     }
  //   }
  // }

  newDocument = (): void => {
    this.document.BrnCode = this.sharedService.brnCode;
    this.document.CompCode = this.sharedService.compCode;
    this.document.CreatedBy = this.sharedService.user;
    this.document.CreatedDate = new Date();

    this.document.DocDate = this.sharedService.systemDate;
    this.document.DocNo = "";
    this.document.DocPattern = "";
    this.document.DocStatus = "New";
    this.document.Guid = "1f8f68b6-e7ff-42f0-8b35-27bb2cc57f93"; //ต้องใส่หลอกไว้ งั้น Model ไม่รองรับ
    this.document.LocCode = this.sharedService.locCode;
    this.document.Post = "N";
    this.document.ReasonDesc = "";
    this.document.ReasonId = "";
    this.document.Remark = "";

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
    this.headerCard = "บันทึกเบิกใช้ในกิจการ";
  }

  printDocument = () => {
    if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isPrint")) {
      this.SvDefault.ShowPositionRoleMessage("IsPrint");
      return;
    }
    this._svWithDraw.PrintDocument(this.document.CompCode, this.document.BrnCode, this.document.DocNo);
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
  private loadDocToData(pHeader: WithdrawHdModel, pData: any): void {
    if (pHeader == null || pData == null) {
      return;
    }
    let arrHeaderKey: string[] = null;
    arrHeaderKey = Object.keys(pHeader);
    let arrDataKey: string[] = null;
    arrDataKey = Object.keys(pData);
    let arrDiffKey: string[] = null;
    arrDiffKey = arrHeaderKey.filter(x => !arrDataKey.includes(x));
    if (!(Array.isArray(arrDiffKey) && arrDiffKey.length)) {
      return;
    }
    for (let i = 0; i < arrDiffKey.length; i++) {
      const strDiffKey = (arrDiffKey[i] || "").toString().trim();
      if (strDiffKey === "") {
        continue;
      }
      pData[strDiffKey] = pHeader[strDiffKey];
    }
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

      // console.clear();
      //  console.log("DocDate: >>>>>>"+this.document.DocDate);
      // console.log("toString: >>>>>>"+this.document.DocDate.toString());
      // console.log("toUTCString: >>>>>>"+this.document.DocDate.toUTCString());
      // console.log("toLocaleString: >>>>>>"+this.document.DocDate.toLocaleString());
      // console.log("toDateString: >>>>>>"+this.document.DocDate.toDateString());
      // console.log("toJSON: >>>>>>"+this.document.DocDate.toJSON());
      //console.log("moment with toDate >>>>>>>"+  moment(this.document.DocDate).toDate());
      // console.log("moment hour  with toDate >>>>>>>"+  moment(this.document.DocDate).add(7,'hour'));
      // console.log("format >>>>>>>"+  moment(this.document.DocDate).format('YYYY-MM-DD'));

      var data =
      {
        "CompCode": this.document.CompCode,
        "BrnCode": this.document.BrnCode,
        "LocCode": this.document.LocCode,
        "DocNo": this.document.DocNo,
        "DocStatus": this.document.DocStatus,
        "DocDate": moment(this.document.DocDate).format('YYYY-MM-DD'),
        "UseBrnCode": this.document.UseBrnCode,
        // "UseBy": this.myGroup.get('useBy').value,
        "ReasonId": this.document.ReasonId,
        "ReasonDesc": this.document.ReasonDesc,
        "Remark": this.myGroup.get('remark').value,
        "Post": this.document.Post,
        "RunNumber": this.document.RunNumber,
        "DocPattern": this.document.DocPattern,
        "Guid": this.document.Guid,
        "CreatedBy": this.document.CreatedBy,
        "UpdatedBy": this.document.UpdatedBy,
        // "LicensePlate": this.myGroup.get('licensePlate').value,

        //     "CreatedDate": moment(this.document.CreatedDate).add(7,'hour'),
        //     "UpdatedDate": this.document.UpdatedDate,
        "InvWithdrawDt": this.lines
      };
      this.loadDocToData(this.document, data);
      const headers = { 'content-type': 'application/json' }
      const body = JSON.stringify(data);
      if (this.document.DocStatus == "New") {
        data.DocStatus = "Active";
        this.httpClient.post(this.urlInv + "/api/Withdraw/CreateWithdraw", data)
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
                  this.routerLink.navigate(['/Withdraw/' + docGuid]);
                });
            },
            error => {
              swal.fire({
                allowEscapeKey: false,
                allowOutsideClick: false,
                title: '<span class="text-danger">เกิดข้อผิดพลาด/</span>',
                text: error.error.messages
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
        this.httpClient.put(this.urlInv + "/api/Withdraw/UpdateWithdraw/" + req.guid, data)
          .subscribe(
            response => {
              swal.fire({
                allowEscapeKey: false,
                allowOutsideClick: false,
                icon: 'success',
                title: 'บันทึกข้อมูลสำเร็จ',
              })
                .then(() => {
                  var docGuid = this.document.Guid;
                  this.getDocument(docGuid);
                  this.routerLink.navigate(['/Withdraw/' + docGuid]);
                });
            },
            error => {
              console.log("Error", error);
              swal.fire({
                allowEscapeKey: false,
                allowOutsideClick: false,
                icon: 'error',
                title: 'มีข้อผิดพลาด',
                text: error,
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
    this.productSelectedList.push(this.productList[indexs]);
    this.productList.splice(indexs, 1);
  }

  // setProductFree = (indexs: any) => {
  //   var productObj = this.lines.find((row, index) => index == indexs);
  //   if (productObj.IsFree) {
  //     productObj.UnitPrice = 0;
  //     productObj.DiscAmt = 0;
  //   } else {
  //     var data =
  //     {
  //       "CompCode": this.document.CompCode,
  //       "BrnCode": this.document.BrnCode,
  //       "LocCode": this.document.LocCode,
  //       "PDListID": productObj.PdId
  //     }
  //     this.httpClient.post(this.urlMas + "/api/Product/GetProductList", data)
  //       .subscribe(
  //         response => {
  //           for (let i = 0; i < response["Data"].length; i++) {
  //             productObj.UnitPrice = response["Data"][i].UnitPrice;
  //           }
  //           this.calculateDocument();
  //         },
  //         error => {
  //           console.log("Error", error);
  //           this.calculateDocument();
  //         }
  //       );
  //   }
  //   this.calculateDocument();
  // };

  private validateData(): boolean {
    let funcShowMessage: (x: string) => boolean = null;
    funcShowMessage = x => {
      let swOption: SweetAlertOptions = {
        title: x,
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'warning'
      }
      swal.fire(swOption);
      return false;
    }

    //check reason to validate licenseplate
    let checkIsValidate = this._arrReason.find(x => { return x.ReasonId == this.document.ReasonId });
    if (checkIsValidate.IsValidate == "Y") {
      this.document.LicensePlate = this.SvDefault.GetString(this.document.LicensePlate);
      if (this.document.LicensePlate === "") {
        return funcShowMessage("กรุณาไส่ทะเบียนรถ");
      }
    }

    this.document.EmpName = this.SvDefault.GetString(this.document.EmpName);
    if (this.document.EmpName === "" || this.document.EmpName === "ไม่พบข้อมูลพนักงาน") {
      return funcShowMessage("รหัสพนักงานไม่ถูกต้อง");
    }
    if (!this.SvDefault.IsArray(this.lines)) {
      return funcShowMessage("กรุณาเลือกสินค้า");
    }
    let strUseBrnCode: string = "";
    strUseBrnCode = this.SvDefault.GetString(this.myGroup.get('useBrnCode').value);
    if (strUseBrnCode === "") {
      return funcShowMessage("กรุณาเลือกสาขา");
    }
    let dtZero = this.lines.find(x => x.ItemQty <= 0);
    if (dtZero != null) {
      return funcShowMessage(`กรุณากรอกปริมาณที่เบิก <br>${dtZero.UnitBarcode} : ${dtZero.PdName}`);
    }
    return true;
  }
  /*
    validateData2 = (): boolean => {
      let pass = false;
      let msg = "";
      let empName = this.document.EmpName;

      if (empName == "ไม่พบข้อมูลพนักงาน" || empName == null || empName == "") {
        pass = false;
        msg = "รหัสพนักงานไม่ถูกต้อง";
      }
      else if (this.lines.length == 0) { //ตรวจสอบการเลือกสินค้า
        pass = false;
        msg = "กรุณาเลือกสินค้า";
      } else {
        let strBrnCode : string = "";
        strBrnCode = this.SvDefault.GetString(this.myGroup.get('useBrnCode').value);
        if(strBrnCode === ""){
          pass = false;
          msg = "กรุณาเลือกสาขา";
        }
        //ตรวจสอบการกรอกจำนวนสินค้า
        else if (this.lines.length > 0) {
          for (var i = 0; i < this.lines.length; i++) {
            if (this.lines[i].ItemQty <= 0) {
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
    */
  private async loadEmployee() {
    this.ArrayEmployee = await this._svQuotation.GetArrayEmployee();
    if (!(Array.isArray(this.ArrayEmployee) && this.ArrayEmployee.length)) {
      return;
    }
    if (this.DictEmployee == null) {
      this.DictEmployee = {};
    }
    for (let i = 0; i < this.ArrayEmployee.length; i++) {
      const emp = this.ArrayEmployee[i];
      if (emp == null) {
        continue;
      }
      let strEmpCode: string = "";
      strEmpCode = (emp.EmpCode || "").toString().trim();
      if (this.DictEmployee.hasOwnProperty(strEmpCode)) {
        continue;
      }
      let strPrefix: string = "";
      strPrefix = (emp.PrefixThai || "").toString().trim();

      let strFirstName: string = "";
      strFirstName = (emp.PersonFnameThai || "").toString().trim();

      let strLastName: string = "";
      strLastName = (emp.PersonLnameThai || "").toString().trim();

      let strEmpName: string = "";
      strEmpName = `${strPrefix} ${strFirstName} ${strLastName}`;
      this.DictEmployee[strEmpCode] = strEmpName;
    }
    this.onEmployeeCodeChange();
  }
  public OnEmployeeCodeChange() {
    this.SvDefault.DoAction(() => this.onEmployeeCodeChange());
  }
  private onEmployeeCodeChange() {
    if (this.DictEmployee == null) {
      this.DictEmployee = {};
    }
    let strEmpCode: string = "";
    // this.document.UseBy
    strEmpCode = (this.document.EmpCode || "").toString().trim();

    if (strEmpCode === "" || !this.DictEmployee.hasOwnProperty(strEmpCode)) {
      this.document.EmpName = "";
    } else {
      this.document.EmpName = this.DictEmployee[strEmpCode];
    }
  }

  public async ShowModalLicensePlate() {
    await this.SvDefault.DoActionAsync(async () => await this.showModalLicensePlate());
  }

  private async showModalLicensePlate() {
    let licensePlates = await this.SvDefault.ShowModalAsync<ModelMasCompanyCar>(ModalLicensePlateComponent, "lg");
    this.document.LicensePlate = licensePlates.LicensePlate;
  }

  public async FindByEmployeeId(value: string) {
    await this.SvDefault.DoActionAsync(async () => await this.findByEmployeeId(value));
  }

  private async findByEmployeeId(value: string) {


    let apiResult = (await this._svMasterService.FindEmployeeById(value));

    if (apiResult) {
      let employee: ModelMasEmployee;
      employee = apiResult.Data;

      if (employee != null) {
        let strEmpName: string = "";
        strEmpName = `${employee.PrefixThai} ${employee.PersonFnameThai} ${employee.PersonLnameThai}`;
        this.document.EmpName = strEmpName;
        this.document.EmpCode = employee.EmpCode;
      }
      else {
        this.document.EmpName = "ไม่พบข้อมูลพนักงาน";
      }
    }
  }
}
