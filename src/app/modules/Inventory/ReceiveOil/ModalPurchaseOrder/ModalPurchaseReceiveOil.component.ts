import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PoHeader2 } from 'src/app/model/ModelCommon';
import { DefaultService } from 'src/app/service/default.service';
import { PoHeaderListQuery } from '../ModelReceiveOil';
import { ReceiveOilService } from '../ReceiveOil.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-ModalPurchaseOrder',
  templateUrl: './ModalPurchaseReceiveOil.component.html',
  styleUrls: ['./ModalPurchaseReceiveOil.component.scss']
})
export class ModalPurchaseReceiveOilComponent implements OnInit {

  constructor(
    public ActiveModal: NgbActiveModal,
    public SvDefault: DefaultService,
    public _svReceiveOil: ReceiveOilService,
    private _svShare: SharedService,
  ) {

  }

  private _strUser: string = "";
  private _strBrnCode: string = "";
  private _strCompCode: string = "";
  private _strLocCode: string = "";
  @Input() public ArrPoHeader: PoHeader2[] = [];
  public ArrKey: string[] = [];
  public ObjectKeys = Object.keys;
  async ngOnInit() {
    await this.SvDefault.DoActionAsync(async () => await this.start());
  }
  private async start() {
    this._strBrnCode = (this._svShare.brnCode || "").toString().trim();
    this._strCompCode = (this._svShare.compCode || "").toString().trim();
    this._strLocCode = (this._svShare.locCode || "").toString().trim();
    let qryHeader: PoHeaderListQuery = new PoHeaderListQuery();

    qryHeader.BranchCode = this._strBrnCode;
    qryHeader.CompCode = this._strCompCode;

    if (!(Array.isArray(this.ArrPoHeader) && this.ArrPoHeader.length)) {
      let responses = (await this._svReceiveOil.GetPoHeaderList(qryHeader)).Data;

      this.ArrPoHeader =  responses['InfPoHeaders'];
      return;

    }
    if (this.ArrPoHeader.length) {
      this.ArrKey = Object.keys(this.ArrPoHeader[0]);
    }
  }

  public HaveHeader(){
    return this.SvDefault.IsArray(this.ArrPoHeader);
  }
}
