import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Product } from 'src/app/model/report/master/product.interface';
import { ProductGroup } from 'src/app/model/report/master/productgroup.interface';
import { ReportConfig } from 'src/app/model/report/master/reportconfig.interface';
import { SharedService } from 'src/app/shared/shared.service';
import { GetPeriodResponse } from 'src/app/model/report/report.class';
import { IncomingMessage } from 'http';
import { Customer } from 'src/app/model/report/master/customer.interface';

export interface ProductData<T> {
  items: T[],
  Data: T[],
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;

  links: {
    first: string;
    previous: string;
    next: string;
    last: string;
  }
};

export interface CustomerData<T> {
  items: T[],
  Data: T[],
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;

  links: {
    first: string;
    previous: string;
    next: string;
    last: string;
  }
};

export interface ProductGroupData<T> {
  items: T[],
  Data: T[],
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;

  links: {
    first: string;
    previous: string;
    next: string;
    last: string;
  }
};

export interface ExportData<T> {
  items: T[],
  Data: T[],
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;

  links: {
    first: string;
    previous: string;
    next: string;
    last: string;
  }
};

@Injectable({
  providedIn: 'root'
})

export class ReportService {
  constructor(private http: HttpClient, private sharedService: SharedService,) { }

  public async getReportSummaryOilBalanceExcel(compCode: string, brnCode: string, docDate: string) {

    let request = {
      "CompCode": compCode,
      "BrnCode": brnCode,
      "DocDate": docDate,
    }

    let headers = new HttpHeaders()
    let strUrl = (this.sharedService.urlReport || "").toString().trim() + "/api/ReportSummaryOilBalance/GetReportSummaryOilBalanceExcel";
    this.http.post(strUrl, request, {
      responseType: 'arraybuffer', headers: headers
    }
    ).subscribe(response => this.downLoadFile('รายงานสรุปน้ำมันคงเหลือ.xlsx', response, "application/octet-stream"));
  }

  public async getReportSummaryOilBalancePDF(compCode: string, brnCode: string, docDate: string) {

    let request = {
      "CompCode": compCode,
      "BrnCode": brnCode,
      "DocDate": docDate,
    }

    let headers = new HttpHeaders()
    let strUrl = (this.sharedService.urlViewer || "").toString().trim() + "/ReportSummaryOilBalance/GetReportSummaryOilBalance";
    this.http.post(strUrl, request, {
      responseType: 'arraybuffer', headers: headers
    }
    ).subscribe(response => this.downLoadFile('รายงานสรุปน้ำมันคงเหลือ.pdf', response, "application/octet-stream"));
  }

  public async getReportSummarySaleExcel(compCode: string, brnCode: string, docDate: string, periodNo: number) {

    let request = {
      "CompCode": compCode,
      "BrnCode": brnCode,
      "DocDate": docDate,
      "PeriodNo": periodNo
    }

    let headers = new HttpHeaders()
    let strUrl = (this.sharedService.urlReport || "").toString().trim() + "/api/ReportSummarySale/GetReportSummarySaleExcel";
    this.http.post(strUrl, request, {
      responseType: 'arraybuffer', headers: headers
    }
    ).subscribe(response => this.downLoadFile('รายงานสรุปการขายประจำวัน.xlsx', response, "application/octet-stream"));
  }

  public async getReportSummarySalePDF(compCode: string, brnCode: string, docDate: string, periodNo: number) {

    let request = {
      "CompCode": compCode,
      "BrnCode": brnCode,
      "DocDate": docDate,
      "PeriodNo": periodNo
    }

    let headers = new HttpHeaders()
    let strUrl = (this.sharedService.urlViewer || "").toString().trim() + "/ReportSummarySale/GetReportSummarySale";
    this.http.post(strUrl, request, {
      responseType: 'arraybuffer', headers: headers
    }
    ).subscribe(response => this.downLoadFile('รายงานสรุปการขายประจำวัน.pdf', response, "application/octet-stream"));
  }

