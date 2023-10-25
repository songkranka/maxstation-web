import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DefaultComponent } from "./layouts/default/default.component";
import { ExampleComponent } from "./modules/example/example.component";
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { RequestComponent } from './modules/Inventory/Request/request/request.component';
import { RequestListComponent } from './modules/Inventory/Request/request-list/request-list.component';
import { QuotationComponent } from './modules/Sale/Quotation/quotation/quotation.component';
import { QuotationListComponent } from './modules/Sale/Quotation/quotation-list/quotation-list.component';
import { CashsaleComponent } from './modules/Sale/cashsale/cashsale/cashsale.component';
import { CashsaleListComponent } from './modules/Sale/cashsale/cashsale-list/cashsale-list.component';
import { CashtaxListComponent } from './modules/Sale/CashTax/cashtax-list/cashtax-list.component';
import { LoginComponent } from './modules/authentication/login/login.component';
import { InvoiceListComponent } from './modules/Invoice/InvoiceList/InvoiceList.component';
import { InvoiceComponent } from './modules/Invoice/Invoice/Invoice.component';
import { CreditsaleComponent } from './modules/Sale/CreditSale/creditsale/creditsale.component';
import { CreditsaleListComponent } from './modules/Sale/CreditSale/creditsale-list/creditsale-list.component';
import { CashtaxComponent } from "./modules/Sale/CashTax/cashtax/cashtax.component";
import { BillingComponent } from "./modules/Sale/Billing/Billing/Billing.component";
import { BillingListComponent } from "./modules/Sale/Billing/BillingList/BillingList.component";
import { TransferOutComponent } from "./modules/Inventory/TransferOut/transferout/transferout.component";
import { TransferOutListComponent } from "./modules/Inventory/TransferOut/transferout-list/transferout-list.component";
import { WithdrawComponent } from './modules/Inventory/Withdraw/withdraw/withdraw.component';
import { SupplyTransferInListComponent } from './modules/Inventory/SupplyTransferIn/SupplyTransferInList/SupplyTransferInList.component';
import { SupplyTransferInComponent } from './modules/Inventory/SupplyTransferIn/SupplyTransferIn/SupplyTransferIn.component';
import { AdjustRequestComponent } from './modules/Inventory/AdjustRequest/AdjustRequest/AdjustRequest.component';
import { AdjustRequestListComponent } from './modules/Inventory/AdjustRequest/AdjustRequestList/AdjustRequestList.component';
import { AdjustComponent } from './modules/Inventory/Adjust/Adjust/Adjust.component';
import { AdjustListComponent } from './modules/Inventory/Adjust/AdjustList/AdjustList.component';
import { MeterComponent } from './modules/Daily-operation/Meter/Meter/Meter.component';
import { WithdrawListComponent } from './modules/Inventory/Withdraw/withdraw-list/withdraw-list.component';
import { ReceiveComponent } from './modules/Finance/Receive/receive/receive.component';
import { ReceiveListComponent } from './modules/Finance/Receive/receive-list/receive-list.component';
import { TransferInListComponent } from './modules/Inventory/TransferIn/TransferInList/TransferInList.component';
import { TransferInComponent } from './modules/Inventory/TransferIn/TransferIn/TransferIn.component';
import { CreditnoteListComponent } from './modules/Sale/CreditNote/creditnote-list/creditnote-list.component';
import { CreditnoteComponent } from './modules/Sale/CreditNote/creditnote/creditnote.component';
import { PostDayComponent } from "./modules/Sale/PostDay/PostDay.component";
import { ReceiveGasComponent } from "./modules/Inventory/ReceiveGas/ReceiveGas/ReceiveGas.component";
import { ReceiveGasListComponent } from "./modules/Inventory/ReceiveGas/ReceiveGasList/ReceiveGasList.component";
import { ReceiveOilComponent } from "./modules/Inventory/ReceiveOil/ReceiveOil/ReceiveOil.component";
import { ReceiveOilListComponent } from "./modules/Inventory/ReceiveOil/ReceiveOilList/ReceiveOilList.component";
import { PosListComponent } from './modules/daily-shifting/POS/pos-list/pos-list.component';
import { ReturnOilComponent } from "./modules/Inventory/ReturnOil/ReturnOil/ReturnOil.component";
import { ReturnOilListComponent } from "./modules/Inventory/ReturnOil/ReturnOilList/ReturnOilList.component";
import { UnusableListComponent } from "./modules/Inventory/Unusable/UnusableList/UnusableList.component";
import { UnusableComponent } from "./modules/Inventory/Unusable/Unusable/Unusable.component";
import { SupplierReturnComponent } from "./modules/Inventory/SupplierReturn/SupplierReturn/SupplierReturn.component";
import { SupplierReturnListComponent } from "./modules/Inventory/SupplierReturn/SupplierReturn-list/SupplierReturn-list.component";
import { ReportSummaryOilBalanceComponent } from "./modules/Report/ReportSummaryOilBalance/ReportSummaryOilBalance.component";
import { ReportSummarySaleComponent } from "./modules/Report/ReportSummarySale/ReportSummarySale.component";
import { ReportStockComponent } from "./modules/Report/ReportStock/ReportStock.component";
import { ReportStationComponent } from "./modules/Report/ReportStation/report-station/report-station.component"
import { ReportGovermentComponent } from "./modules/Report/report-goverment/report-goverment.component"
import { ReportInventoryComponent } from "./modules/Report/report-inventory/report-inventory.component"
import { ReportPTCorporateComponent } from "./modules/Report/report-ptcorporate/report-ptcorporate.component"
import { ReportMeterComponent } from "./modules/Report/report-meter/report-meter.component"
import { ReportSaleComponent } from "./modules/Report/report-sale/report-sale.component"
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { AuditComponent } from "./modules/Inventory/Audit/Audit/Audit.component";
import { AuditListComponent } from "./modules/Inventory/Audit/AuditList/AuditList.component";

