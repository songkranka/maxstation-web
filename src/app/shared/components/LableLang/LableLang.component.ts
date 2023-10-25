import { Component, ContentChild, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { DefaultService } from 'src/app/service/default.service';
import { LangService, LangType } from 'src/app/service/Lang.service';

@Component({
  selector: 'app-LabelLang',
  templateUrl: './LableLang.component.html',
  styleUrls: ['./LableLang.component.css']
})
export class LableLangComponent implements OnInit {

  constructor(
    private _svDefault : DefaultService,
    private _svLang : LangService,
    private elt:ElementRef, 
    private renderer:Renderer2
  ) { }

  _strCurrentText = "";
  private _onLangChange : (pLangType : LangType) => void;
  ngAfterViewInit() {
    var textNode = this.elt.nativeElement.childNodes[0];
    this._strCurrentText = textNode.nodeValue;

    this._onLangChange = x =>{
      // console.log(x);
      // console.log(textNode.nodeValue);
      let curLang = this._svLang.GetLang();
      let arrLang = this._svLang.GetArrLang();
      let strNewLang = "";
      let newLang = arrLang.find(y=> y.Thai === this._strCurrentText);
      if(newLang != null){
        strNewLang = this._svDefault.GetString(newLang[x]);
      }
      this.renderer.setValue(textNode ,strNewLang);      
    }
    this._svLang.ArrOnLangChange.push(this._onLangChange);

    // this.renderer.setValue(textNode ,textInput.toUpperCase());
    //this.renderer.setText(textNode, textInput.toUpperCase());
  }

  ngOnInit() {
  }
  ngOnDetroy(){
    //this._onLangChange = null;
  }
}
