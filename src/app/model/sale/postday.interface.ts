import { ModelDopPostdayDt } from "../ModelScaffold";

export class ResponseData<T>{
  StatusCode: number;
  Message: string;
  TotalItems: number;
  Data: T = null;
}

export class GetDocumentRequest {
  constructor(
    CompCode: string,
    BrnCode: string,
    LocCode: string,
    DocDate: string,
    SystemDate: string,
  ) {
    this.CompCode = CompCode
    this.BrnCode = BrnCode
    this.LocCode = LocCode
    this.DocDate = DocDate
    this.SystemDate = SystemDate
  }
  CompCode: string;
  BrnCode: string;
  LocCode: string;
  DocDate: string;
  SystemDate: string;
}


export class AllData {
  DopPostdayHd: DopPostdayHd;
  CrItems: Array<DopPostdayDt>;
  DrItems: Array<DopPostdayDt>;
  FormulaItems: Array<Formula>;
  SumData: SumInDay;
  CheckBeforeSaveItems: Array<CheckBeforeSave>;
  ListValidatePostPaid : ModelMecPostPaidValidate[];
}

export class CheckBeforeSave {
  Label: string;
  PassValue: string;
  ValidNo : number;
  HaveValidSql : boolean;
}

export class DopPostdayHd {
  BrnCode: string;
  CompCode: string;
  DocDate: string;
  LocCode: string;
  User: string;
  Remark: string;
  CreatedBy: string;
  CashAmt: number;
  DiffAmt: number;
  DepositAmt: number;
  ChequeAmt: number;
}

export class DopPostdayDt extends ModelDopPostdayDt {
  constructor(
    Amount: number,
    BrnCode: string,
    CompCode: string,
    DocDate: string,
    DocFinish: number,
    DocNo: number,
    DocStart: number,
    DocType: string,
    LocCode: string,
    SeqNo: number,
    Total: number,
    TypeId: number,
    TypeName: string
  ) {
    super();
    this.Amount = Amount
    this.BrnCode = BrnCode
    this.CompCode = CompCode
    this.DocDate = DocDate
    this.DocFinish = DocFinish
    this.DocNo = DocNo
    this.DocStart = DocStart
    this.DocType = DocType
    this.LocCode = LocCode
    this.SeqNo = SeqNo
    this.Total = Total
    this.TypeId = TypeId
    this.TypeName = TypeName
  }
}

export class CsMasMapping {

  constructor(MapDesc: string, MapId: number) {
    this.MapDesc = MapDesc
    this.MapId = MapId
  }
  MapDesc: string;
  MapId: number;
}

export class SumInDay {
  SumCashAmt: number;
  SumDiffAmt: number;
  SumCashDepositAmt: number;
  SumChequeAmt: number;
}

export class Formula {
  FmNo: number;
  Remark: string;
  SourceAmount: number;
  DestinationAmount: number;
  Unit: string;

  constructor(
    Remark: string,
    SourceAmount: number,
    DestinationAmount: number,
    Unit: string
  ) {
    this.Remark = Remark
    this.SourceAmount = SourceAmount
    this.DestinationAmount = DestinationAmount
    this.Unit = Unit
  }

}

export  class AddStockParam{
  public CompCode : string = "";
  public BrnCode : string = "";
  public LocCode : string = "";
  public CreatedBy : string = "";
  public SysDate : Date = null;
}

export class AddStockMonthlyParam{
  public CompCode : string = "";
  public BrnCode : string = "";
  public LocCode : string = "";
  public CreatedBy : string = "";
  public Year : number =0;
  public Month : number =0;

}

export class GetDopValidDataParam{
  public ValidNo : number = 0;
  public CompCode : string = "";
  public BrnCode : string = "";
  public LocCode : string = "";
  public DocDate : string = "";
}

export class ModelMecPostPaidValidate{
  public MecCuscode : string = "";
  public MaxCusCode : string = "";
  public MecTotalBath : number = 0;
  public MaxCreditSaleSubAmt : number = 0;
  public IsValid : boolean = false;
}
