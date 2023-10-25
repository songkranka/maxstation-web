import { ModelMasCustomer2 } from "src/app/model/ModelCommon";
import { ModelInfPoItem, ModelInvReturnOilDt, ModelInvReturnOilHd, ModelMasEmployee, ModelMasProduct, ModelMasProductUnit, ModelMasUnit, ModelInfPoHeader } from "src/app/model/ModelScaffold";

export class ModelReturnOil{
    public Header : ModelInvReturnOilHd = new ModelInvReturnOilHd();
    public ArrayDetail : ModelInvReturnOilDt[] = [];
}

export class ModelReturnOilResult{
    public ArrayReturnOilHeader : ModelInvReturnOilHd[] = [];
    public ArrayEmployee : ModelMasEmployee[] = [];
    public TotalItems : number = 0;
}
export class ModelReturnOilParam{
    public BrnCode : string = "";
    public CompCode : string = "";
    public LocCode : string = "";
    public Keyword : string = "";
    public FromDate : Date = null;
    public ToDate : Date = null;
    public Page : number = 0;
    public ItemsPerPage : number = 0;
}

export class ModelGetArrayPoItemResult{
    public ArrPoItem : ModelInfPoItem[] = [];
    public ArrayProduct : ModelMasProduct[] = [];
    public ArrayUnit : ModelMasUnit[] = [];
}

export class PoHeaderListQuery extends ModelInfPoHeader{
    KeyWord : string = "";
}