import { ModelFinBalance, ModelMasProduct, ModelSalTaxinvoiceDt, ModelSalTaxinvoiceHd } from "src/app/model/ModelScaffold";
/*
export class ModelSalTaxinvoiceDt2{
    CompCode : string = "";
    BrnCode : string = "";
    LocCode : string = "";
    DocNo : string = "";
    SeqNo : number = 0;
    LicensePlate : string = "";
    PdId : string = "";
    PdName : string = "";
    IsFree : boolean = false;
    UnitId : string = "";
    UnitBarcode : string = "";
    UnitName : string = "";
    ItemQty : number = 0;
    StockQty : number = 0;
    UnitPrice : number = 0;
    UnitPriceCur : number = 0;
    SumItemAmt : number = 0;
    SumItemAmtCur : number = 0;
    DiscAmt : number = 0;
    DiscAmtCur : number = 0;
    DiscHdAmt : number = 0;
    DiscHdAmtCur : number = 0;
    SubAmt : number = 0;
    SubAmtCur : number = 0;
    VatType : string = "";
    VatRate : number = 0;
    VatAmt : number = 0;
    VatAmtCur : number = 0;
    TaxBaseAmt : number = 0;
    TaxBaseAmtCur : number = 0;
    TotalAmt : number = 0;
    TotalAmtCur : number = 0;
}
*/
export class ModelCashTax extends ModelSalTaxinvoiceHd{
    /*
    CompCode : string = "";
    BrnCode : string = "";
    LocCode : string = "";
    DocNo : string = "";
    DocStatus : string = "";
    DocType : string = "";
    DocDate : Date | string = null;
    CustCode : string = "";
    CitizenId : string = "";
    CustName : string = "";
    CustAddr1 : string = "";
    CustAddr2 : string = "";
    RefNo : string = "";
    ItemCount : number = 0;
    Currency : string = "";
    CurRate : number = 0;
    SubAmt : number = 0;
    SubAmtCur : number = 0;
    DiscRate : string = "";
    DiscAmt : number = 0;
    DiscAmtCur : number = 0;
    TotalAmt : number = 0;
    TotalAmtCur : number = 0;
    TaxBaseAmt : number = 0;
    TaxBaseAmtCur : number = 0;
    VatRate : number = 0;
    VatAmt : number = 0;
    VatAmtCur : number = 0;
    NetAmt : number = 0;
    NetAmtCur : number = 0;
    Post : string = "";
    RunNumber : number = 0;
    DocPattern : string = "";
    Guid : string = "6c853b65-69f2-4a03-a0c9-4bf4e7ac4687";
    PrintCount : number = 0;
    PrintBy : string = "";
    PrintDate : Date = null;
    CreatedDate : Date = null;
    CreatedBy : string = "";
    UpdatedDate : Date = null;
    UpdatedBy : string = "";   
    */
    SalTaxinvoiceDt :  ModelSalTaxinvoiceDt[] = [];
}

export class ModelCashTaxCancelAndReplace{
    CancelCashTax : ModelCashTax = null;
    NewCashTax : ModelCashTax = null;
    FinBalance : ModelFinBalance = null;
}

export class CashModel {
    DocNo: string;
    RefNo: string;
  }
  
  export class CurrencyModel {
    Currency: string;
    Rate: number;
  }
  
  export class DetailModel extends ModelSalTaxinvoiceDt {
    CarId: string = "";
    SumAmt: number = 0;
    SumAmtCur: number = 0;
    /*
    BrnCode: string;
    CompCode: string;
    DiscAmt: number;
    DiscAmtCur: number;
    DiscHdAmt: number;
    DiscHdAmtCur: number;
    DocNo: string;
    ItemQty: number;
    IsFree: boolean;
    LicensePlate: string;
    LocCode: string;
    PdId: string;
    PdName: string;
    SeqNo: number;
    StockQty: number;
    SubAmt: number;
    SubAmtCur: number;
    SumItemAmt: number;
    SumItemAmtCur: number;
    TaxBaseAmt: number;
    TaxBaseAmtCur: number;
    TotalAmt: number;
    TotalAmtCur: number;
    UnitId: string;
    UnitBarcode: string
    UnitName: string;
    UnitPrice: number;
    UnitPriceCur: number;
    VatAmt: number;
    VatAmtCur: number;
    VatRate: number;
    VatType: string;
    */
  }
  
  export class HeaderModel extends ModelSalTaxinvoiceHd {
    Status: string = "";
    /*
    BrnCode: string;
    CompCode: string;
    CreatedBy: string;
    CreatedDate: Date;
    CurRate: number;
    Currency: string;
    CustCode: string;
    CustName: string;
    CustAddr1: string;
    CustAddr2: string;
    DiscAmt: number;
    DiscAmtCur: number;
    DiscRate: string;
    DocDate: Date;
    DocNo: string;
    DocPattern: string;
    DocType: string;
    DocStatus: string;
    Guid: string;
    ItemCount: number;
    LocCode: string;
    NetAmt: number;
    NetAmtCur: number;
    Post: string;
    RefNo: string;
    RunNumber: number;
    SubAmt: number;
    SubAmtCur: number;
    CitizenId: string
    TaxBaseAmt: number;
    TaxBaseAmtCur: number;
    TotalAmt: number;
    TotalAmtCur: number;
    UpdatedBy: string;
    UpdatedDate: Date;
    VatAmt: number;
    VatAmtCur: number;
    VatRate: number;
  */
  }
  
  export class ProductModel extends ModelMasProduct {
    UnitBarcode: string = "";
    UnitPrice: number = 0;
    /*
    CreatedBy: string;
    CreatedDate: Date;
    GroupId: string;
    PdDesc: string;
    PdId: string;
    PdName: string;
    PdStatus: string;
    UnitId: string;
    UnitName: string;
    UpdatedBy: string;
    UpdatedDate: Date;
    VatRate: number;
    VatType: string;
    */
  }
  
  export interface ShowVAT {
    VatType: string;
    VatTypeName: string;
    VatRate: number;
    TaxBase: number;
    VatAmt: number;
  }
/*
export class ModelFinBalance2{
    CompCode : string = "";
    BrnCode : string = "";
    LocCode : string = "";
    DocType : string = "";
    DocNo : string = "";
    DocDate : Date = null;
    DueDate : Date = null;
    CustCode : string = "";
    Currency : string = "";
    NetAmt : number = 0;
    NetAmtCur : number = 0;
    BalanceAmt : number = 0;
    BalanceAmtCur : number = 0;
    CreatedDate : Date = null;
    CreatedBy : string = "";
    UpdatedDate : Date = null;
    UpdatedBy : string = "";
}
*/