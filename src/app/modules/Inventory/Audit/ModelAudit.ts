import { ModelInvAuditDt, ModelInvAuditHd, ModelInvStockDaily, ModelMasEmployee, ModelMasProduct } from "src/app/model/ModelScaffold";

export class ModelAudit{
    public Header : ModelInvAuditHd = null;
    public ArrayDetail : ModelInvAuditDt[] = null;
}

export class ModelAuditResult{
    public ArrayHeader : ModelInvAuditHd[] = null;
    public ArrayEmployee : ModelMasEmployee[] = null;
    public TotalItems : number = 0;
}

export class ModelAuditParam{
    public BrnCode : string = "";
    public CompCode : string = "";
    public LocCode : string = "";
    public FromDate : string = "";
    public ToDate : string = "";
    public Keyword : string = "";
    public Page : number = 0;
    public ItemsPerPage : number =0 ;
}
export class ModelAuditProduct{
    public ArrayProduct : ModelMasProduct[] = null;
    public ArrayStockDaily : ModelInvStockDaily[] = null;
}

export class ModelAuditProductParam{
    public CompCode : string = "";
    public BrnCode : string = "";
    public LocCode : string = "";
    public StockDate : string = "";
}