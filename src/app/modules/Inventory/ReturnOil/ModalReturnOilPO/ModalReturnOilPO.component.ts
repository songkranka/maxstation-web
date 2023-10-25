import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModelInvReceiveProdHd } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';

@Component({
  selector: 'app-ModalReturnOilPO',
  templateUrl: './ModalReturnOilPO.component.html',
  styleUrls: ['./ModalReturnOilPO.component.scss']
})
export class ModalReturnOilPOComponent implements OnInit {
  @Input()public ArrPoHeader : ModelInvReceiveProdHd[] = [];
  public ArrFilterPoHeader : ModelInvReceiveProdHd[] = [];
  private _arrFilterPoHeader2 : ModelInvReceiveProdHd[] =[];
  constructor(
    public ActiveModal: NgbActiveModal,
    private _svDefault : DefaultService,
  ) { }
  public NumPageIndex : number = 1;
  public NumPageSize : number = 10;
  public NumCollectionSize : number = 10;
  public KeyWord : string = "";
  ngOnInit() {
    this._svDefault.DoAction(()=>this.start());
  }
  public start(){
    if(this._svDefault.IsArray(this.ArrPoHeader)){
      this._arrFilterPoHeader2 = this._svDefault.CopyDeep(this.ArrPoHeader);
      this.ArrFilterPoHeader = this.paginate(this.ArrPoHeader , this.NumPageSize ,this.NumPageIndex);
      this.NumCollectionSize = this.ArrPoHeader.length;
    }
  }
  private paginate(pArrReceiveProd : ModelInvReceiveProdHd[], pNumPageSize : number, pNumPageIndex : number) {
    let result = pArrReceiveProd.slice((pNumPageIndex - 1) * pNumPageSize, pNumPageIndex * pNumPageSize);
    return result;
  }
  public OnPageIndexChange(){
    this._svDefault.DoAction(()=> this.onPageIndexChange());
  }
  private onPageIndexChange(){
    this.ArrFilterPoHeader = this.paginate(this.ArrPoHeader , this.NumPageSize ,this.NumPageIndex);
  }

  public OnPageSizeChange(){
    this._svDefault.DoAction(()=> this.onPageSizeChange());
  }
  private onPageSizeChange(){
    this.NumPageIndex = 1;
    this.ArrFilterPoHeader = this.paginate(this.ArrPoHeader , this.NumPageSize ,this.NumPageIndex);
  }
  public FilterData(){
    this._svDefault.DoAction(()=>this.filterData());
  }
  private filterData(){
    this.ArrPoHeader = this._arrFilterPoHeader2.filter(
      x=> this.KeyWord === "" 
      || x.DocNo.indexOf(this.KeyWord) >= 0
      || x.PoNo.indexOf(this.KeyWord) >= 0
      || x.SupCode.indexOf(this.KeyWord) >= 0
      || x.SupName.indexOf(this.KeyWord) >= 0
    );
    this.NumPageIndex = 1;
    this.ArrFilterPoHeader = this.paginate(this.ArrPoHeader , this.NumPageSize ,this.NumPageIndex);
    this.NumCollectionSize = this.ArrPoHeader.length;
    //this.NumCollectionSize = this.ArrFilterPoHeader.length;
  }
}
