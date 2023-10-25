import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModelMasBranch, ModelMasCompany, ModelMasEmployee, ModelMasBranchTank, ModelMasBranchDisp, ModelMasBranchTax, ModelBranchDropdown } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ModelBranch,ModelBranchParam,ModelBranchResult, BranchListQuery, QueryResult, ModelBranchTankResource, ModelBranchTaxResource, ModelBranchResource} from 'src/app/modules/Master-data/Branch/BranchModel';
import { promise } from 'protractor';
import { Branch } from 'src/app/model/master/branch.interface'
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

export interface BranchMasterdata<T> {
  Data: T[],
  StatusCode: string,
  Message: string,
};

@Injectable({
  providedIn: 'root'
})

export class BranchMasterService {
  private _strUrlMaster : string = "";
  private _strApiBranch : string = "";

  constructor(
    private _svShared : SharedService,
    private _svDefault : DefaultService,
    private _http : HttpClient,
  ) { 
    this._strUrlMaster = (_svShared.urlMas || "").toString().trim() ;
    this._strApiBranch = this._strUrlMaster + "/api/Branch/";
  }

  public async GetArrayBranchHeader(pInput: ModelBranchParam): Promise<ModelBranchResult> {
    let strUrl = this._strApiBranch + "List";
    return await this._http.post(strUrl, pInput).pipe(
      map((licensePlateData: ModelBranchResult) => licensePlateData),
      catchError(err => throwError(err))
    ).toPromise()
  }

  public async GetCompanyDDL():Promise<ModelMasCompany[]>{
    let strUrl : string ="";
    strUrl = this._strApiBranch + "GetCompanyDDL";
    let result : ModelMasCompany[] = null;
    result = await this._http.get<ModelMasCompany[]>(strUrl).toPromise();
    return result;
  }

  public async GetCompany(CompCode: string): Promise<ModelMasCompany>{
    CompCode = (CompCode || "").toString().trim();
    if(CompCode === ""){
      return;
    }
    let strUrl : string = "";
    strUrl = this._strApiBranch + "GetCompany/" + encodeURI(CompCode);
    let result : ModelMasCompany = null;
    result = await this._http.get<ModelMasCompany>(strUrl).toPromise();
    return result;
  }

  public async GetBranchByGuid(guid: string){
    guid = (guid || "").toString().trim();
    if (guid === ""){
      return null;
    }
    let strUrl = this._strApiBranch + "GetBranchByGuid/" + encodeURI(guid);
    let result : ModelMasBranch[] = null;
    result = await this._http.get<ModelMasBranch[]>(strUrl).toPromise();
    return result;
  }

  public async GetBranchDetail(BrnCode: string){
    BrnCode = (BrnCode || "").toString().trim();
    if (BrnCode === ""){
      return null;
    }
    let strUrl = this._strApiBranch + "GetBranchDetail/" + encodeURI(BrnCode);
    let result : ModelMasBranch[] = null;
    result = await this._http.get<ModelMasBranch[]>(strUrl).toPromise();
    return result;
  }

  public async GetBranchByCompCodeAndBrnCode(CompCode: string, BrnCode: string){
    CompCode = (CompCode || "").toString().trim();
    BrnCode = (BrnCode || "").toString().trim();
    if (CompCode === "" ||BrnCode === ""){
      return null;
    }
    let strUrl = this._strApiBranch + "GetBranchByCompCodeAndBrnCode/" + encodeURI(CompCode) + "/"+ encodeURI(BrnCode);
    let result : ModelMasBranch[] = null;
    result = await this._http.get<ModelMasBranch[]>(strUrl).toPromise();
    return result;
  }

  public async GetBranchName(CompCode: string, BrnCode: string){
    CompCode = (CompCode || "").toString().trim();
    BrnCode = (BrnCode || "").toString().trim();
    if (CompCode === "" ||BrnCode === ""){
      return null;
    }
    let strUrl = this._strApiBranch + "GetBranchDropdown/" + encodeURI(CompCode) + "/"+ encodeURI(BrnCode);
    let result : ModelBranchDropdown[] = null;
    result = await this._http.get<ModelBranchDropdown[]>(strUrl).toPromise();
    return result;
  }

  public async GetTankByBranch(Compcode: string,BrnCode: string){
    Compcode = (Compcode || "" ).toString().trim();
    BrnCode = (BrnCode || "" ).toString().trim();
    if (Compcode === "" ){
      return null;
    }
    if (BrnCode === "" ){
      return null;
    }
    let strUrl = this._strApiBranch + "GetTankByBranch/" + encodeURI(Compcode) + "/"+ encodeURI(BrnCode);
    let result : ModelMasBranchTank[] = null;
    result = await this._http.get<ModelMasBranchTank[]>(strUrl).toPromise();
    return result;
  }

  public async GetDispByBranch(Compcode: string,BrnCode: string){
    Compcode = (Compcode || "" ).toString().trim();
    BrnCode = (BrnCode || "" ).toString().trim();
    if (Compcode === "" ){
      return null;
    }
    if (BrnCode === "" ){
      return null;
    }
    let strUrl = this._strApiBranch + "GetDispByBranch/" + encodeURI(Compcode) + "/"+ encodeURI(BrnCode);
    let result : ModelMasBranchDisp[] = null;
    result = await this._http.get<ModelMasBranchDisp[]>(strUrl).toPromise();
    return result;
  } 

  public async GetTaxByBranch(Compcode: string,BrnCode: string){
    Compcode = (Compcode || "" ).toString().trim();
    BrnCode = (BrnCode || "" ).toString().trim();
    if (Compcode === "" ){
      return null;
    }
    if (BrnCode === "" ){
      return null;
    }
    let strUrl = this._strApiBranch + "GetTaxByBranch/" + encodeURI(Compcode) + "/"+ encodeURI(BrnCode);
    let result : ModelMasBranchTax[] = null;
    result = await this._http.get<ModelMasBranchTax[]>(strUrl).toPromise();
    return result;
  } 

  public async SaveData(pQuery: ModelBranchResource) {
    let strUrl = (this._strApiBranch || "").toString().trim() + "SaveBranch";
    return await this._http.post(strUrl, pQuery).pipe(
      map((branchData: BranchMasterdata<ModelBranchResource>) => branchData),
      catchError(err => throwError(err))
    ).toPromise()
  }

  public async SaveTankData(pQuery: ModelBranchTankResource) {
    let strUrl = (this._strApiBranch || "").toString().trim() + "SaveBranchTank";
    return await this._http.post(strUrl, pQuery).pipe(
      map((branchTankData: BranchMasterdata<ModelBranchTankResource>) => branchTankData),
      catchError(err => throwError(err))
    ).toPromise()
  }

  public async SaveTaxData(pQuery: ModelBranchTaxResource) {
    let strUrl = (this._strApiBranch || "").toString().trim() + "SaveBranchTax";
    return await this._http.post(strUrl, pQuery).pipe(
      map((branchTaxData: BranchMasterdata<ModelBranchTaxResource>) => branchTaxData),
      catchError(err => throwError(err))
    ).toPromise()
  }
}