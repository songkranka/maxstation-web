import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { valueSelectbox } from "../../../../shared-model/demoModel"
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../../shared/shared.service';
import swal from 'sweetalert2';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common'
/** Model **/
import { DefaultService } from 'src/app/service/default.service';
import { WithdrawService } from 'src/app/service/withdraw-service/withdraw-service';
import { ModelInvAdjustDt, ModelMasBranch, ModelInvAdjustRequestHd } from 'src/app/model/ModelScaffold';
import { MasterService } from 'src/app/service/master-service/master.service';
import { AdjustService } from 'src/app/service/adjust-service/adjust-service';
import { CsModelAdjustHd } from 'src/app/model/inventory/adjust.interface';
import { SupplyTransferInModalComponent } from '../SupplyTransferInModal/SupplyTransferInModal.component';
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
  selector: 'app-SupplyTransferIn',
  templateUrl: './SupplyTransferIn.component.html',
  styleUrls: ['./SupplyTransferIn.component.scss']
})
export class SupplyTransferInComponent implements OnInit {

  //==================== Global Variable ====================
  //*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z
  document: CsModelAdjustHd;
  headerCard: string = "บันทึกรับโอนวัสดุสิ้นเปลือง";
  reasonList: ReasonModel[];
  reasonSelect2: valueSelectbox[];
  branchSelect2: valueSelectbox[];
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
  btnPrint = true;
  btnReject = true;
  btnSave = true;
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
    private _svMas: MasterService,
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

    this.document = new CsModelAdjustHd;
    this.document.BrnCode = this.sharedService.brnCode;
    this.document.CompCode = this.sharedService.compCode;
    this.document.CreatedBy = this.sharedService.user;
    this.document.LocCode = this.sharedService.locCode;
    this.document.InvAdjustDt = [];
    let docGuid = this.route.snapshot.params.DocGuid;
    this.document.InvAdjustDt = [];

    this.getBranch();

