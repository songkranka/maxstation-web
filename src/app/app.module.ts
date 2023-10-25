import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { DefaultModule } from "./layouts/default/default.module";
import { SharedService } from "./shared/shared.service";
import { NgbDateParserFormatter, NgbModule } from "@ng-bootstrap/ng-bootstrap"
import { NgbDateCustomParserFormatter } from '../app/date-fomat/date-fomat';

import { NgSelectModule } from "@ng-select/ng-select";
import { CommonModule, DatePipe } from "@angular/common";
import { WINDOW_PROVIDERS } from './window.providers';

import { DynamicStepperModule } from "./commons/dynamic-stepper/dynamic-stepper.module";
import { DynamicTableModule } from "./commons/dynamic-table/dynamic-table.module";
import { ExampleComponent } from './modules/example/example.component';
//import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RequestComponent } from './modules/Inventory/Request/request/request.component';
import { RequestListComponent } from './modules/Inventory/Request/request-list/request-list.component';
import { QuotationComponent } from './modules/Sale/Quotation/quotation/quotation.component';
import { QuotationListComponent } from './modules/Sale/Quotation/quotation-list/quotation-list.component';
import { InvoiceListComponent } from './modules/Invoice/InvoiceList/InvoiceList.component';
import { InvoiceComponent } from './modules/Invoice/Invoice/Invoice.component';
import { CustomerModalComponent } from './modules/Invoice/CustomerModal/CustomerModal.component';
import { ProductModalComponent } from './modules/Invoice/ProductModal/ProductModal.component';
import { DateRangeComponent } from './modules/Invoice/DateRange/DateRange.component';
import { CashsaleComponent } from './modules/Sale/cashsale/cashsale/cashsale.component';
import { CashsaleListComponent } from './modules/Sale/cashsale/cashsale-list/cashsale-list.component';
import { CreditsaleComponent } from './modules/Sale/CreditSale/creditsale/creditsale.component';
import { CreditsaleListComponent } from './modules/Sale/CreditSale/creditsale-list/creditsale-list.component';
import { CashtaxListComponent } from './modules/Sale/CashTax/cashtax-list/cashtax-list.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSortModule } from '@angular/material/sort';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { ModalProductComponent } from './shared/components/ModalProduct/ModalProduct.component';
import { CashtaxComponent } from "./modules/Sale/CashTax/cashtax/cashtax.component";
import { BillingComponent } from "./modules/Sale/Billing/Billing/Billing.component";
import { BillingListComponent } from "./modules/Sale/Billing/BillingList/BillingList.component";
import { BillingModalItemComponent } from "./modules/Sale/Billing/BillingModalItem/BillingModalItem.component";
import { TransferOutComponent } from "./modules/Inventory/TransferOut/transferout/transferout.component"
import { TransferOutListComponent } from "./modules/Inventory/TransferOut/transferout-list/transferout-list.component";
import { TransferOutModalRequestComponent } from "./modules/Inventory/TransferOut/transfer-out-modal-request/transfer-out-modal-request.component";
import { WithdrawComponent } from './modules/Inventory/Withdraw/withdraw/withdraw.component';
import { WithdrawListComponent } from './modules/Inventory/Withdraw/withdraw-list/withdraw-list.component';
import { SupplyTransferInListComponent } from './modules/Inventory/SupplyTransferIn/SupplyTransferInList/SupplyTransferInList.component';
import { SupplyTransferInComponent } from './modules/Inventory/SupplyTransferIn/SupplyTransferIn/SupplyTransferIn.component';
import { AdjustRequestComponent } from './modules/Inventory/AdjustRequest/AdjustRequest/AdjustRequest.component';
import { AdjustRequestListComponent } from './modules/Inventory/AdjustRequest/AdjustRequestList/AdjustRequestList.component';
import { AdjustComponent } from './modules/Inventory/Adjust/Adjust/Adjust.component';
import { AdjustListComponent } from './modules/Inventory/Adjust/AdjustList/AdjustList.component';
import { MeterComponent } from './modules/Daily-operation/Meter/Meter/Meter.component';
import { ModalLicensePlateComponent } from "./modules/Inventory/Withdraw/ModalLicensePlate/ModalLicensePlate.component";
import { ReceiveComponent } from './modules/Finance/Receive/receive/receive.component';
import { ReceiveListComponent } from './modules/Finance/Receive/receive-list/receive-list.component';
import { NumberDirective } from './modules/Sale/CashTax/cashtax/numbers-only.directive';
import { TransferInListComponent } from './modules/Inventory/TransferIn/TransferInList/TransferInList.component';
import { TransferInComponent } from './modules/Inventory/TransferIn/TransferIn/TransferIn.component';
import { TransferInModalComponent } from './modules/Inventory/TransferIn/TransferInModal/TransferInModal.component';
import { AdjustModalComponent } from './modules/Inventory/Adjust/AdjustModal/AdjustModal.component';
import { from } from "rxjs";
import { CreditnoteListComponent } from './modules/Sale/CreditNote/creditnote-list/creditnote-list.component';
import { CreditnoteComponent } from './modules/Sale/CreditNote/creditnote/creditnote.component';
import { ModalQuotationComponent } from './modules/Sale/cashsale/ModalQuotation/ModalQuotation.component';
import { ModalCashTaxComponent } from './modules/Sale/CreditNote/ModalCashTax/ModalCashTax.component';
import { InputNumberFormatComponent } from "./shared/components/InputNumberFormat/InputNumberFormat.component";
import { InputDecimalComponent } from "./shared/components/InputDecimal/InputDecimal.component";
import { ReceiveGasComponent } from "./modules/Inventory/ReceiveGas/ReceiveGas/ReceiveGas.component";
import { ReceiveGasListComponent } from "./modules/Inventory/ReceiveGas/ReceiveGasList/ReceiveGasList.component";
import { ReceiveOilComponent } from "./modules/Inventory/ReceiveOil/ReceiveOil/ReceiveOil.component";
import { ReceiveOilListComponent } from "./modules/Inventory/ReceiveOil/ReceiveOilList/ReceiveOilList.component";
import { ModalPurchaseReceiveOilComponent } from "./modules/Inventory/ReceiveOil/ModalPurchaseOrder/ModalPurchaseReceiveOil.component";
import { ModalPurchaseOrderComponent } from "./modules/Inventory/ReceiveGas/ModalPurchaseOrder/ModalPurchaseOrder.component";
import { PosListComponent } from './modules/daily-shifting/POS/pos-list/pos-list.component';
import { ReturnOilListComponent } from "./modules/Inventory/ReturnOil/ReturnOilList/ReturnOilList.component";
import { ReturnOilComponent } from "./modules/Inventory/ReturnOil/ReturnOil/ReturnOil.component";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DialogBoxCustomerComponent } from "./modules/daily-shifting/POS/pos-list/dialog-box-customer/dialog-box-customer.component";
import { DialogBoxLicensePlateComponent } from "./modules/daily-shifting/POS/pos-list/dialog-box-licenseplate/dialog-box-licenseplate.component";
import { DialogBoxCustomerCarComponent } from "./modules/daily-shifting/POS/pos-list/dialog-box-customercar/dialog-box-customercar.component";
import { DialogBoxEmployeeComponent } from "./modules/daily-shifting/POS/pos-list/dialog-box-employee/dialog-box-employee.component";
import { DialogBoxBranchComponent } from "./modules/daily-shifting/POS/pos-list/dialog-box-branch/dialog-box-branch.component";
import { DialogBoxReasonComponent } from "./modules/daily-shifting/POS/pos-list/dialog-box-reason/dialog-box-reason.component";
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UnusableComponent } from "./modules/Inventory/Unusable/Unusable/Unusable.component";
import { UnusableListComponent } from "./modules/Inventory/Unusable/UnusableList/UnusableList.component";
import { ModalProduct2Component } from "./shared/components/ModalProduct2/ModalProduct2.component";
import { SupplierReturnListComponent } from "./modules/Inventory/SupplierReturn/SupplierReturn-list/SupplierReturn-list.component";
import { SupplierReturnComponent } from "./modules/Inventory/SupplierReturn/SupplierReturn/SupplierReturn.component"
import { ModalReturnOilPOComponent } from "./modules/Inventory/ReturnOil/ModalReturnOilPO/ModalReturnOilPO.component";
import { AuditComponent } from "./modules/Inventory/Audit/Audit/Audit.component";
import { AuditListComponent } from "./modules/Inventory/Audit/AuditList/AuditList.component";
import { BranchListComponent } from "./modules/Master-data/Branch/Branch-list/Branch-list.component";
import { DateTimePickerComponent } from "./shared/components/DateTimePicker/DateTimePicker.component";
import { StandardPriceListComponent } from "./modules/Price/StandPrice/StandardPriceList/StandardPriceList.component";
import { StandardPriceComponent } from "./modules/Price/StandPrice/StandardPrice/StandardPrice.component";
import { BranchComponent } from "./modules/Master-data/Branch/Branch/Branch.component";
import { NonOilPriceComponent } from "./modules/Price/NonOilPrice/NonOilPrice/NonOilPrice.component";
import { DashboardComponent } from "./modules/dashboard/dashboard.component";
import { PostDayComponent } from "./modules/Sale/PostDay/PostDay.component";
import { ApproveListComponent } from "./modules/Master-data/Approve/ApproveList/ApproveList.component";
import { ReportSummaryOilBalanceComponent } from "./modules/Report/ReportSummaryOilBalance/ReportSummaryOilBalance.component";
import { ReportSummarySaleComponent } from "./modules/Report/ReportSummarySale/ReportSummarySale.component";
import { ReportStockComponent } from "./modules/Report/ReportStock/ReportStock.component";

