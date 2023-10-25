import { HttpClient } from '@angular/common/http';
import { stringify } from '@angular/compiler/src/util';
import { Component, Input, OnInit } from '@angular/core';
import { async } from '@angular/core/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ModelSalQuotationHd2 } from 'src/app/model/ModelCommon';
import { ModelSalQuotationHd } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { SharedService } from 'src/app/shared/shared.service';

@Component({
  selector: 'app-ModalQuotation',
  templateUrl: './ModalQuotation.component.html',
  styleUrls: ['./ModalQuotation.component.scss']
})
export class ModalQuotationComponent implements OnInit {

  constructor(
    public ActiveModal: NgbActiveModal ,
    private _svDefault : DefaultService,
    private _httpClient: HttpClient,
    private _svShared: SharedService,
  ) { }
  @Input() ArrQuotation : ModelSalQuotationHd[] = [];
  ArrFilterQuotation : ModelSalQuotationHd[] = [];
  SelectQuotation : ModelSalQuotationHd = null;
  KeyWord : string = "";
  async ngOnInit() {
    this._svDefault.DoActionAsync(async()=>await this.start());
  }
  FilterData(){
    this._svDefault.DoAction(()=>this.filterData());
  }
  private async start(){
    let funcCompare :( a : ModelSalQuotationHd , b: ModelSalQuotationHd  )=> number = null;
    funcCompare = (a,b)=>{
      let num1 : number = new Date(a?.UpdatedDate || 0)?.getTime() || 0;
      let num2 : number = new Date(b?.UpdatedDate || 0)?.getTime() || 0;
      return num2 - num1;
    };
    this.ArrQuotation = this.ArrQuotation.sort(funcCompare);
    this.ArrFilterQuotation = this.ArrQuotation;
  }
  private async getQuotation(): Promise<ModelSalQuotationHd2[]>{
    let strUrl = (this._svShared.urlSale || "").toString().trim() + "/api/CashSale/GetQuotation";
    let result =<ModelSalQuotationHd2[]> await this._httpClient.get(strUrl).toPromise();
    return result;
  }

  private filterData() {
    let strFilter : string = (this.KeyWord || "").toString().trim();
    if(strFilter === ""){
      this.ArrFilterQuotation = this.ArrQuotation;
      return;
    }
    this.ArrFilterQuotation = this.ArrQuotation.filter( 
      x=> x.DocNo?.includes(strFilter) 
      || x.CustCode?.includes(strFilter) 
      || x.CustName?.includes(strFilter) 
    );
  }
}
