import { HttpErrorResponse } from '@angular/common/http';
import Swal from 'sweetalert2';
export class GetTransOutHdListQueryResource {
    keyword: string = "";
    compCode: string = "";
    brnCodeTo: string = "";
    sysDate: string = "";
}

export class ModelTransferInHeader {
    compCode: string = "";
    brnCode: string = "";
    locCode: string = "";
    docNo: string = "";
    docStatus: string = "New";
    docDate: Date | string = null;
    refNo: string = "";
    refDate: Date | string = null;
    brnCodeFrom: string = "";
    brnNameFrom: string = "";
    remark: string = "";
    post: string = "";
    runNumber: number = 0;
    docPattern: string = "";
    guid: string = "5d5c95c6-c211-451e-80e1-7b8f040b1fcc";
    createdDate: Date = null;
    createdBy: string = "";
    updatedDate: Date = null;
    updatedBy: string = "";

    //------------------[ Extra Field ]-----------------//
    listTransferInDetail: ModelTransferInDetail[] = [];
}

export class ModelTransferInDetail {
    compCode: string = "";
    brnCode: string = "";
    locCode: string = "";
    docNo: string = "";
    seqNo: number = 0;
    pdId: string = "";
    pdName: string = "";
    unitId: string = "";
    unitBarcode: string = "";
    unitName: string = "";
    itemQty: number = 0;
    stockQty: number = 0;
}

export class ModelResponseData<T>{
    errorStackTrace: string = "";
    errormessage: string = "";
    data: T = null;
    isSuccess: boolean = false;
    totalItems: number = 0;
    ReceiveApiData(pInputData: any) {
        if (pInputData == null) {
            return;
        }
        this.errorStackTrace = (pInputData?.errorStackTrace || "").toString().trim();
        this.errormessage = (pInputData?.errormessage || "").toString().trim();
        this.data = pInputData?.data;
        this.isSuccess = pInputData?.isSuccess || false;
        this.totalItems = parseInt(pInputData?.totalItems) || 0;
    }
    ShowErrorPopup() {
        let strMessage: string = (this.errormessage || "").toString().trim();
        let strStackTrace: string = (this.errorStackTrace || "").toString().trim();
        if (strMessage !== "" || strStackTrace !== "") {
            Swal.fire(strMessage, strStackTrace, "error");
        } else {
            Swal.close();
        }
    }
    SetHttpException(pException: HttpErrorResponse) {
        if (pException == null) {
            return;
        }
        this.isSuccess = false;
        this.errormessage = (pException.message || "").toString().trim();
        if (typeof pException.error === "string") {
            this.errorStackTrace = (pException.error || "").toString().trim();
        } else if (Array.isArray(pException.error)
            || pException.error.length
            || typeof pException.error[0] === "string"
        ) {
            this.errorStackTrace = (pException.error[0] || "").toString().trim();
        }
    }

}

export class ModelSearchTranInQueryResource {
    compCode: string = "";
    brnCode: string = "";
    locCode: string = "";
    guid: string = "";
    fromDate: string = null;
    toDate: string = null;
    skip: number = 0;
    take: number = 0;
    keyword: string = "";
}