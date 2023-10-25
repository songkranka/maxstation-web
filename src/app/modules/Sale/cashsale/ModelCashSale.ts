import { ModelMasProduct, ModelMasProductPrice, ModelSalCashsaleDt, ModelSalCashsaleHd, ModelSalQuotationDt, ModelSalQuotationHd } from "src/app/model/ModelScaffold";

export class CurrencyModel {
    Currency: string;
    Rate: number;
  }
  
  export class DetailModel extends ModelSalCashsaleDt {
    SumAmt: number = 0;
    SumAmtCur: number = 0;
    GroupId: string;
  }
  
  export class HeaderModel extends ModelSalCashsaleHd {}
  
  export class ProductModel extends ModelMasProduct {
    UnitBarcode: string;
    UnitPrice: number;
    IsFree : boolean;
  }
  
  export interface ShowVAT {
    VatType: string;
    VatTypeName: string;
    VatRate: number;
    TaxBase: number;
    VatAmt: number;
  }
export class ModelCashSaleQuotationDetail extends ModelSalQuotationDt{    
    MasProductPrice : ModelMasProductPrice = null;
}
export class ModelCashSaleResource2{
    CashSaleHeader : ModelSalCashsaleHd = null;
    ArrCashSaleDetail : ModelSalCashsaleDt[] = null;
    QuotationHeader : ModelSalQuotationHd = null;
    ArrQuotationDetail : ModelSalQuotationDt[] = null;
}