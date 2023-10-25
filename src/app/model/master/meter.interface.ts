import { SafeResourceUrl } from "@angular/platform-browser";
import { ModelDopPeriodCashGl,  ModelDopPeriodTankSum,  ModelMasBranchDisp, ModelMasBranchTank } from "../ModelScaffold";
export class MasBranchDispModel extends ModelMasBranchDisp {
    IsRequire: boolean = false;
    MeterStart: number = 0;
    MeterFinish: number = 0;
    SaleQty: number = 0;
    SaleAmt: number = 0;
    CashAmt: number = 0;
    CreditAmt: number = 0;
    DiscAmt: number = 0;
    CouponAmt: number = 0;
    RepairStart: number = 0;
    RepairFinish: number = 0;
    RepairQty: number = 0;
    TestStart: number = 0;
    TestQty: number = 0;
    Remark: string = "";
    PeriodStatus: string = "";
    Post: string = "";
    UnitPrice: number = 0;
    TotalQty: number = 0;
    CardAmt: number = 0;
}

export class MeterResponse {
    MasBranchDispItems: Array<MasBranchDispModel> = [];
    MasBranchTankItems: Array<MasBranchTankModel> = [];
    MasBranchCashDrItems: Array<ModelDopPeriodGl> = [];
    MasBranchCashCrItems: Array<ModelDopPeriodGl> = [];
}

export class MeterResponse2{
    StatusCode : number = 0;
    Status : string = "";
    Message : string = "";
}

export class MasBranchCashModel {
    CashAmt: number = 0;
    CompCode: string = "";
    CouponAmt: number = 0;
    CreditAmt: number = 0;
    DiscAmt: number = 0;
    MeterAmt: number = 0;
    PdId: string = "";
    PdName: string = "";
    SaleAmt: number = 0;
    TotalAmt: number = 0;
    UnitPrice: number = 0;
}

export class HeaderProductDisplay<T>{
    lastEffectiveDate: Date = null
    items: T[] = null;
}

export class ProductDisplay {
    constructor(
        PdId: string,
        PdName: string,
        PdImage: SafeResourceUrl,
        Unitprice: number
    ) {
        this.PdId = PdId
        this.PdName = PdName
        this.PdImage = PdImage
        this.Unitprice = Unitprice
    }
    PdId: string = "";
    PdName: string = "";
    PdImage: SafeResourceUrl = "";
    Unitprice: number = 0;
}

export class MasBranchSumCashModel {
    //show only ui
    SumMeterAmt: number = 0;
    SumSaleAmt: number = 0;
    SumCreditAmt: number = 0;
    SumCashAmt: number = 0;
    SumCouponAmt: number = 0;
    SumDiscAmt: number = 0;
    SumTotalAmt: number = 0;
    //---------------
    SumCrAmt: number = 0;
    SumDrAmt: number = 0;
    SumSlipAmt: number = 0;
    SumPosSlipAmt: number = 0;
    CashAmt: number = 0;
    RealAmt: number = 0;
    DepositAmt: number = 0;
    DiffAmt: number = 0;
}

export class MasBranchTankModel extends ModelMasBranchTank {
    IsRequire: boolean = false;
    PdImage: string = "";
    Unitprice: number = 0;
    BeforeQty: number = 0;
    ReceiveQty: number = 0;
    TransferQty: number = 0;
    IssueQty: number = 0;
    RemainQty: number = 0;
    WithdrawQty: number = 0;
    SaleQty: number = 0;
    Height: number = 0;
    RealQty: number = 0;
    DiffQty: number = 0;
    WaterHeight: number = 0;
    WaterQty: number = 0;
    Hold : string = "";
    HoldReasonId : string = "";
    HoldReasonDesc : string = "";
}

