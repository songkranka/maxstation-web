export interface AdjustRequest {
    docDate: Date;
    docNo: string;
    brnCode: string;
    docStatus: string;
    reasonDesc: string;
    guid: string;
}



export interface AdjustRequestData<T> {
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