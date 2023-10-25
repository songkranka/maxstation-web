import { Component, Input, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModelBranch } from 'src/app/model/ModelCommon';
import { ModelInvReturnSupDt, ModelInvReturnSupHd, ModelMasEmployee, ModelInvReceiveProdDt } from "src/app/model/ModelScaffold";
// import { ModelTransferOutHD } from 'src/app/model/ModelTransferOut';
import { DefaultService } from 'src/app/service/default.service';
import { SupplierReturnService } from 'src/app/service/supplier-return-service/SupplierReturn.service';
import { TransferOutService } from 'src/app/service/transfer-out-service/TransferOut.service';
import { valueSelectbox } from 'src/app/shared-model/demoModel';
import { SharedService } from 'src/app/shared/shared.service';
import { PoHeaderListQuery } from 'src/app/modules/Inventory/SupplierReturn/ModelSupplierReturn';


@Component({
  selector: 'app-SupplierReturnModal',
  templateUrl: './SupplierReturnModal.component.html',
  styleUrls: ['./SupplierReturnModal.component.scss']
})
export class SupplierReturnModalComponent implements OnInit {

  constructor(    
    public ActiveModal: NgbActiveModal,
    public SvDefault : DefaultService ,
    public _svSupplierReturn : SupplierReturnService ,
  ) { 

    }
  @Input()public ArrPoDetail : ModelInvReceiveProdDt[] = [];
  public ArrKey : string[] = [];
  public ObjectKeys = Object.keys;
  ngOnInit() {
    this.SvDefault.DoAction(()=>  this.start());
  }
  private start(){
    // let qryHeader : PoHeaderListQuery = new PoHeaderListQuery();
    if(!( Array.isArray( this.ArrPoDetail) &&  this.ArrPoDetail.length)){
      // this.ArrPoHeader = await this._svSupplierReturn.GetArrayPoItem(qryHeader);
      return;
    }
    if(this.ArrPoDetail.length){
      this.ArrKey = Object.keys(this.ArrPoDetail[0]);
    }
  }
}