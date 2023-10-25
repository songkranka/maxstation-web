import { Component, OnInit, Output , EventEmitter } from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbModalRef, NgbModalOptions} from '@ng-bootstrap/ng-bootstrap';
import { TemplateRef, ViewChild , AfterViewInit } from '@angular/core';
import { ServiceInvoice } from './../ServiceInvoice.service';
import * as ModelInvoice from '../ModelInvoice';
import { DefaultService } from 'src/app/service/default.service';
import { promise } from 'selenium-webdriver';
import { async } from '@angular/core/testing';
import { ModelGetProductServiceOutput } from '../ModelInvoice';
// import { EventEmitter } from 'events';
@Component({
  selector: 'app-ProductModal',
  templateUrl: './ProductModal.component.html',
  styleUrls: ['./ProductModal.component.scss']
})

export class ProductModalComponent implements OnInit {
  private _modalRefProduct : NgbModalRef = null;
  private _txtSearchProduct : HTMLInputElement = null;
  private _strSearchCriteria : string = "";
  private _arrAllProduct : ModelInvoice.ModelGetProductServiceOutput[] = [];
  ArrShowProduct : ModelInvoice.ModelGetProductServiceOutput[] = [];
  ArrSelectProduct : ModelInvoice.ModelGetProductServiceOutput[] = [];
  IsLoading : boolean = false;
  EnumProductStatus = ModelInvoice.EnumProductStatus;

  @ViewChild('modalProduct') _modalProduct: TemplateRef<any>;
  constructor(
    private _modalService: NgbModal , 
    private _serviceInvoice : ServiceInvoice ,
    public SvDefault : DefaultService ,
  ) { }
  @Output("OnSelectProduct") _onSelectProduct : EventEmitter<ModelInvoice.ModelGetProductServiceOutput[]> =  new EventEmitter<ModelInvoice.ModelGetProductServiceOutput[]>();
  async ngOnInit() : Promise<void> {
    await this.SvDefault.DoActionAsync(async()=>{
      this.IsLoading = true;
      let arrProduct : ModelGetProductServiceOutput[] = await this._serviceInvoice.GetProductServiceAsync();
      this.IsLoading = false;
      this._arrAllProduct = arrProduct;
      this._arrAllProduct.forEach(y => {
        y.status = ModelInvoice.EnumProductStatus.Show;
        y.pdId = (y.pdId || "").toString().trim();
        y.pdName = (y.pdName || "").toString().trim(); 
      });
      this.ArrShowProduct = [...arrProduct];
    });
  }

  // ngOnInit() {
  //   this.IsLoading = true;
  //   this._serviceInvoice.GetProductService( (pArrProduct)=>{
  //     this.IsLoading = false;
  //     this._arrAllProduct = pArrProduct;
  //     this._arrAllProduct.forEach(y => {
  //       y.status = ModelInvoice.EnumProductStatus.Show;
  //       y.pdId = (y.pdId || "").toString().trim();
  //       y.pdName = (y.pdName || "").toString().trim(); 
  //     });
  //     this.ArrShowProduct = [...pArrProduct];
  //   });    
  // }

