import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { ModelHiddenButton } from 'src/app/model/ModelCommon';
import { ModelMasBranch, ModelMasBranchConfig, ModelMasBranchTax } from 'src/app/model/ModelScaffold';
import { BranchMasterService } from 'src/app/service/branch-service/branch-master-service';
import { DefaultService } from 'src/app/service/default.service';
import { MasterService } from 'src/app/service/master-service/master.service';
import { SharedService } from 'src/app/shared/shared.service';
import swal from 'sweetalert2';
import { ModelBranchTaxResource } from '../BranchModel';

export class ProductModel {
  CreatedBy: string;
  CreatedDate: Date;
  GroupId: string;
  UnitBarcode: string;
  AcctCode: string;
  PdDesc: string;
  PdId: string;
  PdName: string;
  PdStatus: string;
  UnitId: string;
  UnitName: string;
  UpdatedBy: string;
  UpdatedDate: Date;
  VatRate: number;
  VatType: string;
}

@Component({
  selector: 'app-branch-tax',
  templateUrl: './branch-tax.component.html',
  styleUrls: ['./branch-tax.component.scss']
})
export class BranchTaxComponent implements OnInit {
  // public HiddenButton: ModelHiddenButton = new ModelHiddenButton();
  public Header: ModelMasBranch = new ModelMasBranch();
  public MasBranchConfig: ModelMasBranchConfig = new ModelMasBranchConfig();
  public selectedStatus: string = "";
  private _strBrnCode: string = "";
  private _strCompCode: string = "";
  private _strLocCode: string = "";
  private _strUser: string = "";
  myGroup: FormGroup;
  linesTax: ModelMasBranchTax[];
  rowFocus = 0;
  productList: ProductModel[] = [];
  product: ProductModel;
  urlMas = this.sharedService.urlMas;
  public authPositionRole: any;
  action: string = "";

  constructor(
    private authGuard: AuthGuard,
    public SvDefault: DefaultService,
    private _svShared: SharedService,
    private _route: ActivatedRoute,
    private _svBranch: BranchMasterService,
    private httpClient: HttpClient,
    private sharedService: SharedService,
    private _masService: MasterService,
  ) { 
    this.selectedStatus = "Sell";
  }

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  async ngOnInit() {
    await this.SvDefault.DoActionAsync(async () => await this.start(), true);
  }

  private async start() {
    this.authPositionRole = this.SvDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }

    this._strBrnCode = (this._svShared.brnCode || "").toString().trim();
    this._strCompCode = (this._svShared.compCode || "").toString().trim();
    this._strLocCode = (this._svShared.locCode || "").toString().trim();
    this._strUser = (this._svShared.user || "").toString().trim();
    this.linesTax = [];
    this.myGroup = new FormGroup({
      searchProduct: new FormControl(),
    });

    let strGuid: string = "";
    let branchs: ModelMasBranch[] = null;
    let branchMasterModel: ModelMasBranch = null;
    strGuid = (this._route.snapshot.params.DocGuid || "").toString().trim();

