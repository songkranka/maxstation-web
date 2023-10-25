export interface Credit {
    Row: number;
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
    SellQty: number;
    SellPrice: number;
    GoodsAmt: number;
    TaxAmt: number;
    DiscAmt: number;
    BillNo: string; 
    ItemName: string;
    ItemCode: string;
    CustomerId: string;
    LicNo: string;
    Miles: string;
    Po: string;
    SumItemAmt: number;
    SubAmt: number;
    TotalAmt: number;
    LicensePlates: string[];
    IsCustomerCompany: boolean;
    EmpCode: string;
    EmpName: string;
}

export class Creditsale {
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
    LicensePlate: string;
    Mile: string;
    CustCode: string;
    CustName: string;
    Po: string;
    SumItemAmount: number;
    SubAmount: number;
    TotalAmount: number;
    EmpCode: string;
    EmpName: string;
}

export class SaveCreditSale{
    CompCode: string;
    BrnCode: string;
    LocCode: string;
    CreatedBy: string
    SystemDate: Date;
    _Creditsale: Creditsale[];
    TotalItem: number;
}