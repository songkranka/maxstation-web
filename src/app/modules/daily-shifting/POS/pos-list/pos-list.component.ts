import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SharedService } from '../../../../shared/shared.service';
import swal from 'sweetalert2';
import { CashData, CreditData, WithdrawData, PosService, GetDopPosConfigParam, ReceiveData } from 'src/app/service/pos-service/pos-service';
import { DefaultService } from 'src/app/service/default.service';
import { Cash, SaveCashSale, Cashsale } from 'src/app/model/daily-shifting/cash.interface';
import { Credit, SaveCreditSale, Creditsale } from 'src/app/model/daily-shifting/credit.interface';
import { Withdraw, SaveWithdrawSale, Withdrawsale } from 'src/app/model/daily-shifting/withdraw.interface';
import { PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { valueSelectbox } from "../../../../shared-model/demoModel"
import { MatDialog } from '@angular/material/dialog';
import { DialogBoxCustomerComponent } from './dialog-box-customer/dialog-box-customer.component';
import { DialogBoxLicensePlateComponent } from './dialog-box-licenseplate/dialog-box-licenseplate.component';
import { DialogBoxEmployeeComponent } from './dialog-box-employee/dialog-box-employee.component';
import { DialogBoxCustomerCarComponent } from './dialog-box-customercar/dialog-box-customercar.component';
import { DialogBoxBranchComponent } from './dialog-box-branch/dialog-box-branch.component';
import { DialogBoxReasonComponent } from './dialog-box-reason/dialog-box-reason.component';
import { MatSnackBar } from "@angular/material/snack-bar";
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { POSReceive, Receive, SaveReceive } from 'src/app/model/daily-shifting/receive.interface';
import { CustomerCarService } from 'src/app/service/customercar-service/customercar-service';
import { CompanyCustomerCar } from 'src/app/model/master/companycustomercar.interface';

export interface CashTableData {
    row: number;
    journalId: string;
    siteId: string;
    businessDate: Date;
    shiftNo: string;
    taxInvNo: string;
    totalGoodsAmt: number;
    totalDiscAmt: number;
    totalTaxAmt: number;
    totalPaidAmt: number;
    pluNumber: string;
    selQty: number;
    salePrice: number;
    goodsAmt: number;
    taxAmt: number;
    discAmt: number;
    billNo: string;
    itemName: string;
    itemCode: string;
    sumitemAmount: number;
    subAmount: number;
    totalAmount: number;
    empCode: string;
    empName: string;
}

export interface CreditTableData {
    row: number;
    journalId: string;
    siteId: string;
    businessDate: Date;
    shiftNo: string;
    taxInvNo: string;
    totalGoodsAmt: number;
    totalDiscAmt: number;
    totalTaxAmt: number;
    totalPaidAmt: number;
    pluNumber: string;
    selQty: number;
    salePrice: number;
    goodsAmt: number;
    taxAmt: number;
    discAmt: number;
    billNo: string;
    itemName: string;
    itemCode: string;
    custCode: string;
    licensePlate: string;
    mile: string;
    po: string;
    custName: string;
    sumitemAmount: number;
    subAmount: number;
    totalAmount: number;
    isDisableLicensePlate: boolean;
    licensePlates: string[];
    isCustomerCompany: boolean;
    empCode: string;
    empName: string;
}


export interface WithdrawTableData {
    row: number;
    journalId: string;
    siteId: string;
    businessDate: Date;
    shiftNo: string;
    pluNumber: string;
    selQty: number;
    itemName: string;
    itemCode: string;
    licensePlate: string;
    empCode: string;
    empName: string;
    userBrnCode: string;
    reasonId: string;
    sumWater: number;
    totalAmount: number;
    isDisable: boolean;
}

export interface ReceiveTableData {
    row: number;
    custCode: string;
    journalId: string;
    siteId: string;
    businessDate: Date;
    shiftNo: string;
    pluNumber: string;
    itemName: string;
    sellPrice: number;
    sellQty: number;
    goodsAmt: number;
    taxAmt: number;
    discAmt: number;
    sumItemAmt: number;
    subAmt: number;
    totalAmt: number;

}

@Component({
    selector: 'app-pos-list',
    templateUrl: './pos-list.component.html',
    styleUrls: ['./pos-list.component.scss']
})

export class PosListComponent implements OnInit, AfterViewInit {
    urlDailyOperation = this.sharedService.urlDailyOperation;
    date = new FormControl(new Date(this.sharedService.systemDate.getFullYear(), this.sharedService.systemDate.getMonth(), this.sharedService.systemDate.getDate()));
    cashDataSource = new MatTableDataSource<CashTableData>();
    creditDataSource = new MatTableDataSource<CreditTableData>();
    withdrawDataSource = new MatTableDataSource<WithdrawTableData>();
    receiveDataSource = new MatTableDataSource<ReceiveTableData>();
    pageEvent: PageEvent;
    displayedCashColumns: string[] = ['no', 'billNo', 'selQty', 'sumitemAmount', 'totalDiscAmt', 'totalTaxAmt', 'totalPaidAmt'];
    displayedCreditColumns: string[] = ['no', 'customer', 'licensePlate', 'mile', 'po', 'billNo', 'itemCode', 'itemName', 'selQty', 'sumitemAmount', 'totalDiscAmt', 'totalTaxAmt', 'totalPaidAmt'];
    displayedWithdrawColumns: string[] = ['no', 'empcode', 'branch', 'licensePlate', 'reason', 'itemCode', 'itemName', 'selQty', 'sumWater', 'totalAmount'];
    displayedReceiveColumns: string[] = ['no', 'customer', 'billNo', 'itemCode', 'itemName', 'subAmt'];
    no = 0;
    cash = false;
    credit = false;
    withdraw = false;
    receive = false;
    length: number;
    customerCarControl = new FormControl();
    customerCarOptions: valueSelectbox[];
    filteredCustomerCar: Observable<any>;
    branchOptions: valueSelectbox[];
    reasonOptions: valueSelectbox[];
    cashsale: Cashsale[] = [];
    creditsale: Creditsale[] = [];
    withdrawsale: Withdrawsale[] = [];
    posReceive: POSReceive[] = [];
    customerCompanyCar: CompanyCustomerCar[] = [];
    isCashLoading = false;
    isCreditLoading = false;
    isWithdrawLoading = false;
    isReceiveLoading = false;
    isCashAdded: boolean;
    isCreditAdded: boolean;
    isWithdrawAdded: boolean;
    isReceiveAdded: boolean;
    isCreditClear: boolean;
    isWithdrawClear: boolean;
    disableWithdraw = true;
    disableDocDate = true;
    totalItem = 0;
    creDitTotalItem = 0;
    withDrawTotalItem = 0;
    private authPositionRole: any;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private posService: PosService,
        private sharedService: SharedService,
        public SvDefault: DefaultService,
        public dialog: MatDialog,
        private httpClient: HttpClient,
        private snackBar: MatSnackBar,
        private authGuard: AuthGuard,
        private customerCarService: CustomerCarService
    ) {
        this.customerCarOptions = [];
        this.branchOptions = [];
        this.reasonOptions = [];
        this.isCashAdded = true;
        this.isCreditAdded = true;
        this.isWithdrawAdded = true;
        this.isReceiveAdded = true;
        this.isCreditClear = true;
        this.isWithdrawClear = true;
    }

    isUserAuthenticated = (): boolean => {
        return this.authGuard.canActivate();
    }

    async ngOnInit() {
        this.authPositionRole = this.SvDefault.GetAuthPositionRole();
        if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
            window.location.href = "/NoPermission";
            return;
        }
        await this.SvDefault.DoActionAsync(async () => await this.start(), true);
    }

    private async start() {
        if (!this.SvDefault.CheckSession()) {
            return;
        }
        
        await this.getDopPosConfig();
        await this.initWithdrawOption();
        this.customerCompanyCar = await this.customerCarService.GetCompanyCustomerCar();
    }

    ngAfterViewInit(): void {
        this.cashDataSource.sort = this.sort;
        this.creditDataSource.sort = this.sort;
        this.withdrawDataSource.sort = this.sort;
        this.receiveDataSource.sort = this.sort;
    }

    private async getDopPosConfig() {
        let param = new GetDopPosConfigParam();
        param.ArrDocType = ["POS"];
        param.ArrDocDesc = ["DocDate"];
        let arrDopPosConfig = await this.posService.GetDopPosConfig(param);
        if (!this.SvDefault.IsArray(arrDopPosConfig)) {
            return;
        }
        let dpc = arrDopPosConfig[0];
        if (dpc == null) {
            return;
        }
        this.disableDocDate = dpc.DocStatus !== "Active";
    }

    private async initWithdrawOption() {
        var data =
        {
            "docType": "Withdraw"
        }

        this.httpClient.post(this.sharedService.urlDailyAks + '/api/Pos/GetStatus', data)
            .subscribe(
                response => {
                    if (response["Data"].DocStatus == "Active") {
                        this.disableWithdraw = false
                    }
                },
                error => {
                    console.log(data);
                    console.log("Error", error);
                }
            );
    }

    async initCreditDataSource() {
        await this.SvDefault.DoActionAsync(async () => await this.InitCreditDataSource(), true);
    }

    private async InitCreditDataSource() {
        this.isCreditLoading = true;
        let datepicker = new Date(this.date.value);
        let dateRequst = <any>this.SvDefault.GetFormatDate(datepicker);
        this.posService.findCreditAll(dateRequst)
            .subscribe((page: CreditData<Credit>) => {
                this.creditDataSource.data = this.toCreditTableData(page.items);
                this.isCreditLoading = false;
            },
                error => {
                    swal.fire({
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                        title: "<span class='text-danger'>เกิดข้อผิดพลาด!</span>",
                        text: error.message,
                    });
                }

            );
    }

    async initWithdrawDataSource() {
        await this.SvDefault.DoActionAsync(async () => await this.InitWithdrawDataSource(), true);
    }

    private async InitWithdrawDataSource() {
        this.isWithdrawLoading = true;
        let datepicker = new Date(this.date.value);
        let dateRequst = <any>this.SvDefault.GetFormatDate(datepicker);

        this.posService.findWithdrawAll(dateRequst)
            .subscribe((page: WithdrawData<Withdraw>) => {
                this.withdrawDataSource.data = this.toWithdrawTableData(page.items);
                this.isWithdrawLoading = false;
            },
                error => {
                    swal.fire({
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                        title: "<span class='text-danger'>เกิดข้อผิดพลาด!</span>",
                        text: error.message,
                    })
                }

            );
    }

    async initReceiveDataSource() {
        await this.SvDefault.DoActionAsync(async () => await this.InitReceiveDataSource(), true);
    }

    private async InitReceiveDataSource() {
        this.isWithdrawLoading = true;
        let datepicker = new Date(this.date.value);
        let dateRequst = <any>this.SvDefault.GetFormatDate(datepicker);

        this.posService.findReceiveAll(dateRequst)
            .subscribe((page: ReceiveData<Receive>) => {
                this.receiveDataSource.data = this.toReceiveTableData(page.items);
                this.isReceiveLoading = false;
            },
                error => {
                    swal.fire({
                        allowEscapeKey: false,
                        allowOutsideClick: false,
                        title: "<span class='text-danger'>เกิดข้อผิดพลาด!</span>",
                        text: error.message,
                    })
                }
            );
    }

    filteredcustomercar(name: string) {
        return this.customerCarOptions.filter(customerCar =>
            customerCar.VALUE.toLowerCase().indexOf(name.toLowerCase()) === 0);
    }

    showSnackbar(content) {
        let sb = this.snackBar.open(content, "close", {
            duration: 10000,
            verticalPosition: "bottom", // Allowed values are  'top' | 'bottom'
            horizontalPosition: "end", // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
            panelClass: ["custom-style"]
        });
        sb.onAction().subscribe(() => {
            sb.dismiss();
        });
    }

    async findByValue() {
        let datepicker = new Date(this.date.value);
        let dateRequst = <any>this.SvDefault.GetFormatDate(datepicker);

        if (this.cash) {
            this.isCashLoading = true;
            let response: CashData<Cash> = null;
            try {
                response = await this.posService.FindCashAllApim(dateRequst);
            } catch (error) {
                this.isCashLoading = false;
                let ex2 = this.SvDefault.GetModelException(error);
                if (ex2.status === 429) {
                    this.SvDefault.ShowErrorApimDialog(ex2);
                } else {
                    this.SvDefault.ShowExceptionDialog(ex2);
                }
            }
            if (response !== null) {
                if (!this.SvDefault.ValidateApim(response)) {
                    return;
                }
                this.cashDataSource.data = this.toCashTableData(response.Data["Items"]);
                this.totalItem = response.Data["TotalItems"];
                this.isCashLoading = false;
                if (response.Data["Items"].length > 0) {
                    this.isCashAdded = false;
                }
            }
        }

        if (this.credit) {
            this.isCreditLoading = true;
            this.posService.findCreditAll(dateRequst)
                .subscribe((response: CreditData<Credit>) => {
                    this.creditDataSource.data = this.toCreditTableData(response.Data["Items"]);
                    this.creDitTotalItem = response.Data["TotalItems"];
                    this.isCreditLoading = false;

                    if (response.Data["Items"].length > 0) {
                        this.isCreditAdded = false;
                        this.isCreditClear = false;
                    }
                }, error => {
                    this.isCreditLoading = false;
                    this.showSnackbar(error);
                });
        }

        if (this.withdraw) {
            this.isWithdrawLoading = true;
            this.posService.findWithdrawAll(dateRequst)
                .subscribe((response: WithdrawData<Withdraw>) => {
                    this.withdrawDataSource.data = this.toWithdrawTableData(response.Data["Items"]);
                    this.withDrawTotalItem = response.Data["TotalItems"];
                    this.isWithdrawLoading = false;

                    if (response.Data["Items"].length > 0) {
                        this.isWithdrawAdded = false;
                        this.isWithdrawClear = false;
                    }
                }, error => {
                    this.isWithdrawLoading = false;
                    this.showSnackbar(error);
                });
        }

        if (this.receive) {
            this.isReceiveLoading = true;
            this.posService.findReceiveAll(dateRequst)
                .subscribe((response: ReceiveData<Receive>) => {
                    this.receiveDataSource.data = this.toReceiveTableData(response.Data["Items"]);
                    this.isReceiveLoading = false;

                    if (response.Data["Items"].length > 0) {
                        this.isReceiveAdded = false;
                    }
                }, error => {
                    this.isReceiveLoading = false;
                    this.showSnackbar(error);
                });
        }

    }

    findByValueOld() {
        let datepicker = new Date(this.date.value);
        let dateRequst = <any>this.SvDefault.GetFormatDate(datepicker);

        if (this.cash) {
            this.isCashLoading = true;
            this.posService.findCashAll(dateRequst)
                .subscribe((response: CashData<Cash>) => {
                    if (!this.SvDefault.ValidateApim(response)) {
                        return;
                    }
                    this.cashDataSource.data = this.toCashTableData(response.Data["Items"]);
                    this.totalItem = response.Data["TotalItems"];
                    this.isCashLoading = false;

                    if (response.Data["Items"].length > 0) {
                        this.isCashAdded = false;
                    }
                }, error => {
                    this.isCashLoading = false;
                    this.showSnackbar(error);
                });
        }

        if (this.credit) {
            this.isCreditLoading = true;
            this.posService.findCreditAll(dateRequst)
                .subscribe((response: CreditData<Credit>) => {
                    this.creditDataSource.data = this.toCreditTableData(response.Data["Items"]);
                    this.creDitTotalItem = response.Data["TotalItems"];
                    this.isCreditLoading = false;

                    if (response.Data["Items"].length > 0) {
                        this.isCreditAdded = false;
                        this.isCreditClear = false;
                    }
                }, error => {
                    this.isCreditLoading = false;
                    this.showSnackbar(error);
                });
        }

        if (this.withdraw) {
            this.isWithdrawLoading = true;
            this.posService.findWithdrawAll(dateRequst)
                .subscribe((response: WithdrawData<Withdraw>) => {
                    this.withdrawDataSource.data = this.toWithdrawTableData(response.Data["Items"]);
                    this.withDrawTotalItem = response.Data["TotalItems"];
                    this.isWithdrawLoading = false;

                    if (response.Data["Items"].length > 0) {
                        this.isWithdrawAdded = false;
                        this.isWithdrawClear = false;
                    }
                }, error => {
                    this.isWithdrawLoading = false;
                    this.showSnackbar(error);
                });
        }

        if (this.receive) {
            this.isReceiveLoading = true;
            this.posService.findReceiveAll(dateRequst)
                .subscribe((response: ReceiveData<Receive>) => {
                    this.receiveDataSource.data = this.toReceiveTableData(response.Data["Items"]);
                    this.isReceiveLoading = false;

                    if (response.Data["Items"].length > 0) {
                        this.isReceiveAdded = false;
                    }
                }, error => {
                    this.isReceiveLoading = false;
                    this.showSnackbar(error);
                });
        }
    }

    dateChangeEvent() {
        let datepicker = new Date(this.date.value);
        let dateRequst = <any>this.SvDefault.GetFormatDate(datepicker);

        this.posService.findCashAll(dateRequst)
            .subscribe((page: CashData<Cash>) => {
                if (!this.SvDefault.ValidateApim(page)) {
                    return;
                }
                this.cashDataSource.data = this.toCashTableData(page.items);
            });

        this.posService.findCreditAll(dateRequst)
            .subscribe((page: CreditData<Credit>) => {
                this.creditDataSource.data = this.toCreditTableData(page.items);
            });
        this.posService.findWithdrawAll(dateRequst)
            .subscribe((page: WithdrawData<Withdraw>) => {
                this.withdrawDataSource.data = this.toWithdrawTableData(page.items);
            });
        this.posService.findReceiveAll(dateRequst)
            .subscribe((page: ReceiveData<Receive>) => {
                this.receiveDataSource.data = this.toReceiveTableData(page.items);
            });
    }

    openCustomerDialog(obj: any) {
        var billNo = obj['billNo'];
        const dialogRef = this.dialog.open(DialogBoxCustomerComponent, {
            width: '600px',
        });

        dialogRef.afterClosed().subscribe(result => {

            if (result != undefined) {
                let custCode = result.custCode;
                let req = {
                    "CustCode": custCode
                }
                this.httpClient.post(this.sharedService.urlMas + "/api/Company/FindCustomerCompanyById", req)
                    .subscribe(
                        response => {
                            let customer = response["Data"]

                            if (customer != null) {
                                this.updateCreditRowData(billNo, result.custCode, result.custName, true);
                            } else {
                                this.updateCreditRowData(billNo, result.custCode, result.custName, false);
                            }
                        },
                        error => {
                            console.log("Error", error);
                        }
                    );
                
            }
        });
    }

    openCustomerCarDialog(obj: any) {
        let custCode = obj['custCode'];

        if (custCode != "") {
            let req = {
                "CustCode": obj['custCode']
            }
            this.httpClient.post(this.sharedService.urlMas + "/api/Company/FindCustomerCompanyById", req)
                .subscribe(
                    response => {
                        let customer = response["Data"]

                        if (customer != null) {
                            var row = obj['row'];

                            const dialogRef = this.dialog.open(DialogBoxCustomerCarComponent, {
                                width: '600px',
                                data: { custCode: obj['custCode'], }
                            });

                            dialogRef.afterClosed().subscribe(result => {
                                if (result != undefined) {
                                    this.updateCreditLicenPlateRowData(row, result.licensePlate);
                                } else {
                                    this.disableCreditLicenPlateRowData(row);
                                }
                            });
                        }
                    },
                    error => {
                        console.log("Error", error);
                    }
                );
        }

    }

    openOilroductDialog(obj: any) {
        let itemCode = obj['itemCode'];
        if (itemCode != "") {
            let req = {
                "PdId": itemCode
            }

            this.httpClient.post(this.sharedService.urlMas + "/api/Product/FindProductOilType", req)
                .subscribe(
                    response => {
                        let productOil = response["Data"]

                        if (productOil != null) {
                            var row = obj['row'];

                            const dialogRef = this.dialog.open(DialogBoxLicensePlateComponent, {
                                width: '600px',
                                data: { custCode: obj['custCode'], }
                            });

                            dialogRef.afterClosed().subscribe(result => {
                                this.updateWithdrawLicenPlateRowData(row, result.licensePlate);
                            });
                        }
                    },
                    error => {
                        console.log("Error", error);
                    }
                );
        }

    }

    openEmployeeDialog(obj: any) {
        var row = obj['row'];
        const dialogRef = this.dialog.open(DialogBoxEmployeeComponent, {
            width: '600px',
        });

        dialogRef.afterClosed().subscribe(result => {
            this.updateWithdrawEmployeeRowData(row, result.empCode, result.firstName, result.lastName);
        });
    }


    openLicensePlateDialog(obj: any) {
        var row = obj['row'];
        const dialogRef = this.dialog.open(DialogBoxLicensePlateComponent, {
            width: '600px',
        });

        dialogRef.afterClosed().subscribe(result => {
            this.updateWithdrawLicenPlateRowData(row, result.licensePlate);
        });
    }

    openReasonDialog(obj: any) {
        var row = obj['row'];
        const dialogRef = this.dialog.open(DialogBoxReasonComponent, {
            width: '600px',
            data: {
                pluNumber: obj.pluNumber
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            this.updateWithdrawReasonRowData(row, result.reason);
        });
    }

    openBranchDialog(obj: any) {
        var row = obj['row'];
        const dialogRef = this.dialog.open(DialogBoxBranchComponent, {
            width: '600px',
        });

        dialogRef.afterClosed().subscribe(result => {
            this.updateWithdrawBranchRowData(row, result.userBrnCode, result.brnName);
        });
    }

    updateCreditRowData(billno: string, custCode: string, custName: string, isCustomerCompany: boolean) {
        this.creditDataSource.data = this.creditDataSource.data.filter((value) => {
            if (value.billNo == billno) {
                value.custCode = custCode;
                value.custName = custName;
                value.isCustomerCompany = isCustomerCompany;
                value.licensePlate = "";
            }
            return true;
        });
    }


    updateCreditLicenPlateRowData(row: number, licensePlate: string) {
        this.creditDataSource.data = this.creditDataSource.data.filter((value) => {
            if (value.row == row) {
                value.licensePlate = licensePlate;
                value.isDisableLicensePlate = true;
            }
            return true;
        });
    }

    disableCreditLicenPlateRowData(row: number) {
        this.creditDataSource.data = this.creditDataSource.data.filter((value) => {
            if (value.row == row) {
                value.isDisableLicensePlate = true;
            }
            return true;
        });
    }

    updateWithdrawLicenPlateRowData(row: number, licensePlate: string) {
        this.withdrawDataSource.data = this.withdrawDataSource.data.filter((value) => {
            if (value.row == row) {
                value.licensePlate = licensePlate;
            }
            return true;
        });
    }

    updateWithdrawBranchRowData(row: number, userBrnCode: string, brnName: string) {
        this.withdrawDataSource.data = this.withdrawDataSource.data.filter((value) => {
            if (value.row == row) {
                value.userBrnCode = userBrnCode;
            }
            return true;
        });
    }

    updateWithdrawEmployeeRowData(row: number, empcode: string, firstName: string, lastName: string) {
        this.withdrawDataSource.data = this.withdrawDataSource.data.filter((value) => {
            if (value.row == row) {
                value.empCode = empcode;
                value.empName = firstName + ' ' + lastName;
            }
            return true;
        });
    }

    updateWithdrawReasonRowData(row: number, reasonId: string) {
        this.withdrawDataSource.data = this.withdrawDataSource.data.filter((value) => {
            if (value.row == row) {
                value.reasonId = reasonId;
            }
            return true;
        });
    }

    saveCash() {
        this.SvDefault.DoActionAsync(async () => this.SaveCash());
    }

    SaveCash() {
        swal.fire({
            allowEscapeKey: false,
            allowOutsideClick: false,
            confirmButtonText: "ตกลง",
            denyButtonText: "ยกเลิก",
            icon: 'warning',
            showDenyButton: true,
            title: 'คุณต้องการบันทึกข้อมูลขายสด ใช่หรือไม่?',
        }).then(async (result) => {
            if (result.isConfirmed) {
                let saveCashsale = new SaveCashSale();
                this.isCashLoading = true;
                this.isCashAdded = true;
                for (let i = 0; i < this.cashDataSource.data.length; i++) {
                    let obj = new Cashsale;
                    obj.Row = this.cashDataSource.data[i].row;
                    obj.JournalId = this.cashDataSource.data[i].journalId;
                    obj.SiteId = this.cashDataSource.data[i].siteId;
                    obj.BusinessDate = this.cashDataSource.data[i].businessDate;
                    obj.ShiftNo = this.cashDataSource.data[i].shiftNo;
                    obj.TaxInvNo = this.cashDataSource.data[i].taxInvNo;
                    obj.TotalGoodsAmt = this.cashDataSource.data[i].totalGoodsAmt;
                    obj.TotalDiscAmt = this.cashDataSource.data[i].totalDiscAmt;
                    obj.TotalTaxAmt = this.cashDataSource.data[i].totalTaxAmt;
                    obj.TotalPaidAmt = this.cashDataSource.data[i].totalPaidAmt;
                    obj.PluNumber = this.cashDataSource.data[i].pluNumber;
                    obj.SelQty = this.cashDataSource.data[i].selQty;
                    obj.SalePrice = this.cashDataSource.data[i].salePrice;
                    obj.GoodsAmt = this.cashDataSource.data[i].goodsAmt;
                    obj.TaxAmt = this.cashDataSource.data[i].taxAmt;
                    obj.DiscAmt = this.cashDataSource.data[i].discAmt;
                    obj.BillNo = this.cashDataSource.data[i].billNo;
                    obj.ItemCode = this.cashDataSource.data[i].itemCode;
                    obj.ItemName = this.cashDataSource.data[i].itemName;
                    obj.SumItemAmount = this.cashDataSource.data[i].sumitemAmount;
                    obj.SubAmount = this.cashDataSource.data[i].subAmount;
                    obj.TotalAmount = this.cashDataSource.data[i].totalAmount;
                    obj.EmpCode = this.cashDataSource.data[i].empCode;
                    obj.EmpName = this.cashDataSource.data[i].empName;
                    this.cashsale.push(obj);
                }

                saveCashsale.BrnCode = this.sharedService.brnCode;
                saveCashsale.CompCode = this.sharedService.compCode;
                saveCashsale.LocCode = this.sharedService.locCode;
                saveCashsale.CreatedBy = this.sharedService.user;
                let datepicker = new Date(this.date.value);
                saveCashsale.SystemDate = <any>this.SvDefault.GetFormatDate(datepicker);
                saveCashsale._Cashsale = this.cashsale;
                saveCashsale.TotalItem = this.totalItem;
                this.cashsale = [];

                this.httpClient.post(this.sharedService.urlDailyAks + "/api/Pos/SaveCashSale", saveCashsale)
                    .subscribe(
                        (response) => {
                            swal.fire({
                                allowEscapeKey: false,
                                allowOutsideClick: false,
                                icon: 'success',
                                title: response["Message"],
                            })

                            this.isCashLoading = false;
                        },
                        (error) => {
                            swal.fire({
                                allowEscapeKey: false,
                                allowOutsideClick: false,
                                title: 'มีข้อผิดพลาด',
                                text: error.error['messages']
                            })
                        }
                    );
            }
        })
    }

    saveCredit() {
        this.SvDefault.DoActionAsync(async () => this.SaveCredit());
    }

    SaveCredit() {
        swal.fire({
            allowEscapeKey: false,
            allowOutsideClick: false,
            confirmButtonText: "ตกลง",
            denyButtonText: "ยกเลิก",
            icon: 'warning',
            showDenyButton: true,
            title: 'คุณต้องการบันทึกข้อมูลขายเชื่อ ใช่หรือไม่?',
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!await this.validateCreditData()) {
                    return;
                }

                let saveCreditsale = new SaveCreditSale()
                this.isCreditLoading = true;
                this.isCreditAdded = true;

                for (let i = 0; i < this.creditDataSource.data.length; i++) {
                    let obj = new Creditsale;
                    obj.Row = this.creditDataSource.data[i].row;
                    obj.JournalId = this.creditDataSource.data[i].journalId;
                    obj.SiteId = this.creditDataSource.data[i].siteId;
                    obj.BusinessDate = this.creditDataSource.data[i].businessDate;
                    obj.ShiftNo = this.creditDataSource.data[i].shiftNo;
                    obj.TaxInvNo = this.creditDataSource.data[i].taxInvNo;
                    obj.TotalGoodsAmt = this.creditDataSource.data[i].totalGoodsAmt;
                    obj.TotalDiscAmt = this.creditDataSource.data[i].totalDiscAmt;
                    obj.TotalTaxAmt = this.creditDataSource.data[i].totalTaxAmt;
                    obj.TotalPaidAmt = this.creditDataSource.data[i].totalPaidAmt;
                    obj.PluNumber = this.creditDataSource.data[i].pluNumber;
                    obj.SelQty = this.creditDataSource.data[i].selQty;
                    obj.SalePrice = this.creditDataSource.data[i].salePrice;
                    obj.GoodsAmt = this.creditDataSource.data[i].goodsAmt;
                    obj.TaxAmt = this.creditDataSource.data[i].taxAmt;
                    obj.DiscAmt = this.creditDataSource.data[i].discAmt;
                    obj.BillNo = this.creditDataSource.data[i].billNo;
                    obj.ItemCode = this.creditDataSource.data[i].itemCode;
                    obj.ItemName = this.creditDataSource.data[i].itemName;
                    obj.LicensePlate = this.creditDataSource.data[i].licensePlate;
                    obj.Mile = this.creditDataSource.data[i].mile.toString();
                    obj.CustCode = this.creditDataSource.data[i].custCode;
                    obj.CustName = this.creditDataSource.data[i].custName;
                    obj.Po = this.creditDataSource.data[i].po;
                    obj.SumItemAmount = this.creditDataSource.data[i].sumitemAmount;
                    obj.SubAmount = this.creditDataSource.data[i].subAmount;
                    obj.TotalAmount = this.creditDataSource.data[i].totalAmount;
                    obj.EmpCode = this.creditDataSource.data[i].empCode;
                    obj.EmpName = this.creditDataSource.data[i].empName;
                    this.creditsale.push(obj);
                }

                saveCreditsale.BrnCode = this.sharedService.brnCode;
                saveCreditsale.CompCode = this.sharedService.compCode;
                saveCreditsale.LocCode = this.sharedService.locCode;
                saveCreditsale.CreatedBy = this.sharedService.user;
                let datepicker = new Date(this.date.value);
                saveCreditsale.SystemDate = <any>this.SvDefault.GetFormatDate(datepicker);
                saveCreditsale._Creditsale = this.creditsale;
                saveCreditsale.TotalItem = this.creDitTotalItem;
                this.creditsale = [];

                this.httpClient.post(this.sharedService.urlDailyAks + "/api/Pos/SaveCreditSale", saveCreditsale)
                    .subscribe(
                        (response) => {
                            swal.fire({
                                allowEscapeKey: false,
                                allowOutsideClick: false,
                                icon: 'success',
                                title: response["Message"],
                            })
                            this.isCreditClear = true;
                            this.isCreditLoading = false;
                        },
                        (error) => {
                            swal.fire({
                                allowEscapeKey: false,
                                allowOutsideClick: false,
                                title: 'มีข้อผิดพลาด',
                                text: error.error['messages']
                            })
                            this.isCreditAdded = false;
                            this.isCreditLoading = false;
                        }
                    );
            }
        })
    }

    saveWithdraw() {
        this.SvDefault.DoActionAsync(async () => this.SaveWithdraw());
    }

    SaveWithdraw() {
        swal.fire({
            allowEscapeKey: false,
            allowOutsideClick: false,
            confirmButtonText: "ตกลง",
            denyButtonText: "ยกเลิก",
            icon: 'warning',
            showDenyButton: true,
            title: 'คุณต้องการบันทึกข้อมูลเบิกใช้ ใช่หรือไม่?',
        }).then(async (result) => {
            if (result.isConfirmed) {
                if (!await this.validateWithdrawData()) {
                    return;
                }
                let saveWithdrawsale = new SaveWithdrawSale();
                this.isWithdrawLoading = true;
                this.isWithdrawAdded = true;
                for (let i = 0; i < this.withdrawDataSource.data.length; i++) {
                    let obj = new Withdrawsale;
                    obj.Row = this.withdrawDataSource.data[i].row
                    obj.JournalId = this.withdrawDataSource.data[i].journalId,
                        obj.SiteId = this.withdrawDataSource.data[i].siteId,
                        obj.BusinessDate = this.withdrawDataSource.data[i].businessDate
                    obj.ShiftNo = this.withdrawDataSource.data[i].shiftNo
                    obj.PluNumber = this.withdrawDataSource.data[i].pluNumber
                    // obj.SelQty = this.withdrawDataSource.data[i].selQty - this.withdrawDataSource.data[i].sumWater
                    obj.SelQty = Number(this.withdrawDataSource.data[i].totalAmount) //totalQty
                    obj.ItemCode = this.withdrawDataSource.data[i].itemCode
                    obj.ItemName = this.withdrawDataSource.data[i].itemName
                    obj.LicensePlate = this.withdrawDataSource.data[i].licensePlate
                    obj.EmpCode = this.withdrawDataSource.data[i].empCode
                    obj.EmpName = this.withdrawDataSource.data[i].empName
                    obj.UserBrnCode = this.withdrawDataSource.data[i].userBrnCode
                    obj.ReasonId = this.withdrawDataSource.data[i].reasonId
                    obj.Remark = "จำนวน " + this.withdrawDataSource.data[i].selQty + " ,แลกแต้ม " + this.withdrawDataSource.data[i].sumWater + " ,รวมจำนวน " + (this.withdrawDataSource.data[i].selQty - this.withdrawDataSource.data[i].sumWater)
                    this.withdrawsale.push(obj);
                }

                saveWithdrawsale.BrnCode = this.sharedService.brnCode;
                saveWithdrawsale.CompCode = this.sharedService.compCode;
                saveWithdrawsale.LocCode = this.sharedService.locCode;
                saveWithdrawsale.CreatedBy = this.sharedService.user;
                let datepicker = new Date(this.date.value);
                saveWithdrawsale.SystemDate = <any>this.SvDefault.GetFormatDate(datepicker);
                saveWithdrawsale._Withdraw = this.withdrawsale;
                this.withdrawsale = [];

                this.httpClient.post(this.sharedService.urlDailyAks + "/api/Pos/SaveWithdraw", saveWithdrawsale)
                    .subscribe(
                        (response) => {
                            swal.fire({
                                allowEscapeKey: false,
                                allowOutsideClick: false,
                                icon: 'success',
                                title: response["Message"],
                            })

                            this.isWithdrawClear = true;

                            this.isWithdrawLoading = false;
                        },
                        (error) => {
                            swal.fire({
                                allowEscapeKey: false,
                                allowOutsideClick: false,
                                title: 'มีข้อผิดพลาด',
                                text: error.error['messages']
                            })
                        }
                    );
            }
        })
    }

    saveReceive() {
        this.SvDefault.DoActionAsync(async () => this.SaveReceive());
    }

    SaveReceive() {
        swal.fire({
            allowEscapeKey: false,
            allowOutsideClick: false,
            confirmButtonText: "ตกลง",
            denyButtonText: "ยกเลิก",
            icon: 'warning',
            showDenyButton: true,
            title: 'คุณต้องการบันทึกข้อมูลรับชำระเงิน ใช่หรือไม่?',
        }).then(async (result) => {
            if (result.isConfirmed) {
                // if (!await this.validateReceiveData()) {
                //     return;
                // }

                let saveReceive = new SaveReceive()
                this.isReceiveLoading = true;
                this.isReceiveAdded = true;

                for (let i = 0; i < this.receiveDataSource.data.length; i++) {
                    let obj = new POSReceive;
                    obj.Row = this.receiveDataSource.data[i].row
                    obj.CustCode = this.receiveDataSource.data[i].custCode,
                        obj.JournalId = this.receiveDataSource.data[i].journalId,
                        obj.BusinessDate = this.receiveDataSource.data[i].businessDate,
                        obj.ShiftNo = this.receiveDataSource.data[i].shiftNo,
                        obj.PluNumber = this.receiveDataSource.data[i].pluNumber,
                        obj.ItemName = this.receiveDataSource.data[i].itemName,
                        obj.SellQty = this.receiveDataSource.data[i].sellQty,
                        obj.SellPrice = this.receiveDataSource.data[i].sellPrice,
                        obj.GoodsAmt = this.receiveDataSource.data[i].goodsAmt,
                        obj.TaxAmt = this.receiveDataSource.data[i].taxAmt
                    obj.DiscAmt = this.receiveDataSource.data[i].discAmt
                    obj.SumItemAmt = this.receiveDataSource.data[i].sumItemAmt
                    obj.SubAmt = this.receiveDataSource.data[i].subAmt
                    obj.TotalAmt = this.receiveDataSource.data[i].totalAmt
                    this.posReceive.push(obj);
                }

                saveReceive.BrnCode = this.sharedService.brnCode;
                saveReceive.CompCode = this.sharedService.compCode;
                saveReceive.LocCode = this.sharedService.locCode;
                saveReceive.CreatedBy = this.sharedService.user;
                let datepicker = new Date(this.date.value);
                saveReceive.SystemDate = <any>this.SvDefault.GetFormatDate(datepicker);
                saveReceive._POSReceives = this.posReceive;
                this.creditsale = [];

                this.httpClient.post(this.sharedService.urlDailyAks + "/api/Pos/SaveReceive", saveReceive)
                    .subscribe(
                        (response) => {
                            swal.fire({
                                allowEscapeKey: false,
                                allowOutsideClick: false,
                                icon: 'success',
                                title: response["Message"],
                            })
                            this.isReceiveLoading = false;
                        },
                        (error) => {
                            swal.fire({
                                allowEscapeKey: false,
                                allowOutsideClick: false,
                                title: 'มีข้อผิดพลาด',
                                text: error.error['messages']
                            })
                            this.isReceiveLoading = false;
                        }
                    );
            }
        })
    }

    private async validateCreditData() {
        let pass = false;
        let msg = "";

        if (this.creditDataSource.data.length > 0) {
            for (let i = 0; i < this.creditDataSource.data.length; i++) {
                let companyCar = this.creditDataSource.data[i].isCustomerCompany;
                let custCode = this.creditDataSource.data[i].custCode;
                let licensePlate = this.creditDataSource.data[i].licensePlate;

                if (companyCar == true) {
                    let customerCompanyCarData: CompanyCustomerCar[];
                    customerCompanyCarData = this.customerCompanyCar['Data'];
                    let customerCarFilter = customerCompanyCarData.find(x => x.CustCode == custCode && x.LicensePlate == licensePlate);
                    
                    if(customerCarFilter == null || customerCarFilter == undefined) {
                        pass = false;
                        msg = `ทะเบียนรถลูกค้าในเครือไม่ถูกต้อง ${this.creditDataSource.data[i].licensePlate}` + "<br>";
                        break;
                    } else {
                        pass = true;
                    }
                } else {
                    pass = true;
                }
            }
        }

        if (!pass) {
            swal.fire({
                title: msg,
                allowOutsideClick: false,
                allowEscapeKey: false,
                icon: 'error'
            })
        }
        return pass;
    }

    private async validateWithdrawData() {
        let pass = false;
        let msg = "";

        if (this.withdrawDataSource.data.length > 0) {
            for (let i = 0; i < this.withdrawDataSource.data.length; i++) {
                if (this.withdrawDataSource.data[i].empCode == "") {
                    pass = false;
                    msg = `กรุณากรอกผู้เบิก ${this.withdrawDataSource.data[i].itemCode}` + "<br>";
                    break;
                } else {
                    pass = true;
                }
                if (this.withdrawDataSource.data[i].userBrnCode == "") {
                    pass = false;
                    msg = `กรุณากรอกส่วนงาน ${this.withdrawDataSource.data[i].itemCode}` + "<br>";
                    break;
                } else {
                    pass = true;
                }
                if (this.withdrawDataSource.data[i].reasonId == "") {
                    pass = false;
                    msg = `กรุณากรอกเหตุผลที่เบิก ${this.withdrawDataSource.data[i].itemCode}` + "<br>";
                    break;
                } else {
                    pass = true;
                }
            }
        }

        if (!pass) {
            swal.fire({
                title: msg,
                allowOutsideClick: false,
                allowEscapeKey: false,
                icon: 'error'
            })
        }
        return pass;
    }

    private async validateReceiveData() {
        let pass = false;
        let msg = "";

        // if (this.withdrawDataSource.data.length > 0) {
        //     for (let i = 0; i < this.withdrawDataSource.data.length; i++) {
        //         if (this.withdrawDataSource.data[i].empCode == "") {
        //             pass = false;
        //             msg = `กรุณากรอกผู้เบิก ${this.withdrawDataSource.data[i].itemCode}` + "<br>";
        //             break;
        //         } else {
        //             pass = true;
        //         }
        //         if (this.withdrawDataSource.data[i].userBrnCode == "") {
        //             pass = false;
        //             msg = `กรุณากรอกส่วนงาน ${this.withdrawDataSource.data[i].itemCode}` + "<br>";
        //             break;
        //         } else {
        //             pass = true;
        //         }
        //         if (this.withdrawDataSource.data[i].reasonId == "") {
        //             pass = false;
        //             msg = `กรุณากรอกเหตุผลที่เบิก ${this.withdrawDataSource.data[i].itemCode}` + "<br>";
        //             break;
        //         } else {
        //             pass = true;
        //         }
        //     }
        // }

        if (!pass) {
            swal.fire({
                title: msg,
                allowOutsideClick: false,
                allowEscapeKey: false,
                icon: 'error'
            })
        }
        return pass;
    }

    clearCreditTableData() {
        this.initCreditDataSource();
    }

    clearWithdrawTableData() {
        this.initWithdrawDataSource();
    }

    private toCashTableData(cash: Cash[]): CashTableData[] {
        return cash.map(c => {
            return {
                row: c.Row,
                journalId: c.JournalId,
                siteId: c.SiteId,
                businessDate: c.BusinessDate,
                shiftNo: c.ShiftNo,
                taxInvNo: c.TaxInvNo,
                totalGoodsAmt: c.TotalGoodAmt,
                totalDiscAmt: c.TotalDiscAmt,
                totalTaxAmt: c.TotalTaxAmt,
                totalPaidAmt: c.TotalPaidAmt,
                pluNumber: c.PluNumber,
                selQty: c.SellQty,
                salePrice: c.SellPrice,
                goodsAmt: c.GoodsAmt,
                taxAmt: c.TaxAmt,
                discAmt: c.DiscAmt,
                billNo: c.BillNo,
                itemName: c.ItemName,
                itemCode: c.ItemCode,
                sumitemAmount: c.SumItemAmt,
                subAmount: c.SubAmt,
                totalAmount: c.TotalAmt,
                empCode: c.EmpCode,
                empName: c.EmpName
            };
        });
    }

    private toCreditTableData(credit: Credit[]): CreditTableData[] {
        return credit.map(c => {
            return {
                row: c.Row,
                journalId: c.JournalId,
                siteId: c.SiteId,
                businessDate: c.BusinessDate,
                shiftNo: c.ShiftNo,
                taxInvNo: c.TaxInvNo,
                totalGoodsAmt: c.TotalGoodsAmt,
                totalDiscAmt: c.TotalDiscAmt,
                totalTaxAmt: c.TotalTaxAmt,
                totalPaidAmt: c.TotalPaidAmt,
                pluNumber: c.PluNumber,
                selQty: c.SellQty,
                salePrice: c.SellPrice,
                goodsAmt: c.GoodsAmt,
                taxAmt: c.TaxAmt,
                discAmt: c.DiscAmt,
                billNo: c.BillNo,
                itemName: c.ItemName,
                itemCode: c.ItemCode,
                custCode: c.CustomerId,
                custName: '',
                licensePlate: c.LicNo,
                mile: c.Miles,
                po: c.Po,
                sumitemAmount: c.SumItemAmt,
                subAmount: c.SubAmt,
                totalAmount: c.TotalAmt,
                isDisableLicensePlate: false,
                licensePlates: c.LicensePlates,
                isCustomerCompany: c.IsCustomerCompany,
                empCode: c.EmpCode,
                empName: c.EmpName
            };
        });
    }

    private toWithdrawTableData(withdraw: Withdraw[]): WithdrawTableData[] {
        return withdraw.map(c => {
            return {
                row: c.Row,
                journalId: c.JournalId,
                siteId: c.SiteId,
                businessDate: c.BusinessDate,
                shiftNo: c.ShiftNo,
                pluNumber: c.PluNumber,
                selQty: c.SellQty,
                itemCode: c.ItemCode,
                itemName: c.ItemName,
                licensePlate: c.LicensePlate,
                empCode: '',
                empName: '',
                userBrnCode: c.CostCenter,
                reasonId: '',
                sumWater: c.SumWater,
                totalAmount: c.SellQty - c.SumWater,
                isDisable: c.SellQty - c.SumWater > 0 ? true : false,
            };
        });
    }


    private toReceiveTableData(receive: Receive[]): ReceiveTableData[] {
        return receive.map(c => {
            return {
                row: c.Row,
                custCode: c.CustCode,
                journalId: c.JournalId,
                siteId: c.SiteId,
                businessDate: c.BusinessDate,
                shiftNo: c.ShiftNo,
                pluNumber: c.PluNumber,
                itemName: c.ItemName,
                sellQty: c.SellQty,
                sellPrice: c.SellPrice,
                goodsAmt: c.GoodsAmt,
                taxAmt: c.TaxAmt,
                discAmt: c.DiscAmt,
                sumItemAmt: c.SumItemAmt,
                subAmt: c.SubAmt,
                totalAmt: c.TotalAmt
            };
        });
    }
}