  CloseModal() : void{
    this._modalRefProduct?.close();
  }
  SaveData() : void{
    this._onSelectProduct.emit(this.ArrSelectProduct);
    this._modalRefProduct.close();
  }
  ShowModal() : void{
    this._modalRefProduct = this._modalService.open(this._modalProduct , {size: "xl"});
    this._modalRefProduct.shown.subscribe(()=>{
      this._txtSearchProduct = <HTMLInputElement>document.getElementById("txtSearchProduct");
      this._txtSearchProduct.focus();
    });
    this._modalRefProduct.closed.subscribe(()=>{
      this._txtSearchProduct = null;
    });
  }
  SelectProduct(pIntRowIndex : number):void{
    this._txtSearchProduct?.select();
    if(!Array.isArray(this.ArrShowProduct) || !this.ArrShowProduct.length){
      return;
    }
    if(pIntRowIndex < 0 || pIntRowIndex >= this.ArrShowProduct.length){
      return;
    }
    let product : ModelInvoice.ModelGetProductServiceOutput = this.ArrShowProduct[pIntRowIndex];
    if(product == null){
      return;
    }
    for (let i = 0; i < this._arrAllProduct.length; i++) {
      let allProductItem = this._arrAllProduct[i];
      if(allProductItem == null){
        continue;
      }
      if(allProductItem.pdId === product.pdId){
        allProductItem.status = ModelInvoice.EnumProductStatus.Select;
        break;
      };
    }
    this.ArrShowProduct = this._arrAllProduct.filter(x => x.status === ModelInvoice.EnumProductStatus.Show);
    this.ArrSelectProduct = this._arrAllProduct.filter( x=> x.status === ModelInvoice.EnumProductStatus.Select);
  }
  SelectAllProduct():void{
    this._txtSearchProduct?.select();
    for (let i = 0; i < this._arrAllProduct.length; i++) {
      let allProductItem = this._arrAllProduct[i];
      if(allProductItem == null){
        continue;
      }
      if(allProductItem.status === ModelInvoice.EnumProductStatus.Show){
        allProductItem.status = ModelInvoice.EnumProductStatus.Select;
      }
    }
    this.ArrShowProduct = [];
    this.ArrSelectProduct = this._arrAllProduct.filter( x=> x.status === ModelInvoice.EnumProductStatus.Select);
  }
  UnSelectAllProduct():void{
    this._txtSearchProduct?.select();
    for (let i = 0; i < this._arrAllProduct.length; i++) {
      let allProductItem = this._arrAllProduct[i];
      if(allProductItem == null ){
        continue;
      }
      if(allProductItem.status === ModelInvoice.EnumProductStatus.Select){
        allProductItem.status = ModelInvoice.EnumProductStatus.Show;
      }
    }
    this.ArrShowProduct = this._arrAllProduct.filter( x=> x.status === ModelInvoice.EnumProductStatus.Show);
    this.ArrSelectProduct = [];
  }
  UnSelectProduct(pIntRowIndex : number):void{
    this._txtSearchProduct?.select();
    if(!Array.isArray(this.ArrSelectProduct) || !this.ArrSelectProduct.length){
      return;
    }
    if(pIntRowIndex < 0 || pIntRowIndex >= this.ArrSelectProduct.length){
      return;
    }
    let product : ModelInvoice.ModelGetProductServiceOutput = this.ArrSelectProduct[pIntRowIndex];
    for (let i = 0; i < this._arrAllProduct.length; i++) {
      let allProductItem = this._arrAllProduct[i];
      if(allProductItem == null){
        continue;
      }
      if(allProductItem.pdId === product.pdId){
        allProductItem.status = ModelInvoice.EnumProductStatus.Show;
        break;
      };
    }
    this.ArrShowProduct = this._arrAllProduct.filter(x => x.status === ModelInvoice.EnumProductStatus.Show);
    this.ArrSelectProduct = this._arrAllProduct.filter( x=> x.status === ModelInvoice.EnumProductStatus.Select);
    // this.ArrProduct.push(product);    
  }
  SearchProduct() : void{
    this._txtSearchProduct?.select();
    this._strSearchCriteria = (this._txtSearchProduct?.value).toString().trim();
    for (let i = 0; i < this._arrAllProduct.length; i++) {
      let allProductItem = this._arrAllProduct[i];
      if(allProductItem.status === ModelInvoice.EnumProductStatus.Select){
        continue;
      }
      if(this._strSearchCriteria === "" || allProductItem.pdId.includes(this._strSearchCriteria) || allProductItem.pdName.includes(this._strSearchCriteria)){
        allProductItem.status = ModelInvoice.EnumProductStatus.Show;
      }else{
        allProductItem.status = ModelInvoice.EnumProductStatus.Hide;
      }
    }
    this.ArrShowProduct = this._arrAllProduct.filter(x => x.status === ModelInvoice.EnumProductStatus.Show);
  }
}
