export interface Withdraw {
    docDate: Date;
    docNo: string;
    docStatus: string;
    useBy: string;
    guid: string;
    empCode : string;
    empName : string;
    DocDate: Date;
    DocNo: string;
    DocStatus: string;
    UseBy:number;
    Guid: string;
}
  
  

export interface WithdrawData<T> {
    items: T[],
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;

    message:string;
    isSuccess:boolean;

    links: {
        first: string;
        previous: string;
        next: string;
        last: string;
    }
};