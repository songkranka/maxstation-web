import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModelMasBranchCalibrate } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';

@Injectable({providedIn: 'root'})
export class ExcelReaderService {

constructor(
    private _svShared : SharedService,
    private _svDefault : DefaultService,
    private _http : HttpClient,
) { }

    public async AddMasBranchCalibrate(param : ModelMasBranchCalibrate){
        let strUrl = this._svShared.urlMas + "/api/ExcelReader/AddMasBranchCalibrate";
        let result = await this._http.post<boolean>(strUrl , param).toPromise();
        return result;
    }
}
