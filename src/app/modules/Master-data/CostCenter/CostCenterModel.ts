import { ModelMasCostCenter} from "src/app/model/ModelScaffold";

export class ModelCostCenter{
    public Header : ModelMasCostCenter = null;
}

export class CostCenterListQuery{
    BrnCode : string = "";
    BrnName : string = "";
    MapBrnCode : string = "";
    Page : number = 0;
    ItemsPerPage : number = 0;
}

export class QueryResult<T>{
    TotalItems : number = 0;
    ItemsPerPage : number = 0;
    Items : T[] = null;
}

export class ModelCostCenterResult{
    public ArrayMasCostCenter : ModelMasCostCenter[] = [];
    // public ArrayEmployee : ModelMasEmployee[] = [];
    public TotalItems : number = 0;
}

export class ModelCostCenterParam{
    BrnCode : string = "";
    BrnName : string = "";
    MapBrnCode : string = "";
    CompCode : string = "";
    Keyword : string = "";
    Page : number = 0;
    ItemsPerPage : number = 0;
}

export class ModelCostCenterResource{
    MasCostCenter : ModelMasCostCenter = null;
}

