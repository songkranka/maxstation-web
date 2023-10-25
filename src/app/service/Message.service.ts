import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
import { ModelSysMessage } from '../model/ModelScaffold';
import { ReturnOilComponent } from '../modules/Inventory/ReturnOil/ReturnOil/ReturnOil.component';
import { SharedService } from '../shared/shared.service';
import { DefaultService } from './default.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

constructor(
  private _svShared : SharedService,
  //private _svDefault : DefaultService,
  private _http : HttpClient
) { }

private _strStorageKey = "ModelSysMessage";
private _arrSysMessage : ModelSysMessage[] = [];


public async GetArrSysMessage(){
  let strUrl = this.GetString(this._svShared.urlMas) + "/api/Message/GetArrSysMessage/";
  let result = await this._http.get<ModelSysMessage[]>(strUrl).toPromise();
  return result;
}

public SaveToLocalStorage(param : ModelSysMessage[]){
  if(!this.IsArray(param)){
    return;
  }
  this._arrSysMessage = param;

  let strJson = JSON.stringify(param);
  localStorage.setItem(this._strStorageKey , strJson);
}

public GetMessage(pNumMsgCode : number){
  if(!this.IsArray(this._arrSysMessage)){
    let strJson = localStorage.getItem(this._strStorageKey);
    this._arrSysMessage = JSON.parse(strJson);
  }
  if(!this.IsArray(this._arrSysMessage)){
    return "";
  }
  let result = this._arrSysMessage.find(x=> x.MsgCode === pNumMsgCode && x.MsgLang === "TH")?.MsgText;
  result = this.GetString(result);
  return result;
}

public ShowErrorMessageDialog(pNumMsgCode : number){
  let strMessage =  this.GetMessage(pNumMsgCode);
  if(strMessage === ""){
    return;
  }
  Swal.fire("" , strMessage , "error");
}

public GetString(pInput: any): string {
  let result: string = "";
  result = (pInput || "").toString().trim();
  return result;
}

public IsArray(pInput: any): boolean {
  let result: boolean;
  result = Array.isArray(pInput) && !!pInput.length;
  return result;
}

}
