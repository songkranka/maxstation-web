import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { DefaultService } from 'src/app/service/default.service';

@Component({
  selector: 'app-InputNumberFormat',
  templateUrl: './InputNumberFormat.component.html',
  styleUrls: ['./InputNumberFormat.component.scss']
})
export class InputNumberFormatComponent implements OnInit, AfterViewInit {

  private _numInput: number = 0;
  private _numMax: number = 0.00;
  private _numMin: number = 0.00;
  private _numStep: number = 1;
  private _haveMin: boolean = false;
  private _haveMax: boolean = false;
  ShowValue: string = "0.00";
  // private _className : string  = "";
  @Input() Disabled: boolean = false;
  @Input() Step: number = 1;
  @Input() ToFix: number = 2;
  @Input() set Max(param: number) {
    this._numMax = param;
    this._haveMax = true;
  }
  @Input() set Min(param: number) {
    this._numMin = param;
    this._haveMin = true;
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
    this.formatText();
  }

  @Input() InputClass: string = "";

  @Input() Width: number = 100;
  @Output() InputNumberChange = new EventEmitter<number>();

  @Output("OnChange") OnValueChange = new EventEmitter();
  @ViewChild("numFormat") _currentInput: ElementRef<HTMLInputElement>
  constructor(public SvDefault: DefaultService) { }
  ngOnInit() {
  }
  ngAfterViewInit() {
    let htmlInput: HTMLInputElement = null;
    htmlInput = this._currentInput.nativeElement;
    if (htmlInput == null) {
      return;
    }

    // htmlInput.classList.add(this._className);

    if (this._haveMax) {
      htmlInput.setAttribute("Max", this.SvDefault.GetString(this._numMax));
    }
    if (this._haveMin) {
      htmlInput.setAttribute("Min", this.SvDefault.GetString(this._numMin));
    }
    if (this.ToFix === 0) {
      htmlInput.onkeydown = e => {
        if (e.key == ".") {
          return false;
        }
      };
    }
    this.formatText();
  }
  OnChange(e: any) {
    let numValue = parseFloat(e.target.value);
    if (isNaN(numValue)) {
      return false;
    }
    if (this._haveMax && numValue > this._numMax) {
      numValue = this._numMax;
    } else if (this._haveMin && numValue < this._numMin) {
      numValue = this._numMin;
    }
    this._numInput = numValue;
    this.InputNumberChange.emit(this._numInput);
    this.formatText();
    this.OnValueChange.emit();
    return true;
  }
  private formatText() {
    this.ShowValue = this._numInput.toFixed(this.ToFix);
  }
}
