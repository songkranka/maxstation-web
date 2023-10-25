import { Component, Input, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { debug } from 'console';
import * as moment from 'moment';
import { ModelInfPoHeader } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { PoHeaderListQuery } from '../ModelReceiveGas';
import { ReceiveGasService } from '../ReceiveGas.service';
import { PoHeader2 } from 'src/app/model/ModelCommon';

@Component({
  selector: 'app-ModalPurchaseOrder',
  templateUrl: './ModalPurchaseOrder.component.html',
  styleUrls: ['./ModalPurchaseOrder.component.css']
})
export class ModalPurchaseOrderComponent implements OnInit {

  constructor(
    public ActiveModal: NgbActiveModal,
    public SvDefault: DefaultService,
    public _svReceiveGas: ReceiveGasService,
  ) {

  }
  @Input() public ArrPoHeader: PoHeader2[] = [];
  public ArrFilterData: PoHeader2[] = [];
  public ArrKey: string[] = [];
  public ObjectKeys = Object.keys;
  public StrKeyWord: string = "";
  async ngOnInit() {
    await this.SvDefault.DoActionAsync(async () => await this.start());
  }
  private async start() {
    this.ArrFilterData = this.ArrPoHeader;
  }

  public SearchData() {
    this.SvDefault.DoAction(() => this.searchData());
  }

  private searchData() {
    if (!Array.isArray(this.ArrPoHeader) || !this.ArrPoHeader.length) {
      return;
    }
    let strKeyWord: string = "";
    strKeyWord = (this.StrKeyWord || "").toString().trim();
    if (strKeyWord === "") {
      this.ArrFilterData = this.ArrPoHeader;
      return;
    }
    let funcFilter: (x: PoHeader2) => Boolean = null;
    funcFilter = x => {
      let strPoNo: string = "";
      strPoNo = (x.PoNumber || "").toString().trim();
      if (strPoNo !== "" && strPoNo.includes(strKeyWord)) {
        return true;
      }
      let strVendor: string = "";
      strVendor = (x.Vendor || "").toString().trim();
      if (strVendor !== "" && strVendor.includes(strKeyWord)) {
        return true;
      }
      let strPoDate: string = "";
      strPoDate = (moment(x.DocDate).format("DD/MM/yyyy") || "").toString().trim();
      if (strPoDate !== "" && strPoDate.includes(strKeyWord)) {
        return true;
      }
      return false;
    };
    this.ArrFilterData = this.ArrPoHeader.filter(funcFilter);
  }

  public HaveHeader(){
    return this.SvDefault.IsArray(this.ArrPoHeader);
  }

}
