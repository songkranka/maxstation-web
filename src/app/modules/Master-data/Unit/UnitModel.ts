import { ModelMasUnit } from "src/app/model/ModelScaffold";

export class ModelUnitParam{
    Keyword : string = "";
    Page : number = 0;
    ItemsPerPage : number = 0;
}

export class ModelUnitResult{
    public MasUnits : ModelMasUnit[] = [];
    public TotalItems : number = 0;
}
