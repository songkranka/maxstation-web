import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { CustomerModel, Quotation,QuotationData, ResponseData } from 'src/app/model/sale/quotation.interface';
import { SharedService } from 'src/app/shared/shared.service';
import { ModelMasCustomer2 } from 'src/app/model/ModelCommon';
import { ModelMasEmployee, ModelMasPayType, ModelSalQuotationHd, ModelSysApproveStep } from 'src/app/model/ModelScaffold';
import { DefaultService } from '../default.service';


  @Injectable({
    providedIn: 'root'
  })

  export class QuotationService {
    constructor(
      private http: HttpClient, 
      private sharedService: SharedService,
      private _svDefault : DefaultService,
    ) { }
    findAll(brncode: string, compcode: string, Loccode: string, keyword: string, fromDate: Date, toDate: Date, page: number, size: number): Observable<QuotationData<Quotation>> {
        var data =
        {
          "BrnCode": brncode,
          "CompCode": compcode,
          "FromDate": this._svDefault.GetFormatDate(fromDate),
          "ToDate": this._svDefault.GetFormatDate(toDate),
          "Keyword" : keyword,
          "Page": page,
          "ItemsPerPage": size
        }

        this.sharedService.urlSale;
        return this.http.post(this.sharedService.urlSale +'/api/Quotation/GetQuotationList', data).pipe(        
          map((quotationData: QuotationData<Quotation>) => quotationData),
          catchError(err => throwError(err))
        )
    }

    async GetCustomerList(pStrKeyWord : string): Promise<CustomerModel[]>{
      pStrKeyWord = (pStrKeyWord || "").toString().trim();
      let param ={"Keyword": pStrKeyWord};
      let strUrl = (this.sharedService.urlMas || "").toString().trim() + "/api/Customer/GetCustomerList";
      let apiResult = <ResponseData<CustomerModel[]>>await this.http.post(strUrl, param).toPromise();
      return apiResult.Data;
    }
    public async GetArrayPayType(): Promise<ModelMasPayType[]>{
      let strUrl : string = "";
      strUrl = (this.sharedService.urlSale || "").toString().trim() + "/api/Quotation/GetArrayPayType";
      let result : ModelMasPayType[] = null;
      result = await <ModelMasPayType[]>await this.http.get(strUrl).toPromise();
      return result;
    }
    public async GetArrayEmployee(): Promise<ModelMasEmployee[]>{
      let strUrl : string = "";
      strUrl = (this.sharedService.urlSale || "").toString().trim() + "/api/Quotation/GetArrayEmployee";
      let result : ModelMasEmployee[] = null;
      result = await <ModelMasEmployee[]>await this.http.get(strUrl).toPromise();
      return result;
    }
    public async GetEmployee(pStrEmpCode : string){
      pStrEmpCode = this._svDefault.GetString(pStrEmpCode);
      if(pStrEmpCode === ""){
        return null;
      }
      pStrEmpCode = encodeURI(pStrEmpCode);
      let strUrl : string = "";
      strUrl = this._svDefault.GetString(this.sharedService.urlSale) 
        + "/api/Quotation/GetEmployee/" 
        + pStrEmpCode;
      let result : ModelMasEmployee = null;
      result = await this.http.get<ModelMasEmployee>(strUrl).toPromise();
      return result;
    }
    public async GetApproveStep(param : ModelSalQuotationHd){
      if(param == null){
        return null;
      }
      let strUrl : string = "";
      strUrl = this._svDefault.GetString(this.sharedService.urlSale) 
        + "/api/Quotation/GetApproveStep/";
      let result : ModelSysApproveStep[] = null;
      result = await this.http.post<ModelSysApproveStep[]>(strUrl, param).toPromise();
      return result;
    }

  }
