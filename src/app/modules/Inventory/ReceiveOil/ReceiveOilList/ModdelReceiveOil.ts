import { ModelInfPoHeader, ModelInfPoItem, ModelInvReceiveProdDt, ModelInvReceiveProdHd, ModelMasProduct } from "src/app/model/ModelScaffold";

export class ReceiveOilQuery{
    Header : ModelInvReceiveProdHd = null;
    Details : ModelInvReceiveProdDt[] = null;
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

export class PoHeaderListQuery extends ModelInfPoHeader{
    KeyWord : string = "";
}
export class PoItemListResult{
    ArrProduct : ModelMasProduct[] = null;
    ArrPoItem : ModelInfPoItem[] = null;
}