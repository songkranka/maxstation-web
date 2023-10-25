import { ModelMasCustomer2 } from "src/app/model/ModelCommon";
import { ModelInvReturnSupDt, ModelInvReturnSupHd, ModelMasEmployee, ModelInfPoHeader } from "src/app/model/ModelScaffold";

export class ModelSupplierReturn{
    public Header : ModelInvReturnSupHd = new ModelInvReturnSupHd();
    public ArrayDetail : ModelInvReturnSupDt[] = [];
}

export class ModelSupplierReturnResult{
    public ArraySupplierReturnHeader : ModelInvReturnSupHd[] = [];
    public ArrayEmployee : ModelMasEmployee[] = [];
    public TotalItems : number = 0;
}
export class ModelSupplierReturnParam{
    public BrnCode : string = "";
    public CompCode : string = "";
    public LocCode : string = "";
    public Keyword : string = "";
    public FromDate : string = "";
    public ToDate : string = "";
    public Page : number = 0;
    public ItemsPerPage : number = 0;
}

export class PoHeaderListQuery extends ModelInfPoHeader{
    KeyWord : string = "";
}