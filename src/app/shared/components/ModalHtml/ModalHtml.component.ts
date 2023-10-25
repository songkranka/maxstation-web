import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DefaultService } from 'src/app/service/default.service';

@Component({
  selector: 'app-ModalHtml',
  templateUrl: './ModalHtml.component.html',
  styleUrls: ['./ModalHtml.component.scss']
})
export class ModalHtmlComponent implements OnInit {

  constructor(
    public ActiveModal: NgbActiveModal,
    private _svDefault: DefaultService ,
    public Sanitizer: DomSanitizer,
  ) { }
  // Header : string = "TestHeader";
  // Html : string = "<h1>Hello World</h1>"
  @Input() HeaderInput : string = "";
  @Input() HtmlInput: string = "";
  ngOnInit() {
    // this.Header = this.HtmlInput.Header;
    // this.Html = this.HtmlInput.Html;
  }

}
