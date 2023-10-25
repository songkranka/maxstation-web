import { Component, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { ModelBranch, ModelHiddenButton, ModelMasDocPattern } from 'src/app/model/ModelCommon';
import { ModelTransferInDetail, ModelTransferInHeader } from 'src/app/model/ModelTransferIn';
import { ModelGetRequestDtListQueryResource, ModelRequestHD, ModelTransferOutDT, ModelTransferOutHD } from 'src/app/model/ModelTransferOut';
import { DefaultService } from 'src/app/service/default.service';
import { TransferInService } from 'src/app/service/transfer-in-service/TransferIn.service';
import { SharedService } from 'src/app/shared/shared.service';
import Swal from 'sweetalert2';
import { decodedTextSpanIntersectsWith } from 'typescript';
import { TransferOutModalRequestComponent } from '../../TransferOut/transfer-out-modal-request/transfer-out-modal-request.component';
import { TransferInModalComponent } from '../TransferInModal/TransferInModal.component';

@Component({
  selector: 'app-TransferIn',
  templateUrl: './TransferIn.component.html',
  styleUrls: ['./TransferIn.component.scss']
})
export class TransferInComponent implements OnInit {
  ArrTest = [100, 200, 300, 400];

  constructor(
    public SvDefault: DefaultService,
    private _svShared: SharedService,
    private _svTransferIn: TransferInService,
    private _route: ActivatedRoute,
    private authGuard: AuthGuard,
  ) { }
  DateRequest: Date | string = null;
  ArrBranch: ModelBranch[] = [];
  HiddenButton = new ModelHiddenButton();
  TransferInHeader = new ModelTransferInHeader();
  private authPositionRole: any;
  action: string = "";

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }
  
  async ngOnInit() {
    await this.SvDefault.DoActionAsync(async () => await this.start(), true);
  }

  async CancelDocument(): Promise<void> {
    await this.SvDefault.DoActionAsync(async () => await this.cancelDocument(), true);
  }
  async ClearDocument(): Promise<void> {
    await this.SvDefault.DoActionAsync(async () => await this.clearDocument(), true);
  }
  GetBackgroundRibbon(): string {
    let result = "";
    this.SvDefault.DoAction(() => result = this.SvDefault.GetBackgroundRibbon(this.TransferInHeader?.docStatus || ""));
    return result;
  }
  PrintDocument() {
    if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isPrint")) {
      this.SvDefault.ShowPositionRoleMessage("IsPrint");
      return;
    }
  }
  async SaveDocument() {
    await this.SvDefault.DoActionAsync(async () => await this.saveDocument(), true);
  }
  async ShowModal() {
    await this.SvDefault.DoActionAsync(async () => await this.showModal());
  }
  //-----------------[ Private Function ]-----------------//
  private async cancelDocument(): Promise<void> {
    if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isCancel")) {
      this.SvDefault.ShowPositionRoleMessage("IsCancel");
      return;
    }

    if (await this.SvDefault.ShowCancelDialogAsync()) {
      this.TransferInHeader.docStatus = "Cancel";
      await this.saveDocument();
    }
  }
  private async clearDocument(): Promise<void> {
    if (await this.SvDefault.ShowClearDialogAsync()) {
      await this.start();
    }
  }
  private async loadDocument() {
    // this.TransferInHeader
    this.DateRequest = this.TransferInHeader.refDate;
    this.TransferInHeader.updatedBy = (this._svShared.user || "").toString().trim();
    let arrDetail: ModelTransferInDetail[] = await this._svTransferIn.GetListTransferInDetail(this.TransferInHeader);
    if (Array.isArray(arrDetail) && arrDetail.length) {
      this.TransferInHeader.listTransferInDetail = arrDetail;
    }
    this.HiddenButton = this.SvDefault.GetHiddenButton2(this.TransferInHeader.docStatus, this.TransferInHeader.post);
  }
  private async newDocument() {
    this.TransferInHeader = new ModelTransferInHeader();
    this.DateRequest = null;
    decodedTextSpanIntersectsWith
    this.TransferInHeader.docDate = this._svShared.systemDate;
    this.TransferInHeader.createdBy = (this._svShared.user || "").toString().trim();
    this.TransferInHeader.brnCode = (this._svShared.brnCode || "").toString().trim();
    this.TransferInHeader.compCode = (this._svShared.compCode || "").toString().trim();
    this.TransferInHeader.locCode = (this._svShared.locCode || "").toString().trim();
    this.HiddenButton = this.SvDefault.GetHiddenButton2(this.TransferInHeader.docStatus, this.TransferInHeader.post);
    let arrDocPattern: ModelMasDocPattern[] = await this.SvDefault.GetPatternAsync("TransferIn");
    let strDocPattern = this.SvDefault.GenPatternString(
      this._svShared.systemDate
      , arrDocPattern
      , this._svShared.compCode
      , this._svShared.brnCode
    );
    this.TransferInHeader.docNo = strDocPattern;
    this.TransferInHeader.docPattern = strDocPattern;
    this.TransferInHeader.post = "N";
  }
  private async saveDocument() {
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
    
    if (this.TransferInHeader.docStatus === "New") {
      this.TransferInHeader.docDate = this.SvDefault.GetFormatDate(<Date>this.TransferInHeader.docDate);
      let tranferInResponse = await this._svTransferIn.InsertTransferInAsync(this.TransferInHeader);
      let statusCode = tranferInResponse.StatusCode;
      let message = tranferInResponse.Message;
      let responseData = tranferInResponse.Data;

      if (statusCode == "422") {
        this.SvDefault.ShowWarningDialog(message);
      } else {
        this.SvDefault.CopyObject(responseData , this.TransferInHeader);
        await Swal.fire("บันทึกสำเร็จ", "", "success").then(() => {
          this.loadDocument();
        });
      }
    } else {
      this.TransferInHeader = await this._svTransferIn.UpdateTransferInAsync(this.TransferInHeader);
      await Swal.fire("แก้ไขข้อมูลสำเร็จ", "", "success").then(() => {
        this.loadDocument();
      });
    }
  }
  private async showModal() {
    let modalParam = { ArrBranch: this.ArrBranch };
    let transferOutHeader: ModelTransferOutHD = await this.SvDefault.ShowModalAsync<ModelTransferOutHD>(TransferInModalComponent, "lg", modalParam);
    if (transferOutHeader == null) {
      return;
    }
    this.TransferInHeader.refNo = transferOutHeader.docNo;
    // this.TransferInHeader.brnCodeFrom = transferOutHeader.brnCodeTo;
    // this.TransferInHeader.brnNameFrom = transferOutHeader.brnNameTo;
    let strTransferOutBrnCode: string = "";
    strTransferOutBrnCode = this.SvDefault.GetString(transferOutHeader.brnCode);
    this.TransferInHeader.brnCodeFrom = strTransferOutBrnCode;
    let strBrnNameFrom: string = "";
    if (this.SvDefault.IsArray(this.ArrBranch)) {
      let branchTransferOut: ModelBranch = null;
      branchTransferOut = this.ArrBranch.find(x => x.BrnCode === strTransferOutBrnCode);
      strBrnNameFrom = this.SvDefault.GetString(branchTransferOut?.BrnName);
    }
    this.TransferInHeader.brnNameFrom = strBrnNameFrom;
    this.TransferInHeader.refDate = transferOutHeader.docDate;
    this.DateRequest = transferOutHeader.docDate;
    let arrTransferOutDt: ModelTransferOutDT[] = await this._svTransferIn.GetTransOutDtListAsync(transferOutHeader);
    if (!(Array.isArray(arrTransferOutDt) && arrTransferOutDt.length)) {
      return;
    }
    this.TransferInHeader.listTransferInDetail = arrTransferOutDt.map(x => <ModelTransferInDetail>{
      brnCode: (this._svShared.brnCode || "").toString().trim(),
      compCode: (this._svShared.compCode || "").toString().trim(),
      docNo: this.TransferInHeader.docNo,
      itemQty: x.itemQty || 0,
      locCode: (this._svShared.locCode || "").toString().trim(),
      pdId: x.pdId,
      pdName: x.pdName,
      seqNo: x.seqNo,
      stockQty: x.stockQty,
      unitBarcode: x.unitBarcode,
      unitId: x.unitId,
      unitName: x.unitName,
    });
  }
  private async start() {
    this.authPositionRole = this.SvDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }

    let strGuid: string = "";
    strGuid = (this._route.snapshot.params.DocGuid || "").toString().trim();

    // let modelTransferInHeader: ModelTransferInHeader = <ModelTransferInHeader>history?.state?.data;
    // if (modelTransferInHeader == null) {
    //   await this.newDocument();
    // } else {
    //   this.TransferInHeader = modelTransferInHeader;
    //   await this.loadDocument();
    //   // this.loadDocument(docGuid);
    // }

    if (strGuid === "New") {
      this.action = "New";
      await this.newDocument();
    } else {
      this.action = "Edit";
        // this.TransferInHeader = await this._svTransferIn.GetTranferInHd(strGuid);
        // this.loadDocument();
        this.GetTranferIn(strGuid);
        // 
    }
    this.ArrBranch = await this.SvDefault.GetBranchListAsync(this._svShared.compCode);
  }

  private async GetTranferIn(guid: string)
  {
    let tranferInHdData = await this._svTransferIn.GetTranferInHd(guid);
    this.TransferInHeader.compCode = tranferInHdData.Data['CompCode'];
    this.TransferInHeader.brnCode = tranferInHdData.Data['BrnCode'];
    this.TransferInHeader.locCode = tranferInHdData.Data['LocCode'];
    this.TransferInHeader.docNo = tranferInHdData.Data['DocNo'];
    this.TransferInHeader.docStatus = tranferInHdData.Data['DocStatus'];
    this.TransferInHeader.docDate = tranferInHdData.Data['DocDate'];
    this.TransferInHeader.refNo = tranferInHdData.Data['RefNo'];
    this.TransferInHeader.refDate = tranferInHdData.Data['RefDate'];
    this.TransferInHeader.brnCodeFrom = tranferInHdData.Data['BrnCodeFrom'];
    this.TransferInHeader.brnNameFrom = tranferInHdData.Data['BrnNameFrom'];
    this.TransferInHeader.remark = tranferInHdData.Data['Remark'];
    this.TransferInHeader.post = tranferInHdData.Data['Post'];
    this.TransferInHeader.runNumber = tranferInHdData.Data['RunNumber'];
    this.TransferInHeader.docPattern = tranferInHdData.Data['DocPattern'];
    this.TransferInHeader.guid = tranferInHdData.Data['Guid'];
    this.TransferInHeader.createdDate = tranferInHdData.Data['CreatedDate'];
    this.TransferInHeader.createdBy = tranferInHdData.Data['CreatedBy'];
    this.TransferInHeader.updatedDate = tranferInHdData.Data['UpdatedDate'];
    this.TransferInHeader.updatedBy = tranferInHdData.Data['UpdatedBy'];

    this.loadDocument();
  }
}
