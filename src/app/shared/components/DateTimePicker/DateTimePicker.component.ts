import { AfterViewInit, Component, Input, OnInit, Output , EventEmitter, ChangeDetectorRef, NgZone, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';

import * as moment from 'moment';
import { DefaultService } from 'src/app/service/default.service';
// import * as $ from 'jquery';
// import $ from 'jquery';
declare var $:any;

@Component({
  selector: 'app-DateTimePicker',
  templateUrl: './DateTimePicker.component.html',
  styleUrls: ['./DateTimePicker.component.scss']
})
export class DateTimePickerComponent implements OnInit ,AfterViewInit {

  constructor(
    private _zone:NgZone,
    private _svDefault : DefaultService,
  ) {

  }

  @Input() get DateValue() : Date{
    return this._dateValue;
  }
  set DateValue(pInput : Date){
    this._dateValue = pInput;
    if(this._isInitComplete){
      setTimeout(() => {
        this._svDefault.DoAction(()=>{
          if(this._dateValue == null){
            $('#' + this.CurrentId).find("input").val("");
          }else{
            $('#'+this.CurrentId).datetimepicker("date" , moment(this._dateValue) );
          }
        });
      }, 0);
    }
  }
  @Output() DateValueChange = new EventEmitter<Date>();
  private _dateValue : Date = new Date();
  private _isInitComplete : boolean = false;

  @Input() public CurrentId : string = "";

  ngAfterViewInit(): void {
    this._svDefault.DoAction(()=>this.start());
  }
  private start() {

    $('#' + this.CurrentId).datetimepicker({
      icons: {
        time: "fa fa-clock",
      },
      collapse: true,
      sideBySide: true,
      locale: 'en',
      format : "DD/MM/YYYY HH:mm",
    });

    if (this._dateValue != null) {
      $('#' + this.CurrentId).datetimepicker("date", moment(this._dateValue));
    }else{
      $('#' + this.CurrentId).find("input").val("");
    }

    $('#' + this.CurrentId).on("change.datetimepicker", e => {
      this._svDefault.DoAction(()=>{
        if(e.date){
          this._dateValue = e.date.toDate();
        }else{
          this._dateValue = null;
        }
        this._zone.run(() => this.DateValueChange.emit(this._dateValue));
      });
    });
    this._isInitComplete = true;
  }
  ngOnInit() {

  }
}
