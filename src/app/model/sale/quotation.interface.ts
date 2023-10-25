import { ModelMasCustomer2 } from "../ModelCommon";

export interface Quotation {
  docDate: Date;
  docNo: string;
  docStatus: string;
  custCode:string;
  custName:string;
  vatAmt:number;
  vatAmtCur:number;
  guid: string;
  netAmt:number;

  DocDate: Date;
  DocNo: string;
  DocStatus: string;
  CustCode:string;
  CustName:string;
  VatAmt:number;
  VatAmtCur:number;
  Guid: string;
  NetAmt:number;
  }

  export interface QuotationData<T> {
        items: T[],        
        totalItems: number;
        itemCount: number;
        itemsPerPage: number;
        totalPages: number;
        currentPage: number;
    
        message:string;
        isSuccess:boolean;
    
        links: {
          first: string;
          previous: string;
          next: string;
          last: string;
        }
  };

  export class ResponseData<T>{
    StatusCode : number = 0;
    Message : string = "";
    Data : T = null;
    TotalItems : number = 0
  }
  export class CustomerModel extends ModelMasCustomer2 {
      Province: string = "";
      RegisterId: string = "";
  }