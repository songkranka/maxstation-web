import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { DefaultService } from 'src/app/service/default.service';
import numeral from "numeral";

@Component({
  selector: 'app-InputDecimal',
  templateUrl: './InputDecimal.component.html',
  styleUrls: ['./InputDecimal.component.scss']
})
export class InputDecimalComponent {

  private _numInput: number = 0;
  private _numMax: number = 13;
  private _numMin: number = 1;
  ShowValue: string = "";

  @Input() Disabled: boolean = false;

  @Input() set Max(param: number) {
    this._numMax = param;
  }
  @Input() set Min(param: number) {
    this._numMin = param;
  }
  @Input() get InputNumber(): number {
    return this._numInput;
  }
  set InputNumber(pNumValue: number) {
    pNumValue = pNumValue || 0.00;
    if (this._numInput === pNumValue) {
      return;
    }
    this._numInput = pNumValue;
    this.ShowValue = this.AddComma(this._numInput);
  }
  @Input() InputClass: string = "";
  @Input() Width: number = 100;
  @Input() Placeholder: string = "";
  @Input() ToFix: number = 2;
  @Output() InputNumberChange = new EventEmitter<number>();
  @Output("OnChange") OnValueChange = new EventEmitter();
  @ViewChild("numFormat") _currentInput: ElementRef<HTMLInputElement>

  constructor(public SvDefault: DefaultService) { }

  OnFocus(e: any) {
    let numValue = e.target.value;
    var result = Number(numValue.replace(/[^0-9.-]+/g, ""));
    if (result <= 0) {
      this.ShowValue = "";
    } else {
      this.ShowValue = result.toString();
    }
  }

  OnChange(e: any) {
    let strRegEx = "^(0|[1-9][0-9]{" + (this._numMin - 1) + "," + (this._numMax - 1) + "})(\\.\\d{0," + this.ToFix + "})?$"
    let reg = new RegExp(strRegEx);
    let numValue = e.target.value;
    if (numValue != "") {
      if (!reg.test(numValue)) {
        numValue = 0;
      }
    } else {
      numValue = 0;
    }

    this._numInput = parseFloat(numValue);
    this.InputNumberChange.emit(this._numInput);
    this.ShowValue = this.AddComma(this._numInput);
    this.OnValueChange.emit();

    return true;
  }

  private AddComma(item) {
    return numeral(item).format('0,0.00');
  }
}
