import { Injectable, Inject } from "@angular/core";
import { WINDOW } from '../window.providers';
import { ApiUrl } from '../../../configs/apiurl.json';



@Injectable()
export class SharedService {
  isToggleSidenav = true;
  isLoading = false;


  constructor(@Inject(WINDOW) private window: Window) {
    this.initAPI();
    console.log("api =>" + ApiUrl);
  }

  getHostname(): string {
    return this.window.location.hostname;
  }

  initAPI(): void {
    let host: string = this.getHostname();
    this.hostname= host;
    // console.clear();
    console.log(host);

    switch (host) {
      case "maxstation.pt.co.th":  //PRODUCTION
      this.urlInv = "https://maxstation.pt.co.th/inventory";
      this.urlMas = "https://maxstation.pt.co.th/masterdata";
      this.urlSale = "https://maxstation.pt.co.th/sale";        
      this.urlFinance = "https://maxstation.pt.co.th/finance";
      this.urlReport = "https://maxstation.pt.co.th/report";
      this.urlDailyOperation = "https://prod-maxstation-dailyoperation-web1-asv.azurewebsites.net";
      this.urlDailyOperationApim = "https://ptg-apim-services.pt.co.th/prd-max";
      this.urlDailyAks = "https://maxstation.pt.co.th/dailyoperation";
      this.urlViewer = "https://maxstation.pt.co.th/report-viewer";
      this.urlPostDay = "https://maxstation.pt.co.th/postday";    
      this.urlCommon = "https://maxstation.pt.co.th/common";    

      // this.urlInv = "https://maxstation-inventory-api.pt.co.th";
      // this.urlMas = "https://maxstation-masterdata-api.pt.co.th";
      // this.urlSale = "https://prod-maxstation-sale1-api-asv.azurewebsites.net";
      // this.urlFinance = "https://maxstation-finance-api.pt.co.th";
      // this.urlReport = "https://maxstation-report-api.pt.co.th";
      // this.urlViewer = "http://prod-maxstation-report-viewer-api-asv.azurewebsites.net";
      // this.urlDailyOperation = "https://prod-maxstation-dailyoperation-web1-asv.azurewebsites.net";
      // this.urlDailyOperationApim = "https://ptg-apim-services.pt.co.th/prd-max";
      // this.urlDailyAks = "https://prod-maxstation-dailyoperation-web1-asv.azurewebsites.net";
      // this.urlPostDay = "https://prod-maxstation-postday-web-asv.azurewebsites.net";
      // this.urlCommon = "https://prod-maxstation-common-web-asv.azurewebsites.net";
        break;

      case "uat-maxstation.pt.co.th":  //uat kuber
        this.urlInv = "https://uat-maxstation.pt.co.th/inventory";
        this.urlMas = "https://uat-maxstation.pt.co.th/masterdata";
        this.urlSale = "https://uat-maxstation.pt.co.th/sale";
        this.urlFinance = "https://uat-maxstation.pt.co.th/finance";
        this.urlReport = "https://uat-maxstation.pt.co.th/report";
        this.urlViewer = "https://uat-maxstation.pt.co.th/report-viewer";
        this.urlDailyOperation = "https://uat-pt-maxstation-dailyoperation-asv.azurewebsites.net";
        this.urlDailyOperationApim = "https://dev-ptg-apim-services.pt.co.th/dev-max";
        this.urlDailyAks = "https://uat-pt-maxstation-dailyoperation-asv.azurewebsites.net";
        this.urlPostDay = "https://uat-maxstation.pt.co.th/postday";
        this.urlPrice = "https://uat-maxstation.pt.co.th/price";
        this.urlCommon = "https://uat-maxstation.pt.co.th/common";
        break;
      
        case "devops-uat-maxstation.pt.co.th":  //uat kuber
        this.urlInv = "https://devops-uat-maxstation.pt.co.th/inventory";
        this.urlMas = "https://devops-uat-maxstation.pt.co.th/masterdata";
        this.urlSale = "https://devops-uat-maxstation.pt.co.th/sale";
        this.urlFinance = "https://devops-uat-maxstation.pt.co.th/finance";
        this.urlReport = "https://devops-uat-maxstation.pt.co.th/report";
        this.urlViewer = "https://devops-uat-maxstation.pt.co.th/report-viewer";
        this.urlDailyOperation = "https://uat-pt-maxstation-dailyoperation-asv.azurewebsites.net";
        this.urlDailyOperationApim = "https://dev-ptg-apim-services.pt.co.th/dev-max";
        this.urlDailyAks = "https://uat-pt-maxstation-dailyoperation-asv.azurewebsites.net";
        this.urlPostDay = "https://devops-uat-maxstation.pt.co.th/postday";
        this.urlPrice = "https://devops-uat-maxstation.pt.co.th/price";
        this.urlCommon = "https://devops-uat-maxstation.pt.co.th/common";
        break;

      case "dev-maxstation.pt.co.th":  //dev kuber
        this.urlInv = "https://dev-maxstation.pt.co.th/inventory";
        this.urlMas = "https://dev-maxstation.pt.co.th/masterdata";
        this.urlSale = "https://dev-maxstation.pt.co.th/sale";
        this.urlFinance = "https://dev-maxstation.pt.co.th/finance";
        this.urlReport = "https://dev-maxstation.pt.co.th/report";
        this.urlViewer = "https://dev-maxstation.pt.co.th/report-viewer";
        this.urlDailyOperation = "https://devops-uat-maxstation.pt.co.th/dailyoperation";
        this.urlDailyOperationApim = "https://devops-uat-maxstation.pt.co.th/dailyoperation";
        this.urlDailyAks = "https://devops-uat-maxstation.pt.co.th/dailyoperation";
        this.urlPostDay = "https://dev-maxstation.pt.co.th/postday";
        this.urlPrice = "https://dev-maxstation.pt.co.th/price";
        this.urlCommon = "https://dev-maxstation.pt.co.th/common";
        break;

      case "localhost":  //LOCALHOST        NgModule
        // this.urlInv = "https://localhost:44362";
        this.urlInv = "https://uat-maxstation.pt.co.th/inventory";

        // this.urlMas = "https://localhost:44309";
        this.urlMas = "https://uat-maxstation.pt.co.th/masterdata";

        // this.urlSale = "http://localhost:44390";
        this.urlSale = "https://uat-maxstation.pt.co.th/sale";

        // this.urlCommon = "https://localhost:44385";
        this.urlCommon = "https://uat-maxstation.pt.co.th/common";

        // this.urlFinance = "http://localhost:41914";
        this.urlFinance = "https://uat-maxstation.pt.co.th/finance";

        this.urlReport = "https://uat-maxstation.pt.co.th/report";
        // this.urlReport = "http://localhost:58782";

        // this.urlViewer = "https://uat-maxstation.pt.co.th/report-viewer";
        this.urlViewer = "http://localhost:8080";

        // this.urlDailyOperationApim = "https://dev-ptg-apim-services.pt.co.th/dev-max";
        this.urlDailyOperationApim = "http://localhost:25458";

        // this.urlDailyOperation = "http://localhost:25458";
        // this.urlDailyOperationApim = "https://dev-ptg-apim-services.pt.co.th/dev-max";
        this.urlDailyOperationApim = "https://ptg-apim-services.pt.co.th/prd-max";

        this.urlDailyOperation = "https://uat-pt-maxstation-dailyoperation-asv.azurewebsites.net";
        // this.urlDailyOperation = "https://prod-maxstation-dailyoperation-web1-asv.azurewebsites.net";

      //  this.urlDailyAks = "https://maxstation.pt.co.th/dailyoperation";
        // this.urlDailyAks =  "https://uat-pt-maxstation-dailyoperation-asv.azurewebsites.net";
        // this.urlDailyAks =  "https://prod-maxstation-dailyoperation-web1-asv.azurewebsites.net";
        this.urlDailyAks =  "http://localhost:25458";

        this.urlPostDay = "https://localhost:44344";
        // this.urlPostDay = "https://uat-maxstation.pt.co.th/postday";

        // this.urlCommon = "https://uat-maxstation.pt.co.th/common";

        this.urlPrice = "http://localhost:57592";
        // this.urlPrice = "https://uat-maxstation.pt.co.th/price";

        // this.urlMas = "https://maxstation.pt.co.th/masterdata";
        // this.urlCommon = "https://uat-maxstation.pt.co.th/common";
        // this.urlDailyOperation = "https://prod-maxstation-dailyoperation-web1-asv.azurewebsites.net";
      
        break;

      default:
        this.urlInv = "";
        this.urlMas = "";
        this.urlSale = "";        
        this.urlFinance = "";
        this.urlViewer = "";
        this.urlDailyOperation = "";
        this.urlDailyAks = "";
        this.urlDailyOperationApim = "";
        this.urlPrice = "";
        this.urlViewer = "";
        break;
    }


  }

  //==================== Global Variable ====================
  brnCode = "";
  compCode = "";
  locCode = "";
  systemDate = new Date();
  user = "";

  urlInv = "";
  urlMas = "";
  urlSale = "";  
  urlFinance = "";
  urlReport = "";
  urlViewer = "";
  urlDailyOperation = "";
  urlDailyOperationApim = "";
  urlDailyAks = "";
  urlPostDay = "";
  urlCommon = "";
  public urlPrice : string = "";
  hostname = "";
}
