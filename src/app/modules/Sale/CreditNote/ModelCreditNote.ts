import { ModelFinBalance, ModelMasCustomer, ModelSalCndnDt, ModelSalCndnHd, ModelSalTaxinvoiceHd } from "src/app/model/ModelScaffold";

export class CreditNoteQueryResource2 {
    CreditNoteHeader: ModelSalCndnHdTwo = new ModelSalCndnHdTwo();
    ArrCreditNoteDetail: ModelSalCndnDt[] = [];
    FinBalance: ModelFinBalance = new ModelFinBalance();
}

export class ModelSalCndnHdTwo extends ModelSalCndnHd {
    CustPrefix: string = "";
}

export enum EnumApiStatus {
    Failure = 0, Success = 1, TimeOut = 2
}
export enum EnumDocStatus {
    Cancel = "Cancel",
    New = "New",
    Ready = "Ready",
    Reference = "Reference",
    Save = "Save",
    Active = "Active"
}
export type EnumDocType = "CreditNote" | "DebitNote" | "";

export enum EnumProductStatus {
    Show, Hide, Select
}
export enum EnumVatType {
    VI = "VI",
    VE = "VE",
    NV = "NV",
    ZV = "ZV"
}
export class ModelGetCustomerListInput {
    compCode: string = "";
    brnCode: string = "";
    locCode: string = "";
    pdGroupID: string = "";
    docNo: string = "";
    docType: string = "";
    docDate: Date = null;
    keyword: string = "";
    pdListID: string = "";
}
export class ModelInsertCreditSalesQuery {
    creditSaleHeader: ModelCreditNoteHeader = null;
    arrCreditSaleDetail: ModelCreditSalesDetail[] = null;
}

export class ModelCreditNoteHeader {
    compCode: string = "";
    brnCode: string = "";
    locCode: string = "";
    docType: EnumDocType = "CreditNote";
    docNo: string = "";
    docStatus: EnumDocStatus = EnumDocStatus.New;
    docDate: Date | string = new Date();
    period: string = "";
    refNo: string = "";
    custCode: string = "";
    custName: string = "";
    custAddr1: string = "";
    custAddr2: string = "";
    itemCount: number = 0;
    remark: string = "";
    currency: string = "THB";
    curRate: number = 1;
    subAmt: number = 0;
    subAmtCur: number = 0;
    discRate: string = "";
    discAmt: number = 0;
    discAmtCur: number = 0;
    totalAmt: number = 0;
    totalAmtCur: number = 0;
    taxBaseAmt: number = 0;
    taxBaseAmtCur: number = 0;
    vatRate: number = 0;
    vatAmt: number = 0;
    vatAmtCur: number = 0;
    netAmt: number = 0;
    netAmtCur: number = 0;
    txNo: string = "";
    post: string = "";
    runNumber: number = 0;
    docPattern: string = "";
    posNo: string = "";
    guid: string = "4b871978-a0a7-4cf5-9332-81fda9daaa58";
    createdDate: Date = null;
    createdBy: string = "";
    updatedDate: Date = null;
    updatedBy: string = "";
}

export class ModelCreditSalesHeader2 {
    compCode: string = "";
    brnCode: string = "";
    locCode: string = "";
    docType: EnumDocType = "";
    docNo: string = "";
    docStatus: EnumDocStatus = EnumDocStatus.New;
    docDate: Date | string = new Date();
    period: string = "";
    refNo: string = "";
    custCode: string = "";
    custName: string = "";
    custAddr1: string = "";
    custAddr2: string = "";
    itemCount: number = 0;
    remark: string = "";
    currency: string = "";
    curRate: number = 0;
    subAmt: number = 0;
    subAmtCur: number = 0;
    discRate: string = "";
    discAmt: number = 0;
    discAmtCur: number = 0;
    totalAmt: number = 0;
    totalAmtCur: number = 0;
    taxBaseAmt: number = 0;
    taxBaseAmtCur: number = 0;
    vatRate: number = 0;
    vatAmt: number = 0;
    vatAmtCur: number = 0;
    netAmt: number = 0;
    netAmtCur: number = 0;
    txNo: string = "";
    post: string = "N";
    runNumber: number = 0;
    docPattern: string = "";
    guid: string = "";
    createdDate: Date = null;
    createdBy: string = "";
    updatedDate: Date = null;
    updatedBy: string = "";

}
export class ModelCreditSalesDetail {
    compCode: string = "";
    brnCode: string = "";
    locCode: string = "";
    docType: string = "";
    docNo: string = "";
    seqNo: number = 0;
    poNo: string = "";
    licensePlate: string = "";
    mile: number = 0;
    pdId: string = "";
    pdName: string = "";
    isFree: string = "";
    unitId: string = "";
    unitBarcode: string = "";
    unitName: string = "";
    meterStart: number = 0;
    meterFinish: number = 0;
    itemQty: number = 0;
    stockQty: number = 0;
    unitPrice: number = 0;
    unitPriceCur: number = 0;
    refPrice: number = 0;
    refPriceCur: number = 0;
    sumItemAmt: number = 0;
    sumItemAmtCur: number = 0;
    discAmt: number = 0;
    discAmtCur: number = 0;
    discHdAmt: number = 0;
    discHdAmtCur: number = 0;
    subAmt: number = 0;
    subAmtCur: number = 0;
    vatType: EnumVatType = EnumVatType.NV;
    vatRate: number = 0;
    vatAmt: number = 0;
    vatAmtCur: number = 0;
    taxBaseAmt: number = 0;
    taxBaseAmtCur: number = 0;
    totalAmt: number = 0;
    totalAmtCur: number = 0;
}
export class ModelGetCustomerListOutput extends ModelMasCustomer {
    // CustCode: string = "";
    // CustName: string = "";
    // CustStatus: string = "";
    // CustPrefix: string = "";
    // Address: string = "";
    // SubDistrict: string = "";
    // District: string = "";
    // Province: string = "";
    // Postcode: string = "";
    // Phone: string = "";
    // Fax: string = "";
    // RegisterId: string = "";
    // ContactName: string = "";
    // BillType: string = "";
    // DueType: string = "";
    // AccountId: string = "";
    // CompCode: string = "";
    // BrnCode: string = "";
    // CreditLimit: number = 0;
    // CreditTerm: number = 0;
    // CreatedDate: Date = null;
    // CreatedBy: string = "";
    // UpdatedDate: Date = null;
    // UpdatedBy: string = "";
}

export class ModelGetProductServiceOutput {
    pdId: string = "";
    pdName: string = "";
    vatType: EnumVatType = EnumVatType.NV;
    vatRate: number = 0;
    status: EnumProductStatus = EnumProductStatus.Show;
}

export class ModelApiMasterResult<T>{
    StatusCode: number = 200;
    message: string = "";
    Data: T = null;
}

export class ModelApiResult<T> {
    status: EnumApiStatus = EnumApiStatus.Success;
    result: T = null;
    errorMessage: string = "";
    errorStackTrace: string = "";
}
export class ModelMasDocPattern {
    ItemId: string = "";
    DocId: string = "";
    SeqNo: number = 0;
    DocCode: string = "";
    DocValue: string = "";
}

export class ModelSearchTaxInvoiceParam{
  CompCode: string = "";
  CustCode: string = "";
  DocNo: string = "";
  Page: number = 0;
  ItemsPerPage: number = 0;
}

export class ModelSearchTaxInvoiceResult{
  ArrTaxInvoice : ModelSalTaxinvoiceHd[] = [];
  TotalItem : number = 0;
}
