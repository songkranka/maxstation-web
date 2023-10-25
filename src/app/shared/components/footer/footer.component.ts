import { Component, OnInit } from '@angular/core';
import { DefaultService } from 'src/app/service/default.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  constructor(private _svDefault : DefaultService) { }
  public StrIpAddress : string = "";
  async ngOnInit() {
    // this.StrIpAddress = await this._svDefault.GetClientIp();
  }

}