  public async getPeriodReportSummarySaleExcel(compCode: string, brnCode: string, docDate: string): Promise<Array<GetPeriodResponse>> {

    let request = {
      "CompCode": compCode,
      "BrnCode": brnCode,
      "DocDate": docDate,
    }

    let strUrl = (this.sharedService.urlReport || "").toString().trim() + "/api/ReportSummarySale/GetPeriod";
    return await this.http.post(strUrl, request).pipe(
      map((documentData: Array<GetPeriodResponse>) => documentData),
      catchError(err => throwError(err))
    ).toPromise()
  }

  private downLoadFile(fileName: string, data: any, type: string) {

    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);

    let a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }

  public async getReportStockExcel(compCode: string, brnCode: string, startDate: string, endDate: string, productIdStart: string, productIdEnd: string, productGroupIdStart: string, productGroupIdEnd: string, excelUrl: string, reportName: string) {

    let request = {
      "CompCode": compCode,
      "BrnCode": brnCode,
      "DateFrom": startDate,
      "DateTo": endDate,
      "ProductIdStart": productIdStart,
      "ProductIdEnd": productIdEnd,
      "ProductGroupIdStart": productGroupIdStart,
      "ProductGroupIdEnd": productGroupIdEnd,
    }

    let headers = new HttpHeaders()
    let strUrl = (this.sharedService.urlReport || "").toString().trim() + "/api/" + excelUrl;
    this.http.post(strUrl, request, {
      responseType: 'arraybuffer', headers: headers
    }
    ).subscribe(response => this.downLoadFile(reportName + '.xlsx', response, "application/octet-stream"));
  }

  public async getReportStockPDF(compCode: string, brnCode: string, startDate: string, endDate: string, productIdStart: string, productIdEnd: string, productGroupIdStart: string, productGroupIdEnd: string, reportUrl: string, reportName: string) {

    let request = {
      "CompCode": compCode,
      "BrnCode": brnCode,
      "DateFrom": startDate,
      "DateTo": endDate,
      "ProductIdStart": productIdStart,
      "ProductIdEnd": productIdEnd,
      "ProductGroupIdStart": productGroupIdStart,
      "ProductGroupIdEnd": productGroupIdEnd,
    }

    let headers = new HttpHeaders()
    // let strUrl = (this.sharedService.urlViewer || "").toString().trim() + "/ReportStock/GetReportStock";
    let strUrl = (this.sharedService.urlViewer || "").toString().trim() + "/" + reportUrl;
    this.http.post(strUrl, request, {
      responseType: 'arraybuffer', headers: headers
    }
    ).subscribe(response => this.downLoadFile(reportName + '.pdf', response, "application/octet-stream"));
  }

  public async ExportReportTaxInvoicePDF(compCode: string, brnCode: string, docNo: string, guid: string, empCode: string) {

    let request = {
      "CompCode": compCode,
      "BrnCode": brnCode,
      "DocNo": docNo,
      "Guid": guid,
      "EmpCode": empCode,
    }

    let headers = new HttpHeaders()
    let strUrl = (this.sharedService.urlViewer || "").toString().trim() + "/TaxInvoice/PrintPdf";
    this.http.post(strUrl, request, {
      responseType: 'arraybuffer', headers: headers
    }
    ).subscribe(response => this.downLoadFile('รายงานใบกำกับภาษีเต็มรูป.pdf', response, "application/octet-stream"));
  }

  public async GetReportAuditPDF(compCode: string, brnCode: string, docNo: string, reportUrl: string, reportName: string) {

    let request = {
      "CompCode": compCode,
      "BrnCode": brnCode,
      "DocNo": docNo,
    }

    let headers = new HttpHeaders()
    let strUrl = (this.sharedService.urlViewer || "").toString().trim() + "/ReportAudit/" + reportUrl;
    this.http.post(strUrl, request, {
      responseType: 'arraybuffer', headers: headers
    }
    ).subscribe(response => this.downLoadFile(reportName + '.pdf', response, "application/octet-stream"));
  }

  public async GetReportInventoryByGroupExcel(compCode: string, brnCode: string, startDate: string, endDate: string, productIdStart: string, productIdEnd: string, productGroupIdStart: string, productGroupIdEnd: string, selectedStatus: number, excelUrl: string, reportName: string) {
    let request = {
      "compCode": compCode,
      "brnCode": brnCode,
      "dateFrom": startDate,
      "dateTo": endDate,
      "reportType": selectedStatus,
      "productIdStart": productIdStart,
      "productIdEnd": productIdEnd,
      "productGroupIdStart": productGroupIdStart,
      "productGroupIdEnd": productGroupIdEnd,
    }

    let headers = new HttpHeaders()
    let strUrl = (this.sharedService.urlReport || "").toString().trim() + "/api/" + excelUrl;
    this.http.post(strUrl, request, {
      responseType: 'arraybuffer', headers: headers
    }
    ).subscribe(response => this.downLoadFile(reportName + '.xlsx', response, "application/octet-stream"));
  }

  public async GetReportInventoryByGroupPDF(compCode: string, brnCode: string, startDate: string, endDate: string, productIdStart: string, productIdEnd: string, productGroupIdStart: string, productGroupIdEnd: string, selectedStatus: number, reportUrl: string, reportName: string) {

    let request = {
      "compCode": compCode,
      "brnCode": brnCode,
      "dateFrom": startDate,
      "dateTo": endDate,
      "reportType": selectedStatus,
      "productIdStart": productIdStart,
      "productIdEnd": productIdEnd,
      "productGroupIdStart": productGroupIdStart,
      "productGroupIdEnd": productGroupIdEnd,
      // "Period": ""
    }
    let headers = new HttpHeaders()
    let strUrl = (this.sharedService.urlViewer || "").toString().trim() + "/" + reportUrl;
    this.http.post(strUrl, request, {
      responseType: 'arraybuffer', headers: headers
    }
    ).subscribe(response => this.downLoadFile(reportName + '.pdf', response, "application/octet-stream"));
  }

  public async GetReportByGroupExcel(compCode: string, brnCode: string, startDate: string, endDate: string,  excelUrl: string, reportName: string) {
    let request = {
      "compCode": compCode,
      "brnCode": brnCode,
      "dateFrom": startDate,
      "dateTo": endDate,
    }

    let headers = new HttpHeaders()
    let strUrl = (this.sharedService.urlReport || "").toString().trim() + "/api/" + excelUrl;
    this.http.post(strUrl, request, {
      responseType: 'arraybuffer', headers: headers
    }
    ).subscribe(response => this.downLoadFile(reportName + '.xlsx', response, "application/octet-stream"));
  }

  public async GetReportSaleExcel(compCode: string, brnCode: string, startDate: string, endDate: string, reportType: number, docType: number, productIdStart: string, productIdEnd: string, customerIdStart: string, customerEnd: string, excelUrl: string, reportName: string) {
    let request = {
      "compCode": compCode,
      "brnCode": brnCode,
      "dateFrom": startDate,
      "dateTo": endDate,
      "ReportType": reportType,
      "DocType": docType,
      "PdIdFrom": productIdStart,
      "PdIdTo": productIdEnd,
      "CustCodeFrom":customerIdStart,
      "CustCodeTo": customerEnd
    }

    let headers = new HttpHeaders()
    let strUrl = (this.sharedService.urlReport || "").toString().trim() + "/api/" + excelUrl;
    this.http.post(strUrl, request, {
      responseType: 'arraybuffer', headers: headers
    }
    ).subscribe(response => this.downLoadFile(reportName + '.xlsx', response, "application/octet-stream"));
  }

  public async GetReportByBranchExcel(compCode: string, brnCode: string, branchType: number, unitType: number, startDate: string, endDate: string,  excelUrl: string, reportName: string) {
    let request = {
      "compCode": compCode,
      "brnCode": brnCode,
      "branchType": branchType,
      "UnitType": unitType,
      "dateFrom": startDate,
      "dateTo": endDate
    }

    let headers = new HttpHeaders()
    let strUrl = (this.sharedService.urlReport || "").toString().trim() + "/api/" + excelUrl;
    this.http.post(strUrl, request, {
      responseType: 'arraybuffer', headers: headers
    }
    ).subscribe(response => this.downLoadFile(reportName + '.xlsx', response, "application/octet-stream"));
  }
  
  public async GetReportSalePDF(compCode: string, brnCode: string, startDate: string, endDate: string, reportType: number, docType: number, productIdStart: string, productIdEnd: string, customerIdStart: string, customerEnd: string, reportUrl: string, reportName: string) {

    let request = {
      "compCode": compCode,
      "brnCode": brnCode,
      "dateFrom": startDate,
      "dateTo": endDate,
      "ReportType": reportType,
      "DocType": docType,
      "PdIdFrom": productIdStart,
      "PdIdTo": productIdEnd,
      "CustCodeFrom":customerIdStart,
      "CustCodeTo": customerEnd
    }
    let headers = new HttpHeaders()
    let strUrl = (this.sharedService.urlViewer || "").toString().trim() + "/" + reportUrl;
    this.http.post(strUrl, request, {
      responseType: 'arraybuffer', headers: headers
    }
    ).subscribe(response => this.downLoadFile(reportName + '.pdf', response, "application/octet-stream"));
  }

  public async GetReportByGroupPDF(compCode: string, brnCode: string, startDate: string, endDate: string,  reportUrl: string, reportName: string) {

    let request = {
      "compCode": compCode,
      "brnCode": brnCode,
      "dateFrom": startDate,
      "dateTo": endDate,
    }
    let headers = new HttpHeaders()
    let strUrl = (this.sharedService.urlViewer || "").toString().trim() + "/" + reportUrl;
    this.http.post(strUrl, request, {
      responseType: 'arraybuffer', headers: headers
    }
    ).subscribe(response => this.downLoadFile(reportName + '.pdf', response, "application/octet-stream"));
  }

  public async GetReportByBranchPDF(compCode: string, brnCode: string, branchType: number, unitType: number, startDate: string, endDate: string,  reportUrl: string, reportName: string , onComplete : ()=> void = null) {

    let request = {
      "compCode": compCode,
      "brnCode": brnCode,
      "branchType": branchType,
      "UnitType": unitType,
      "dateFrom": startDate,
      "dateTo": endDate
    }
    let headers = new HttpHeaders()
    let strUrl = (this.sharedService.urlViewer || "").toString().trim() + "/" + reportUrl;
    this.http.post(strUrl, request, {
      responseType: 'arraybuffer', headers: headers
    }
    ).subscribe(response => {
      this.downLoadFile(reportName + '.pdf', response, "application/octet-stream");
      if(onComplete != null){
        onComplete();
      }
    });
  }

  findAllMasProduct(keyword: string, page: number, size: number): Observable<ProductData<Product>> {
    var data =
    {
      "Keyword": keyword,
      "Page": page,
      "ItemsPerPage": size,
    }
    this.sharedService.urlSale;
    return this.http.post(this.sharedService.urlMas + '/api/Product/FindAll', data).pipe(
      map((productData: ProductData<Product>) => productData),
      catchError(err => throwError(err))
    )
  }

  findAllMasCustomer(keyword: string, page: number, size: number): Observable<CustomerData<Customer>> {
    var data =
    {
      "Keyword": keyword,
      "Page": page,
      "ItemsPerPage": size,
    }
    this.sharedService.urlSale;
    return this.http.post(this.sharedService.urlMas + '/api/Customer/FindAll', data).pipe(
      map((productData: CustomerData<Customer>) => productData),
      catchError(err => throwError(err))
    )
  }

  findAllMasProductGroup(keyword: string, page: number, size: number): Observable<ProductGroupData<ProductGroup>> {
    var data =
    {
      "Keyword": keyword,
      "Page": page,
      "ItemsPerPage": size,
    }
    this.sharedService.urlSale;
    return this.http.post(this.sharedService.urlMas + '/api/ProductGroup/FindAll', data).pipe(
      map((productData: ProductGroupData<ProductGroup>) => productData),
      catchError(err => throwError(err))
    )
  }

  findReportConfigByGroup(group: string, keyword: string, page: number, size: number): Observable<ExportData<ReportConfig>> {
    var data =
    {
      "Group": group,
      "Keyword": keyword,
      "Page": page,
      "ItemsPerPage": size,
    }
    this.sharedService.urlSale;
    return this.http.post(this.sharedService.urlReport + '/api/Report/FindReportConfigByGroup', data).pipe(
      map((productData: ExportData<ReportConfig>) => productData),
      catchError(err => throwError(err))
    )
  }

  findReportConfig(group: string): Observable<ExportData<ReportConfig>> {
    var data =
    {
      "Group": group
    }
    return this.http.post(this.sharedService.urlReport + '/api/Report/findReportConfig', data)
      .pipe(
        map((cashsaleData: ExportData<ReportConfig>) => cashsaleData),
        catchError((error: HttpErrorResponse) => {
          let errorMessage = '';
          if (error.error instanceof ErrorEvent) {
            errorMessage = 'Error:' + error.error.message;
          } else {
            errorMessage = 'Error Code:' + error.status + '\n Message:' + error.error.message;
          }
          return throwError(errorMessage);
        })
      )
  }

  public async getReportPostDayExcel(compCode: string, dataType: number, docDate: string) {

    let request = {
      "CompCode": compCode,
      "Type": dataType,
      "DocDate": docDate,
    }

    let headers = new HttpHeaders();
    let strUrl =  (this.sharedService.urlReport || "").toString().trim() + "/api/PostDay/GetWorkDateExcel";
    this.http.post(strUrl, request, {
      responseType: 'arraybuffer', headers: headers
    }
    ).subscribe(response => this.downLoadFile('รายงานตรวจสอบข้อมูลปิดสิ้นวัน.xlsx', response, "application/octet-stream"));
  }

  public async GetReportCustomerPDF(compCode: string, brnCode: string, startDate: string, endDate: string, custCodeFrom: string, custCodeTo: string, reportType: number, reportUrl: string, reportName: string) {

    let request = {
      "CompCode": compCode,
      "BrnCode": brnCode,
      "DateFrom": startDate,
      "DateTo": endDate,
      "CustCodeFrom": custCodeFrom,
      "CustCodeTo": custCodeTo,
      "ReportType": reportType,
    }

    let headers = new HttpHeaders()
    let strUrl = (this.sharedService.urlViewer || "").toString().trim() + "/" + reportUrl;
    this.http.post(strUrl, request, {
      responseType: 'arraybuffer', headers: headers
    }
    ).subscribe(response => this.downLoadFile(reportName + '.pdf', response, "application/octet-stream"));
  }

  public async GetReportCustomerExcel(compCode: string, brnCode: string, startDate: string, endDate: string, custCodeFrom: string, custCodeTo: string, reportType: number, excelUrl: string, reportName: string) {

    let request = {
      "CompCode": compCode,
      "BrnCode": brnCode,
      "DateFrom": startDate,
      "DateTo": endDate,
      "CustCodeFrom": custCodeFrom,
      "CustCodeTo": custCodeTo,
      "ReportType": reportType,
    }

    let headers = new HttpHeaders()
    let strUrl = (this.sharedService.urlReport || "").toString().trim() + "/api/" + excelUrl;
    this.http.post(strUrl, request, {
      responseType: 'arraybuffer', headers: headers
    }
    ).subscribe(response => this.downLoadFile(reportName + '.xlsx', response, "application/octet-stream"));
  }

  public async GetReportFinanceExcel(compCode: string, brnCode: string, startDate: string, endDate: string,  excelUrl: string, reportName: string) {
    let request = {
      "compCode": compCode,
      "brnCode": brnCode,
      "dateFrom": startDate,
      "dateTo": endDate
    }

    let headers = new HttpHeaders()
    let strUrl = (this.sharedService.urlReport || "").toString().trim() + "/api/" + excelUrl;
    this.http.post(strUrl, request, {
      responseType: 'arraybuffer', headers: headers
    }
    ).subscribe(response => this.downLoadFile(reportName + '.xlsx', response, "application/octet-stream"));
  }

  public async GetReportFinancePDF(compCode: string, brnCode: string, startDate: string, endDate: string,  reportUrl: string, reportName: string) {

    let request = {
      "compCode": compCode,
      "brnCode": brnCode,
      "dateFrom": startDate,
      "dateTo": endDate
    }
    let headers = new HttpHeaders()
    let strUrl = (this.sharedService.urlViewer || "").toString().trim() + "/" + reportUrl;
    this.http.post(strUrl, request, {
      responseType: 'arraybuffer', headers: headers
    }
    ).subscribe(response => this.downLoadFile(reportName + '.pdf', response, "application/octet-stream"));
  }

  public async ExportReportBillingePDF(compCode: string, brnCode: string, docNo: string, empCode: string, reportName: string) {

    let request = {
      "CompCode": compCode,
      "BrnCode": brnCode,
      "DocNo": docNo,
      "EmpCode": empCode,
    }

    let headers = new HttpHeaders()
    let strUrl = (this.sharedService.urlViewer || "").toString().trim() + "/Billing/PrintPdf";
    this.http.post(strUrl, request, {
      responseType: 'arraybuffer', headers: headers
    }
    ).subscribe(response => this.downLoadFile(reportName + '.pdf', response, "application/octet-stream"));
  }

  public async GetReportBillingExcel(compCode: string, brnCode: string, docNo: string, empCode: string, reportName: string) {

    let request = {
      "CompCode": compCode,
      "BrnCode": brnCode,
      "DocNo": docNo,
      "EmpCode": empCode,
    }

    let headers = new HttpHeaders()
    let strUrl = (this.sharedService.urlReport || "").toString().trim() + "/api/" + "Billing/ExportExcel";
    this.http.post(strUrl, request, {
      responseType: 'arraybuffer', headers: headers
    }
    ).subscribe(response => this.downLoadFile(reportName + '.xlsx', response, "application/octet-stream"));
  }

  public async ExportReportCreditNotePDF(compCode: string, brnCode: string, locCode: string, docNo: string, empCode: string, reportName: string, reportUrl: string) {

    let request = {
      "CompCode": compCode,
      "BrnCode": brnCode,
      "LocCode": locCode,
      "DocNo": docNo,
      "EmpCode": empCode,
    }

    let headers = new HttpHeaders()
    let strUrl = (this.sharedService.urlViewer || "").toString().trim() + "/"+ reportUrl;
    this.http.post(strUrl, request, {
      responseType: 'arraybuffer', headers: headers
    }
    ).subscribe(response => this.downLoadFile(reportName + '.pdf', response, "application/octet-stream"));
  }

  public async getReportMasCustomerExcel(custCode: string) {

    let request = {
      "CustCode": custCode,
    }

    let headers = new HttpHeaders()
    let strUrl = (this.sharedService.urlReport || "").toString().trim() + "/api/Customer/ExportExcel";
    this.http.post(strUrl, request, {
      responseType: 'arraybuffer', headers: headers
    }
    ).subscribe(response => this.downLoadFile('รายงานรายละเอียดลูกค้า.xlsx', response, "application/octet-stream"));
  }
}
