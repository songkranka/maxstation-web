export interface Expense {
	docNo : string;
    docStatus : string;
    docDate : Date;
    workType : string;
    workStart : string;
    workFinish : string;
    guid: string;
}

export class ExpenseHd {
    CompCode : string = "";
	BrnCode : string = "";
	LocCode : string = "";
	DocNo : string = "";
    DocStatus : string = "";
    DocDate : Date;
    WorkType : string = "";
    WorkStart : string = "";
    WorkFinish : string = "";
    Remark : string = "";
    Post : string = "";
    RunNumber : number = 0;
    DocPattern : string = "";
    Guid : string = "e5bd53d1-4b16-4b15-b482-d8361496d2fc";
	CreatedBy : string = "";
    CreatedDate : Date = null;
	UpdatedBy : string = "";
	UpdatedDate : Date = null;
}

export class ExpenseEss {
    Id : number;
	EssNumber : string = "";
	EssDetail : string = "";
    Delete : string = "";
}

export class ExpenseTable {
    Id: string = "";
    Header: string = "";
    IsExpanded: boolean;
    Body: ExpenseTableBody[];
}

export class ExpenseTableBody {
    CategoryId: string
    IndexListId: number;
    Title: string;
    Qty: number;
    DisabledQty: string;
    Unit: string;
    Data: string;
    Number: number;
    Delete: number;
    IsDelete: boolean;
    IsExpanded: boolean;
    SeqNo: number;
}

export class SaveExpense {
    FinExpenseHd: FinExpenseHd
    ExpenseTables: ExpenseTable[]
    ExpenseEssTables: ExpenseEss[]
}

export class FinExpenseHd {
    CompCode : string
	BrnCode : string
	LocCode : string
	DocNo : string
    DocStatus : string
    DocDate : Date
    WorkType : string
    WorkStart : string
    WorkFinish : string
    Remark : string
    Post : string
    RunNumber : number
    DocPattern : string
    Guid : string
	CreatedBy : string
    CreatedDate : Date
	UpdatedBy : string
	UpdatedDate : Date
}

export class FinExpenseDt {
    CompCode: string;
    BrnCode: string;
    LocCode: string;
    DocNo: string;
    SeqNo: number;
    ExpenseNo: string;
    Catename: string;
    BaseName: string;
    BaseQty: number;
    BaseUnit: string;
    ItemName: string;
    ItemQty: number;
}

