import { Component, Input, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModelBranch } from 'src/app/model/ModelCommon';
import { GetTransOutHdListQueryResource } from 'src/app/model/ModelTransferIn';
import { ModelTransferOutHD } from 'src/app/model/ModelTransferOut';
import { DefaultService } from 'src/app/service/default.service';
import { TransferInService } from 'src/app/service/transfer-in-service/TransferIn.service';
import { TransferOutService } from 'src/app/service/transfer-out-service/TransferOut.service';
import { valueSelectbox } from 'src/app/shared-model/demoModel';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-TransferInModal',
  templateUrl: './TransferInModal.component.html',
  styleUrls: ['./TransferInModal.component.scss']
})
export class TransferInModalComponent implements OnInit {

  constructor(
    public ActiveModal: NgbActiveModal ,
    private _svShare : SharedService ,
    private _svDefault : DefaultService,
    private _svTransferIn : TransferInService,
    private _svTransferOut : TransferOutService
  ) { }
  @Input() ArrBranch :ModelBranch[];
  ArrTransferOutHD : ModelTransferOutHD[] = [];
  IsLoading : boolean = false;
  docTypeSelect2: valueSelectbox[];
  StrDocTypeId : string ="";
  StrKeyWord : string = "";
  SelectTransferOut : ModelTransferOutHD = null;
  // StrSelectDocNo : string = "";
  async ngOnInit() {
    this.IsLoading = true;
    await this._svDefault.DoActionAsync( async()=> await this.start());
    this.IsLoading = false;
  }

  async SearchData(){
    this.IsLoading = true;
    await this._svDefault.DoActionAsync(async()=> {
      this.ArrTransferOutHD = await this.getTransOutHdList(this.StrKeyWord);
    });
    this.IsLoading = false;
  }
  GetBranchName(pStrBranchCode : string) : string{
    let result : string = "";
    this._svDefault.DoAction(()=> result = this.getBranchName(pStrBranchCode));
    return result;
  }

  //-----------------[ Private Method ]------------------//
  private getBranchName(pStrBranchCode : string) : string{
    if(!(Array.isArray(this.ArrBranch) && this.ArrBranch.length)){
      return pStrBranchCode;
    }
    for (let i = 0; i < this.ArrBranch.length; i++) {
      let branch = this.ArrBranch[i];
      if( branch.BrnCode === pStrBranchCode){
        return branch.BrnName;
      }      
    }
    return pStrBranchCode;
  }
  private async getTransOutHdList(pStrKeyword : string) : Promise< ModelTransferOutHD[]>{
    let param = new GetTransOutHdListQueryResource();
    param.brnCodeTo = (this._svShare.brnCode || "").toString().trim();
    param.compCode = (this._svShare.compCode || "").toString().trim();
    param.keyword = (pStrKeyword || "").toString().trim();
    param.sysDate = this._svDefault.GetFormatDate(this._svShare.systemDate);
    let result : ModelTransferOutHD[] = null;
    result = await this._svTransferIn.GetTransOutHdList(param);    
    return result;
  }
  private async start(){
    this.ArrTransferOutHD = await this.getTransOutHdList(this.StrKeyWord);   
  }
}
