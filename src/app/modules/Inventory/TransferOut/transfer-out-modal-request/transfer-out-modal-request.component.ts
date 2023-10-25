import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModelGetRequestHdListQueryResource, ModelRequestHD } from 'src/app/model/ModelTransferOut';
import { DefaultService } from 'src/app/service/default.service';
import { RequestService } from 'src/app/service/request-service/request-service';
import { TransferOutService } from 'src/app/service/transfer-out-service/TransferOut.service';
import { valueSelectbox } from 'src/app/shared-model/demoModel';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-transfer-out-modal-request',
  templateUrl: './transfer-out-modal-request.component.html',
  styleUrls: ['./transfer-out-modal-request.component.scss']
})
export class TransferOutModalRequestComponent implements OnInit {

  constructor(
    public ActiveModal: NgbActiveModal ,
    private _svRequest : RequestService ,
    private _svTransferout : TransferOutService ,
    private _svShare : SharedService ,
    private _svDefault : DefaultService ,
  ) { }
  ArrRequestHeader : ModelRequestHD[] = [];
  docTypeSelect2: valueSelectbox[];
  IsLoading : boolean = false;
  StrDocTypeId : string ="";
  StrKeyWord : string = "";
  StrSelectDocNo : string = "";
  SelectRequestHeader : ModelRequestHD = null;
  ngOnInit() {
    this.IsLoading = true;
    this._svTransferout.GetDocumentType(x=>{
      this.IsLoading =false;
      this.docTypeSelect2 = x;
    }, e=>{
      this.IsLoading = false;
    });
    this.SearchRequest();
  }
  GetDocTypeName(pStrDocTypeCode : string) : string {
    pStrDocTypeCode = (pStrDocTypeCode || "").toString().trim();
    if(pStrDocTypeCode === "" || !Array.isArray(this.docTypeSelect2) || !this.docTypeSelect2.length){
      return "";
    }
    for (let i = 0; i < this.docTypeSelect2.length; i++) {
      let docType = this.docTypeSelect2[i];
      if(docType.VALUE === pStrDocTypeCode){
        return docType.KEY;
      }
    }
    return "";
  }

  SearchRequest(){
    let param = new ModelGetRequestHdListQueryResource();
    param.brnCodeFrom = (this._svShare.brnCode || "").toString().trim();
    param.compCode = (this._svShare.compCode || "").toString().trim();
    param.docTypeId =(this.StrDocTypeId || "").toString().trim();
    param.keyword = (this.StrKeyWord || "").toString().trim();
    param.sysDate = this._svDefault.GetFormatDate(this._svShare.systemDate);
    param.docStatus = "Ready";
    this.IsLoading = true;
    this._svTransferout.GetRequestHdList(param , pArrRequestHeader=>{
      this.ArrRequestHeader = pArrRequestHeader;
      this.IsLoading = false;
    } , e=>{
      this.IsLoading = false;
    });
  }
  SelectRequest(){
    this.ActiveModal.close(this.StrSelectDocNo);

  }

}
