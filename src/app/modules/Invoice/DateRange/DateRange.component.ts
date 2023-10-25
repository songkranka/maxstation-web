import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-DateRange',
  templateUrl: './DateRange.component.html',
  styleUrls: ['./DateRange.component.scss']
})
export class DateRangeComponent implements OnInit {
  documentStartDate : Date = null;
  documentFinishDate : Date = null;
  FinishDate: NgbDate | null;
  FinishDateShow : NgbDate | null;
  hoveredDate: NgbDate | null = null;
  StartDate: NgbDate | null;
  StartDateShow  : NgbDate | null;
  myGroup: FormGroup;

  @Output("OnSelectDate") _onSelectDate : EventEmitter<{StartDate : Date , EndDate : Date }> =  new EventEmitter<{StartDate : Date , EndDate : Date }>();
  constructor(
    public formatter: NgbDateParserFormatter,
    private calendar: NgbCalendar,
  ) { 
    this.FinishDate = calendar.getToday();
    this.FinishDateShow = this.FinishDate;
    this.StartDate = calendar.getNext(calendar.getToday(), 'm', -1);
    this.StartDateShow = this.StartDate;
    this.documentStartDate = new Date(this.StartDate .year, this.StartDate .month - 1, this.StartDate .day);
    this._onSelectDate.emit({
      StartDate : this.documentStartDate,
      EndDate : new Date()
  });
  }

  isHovered(date: NgbDate) {
    return this.StartDate && !this.FinishDate && this.hoveredDate && date.after(this.StartDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.FinishDate && date.after(this.StartDate) && date.before(this.FinishDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.StartDate) || (this.FinishDate && date.equals(this.FinishDate)) || this.isInside(date) || this.isHovered(date);
  }
  ngOnInit() {
  }
  onDateSelection(date: NgbDate) {
    if (!this.StartDate && !this.FinishDate) {
      this.StartDate = date;
    } else if (this.StartDate && !this.FinishDate && date && date.after(this.StartDate)) {
      this.FinishDate = date;
    } else {
      this.FinishDate = null;
      this.StartDate = date;
    }

    if(this.FinishDate != null){
      this.FinishDateShow = this.FinishDate;
       this.documentFinishDate = new Date(this.FinishDate.year, this.FinishDate.month - 1, this.FinishDate.day);
       this._onSelectDate.emit({
        StartDate : this.documentStartDate,
        EndDate : this.documentFinishDate
      });
    }

    if(this.StartDate != null) {
      this.StartDateShow = this.StartDate;
      this.documentStartDate = new Date(this.StartDate.year, this.StartDate.month - 1, this.StartDate.day);
    }

  }
  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {    
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }
}
