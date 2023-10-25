import { ModelSysMenu } from "src/app/model/ModelScaffold";

export class ModelAutPositionRole {
	CreatedBy : string = "";
	CreatedDate : Date = null;
	IsCancel : string = "";
	IsCreate : string = "";
	IsEdit : string = "";
	IsPrint : string = "";
	IsView : string = "";
	JsonData : string = "";
	MenuId : string = "";
	PositionCode : string = "";
	PostnameThai : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}
export class ModelMasPosition {
	CreatedBy : string = "";
	CreatedDate : Date = null;
	PositionCode : string = "";
	PositionDesc : string = "";
	PositionName : string = "";
	PositionStatus : string = "";
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
  	Guid : string = null;
}

export class BranchConfig {
	ItemNo : string = "";
	ConfigId : string = "";
	ConfigName : string = "";
	IsView : string = "";
}

export class SaveUnlock {
	PositionCode: string;
	_UnlockPosition: BranchConfig[];
}

export class ModelPosition {
  public Position : ModelMasPosition = new ModelMasPosition();
  public ArrPositionRole : ModelAutPositionRole[] = [];
}

export class ModelGetPositionListParam{
  public Keyword : string = "";
  public Page : number = 0;
  public ItemsPerPage : number = 0;
}

export class ModelGetPositionListResult{
  public ArrPosition : ModelMasPosition[] = [];
  public TotalItem : number = 0;
}

export class ModelJsonCheckbox{
  public PropName = "";
  public PropValue = false;
}
