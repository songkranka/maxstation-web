import { ChangeDetectorRef, Component, ElementRef, OnInit, Output , EventEmitter  } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {NgbModal, ModalDismissReasons, NgbModalRef, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { TemplateRef, ViewChild , AfterViewInit } from '@angular/core';
import * as ModelInvoice from '../ModelCreditNote';
import { SharedService } from './../../../../shared/shared.service';
import { from } from 'rxjs';
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
  IsLoading: boolean = false;
  ArrCustomer : ModelInvoice.ModelGetCustomerListOutput[] = [];
  SelectCusCode : string = "";
  @ViewChild('content1') _content: TemplateRef<any>;
  @Output("OnSelectCustomer") OnSelectCustomer : EventEmitter< ModelInvoice.ModelGetCustomerListOutput> = new EventEmitter< ModelInvoice.ModelGetCustomerListOutput>();
  
  constructor(private _modalService: NgbModal , private _httpClient : HttpClient , private _shareService : SharedService ) { 
    this._modalOption = {
      size : 'lg'
    }
  }
  ngAfterViewInit(): void {
    this.SearchCustomer();
  }

  ngOnInit() {
    
  }
  CloseModal() : void{
    if(this._modalRefCustomer != null){
      this._modalRefCustomer.close();
    }
  }
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

  ShowModal() : void{    
    this._modalRefCustomer= this._modalService.open(this._content , this._modalOption);
    this._modalRefCustomer.shown.subscribe(()=> {
      this.GetTextSearchCustomer();
    });
    this._modalRefCustomer.closed.subscribe(()=>{
      this._txtSearchCustomer = null;
    });
    // alert("Test Test");
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


}
