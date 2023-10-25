export interface Receive {
    Row: number;
    CustCode: string;
    JournalId: string; 
    SiteId: string; 
    BusinessDate: Date;
    ShiftNo: string; 
    PluNumber: string;
    ItemName: string;
    SellQty: number;
    SellPrice: number;
    GoodsAmt: number;
    TaxAmt: number;
    DiscAmt: number;
    SumItemAmt: number;
    SubAmt: number;
    TotalAmt: number;
}

export class SaveReceive{
    CompCode: string;
    BrnCode: string;
    LocCode: string;
    CreatedBy: string
    SystemDate: Date;
    _POSReceives: POSReceive[];
}

export class POSReceive {
    Row: number
    CustCode: string;
    JournalId: string;
    SiteId: string;
    BusinessDate: Date;
    ShiftNo: string;
    PluNumber: string;
    ItemName: string;
    SellQty: number;
    SellPrice: number;
    GoodsAmt: number;
    TaxAmt: number;
    DiscAmt: number;
    SumItemAmt: number;
    SubAmt: number;
    TotalAmt: number;
}

