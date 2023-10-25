export class WithdrawDtModel {
  BrnCode: string;
  CompCode: string;
  DocNo: string;
  ItemQty: number;
  LicensePlate: boolean;
  LocCode: string;
  PdId: string;
  PdName: string;
  GroupId: string;
  SeqNo: number;
  StockQty: number;
  UnitBarcode: string
  UnitId: string;
  UnitName: string;
}

export class SelectedProduct {
  constructor(PdId: string, UnitId: string) {
    this.PdId = PdId
    this.UnitId = UnitId
  }
  PdId: string;
  UnitId: string;
}