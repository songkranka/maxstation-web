import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup } from '@angular/forms';
import { valueSelectbox } from "../../../../shared-model/demoModel"
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../../shared/shared.service';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common'
/** Model **/
import { ProductModel } from 'src/app/model/master/product.class';
import * as moment from 'moment';
import { DefaultService } from 'src/app/service/default.service';
import { WithdrawService } from 'src/app/service/withdraw-service/withdraw-service';
import { ModelMasReason, ModelInvAdjustRequestDt, ModelInvAdjustRequestHd } from 'src/app/model/ModelScaffold';
import { SelectedProduct } from 'src/app/model/inventory/withdrawdt.class';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { AdjustService } from 'src/app/service/adjust-service/adjust-service';

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
  selector: 'app-AdjustRequest',
  templateUrl: './AdjustRequest.component.html',
  styleUrls: ['./AdjustRequest.component.scss']
})
export class AdjustRequestComponent implements OnInit {
  private authPositionRole: any;
  //==================== Global Variable ====================
  //*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z
  document: ModelInvAdjustRequestHd;
  headerCard: string = "บันทึกร้องขอปรับปรุงสินค้า";
  lines: ModelInvAdjustRequestDt[];
  myGroup: FormGroup;
  productList: ProductModel[] = [];
  productSelectedList: ProductModel[] = [];
  reasonList: ReasonModel[];
  reasonSelect2: valueSelectbox[];
  status = "";
  statusOriginal = "";
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
  filterValue: string = null;
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
    private _svAdjust: AdjustService,
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

    this.document = new ModelInvAdjustRequestHd;
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

