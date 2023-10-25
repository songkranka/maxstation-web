export class SaveEmployeeAuth {
    User: string;
    _EmployeeAuth: EmployeeAuth[];
}

export class EmployeeAuth {
    EmpCode: string;
    EmpName: string;
    AuthCode: number;
    PositionCode: string;
    UpdatedBy: string;
    UpdatedDate: Date;
}