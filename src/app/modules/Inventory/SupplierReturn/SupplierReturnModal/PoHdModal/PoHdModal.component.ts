import { Component, Input, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { debug } from 'console';
import { ModelInfPoHeader, ModelInvReceiveProdHd } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { PoHeaderListQuery } from 'src/app/modules/Inventory/SupplierReturn/ModelSupplierReturn';
import { SupplierReturnService } from 'src/app/service/supplier-return-service/SupplierReturn.service';

@Component({
  selector: 'app-PoHdModal',
  templateUrl: './PoHdModal.component.html',
  styleUrls: ['./PoHdModal.component.scss']
})
export class PoHdModalComponent implements OnInit {

  constructor(    
    public ActiveModal: NgbActiveModal,
    public SvDefault : DefaultService ,
    public _svSupplierReturn : SupplierReturnService ,
  ) { 

    }
  @Input()public ArrPoHeader : ModelInvReceiveProdHd[] = [];
  public ArrKey : string[] = [];
  public ObjectKeys = Object.keys;
  ngOnInit() {
    this.SvDefault.DoAction(()=>  this.start());
  }
  private start(){
    let qryHeader : PoHeaderListQuery = new PoHeaderListQuery();
    if(!( Array.isArray( this.ArrPoHeader) &&  this.ArrPoHeader.length)){
      return;
      //this.ArrPoHeader = await this._svReceiveGas.GetPoHeaderList(qryHeader);
    }
    if(this.ArrPoHeader.length){
      this.ArrKey = Object.keys(this.ArrPoHeader[0]);
    }
  }
}
