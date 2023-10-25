export interface Withdraw {
    Row: number;
    JournalId: string; 
    SiteId: string; 
    BusinessDate: Date; 
    ShiftNo: string;
    PluNumber: string;
    SellQty: number;
    ItemName : string;
    ItemCode: string;
    SumWater: number;
    LicensePlate: string;
    CostCenter: string;
}

export class Withdrawsale {
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
    CustCode: string;
    CustName: string;
    Po: string;
    BrnCode: string;
    EmpCode: string;
    EmpName: string;
    UserBrnCode: string;
    ReasonId: string;
    SumItemAmount: number;
    SubAmount: number;
    TotalAmount: number;
    Remark: string;
}

export class SaveWithdrawSale{
    CompCode: string;
    BrnCode: string;
    LocCode: string;
    CreatedBy: string
    SystemDate: Date;
    _Withdraw: Withdrawsale[];
}