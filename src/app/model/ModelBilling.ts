import { ModelMasEmployee, ModelSalBillingDt, ModelSalBillingHd, ModelSalCashsaleHd, ModelSalTaxinvoiceHd } from "./ModelScaffold";

// export class ModelSaleBillingHeader {
//     compCode : string = "";
//     brnCode : string = "";
//     locCode : string = "";
//     docNo : string = "";
//     docStatus : "Cancel" | "Success" | "Ready" | "Active" | "Reference" | "New" = "New";
//     docDate : Date | string = new Date();
//     custCode : string = "";
//     custPrefix: string = "";
//     custName : string = "";
//     custAddr1 : string = "";
//     custAddr2 : string = "";
//     creditLimit : number = 0;
//     creditTerm : number = 0;
//     dueType : string = "";
//     dueDate : Date = new Date();
//     itemCount : number = 0;
//     remark : string = "";
//     currency : string = "";
//     curRate : number = 0;
//     totalAmt : number = 0;
//     totalAmtCur : number = 0;
//     post : string = "";
//     runNumber : number = 0;
//     docPattern : string = "";
//     guid : string = "778935FF-2457-48D8-9B09-4AEBA52FD7BC";
//     createdDate : Date = new Date();
//     createdBy : string = "";
//     updatedDate : Date = new Date();
//     updatedBy : string = "";
// }
export class ModelSaleBillingHeader extends ModelSalBillingHd{

}

// export class ModelSaleBillingDetail {
//     compCode : string = "";
//     brnCode : string = "";
//     locCode : string = "";
//     docNo : string = "";
//     seqNo : number = 0;
//     txNo : string = "";
//     txDate : Date = null ;
//     txType : string = "";
//     txBrnCode : string = "";
//     txAmt : number = 0;
//     txAmtCur : number = 0;
// }
export class ModelSaleBillingDetail extends ModelSalBillingDt {}

export class ModelSearchBillingInput {
    page : number = 0;
    itemsPerPage : number = 0;
    brnCode : string = "";
    compCode : string = "";
    locCode : string = "";
    fromDate : Date = null;
    toDate : Date = null;
    keyword : string = "";
}
// export class ModelApiListOutput<T> {
//     totalItems : number = 0;
//     items : T[] = [];
//     itemsPerPage : number = 0;
// }
export class ModelGetBillingModalItemOutput extends ModelSalTaxinvoiceHd{
    // compCode : string = "";
    // brnCode : string = "";
    // locCode : string = "";
    // docNo : string = "";
    // docStatus : string = "";
    // docType : string = "";
    // docDate : Date = null;
    // custCode : string = "";
    // custName : string = "";
    // custAddr1 : string = "";
    // custAddr2 : string = "";
    // itemCount : number = 0;
    // currency : string = "";
    // curRate : number = 0;
    // subAmt : number = 0;
    // subAmtCur : number = 0;
    // discRate : string = "";
    // discAmt : number = 0;
    // netAmt : number = 0;
    // netAmtCur : number = 0;
    // vatRate : number = 0;
    // vatAmt : number = 0;
    // vatAmtCur : number = 0;
    // totalAmt  : number = 0;
    // totalAmtCur : number = 0;
    // post : string = "";
    // runNumber : number = 0;
    // docPattern : string = "";
    // guid : string = "";
    // createdDate : Date = null;
    // createdBy : string = "";
    // updatedDate : Date = null;
    // updatedBy : string = "";
}
export class ModelBillingResult{
    public ArrHeader : ModelSalBillingHd[] = [];
    public ArrEmployee : ModelMasEmployee[] = [];
    public TotalItems : number = 0;
}

export class ModelBilling2{
    public Header : ModelSalBillingHd = new ModelSalBillingHd();
    public ArrDetail : ModelSalBillingDt[] = [];
}