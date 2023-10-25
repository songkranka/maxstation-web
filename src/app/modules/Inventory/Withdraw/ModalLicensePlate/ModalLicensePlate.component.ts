import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DefaultService } from 'src/app/service/default.service';
import { WithdrawService } from '../../../../service/withdraw-service/withdraw-service';
import { SharedService } from 'src/app/shared/shared.service';
import { ModelMasCompanyCar } from 'src/app/model/ModelScaffold';
import { CompanyCar } from 'src/app/model/master/companycar.interface'

@Component({
  selector: 'app-ModalLicensePlate',
  templateUrl: './ModalLicensePlate.component.html',
  styleUrls: ['./ModalLicensePlate.component.scss']
})
export class ModalLicensePlateComponent implements OnInit {
  public NumPageIndex: number = 1;
  public NumPageSize: number = 10;
  public NumCollectionSize: number = 10;
  private _txtSearchLicensePlate: HTMLInputElement = null;

  constructor(
    public ActiveModal: NgbActiveModal,
    public SvDefault: DefaultService,
    public _svwithdraw: WithdrawService,
    private _svShare: SharedService,
  ) {

  }

  private _strCompCode: string = "";
  @Input() public ArrLicensePlate: ModelMasCompanyCar[] = [];
  public ArrFilterData: ModelMasCompanyCar[] = [];
  public ArrKey: string[] = [];
  public ObjectKeys = Object.keys;
  public StrKeyWord: string = "";

  async ngOnInit() {
    await this.SvDefault.DoActionAsync(async () => await this.searchCompanyCar());
  }

  private async searchCompanyCar() {
    this._strCompCode = (this._svShare.compCode || "").toString().trim();
    this._txtSearchLicensePlate = <HTMLInputElement>document.getElementById("txtSearchLicensePlate");
    let result = (await this._svwithdraw.GetLicensePlateList(this._strCompCode, this._txtSearchLicensePlate.value, this.NumPageIndex, this.NumPageSize));
    this.NumCollectionSize = result["totalItems"];
    this.ArrLicensePlate = this.toModelData(result["items"]);
    this.ArrFilterData = this.ArrLicensePlate;
    return;
  }

  public async OnPageIndexChange() {
    await this.SvDefault.DoActionAsync(async () => await this.onPageIndexChange(), true);
  }
  private async onPageIndexChange() {
    await this.searchCompanyCar();
  }

  public async OnPageSizeChange() {
    await this.SvDefault.DoActionAsync(async () => await this.onPageSizeChange(), true);
  }
  private async onPageSizeChange() {
    this.NumPageIndex = 1;

    await this.searchCompanyCar();
  }

  public async SearchData() {
    await this.SvDefault.DoActionAsync(async () => await this.searchData(), true);
  }

  private async searchData() {
    await this.searchCompanyCar();
  }

  private toModelData(companyCar: CompanyCar[]): ModelMasCompanyCar[] {
    return companyCar.map(c => {
      return {
        CarStatus: c.carStatus,
        CarRemark: c.carRemark,
        CompCode: c.compCode,
        CreatedBy: c.createdBy,
        CreatedDate: c.createdDate,
        LicensePlate: c.licensePlate,
        UpdatedBy: c.updatedBy,
        UpdatedDate: c.updatedDate,
      };
    });
  }
}
