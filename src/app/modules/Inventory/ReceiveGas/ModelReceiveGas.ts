import { ModelInfPoHeader, ModelInfPoItem, ModelInvReceiveProdDt, ModelInvReceiveProdHd, ModelMasDensity, ModelMasMapping, ModelMasProduct, ModelMasSupplier, ModelMasUnit } from "src/app/model/ModelScaffold";

export class ReceiveGasQuery{
    Header : ModelInvReceiveProdHd = null;
    Details : ModelInvReceiveProdDt[] = null;
}

export class ReceiveGasListQuery{
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

export class PoHeaderListQuery{
    KeyWord : string = "";
    CompCode : string = "";
    SystemDate : Date = null;
    BrnCode : string = "";
}
export class PoItemListResult{
    ArrProduct : ModelMasProduct[] = null;
    ArrPoItem : ModelInfPoItem[] = null;
    ArrUnit : ModelMasUnit[] = null;
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
