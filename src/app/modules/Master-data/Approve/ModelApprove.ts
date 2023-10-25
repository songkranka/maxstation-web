import { ModelMasEmployee, ModelSysApproveHd, ModelSysApproveStep } from "src/app/model/ModelScaffold";

export class ModelApprove {
    public Header : ModelSysApproveHd = null;
    public ArrayStep : ModelSysApproveStep[] = [];
}
export class ModelApproveStep extends ModelSysApproveStep{
    public IsCheck : boolean = false;
    public DocName : string = "";
    public BrnName : string = "";
}
export class ModelArrayApprove{
    public ArrayHeader : ModelSysApproveHd[] = [];
    public ArrayStep : ModelSysApproveStep[] = [];
    public ArrayEmployee : ModelMasEmployee[] = [];
}

export class ModelApproveParam{
    public DocNo : string = "";
    public CompCode : string = "";
    public BrnCode : string = "";
    public LocCode : string = "";
    public DocType : string = "";
}

export class ModelSearchApproveParam{
    public KeyWord : string = "";
    public StartDate : Date = null;
    public EndDate : Date = null;
    public EmpCode : string = "";
    public PageIndex : number = 0;
    public ItemPerPage : number = 0;
}

export class ModelSearchApproveResult{
    public ArrApproveHeader : ModelSysApproveHd[] = [];
    public ArrEmployee : ModelMasEmployee[] = [];
    public TotalItem : number = 0;
}