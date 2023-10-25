import { ChangeDetectorRef, Component, ElementRef, OnInit, Output , EventEmitter, Input  } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {NgbModal, ModalDismissReasons, NgbModalRef, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { TemplateRef, ViewChild , AfterViewInit } from '@angular/core';
import * as ModelInvoice from '../ModelInvoice';
import { SharedService } from './../../../shared/shared.service';
import { from } from 'rxjs';
import { ModelGetCustomerListOutput } from '../ModelInvoice';
import { DefaultService } from 'src/app/service/default.service';
import { async } from '@angular/core/testing';
export class CustomerModalOutput{
  Code : string = "";
  FirstName : string = "";
  LastName : string = "";
  Address : string = "";
}

@Component({
  selector: 'app-CustomerModal',
  templateUrl: './CustomerModal.component.html',
  styleUrls: ['./CustomerModal.component.scss']
})
export class CustomerModalComponent implements OnInit , AfterViewInit {
  private _modalOption : NgbModalOptions;
  private _modalRefCustomer : NgbModalRef = null;
  private _txtSearchCustomer : HTMLInputElement = null;
  private _strSearchCriteria : string = "";
  private _strCurrentKeyWord : string = "";
  public NumPageIndex : number = 1;
  public NumPageSize : number = 10;
  public NumCollectionSize : number = 10;
  IsLoading: boolean = false;
  ArrCustomer : ModelInvoice.ModelGetCustomerListOutput[] = [];
  SelectCusCode : string = "";
  @ViewChild('content1') _content: TemplateRef<any>;
  @Output("OnSelectCustomer") OnSelectCustomer : EventEmitter< ModelInvoice.ModelGetCustomerListOutput> = new EventEmitter< ModelInvoice.ModelGetCustomerListOutput>();
  @Input() ParentName : string
  constructor(
    private _modalService: NgbModal , 
    private _httpClient : HttpClient , 
    private _shareService : SharedService ,
    private _svDefault : DefaultService ,
  ) { 
    this._modalOption = {
      size : 'xl'
    }
  }
  async ngAfterViewInit() {
  // await  this._svDefault.DoActionAsync(async()=> await this.searchCustomer() ,true );
   //  this.SearchCustomer();
  }

  ngOnInit() {
    
  }
  CloseModal() : void{
    if(this._modalRefCustomer != null){
      this._modalRefCustomer.close();
    }
  }
  /*
  SearchCustomer() : void{
    this.SelectCusCode = "";
    if(this._httpClient == null){
      return;
    }
    let param :  ModelInvoice.ModelGetCustomerListInput = new  ModelInvoice.ModelGetCustomerListInput();
    param.docDate = new Date();
    param.keyword = (this._txtSearchCustomer?.value || "").toString().trim();  
    this.IsLoading = true;
    let strApiUrl = this._shareService.urlMas + "/api/Customer/GetCustomerList";
    this.ArrCustomer =[];
    this._httpClient.post< ModelInvoice.ModelApiMasterResult< ModelInvoice.ModelGetCustomerListOutput[]>>(strApiUrl ,param ).subscribe(x =>{      
      this.IsLoading = false;
      this.ArrCustomer = x?.Data;
      setTimeout(()=> {
        this._txtSearchCustomer?.focus();
        this._txtSearchCustomer?.select();
      } , 0 );
      // this._txtSearchCustomer?.focus();   
    }, err => {
      console.log(err);      
    });
  }
*/
  public async ShowModal(){    
    await this._svDefault.DoActionAsync(async()=> await this.showModal(),true);

  } 
  private async showModal() {
    this._modalRefCustomer = this._modalService.open(this._content, this._modalOption);
    this._modalRefCustomer.shown.subscribe(() => {
      this.GetTextSearchCustomer();
    });
    this._modalRefCustomer.closed.subscribe(() => {
      this._txtSearchCustomer = null;
    });
    await this.searchCustomer2();
  }

  SelectCustomer(pCustomer : ModelInvoice.ModelGetCustomerListOutput): void{
    this.OnSelectCustomer.emit(pCustomer);
    this._modalRefCustomer.close();
  }

  SelectCustomer2(){
    if(this.SelectCusCode === ""){
      return;
    }
    let selectCustomer = this.ArrCustomer?.find(x=>x.CustCode === this.SelectCusCode);
    if(selectCustomer == null){
      return;
    }
    this.OnSelectCustomer.emit(selectCustomer);
    this._modalRefCustomer.close();
  }

  private GetTextSearchCustomer() : HTMLInputElement{
    if(this._txtSearchCustomer == null){      
      this._txtSearchCustomer = <HTMLInputElement>document.getElementById("txtSearchCustomer");
      this._txtSearchCustomer.value = this._strSearchCriteria;
      // this._txtSearchCustomer.addEventListener("keyup",e=>{
      //   this._strSearchCriteria = (this._txtSearchCustomer.value || "");
      //   if(e.keyCode === 13){          
      //     this.SearchCustomer();          
      //   }
      // });      
    }    
    this._txtSearchCustomer.focus();
    this._txtSearchCustomer.select();
    return this._txtSearchCustomer;
  }
  public async OnPageIndexChange(){
    await this._svDefault.DoActionAsync(async()=> await this.onPageIndexChange(),true);
  }
  private async onPageIndexChange(){
    this._txtSearchCustomer.value = this._strCurrentKeyWord;
    await this.searchCustomer();
  }

  public async OnPageSizeChange(){
    await this._svDefault.DoActionAsync(async()=> await this.onPageSizeChange(),true);
  }
  private async onPageSizeChange(){
    this.NumPageIndex = 1;
    this._txtSearchCustomer.value = this._strCurrentKeyWord;
    await this.searchCustomer();
  }
  public async SearchCustomer(){
    await this._svDefault.DoActionAsync(async()=> await this.searchCustomer2(),true);
  }
  private async searchCustomer2(){
    this.NumPageIndex = 1;
    await this.searchCustomer();
  }
  private async searchCustomer(){
    this.ArrCustomer = [];
    let strKeyWord : string = (this._txtSearchCustomer?.value || "").toString().trim();
    this._strCurrentKeyWord = strKeyWord;
    let data ={
      "Keyword" : strKeyWord,
      "Page": this.NumPageIndex,
      "ItemsPerPage": this.NumPageSize,
      "ParentName" : this._svDefault.GetString(this.ParentName),
    };
    let strUrl = (this._shareService.urlMas || "").toString().trim() + "/api/Customer/GetCustomers";
    let apiResult = <any>await this._httpClient.post(strUrl , data).toPromise();
    if(apiResult == null){
      return null;
    }
    if(!(apiResult.hasOwnProperty("items") && Array.isArray(apiResult.items) && apiResult.items.length)){
      return null;
    }
    let arrItem :any[] = apiResult.items;
    this.ArrCustomer = arrItem.map(x=> {
      let customer = new ModelGetCustomerListOutput();
      this._svDefault.CopyObject(x , customer);
      customer.Phone = this._svDefault.GetString(customer.Phone);
      customer.CustPrefix = this._svDefault.GetString(customer.CustPrefix);
      if(customer.CustPrefix === "."){
        customer.CustPrefix = "";
      }
      return customer;
    });
    // TotalItems
    if(apiResult.hasOwnProperty("totalItems")){
      this.NumCollectionSize = apiResult.totalItems || this.ArrCustomer.length;
    }else{
      this.NumCollectionSize = this.ArrCustomer.length;
    }
  }
  /*
  findAll(keyword: string, page: number, size: number): Observable<CustomerData<Customer>> {
    var data =
    {
      "Keyword" : keyword,
      "Page": page,
      "ItemsPerPage": size
    }
      this.sharedService.urlSale;
      return this.http.post(this.sharedService.urlMas +'/api/Customer/GetCustomers', data).pipe(
      map((cashsaleData: CustomerData<Customer>) => cashsaleData),
      catchError(err => throwError(err))
    )
  }
  */
}

//}