    this.getReasons();
    this.myGroup = new FormGroup({
      useBrnCode: new FormControl(),
      useBy: new FormControl(),
      reasonId: new FormControl(),
      remark: new FormControl(),
      searchProduct: new FormControl(),
    });
  }

  //==================== Function ====================
  private _arrReason: ModelMasReason[] = null;
  private async getReasons() {
    this._arrReason = await this._svAdjust.GetReasons();
    if (!(Array.isArray(this._arrReason) && this._arrReason.length)) {
      return;
    }
    this.reasonSelect2 = this._arrReason.map(x => <valueSelectbox>{
      KEY: `${x.ReasonId} : ${x.ReasonDesc}`,
      VALUE: x.ReasonId
    });
  }

  addItemtoLine() {
    let lines: Array<ModelInvAdjustRequestDt> = [];
    let listSelectedProduct: Array<SelectedProduct> = [];
    for (let i = 0; i < this.productSelectedList.length; i++) {
      var productObj = this.lines.find((row, index) => row.PdId == this.productSelectedList[i].PdId && row.UnitId == this.productSelectedList[i].UnitId);
      if (!productObj) {
        let obj = new ModelInvAdjustRequestDt;
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
        lines.push(obj);
        listSelectedProduct.push(new SelectedProduct(obj.PdId, obj.UnitId));
      } else {
        let obj = new ModelInvAdjustRequestDt;
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
  }

  approveDocument = () => {
    this.status = "พร้อมใช้";
    this.document.DocStatus = "Ready";
    this.saveDocument();
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
  };

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
  }

  deleteSelected = (indexs: any): void => {
    var productObj = this.productSelectedList.find((row, index) => index == indexs);
    this.productSelectedList = this.productSelectedList.filter((row, index) => index !== indexs);
    this.listSelectedProduct = this.listSelectedProduct.filter((row, index) => !(row.PdId == productObj.PdId && row.UnitId == productObj.UnitId));
    this.productList.push(productObj);
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

  getDocument(docGuid: string = "") {

    this.httpClient.get(this.urlInv + "/api/AdjustRequest/GetAdjustRequest/" + docGuid)
      .subscribe(
        response => {
          this.SvDefault.CopyObject(response["Data"], this.document);
          this.document.BrnCode = response["Data"].BrnCode;
          if(!this.SvDefault.CheckDocBrnCode(this.document.BrnCode)){
            return;
          }
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
          this.document.UpdatedBy = (this.sharedService.user || "").toString().trim();
          this.myGroup.controls['useBrnCode'].setValue(response["Data"].UseBrnCode);
          this.myGroup.controls['useBy'].setValue(response["Data"].UseBy);
          this.myGroup.controls['remark'].setValue(response["Data"].Remark);

          this.lines = [];
          // let pDListID = "";
          let rqList = response["Data"].InvAdjustRequestDt;

          for (let i = 0; i < rqList.length; i++) {
            let obj = new ModelInvAdjustRequestDt;
            obj.BrnCode = rqList[i].BrnCode;
            obj.CompCode = rqList[i].CompCode;
            obj.DocNo = this.document.DocNo;
            obj.ItemQty = rqList[i].ItemQty;
            obj.LocCode = this.document.LocCode;
            obj.PdId = rqList[i].PdId;
            obj.PdName = rqList[i].PdName;
            obj.SeqNo = rqList[i].SeqNo;
            obj.StockQty = rqList[i].StockQty;
            obj.UnitBarcode = rqList[i].UnitBarcode;
            obj.UnitId = rqList[i].UnitId;
            obj.UnitName = rqList[i].UnitName;
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
            this.btnCancel = true;
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

          this.statusOriginal = this.status;

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
      "LocCode": this.document.LocCode,
      "DocDate": this.SvDefault.GetFormatDate(<any>this.document.DocDate),
      "DocNo": this.document.DocNo,
      "DocType": "AdjustRequest"
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
    this.productList = [];
    let arrProduct: ProductModel[] = null;
    let filterArrProduct: Array<ProductModel> = [];
    let filterSelectArrProduct: Array<ProductModel> = [];
    arrProduct = await this._svWithDraw.GetProductWithReason(this.document.CompCode, this.document.LocCode, this.document.BrnCode, this.document?.ReasonId, "Adjust", this.myGroup?.get('searchProduct')?.value);

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

  private loadDocToData(pHeader: ModelInvAdjustRequestHd, pData: any): void {
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

      var data =
      {
        "CompCode": this.document.CompCode,
        "BrnCode": this.document.BrnCode,
        "LocCode": this.document.LocCode,
        "DocNo": this.document.DocNo,
        "DocStatus": this.document.DocStatus,
        "DocDate": moment(this.document.DocDate).format('YYYY-MM-DD'),
        "ReasonId": this.document.ReasonId,
        "ReasonDesc": this.document.ReasonDesc,
        "Remark": this.myGroup.get('remark').value,
        "Post": this.document.Post,
        "RunNumber": this.document.RunNumber,
        "DocPattern": this.document.DocPattern,
        "Guid": this.document.Guid,
        "CreatedBy": this.document.CreatedBy,
        "UpdatedBy": this.document.UpdatedBy,
        "InvAdjustRequestDt": this.lines
      };
      this.loadDocToData(this.document, data);
      const headers = { 'content-type': 'application/json' }
      const body = JSON.stringify(data);
      if (this.document.DocStatus == "New") {
        data.DocStatus = "Active";
        this.httpClient.post(this.urlInv + "/api/AdjustRequest/CreateAdjustRequest", data)
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
                  this.routerLink.navigate(['/AdjustRequest/' + docGuid]);
                });
            },
            error => {
              swal.fire({
                allowEscapeKey: false,
                allowOutsideClick: false,
                title: '<span class="text-danger">เกิดข้อผิดพลาด</span>',
                text: error.error.message
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
        this.httpClient.put(this.urlInv + "/api/AdjustRequest/UpdateAdjustRequest/" + req.guid, data)
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
                  this.routerLink.navigate(['/AdjustRequest/' + docGuid]);
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

  selectedProductList = (indexs: any): void => {
    this.productSelectedList.push(this.productList[indexs]);
    this.productList.splice(indexs, 1);
  }

  validateData = (): boolean => {
    let pass = false;
    let msg = "";

    if (this.lines.length == 0) { //ตรวจสอบการเลือกสินค้า
      pass = false;
      msg = "กรุณาเลือกสินค้า";
    } else {
      //ตรวจสอบการกรอกจำนวนสินค้า
      if (this.lines.length > 0) {
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
}
