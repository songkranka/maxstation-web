import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { async } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import * as ModelCommon from './../../../model/ModelCommon';
import { DefaultService } from './../../../service/default.service';
@Component({
  selector: 'app-ModalProduct',
  templateUrl: './ModalProduct.component.html',
  styleUrls: ['./ModalProduct.component.scss']
})
export class ModalProductComponent implements OnInit, AfterViewInit {
  constructor(
    public ActiveModal: NgbActiveModal,
    private _svDefault: DefaultService
  ) { }

  IsLoading: boolean = false;
  private _txtSearchProduct: HTMLInputElement = null;
  private _strSearchCriteria: string = "";
  private _arrAllProduct: ModelCommon.ModelProduct[] = [];
  ArrShowProduct: ModelCommon.ModelProduct[] = [];
  @Input() ArrSelectProduct: ModelCommon.ModelProduct[] = [];
  // EnumProductStatus = ModelInvoice.EnumProductStatus;

  // ngOnInit() {   
  //   this.IsLoading = true;
  //   this._txtSearchProduct = <HTMLInputElement>document.getElementById("txtSearchProduct");
  //   this._svDefault.GetProduct( pArrProduct =>{
  //     this.IsLoading = false;
  //     this._arrAllProduct = pArrProduct;
  //     this._arrAllProduct.forEach(y => {
  //       y.status = "Show";
  //       y.pdId = (y.pdId || "").toString().trim();
  //       y.pdName = (y.pdName || "").toString().trim(); 
  //     });
  //     this.ArrShowProduct = [...pArrProduct];
  //     this._txtSearchProduct?.focus();
  //   } , pError =>{
  //     this.IsLoading = false;
  //     Swal.fire(pError.message , `<pre>${pError.stack}</pre>` , "error");
  //     this.ActiveModal.dismiss();
  //   });
  // }

  async ngOnInit() {
    this.IsLoading = true;
    await this._svDefault.DoActionAsync(async () => await this.startAsync());
    this.IsLoading = false;
  }
  private async startAsync(): Promise<void> {
    this._txtSearchProduct = <HTMLInputElement>document.getElementById("txtSearchProduct");
    this._arrAllProduct = await this._svDefault.GetProductAsync();
    if (!(Array.isArray(this._arrAllProduct) && this._arrAllProduct.length)) {
      return;
    }
    this._arrAllProduct.forEach(y => {
      y.pdId = (y.pdId || "").toString().trim();
      y.pdName = (y.pdName || "").toString().trim();
      y.status = "Show";
    });
    this.ArrShowProduct = this._arrAllProduct.filter(x => x.status === "Show");
    console.log(this.ArrSelectProduct);
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this._txtSearchProduct.focus();
    }, 500);
  }
  SearchProduct(): void {
    this._txtSearchProduct?.select();
    this._strSearchCriteria = (this._txtSearchProduct?.value).toString().trim();
    for (let i = 0; i < this._arrAllProduct.length; i++) {
      let allProductItem = this._arrAllProduct[i];
      if (allProductItem.status === "Select") {
        continue;
      }
      if (this._strSearchCriteria === "" || allProductItem.pdId.includes(this._strSearchCriteria) || allProductItem.pdName.includes(this._strSearchCriteria)) {
        allProductItem.status = "Show";
      } else {
        allProductItem.status = "Hide";
      }
    }
    this.ArrShowProduct = this._arrAllProduct.filter(x => x.status === "Show");
  }
  SelectProduct(pIntRowIndex: number): void {
    this._txtSearchProduct?.select();
    if (!Array.isArray(this.ArrShowProduct) || !this.ArrShowProduct.length) {
      return;
    }
    if (pIntRowIndex < 0 || pIntRowIndex >= this.ArrShowProduct.length) {
      return;
    }
    let product = this.ArrShowProduct[pIntRowIndex];
    if (product == null) {
      return;
    }
    // for (let i = 0; i < this._arrAllProduct.length; i++) {
    //   let allProductItem = this._arrAllProduct[i];
    //   if(allProductItem == null){
    //     continue;
    //   }
    //   if(allProductItem.pdId === product.pdId){
    //     allProductItem.status = "Select";
    //     break;
    //   };
    // }
    // this._arrAllProduct.find( x=> x.pdId === product.pdId).status = "Select";
    // this.ArrShowProduct = this._arrAllProduct.filter(x => x.status === "Show");
    // this.ArrSelectProduct = this._arrAllProduct.filter( x=> x.status === "Select");
    let lastSeqNo = this.ArrSelectProduct[this.ArrSelectProduct.length - 1];
    if (typeof lastSeqNo != "undefined") {
      product.seqNo = lastSeqNo.seqNo + 1;
    } else {
      product.seqNo = 1;
    }
    this.ArrSelectProduct.push(product);
    console.log(this.ArrSelectProduct);
  }

  UnSelectProduct(pIntRowIndex: number): void {
    this._txtSearchProduct?.select();
    if (!Array.isArray(this.ArrSelectProduct) || !this.ArrSelectProduct.length) {
      return;
    }
    if (pIntRowIndex < 0 || pIntRowIndex >= this.ArrSelectProduct.length) {
      return;
    }
    let product = this.ArrSelectProduct[pIntRowIndex];
    // for (let i = 0; i < this._arrAllProduct.length; i++) {
    //   let allProductItem = this._arrAllProduct[i];
    //   if(allProductItem == null){
    //     continue;
    //   }
    //   if(allProductItem.pdId === product.pdId){
    //     allProductItem.status = "Show";
    //     break;
    //   };
    // }
    // this._arrAllProduct.find( x=> x.pdId === product.pdId).status = "Show";
    // this.ArrShowProduct = this._arrAllProduct.filter(x => x.status === "Show");
    // this.ArrSelectProduct = this._arrAllProduct.filter( x=> x.status === "Select");
    // this.ArrProduct.push(product);    

    let indx = this.ArrSelectProduct.findIndex(v => v.seqNo == product.seqNo);
    this.ArrSelectProduct.splice(indx, indx >= 0 ? 1 : 0);
  }
}