import { ApproveComponent } from "./modules/Master-data/Approve/Approve/Approve.component";
import { NonOilPriceListComponent } from "./modules/Price/NonOilPrice/NonOilPriceList/NonOilPriceList.component";
import { ExcelReaderComponent } from "./modules/Master-data/ExcelReader/ExcelReader/ExcelReader.component";
import { ModalReportStockProductComponent } from "./modules/Report/ReportStock/Modal/Product/modal-product/modal-product.component";
import { ModalReportStockProductGroupComponent } from './modules/Report/ReportStock/Modal/Product/modal-product-group/modal-product-group.component';
import { ReportStationComponent } from './modules/Report/ReportStation/report-station/report-station.component';
import { NumberInputDirective } from '././shared/components/number-input-directive/number-input-directive';
import { ModalReportComponent } from './modules/Report/Modal/modal-report/modal-report.component';
import { NoPermissionScreenComponent } from "./shared/components/NoPermissionScreen/NoPermissionScreen.component";
import { LableLangComponent } from "./shared/components/LableLang/LableLang.component";
import { TestComponent } from "./modules/Test/Test.component";
import { LangService } from "./service/Lang.service";
import { UnlockStatusComponent } from './modules/Master-data/UnlockStatus/unlock-status/unlock-status.component';
import { PermitDirective } from './shared/components/decimal-directive/permit.directive';
import { LoginComponent } from "./modules/authentication/login/login.component";
import { JwtModule } from '@auth0/angular-jwt';
import { AuthGuard } from "./guards/auth-guard.service";
import { DialogBoxLoginBranchComponent } from "./modules/authentication/login/dialog-box-branch/dialog-box-branch.component";
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { ReportGovermentComponent } from './modules/Report/report-goverment/report-goverment.component';
import { ReportInventoryComponent } from './modules/Report/report-inventory/report-inventory.component';
import { ReportPTCorporateComponent } from './modules/Report/report-ptcorporate/report-ptcorporate.component';
import { DatePickerFormatDirective } from './shared/Directive/date-picker-format/date-picker-format.directive';
import { ReportMeterComponent } from './modules/Report/report-meter/report-meter.component';
import { ReportPostDayComponent } from "./modules/Report/ReportPostDay/ReportPostDay.component";
import { ModalHtmlComponent } from "./shared/components/ModalHtml/ModalHtml.component";
import { ShareDataService } from './shared/shared-service/data.service';
import { TokenInterceptor } from "./guards/token-interceptor";
import { CustomerListComponent } from "./modules/Master-data/Customer/CustomerList/CustomerList.component";
import { PositionComponent } from "./modules/Master-data/Position/Position/Position.component";
import { PositionListComponent } from "./modules/Master-data/Position/PositionList/PositionList.component";
import { ModalPositionJsonComponent } from "./modules/Master-data/Position/ModalPositionJson/ModalPositionJson.component";
import { EmployeeAuthComponent } from './modules/authentication/employee-auth/employee-auth.component';
import { CustomerComponent } from "./modules/Master-data/Customer/Customer/Customer.component";
import { MatRadioModule } from '@angular/material/radio';
import { ReportSaleComponent } from './modules/Report/report-sale/report-sale.component';
import { ReportCustomerComponent } from './modules/Report/report-customer/report-customer.component';
import { ReportFinanceComponent } from './modules/Report/report-finance/report-finance.component';
import { ModalCustomerComponent } from './modules/Report/Modal/modal-customer/modal-customer.component';
import { ProductListComponent } from "./modules/Master-data/Product/ProductList/ProductList.component";
import { ProductComponent } from "./modules/Master-data/Product/Product/Product.component";
import { BranchTankComponent } from './modules/Master-data/Branch/branch-tank/branch-tank.component';
import { BranchTankListComponent } from './modules/Master-data/Branch/branch-tank-list/branch-tank-list.component';
import { BranchTaxListComponent } from './modules/Master-data/Branch/branch-tax-list/branch-tax-list.component';
import { BranchTaxComponent } from './modules/Master-data/Branch/branch-tax/branch-tax.component';
import { SupplierListComponent } from "./modules/Master-data/Supplier/SupplierList/SupplierList.component";
import { SupplierComponent } from "./modules/Master-data/Supplier/Supplier/Supplier.component";
import { DeliveryControlListComponent } from './modules/Inventory/DeliveryControl/delivery-control-list/delivery-control-list.component';
import { DeliveryControlComponent } from "./modules/Inventory/DeliveryControl/DeliveryControl/DeliveryControl.component";
import { ExpenseListComponent } from './modules/Finance/Expense/expense-list/expense-list.component';
import { ExpenseComponent } from './modules/Finance/Expense/expense/expense.component';
import { ModalSearchReceiveComponent } from "./modules/Inventory/DeliveryControl/ModalSearchReceive/ModalSearchReceive.component";
import { ModalPosPaidValidateComponent } from "./modules/Sale/PostDay/ModalPosPaidValidate/ModalPosPaidValidate.component";
import { CostCenterComponent } from "./modules/Master-data/CostCenter/CostCenter/CostCenter.component";
import { CostCenterListComponent } from "./modules/Master-data/CostCenter/CostCenterList/CostCenterList.component";
import { UnitListComponent } from './modules/Master-data/Unit/unit-list/unit-list.component';
import { UnitComponent } from './modules/Master-data/Unit/unit/unit.component';

