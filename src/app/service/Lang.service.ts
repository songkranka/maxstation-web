import { Injectable } from '@angular/core';
import { ModelLang } from '../model/ModelLang';
import { DefaultService } from './default.service';
//import countries from './_files/countries.json';
import * as langs from "./../../assets/json/Lang.json";
export enum LangType {
    Thai , English , Lao , Myanmar
}
@Injectable()
export class LangService {



constructor(
    private _svDefault : DefaultService
) { }
    private _arrLang : ModelLang[] = (<any>langs).default;
    private _curentLang : LangType = LangType.English;
    public OnLangChange : (pLangType : LangType) => void;
    public ArrOnLangChange : ((pLangType : LangType) => void)[] = [];
    public GetArrLang(){
        return this._arrLang;
        // if(this._svDefault.IsArray(this._arrLang)){
        //     return this._arrLang;
        // }
        // let hello = new ModelLang();
        // hello.English = "Hello";
        // hello.Thai = "สวัสดี";
        // hello.Lao = "ສະບາຍດີ";
        // hello.Myanmar = "မင်္ဂလာပါ";
        // this._arrLang.push(hello);
        // let travel = new ModelLang();
        // travel.English = "Travel";
        // travel.Thai = "ไปเที่ยว";
        // travel.Lao = "ທ່ອງ​ທ່ຽວ";
        // travel.Myanmar = "ခရီးသွား";
        // this._arrLang.push(travel);
        // return this._arrLang;
    }
    public SetLang(pLang : LangType){
        this._curentLang = pLang;
        if(this._svDefault.IsArray(this.ArrOnLangChange)){
            for (let i = 0; i < this.ArrOnLangChange.length; i++) {
                let oc = this.ArrOnLangChange[i];
                if(oc == null){
                    continue;
                }
                oc(pLang);
            }
        }
        // if(this.OnLangChange != null){
        //     this.OnLangChange(pLang);
        // }
    }
    public GetLang() : LangType{
        return this._curentLang;
    }
}
