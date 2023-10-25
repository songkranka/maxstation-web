import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModelBranch } from 'src/app/model/ModelCommon';
import { DefaultService } from 'src/app/service/default.service';
import { AdjustRequestService } from 'src/app/service/adjust-request-service/adjust-request-service';
import { valueSelectbox } from 'src/app/shared-model/demoModel';
import { SharedService } from 'src/app/shared/shared.service';
import { AdjustRequest } from 'src/app/model/inventory/adjustrequest.interface';

@Component({
  selector: 'app-AdjustModal',
  templateUrl: './AdjustModal.component.html',
  styleUrls: ['./AdjustModal.component.scss']
})
export class AdjustModalComponent implements OnInit {

  constructor(
    public ActiveModal: NgbActiveModal,
    private _svShare: SharedService,
    private _svDefault: DefaultService,
    private _svAdjustRequestService: AdjustRequestService
  ) { }

  @Input() ArrBranch: ModelBranch[];
  @Input() compCode: string = "";
  @Input() brnCode: string = "";
  @Input() locCode: string = "";

  ArrAdjustRequestHD: AdjustRequest[] = [];
  IsLoading: boolean = false;
  docTypeSelect2: valueSelectbox[];
  StrDocTypeId: string = "";
  StrKeyWord: string = "";
  SelectAdjustRequest: AdjustRequest = null;
  async ngOnInit() {
    this.IsLoading = true;
    await this._svDefault.DoActionAsync(async () => {
      this.ArrAdjustRequestHD = await this.GetAdjustRequestHdList(this.StrKeyWord);
      console.log(this.ArrAdjustRequestHD);
    });
    this.IsLoading = false;
  }

  async SearchData() {
    this.IsLoading = true;
    await this._svDefault.DoActionAsync(async () => {
      this.ArrAdjustRequestHD = await this.GetAdjustRequestHdList(this.StrKeyWord);
    });
    this.IsLoading = false;
  }

  GetBranchName(pStrBranchCode: string): string {
    let result: string = "";
    this._svDefault.DoAction(() => result = this.getBranchName(pStrBranchCode));
    return result;
  }

  //-----------------[ Private Method ]------------------//
  private getBranchName(pStrBranchCode: string): string {
    if (!(Array.isArray(this.ArrBranch) && this.ArrBranch.length)) {
      return pStrBranchCode;
    }
    for (let i = 0; i < this.ArrBranch.length; i++) {
      let branch = this.ArrBranch[i];
      if (branch.BrnCode === pStrBranchCode) {
        return branch.BrnName;
      }
    }
    return pStrBranchCode;
  }

  private async GetAdjustRequestHdList(pStrKeyword: string): Promise<AdjustRequest[]> {
    let response = await this._svAdjustRequestService.findAllAsync(this.brnCode, this.compCode, this.locCode, pStrKeyword, null, null, 1, 10);
    console.log(response["items"]);
    return response["items"];
  }
}
