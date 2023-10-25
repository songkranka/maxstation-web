import { Component, Input, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import * as ModelBilling from 'src/app/model/ModelBilling';
import { ModelGetBillingModalItemOutput } from 'src/app/model/ModelBilling';
import { ServiceBilling } from 'src/app/service/billing-service/ServiceBilling.service';
import { DefaultService } from 'src/app/service/default.service';
import Swal from 'sweetalert2';
// import {}
@Component({
  selector: 'app-BillingModalItem',
  templateUrl: './BillingModalItem.component.html',
  styleUrls: ['./BillingModalItem.component.scss']
})
export class BillingModalItemComponent implements OnInit {
  ArrBillingModalItem : ModelBilling.ModelGetBillingModalItemOutput[] = [];
  ArrFilterBilling : ModelBilling.ModelGetBillingModalItemOutput[] = [];
  ArrSelectItem :  ModelBilling.ModelGetBillingModalItemOutput[] = [];
  ArrDisplayColumn : string[] = ["docDate" , "docNo" , "docType" , "brnCode" , "totalAmt"];
  ArrDisplaySelectColumn : string[] = [...this.ArrDisplayColumn , "Delete"];
  IsLoading : boolean = false;
  StrCustomerCode : string = "";
  StrKeyWord : string = "";
  public NumPageIndex : number = 1;
  public NumPageSize : number = 5;
  public NumCollectionSize : number = 10;
  @Input() CustomerCode : string = "";
  @Input() SelectItem : ModelGetBillingModalItemOutput[] = [];
  constructor(
    public _activeModal: NgbActiveModal ,
    private _service : ServiceBilling ,
    public SvDefault : DefaultService
  ) {}

  async ngOnInit() {
    this.IsLoading = true;
    await this.SvDefault.DoActionAsync(async()=> await this.start());
    this.IsLoading = false;
  }
  private async start(){
    if(Array.isArray(this.SelectItem) && this.SelectItem.length){
      this.ArrSelectItem = this.SelectItem;
    }
    await this.searchItemAsync();
  }
  SelectRow(pRow : any){
    let selectItem = <ModelBilling.ModelGetBillingModalItemOutput>pRow;
    if(!this.ArrSelectItem.some(x=> x.DocNo === selectItem.DocNo)){
      this.ArrSelectItem = [... this.ArrSelectItem , selectItem];
      this.ArrBillingModalItem = this.ArrBillingModalItem .filter( x=> x.DocNo !== selectItem.DocNo);
    }
  }
  async SearchItemAsync() : Promise<void>{
    this.IsLoading = true;
    await this.SvDefault.DoActionAsync(async()=> await this.searchItemAsync());
    this.IsLoading = false;
  }

  private getMockUpBilling(){
    let result : ModelBilling.ModelGetBillingModalItemOutput[] = [];
    for (let i = 0; i < 50; i++) {
      let bill = new ModelGetBillingModalItemOutput();
      let d = new Date();
      d.setDate(d.getDate()-i);
      bill.DocDate = d;
      bill.DocNo = "Dog " + i;
      bill.DocType = "Invoice";
      bill.BrnCode = "Brn " + i;
      bill.TotalAmt = i;
      result.push(bill);
    }
    return result;
  }

  private async searchItemAsync() : Promise<void>{
    this.NumPageIndex = 1;
    //let pArrBillingModalItem = await this._service.SearchBillingModalItemAsync(this.CustomerCode);
    let pArrBillingModalItem
      = await this._service.GetTaxInvoice(this.CustomerCode);
      // = this.getMockUpBilling();
    if(Array.isArray(pArrBillingModalItem) && pArrBillingModalItem.length){
      if(this.StrKeyWord !== ""){
        pArrBillingModalItem = pArrBillingModalItem.filter(
          x=> (x.DocNo || "").toString().includes(this.StrKeyWord)
          || (x.DocType || "").toString().includes(this.StrKeyWord)
          || (x.BrnCode || "").toString().includes(this.StrKeyWord)
          || (x.TotalAmt || 0).toFixed(2).includes(this.StrKeyWord)
        );
      }
      // if(Array.isArray(this.ArrSelectItem) && this.ArrSelectItem.length){
      //   pArrBillingModalItem = pArrBillingModalItem.filter( x=> !this.ArrSelectItem.some(y=> y.DocNo === x.DocNo));
      // }
      this.ArrBillingModalItem = pArrBillingModalItem;
      this.ArrFilterBilling = this.paginate(this.ArrBillingModalItem , this.NumPageSize ,this.NumPageIndex);
      this.NumCollectionSize = this.ArrBillingModalItem.length;
    }else{
      this.ArrBillingModalItem = [];
    }
  }


  public async SearchItem(){
    this.IsLoading = true;
    await this.SvDefault.DoActionAsync(async()=>await this.searchItem());
    this.IsLoading = false;
  }
  private async searchItem(){
    let arrTax = await this._service.GetTaxInvoice(this.CustomerCode);
    if(!this.SvDefault.IsArray(arrTax)){
      this.ArrBillingModalItem = [];
      return;
    }
    if(this.SvDefault.IsArray(this.ArrSelectItem)){
      this.ArrBillingModalItem = arrTax.filter( x=> !this.ArrSelectItem.some(y=> y.DocNo === x.DocNo));
    }else{
      this.ArrBillingModalItem = arrTax;
    }
  }

  SaveData(){
    this._activeModal.close(this.ArrSelectItem);
  }
  Unselect(pRow){
    let selectItem = <ModelBilling.ModelGetBillingModalItemOutput>pRow;
    if(!this.ArrBillingModalItem.some(x=> x.DocNo === selectItem.DocNo)){
      this.ArrBillingModalItem = [... this.ArrBillingModalItem , selectItem];
    }
    this.ArrSelectItem = this.ArrSelectItem .filter( x=> x.DocNo !== selectItem.DocNo);
  }

  private paginate(pArrReceiveProd : ModelGetBillingModalItemOutput[], pNumPageSize : number, pNumPageIndex : number) {
    let result = pArrReceiveProd.slice((pNumPageIndex - 1) * pNumPageSize, pNumPageIndex * pNumPageSize);
    return result;
  }
  public OnPageIndexChange(){
    this.SvDefault.DoAction(()=> this.onPageIndexChange());
  }
  private onPageIndexChange(){
    this.ArrFilterBilling = this.paginate(this.ArrBillingModalItem , this.NumPageSize ,this.NumPageIndex);
  }

  public OnPageSizeChange(){
    this.SvDefault.DoAction(()=> this.onPageSizeChange());
  }
  private onPageSizeChange(){
    this.NumPageIndex = 1;
    this.ArrFilterBilling = this.paginate(this.ArrBillingModalItem , this.NumPageSize ,this.NumPageIndex);
  }
}
