import { Component, OnInit, HostListener } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { valueSelectbox } from "../../../../shared-model/demoModel"
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../../shared/shared.service';
import swal from 'sweetalert2';
import { DefaultService } from 'src/app/service/default.service';
import { ApproveService } from 'src/app/modules/Master-data/Approve/Approve.service';
import { ModelApproveParam } from 'src/app/modules/Master-data/Approve/ModelApprove';
import { SelectedProduct } from 'src/app/model/inventory/withdrawdt.class';
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

export class DetailModel {
  BrnCode: string;
  CompCode: string;
  DocNo: string;
  ItemQty: number;
  LocCode: string;
  UnitBarcode: string;
  DocTypeId: string;
  PdId: string;
  PdName: string;
  SeqNo: number;
  StockQty: number;
  StockRemain: number;
  UnitId: string;
  UnitName: string;
  UnitRatio: number;
}

export class HeaderModel {
  BrnCode: string;
  BrnCodeFrom: string;
  BrnCodeTo: string;
  BrnNameFrom: string;
  BrnNameTo: string;
  CompCode: string;
  CreatedBy: string;
  CreatedDate: Date;
  DocDate: Date;
  DocNo: string;
  DocStatus: string;
  DocPattern: string;
  Guid: string;
  LocCode: string;
  DocTypeId: string;
  Post: string;
  Remark: string;
  RunNumber: Number;
  UpdatedBy: string;
  UpdatedDate: Date;
}

export class ProductModel {
  CreatedBy: string;
  CreatedDate: Date;
  GroupId: string;
  UnitBarcode: string;
  PdDesc: string;
  PdId: string;
  PdName: string;
  PdStatus: string;
  UnitId: string;
  UnitName: string;
  UpdatedBy: string;
  UpdatedDate: Date;
  VatRate: Number;
  VatType: string;
}

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})

export class RequestComponent implements OnInit {
  private authPositionRole: any;
  //==================== Global Variable ====================
  //*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z
  branchList: BranchModel[];
  branchSelect2: valueSelectbox[];
  document: HeaderModel;
  headerCard: string;
  lines: DetailModel[];
  myGroup: FormGroup;
  docTypeSelect2: valueSelectbox[];
  productList: ProductModel[] = [];
  productSelectedList: ProductModel[] = [];
  listSelectedProduct: Array<SelectedProduct> = [];
  status = "";
  statusOriginal = "";

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
  action: string = "";

