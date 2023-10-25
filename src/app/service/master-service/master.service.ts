import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ModelMasEmployee, ModelMasCustomerCar, ModelMasBranchDisp, ModelMasMapping, ModelMasBranch, ModelMasBranchConfig, ModelMasCompany, ModelMasPosition, ModelAutEmployeeRole, ModelMasOrganize,ModelAuthBranch } from 'src/app/model/ModelScaffold';
import { SharedService } from 'src/app/shared/shared.service';
import { Employee } from 'src/app/model/master/employee.interface';
import { Reason } from 'src/app/model/master/reason.interface';
import { CostCenter } from 'src/app/model/master/costcenter.interface';
import { MeterResponse } from 'src/app/model/master/meter.interface';
import { EmployeeBranchConfig } from 'src/app/model/master/employeebranchconfig.interface';
import { SaveUnlock } from 'src/app/model/master/unlock.interface';
import { Branch } from 'src/app/model/master/branch.interface';
import { SaveEmployeeAuth } from 'src/app/model/master/EmployeeAuth.interface';
import { DefaultService } from '../default.service';
import { _MAT_HINT } from '@angular/material/form-field';

export interface MasterData<T> {
  Data: T,
  StatusCode: string,
  Message: string,
};

export interface MasterDatas<T> {
  Data: T[]
  totalItems: number;
};

export interface EmployeeData<T> {
  Data: T[]
  totalItems: number;
};

export interface ReasonData<T> {
  Data: T[]
  totalItems: number;
};


@Injectable({
  providedIn: 'root'
})

export class MasterService {

  constructor(
    private _svShare: SharedService,
    private _http: HttpClient,
    private _svDefault : DefaultService,
  ) { }


  // findEmployeeAll(keyword: string, page: number, size: number): Observable<EmployeeData<Employee>> {
  //     var data =
  //     {
  //         "Keyword": keyword,
  //         "Page": page,
  //         "ItemsPerPage": size
  //     }
  //     let strUrl = (this._svShare.urlMas || "").toString().trim() + "/api/Employee/List";
  //     let result = this._http.post(strUrl, data).pipe(
  //         map((employeeData: EmployeeData<Employee>) => employeeData),
  //         catchError(err => throwError(err))
  //     )
  //         console.log(result);
  //     return result ;
  // }

  public async findEmployeeAll(keyword: string, pageIndex: number, pageSize: number): Promise<EmployeeData<Employee>> {
    let data = {
      "Keyword": keyword,
      "Page": pageIndex,
      "ItemsPerPage": pageSize
    }

    let strUrl = (this._svShare.urlMas || "").toString().trim() + "/api/Employee/List";
    return await this._http.post(strUrl, data).pipe(
      map((employeeData: EmployeeData<Employee>) => employeeData),
      catchError(err => throwError(err))
    ).toPromise()
  }

  public async findEmployeeAllWithoutPage(): Promise<EmployeeData<Employee>> {
    let data = {
      "Keyword": null
    }

    let strUrl = (this._svShare.urlMas || "").toString().trim() + "/api/Employee/ListAllWithoutPage";
    return await this._http.post(strUrl, data).pipe(
      map((employeeData: EmployeeData<Employee>) => employeeData),
      catchError(err => throwError(err))
    ).toPromise()
  }

  public async findEmployeeAllByBranch(brnCode: string): Promise<EmployeeData<Employee>> {
    let data = {
      "BrnCode": brnCode
    }

    let strUrl = (this._svShare.urlMas || "").toString().trim() + "/api/Employee/ListAllByBranch";
    return await this._http.post(strUrl, data).pipe(
      map((employeeData: EmployeeData<Employee>) => employeeData),
      catchError(err => throwError(err))
    ).toPromise()
  }

