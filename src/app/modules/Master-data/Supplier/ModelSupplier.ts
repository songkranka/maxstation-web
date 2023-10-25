import { ModelMasSupplier, ModelMasSupplierProduct } from "src/app/model/ModelScaffold";

export class ModelSupplier{
  public Supplier : ModelMasSupplier = new ModelMasSupplier();
  public ArrSupProduct : ModelMasSupplierProduct[] = [];
}

export class ModelGetSupplierListResult{
  public TotalItem : number  = 0;
  public ArrSuplier : ModelMasSupplier[] = [];
}

export class ModelGetSupplierListParam{
  public KeyWord : string = "";
  public ItemPerPage : number = 0;
  public PageIndex : number = 0;
}
