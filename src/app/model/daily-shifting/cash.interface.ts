import { ModelSalCashsaleDt, ModelSalCashsaleHd } from "src/app/model/ModelScaffold";

export interface Cash {
    Row: number;
    JournalId: string; 
    SiteId: string; 
    BusinessDate: Date; 
    ShiftNo: string;
    TaxInvNo: string;
    TotalGoodAmt: number;
    TotalDiscAmt: number;
    TotalTaxAmt: number;
    TotalPaidAmt: number;
    PluNumber: string;
    SellQty: number;
    SellPrice: number;
    GoodsAmt: number;
    TaxAmt: number;
    DiscAmt: number;
    BillNo: string; 
    ItemName: string;
    ItemCode: string;
    SumItemAmt: number;
    SubAmt: number;
    TotalAmt: number;
    EmpCode: string;
    EmpName: string;
}

export class Cashsale {
    Row: number
    JournalId: string;
    SiteId: string;
    BusinessDate: Date;
    ShiftNo: string;
    TaxInvNo: string;
    TotalGoodsAmt: number;
    TotalDiscAmt: number;
    TotalTaxAmt: number;
    TotalPaidAmt: number;
    PluNumber: string;
    SelQty: number;
    SalePrice: number;
    GoodsAmt: number;
    TaxAmt: number;
    DiscAmt: number;
    BillNo: string;
    ItemName: string;
    ItemCode: string;
    SumItemAmount: number;
    SubAmount: number;
    TotalAmount: number;
    EmpCode: string;
    EmpName: string;
} 

export class SaveCashSale{
    CompCode: string;
    BrnCode: string;
    LocCode: string;
    CreatedBy: string
    SystemDate: Date;
    _Cashsale: Cashsale[];
    TotalItem: number;
}