  public async getMasMappingList(MapValue: string): Promise<MasterDatas<ModelMasMapping>> {
    let data = {
      "Keyword": MapValue
    }

    let strUrl = (this._svShare.urlMas || "").toString().trim() + "/api/Other/GetMasMappingList";
    return await this._http.post(strUrl, data).pipe(
      map((employeeData: MasterDatas<ModelMasMapping>) => employeeData),
      catchError(err => throwError(err))
    ).toPromise()
  }

  public async getMasBranchDISP(compCode: string, brnCode: string, docDate: string, periodNo: Number, periodStart: string): Promise<Array<MeterResponse>> {
    let data = {
      "CompCode": compCode,
      "BrnCode": brnCode,
      "DocDate": docDate,
      "PeriodNo": periodNo,
      "PeriodStart": periodStart
    }

    let strUrl = (this._svShare.urlMas || "").toString().trim() + "/api/Branch/GetMasBranchDISP";
    return await this._http.post(strUrl, data).pipe(
      map((meterRespose: Array<MeterResponse>) => meterRespose),
      catchError(err => throwError(err))
    ).toPromise()
  }

  public async getBranchList(compCode: string, locCode: string): Promise<Array<ModelMasBranch>> {
    let data = {
      "CompCode": compCode,
      "LocCode": locCode,
    }

    let strUrl = (this._svShare.urlMas || "").toString().trim() + "/api/Branch/GetBranchList";
    return await this._http.post(strUrl, data).pipe(
      map((masterData: Array<ModelMasBranch>) => masterData),
      catchError(err => throwError(err))
    ).toPromise()
  }

  public async FindEmployeeById(employeeId: string): Promise<MasterData<ModelMasEmployee>> {
    employeeId = (employeeId || "").toString().trim();
    if (employeeId === "") {
      return;
    }

    let strUrl = (this._svShare.urlMas || "").toString().trim() + "/api/Employee/FindById/" + encodeURI(employeeId);
    return await this._http.get(strUrl).pipe(
      map((employeeData: MasterData<ModelMasEmployee>) => employeeData),
      catchError(err => throwError(err))
    ).toPromise()
  }

  public async GetCustomerCarList(custCode: string, keyword: string, pageIndex: number, pageSize: number): Promise<MasterDatas<ModelMasCustomerCar>> {
    let data = {
      "CustCode": custCode,
      "Keyword": keyword,
      "Page": pageIndex,
      "ItemsPerPage": pageSize
    }

    let strUrl = (this._svShare.urlMas || "").toString().trim() + "/api/CustomerCar/FindByCustCode";
    return await this._http.post(strUrl, data).pipe(
      map((licensePlateData: MasterDatas<ModelMasCustomerCar>) => licensePlateData),
      catchError(err => throwError(err))
    ).toPromise()
  }

  findCostCenterAll(compCode: string, brnCode: string, keyword: string, pageIndex: number, pageSize: number): Observable<MasterDatas<CostCenter>> {
    let data = {
      "CompCode": compCode,
      "BrnCode": brnCode,
      "Keyword": keyword,
      "Page": pageIndex,
      "ItemsPerPage": pageSize
    }
    return this._http.post(this._svShare.urlMas + '/api/CostCenter/List', data).pipe(
      map((cashsaleData: MasterDatas<CostCenter>) => cashsaleData),
      catchError(err => throwError(err))
    )
  }

  public async findReasonAll(keyword: string, pageIndex: number, pageSize: number, pluNumber: string): Promise<ReasonData<Reason>> {
    let data = {
      "Keyword": keyword,
      "PdId": pluNumber,
      "Page": pageIndex,
      "ItemsPerPage": pageSize
    }

    let strUrl = (this._svShare.urlMas || "").toString().trim() + "/api/Reason/WithdrawList";
    return await this._http.post(strUrl, data).pipe(
      map((employeeData: ReasonData<Reason>) => employeeData),
      catchError(err => throwError(err))
    ).toPromise()
  }