    if (strGuid === "New") {
      this.action = "New";
      await this.newData();
    } else {
      this.action = "Edit";
      branchs = await this._svBranch.GetBranchByGuid(strGuid);
      branchMasterModel = branchs["Data"];
      let branchMaster = await this._svBranch.GetBranchDetail(branchMasterModel.BrnCode);
      branchMasterModel = branchMaster["Data"];
      this.Header.BrnName = branchMasterModel.BrnName;
      this.Header.CompanyName = branchMasterModel.CompanyName;
      let masBranchConfig = await this._masService.GetMasBranchConfig(branchMasterModel.CompCode , branchMasterModel.BrnCode);

      if(masBranchConfig != null) {
        this.MasBranchConfig.Trader = masBranchConfig.Trader;
        this.MasBranchConfig.TraderPosition = masBranchConfig.TraderPosition;
        if(this.MasBranchConfig.ReportTaxType != null || this.MasBranchConfig.ReportTaxType != "")
        {
          this.selectedStatus = masBranchConfig.ReportTaxType;
        }
      }
      this.displayData(branchMasterModel);
    }
  }

  public async NewData() {
    await this.SvDefault.DoActionAsync(async () => await this.newData(), true);
  }

  private async newData() {
    let result = await this._svBranch.GetBranchDetail(this._strBrnCode);
    this.Header.BrnCode = this._strBrnCode;
    this.Header.CompCode = this._strCompCode;
    this.Header.CreatedBy = this._strUser;
    this.Header.BrnName = result['Data'].BrnName;
    this.Header.CompanyName = result['Data'].CompanyName;
  }

  private displayData(branch: ModelMasBranch) {
    if (branch == null) {
      return;
    }
    this.Header = branch;
    this.Header.UpdatedBy = this._strUser;
    this.ShowModelTax(this.Header.CompCode, this.Header.BrnCode);
  }

  private async ShowModelTax(CompCode: string, BrnCode: string) {
    CompCode = (CompCode || "").toString().trim();
    BrnCode = (BrnCode || "").toString().trim();
    if (CompCode === "") {
      return null;
    }
    if (BrnCode === "") {
      return null;
    }
    let arrDetailTax: ModelMasBranchTax[] = null;
    arrDetailTax = await this._svBranch.GetTaxByBranch(CompCode, BrnCode);

    let TaxList = arrDetailTax["Data"];
    this.linesTax = [];
    
    for (let i = 0; i < TaxList.length; i++) {
      let obj = new ModelMasBranchTax;
      obj.BrnCode = TaxList[i].BrnCode;
      obj.CompCode = TaxList[i].CompCode;
      obj.CreatedBy = TaxList[i].CreatedBy;
      obj.CreatedDate = TaxList[i].CreatedDate;
      obj.TaxAmt = TaxList[i].TaxAmt;
      obj.TaxId = TaxList[i].TaxId;
      obj.TaxName = TaxList[i].TaxName;
      obj.UpdatedBy = TaxList[i].UpdatedBy;
      obj.UpdatedDate = TaxList[i].UpdatedDate;
      this.linesTax.push(obj);
    }
  }

  public async addrowTax() {
    let row3 = new ModelMasBranchTax();
    row3.CompCode = this.Header.CompCode;
    row3.BrnCode = this.Header.BrnCode;
    row3.TaxId = "";
    row3.TaxName = "";
    row3.TaxAmt = 0.0000;
    this.linesTax.push(row3);
  }

  addProduct() {
    this.linesTax[this.rowFocus].TaxId = this.product.PdId;
    this.linesTax[this.rowFocus].TaxName = this.product.PdName;
  }

  setRowFocus(indexs: any) {
    this.rowFocus = indexs;
    this.getProductList();
  }

  getProductList() {
    this.productList = [];
    this.httpClient.post(this.urlMas + "/api/Product/GetProductOilType", null)
      .subscribe(
        response => {
          for (let i = 0; i < response["Data"].length; i++) {
            let obj = new ProductModel();
            obj.CreatedBy = response["Data"][i].CreatedBy;
            obj.CreatedDate = response["Data"][i].CreatedDate;
            obj.GroupId = response["Data"][i].GroupId;
            obj.UnitBarcode = response["Data"][i].UnitBarcode;
            obj.PdDesc = response["Data"][i].PdDesc;
            obj.PdId = response["Data"][i].PdId;
            obj.PdName = response["Data"][i].PdName;
            obj.PdStatus = response["Data"][i].PdStatus;
            obj.UnitId = response["Data"][i].UnitId;
            obj.UnitName = response["Data"][i].UnitName;
            obj.UpdatedBy = response["Data"][i].UpdatedBy;
            obj.UpdatedDate = response["Data"][i].UpdatedDate;
            obj.VatRate = response["Data"][i].VatRate;
            obj.VatType = response["Data"][i].VatType;
            obj.AcctCode = response["Data"][i].AcctCode;
            this.productList.push(obj);
          }
        },
        error => {
          console.log("Error", error);
        }
      );
  }

  selectedProduct = (indexs: any): void => {
    var obj = this.productList[indexs];
    this.product = obj;
    this.hilightRowProduct(indexs);
  }

  hilightRowProduct(indexs) {
    if (indexs == null) {
      indexs = this.productList.findIndex(e => e.PdId === this.product.PdId);
    }
    if (indexs != null) {
      const slides = document.getElementsByClassName('trPdStyle');
      for (let i = 0; i < slides.length; i++) {
        const slide = slides[i] as HTMLElement;
        if (i == indexs) {
          slide.style.backgroundColor = "#9fdb95";
        } else {
          slide.style.backgroundColor = "#fff";
        }
      }
    }
  }

  deleteRowTax = (indexs: any): void => {
    this.linesTax = this.linesTax.filter((row, index) => index !== indexs);
  }

  public async SaveData() {
    await this.SvDefault.DoActionAsync(async () => await this.saveData(), true);
  }

  private async saveData() {
    if(this.action === "New"){
      if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isCreate")) {
        this.SvDefault.ShowPositionRoleMessage("IsCreate");
        return;
      }
    }
    else if(this.action === "Edit"){
      if (!this.SvDefault.ValidateAuthPositionRole(this.authPositionRole, "isEdit")) {
        this.SvDefault.ShowPositionRoleMessage("IsEdit");
        return;
      }
    }
    
    if (this.validateData()) {
      let masBranchConfigReq = new ModelMasBranchConfig;
      let masBranchTaxs: ModelMasBranchTax[] = [];
      masBranchConfigReq.CompCode = this._strCompCode;
      masBranchConfigReq.BrnCode = this.Header.BrnCode;
      masBranchConfigReq.Trader = this.MasBranchConfig.Trader;
      masBranchConfigReq.TraderPosition = this.MasBranchConfig.TraderPosition;
      masBranchConfigReq.ReportTaxType = this.selectedStatus;
      masBranchConfigReq.CreatedBy = this._strUser;
      masBranchConfigReq.UpdatedBy = this._strUser;

      for (let i = 0; i < this.linesTax.length; i++) {
        let masBranchTax: ModelMasBranchTax = this.linesTax[i];
        masBranchTax.CompCode = this._strCompCode;
        masBranchTax.BrnCode = this.Header.BrnCode;
        masBranchTax.CreatedBy = this._strUser;
        masBranchTax.UpdatedBy = this._strUser;
        masBranchTax.TaxId = this.linesTax[i].TaxId;
        masBranchTax.TaxName = this.linesTax[i].TaxName;
        masBranchTax.TaxAmt = this.linesTax[i].TaxAmt;
        masBranchTaxs.push(masBranchTax);
      }

      let branchTaxResource = new ModelBranchTaxResource;
      branchTaxResource.MasBranchConfig = masBranchConfigReq;
      branchTaxResource.MasBranchTaxs = masBranchTaxs;
      let branchTaxResponse = await this._svBranch.SaveTaxData(branchTaxResource);
      let statusCode = branchTaxResponse.StatusCode;
      let message = branchTaxResponse.Message;

      if (statusCode == "422") {
        this.SvDefault.ShowWarningDialog(message);
      }
      else {
        // this.displayData(this._strCompCode, this._strBrnCode);
        await this.SvDefault.ShowSaveCompleteDialogAsync();
      }
    }
  }

  validateData = (): boolean => {
    let pass = false;
    let msg = "";

    if (this.MasBranchConfig.Trader === "") {
      pass = false;
      msg = "กรุณากรอกรายละเอียดภาษี อบจ.";
    }

    if (this.MasBranchConfig.TraderPosition === "") {
      pass = false;
      msg = "กรุณากรอกตำแหน่งผู้ค้าปลีก";
    }

    if (this.linesTax.length == 0) {
      pass = false;
      msg = "กรุณาเพิ่มรายละเอียดภาษี อบจ.";
    }

    else {
      if (this.linesTax.length > 0) {
        for (var i = 0; i < this.linesTax.length; i++) {
          if (this.linesTax[i].TaxId == "") {
            pass = false;
            msg = "กรุณาเลือกรหัสสินค้า<br>";
            break;
          } else {
            pass = true;
          }
          if (this.linesTax[i].TaxAmt == 0) {
            pass = false;
            msg = `กรุณากรอกอัตราภาษี รหัสสินค้า ${this.linesTax[i].TaxId} ${this.linesTax[i].TaxName}` + "<br>";
            break;
          } else {
            pass = true;
          }
        }
      }
    }
    if (!pass) {
      swal.fire({
        title: msg,
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'error'
      })
    }
    return pass;
  }
}
