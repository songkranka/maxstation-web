export class ModelTransferOutQueryResource{
    compCode : string = "";
    brnCode : string = "";
    locCode : string = "";
    guid : string = "";
    fromDate : Date = null;
    toDate : Date = null;
    skip : number = 0;
    take : number = 0;
    keyword : string = "";
}
export class ModelGetRequestDtListQueryResource{
    compCode : string = "";
    brnCode : string = "";
    locCode : string = "";
    docNo : string = "";
    docTypeId : string = "";
}
export class ModelGetRequestHdListQueryResource{
    keyword : string = "";
    docTypeId : string = "";
    compCode : string = "";
    brnCodeFrom : string = "";
    docStatus : string = "";
    docNo : string = "";
    sysDate  : string = null;
}

export class ModelRequestHD{
    compCode : string = "";
    brnCode : string = "";
    locCode : string = "";
    docTypeId : string = "";
    docNo : string = "";
    docStatus : string = "";
    docDate : Date = null;
    brnCodeFrom : string = "";
    brnNameFrom : string = "";
    brnCodeTo : string = "";
    brnNameTo : string = "";
    remark : string = "";
    post : string = "";
    runNumber : number = 0;
    docPattern : string = "";
    guid : string = "";
    createdDate : Date = null;
    createdBy : string = "";
    updatedDate : Date = null;
    updatedBy : string = "";
    //---------------------[ Extra Field ]-----------//
    InvRequestDt : ModelRequestDT[] = [];
}
export class ModelRequestDT{
    compCode : string = "";
    brnCode : string = "";
    locCode : string = "";
    docTypeId : string = "";
    docNo : string = "";
    seqNo : number = 0;
    pdId : string = "";
    pdName : string = "";
    unitId : string = "";
    unitBarcode : string = "";
    unitName : string = "";
    itemQty : number = 0;
    stockQty : number = 0;
    stockRemain : number = 0;
}

export class ModelTransferOutHD {
    compCode : string = "";
    brnCode : string = "";
    locCode : string = "";
    docNo : string = "";
    docStatus : string = "New";
    docDate : Date | string = null;
    refNo : string = "";
    brnCodeTo : string = "";
    brnNameTo : string = "";
    remark : string = "";
    post : string = "";
    runNumber : number = 0;
    docPattern : string = "";
    guid : string = "70bd192a-5f15-40c5-b92a-5aee0655ef9b";
    createdDate : Date = null;
    createdBy : string = "";
    updatedDate : Date = null;
    updatedBy : string = "";
    //---------------------[ Extra Field ]-----------//
    listTransOutDt : ModelTransferOutDT[] = [];
    // refDocDate : Date = null;
}
export class ModelTransferOutDT{
    compCode : string = "";
    brnCode : string = "";
    locCode : string = "";
    docNo : string = "";
    seqNo : number = 0;
    pdId : string = "";
    pdName : string = "";
    unitId : string = "";
    unitBarcode : string = "";
    unitName : string = "";
    refQty : number = 0;
    itemQty : number = 0;
    stockQty : number = 0;
    stockRemain : number = 0;
}

export class ModelCheckStockRealtimeParam{
    public CompCode : string = "";
    public BrnCode : string = "";
    public DocDate : Date = null;
    public Json : string = "";
}

export class ModelStockRealTime{
    public PdId : string = "";
    public UnitId : string = "";
    public UnitBarCode : string = "";
    public ItemQty : number = 0;
    public Remain : number = 0;
}