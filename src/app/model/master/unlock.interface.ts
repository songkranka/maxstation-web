export class SaveUnlock{
    CompCode: string;
    BrnCode: string;
    DocDate: Date
    EmpCode: string;
    CreatedBy: string;
    _Unlock: Unlock[];
    TotalItem: number;
}

export class Unlock {
    ItemNo: number;
    ConfigId: string;
    IsLock: string;
    StartDate: Date;
    EndDate: Date;
    Remark: string;
}