//Master data
import { BranchListComponent } from "./modules/Master-data/Branch/Branch-list/Branch-list.component";
import { BranchComponent } from "./modules/Master-data/Branch/Branch/Branch.component";
import { StandardPriceListComponent } from "./modules/Price/StandPrice/StandardPriceList/StandardPriceList.component";
import { StandardPriceComponent } from "./modules/Price/StandPrice/StandardPrice/StandardPrice.component";
import { NonOilPriceComponent } from "./modules/Price/NonOilPrice/NonOilPrice/NonOilPrice.component";
import { ApproveListComponent } from "./modules/Master-data/Approve/ApproveList/ApproveList.component";
import { ApproveComponent } from "./modules/Master-data/Approve/Approve/Approve.component";
import { NonOilPriceListComponent } from "./modules/Price/NonOilPrice/NonOilPriceList/NonOilPriceList.component";
import { ExcelReaderComponent } from "./modules/Master-data/ExcelReader/ExcelReader/ExcelReader.component";
import { NoPermissionScreenComponent } from "./shared/components/NoPermissionScreen/NoPermissionScreen.component";
import { TestComponent } from "./modules/Test/Test.component";
import { UnlockStatusComponent } from "./modules/Master-data/UnlockStatus/unlock-status/unlock-status.component";
import { AuthGuard } from "./guards/auth-guard.service";
import { ReportPostDayComponent } from "./modules/Report/ReportPostDay/ReportPostDay.component";
import { PositionComponent } from "./modules/Master-data/Position/Position/Position.component";
import { PositionListComponent } from "./modules/Master-data/Position/PositionList/PositionList.component";
import { EmployeeAuthComponent } from "./modules/authentication/employee-auth/employee-auth.component";
import { CustomerListComponent } from "./modules/Master-data/Customer/CustomerList/CustomerList.component";
import { CustomerComponent } from "./modules/Master-data/Customer/Customer/Customer.component";
import { ReportCustomerComponent } from "./modules/Report/report-customer/report-customer.component";
import { ReportFinanceComponent } from "./modules/Report/report-finance/report-finance.component";
import { ProductListComponent } from "./modules/Master-data/Product/ProductList/ProductList.component";
import { ProductComponent } from "./modules/Master-data/Product/Product/Product.component";
import { BranchTankListComponent } from "./modules/Master-data/Branch/branch-tank-list/branch-tank-list.component";
import { BranchTankComponent } from "./modules/Master-data/Branch/branch-tank/branch-tank.component";
import { BranchTaxListComponent } from "./modules/Master-data/Branch/branch-tax-list/branch-tax-list.component";
import { BranchTaxComponent } from "./modules/Master-data/Branch/branch-tax/branch-tax.component";
import { SupplierListComponent } from "./modules/Master-data/Supplier/SupplierList/SupplierList.component";
import { SupplierComponent } from "./modules/Master-data/Supplier/Supplier/Supplier.component";
import { DeliveryControlListComponent } from "./modules/Inventory/DeliveryControl/delivery-control-list/delivery-control-list.component";
import { DeliveryControlComponent } from "./modules/Inventory/DeliveryControl/DeliveryControl/DeliveryControl.component";
import { ExpenseListComponent } from './modules/Finance/Expense/expense-list/expense-list.component';
import { ExpenseComponent } from './modules/Finance/Expense/expense/expense.component';
import { CostCenterComponent } from "./modules/Master-data/CostCenter/CostCenter/CostCenter.component";
import { CostCenterListComponent } from "./modules/Master-data/CostCenter/CostCenterList/CostCenterList.component";
import { UnitListComponent } from "./modules/Master-data/Unit/unit-list/unit-list.component";
import { UnitComponent } from "./modules/Master-data/Unit/unit/unit.component";

