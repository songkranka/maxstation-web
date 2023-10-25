import { ModelInfPoHeader, ModelInfPoItem, ModelInvReceiveProdDt, ModelInvReceiveProdHd, ModelMasProduct, ModelMasDensity, ModelMasSupplier, ModelMasMapping } from "src/app/model/ModelScaffold";

export class ReceiveOilQuery{
    InvReceiveProdHd : ModelInvReceiveProdHd = null;
    InvReceiveProdDts : ModelInvReceiveProdDt[] = null;
}
export class PoHeader{
    Header: ModelInfPoHeader = null;
}

export class ReceiveOilListQuery{
    BrnCode : string = "";
    CompCode : string = "";
    LocCode : string = "";
    DocType : string ="";
    FromDate : Date = null;
    ToDate : Date = null;
    Keyword : string = "";
    Page : number = 0;
    ItemsPerPage : number = 0;
}

export class QueryResult<T>{
    TotalItems : number = 0;
    ItemsPerPage : number = 0;
    Items : T[] = null;
}

export class PoHeaderListQuery {
    BranchCode: string = "";
    CompCode: string = "";
    SystemDate: Date;
    KeyWord : string = "";
}
export class PoItemListResult{
    ArrProduct : ModelMasProduct[] = null;
    ArrPoItem : ModelInfPoItem[] = null;
    Density : ModelMasDensity = null;
}

export class PoItemListParam{
    public PoNumber : string = "";
    public CompCode : string = "";
    public SystemDate : Date = null;
}

export class ModelSupplierResult{
    public Supplier : ModelMasSupplier = null;
    public ArrayMapping : ModelMasMapping[] = null;
}