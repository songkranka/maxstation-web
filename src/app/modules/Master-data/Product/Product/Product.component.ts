import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { ModelHiddenButton } from 'src/app/model/ModelCommon';
import { ModelMasProduct, ModelMasProductGroup, ModelMasProductUnit, ModelMasUnit } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import Swal from 'sweetalert2';
import { ModelProduct } from '../ModelProduct';
import { ProductService } from '../Product.service';

@Component({
  selector: 'app-Product',
  templateUrl: './Product.component.html',
  styleUrls: ['./Product.component.scss']
})
export class ProductComponent implements OnInit {

  constructor(
    public SvDefault : DefaultService,
    private _svShare : SharedService,
    private _svProduct : ProductService,
    private _route: ActivatedRoute,
    private authGuard: AuthGuard,
  ) { }

  public HiddenButton = new ModelHiddenButton();
  public Product : ModelMasProduct = new ModelMasProduct();
  public ArrProductUnit : ModelMasProductUnit[] = [];
  public ArrProductGroup : ModelMasProductGroup[] = [];
  public ArrUnit : ModelMasUnit[] = [];
  public NumSelectProductUnitIndex : number = 0;
  private authPositionRole : any = null;

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }
  
  async ngOnInit() {
    await this.SvDefault.DoActionAsync(async()=> await this.start() , true);
  }
  private async start(){
    this.authPositionRole = this.SvDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }

    this.ArrProductGroup = await this._svProduct.GetArrProductGroup();
    this.ArrUnit = await this._svProduct.GetAllUnit();
    let strGuid: string = "";
    strGuid = this.SvDefault.GetString(this._route.snapshot.params.DocGuid);
    if (strGuid === "New") {
      this.newData();
    } else {
      let prod = await this._svProduct.GetProduct(strGuid);
      this.displayData(prod);
    }
  }

  private newData(){
    this.NumSelectProductUnitIndex = 0;
    this.Product.PdStatus = "New";
    this.Product.PdType = "Product";
    this.HiddenButton = this.SvDefault.GetHiddenButton2("New", "N");
  }
  public NewData(){
    this.SvDefault.DoAction(()=>this.newData());
  }

  private displayData(param : ModelProduct){
    if(param == null){
      return;
    }
    this.Product = param.Product;
    this.ArrProductUnit = param.ArrProductUnit;

    if( this.SvDefault.IsArray( this.ArrProductUnit)){
      let strUnitId : string;
      strUnitId  = this.SvDefault.GetString(this.Product?.UnitId);
      if(strUnitId !== ""){
        this.NumSelectProductUnitIndex
          = this.ArrProductUnit.findIndex( x=> x.UnitId === strUnitId);
      }
    }
    this.HiddenButton = this.SvDefault.GetHiddenButton2(this.Product.PdStatus, "N");
  }

  private adjustData(){
    let strProductId = "";
    if(this.Product != null){
      let arrExceptCol = ["PdImage" , "VatRate" , "Guid" , "CreatedDate" , "UpdatedDate"];
      for (const key in this.Product) {
        if (arrExceptCol.includes(key) || !Object.prototype.hasOwnProperty.call(this.Product, key)) {
          continue;
        }
        this.Product[key] = this.SvDefault.GetString(this.Product[key]);
      }
      strProductId = this.Product.PdId;
    }
    if(this.SvDefault.IsArray(this.ArrProductUnit)){
      this.ArrProductUnit = this.ArrProductUnit.filter(x=> x!= null);
    }
    if(this.SvDefault.IsArray(this.ArrProductUnit)){
      let arrCarExceptCol = ["PdId" , "UnitRatio" , "UnitStock" , "CreatedDate" , "UpdatedDate"];
      for (let i = 0; i < this.ArrProductUnit.length; i++) {
        let productUnit = this.ArrProductUnit[i];
        productUnit.PdId = strProductId;
        for (const key in productUnit) {
          if (arrCarExceptCol.includes(key) || !Object.prototype.hasOwnProperty.call(productUnit, key)) {
            continue;
          }
          productUnit[key] = this.SvDefault.GetString(productUnit[key]);
        }
      }
    }
  }

  private validateData() : boolean{
    let strProductId = this.SvDefault.GetString(this.Product?.PdId);
    if(strProductId === ""){
      Swal.fire("" , "รหัสสินค้าห้ามมีค่าว่าง" , "warning");
      return false;
    }
    let strCusName : string = "";
    strCusName = this.SvDefault.GetString(this.Product?.PdName);
    if(strCusName === ""){
      Swal.fire("" , "ชื่อสินค้าห้ามมีค่าว่าง" , "warning");
      return false;
    }
    this.ArrProductUnit = this.ArrProductUnit.filter(x=> x.UnitId !== "");
    let isProduct : boolean = false;
    isProduct = this.Product.PdType === "Product"
    if(isProduct){
      if(!this.SvDefault.IsArray(  this.ArrProductUnit)){
        Swal.fire("" , "สินค้าต้องมีหน่วยตัดสต๊อก" , "warning");
        return false;
      }
      let haveUnitStock : boolean = false;
      haveUnitStock = this.NumSelectProductUnitIndex >= 0
        && this.NumSelectProductUnitIndex < this.ArrProductUnit.length
      if(!haveUnitStock){
        Swal.fire("" , "สินค้าต้องมีหน่วยตัดสต๊อก" , "warning");
        return false;
      }
      let isDuplicateUnit : boolean = false;
      isDuplicateUnit = this.ArrProductUnit.some(
        (v,i,a)=> a.filter(x=> x.UnitId === v.UnitId).length > 1
      );
      if(isDuplicateUnit){
        Swal.fire("" , "หน่วยสินค้าซ้ำ" , "warning");
        return false;
      }
    }
    return true;
  }

  private cloneProductData() : ModelProduct{
    let result : ModelProduct = null;
    result = <ModelProduct>{
      Product : this.Product ,
      ArrProductUnit : this.ArrProductUnit
    };
    result = this._svProduct.CloneProduct(result);
    return result;
  }

  public async UpdateStatus(pStrStatus : string){
    await this.SvDefault.DoActionAsync(async()=> await this.updateStatus(pStrStatus),true);
  }

  private async updateStatus(pStrStatus : string){
    pStrStatus = this.SvDefault.GetString(pStrStatus);
    
    if(pStrStatus === "Cancel"){
      if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isCancel")) {
        this.SvDefault.ShowPositionRoleMessage("IsCancel");
        return;
      }
      if(!await this.SvDefault.ShowCancelDialogAsync()){
        return;
      }
    }

    this.adjustData();
    if(!this.validateData()){
      return;
    }
    let prod = new ModelMasProduct();
    this.SvDefault.CopyObject(this.Product , prod);
    prod.PdStatus = pStrStatus;
    prod = await this._svProduct.UpdateStatus(prod);
    if(prod == null){
      return;
    }
    this.Product = prod;
    this.HiddenButton = this.SvDefault.GetHiddenButton2(pStrStatus, "N");
    await this.SvDefault.ShowSaveCompleteDialogAsync();
  }

  public async SaveData(){
    await this.SvDefault.DoActionAsync(async()=> await this.saveData() , true);
  }

  private async saveData(){
    this.adjustData();
    if(!this.validateData()){
      return;
    }
    let product : ModelProduct = null;
    product = this.cloneProductData();
    if(product == null){
      return;
    }
    for (let i = 0; i < product.ArrProductUnit.length; i++) {
      let productUnit : ModelMasProductUnit;
      productUnit = product.ArrProductUnit[i];
      let unit : ModelMasUnit;
      unit = this.ArrUnit.find(x=> x.UnitId == productUnit.UnitId);
      if(unit != null){
        let strUnitName: string;
        strUnitName = this.SvDefault.GetString(unit.UnitName);
        productUnit.UnitName = strUnitName;
      }
    }
    let unitStock : ModelMasProductUnit = null;
    unitStock = product.ArrProductUnit[this.NumSelectProductUnitIndex];
    if(unitStock != null){
      product.Product.UnitId = unitStock.UnitId;
      product.Product.UnitName = unitStock.UnitName;
    }
    if(product.Product.PdStatus === "New"){
      if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isCreate")) {
        this.SvDefault.ShowPositionRoleMessage("IsCreate");
        return;
      }
      let strProductId = this.SvDefault.GetString(product.Product.PdId);
      let isDuplicate = strProductId !== ""
        && await this._svProduct.IsDuplicateProductId(strProductId);
      if(isDuplicate){
        Swal.fire("" , "รหัสสินค้าซ้ำกัน" , "warning");
        return;
      }
      product.Product.PdStatus = "Active";
      product.Product.CreatedBy = this.SvDefault.GetString( this._svShare.user);
      product = await this._svProduct.InsertProduct(product);

    }else{
      if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isEdit")) {
        this.SvDefault.ShowPositionRoleMessage("IsEdit");
        return;
      }
      product.Product.UpdatedBy = this.SvDefault.GetString( this._svShare.user);
      product = await this._svProduct.UpdateProduct(product);
    }
    this.displayData(product);
    await this.SvDefault.ShowSaveCompleteDialogAsync();
  }


  public ShowModalReport(){
    if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isPrint")) {
      this.SvDefault.ShowPositionRoleMessage("IsPrint");
      return;
    }
  }
  public AddProductUnit() : void{
    this.SvDefault.DoAction(()=> this.addProductUnit());
  }
  private addProductUnit() : void{
    if(this.ArrProductUnit == null){
      this.ArrProductUnit = [];
    }
    let haveEmptyUnit : boolean = false;
    haveEmptyUnit = this.ArrProductUnit.some(x=> x.UnitId === "");
    if(haveEmptyUnit){
      return;
    }
    let pu : ModelMasProductUnit;
    pu = new ModelMasProductUnit();
    pu.UnitRatio = 1;
    pu.UnitStock = 1;
    this.ArrProductUnit.push(pu);
  }

  public RemoveProductUnit(pNumIndex : number){
    this.SvDefault.DoAction(()=> this.removeProductUnit(pNumIndex));
  }

  private removeProductUnit(pNumIndex : number){
    if(!this.SvDefault.IsArray(this.ArrProductUnit)){
      return;
    }
    if(pNumIndex < 0 || pNumIndex > this.ArrProductUnit.length){
      return;
    }
    let isProduct : boolean;
    isProduct = this.Product.PdType === "Product";
    if(pNumIndex === this.NumSelectProductUnitIndex && isProduct){
      Swal.fire("ห้ามลบหน่วยตัดสต๊อก","","warning");
      return;
    }else if(pNumIndex < this.NumSelectProductUnitIndex){
      this.NumSelectProductUnitIndex--;
    }
    //this.ArrProductUnit[pNumIndex].
    this.ArrProductUnit.splice(pNumIndex , 1);
  }

}
