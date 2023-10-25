import { Component, Input, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModelMasProduct } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
class ModelProduct extends ModelMasProduct{
  Status : "Show" | "Hide" | "Select" = "Show";
}


@Component({
  selector: 'app-ModalProduct2',
  templateUrl: './ModalProduct2.component.html',
  styleUrls: ['./ModalProduct2.component.scss']
})
export class ModalProduct2Component implements OnInit {
  constructor(
    public ActiveModal: NgbActiveModal ,
    private _svDefault : DefaultService
  ) { }
  @Input() set ArrProduct(pArrProduct : ModelMasProduct){
    if(!Array.isArray(pArrProduct) || !pArrProduct.length){
      return;
    }
    this._arrAllProduct = pArrProduct.map(x=>{
      let pd = new ModelProduct();
      this._svDefault.CopyObject(x , pd);
      pd.Status = "Show";
      return pd;
    });
  }
  @Input() public ArrSelectProduct : ModelProduct[] = [];
  @Input() public CanDuplicate : boolean = false;
  private _arrAllProduct : ModelProduct[] = [];
  public ArrShowProduct : ModelProduct[] = [];
  public StrKeyWord : string = "";
  ngOnInit() {
    this._svDefault.DoAction(()=>  this.start());
  }
  private start(): Promise<void>{
    if(!(Array.isArray(this._arrAllProduct) && this._arrAllProduct.length)){
      return;
    }
    if(this.CanDuplicate){
      this.ArrShowProduct = [... this._arrAllProduct ];
      return;
    }
    let haveSelectProduct = Array.isArray(this.ArrSelectProduct) && this.ArrSelectProduct.length;
    for (let i = 0; i < this._arrAllProduct.length; i++) {
      const pd = this._arrAllProduct[i];
      if(haveSelectProduct && this.ArrSelectProduct.some(x=> x.PdId === pd.PdId )){
        pd.Status = "Select";
      }else{
        pd.Status = "Show";
      }
    }
    this.ArrShowProduct = this._arrAllProduct.filter(x => x.Status === "Show");
    this.ArrSelectProduct = this._arrAllProduct.filter( x=> x.Status === "Select");
  }
  public SearchProduct(){
    this._svDefault.DoAction(()=>this.searchProduct());
  }
  private async searchProduct(){
    let _strSearchCriteria = (this.StrKeyWord || "").toString().trim();
    for (let i = 0; i < this._arrAllProduct.length; i++) {
      let allProductItem = this._arrAllProduct[i];
      if(allProductItem.Status === "Select"){
        continue;
      }
      if(_strSearchCriteria === "" 
      || allProductItem.PdId.includes(_strSearchCriteria) 
      || allProductItem.PdName.includes(_strSearchCriteria)){
        allProductItem.Status = "Show";
      }else{
        allProductItem.Status ="Hide";
      }
    }
    this.ArrShowProduct = this._arrAllProduct.filter(x => x.Status === "Show");
  }
  public SelectProduct(pIntRowIndex : number){
    this._svDefault.DoAction(()=>this.selectProduct(pIntRowIndex));
  }
  private selectProduct(pIntRowIndex : number){
      if(!Array.isArray(this.ArrShowProduct) || !this.ArrShowProduct.length){
        return;
      }
      if(pIntRowIndex < 0 || pIntRowIndex >= this.ArrShowProduct.length){
        return;
      }
      let product = this.ArrShowProduct[pIntRowIndex];
      if(product == null){
        return;
      }
      if(this.CanDuplicate){
        let cloneProduct = new ModelProduct();
        this._svDefault.CopyObject(product , cloneProduct);
        this.ArrSelectProduct.push(cloneProduct);
        return;
      }
      product.Status = "Select";
      this.ArrShowProduct = this._arrAllProduct.filter(x => x.Status === "Show");
      this.ArrSelectProduct = this._arrAllProduct.filter( x=> x.Status === "Select");
  }

  public UnSelectProduct(pProduct : ModelProduct){
    this._svDefault.DoAction(()=>this.unSelectProduct(pProduct));
  }
  public unSelectProduct(pProduct : ModelProduct){
    if(pProduct == null){
      return;
    }
    if(this.CanDuplicate){
      this.ArrSelectProduct = this.ArrSelectProduct.filter(x => x !== pProduct);
      return;
    }
    for (let i = 0; i < this._arrAllProduct.length; i++) {
      const pd = this._arrAllProduct[i];
      if(pd == null){
        continue;
      }
      if(pd.PdId === pProduct.PdId){
        pd.Status = "Show";
        break;
      }
    }
    this.ArrShowProduct = this._arrAllProduct.filter(x => x.Status === "Show");
    this.ArrSelectProduct = this._arrAllProduct.filter( x=> x.Status === "Select");
  }

}