  //==================== constructor ====================
  //*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z
  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private routerLink: Router,
    private sharedService: SharedService,
    private SvDefault: DefaultService,
    private _svApprove: ApproveService,
    private authGuard: AuthGuard,
  ) {
    this.branchSelect2 = [];
    this.docTypeSelect2 = [];

  }

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

    this.lines = [];
    this.document = new HeaderModel;
    let docGuid = this.route.snapshot.params.DocGuid;

    if (docGuid == "New") {
      this.status = "สร้าง";
      this.action = "New";
      this.statusOriginal = this.status;
      this.newDocument();
    } else {
      this.action = "Edit";
      this.getDocument(docGuid);
    }

    this.getBranch();
    this.getDocumentType();
    this.branchSelect2;
    this.docTypeSelect2;
    this.myGroup = new FormGroup({
      branchFrom: new FormControl(),
      docType: new FormControl(),
      remarks: new FormControl(),
      searchProduct: new FormControl(),
    });
    this.myGroup.patchValue({
      1: 10,
    });
  }

  //==================== Function ====================
  //*** กรุณาเรียงชื่อฟังก์ชันตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z
  addItemtoLine() {
    let lines: Array<DetailModel> = [];
    let listSelectedProduct: Array<SelectedProduct> = [];
    for (let i = 0; i < this.productSelectedList.length; i++) {
      var productObj = this.lines.find((row, index) => row.PdId == this.productSelectedList[i].PdId && row.UnitId == this.productSelectedList[i].UnitId);
      if (!productObj) {
        //เพิ่มเฉพาะสินค้าที่ยังไม่เคยเลือก
        let obj = new DetailModel;
        obj.BrnCode = this.document.BrnCode;
        obj.CompCode = this.document.CompCode;
        obj.DocNo = this.document.DocNo;
        obj.ItemQty = 0;
        obj.LocCode = this.document.LocCode;
        obj.UnitBarcode = this.productSelectedList[i].UnitBarcode;
        obj.DocTypeId = this.document.DocTypeId;
        obj.PdId = this.productSelectedList[i].PdId;
        obj.PdName = this.productSelectedList[i].PdName;
        obj.SeqNo = i;
        obj.StockQty = 0;
        obj.StockRemain = 0;
        obj.UnitId = this.productSelectedList[i].UnitId;
        obj.UnitName = this.productSelectedList[i].UnitName;
        obj.UnitRatio = 0;
        lines.push(obj);
        listSelectedProduct.push(new SelectedProduct(obj.PdId, obj.UnitId));
      }else{
        let obj = new DetailModel;
        obj.BrnCode = this.document.BrnCode;
        obj.CompCode = this.document.CompCode;
        obj.DocNo = this.document.DocNo;
        obj.ItemQty = productObj.ItemQty;
        obj.LocCode = this.document.LocCode;
        obj.UnitBarcode = this.productSelectedList[i].UnitBarcode;
        obj.DocTypeId = this.document.DocTypeId;
        obj.PdId = this.productSelectedList[i].PdId;
        obj.PdName = this.productSelectedList[i].PdName;
        obj.SeqNo = i;
        obj.StockQty = 0;
        obj.StockRemain = 0;
        obj.UnitId = this.productSelectedList[i].UnitId;
        obj.UnitName = this.productSelectedList[i].UnitName;
        obj.UnitRatio = 0;
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

  changeBranch = () => {
    //this.document.BrnCodeFrom = this.myGroup.get('branchFrom').value;

    let brnFrom = this.document.BrnCodeFrom;
    if (brnFrom == "" || brnFrom == null) {
      this.document.BrnCodeFrom = this.myGroup.get('branchFrom').value;
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
            this.document.BrnCodeFrom = this.myGroup.get('branchFrom').value;
            this.lines = [];
            this.productSelectedList = [];
          } else if (result.isDenied) {
            this.myGroup.controls['branchFrom'].setValue(this.document.BrnCodeFrom);
          }
        })
      } else {
        this.document.BrnCodeFrom = this.myGroup.get('branchFrom').value;
      }
    }
  };

  changeDocType = () => {
    let pdGroup = this.document.DocTypeId;
    if (pdGroup == "" || pdGroup == null) {
      this.document.DocTypeId = this.myGroup.get('docType').value;
    } else {
      if (this.lines.length > 0) {
        swal.fire({
          allowEscapeKey: false,
          allowOutsideClick: false,
          confirmButtonText: "ตกลง",
          denyButtonText: "ยกเลิก",
          icon: 'info',
          showDenyButton: true,
          title: 'คุณต้องการเปลี่ยนกลุ่มสินค้าใช่หรือไม่? <br>เนื่องจากระบบจะล้างข้อมูลสินค้าที่เลือกออกทั้งหมด',
        }).then((result) => {
          if (result.isConfirmed) {
            this.document.DocTypeId = this.myGroup.get('docType').value;
            this.lines = [];
            this.productSelectedList = [];
          } else if (result.isDenied) {
            this.myGroup.controls['docType'].setValue(this.document.DocTypeId);
          }
        })
      } else {
        this.document.DocTypeId = this.myGroup.get('docType').value;
      }
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
          window.location.href = 'https://tws-appgw.pt.co.th/tws/Page/Home.aspx';
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
        this.myGroup.get('docType').setValue(null);
        this.myGroup.controls['remarks'].setValue("");
      } else if (result.isDenied) {
      }
    })
  };

  completeDocument = () => {
    this.status = "พร้อมใช้";
    this.document.DocStatus = "Ready";
    this.saveDocument("ส่งข้อมูลสำเร็จ");
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

  getBranch = (step_id: string = ""): void => {
    var data =
    {
      "CompCode": this.document.CompCode || this.sharedService.compCode,
      "LocCode": this.document.LocCode || this.sharedService.locCode
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

  getDocument(docGuid: string = "") {
    let req = {
      "Guid": docGuid
    }
    this.httpClient.post(this.urlInv + "/api/Request/GetRequest", req)
      .subscribe(
        response => {
          this.document.BrnCode = response["Data"].BrnCode;
          if(!this.SvDefault.CheckDocBrnCode(this.document.BrnCode)){
            return;
          }
          this.document.BrnCodeFrom = response["Data"].BrnCodeFrom;
          this.document.BrnCodeTo = response["Data"].BrnCodeTo;
          this.document.BrnNameFrom = response["Data"].BrnNameFrom;
          this.document.BrnNameTo = response["Data"].BrnNameTo;
          this.document.CompCode = response["Data"].CompCode;
          this.document.CreatedBy = response["Data"].CreatedBy;
          this.document.CreatedDate = response["Data"].CreatedDate;
          this.document.DocDate = response["Data"].DocDate;
          this.document.DocNo = response["Data"].DocNo;
          this.document.DocPattern = response["Data"].DocPattern;
          this.document.DocStatus = response["Data"].DocStatus;
          this.document.Guid = response["Data"].Guid;
          this.document.LocCode = response["Data"].LocCode;
          this.document.DocTypeId = response["Data"].DocTypeId;
          this.document.Post = response["Data"].Post;
          this.document.Remark = response["Data"].Remark;
          this.document.RunNumber = response["Data"].RunNumber;
          this.document.UpdatedBy = response["Data"].UpdatedBy;
          this.document.UpdatedDate = response["Data"].UpdatedDate;

          this.myGroup.controls['branchFrom'].setValue(response["Data"].BrnCodeFrom);
          //this.myGroup.controls['branchFrom'].disable();
          this.myGroup.controls['docType'].setValue(response["Data"].DocTypeId);
          this.myGroup.controls['docType'].disable();
          this.myGroup.controls['remarks'].setValue(response["Data"].Remark);

          this.lines = [];
          // let pDListID = "";
          let rqList = response["Data"].InvRequestDt;
          for (let i = 0; i < rqList.length; i++) {
            let obj = new DetailModel;
            obj.CompCode = rqList[i].CompCode;
            obj.BrnCode = rqList[i].BrnCode;
            obj.DocNo = rqList[i].DocNo;
            obj.ItemQty = rqList[i].ItemQty;
            obj.LocCode = rqList[i].LocCode;
            obj.UnitBarcode = rqList[i].UnitBarcode;
            obj.DocTypeId = rqList[i].DocTypeId;
            obj.PdId = rqList[i].PdId;
            obj.PdName = rqList[i].PdName;
            obj.SeqNo = rqList[i].SeqNo;
            obj.StockQty = rqList[i].StockQty;
            obj.StockRemain = rqList[i].StockRemain;
            obj.UnitId = rqList[i].UnitId;
            obj.UnitName = rqList[i].UnitName;
            obj.UnitRatio = rqList[i].UnitRatio;
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
          this.statusOriginal = this.status;

          //ถ้าวันที่ระบบมากกว่าวันที่เอกสาร แสดงว่ามีการปิดสิ้นวันเเล้ว
          if (this.document.DocDate < this.sharedService.systemDate) {
            this.status = "ปิดสิ้นวัน";
            this.statusOriginal = this.status;
            this.btnSave = true;
          }
        },
        error => {
          console.log("Error", error);
        }
      );
  }

  getDocumentType = (): void => {
    var data =
    {
      "DocType": "Request"
    }
    this.httpClient.post(this.urlMas + "/api/DocumentType/GetDocumentType", data)
      .subscribe(
        response => {
          console.log(response);
          this.docTypeSelect2 = [];
          for (let i = 0; i < response["Data"].length; i++) {
            this.docTypeSelect2.push({
              KEY: response["Data"][i].DocTypeName.trim(),
              VALUE: response["Data"][i].DocTypeId.trim()
            });
          }
        },
        error => {
          console.log("Error", error);
        }
      );
  }

  getPattern = (): void => {
    // console.log("docdate >>>>" + this.document.DocDate);
    // console.log("GetFormatDate >>>>" +  this.SvDefault.GetFormatDate( this.document.DocDate) );

    var req =
    {
      "BrnCode": this.document.BrnCode,
      "CompCode": this.document.CompCode,
      "DocDate": this.SvDefault.GetFormatDate(this.document.DocDate), //this.document.DocDate,
      "DocNo": this.document.DocNo,
      "DocType": "Request",
      "LocCode": this.document.LocCode,
      "DocTypeId": this.document.DocTypeId,
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
    let pdGroup = this.myGroup.get('docType').value;
    if (pdGroup == "" || pdGroup == null) { //ตรวจสอบการเลือกกลุ่มสินค้า
      this.btnGetProduct = "";
      swal.fire({
        title: 'กรุณาเลือกกลุ่มสินค้า',
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'error'
      })
        .then(() => {
        });
    } else {
      this.btnGetProduct = "modal-getProduct";
      this.productList = [];
      var data =
      {
        "BrnCode": this.myGroup.get('branchFrom').value,
        "CompCode": this.document.CompCode,
        "Keyword": this.myGroup.get('searchProduct').value,
        "DocumentTypeID": this.myGroup.get('docType').value,
        "SystemDate": this.sharedService.systemDate
      }
      this.httpClient.post(this.urlMas + "/api/Product/GetProductListWithDocumentType", data)
        .subscribe(
          response => {
            console.log(response);
            let filterArrProduct: Array<ProductModel> = [];
            let filterSelectArrProduct: Array<ProductModel> = [];
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

              var pdSelected = this.listSelectedProduct.find((row, index) => row.PdId == obj.PdId && row.UnitId == obj.UnitId);
              if (typeof pdSelected == "undefined") {
                filterArrProduct.push(obj);
              } else {
                filterSelectArrProduct.push(obj)
              }
            }

            this.productList = filterArrProduct;
            this.productSelectedList = filterSelectArrProduct;
          },
          error => {
            console.log("Error", error);
          }
        );
    }
  }

  getProductSelectedList(pDListID: string = "") {
    var data =
    {
      "BrnCode": this.document.BrnCode,
      "CompCode": this.document.CompCode,
      "LocCode": this.document.LocCode,
      "DocTypeId": this.document.DocTypeId,
      "PDListID": pDListID,
      "SystemDate": this.sharedService.systemDate
    }
    this.httpClient.post(this.urlMas + "/api/Product/GetProductList", data)
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
            this.productSelectedList.push(obj);
          }
        },
        error => {
          console.log("Error", error);
        }
      );
  }

  newDocument = (): void => {
    this.document.BrnCode = this.sharedService.brnCode;
    this.document.BrnCodeFrom = "";
    this.document.BrnCodeTo = this.sharedService.brnCode;
    this.document.BrnNameFrom = "";
    this.document.BrnNameTo = "";
    this.document.CompCode = this.sharedService.compCode;
    this.document.CreatedBy = this.sharedService.user;
    this.document.CreatedDate = new Date();
    this.document.DocDate = this.sharedService.systemDate;
    this.document.DocNo = "";
    this.document.DocStatus = "New";
    this.document.DocPattern = "";
    this.document.Guid = "1f8f68b6-e7ff-42f0-8b35-27bb2cc57f93"; //ต้องใส่หลอกไว้ มิฉะนั้น APIModel ไม่รองรับ
    this.document.LocCode = this.sharedService.locCode;
    this.document.DocTypeId = "";
    this.document.Post = "N";
    this.document.Remark = "";
    this.document.RunNumber = 0;
    this.document.UpdatedBy = this.sharedService.user;
    this.document.UpdatedDate = new Date();

    this.getPattern();

    //Set Hidden Button
    this.btnApprove = true;
    this.btnBack = false;
    this.btnCancel = true;
    this.btnClear = false;
    this.btnComplete = true;
    this.btnPrint = true;
    this.btnReject = true;
    this.btnSave = false;

    //Set HeaderCard
    this.headerCard = "เอกสารร้องขอสินค้า";
  }

  printDocument = () => {
    if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isPrint")) {
      this.SvDefault.ShowPositionRoleMessage("IsPrint");
      return;
    }

    swal.fire({
      allowEscapeKey: false,
      allowOutsideClick: false, //Lock Screen
      icon: 'info',
      title: 'ฟังก์ชันการพิมพ์เอกสาร กำลังอยู่ในขั้นตอนการพัฒนา',
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

  async saveDocument(pStrCompleteMessage?: string) {
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
    
    if (await this.validateData()) {
      let brnFrom = this.branchList.find(e => e.BrnCode === this.myGroup.get('branchFrom').value);
      let brnTo = this.branchList.find(e => e.BrnCode === this.document.BrnCode);
      var data =
      {
        "BrnCode": this.document.BrnCode,
        "BrnCodeFrom": this.myGroup.get('branchFrom').value,
        "BrnCodeTo": this.document.BrnCode,
        "BrnNameFrom": brnFrom.BrnName,
        "BrnNameTo": brnTo.BrnName,
        "CompCode": this.document.CompCode,
        "CreatedBy": this.document.CreatedBy,
        "CreatedDate": this.document.CreatedDate,
        "DocDate": this.document.DocDate,
        "DocNo": this.document.DocNo,
        "DocStatus": this.document.DocStatus,
        "Guid": this.document.Guid,
        "InvRequestDt": this.lines,
        "LocCode": this.document.LocCode,
        "DocTypeId": this.myGroup.get('docType').value,
        "Post": "N",
        "Remark": this.myGroup.get('remarks').value,
        "RunNumber": this.document.RunNumber,
        "DocPattern": this.document.DocPattern,
        "UpdatedBy": this.document.UpdatedBy,
        "UpdatedDate": this.document.UpdatedDate,
      };

      const headers = { 'content-type': 'application/json' }
      const body = JSON.stringify(data);
      if (this.document.DocStatus == "New") {
        data.DocStatus = "Active";
        this.httpClient.post(this.urlInv + "/api/Request/CreateRequest", data)
          .subscribe(
            response => {
              swal.fire({
                allowEscapeKey: false,
                allowOutsideClick: false,
                icon: 'success',
                title: pStrCompleteMessage || 'บันทึกข้อมูลสำเร็จ',
              })
                .then(() => {
                  var docGuid = response["Data"].Guid;
                  this.getDocument(docGuid);
                  this.routerLink.navigate(['/Request/' + docGuid]);
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
      } else if (this.document.DocStatus == "Active"
        || this.document.DocStatus == "Wait"
        || this.document.DocStatus == "Cancel"
        || this.document.DocStatus == "Ready") {
        this.httpClient.put(this.urlInv + "/api/Request/UpdateRequest", data)
          .subscribe(
            response => {
              swal.fire({
                allowEscapeKey: false,
                allowOutsideClick: false,
                icon: 'success',
                title: pStrCompleteMessage || 'แก้ไขข้อมูลสำเร็จ',
              })
                .then(() => {
                  var docGuid = this.document.Guid;
                  this.getDocument(docGuid);
                  this.routerLink.navigate(['/Request/' + docGuid]);
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

  selectedProductList = (indexs: any): void => {
    this.productSelectedList.push(this.productList[indexs]);
    this.productList.splice(indexs, 1);
  }

  async validateData() {
    let pass = false;
    let msg = "";
    let brnFrom = this.myGroup.get('branchFrom').value;
    let pdGroup = this.myGroup.get('docType').value;

    if (brnFrom == "" || brnFrom == null) { //ตรวจสอบการเลือกสาขาโอนจ่าย
      pass = false;
      msg = "กรุณาเลือกสาขาต้นทาง";
    }
    else if (pdGroup == "" || pdGroup == null) { //ตรวจสอบการเลือกกลุ่มสินค้า
      pass = false;
      msg = "กรุณาเลือกกลุ่มสินค้า";
    } else if (this.lines.length == 0) { //ตรวจสอบการเลือกสินค้า
      pass = false;
      msg = "กรุณาเลือกสินค้า";
    } else {
      //ตรวจสอบการกรอกปริมาณสินค้า
      if (this.lines.length > 0) {
        for (var i = 0; i < this.lines.length; i++) {
          if (this.lines[i].ItemQty <= 0) {
            pass = false;
            msg = "กรุณากรอกปริมาณสินค้า " + this.lines[i].PdName + "<br>มากกว่าศูนย์";
            break;
          } else {
            pass = true;
          }
        }
      }
    }
    var paramApprove = new ModelApproveParam();
    paramApprove.BrnCode = this.document.BrnCode;
    paramApprove.CompCode = this.document.CompCode;
    paramApprove.DocNo = this.document.DocNo;
    paramApprove.DocType = "Request";
    paramApprove.LocCode = this.document.LocCode;
    let arrStep = await this._svApprove.ValidateApproveDocument(paramApprove);
    if (this.SvDefault.IsArray(arrStep)) {
      msg = "เอกสารนี้ถูกอนุมัติโดย"
        + arrStep.map(x => "<br/>" + x.EmpName).join("")
        + "<br/>ไม่สามารถบันทึกได้";
      pass = false;
    }
    if (!pass) {
      swal.fire({
        allowEscapeKey: false,
        allowOutsideClick: false, //Lock Screen
        icon: 'error',
        title: msg,
      })
        .then(() => {
        });
    }
    return pass;
  }
}
