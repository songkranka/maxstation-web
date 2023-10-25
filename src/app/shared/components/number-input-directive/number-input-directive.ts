import {
    Directive,
    ElementRef,
    forwardRef,
    HostBinding,
    HostListener,
    Attribute,
    Input,
    OnChanges,
    SimpleChanges,
    Renderer2
  } from '@angular/core';
  import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
  import { coerceNumberProperty } from '@angular/cdk/coercion';
  import { DOWN_ARROW, UP_ARROW } from '@angular/cdk/keycodes';
  import * as numeral from 'numeral';
  
  function isNil(value: any): value is null | undefined {
    return value === null || value === undefined;
  }
  
  class NumberBuilder {
    constructor(private _value: number) { }
  
    limit(decimals: number): NumberBuilder {
      if (decimals <= 0) {
        return this;
      }
  
      const [firstPart, decimalPart] = String(this._value).split('.');
      const { decimal } = numeral.localeData().delimiters;
  
      if (decimalPart && decimalPart.length > decimals) {
        return new NumberBuilder(parseFloat(`${firstPart}.${decimalPart.substr(0, decimals)}`));
      }
  
      return this;
    }
  
    between(min: number, max: number): NumberBuilder {
      return new NumberBuilder(Math.max(Math.min(this._value, max), min));
    }
  
    build(): number {
      return this._value;
    }
  }
  
  function createNumericRegex(hasDecimal: boolean, hasSign: boolean): RegExp {
    const { decimal } = numeral.localeData().delimiters;
  
  return new RegExp(`^${hasSign ? '-?' : ''}(?:(?:\\d+${hasDecimal ? `(\\${decimal}\\d*)?` : ''})|(?:\\${decimal}\\d*))?\$`);
  }
  
  const noop = () => { };
  
  @Directive({
    selector: 'input[appNumberInput]',
    providers: [
      {
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NumberInputDirective),
        multi: true
      }
    ],
    exportAs: 'appNumberInput'
  })
  export class NumberInputDirective implements ControlValueAccessor, OnChanges {
    @Input('min') public set minInput(value: string) {
      this.min = coerceNumberProperty(value);
    }
  
    @Input('max') public set maxInput(value: string) {
      this.max = coerceNumberProperty(value);
    }
  
    @Input('decimals') public set decimalsInput(value: string) {
      this.decimals = coerceNumberProperty(value);
    }
  
    @Input() public format = '0,0.00';
  
    private modelValue?: number;
    private displayValue?: string;
  
    private decimals = 2;
    private min = Number.MIN_SAFE_INTEGER;
    private max = Number.MAX_SAFE_INTEGER;
  
    private focused = false;
    private onChange: (value?: number) => void = noop;
  
    @HostBinding('disabled') private disabled = false;
  
    constructor(
      private readonly element: ElementRef<HTMLInputElement>,
      private readonly renderer: Renderer2,
      // tslint:disable:no-attribute-parameter-decorator
      @Attribute('type') private readonly type: string
    ) { }
  
    public ngOnChanges(changes: SimpleChanges): void {
      this.verifySettings();
  
      if (changes.format) {
        this.renderDisplayValue();
      }
    }
  
    public writeValue(value: number): void {
      this.updateModelValue(value);
      this.renderDisplayValue();
    }
  
    public registerOnChange(fn: (value: number) => void): void {
      this.onChange = fn;
    }
  
    public registerOnTouched(): void { }
  
    public setDisabledState(isDisabled: boolean): void {
      this.disabled = isDisabled;
    }
  
    @HostListener('input', ['$event']) public onInput(event: Event): void {
      const element = this.element.nativeElement;
      const selectionStart = element.selectionStart as number;
      const selectionEnd = element.selectionEnd as number;
      const value = element.value;
  
      if (!this.isValidInput(value)) {
        this.renderDisplayValue();
        this.setSelection(selectionStart - 1, selectionEnd - 1);
      } else {
        const parsedNumber = numeral.default(value).value();
        this.updateModelValue(parsedNumber);
  
        if (parsedNumber !== this.modelValue) {
          this.renderDisplayValue();
          this.setSelection(selectionStart, selectionEnd);
        }
      }
    }
  
    @HostListener('focus') public onFocus(): void {
      this.focused = true;
      this.renderDisplayValue();
      setTimeout(() => this.setSelection(0, this.displayValue!.length));
    }
  
    @HostListener('blur') public onBlur(): void {
      this.focused = false;
      this.renderDisplayValue();
    }
  
    @HostListener('keydown', ['$event']) public onKeyDown(event: KeyboardEvent): void {
      if (this.disabled || this.type === 'number') {
        return;
      }
  
      // tslint:disable:deprecation
      switch (event.keyCode) {
        case DOWN_ARROW:
          this.addStep(-1);
          break;
        case UP_ARROW:
          this.addStep(1);
          break;
      }
    }
  
    private verifySettings(): void {
      if (this.min > this.max) {
        throw new Error('The max modelValue should be bigger than the minInput modelValue');
      }
  
      if (this.decimals < 0) {
        throw new Error('The decimals modelValue should be bigger than 0');
      }
    }
  
    private isValidInput(input: string): boolean {
      const hasDecimal = this.decimals > 0;
      const hasSign = this.min < 0;
  
      return createNumericRegex(hasDecimal, hasSign).test(input);
    }
  
    private addStep(step: number): void {
      this.updateModelValue((this.modelValue || 0) + step);
      this.renderDisplayValue();
    }
  
    private updateModelValue(value: number | null): void {
      if (isNil(value)) {
        this.modelValue = null;
        this.onChange(this.modelValue);
  
        return;
      }
  
      this.modelValue = new NumberBuilder(value)
        .limit(this.decimals)
        .between(this.min, this.max)
        .build();
  
      this.onChange(this.modelValue);
    }
  
    private renderDisplayValue(): void {
      this.displayValue = '';
  
      if (!isNil(this.modelValue)) {
        const { decimal } = numeral.localeData().delimiters;
        this.displayValue = this.focused ? String(this.modelValue).replace('.', decimal) : numeral.default(this.modelValue).format(this.format);
      }
  
      this.renderer.setProperty(this.element.nativeElement, 'value', this.displayValue);
    }
  
    private setSelection(start: number, end: number): void {
      if (this.type === 'number') {
        return;
      }
  
      this.element.nativeElement.setSelectionRange(start, end);
    }
  }
  