    if (docGuid == "New") {
      this.action = "New";
      this.newDocument();
      this.status = "สร้าง";
      this.statusOriginal = this.status;
    } else {
      this.action = "Edit";
      // this.getDocument(docGuid);
    }

  }

  //==================== Function ====================

  private _arrBranch: ModelMasBranch[] = null;
  private async getBranch() {
    let response = await this._svMas.getBranchList(this.document.CompCode, this.document.LocCode);
    this._arrBranch = response["Data"];
    if (!(Array.isArray(this._arrBranch) && this._arrBranch.length)) {
      return;
    }
    this.branchSelect2 = this._arrBranch.map(x => <valueSelectbox>{
      KEY: `${x.BrnCode} : ${x.BrnName}`,
      VALUE: x.BrnCode
    });
  }

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
    if (!await this.SvDefault.ShowCancelDialogAsync()) {
      return;
    }
    this.status = "ยกเลิก";
    this.document.DocStatus = "Cancel";
    this.saveDocument();
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
        this.document.InvAdjustDt = [];
        this.document.BrnCodeFrom = null;
        this.document.RefNo = null;
        this.document.Remark = null;
      }
    })
  };

  deleteRow = (indexs: any): void => {
    this.document.InvAdjustDt = this.document.InvAdjustDt.filter((row, index) => index !== indexs);
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

    this.httpClient.get(this.urlInv + "/api/Adjust/GetAdjust/" + docGuid)
      .subscribe(
        response => {
          this.SvDefault.CopyObject(response["Data"], this.document);
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
          this.document.Remark = response["Data"].Remark;
          this.document.RunNumber = response["Data"].RunNumber;
          this.document.UpdatedBy = response["Data"].UpdatedBy;
          this.document.UpdatedDate = new Date(response["Data"].UpdatedDate);
          this.document.UpdatedBy = (this.sharedService.user || "").toString().trim();
          this.document.RefNo = response["Data"].RefNo;
          this.document.BrnCodeFrom = response["Data"].BrnCodeFrom;

          this.document.InvAdjustDt = [];
          let rqList = response["Data"].InvAdjustDt;

          for (let i = 0; i < rqList.length; i++) {
            let obj = new ModelInvAdjustDt;
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
            obj.DocType = rqList[i].DocType;
            obj.RefQty = rqList[i].RefQty;
            this.document.InvAdjustDt.push(obj);
          }

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
      "DocType": "Request"
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
    this.document.BrnCodeFrom = null;

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
      this.document.DocDate = this.SvDefault.GetFormatDate(<Date>this.document.DocDate);
      if (this.document.DocStatus == "New") {
        this.document.DocStatus = "Active";
        this.document.DocType = "Adjust";
        this.document.InvAdjustDt.forEach(x => { x.DocType = "Adjust" });
        this.httpClient.post(this.urlInv + "/api/Adjust/CreateAdjust", this.document)
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
                  this.routerLink.navigate(['/Adjust/' + docGuid]);
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
        this.httpClient.put(this.urlInv + "/api/Adjust/UpdateAdjust/" + req.guid, this.document)
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
                  this.routerLink.navigate(['/Adjust/' + docGuid]);
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

  validateData = (): boolean => {
    let pass = true;
    let msg = "";

    // if (this.document.InvAdjustDt.length == 0) { //ตรวจสอบการเลือกสินค้า
    //   pass = false;
    //   msg = "กรุณาเลือกสินค้า";
    // } else {
    //   //ตรวจสอบการกรอกจำนวนสินค้า
    //   if (this.document.InvAdjustDt.length > 0) {
    //     for (var i = 0; i < this.document.InvAdjustDt.length; i++) {
    //       if (this.document.InvAdjustDt[i].ItemQty <= 0) {
    //         pass = false;
    //         msg = "กรุณากรอกจำนวนสินค้า <br>" + this.document.InvAdjustDt[i].PdId + " : " + this.document.InvAdjustDt[i].PdName;
    //         break;
    //       } else {
    //         pass = true;
    //       }
    //     }
    //   }
    // }

    if (this.document.RefNo == null) {
      pass = false;
      msg = "กรุณาเลือกรายการอ้างอิงใบขอปรับปรุง";
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

  public calculateRow(indexs: any) {
    let currentItemChange = this.document.InvAdjustDt.find((row, index) => index == indexs);
    if (currentItemChange.ItemQty > currentItemChange.RefQty) {
      swal.fire({
        title: "ไม่สามารถกรอกจำนวนที่ปรับมากกว่าจำนวนที่ขอปรับปรุงได้",
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'error'
      }).then(() => {
        currentItemChange.ItemQty = 0;
      });
    }
  };

  async showModal() {
    await this.SvDefault.DoActionAsync(async () => await this.ShowModal());
  }

  private async ShowModal() {
    if (this.document.BrnCodeFrom != null) {
      let modalParam = {
        ArrBranch: this._arrBranch,
        compCode: this.document.CompCode,
        brnCode: this.document.BrnCodeFrom,
        locCode: this.document.LocCode
      };
      let modalResponseData = await this.SvDefault.ShowModalAsync<ModelInvAdjustRequestHd>(SupplyTransferInModalComponent, "lg", modalParam);
      if (modalResponseData == null) {
        return;
      }

      let adjustRequestHeader = new ModelInvAdjustRequestHd();
      this.SvDefault.CopyObject(modalResponseData, adjustRequestHeader);

      this.document.RefNo = adjustRequestHeader.DocNo;

      let responseAdjustRequestDt = await this._svAdjust.getAdjustRequestDt(this.document.CompCode, this.document.BrnCode, this.document.LocCode, this.document.RefNo);
      if (responseAdjustRequestDt.isSuccess) {
        responseAdjustRequestDt.items.forEach(x => {
          let classInvAdjustDt = new ModelInvAdjustDt();
          this.SvDefault.CopyObject(x, classInvAdjustDt);
          classInvAdjustDt.RefQty = classInvAdjustDt.ItemQty;
          classInvAdjustDt.ItemQty = 0;
          this.document.InvAdjustDt.push(classInvAdjustDt);

        });
      }
    }
    else {
      swal.fire({
        title: "กรุณาเลือกสาขาก่อน",
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'error'
      });
    }
  }
}
