import { ModelMasBranch, ModelMasEmployee, ModelMasProduct, ModelPriNonoilDt, ModelPriNonoilHd } from "src/app/model/ModelScaffold";

export class ModelNonOilPrice{
    public Header : ModelPriNonoilHd = null;
    public ArrDetail : ModelPriNonoilDt[] = null;
}

export class ModelNonOilDetail extends ModelMasProduct{

    constructor() {
        super();
        this.ArrayBranch.push(new ModelNonOilBranch());
    }
    public ArrayBranch : ModelNonOilBranch[] = [];
}

export class ModelNonOilBranch extends ModelMasBranch{
    public CurrentPrice : number = 0.00;
    public BeforePrice : number = 0.00;
    public AdjustPrice : number = 0.00;
}

export class ModelNonOilPriceParam{
    public BrnCode : string = "";
    public CompCode : string = "";
    public FromDate : Date = null;
    public ToDate : Date = null;
    public Keyword : string = "";
    public Page : number = 0;
    public ItemsPerPage : number = 0;
}

export class ModelNonOilPriceResult{
    public ArrayHeader : ModelPriNonoilHd[] = [];
    public ArrayEmployee : ModelMasEmployee[] = [];
    public TotalItems : number = 0;
}