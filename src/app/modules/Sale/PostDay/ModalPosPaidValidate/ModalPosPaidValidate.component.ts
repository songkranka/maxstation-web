import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModelMecPostPaidValidate } from 'src/app/model/sale/postday.interface';

@Component({
  selector: 'app-ModalPosPaidValidate',
  templateUrl: './ModalPosPaidValidate.component.html',
  styleUrls: ['./ModalPosPaidValidate.component.scss']
})
export class ModalPosPaidValidateComponent implements OnInit {

  constructor(
    public ActiveModal: NgbActiveModal,
  ) { }

  @Input() ListPostPaid : ModelMecPostPaidValidate[] = [];

  ngOnInit() {
  }

}
