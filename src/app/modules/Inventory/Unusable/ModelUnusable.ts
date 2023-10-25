import { ModelInvUnuseDt, ModelInvUnuseHd, ModelMasEmployee } from "src/app/model/ModelScaffold";

export class ModelUnusable{
    Header : ModelInvUnuseHd = null;
    ArrayDetail : ModelInvUnuseDt[] = null;
}

export class ModelUnusableResult{
    ArrayHeader : ModelInvUnuseHd[] = null;
    ArrayEmployee : ModelMasEmployee[] = null;
    TotalItems : number = 0;
}

export class ModelUnusableParam{
    BrnCode : string = "";
    CompCode : string = "";
    LocCode : string = "";
    FromDate : Date = null;
    ToDate : Date = null;
    Keyword : string = "";
    Page : number = 0;
    ItemsPerPage : number = 0;
}