export function tokenGetter() {
  return localStorage.getItem("jwt");
}

@NgModule({
  declarations: [
    AppComponent,
    ExampleComponent,
    RequestComponent,
    RequestListComponent,
    QuotationComponent,
    QuotationListComponent,
    InvoiceListComponent,
    InvoiceComponent,
    CustomerModalComponent,
    ProductModalComponent,
    CashsaleComponent,
    CashsaleListComponent,
    DateRangeComponent,
    CreditsaleComponent,
    CreditsaleListComponent,
    ModalProductComponent,
    CashtaxListComponent,
    CashtaxComponent,
    BillingComponent,
    BillingListComponent,
    BillingModalItemComponent,
    TransferOutComponent,
    TransferOutListComponent,
    TransferOutModalRequestComponent,
    SupplyTransferInListComponent,
    SupplyTransferInComponent,
    BillingModalItemComponent,
    WithdrawComponent,
    WithdrawListComponent,
    AdjustRequestComponent,
    AdjustRequestListComponent,
    AdjustComponent,
    AdjustListComponent,
    MeterComponent,
    ModalLicensePlateComponent,
    ReceiveComponent,
    ReceiveListComponent,
    NumberDirective,
    TransferInComponent,
    TransferInListComponent,
    TransferInModalComponent,
    AdjustModalComponent,
    CreditnoteListComponent,
    CreditnoteComponent,
    PostDayComponent,
    ModalQuotationComponent,
    ModalCashTaxComponent,
    InputNumberFormatComponent,
    InputDecimalComponent,
    ReceiveGasComponent,
    ReceiveGasListComponent,
    ReceiveOilComponent,
    ReceiveOilListComponent,
    ModalPurchaseReceiveOilComponent,
    ModalPurchaseOrderComponent,
    PosListComponent,
    ReturnOilListComponent,
    ReturnOilComponent,
    DialogBoxCustomerComponent,
    DialogBoxLicensePlateComponent,
    DialogBoxCustomerCarComponent,
    DialogBoxBranchComponent,
    DialogBoxReasonComponent,
    DialogBoxEmployeeComponent,
    UnusableComponent,
    UnusableListComponent,
    ModalProduct2Component,
    SupplierReturnListComponent,
    SupplierReturnComponent,
    ModalReturnOilPOComponent,
    AuditComponent,
    AuditListComponent,
    BranchListComponent,
    DateTimePickerComponent,
    StandardPriceListComponent,
    StandardPriceComponent,
    BranchComponent,
    NonOilPriceComponent,
    NonOilPriceListComponent,
    DashboardComponent,
    ApproveListComponent,
    ReportSummaryOilBalanceComponent,
    ReportSummarySaleComponent,
    ReportStockComponent,
    ApproveComponent,
    ExcelReaderComponent,
    ModalReportStockProductComponent,
    ModalReportStockProductGroupComponent,
    ReportStationComponent,
    NumberInputDirective,
    ModalReportComponent,
    NoPermissionScreenComponent,
    LableLangComponent,
    TestComponent,
    UnlockStatusComponent,
    UnlockStatusComponent,
    PermitDirective,
    LoginComponent,
    DialogBoxLoginBranchComponent,
    PagenotfoundComponent,
    ReportGovermentComponent,
    ReportInventoryComponent,
    ReportPTCorporateComponent,
    DatePickerFormatDirective,
    ReportMeterComponent ,
    ReportPostDayComponent,
    ModalHtmlComponent,
    CustomerListComponent,
    CustomerComponent,
    PositionComponent,
    PosListComponent,
    PositionListComponent,
    ModalPositionJsonComponent,
    EmployeeAuthComponent,
    ReportSaleComponent,
    ReportCustomerComponent,
    ReportFinanceComponent,
    ModalCustomerComponent,
    ProductModalComponent,
    ProductListComponent,
    ProductComponent,
    BranchTankComponent,
    BranchTankListComponent,
    BranchTaxListComponent,
    BranchTaxComponent,
    SupplierListComponent,
    SupplierComponent,
    DeliveryControlListComponent,
    DeliveryControlComponent,
    ExpenseListComponent,
    ExpenseComponent ,
    ModalSearchReceiveComponent,
    ModalPosPaidValidateComponent,
    CostCenterComponent,
    CostCenterListComponent,
    UnitListComponent,
    UnitComponent    
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DefaultModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    DynamicStepperModule,
    DynamicTableModule,
    NgbModule,
    HttpClientModule,
    MatPaginatorModule,
    MatTableModule,
    MatStepperModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatRadioModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["https://localhost", "https://dev-maxstation.pt.co.th", "https://uat-maxstation.pt.co.th", "maxstation.pt.co.th", "https://devops-uat-maxstation.pt.co.th"],
        disallowedRoutes: []
      }
    })
  ],
  providers: [
    WINDOW_PROVIDERS,
    SharedService,
    ShareDataService,
    DatePipe,
    { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    LangService,
    AuthGuard
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
