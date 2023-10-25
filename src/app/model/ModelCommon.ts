import { ModelMasCustomer, ModelSalCreditsaleDt, ModelSalCreditsaleHd, ModelSalQuotationDt, ModelSalQuotationHd, ModelInfPoHeader } from "./ModelScaffold";

export class ModelBranch {
    CompCode : string = "";
    BrnCode : string = "";
    MapBrnCode : string = "";
    BrnName : string = "";
    BrnStatus : string = "";
    Address : string = "";
    SubDistrict : string = "";
    District : string = "";
    Province : string = "";
    Postcode : string = "";
    Phone : string = "";
    Fax : string = "";
    CreatedDate : Date = null;
    CreatedBy : string = "";
    UpdatedDate : Date = null;
    UpdatedBy : string = "";
}
export class ModelMasCustomer2 extends ModelMasCustomer{
    CustAddr1 : string = "";
    CustAddr2 : string = "";
}
export class ModelException {
    message : string = "";
    stackTrace : string = "";
    compCode : string = "";
    brnCode : string = "";
    locCode : string = "";
    user : string = "";
    status : number = 0;
}

export class ModelProduct {
    seqNo : number = 0;
    pdId : string = "";
    pdName : string = "";
    vatType : "VI" | "VE" | "NV" | "ZV" = "ZV";
    vatRate : number = 0;
    status : "Show" | "Hide" | "Select" = "Show";
}
export class ModelMasDocPattern{
    ItemId : string = "";
    DocId : string = "";
    SeqNo : number = 0;
    DocCode : string = "";
    DocValue : string = "";
}

export class ModelHiddenButton{
    status = "";
    btnApprove = true;
    btnBack = true;
    btnCancel = true;
    btnClear = true;
    btnComplete = true;
    btnPrint = true;
    btnReject = true;
    btnSave = true;
}

export class ModelHeaderDetail<Header , Detail>{
    header : Header = null;
    arrDetail : Detail[] = null;
}
export class ModelMaxCardProfile{
    response : {
        resCode : string ,
        resMsg : string
    } = null;
    data : {
        WsTransID : string,
        CardNo : string,
        CardStatus : string,
        CardType : string,
        FName : string,
        LName : string,
        CitizenType : string,
        CitizenID : string,
        PhoneNo : string,
        CustomerStatus : string,
        ActivateDate : string,
        ActivateShop : string,
        CarType : string,
        SpecialLimit : string,
        NormalPoint : string,
        SpecialPoint : string,
    } = null;
}


export class ModelTaxProfile{
    statusCode : number;
    message : string;
    data : {
        nid : string,
        titleName : string,
        // name : string,
        surname : string,
        branchTitleName : string,
        branchName : string,
        branchNumber : string,
        buildingName : string,
        floorNumber : string,
        villageName : string,
        roomNumber : string,
        houseNumber : string,
        mooNumber : string,
        soiName : string,
        streetName : string,
        thumbolName : string,
        amphurName :string,
        provinceName : String;
        postCode : string;
        telephone : string;
        fax :string;
        email : string;
        custCode : string;
    } = null;
}

// export class ModelMaxCardProfile{
//     WsTransID : string = "";
//     CardNo : string = "";
//     CardStatus : string = "";
//     CardType : string = "";
//     FName : string = "";
//     LName : string = "";
//     CitizenType : string = "";
//     CitizenID : string = "";
//     PhoneNo : string = "";
//     CustomerStatus : string = "";
//     ActivateDate : string = "";
//     ActivateShop : string = "";
//     CarType : string = "";
//     SpecialLimit : string = "";
//     NormalPoint : string = "";
//     SpecialPoint : string = "";
// }
export class ModelResponseData<T>{
    statusCode : number = 0;
    message : string = "";
    data : T = null;
    totalItems : number;
}

export class ModelSalQuotationHd2 extends ModelSalQuotationHd{
    SumStockRemain : number = 0;
    SalQuotationDt : ModelSalQuotationDt[] = [];
}

export class ModelSalCreditSal extends ModelSalCreditsaleHd{
    SalCreditsaleDt : ModelSalCreditsaleDt[] = [];
}

export class PoHeader2 extends ModelInfPoHeader{
    SupplierName : string = "";
}

export class ModelGetNotiParam{
    public CompCode : string = "";
    public BrnCode : string = "";
}
