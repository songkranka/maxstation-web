import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModelMasBranch, ModelMasCompany, ModelMasEmployee, ModelMasBranchTank, ModelMasBranchDisp, ModelMasBranchTax, ModelBranchDropdown, ModelMasUnit } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import { ModelBranch, ModelBranchParam, ModelBranchResult, BranchListQuery, QueryResult, ModelBranchTankResource, ModelBranchTaxResource, ModelBranchResource } from 'src/app/modules/Master-data/Branch/BranchModel';
import { promise } from 'protractor';
import { Branch } from 'src/app/model/master/branch.interface'
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { ModelUnitParam, ModelUnitResult } from 'src/app/modules/Master-data/Unit/UnitModel';

export interface Unitdata<T> {
    Data: T[],
    StatusCode: string,
    Message: string,
};

@Injectable({
    providedIn: 'root'
})

export class UnitService {
    private _strUrlMaster: string = "";
    private _strApiUnit: string = "";

    constructor(
        private _svShared: SharedService,
        private _svDefault: DefaultService,
        private _http: HttpClient,
    ) {
        this._strUrlMaster = (_svShared.urlMas || "").toString().trim();
        this._strApiUnit = this._strUrlMaster + "/api/Unit/";
    }

    public async GetDataList(pInput: ModelUnitParam): Promise<ModelUnitResult> {
        let strUrl = this._strApiUnit + "List";
        return await this._http.post(strUrl, pInput).pipe(
            map((unitData: ModelUnitResult) => unitData),
            catchError(err => throwError(err))
        ).toPromise()
    }

    public async GetUnitById(unitId: string) {
        unitId = (unitId || "").toString().trim();

        if (unitId === "") {
            return null;
        }
        let strUrl = (this._strApiUnit || "").toString().trim() + "GetMasUnitById/" + encodeURI(unitId);
        let result: ModelMasUnit[] = null;
        result = await this._http.get<ModelMasUnit[]>(strUrl).toPromise();
        return result;
    }

    public async SaveData(pQuery: ModelMasUnit) {
        let strUrl = (this._strApiUnit || "").toString().trim() + "SaveUnit";
        return await this._http.post(strUrl, pQuery).pipe(
            map((data: Unitdata<ModelMasUnit>) => data),
            catchError(err => throwError(err))
        ).toPromise()
    }

    public async UpdateStatus(pQuery: ModelMasUnit) {
        let strUrl = (this._strApiUnit || "").toString().trim() + "UpdateStatus";
        return await this._http.post(strUrl, pQuery).pipe(
            map((data: Unitdata<ModelMasUnit>) => data),
            catchError(err => throwError(err))
        ).toPromise()
    }
}
