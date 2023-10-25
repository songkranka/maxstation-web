import { ModelProduct } from "src/app/model/ModelCommon";
import { ModelMasEmployee, ModelMasProduct, ModelMasProductPrice, ModelOilStandardPriceDt, ModelOilStandardPriceHd } from "src/app/model/ModelScaffold";

export class ModelStandardPrice {
    public Header : ModelOilStandardPriceHd = null;
    public ArrayDetail : ModelOilStandardPriceDt[] = null;
}
export class ModelStandardPriceParam{
    public BrnCode : string = "";
    public CompCode : string = "";
    public FromDate : Date = null;
    public ToDate : Date = null;
    public Keyword : string = "";
    public Page : number = 0;
    public ItemsPerPage : number = 0;
}
export class ModelStandardPriceResult{
    public ArrayHeader : ModelOilStandardPriceHd[] = null;
    public ArrayEmployee : ModelMasEmployee[] = null;
    public TotalItems : number = 0;
}
export class ModelStandardPriceProduct{
    public ArrayProduct : ModelMasProduct[] = null;
    public ArrayProductPrice : ModelMasProductPrice[] = null;
    public ArrayStandardPriceDetail : ModelOilStandardPriceDt[] = null;
}
export class ModelStandardPriceDisplay{
    public Product : ModelMasProduct = null;
    public StandardPriceDt : ModelOilStandardPriceDt = null;
}
export class ModelOtherDisplay{
    public BrnCode : string = "";
    public ArrDiesel : ModelStandardPriceDisplay[] = [];
    public ArrBenzine : ModelStandardPriceDisplay[] = [];
    public ArrGas : ModelStandardPriceDisplay[] = [];
}

