import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModelGetNotiParam } from 'src/app/model/ModelCommon';
import { ModelSysNotification } from 'src/app/model/ModelScaffold';
import { SharedService } from 'src/app/shared/shared.service';
import { DefaultService } from '../default.service';

@Injectable({
    providedIn: 'root'
})
export class CommonService {

constructor(
    private _svDefault : DefaultService,
    private _http : HttpClient,
    private _svShared : SharedService,
) { }

public async GetNoti(param : ModelGetNotiParam){
    if(param == null){
        return null;
    }
    let strUrl = this._svShared.urlCommon + "/api/Common/GetNoti";
    let result = await this._http.post<ModelSysNotification[]>(strUrl , param).toPromise();
    return result;
}

public async UpdateNoti(param : ModelSysNotification){
    if(param == null){
        return null;
    }
    let strUrl = this._svShared.urlCommon + "/api/Common/UpdateNoti";
    let result = await this._http.post<boolean>(strUrl , param).toPromise();
    return result;
}

}
