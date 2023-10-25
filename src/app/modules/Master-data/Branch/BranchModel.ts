import { Data } from "@angular/router";
import { ModelMasBranch,ModelMasBranchConfig,ModelMasBranchDisp,ModelMasBranchTank,ModelMasBranchTax,ModelMasEmployee } from "src/app/model/ModelScaffold";

export class ModelBranch{
    public Header : ModelMasBranch = null;
    public ArrayDetailTank: ModelMasBranchTank[] = [];
    public ArrayDetailDisp : ModelMasBranchDisp[] = [];
    public ArrayDetailTax : ModelMasBranchTax[] = [];
}

export class BranchListQuery{
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

export class ModelBranchResult{
    public ArrayMasBranch : ModelMasBranch[] = [];
    // public ArrayEmployee : ModelMasEmployee[] = [];
    public TotalItems : number = 0;
}

export class ModelBranchParam{
    public BrnCode : string = "";
    public CompCode : string = "";
    public LocCode : string = "";
    public Keyword : string = "";
    public FromDate : Date = null;
    public ToDate : Date = null;
    public Page : number = 0;
    public ItemsPerPage : number = 0;
}

export class ModelBranchResource{
    MasBranchConfig : ModelMasBranchConfig = null;
    MasBranch : ModelMasBranch = null;
}

export class ModelBranchTankResource{
    MasBranchTanks : ModelMasBranchTank[] = null;
    MasBranchDisps : ModelMasBranchDisp[] = null;
}

export class ModelBranchTaxResource{
    MasBranchConfig : ModelMasBranchConfig = null;
    MasBranchTaxs : ModelMasBranchTax[] = null;
}
