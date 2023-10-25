import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModelInvReceiveProdHd } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import { DeliveryControlService } from '../DeliveryControl.service';
import { ModelParamSearchReceive } from '../ModelDelivery';

@Component({
  selector: 'app-ModalSearchReceive',
  templateUrl: './ModalSearchReceive.component.html',
  styleUrls: ['./ModalSearchReceive.component.scss']
})
export class ModalSearchReceiveComponent implements OnInit {

  constructor(
    public ActiveModal: NgbActiveModal,
    public SvDefault : DefaultService,
    private _svShared : SharedService,
    private _svDelivery : DeliveryControlService,
  ) { }

  public filterValue : string = "";
  dateRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl()
  });
  public ArrReceive : ModelInvReceiveProdHd[] =[];
  async ngOnInit() {
      await this.SvDefault.DoActionAsync(async()=> await this.start() , true);
  }

  private async start(){
    let dateStart = new Date(new Date(this._svShared.systemDate)
      .setDate(new Date(this._svShared.systemDate).getDate() - 7));
    let dateEnd = new Date(this._svShared.systemDate);
    this.dateRange.get('start').setValue(dateStart);
    this.dateRange.get('end').setValue(dateEnd);
    await this.searchData();
  }

  private async searchData(){
    let param = new ModelParamSearchReceive();
    param.ArrPotypeId = [ 'ZOIL','ZSTO'];
    param.BrnCode = this.SvDefault.GetString( this._svShared.brnCode);
    param.CompCode = this.SvDefault.GetString(this._svShared.compCode);
    param.LocCode = this.SvDefault.GetString(this._svShared.locCode);
    param.FromDate = <any>this.SvDefault.GetFormatDate(<any>this.dateRange?.value?.start);
    param.ToDate = <any>this.SvDefault.GetFormatDate(<any>this.dateRange?.value?.end);
    param.Keyword = this.SvDefault.GetString(this.filterValue);
    this.ArrReceive = await this._svDelivery.SearchReceive(param);
  }

  public async SearchData(){
    await this.SvDefault.DoActionAsync(async()=> await this.searchData() , true);
  }

}