const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "dashboard",
        component: DashboardComponent,
        canActivate: [AuthGuard],
        runGuardsAndResolvers: 'always',
      },
      {
        path: "InvoiceList",
        component: InvoiceListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "Invoice/:DocGuid",
        component: InvoiceComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "RequestList",
        component: RequestListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "Request/:DocGuid",
        component: RequestComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "AdjustRequestList",
        component: AdjustRequestListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "AdjustRequest/:DocGuid",
        component: AdjustRequestComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "AdjustList",
        component: AdjustListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "Adjust/:DocGuid",
        component: AdjustComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "Meter",
        component: MeterComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "QuotationList",
        component: QuotationListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "Quotation/:DocGuid",
        component: QuotationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "CashsaleList",
        component: CashsaleListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "Cashsale/:DocGuid",
        component: CashsaleComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "CreditSaleList",
        component: CreditsaleListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "CreditSale/:DocGuid",
        component: CreditsaleComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "CashtaxList",
        component: CashtaxListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "Cashtax/:DocGuid",
        component: CashtaxComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "BillingList",
        component: BillingListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "Billing/:DocGuid",
        component: BillingComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "TransferOutList",
        component: TransferOutListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "TransferOut/:DocGuid",
        component: TransferOutComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "SupplyTransferInList",
        component: SupplyTransferInListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "SupplyTransferIn/:DocGuid",
        component: SupplyTransferInComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "WithdrawList",
        component: WithdrawListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "Withdraw/:DocGuid",
        component: WithdrawComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "ReceiveList",
        component: ReceiveListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "Receive/:DocGuid",
        component: ReceiveComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "TransferInList",
        component: TransferInListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "TransferIn/:DocGuid",
        component: TransferInComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "CreditNoteList",
        component: CreditnoteListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "CreditNote",
        component: CreditnoteComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "CloseDay",
        component: PostDayComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "ReceiveGasList",
        component: ReceiveGasListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "ReceiveGas/:DocGuid",
        component: ReceiveGasComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "ReceiveOilList",
        component: ReceiveOilListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "ReceiveOil/:DocGuid",
        component: ReceiveOilComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "PosList",
        component: PosListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "ReturnOilList",
        component: ReturnOilListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "ReturnOil/:DocGuid",
        component: ReturnOilComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "UnusableList",
        component: UnusableListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "Unusable/:DocGuid",
        component: UnusableComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "SupplierReturnList",
        component: SupplierReturnListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "SupplierReturn/:DocGuid",
        component: SupplierReturnComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "AuditList",
        component: AuditListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "Audit/:DocGuid",
        component: AuditComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "BranchList",
        component: BranchListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "Branch/:BrnCode",
        component: BranchComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "StandardPriceList",
        component: StandardPriceListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "StandardPrice/:DocGuid",
        component: StandardPriceComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "NonOilPriceList",
        component: NonOilPriceListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "NonOilPrice/:DocGuid",
        component: NonOilPriceComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "ApproveList",
        component: ApproveListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "Approve/:DocGuid",
        component: ApproveComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "PositionList",
        component: PositionListComponent,
        //canActivate: [AuthGuard],
      },
      {
        path: "Position/:DocGuid",
        component: PositionComponent,
        //canActivate: [AuthGuard],
      },
      {
        path: "ReportSummaryOilBalance",
        component: ReportSummaryOilBalanceComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "ReportSummarySale",
        component: ReportSummarySaleComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "ReportStock",
        component: ReportStockComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "ReportStation",
        component: ReportStationComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "ReportGoverment",
        component: ReportGovermentComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "ReportInventory",
        component: ReportInventoryComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "ReportPTCorporate",
        component: ReportPTCorporateComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "ReportMeter",
        component: ReportMeterComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "ReportPostDay",
        component: ReportPostDayComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "ReportSales",
        component: ReportSaleComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "ReportCustomer",
        component: ReportCustomerComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "ReportFinance",
        component: ReportFinanceComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "Calibrate",
        component: ExcelReaderComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "Unlock",
        component: UnlockStatusComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "EmployeeAuth",
        component: EmployeeAuthComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "NoPermission",
        component: NoPermissionScreenComponent,
      },
      {
        path: "CustomerList",
        component: CustomerListComponent,
        //canActivate: [AuthGuard],
      },
      {
        path: "Customer/:DocGuid",
        component: CustomerComponent,
        //canActivate: [AuthGuard],
      },
      {
        path: "ProductList",
        component: ProductListComponent,
        //canActivate: [AuthGuard],
      },
      {
        path: "Product/:DocGuid",
        component: ProductComponent,
      },
      {
        path: "BranchTankList",
        component: BranchTankListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "BranchTank/:DocGuid",
        component: BranchTankComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "BranchTaxList",
        component: BranchTaxListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "BranchTax/:DocGuid",
        component: BranchTaxComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "SupplierList",
        component: SupplierListComponent,
        //canActivate: [AuthGuard],
      },
      {
        path: "Supplier/:DocGuid",
        component: SupplierComponent,
        //canActivate: [AuthGuard],
      },
      {
        path: "DeliveryControlList",
        component: DeliveryControlListComponent,
        //canActivate: [AuthGuard],
      },
      {
        path: "DeliveryControl/:DocGuid",
        component: DeliveryControlComponent,
        //canActivate: [AuthGuard],
      },
      {
        path: "CostCenter/:DocGuid",
        component: CostCenterComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "CostCenterList",
        component: CostCenterListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "example",
        component: ExampleComponent,
      },
      {
        path: "Test",
        component: TestComponent,
      },
      { path: '',
        redirectTo: '/Login',
        pathMatch: 'full'
      },
      {
        path: "ExpenseList",
        component: ExpenseListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "Expense/:DocGuid",
        component: ExpenseComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "UnitList",
        component: UnitListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "Unit/:DocGuid",
        component: UnitComponent,
        canActivate: [AuthGuard],
      },
      // { path: '**',
      //   component: PagenotfoundComponent
      // },
    ],
  },
  {
    path: "",
    component: LoginComponent,
    children: [
      { path: '', component: LoginComponent, },
      {
        path: "Login",
        component: LoginComponent,
      },
    ],
  },
  // {
  //   path: "register",
  //   component: RegisterComponent,
  // },
  // {
  //   path: "reset",
  //   component: ForgotpasswordComponent,
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule],
})
export class AppRoutingModule { }
