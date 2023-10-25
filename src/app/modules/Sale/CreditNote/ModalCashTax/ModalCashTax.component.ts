import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModelSalTaxinvoiceHd } from 'src/app/model/ModelScaffold';
import { ServiceCreditNote } from 'src/app/service/creditnote-service/ServiceCreditNote.service';
import { DefaultService } from 'src/app/service/default.service';
import { ModelSearchTaxInvoiceParam } from '../ModelCreditNote';

@Component({
  selector: 'app-ModalCashTax',
  templateUrl: './ModalCashTax.component.html',
  styleUrls: ['./ModalCashTax.component.scss']
})
export class ModalCashTaxComponent implements OnInit {

  constructor(
    public ActiveModal: NgbActiveModal,
    public SvDefault : DefaultService ,
    private _svCreditNote : ServiceCreditNote,
    ) { }
  @Input() ArrTaxInvoice : ModelSalTaxinvoiceHd[] = [];

  @Input() CompCode : string = "";
  @Input() CustCode : string = "";


  ArrFilterTax : ModelSalTaxinvoiceHd[] = [];
  public NumPageIndex : number = 1;
  public NumPageSize : number = 10;
  public NumCollectionSize : number = 10;
  public KeyWord : string = "";
  private _arrFilterTax2 : ModelSalTaxinvoiceHd[] =[];
  ngOnInit() {
    // this.SvDefault.DoAction(()=> this.start());
    this.SvDefault.DoAction(()=> this.searchTaxInvoice());
  }

  private  start(){
    // this.ArrFilterTax = this.ArrTaxInvoice;
    if(this.SvDefault.IsArray(this.ArrTaxInvoice)){
      this._arrFilterTax2 = this.SvDefault.CopyDeep(this.ArrTaxInvoice);
      this.ArrFilterTax = this.paginate(this.ArrTaxInvoice , this.NumPageSize ,this.NumPageIndex);
      this.NumCollectionSize = this.ArrTaxInvoice.length;
    }
  }
  private paginate(pArrReceiveProd : ModelSalTaxinvoiceHd[], pNumPageSize : number, pNumPageIndex : number) {
    let result = pArrReceiveProd.slice((pNumPageIndex - 1) * pNumPageSize, pNumPageIndex * pNumPageSize);
    return result;
  }
  public OnPageIndexChange(){
    this.SvDefault.DoAction(()=> this.onPageIndexChange());
  }
  private onPageIndexChange(){
    this.searchTaxInvoice();
    // this.ArrFilterTax = this.paginate(this.ArrTaxInvoice , this.NumPageSize ,this.NumPageIndex);
  }

  public OnPageSizeChange(){
    this.SvDefault.DoAction(()=> this.onPageSizeChange());
  }
  private onPageSizeChange(){
    this.NumPageIndex = 1;
    this.searchTaxInvoice();
    // this.ArrFilterTax = this.paginate(this.ArrTaxInvoice , this.NumPageSize ,this.NumPageIndex);
  }
  public FilterData(){
    // this.SvDefault.DoAction(()=>this.filterData());
    this.SvDefault.DoAction(()=>this.searchTaxInvoice());
  }
  private filterData(){
    this.ArrTaxInvoice = this._arrFilterTax2.filter(
      x=> this.KeyWord === ""
      || x.DocNo.indexOf(this.KeyWord) >= 0

    );
    this.NumPageIndex = 1;
    this.ArrFilterTax = this.paginate(this.ArrTaxInvoice , this.NumPageSize ,this.NumPageIndex);
    this.NumCollectionSize = this.ArrTaxInvoice.length;
    //this.NumCollectionSize = this.ArrFilterPoHeader.length;
  }

  private async searchTaxInvoice(){
    let param = <ModelSearchTaxInvoiceParam>{
      CompCode : this.CompCode,
      CustCode : this.CustCode,
      DocNo : this.KeyWord,
      Page : this.NumPageIndex,
      ItemsPerPage : this.NumPageSize
    };
    let apiResult = await this._svCreditNote.SearchTaxInvoice(param);
    if(apiResult != null){
      this.NumCollectionSize = apiResult.TotalItem;
      this.ArrFilterTax = apiResult.ArrTaxInvoice;
    }
  }

}