  public async findBranchAll(keyword: string, pageIndex: number, pageSize: number, compCode: string): Promise<MasterDatas<Branch>> {
    let data = {
      "Keyword": keyword,
      "CompCode": compCode,
      "Page": pageIndex,
      "ItemsPerPage": pageSize
    }

    let strUrl = (this._svShare.urlMas || "").toString().trim() + "/api/Branch/List";
    return await this._http.post(strUrl, data).pipe(
      map((employeeData: MasterDatas<Branch>) => employeeData),
      catchError(err => throwError(err))
    ).toPromise()
  }

  public async GetMasBranchConfig(pStrCompCode: string, pStrBrnCode: string) {
    let strUrl = (this._svShare.urlMas || "").toString().trim() + `/api/Branch/GetMasBranchConfig/${pStrCompCode}/${pStrBrnCode}`;
    let result = await this._http.get<ModelMasBranchConfig>(strUrl).toPromise();
    return result;
  }

  public async GetEmpBranchConfig(compCode: string, brnCode: string, docDate: Date, empCode: string): Promise<MasterDatas<EmployeeBranchConfig>> {
    let data = {
      "CompCode": compCode,
      "BrnCode": brnCode,
      "DocDate": docDate,
      "EmpCode": empCode,
    }

    let strUrl = (this._svShare.urlMas || "").toString().trim() + "/api/Unlock/GetEmployeeBranchConfig";
    return await this._http.post(strUrl, data).pipe(
      map((empBranchConfig: MasterDatas<EmployeeBranchConfig>) => empBranchConfig),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = 'Error:' + error.error.message;
        } else {
          errorMessage = 'Error Code:' + error.status + '\n Message:' + error.error.message;
        }
        return throwError(errorMessage);
      })
    ).toPromise()
  }

  public async GetSysBranchConfig(compCode: string, brnCode: string, docDate: Date): Promise<MasterDatas<EmployeeBranchConfig>> {
    let data = {
      "CompCode": compCode,
      "BrnCode": brnCode,
      "DocDate": docDate,
    }

    let strUrl = (this._svShare.urlMas || "").toString().trim() + "/api/Unlock/GetSysBranchConfig";
    return await this._http.post(strUrl, data).pipe(
      map((empBranchConfig: MasterDatas<EmployeeBranchConfig>) => empBranchConfig),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = 'Error:' + error.error.message;
        } else {
          errorMessage = 'Error Code:' + error.status + '\n Message:' + error.error.message;
        }
        return throwError(errorMessage);
      })
    ).toPromise()
  }

  public async GetAllMasCompany(): Promise<MasterDatas<ModelMasCompany>> {
    let strUrl = (this._svShare.urlMas || "").toString().trim() + "/api/Company/GetAll";
    return await this._http.post(strUrl, null).pipe(
      map((empBranchConfig: MasterDatas<ModelMasCompany>) => empBranchConfig),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = 'Error:' + error.error.message;
        } else {
          errorMessage = 'Error Code:' + error.status + '\n Message:' + error.error.message;
        }
        return throwError(errorMessage);
      })
    ).toPromise()
  }

  public async SaveUnlock(pQuery: SaveUnlock) {
    let strUrl = (this._svShare.urlMas || "").toString().trim() + "/api/Unlock/SaveUnlock";
    return await this._http.post(strUrl, pQuery).pipe(
      map((unlockData: MasterData<SaveUnlock>) => unlockData),
      catchError(err => throwError(err.message))
    ).toPromise()
    // let result =<ReceiveGasQuery> await this._http.post(strUrl , pQuery).toPromise();
    // return result;
  }

  public async GetMasMapping(mapValue: string): Promise<Array<ModelMasMapping>> {
    let data = {
      "MapValue": mapValue,
    }

    let strUrl = (this._svShare.urlMas || "").toString().trim() + "/api/Mapping/GetMasMapping";
    return await this._http.post(strUrl, data).pipe(
      map((masMappingRespose: Array<ModelMasMapping>) => masMappingRespose),
      catchError(err => throwError(err))
    ).toPromise()
  }

  public async GetAllMasPosition(): Promise<MasterDatas<ModelMasPosition>> {
    let strUrl = (this._svShare.urlMas || "").toString().trim() + "/api/Position/GetAll";
    return await this._http.post(strUrl, null).pipe(
      map((masPosition: MasterDatas<ModelMasPosition>) => masPosition),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = '';
        if (error.error instanceof ErrorEvent) {
          errorMessage = 'Error:' + error.error.message;
        } else {
          errorMessage = 'Error Code:' + error.status + '\n Message:' + error.error.message;
        }
        return throwError(errorMessage);
      })
    ).toPromise()
  }

  public async GetEmployee(empCode: string): Promise<MasterDatas<ModelMasEmployee>> {
    empCode = (empCode || "").toString().trim();
    if (empCode === "") {
      return;
    }
    let strUrl = (this._svShare.urlMas || "").toString().trim() + "/api/Employee/FindById/" + encodeURI(empCode);
    return await this._http.get(strUrl).pipe(
      map((receiveOilData: MasterDatas<ModelMasEmployee>) => receiveOilData),
      catchError(err => throwError(err))
    ).toPromise()
  }

  public async GetAuthEmployeeRole(empCode: string): Promise<MasterDatas<ModelAutEmployeeRole>> {
    empCode = (empCode || "").toString().trim();
    if (empCode === "") {
      return;
    }
    let strUrl = (this._svShare.urlMas || "").toString().trim() + "/api/EmployeeAuth/FindByEmpCode/" + encodeURI(empCode);
    return await this._http.get(strUrl).pipe(
      map((receiveOilData: MasterDatas<ModelAutEmployeeRole>) => receiveOilData),
      catchError(err => throwError(err))
    ).toPromise()
  }

  public async SaveEmployeeAuth(pQuery: SaveEmployeeAuth) {
    let strUrl = (this._svShare.urlMas || "").toString().trim() + "/api/EmployeeAuth/SaveEmployeeAuth";
    return await this._http.post(strUrl, pQuery).pipe(
      map((employeeAuthData: MasterData<SaveEmployeeAuth>) => employeeAuthData),
      catchError(err => throwError(err))
    ).toPromise()
  }

  public async GetArrOrganize(pStrEmpCode : string) : Promise<ModelMasOrganize[]>{
    pStrEmpCode = this._svDefault.GetString(pStrEmpCode);
    if(pStrEmpCode === ""){
      return null;
    }
    let strUrl : string;
    strUrl = this._svDefault.GetString(this._svShare.urlMas)
      + "/api/EmployeeAuth/GetArrOrganize/" + pStrEmpCode;
    let arrOrg : ModelMasOrganize[];
    arrOrg = await this._http.get<ModelMasOrganize[]>(strUrl).toPromise();
    if(!this._svDefault.IsArray(arrOrg)){
      return null;
    }
    let result : ModelMasOrganize[];
    result = arrOrg.map(x=>{
      let org = new ModelMasOrganize();
      this._svDefault.CopyObject(x , org);
      return org;
    });
    return result;
  }


  public async GetAuthBranch(pStrEmpCode : string) : Promise<ModelAuthBranch[]>{
    pStrEmpCode = this._svDefault.GetString(pStrEmpCode);
    if(pStrEmpCode === ""){
      return null;
    }
    let strUrl : string;
    strUrl = this._svDefault.GetString(this._svShare.urlMas)
      + "/api/EmployeeAuth/GetAuthBranch/"+ this._svShare.compCode  +"/" + pStrEmpCode;
    let arrOrg : ModelAuthBranch[];
    arrOrg = await this._http.get<ModelAuthBranch[]>(strUrl).toPromise();
    if(!this._svDefault.IsArray(arrOrg)){
      return null;
    }
    let result : ModelAuthBranch[];
    result = arrOrg.map(x=>{
      let org = new ModelAuthBranch();
      this._svDefault.CopyObject(x , org);
      return org;
    });
    return result;
  }

}
