import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { async } from 'rxjs/internal/scheduler/async';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { ModelHiddenButton, ModelProduct } from 'src/app/model/ModelCommon';
import { ModelMasSupplier, ModelMasSupplierProduct } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import Swal from 'sweetalert2';
import { ModelSupplier } from '../ModelSupplier';
import { SupplierService } from '../Supplier.service';

@Component({
  selector: 'app-Supplier',
  templateUrl: './Supplier.component.html',
  styleUrls: ['./Supplier.component.scss']
})
export class SupplierComponent implements OnInit {

  constructor(
    public SvDefault : DefaultService,
    private _svShare : SharedService,
    private _svSupplier : SupplierService,
    private _route: ActivatedRoute,
    private authGuard: AuthGuard,
  ) { }
  public HiddenButton = new ModelHiddenButton();
  public Supplier : ModelMasSupplier = new ModelMasSupplier();
  public ArrSupplierProduct : ModelMasSupplierProduct[] = [];
  private authPositionRole : any = null;
  async ngOnInit() {
    await this.SvDefault.DoActionAsync(async()=> await this.start() , true);
  }
  private async start(){
    this.authPositionRole = this.SvDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }

    let strGuid: string = "";
    strGuid = this.SvDefault.GetString(this._route.snapshot.params.DocGuid);
    if (strGuid === "New") {
      this.newData();
    } else {
      let prod = await this._svSupplier.GetSupplier(strGuid);
      this.displayData(prod);
    }
  }

  private newData(){
    this.Supplier.SupStatus = "New";
    this.HiddenButton = this.SvDefault.GetHiddenButton2("New", "N");
  }
  public NewData(){
    this.SvDefault.DoAction(()=>this.newData());
  }

  private displayData(param : ModelSupplier){
    if(param == null){
      return;
    }
    this.Supplier = param.Supplier;
    this.ArrSupplierProduct = param.ArrSupProduct;

    this.HiddenButton = this.SvDefault.GetHiddenButton2(this.Supplier.SupStatus, "N");
  }

  private adjustData(){
    let strSupplierCode = "";
    if(this.Supplier != null){
      let arrExceptCol = ["CreditTerm" , "Guid" , "CreatedDate" , "UpdatedDate"];
      for (const key in this.Supplier) {
        if (arrExceptCol.includes(key) || !Object.prototype.hasOwnProperty.call(this.Supplier, key)) {
          continue;
        }
        this.Supplier[key] = this.SvDefault.GetString(this.Supplier[key]);
      }
      strSupplierCode = this.Supplier.SupCode;
    }
    if(this.SvDefault.IsArray(this.ArrSupplierProduct)){
      this.ArrSupplierProduct = this.ArrSupplierProduct.filter(x=> x!= null);
    }
    if(this.SvDefault.IsArray(this.ArrSupplierProduct)){

      let arrSupProdExceptCol = ["UnitPack" , "UnitPrice" , "UnitCost"];
      for (let i = 0; i < this.ArrSupplierProduct.length; i++) {
        let supProd = this.ArrSupplierProduct[i];
        supProd.SupCode = strSupplierCode;
        for (const key in supProd) {
          if (arrSupProdExceptCol.includes(key) || !Object.prototype.hasOwnProperty.call(supProd, key)) {
            continue;
          }
          supProd[key] = this.SvDefault.GetString(supProd[key]);
        }
      }
    }
  }

  private validateData() : boolean{
    let strSupCode = this.SvDefault.GetString(this.Supplier?.SupCode);
    if(strSupCode === ""){
      Swal.fire("" , "รหัสผู้จำหน่ายห้ามมีค่าว่าง" , "warning");
      return false;
    }
    let strCusName : string = "";
    strCusName = this.SvDefault.GetString(this.Supplier?.SupName);
    if(strCusName === ""){
      Swal.fire("" , "ชื่อสินค้าห้ามมีค่าว่าง" , "warning");
      return false;
    }
    this.ArrSupplierProduct = this.ArrSupplierProduct.filter(x=> x !== null);
    for (let i = 0; i < this.ArrSupplierProduct.length; i++) {
      let supProd = this.ArrSupplierProduct[i];
      if(supProd.UnitBarcode === ""){
        Swal.fire("" , "รหัสสินค้าห้ามมีค่าว่าง" , "warning");
        return false;
      }
      let isDupplicate = false;
      let numFindIndex = 0;
      numFindIndex = this.ArrSupplierProduct.findIndex(x=> x.UnitBarcode == supProd.UnitBarcode);
      isDupplicate = numFindIndex !== i;
      if(isDupplicate){
        Swal.fire("" , `รหัสสินค้า ${supProd.UnitBarcode} ซ้ำกัน` , "warning");
        return false;
      }
    }
    return true;
  }

  private cloneData() : ModelSupplier{
    let result : ModelSupplier = null;
    result = <ModelSupplier>{
      Supplier : this.Supplier ,
      ArrSupProduct : this.ArrSupplierProduct
    };
    result = this._svSupplier.CloneSupplier(result);
    return result;
  }

  public async UpdateStatus(pStrStatus : string){
    await this.SvDefault.DoActionAsync(async()=> await this.updateStatus(pStrStatus),true);
  }

  private async updateStatus(pStrStatus : string){
    pStrStatus = this.SvDefault.GetString(pStrStatus);

    // if (pStrStatus === "Cancel" && !await this.SvDefault.ShowCancelDialogAsync() ) {
    //   return;
    // }
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
    let sup = new ModelMasSupplier();
    this.SvDefault.CopyObject(this.Supplier , sup);
    sup.SupStatus = pStrStatus;
    sup = await this._svSupplier.UpdateStatus(sup);
    if(sup == null){
      return;
    }
    this.Supplier = sup;
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
    let sup : ModelSupplier = null;
    sup = this.cloneData();
    if(sup == null){
      return;
    }

    if(sup.Supplier.SupStatus === "New"){
      if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isCreate")) {
        this.SvDefault.ShowPositionRoleMessage("IsCreate");
        return;
      }
      if( await this._svSupplier.CheckDuplicateCode(sup.Supplier.SupCode)){
        Swal.fire("" , "รหัสผู้จำหน่ายซ้ำกัน" , "warning");
        return;
      }
      sup.Supplier.SupStatus = "Active";
      sup.Supplier.CreatedBy = this.SvDefault.GetString( this._svShare.user);
      sup = await this._svSupplier.InsertSupplier(sup);

    }else{
      if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isEdit")) {
        this.SvDefault.ShowPositionRoleMessage("IsEdit");
        return;
      }
      sup.Supplier.UpdatedBy = this.SvDefault.GetString( this._svShare.user);
      sup = await this._svSupplier.UpdateSupplier(sup);
    }
    this.displayData(sup);
    await this.SvDefault.ShowSaveCompleteDialogAsync();
  }

  public async AddProduct(){
    await this.SvDefault.DoActionAsync(async()=> this.addProduct());
  }

  private async addProduct(){
    let arrProd = await this.SvDefault.ShowModalProductAsync([]);
    if(!this.SvDefault.IsArray(arrProd)){
      return;
    }
    let arrSupProd = arrProd.map(x=>{
      let sp = new ModelMasSupplierProduct();
      sp.CompCode = this._svShare.compCode;
      sp.UnitBarcode = x.pdId;
      return sp;
    });
    this.ArrSupplierProduct = [... this.ArrSupplierProduct ,... arrSupProd];
  }

}