export class SumMasBranchTankModelByProduct extends ModelDopPeriodTankSum {
    PdImage: SafeResourceUrl = "";
    // PdId: string = "";
    // PdName: string = "";
    // BeforeQty: number = 0;
    // ReceiveQty: number = 0;
    // IssueQty: number = 0;
    // WithdrawQty: number = 0;
    // TransferQty: number = 0;
    // SaleQty: number = 0;
    // BalanceQty: number = 0;
    // AdjustQty: number = 0;

    constructor(
        PdImage: SafeResourceUrl,
        PdId: string,
        PdName: string,
        BeforeQty: number,
        ReceiveQty: number,
        IssueQty: number,
        WithdrawQty: number,
        TransferQty: number,
        SaleQty: number,
        BalanceQty: number,
        AdjustQty: number
    ) {
        super();
        this.PdImage = PdImage
        this.PdId = PdId
        this.PdName = PdName
        this.BeforeQty = BeforeQty
        this.ReceiveQty = ReceiveQty
        this.IssueQty = IssueQty
        this.WithdrawQty = WithdrawQty
        this.TransferQty = TransferQty
        this.SaleQty = SaleQty
        this.BalanceQty = BalanceQty
        this.AdjustQty = AdjustQty
    }

}

export class MeterDefective {
    Index: number = 0;
    RepairStart: number = 0;
    RepairFinish: number = 0;
    TestStart: number = 0;
    RepairQty: number = 0;
    TestQty: number = 0;
    MeterStart: number = 0;
    MeterFinish: number = 0;
    DispId : string = "";
}

export class Meter {
    PeriodStart: string = "";
    PeriodFinish: string = "";
    SumMeterSaleQty: number = 0;
    SumMeterTotalQty: number = 0;
    Employee: Array<string> = [];
    Items: Array<MasBranchDispModel> = [];
}

export class Tank {
    TankItems: Array<MasBranchTankModel> = [];
    SumTankItems: Array<SumMasBranchTankModelByProduct> = [];
}

export class ModelDopPeriodGl {
    GlAmt: number = 0;
    //main table
    CompCode: string = "";
    BrnCode: string = "";
    GlType: string = "";
    GlNo: string = "";
    GlDesc: string = "";
    GlLock: string = "";
    GlStatus: string = "";
    GlSlip: string = "";
    CreateDate: Date = null;
    CreateBy: string = "";
    UpdateDate: Date = null;
    UpdateBy: string = "";
    GlSeqNo : number = 0;
}

export class Cash {
    CashItems: Array<MasBranchCashModel> = [];
    SumCashItems: MasBranchSumCashModel = null;
    DrItems: Array<ModelDopPeriodGl> = [];
    CrItems: Array<ModelDopPeriodGl> = [];
}

export class SaveDocument {
    CompCode: string = "";
    BrnCode: string = "";
    DocDate: string = "";
    IsPos: string = "";
    User: string = "";
    PeriodNo: number = 0;
    Meter: Meter;
    Tank: Tank;
    Cash: Cash;
}

export class GetDocument {

    constructor(
        CompCode: string,
        BrnCode: string,
        DocDate: string,
        PeriodNo: number
    ) {
        this.CompCode = CompCode
        this.BrnCode = BrnCode
        this.DocDate = DocDate
        this.PeriodNo = PeriodNo
    }

    CompCode: string = "";
    BrnCode: string = "";
    DocDate: string = "";
    PeriodNo: number = 0;
}

export class DeleteDocument {
    constructor(compCode: string, brnCode: string, docDate: string, periodNo: number) {
        this.CompCode = compCode;
        this.BrnCode = brnCode;
        this.DocDate = docDate;
        this.PeriodNo = periodNo;
    }
    CompCode: string = "";
    BrnCode: string = "";
    DocDate: string = "";
    PeriodNo: number = 0;
}

export class GetDocumentResponse {
    PeriodNo: number = 0;
    IsPos: string;
    Post: string;
    Meter: Meter;
    Tank: Tank;
    Cash: Cash;
}


export class ResponseData<T>{
    StatusCode: number;
    Message: string;
    TotalItems: number;
    Data: T[] = null;
}