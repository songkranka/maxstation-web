import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModelSysMenu } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';
import { BranchConfig, ModelAutPositionRole, ModelGetPositionListParam, ModelGetPositionListResult, ModelMasPosition, ModelPosition, SaveUnlock } from './ModelPosition';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

constructor(
  private _svDefault : DefaultService ,
  private _http : HttpClient,
  private _svShare : SharedService
) { }

async GetSysMenuList(){
  let strUrl = this._svShare.urlMas + "/api/Position/GetSysMenuList/";
  let apiResult = await this._http.get<ModelSysMenu[]>(strUrl).toPromise();
  let result : ModelSysMenu[] = [];
  if(this._svDefault.IsArray(apiResult)){
    result = apiResult.map( x=>{
      let sm = new ModelSysMenu();
      this._svDefault.CopyObject(x , sm);
      return sm;
    });
  }
  return result;
}

async GetPosition(pStrPosCode  :string){
  pStrPosCode = this._svDefault.GetString(pStrPosCode);
  if(pStrPosCode === ""){
    return null;
  }
  let strUrl = this._svShare.urlMas + "/api/Position/GetPosition/" + pStrPosCode;
  let apiResult = await this._http.get<ModelPosition>(strUrl).toPromise();
  let result = new ModelPosition();
  if(apiResult != null){
    if(apiResult.Position!= null){
      let pos = new ModelMasPosition();
      this._svDefault.CopyObject(apiResult.Position , pos);
      result.Position = pos;
    }
    if(this._svDefault.IsArray(apiResult.ArrPositionRole)){
      result.ArrPositionRole = apiResult.ArrPositionRole.map(x=>{
        let role = new ModelAutPositionRole();
        this._svDefault.CopyObject(x , role);
        return role;
      });
    }
    // if(this._svDefault.IsArray(apiResult.ArrMenu)){
    //   result.ArrMenu = apiResult.ArrMenu.map(x=>{
    //     let menu = new ModelSysMenu();
    //     this._svDefault.CopyObject(x , menu);
    //     return menu;
    //   });
    // }
  }
  return result
}

async GetBranchConfigDesc(){
  
  let strUrl = this._svShare.urlMas + "/api/Position/GetBranchConfigDesc/";
  let apiResult = await this._http.get<BranchConfig[]>(strUrl).toPromise();
  let result : BranchConfig[] = [];
  let branchConfigs = apiResult['Data'];
    result = branchConfigs.map(x=> {
      let sm = new BranchConfig();
      this._svDefault.CopyObject(x , sm);
      return sm;
    });
  // }
  return result;
}

async GetBranchConfig(pStrPosCode  :string){
  pStrPosCode = this._svDefault.GetString(pStrPosCode);
  if(pStrPosCode === ""){
    return null;
  }
  let strUrl = this._svShare.urlMas + "/api/Position/GetBranchConfig/" + pStrPosCode;
  let apiResult = await this._http.get<BranchConfig[]>(strUrl).toPromise();
  let result : BranchConfig[] = [];
  let branchConfigs = apiResult['Data'];
    result = branchConfigs.map(x=> {
      let sm = new BranchConfig();
      this._svDefault.CopyObject(x , sm);
      return sm;
    });
  // }
  return result;
}

async InsertPosition(param : ModelPosition){
  if(param == null){
    return null;
  }
  let strUrl = this._svShare.urlMas + "/api/Position/InsertPosition/";
  let result = await this._http.post<ModelPosition>(strUrl , param).toPromise();
  return result;
}

async InsertUnlock(param: SaveUnlock){
  if(param == null){
    return null;
  }
  let strUrl = this._svShare.urlMas + "/api/Position/InsertUnlock/";
  let result = await this._http.post<ModelPosition>(strUrl , param).toPromise();
  return result;
}

async UpdatePosition(param : ModelPosition){
  if(param == null){
    return null;
  }
  let strUrl = this._svShare.urlMas + "/api/Position/UpdatePosition/";
  let result = await this._http.post<ModelPosition>(strUrl , param).toPromise();
  return result;
}

async UpdateUnlock(param: SaveUnlock){
  if(param == null){
    return null;
  }
  let strUrl = this._svShare.urlMas + "/api/Position/UpdateUnlock/";
  let result = await this._http.post<BranchConfig[]>(strUrl , param).toPromise();
  return result;
}

async ChangeStatus(param : ModelMasPosition){
  if(param == null){
    return null;
  }
  let strUrl = this._svShare.urlMas + "/api/Position/ChangeStatus/";
  let result = await this._http.post<boolean>(strUrl , param).toPromise();
  return result;
}

async GetPositionList(param : ModelGetPositionListParam){
  if(param == null){
    return null;
  }
  let strUrl = this._svShare.urlMas + "/api/Position/GetPositionList/";
  let apiResult = await this._http.post<ModelGetPositionListResult>(strUrl , param).toPromise();
  let result = new ModelGetPositionListResult();
  if(apiResult != null){
    if(this._svDefault.IsArray(apiResult.ArrPosition)){
      result.ArrPosition = apiResult.ArrPosition.map( x=>{
        let pos = new ModelMasPosition();
        this._svDefault.CopyObject(x , pos);
        return pos;
      });
    }
    if(apiResult.hasOwnProperty("TotalItem")){
      result.TotalItem = this._svDefault.GetNumber(apiResult.TotalItem , 0);
    }
  }
  return result;
}

public async SaveData() {

}

}


