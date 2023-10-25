import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MockExecutor } from 'protractor/built/driverProviders';
import { start } from 'repl';
import { DefaultService } from 'src/app/service/default.service';
import { ModelJsonCheckbox } from '../ModelPosition';

@Component({
  selector: 'app-ModalPositionJson',
  templateUrl: './ModalPositionJson.component.html',
  styleUrls: ['./ModalPositionJson.component.scss']
})
export class ModalPositionJsonComponent implements OnInit {

  constructor(
    private _svDefault : DefaultService,
    private _activeModal: NgbActiveModal,
  ) { }
  @Input() StrJson: string = "";
  public ArrCheckBox : ModelJsonCheckbox[] = [];

  ngOnInit() {
    this._svDefault.DoAction(()=> this.start());
  }

  private start(){
    this.ArrCheckBox = this.jSonToArrCheckBox(this.StrJson);
  }

  private jSonToArrCheckBox(pStrJson : string){
    pStrJson = this._svDefault.GetString(pStrJson);
    if(pStrJson === ""){
      return [];
    }
    let obj = JSON.parse(pStrJson);
    let result : ModelJsonCheckbox[] = [];
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        let strValue = this._svDefault.GetString( obj[key]);
        let cb = new ModelJsonCheckbox();
        cb.PropName = key;
        cb.PropValue = strValue === "Y";
        result.push(cb);
      }
    }
    return result;
  }

  private arrCheckBoxToJson(param : ModelJsonCheckbox[]){
    if(!this._svDefault.IsArray(param)){
      return "";
    }
    let objJson = new Object();
    for (let i = 0; i < param.length; i++) {
      let cb = param[i];
      if(cb == null ){
        continue;
      }
      let strPropName = this._svDefault.GetString(cb.PropName);
      if(strPropName === ""){
        continue;
      }
      objJson[strPropName] = cb.PropValue ? "Y" : "N";
    }
    let result = JSON.stringify(objJson);
    return result;
  }

  public AddCheckBox(){
    this._svDefault.DoAction(()=> this.addCheckBox());
  }

  private addCheckBox(){
    if(!this._svDefault.IsArray(this.ArrCheckBox)){
      this.ArrCheckBox =[];
    }
    if(this.ArrCheckBox.some(x=> this._svDefault.GetString(x.PropName)=== "")){
      return;
    }
    this.ArrCheckBox.push(new ModelJsonCheckbox());
  }
  public RemoveCheckBox(param : ModelJsonCheckbox){
    this._svDefault.DoAction(()=> this.removeCheckBox(param));
  }

  private removeCheckBox(param : ModelJsonCheckbox){
    if(param == null || !this._svDefault.IsArray(this.ArrCheckBox)){
      return;
    }
    this.ArrCheckBox = this.ArrCheckBox.filter(x=> x!= param);
  }

  public CloseModal(){
    this._svDefault.DoAction(()=> this.closeModal());
  }
  private closeModal(){
    this._activeModal.dismiss();
  }

  public SubmitData(){
    this._svDefault.DoAction(()=> this.submitData());
  }

  private submitData(){
    let StrJson = this.arrCheckBoxToJson(this.ArrCheckBox);
    this._activeModal.close(StrJson);
  }
}
