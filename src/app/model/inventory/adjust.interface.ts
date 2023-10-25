import { ModelInvAdjustDt, ModelInvAdjustHd } from "../ModelScaffold";

export interface Adjust {
    docDate: Date;
    docNo: string;
    docStatus: string;
    brnCodeFrom: string;
    brnNameFrom: string;
    guid: string;
}

export interface AdjustData<T> {
    items: T[],
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;

    message: string;
    isSuccess: boolean;

    links: {
        first: string;
        previous: string;
        next: string;
        last: string;
    }
};

export class CsModelAdjustHd extends ModelInvAdjustHd {
    InvAdjustDt: Array<ModelInvAdjustDt>;
}