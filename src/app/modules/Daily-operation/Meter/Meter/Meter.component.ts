import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { valueSelectbox } from "../../../../shared-model/demoModel"
import { ActivatedRoute, Router } from '@angular/router';
import { SharedService } from '../../../../shared/shared.service';
import swal from 'sweetalert2';
/** Model **/
import { DefaultService } from 'src/app/service/default.service';
import { EmployeeData, MasterService } from 'src/app/service/master-service/master.service';
import { MeterService } from 'src/app/service/meter-service/meter-service';
import { MasBranchDispModel, MasBranchTankModel, SumMasBranchTankModelByProduct, MeterDefective, Meter, SaveDocument, GetDocument, DeleteDocument, Tank, GetDocumentResponse, MasBranchCashModel, Cash, ModelDopPeriodGl, MasBranchSumCashModel, ProductDisplay } from 'src/app/model/master/meter.interface';
import { DomSanitizer } from '@angular/platform-browser';
import * as moment from 'moment';
import { Employee } from 'src/app/model/master/employee.interface';
import { ModelMasBranchCalibrate, ModelMasBranchConfig, ModelMasBranchTank, ModelMasReason } from 'src/app/model/ModelScaffold';
import { reduce } from 'rxjs/operators';
import * as internal from 'events';
import Swal from 'sweetalert2';
import { async } from '@angular/core/testing';
import { AuthGuard } from 'src/app/guards/auth-guard.service';



@Component({
  selector: 'app-Meter',
  templateUrl: './Meter.component.html',
  styleUrls: ['./Meter.component.scss']
})


export class MeterComponent implements OnInit , AfterViewInit  {

  //==================== Global Variable ====================
  public ArrHoldReason : ModelMasReason[] = [];
  public IntStepperIndex = 0;
  public MasBranchConfig = new ModelMasBranchConfig();
  //*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z
  activeMeterDefective = new MeterDefective;
  activeTab: number = 1;
  oldTab: number = 1;
  employeeSelect2: Array<valueSelectbox> = [];
  headerCard: string = "บันทึกมิเตอร์/วัดถัง/รับจ่าย";
  allData: string = "";
  listAllEmp: EmployeeData<Employee> = null;
  listMasBranchCalibrate: Array<ModelMasBranchCalibrate> = [];
  listProductDisplay: Array<ProductDisplay> = [];
  //meter
  listMasBranchDisp: Array<MasBranchDispModel> = [];
  //tank
  listMasBranchTank: Array<MasBranchTankModel> = [];
  public SelectTank = new MasBranchTankModel();
  //cash
  listMasBranchCash: Array<MasBranchCashModel> = [];
  MasBranchSumCash = new MasBranchSumCashModel;
  listMasBranchCashDr: Array<ModelDopPeriodGl> = [];
  listMasBranchCashCr: Array<ModelDopPeriodGl> = [];


  listSumMasBranchTankModelByProduct: Array<SumMasBranchTankModelByProduct> = [];
  status = "";

  // sumListDr: number = 0;
  // sumListDrSlip: number = 0;
  // sumListCr: number = 0;

  //list object
  meterData = new Meter;
  tankData = new Tank;
  cashData = new Cash;

  btnSave = false;
  btnComplete = false;
  btnClear = false;
  btnGetPos = false;

  isPosData = false;
  isOldData = false;

  //==================== URL ====================
  //*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z
  brnCode = this.sharedService.brnCode;
  compCode = this.sharedService.compCode;
  urlInv = this.sharedService.urlInv;
  urlMas = this.sharedService.urlMas;
  private authPositionRole: any;

  @ViewChildren('stepper') stepper;

  //Ref element for validate data of meter step
  @ViewChild('btnAddTab', { read: ElementRef }) btnAddTab;
  @ViewChild('inputDate', { read: ElementRef }) inputDate;

  @ViewChildren('periodStart', { read: ElementRef }) periodStart;
  @ViewChildren('periodFinish', { read: ElementRef }) periodFinish;
  @ViewChildren('employee', { read: ElementRef }) employee;

  //==================== Button Control ====================
  //*** กรุณาเรียงชื่อตัวแปรตามตัวอักษรภาษาอังกฤษ A|a ถึง Z|z

  TabEntity = [
    {
      tab_no: 1,
      tab_name: "กะที่1",
    },
  ];

  date = new Date(this.sharedService.systemDate);
  currentDate = new Date(this.sharedService.systemDate);
  public CanLoadPreviousMeter : boolean = false;
  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private routerLink: Router,
    private sharedService: SharedService,
    public SvDefault: DefaultService,
    private _masService: MasterService,
    private _meterService: MeterService,
    private _sanitizer: DomSanitizer,
    private authGuard: AuthGuard,
  ) {
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
    // await this.SvDefault.DoActionAsync(async () => await this.start(), true);
    await this.SvDefault.DoActionAsync2(async () => await this.start(), true , 2);
  }
  ngAfterViewInit(): void {
    //console.log(this.stepper);
  }
  //==================== Function ====================

  private async start() {
    this.authPositionRole = this.SvDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }

    await this.getEmployee();
    await this.getMasBranchCalibrate();
    await this.getDocument();
    this.ArrHoldReason = await this._meterService.GetHoldReason();
    this.MasBranchConfig = await this._masService.GetMasBranchConfig(this.sharedService.compCode , this.sharedService.brnCode);
  }

  public clearSelectedEmp() {
    this.employeeSelect2 = this.listAllEmp["items"].map(x => <valueSelectbox>{
      KEY: `${x.empCode} : ${x.empName}`,
      VALUE: x.empCode
    });
  }

  private async getMasBranchCalibrate() {
    let listMasBranchCalibrate = await this._meterService.getMasBranchCalibrate(this.compCode, this.brnCode);

    if (listMasBranchCalibrate["isSuccess"]) {
      listMasBranchCalibrate["items"].forEach((element) => {

        let masBranchCalibrate = new ModelMasBranchCalibrate();
        this.SvDefault.CopyObject(element, masBranchCalibrate);

        this.listMasBranchCalibrate.push(masBranchCalibrate);
      });
    }
  }

  private async getEmployee() {
    this.listAllEmp = await this._masService.findEmployeeAllByBranch(this.brnCode);
    if (this.listAllEmp["items"].length > 0) {
      this.employeeSelect2 = this.listAllEmp["items"].map(x => <valueSelectbox>{
        KEY: `${x.empCode} : ${x.empName}`,
        VALUE: x.empCode
      });
    }
  }

  async getPosMeter() {
    await this.SvDefault.DoActionAsync2(async () => await this.GetPosMeter(), true , 2);
  }

  private async GetPosMeter() {
    let meterResponse = await this._meterService.ValidatePOS(this.brnCode , this.activeTab ,<any>this.SvDefault.GetFormatDate(this.date));
    if(meterResponse.StatusCode === 400){
      throw meterResponse.Message;
    }
    let listPosMeterNewData = await this._meterService.GetPosMeterAPIM(this.compCode, this.brnCode, this.SvDefault.GetFormatDate(this.date), this.activeTab, this.meterData.PeriodStart);
    //let listPosMeterNewData = await this._meterService.getPosMeter(this.compCode, this.brnCode, this.SvDefault.GetFormatDate(this.date), this.activeTab, this.meterData.PeriodStart);
    console.log(listPosMeterNewData);
    if(!this.SvDefault.ValidateApim(listPosMeterNewData)){
      return;
    }

    if (listPosMeterNewData["isSuccess"]) {
      if (listPosMeterNewData["items"][0]["masBranchDispItems"].length > 0) {
        this.isPosData = true;
        //this.listMasBranchDisp = [];

        listPosMeterNewData["items"].forEach(x => {
          // x["masBranchDispItems"].forEach((element) => {
          //   let masBranchDisp = new MasBranchDispModel();
          //   this.SvDefault.CopyObject(element, masBranchDisp);
          //   this.listMasBranchDisp.push(masBranchDisp);
          // });
          for (let i = 0; i < x["masBranchDispItems"].length; i++) {
            let element = x["masBranchDispItems"][i];
            let masBranchDisp = new MasBranchDispModel();
            this.SvDefault.CopyObject(element, masBranchDisp);
            if(masBranchDisp.MeterStart === 0 && masBranchDisp.MeterFinish === 0){
              let mbd = this.listMasBranchDisp.find(x=> masBranchDisp.PdId === x.PdId && masBranchDisp.HoseId === x.HoseId );
              if(mbd != null){
                mbd.MeterFinish = mbd.MeterStart;
                mbd.TotalQty = 0;
                mbd.SaleAmt = 0;
              }
              continue;
            }
            for (let j = 0; j < this.listMasBranchDisp.length; j++) {
              let mbd = this.listMasBranchDisp[j];
              if(masBranchDisp.PdId === mbd.PdId && masBranchDisp.HoseId === mbd.HoseId){
              // if(masBranchDisp.DispId === mbd.DispId){
                this.listMasBranchDisp[j] = masBranchDisp;
                break;
              }
            }
          }

          let arrDopPeriodGl = <any[]>x["masBranchCashDrItems"];
          if(this.SvDefault.IsArray(arrDopPeriodGl) && this.SvDefault.IsArray(this.listMasBranchCashDr)){
            for (let i = 0; i < arrDopPeriodGl.length; i++) {
              let dpg = arrDopPeriodGl[i];
              let cashDr = this.listMasBranchCashDr.find(x=> x.GlNo === dpg.glNo);
              if(cashDr != null){
                cashDr.GlAmt = dpg.glAmt;

              }
            }
          }
          //this.listMasBranchCashDr
        });

        // this.listMasBranchDisp.forEach(x => {
        //   // x.SaleQty = x.MeterFinish - x.MeterStart;
        //   x.RepairStart = 0;
        //   x.RepairQty = 0;
        //   x.TestStart = 0;
        //   x.TestQty = 0;
        // });

        this.calculateSumSaleQtyMeter();
        this.calculateSumTankByProduct();
        this.reCalculateCashStepForPosMeter();
        // this.recalCashStep();
      } else {
        swal.fire({
          title: "ข้อมูลอยู่ระหว่างการส่งจากตู้จ่ายมายังส่วนกลาง กรุณารอซักครู่",
          allowOutsideClick: false,
          allowEscapeKey: false,
          icon: 'warning'
        });
      }
    } else {
      throw listPosMeterNewData["message"];

    }
  }
  private async GetPosMeterOld() {
    let meterResponse = await this._meterService.ValidatePOS(this.brnCode , this.activeTab ,<any>this.SvDefault.GetFormatDate(this.date));
    if(meterResponse.StatusCode === 400){
      Swal.fire("", meterResponse.Message , "warning");
      //return;
    }
    // let listPosMeterNewData = await this._meterService.getPosMeter(this.compCode, this.brnCode, this.SvDefault.GetFormatDate(this.date), this.activeTab, this.meterData.PeriodStart);
    let listPosMeterNewData = await this._meterService.GetPosMeterAPIM(this.compCode, this.brnCode, this.SvDefault.GetFormatDate(this.date), this.activeTab, this.meterData.PeriodStart);
    console.log(listPosMeterNewData);
    if(!this.SvDefault.ValidateApim(listPosMeterNewData)){
      return;
    }

    if (listPosMeterNewData["isSuccess"]) {
      if (listPosMeterNewData["items"][0]["masBranchDispItems"].length > 0) {
        this.isPosData = true;
        //this.listMasBranchDisp = [];

        listPosMeterNewData["items"].forEach(x => {
          // x["masBranchDispItems"].forEach((element) => {
          //   let masBranchDisp = new MasBranchDispModel();
          //   this.SvDefault.CopyObject(element, masBranchDisp);
          //   this.listMasBranchDisp.push(masBranchDisp);
          // });
          for (let i = 0; i < x["masBranchDispItems"].length; i++) {
            let element = x["masBranchDispItems"][i];
            let masBranchDisp = new MasBranchDispModel();
            this.SvDefault.CopyObject(element, masBranchDisp);
            if(masBranchDisp.MeterStart === 0 && masBranchDisp.MeterFinish === 0){
              let mbd = this.listMasBranchDisp.find(x=> masBranchDisp.PdId === x.PdId && masBranchDisp.HoseId === x.HoseId );
              if(mbd != null  ){
                mbd.MeterFinish = mbd.MeterStart;
                mbd.TotalQty = 0;
                mbd.SaleAmt = 0;
              }
              continue;
            }
            for (let j = 0; j < this.listMasBranchDisp.length; j++) {
              let mbd = this.listMasBranchDisp[j];
              if(masBranchDisp.PdId === mbd.PdId && masBranchDisp.HoseId === mbd.HoseId){
              // if(masBranchDisp.DispId === mbd.DispId){
                this.listMasBranchDisp[j] = masBranchDisp;
                break;
              }
            }
          }

          let arrDopPeriodGl = <any[]>x["masBranchCashDrItems"];
          if(this.SvDefault.IsArray(arrDopPeriodGl) && this.SvDefault.IsArray(this.listMasBranchCashDr)){
            for (let i = 0; i < arrDopPeriodGl.length; i++) {
              let dpg = arrDopPeriodGl[i];
              let cashDr = this.listMasBranchCashDr.find(x=> x.GlNo === dpg.glNo);
              if(cashDr != null){
                cashDr.GlAmt = dpg.glAmt;

              }
            }
          }
          //this.listMasBranchCashDr
        });

        // this.listMasBranchDisp.forEach(x => {
        //   // x.SaleQty = x.MeterFinish - x.MeterStart;
        //   x.RepairStart = 0;
        //   x.RepairQty = 0;
        //   x.TestStart = 0;
        //   x.TestQty = 0;
        // });

        this.calculateSumSaleQtyMeter();
        this.calculateSumTankByProduct();
        this.reCalculateCashStepForPosMeter();
        // this.recalCashStep();
      } else {
        swal.fire({
          title: "ข้อมูลอยู่ระหว่างการส่งจากตู้จ่ายมายังส่วนกลาง กรุณารอซักครู่",
          allowOutsideClick: false,
          allowEscapeKey: false,
          icon: 'warning'
        });
      }
    } else {
      swal.fire({
        title: listPosMeterNewData["message"],
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'error'
      }).then(() => {
        this.btnSave = true;
        this.btnComplete = true;
        this.btnClear = true;
        this.btnGetPos = true;
      });
    }
  }
  private async mapMasBrancDisc(){
    let listMeter = await this._masService.getMasBranchDISP(this.compCode, this.brnCode, this.SvDefault.GetFormatDate(this.date), this.activeTab, this.meterData.PeriodStart);

    if ( listMeter == null || ! listMeter["isSuccess"] || !this.SvDefault.IsArray(listMeter["items"])) {
      return;
    }
    for (let i = 0; i < listMeter["items"].length; i++) {
      let meterItem = listMeter["items"][i];
      for (let j = 0; j < meterItem["masBranchDispItems"].length; j++) {
        let meterMBD = meterItem["masBranchDispItems"][j];
        let mbd = new MasBranchDispModel();
        this.SvDefault.CopyObject(meterMBD, mbd);
        let currentMBD = this.listMasBranchDisp.find(x=> x.DispId === mbd.DispId);
        if(currentMBD != null){
          currentMBD.HoseId = mbd.HoseId;
        }
      }
    }
  }
  GetMeterList() {
    this.SvDefault.DoActionAsync(async () => this.getMeterList());
  }

  private async getMeterList() {
    this.status = this.getThaiStatus("Draft");
    // if (this.activeTab == 1) {
    //   this.meterData.PeriodStart = "05:00";
    // }
    let listMeter = await this._masService.getMasBranchDISP(this.compCode, this.brnCode, this.SvDefault.GetFormatDate(this.date), this.activeTab, this.meterData.PeriodStart);
    // console.log(listMeter);

    if (listMeter["isSuccess"]) {
      this.isOldData = false;
      if (listMeter["items"].length > 0) {
        this.meterData.PeriodStart = listMeter["items"][0].periodStart;
        this.meterData.PeriodFinish = listMeter["items"][0].periodFinish;
      }

      listMeter["items"].forEach(x => {
        x["masBranchDispItems"].forEach((element) => {
          let masBranchDisp = new MasBranchDispModel();
          this.SvDefault.CopyObject(element, masBranchDisp);
          this.listMasBranchDisp.push(masBranchDisp);
        });

        x["masBranchTankItems"].forEach(element => {
          let masBranchTank = new MasBranchTankModel();
          this.SvDefault.CopyObject(element, masBranchTank);
          this.listMasBranchTank.push(masBranchTank);
        });

        this.listMasBranchCashDr = [];
        x["masBranchCashDrItems"].forEach(element => {
          let masBranchCashDr = new ModelDopPeriodGl();
          this.SvDefault.CopyObject(element, masBranchCashDr);
          this.listMasBranchCashDr.push(masBranchCashDr);
        });

        this.listMasBranchCashCr = [];
        x["masBranchCashCrItems"].forEach(element => {
          let masBranchCashCr = new ModelDopPeriodGl();
          this.SvDefault.CopyObject(element, masBranchCashCr);
          this.listMasBranchCashCr.push(masBranchCashCr);
        });
      });
      this.sortBranchCash();
      this.listMasBranchDisp.forEach(x => {
        x.SaleQty = x.MeterFinish - x.MeterStart;
        x.TotalQty = x.SaleQty - x.TestQty;

        x.MeterFinish = 0;
        x.RepairStart = 0;
        x.RepairQty = 0;
        x.TestStart = 0;
        x.TestQty = 0;
      });

      this.listMasBranchTank.forEach(x => {
        x.RemainQty = (x.BeforeQty + x.ReceiveQty - x.TransferQty - x.IssueQty);
        x.DiffQty = x.RealQty - x.RemainQty;
        x.SaleQty = x.IssueQty - x.WithdrawQty;

        x.ReceiveQty = 0;
        x.TransferQty = 0;
        x.WithdrawQty = 0;
        // x.Height = 0;
        // x.WaterHeight = 0;
      });

      this.listMasBranchCashDr.forEach(x => { x.GlAmt = 0 });
      this.listMasBranchCashCr.forEach(x => { x.GlAmt = 0 });

      this.calculateSumSaleQtyMeter();
      this.calculateSumTankByProduct();
      this.initCashStep();
    } else {
      swal.fire({
        title: listMeter["message"],
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'error'
      }).then(() => {
        this.btnSave = true;
        this.btnComplete = true;
        this.btnClear = true;
        this.btnGetPos = true;
      });
    }
  }

  private groupBy(list, keyGetter) {
    let map = new Map();
    list.forEach((item) => {
      let key = keyGetter(item);
      let collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  private groupByMultiple(array, f) {
    var groups = {};
    array.forEach(function (o) {
      var group = JSON.stringify(f(o));
      groups[group] = groups[group] || [];
      groups[group].push(o);
    });
    return Object.keys(groups).map(function (group) {
      return groups[group];
    })
  }

  // private async getDocument() {
  //   let request = new GetDocument(this.compCode, this.brnCode, this.SvDefault.GetFormatDate(this.date), this.activeTab);
  //   let listData = await this._meterService.getDocument(request);
  //   this.allData = JSON.stringify(listData["Data"][0]);
  //   this.btnAddTab.nativeElement.classList.remove('hide');
  //   let totalItem = listData["TotalItems"];
  //   let documentData = listData["Data"][0];
  //   this.isPosData = false;
  //   if (!moment(this.date).isBefore(this.currentDate)) {
  //     if (totalItem < this.activeTab) {
  //       this.allData = "";
  //       await this.SvDefault.DoActionAsync(async () => this.getMeterList());
  //     } else {
  //       this.meterData.PeriodStart = documentData.Meter.PeriodStart;
  //       this.meterData.PeriodFinish = documentData.Meter.PeriodFinish;

  //       let splitArrEmp = [];
  //       documentData.Meter.Employee.forEach(x => {
  //         splitArrEmp.push(x.split(':')[0].trim());
  //       });

  //       this.meterData.Employee = splitArrEmp;
  //       this.listMasBranchDisp = documentData.Meter.Items;
  //       this.listMasBranchTank = documentData.Tank.TankItems;
  //       this.listMasBranchCash = documentData.Cash.CashItems;
  //       this.MasBranchSumCash = documentData.Cash.SumCashItems;
  //       this.listMasBranchCashDr = documentData.Cash.DrItems;
  //       this.listMasBranchCashCr = documentData.Cash.CrItems;
  //       this.calculateSumSaleQtyMeter();
  //       this.calculateSumTankByProduct();
  //       this.reCalculateCashStep();
  //       this.status = this.getThaiStatus(this.listMasBranchDisp[0].PeriodStatus);
  //       if (documentData.Post == "P") {
  //         this.status = "ปิดสิ้นวัน"
  //         this.btnSave = true;
  //         this.btnComplete = true;
  //         this.btnClear = true;
  //         this.isOldData = true;
  //       }
  //       else {
  //         this.btnSave = false;
  //         this.btnComplete = false;
  //         this.btnClear = false;
  //         this.isOldData = false;
  //       }

  //       if (this.TabEntity.length != totalItem) {
  //         this.TabEntity = [];
  //         for (let i = 1; i <= totalItem; i++) {
  //           this.addTab();
  //         }
  //       }
  //     }
  //   }
  //   else {
  //     await this.loadDataOldDay();
  //   }
  // }

  // private async loadDataOldDay() {
  //   let request = new GetDocument(this.compCode, this.brnCode, this.SvDefault.GetFormatDate(this.date), this.activeTab);
  //   let listData = await this._meterService.getDocument(request);
  //   if (listData["Data"].length > 0) {
  //     this.btnAddTab.nativeElement.classList.add('hide');
  //     let totalItem = listData["TotalItems"];
  //     let documentData = listData["Data"][0];
  //     this.meterData.PeriodStart = documentData.Meter.PeriodStart;
  //     this.meterData.PeriodFinish = documentData.Meter.PeriodFinish;
  //     this.meterData.Employee = documentData.Meter.Employee;
  //     this.listMasBranchDisp = documentData.Meter.Items;
  //     this.listMasBranchTank = documentData.Tank.TankItems;
  //     this.listMasBranchCash = documentData.Cash.CashItems;
  //     this.MasBranchSumCash = documentData.Cash.SumCashItems;
  //     this.listMasBranchCashDr = documentData.Cash.DrItems;
  //     this.listMasBranchCashCr = documentData.Cash.CrItems;
  //     this.calculateSumSaleQtyMeter();
  //     this.calculateSumTankByProduct();
  //     this.reCalculateCashStep();
  //     this.status = this.getThaiStatus(this.listMasBranchDisp[0].PeriodStatus);
  //     if (documentData.Post == "P") {
  //       this.status = "ปิดสิ้นวัน"
  //       this.btnSave = true;
  //       this.btnComplete = true;
  //       this.btnClear = true;
  //       this.isOldData = true;
  //     }
  //     else {
  //       this.btnSave = false;
  //       this.btnComplete = false;
  //       this.btnClear = false;
  //       this.isOldData = false;
  //     }

  //     if (this.TabEntity.length != totalItem) {
  //       this.TabEntity = [];
  //       for (let i = 1; i <= totalItem; i++) {
  //         this.addTab();
  //       }
  //     }
  //   }
  //   else {
  //     this.isOldData = false;
  //     this.btnSave = true;
  //     this.btnComplete = true;
  //     this.btnClear = true;

  //     this.TabEntity = [
  //       {
  //         tab_no: 1,
  //         tab_name: "กะที่1",
  //       },
  //     ];

  //     this.btnAddTab.nativeElement.classList.add('hide');

  //     swal.fire({
  //       title: "ไม่พบการบันทึกข้อมูล มิเตอร์/วัดถัง/รับจ่าย",
  //       allowOutsideClick: false,
  //       allowEscapeKey: false,
  //       icon: 'warning'
  //     })
  //   }
  // }

  private sortBranchCash(){
    if(this.SvDefault.IsArray(this.listMasBranchCashCr)){
      this.listMasBranchCashCr = this.listMasBranchCashCr.sort((x,y)=> (x.GlSeqNo || 0) - (y.GlSeqNo || 0));
    }
    if(this.SvDefault.IsArray(this.listMasBranchCashDr)){
      this.listMasBranchCashDr = this.listMasBranchCashDr.sort((x,y)=> (x.GlSeqNo || 0) - (y.GlSeqNo || 0));
    }
  }

  private async getCanLoadPreviousMeter(pGetDoc : any , pIntPeriod : number){
    let result = this.SvDefault.IsArray(pGetDoc["Data"]);
    if(result){
      return true;
    }
    let intPeriodNo  = pIntPeriod;
    let datCurrent = new Date( this.date.valueOf());
    if(intPeriodNo > 1){
      intPeriodNo = 1;
    }else{
      datCurrent.setDate(datCurrent.getDate()-1);
    }
    let request = new GetDocument(this.compCode, this.brnCode, this.SvDefault.GetFormatDate(datCurrent), intPeriodNo);
    let listData2 = await this._meterService.getDocument(request);
    result = this.SvDefault.IsArray(listData2["Data"]);
    return result;
    //pReq.PeriodNo
  }

  private async getDocument() {
    let request = new GetDocument(this.compCode, this.brnCode, this.SvDefault.GetFormatDate(this.date), this.activeTab);
    let listData = await this._meterService.getDocument(request);
    this.CanLoadPreviousMeter = await this.getCanLoadPreviousMeter(listData , this.activeTab);
    if (listData["Data"].length > 0 || !moment(this.date).isBefore(this.currentDate)) {
      this.allData = JSON.stringify(listData["Data"][0]);
      let totalItem = listData["TotalItems"];
      let documentData = listData["Data"][0];
      this.isPosData = false;
      if (totalItem < this.activeTab) {
        this.allData = "";
        this.btnSave = false;
        this.btnComplete = false;
        this.btnClear = false;
        this.isOldData = false;
        this.btnGetPos = false;
        this.btnAddTab.nativeElement.classList.add('hide');
        if (totalItem == 0) {
          this.TabEntity = [
            {
              tab_no: 1,
              tab_name: "กะที่1",
            },
          ];
        }
        await this.SvDefault.DoActionAsync(async () => this.getMeterList());
      } else {
        this.btnAddTab.nativeElement.classList.remove('hide');
        this.meterData.PeriodStart = documentData.Meter.PeriodStart;
        this.meterData.PeriodFinish = documentData.Meter.PeriodFinish;
        this.meterData.SumMeterSaleQty = documentData.Meter.SumMeterSaleQty;
        this.meterData.SumMeterTotalQty = documentData.Meter.SumMeterTotalQty;

        let splitArrEmp = [];
        documentData.Meter.Employee.forEach(x => {
          splitArrEmp.push(x.split(':')[0].trim());
        });

        this.meterData.Employee = splitArrEmp;
        this.listMasBranchDisp = documentData.Meter.Items;
        await this.mapMasBrancDisc();
        this.listMasBranchTank = documentData.Tank.TankItems;
        this.listMasBranchCash = documentData.Cash.CashItems;
        this.MasBranchSumCash = documentData.Cash.SumCashItems;
        this.listMasBranchCashDr = documentData.Cash.DrItems;
        this.listMasBranchCashCr = documentData.Cash.CrItems;
        this.sortBranchCash();
        // this.calculateSumSaleQtyMeter();
        // this.calculateSumTankByProduct();
        this.calculateSumTankByProductForGetDocument();
        // this.reCalculateCashStep();

        //calculate sum meter amt but not save
        let sumMeterAmt: number = 0;
        let sumSaleAmt: number = 0;
        let sumCreditAmt: number = 0;
        let sumCashAmt: number = 0;
        let sumCouponAmt: number = 0;
        let sumDiscAmt: number = 0;

        this.listMasBranchCash.forEach(x => {
          sumMeterAmt += x.MeterAmt;
          sumSaleAmt += x.SaleAmt;
          sumCreditAmt += x.CreditAmt;
          sumCashAmt += x.CashAmt;
          sumCouponAmt += x.CouponAmt;
          sumDiscAmt += x.DiscAmt;
        });
        this.MasBranchSumCash.SumMeterAmt = sumMeterAmt;
        this.MasBranchSumCash.SumSaleAmt = sumSaleAmt;
        this.MasBranchSumCash.SumCreditAmt = sumCreditAmt;
        this.MasBranchSumCash.SumCashAmt = sumCashAmt;
        this.MasBranchSumCash.SumCouponAmt = sumCouponAmt;
        this.MasBranchSumCash.SumDiscAmt = sumDiscAmt;


        this.status = this.getThaiStatus(this.listMasBranchDisp[0].PeriodStatus);
        if (documentData.Post == "P") {
          this.status = "ปิดสิ้นวัน"
          this.btnSave = true;
          this.btnComplete = true;
          this.btnClear = true;
          this.isOldData = true;
          this.btnGetPos = true;
          this.meterData.Employee = documentData.Meter.Employee;
          this.btnAddTab.nativeElement.classList.add('hide');
        }
        else {
          this.btnSave = false;
          this.btnComplete = false;
          this.btnClear = false;
          this.isOldData = false;
          this.btnGetPos = false;
          if (!moment(this.date).isBefore(this.currentDate)) {
            this.btnAddTab.nativeElement.classList.remove('hide');
          } else {
            this.btnAddTab.nativeElement.classList.add('hide');
          }
        }

        if (this.status == "แอคทีฟ") {
          this.btnSave = true;
        }

        if (this.TabEntity.length != totalItem) {
          this.TabEntity = [];
          for (let i = 1; i <= totalItem; i++) {
            this.addTab(false);
          }
        }

        if (documentData.IsPos == "Y") {
          this.isPosData = true;
        } else {
          this.isPosData = false;
        }
      }
    } else {
      this.isOldData = false;
      this.btnSave = true;
      this.btnComplete = true;
      this.btnClear = true;
      this.btnGetPos = true;

      this.TabEntity = [
        {
          tab_no: 1,
          tab_name: "กะที่1",
        },
      ];

      this.btnAddTab.nativeElement.classList.add('hide');

      swal.fire({
        title: "ไม่พบการบันทึกข้อมูล มิเตอร์/วัดถัง/รับจ่าย",
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'warning'
      });
    }
  }

  public calculateRowDisp(indexs: any) {
    let MasBranchDisp = this.listMasBranchDisp.find((row, index) => index == indexs);
    if(MasBranchDisp.DispStatus === "Cancel"){
      return;
    }
    // if (MasBranchDisp.MeterFinish < MasBranchDisp.MeterStart) {
    if (false) {
      swal.fire({
        title: "มิเตอร์ปิดกะต้องมากกว่าหรือเท่ากับมิเตอร์เริ่มกะเสมอ",
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'error'
      })
        .then(() => {
          MasBranchDisp.MeterFinish = 0;
        });
    } else {
      MasBranchDisp.SaleQty = this.SvDefault.GetNumber(MasBranchDisp.MeterFinish - MasBranchDisp.MeterStart,2) ;
      MasBranchDisp.TotalQty = this.SvDefault.GetNumber( MasBranchDisp.SaleQty - MasBranchDisp.TestQty,2);

      // //calculate issue qty in tank step
      // let MasBranchTank = this.listMasBranchTank.find(x => { return x.TankId == MasBranchDisp.TankId && x.PdId == MasBranchDisp.PdId });
      // MasBranchTank.IssueQty = 0;

      // let listSumSaleQty = this.listMasBranchDisp.filter(x => { return x.TankId == MasBranchDisp.TankId && x.PdId == MasBranchDisp.PdId });
      // listSumSaleQty.forEach(a => MasBranchTank.IssueQty += a.SaleQty);
      // MasBranchTank.SaleQty = MasBranchTank.IssueQty - MasBranchTank.WithdrawQty;

      this.calculateSumSaleQtyMeter();
      this.calculateSumTankByProduct();
      // this.initCashStep();
      this.reCalculateCashStep();
    }
  };

  public calcuOffset() {
    let productLength = this.listProductDisplay.length;
    return "offset-" + (12 - productLength);
  }

  public calculateRowCash(indexs: any, colName: any) {
    let MasBranchCash = this.listMasBranchCash.find((row, index) => index == indexs);
    if (colName == "Cash") {
      MasBranchCash.CashAmt = MasBranchCash.SaleAmt - MasBranchCash.CreditAmt;
      MasBranchCash.TotalAmt = MasBranchCash.CashAmt - MasBranchCash.CouponAmt - MasBranchCash.DiscAmt;
    } else if (colName == "Total") {
      MasBranchCash.TotalAmt = MasBranchCash.CashAmt - MasBranchCash.CouponAmt - MasBranchCash.DiscAmt;
    }

    this.reCalculateCashStep();
  };

  public calculateRowTank(indexs: any, colName: any) {
    let MasBranchTank = this.listMasBranchTank.find((row, index) => index == indexs);
    if (colName == "Remain") {
      MasBranchTank.RemainQty = (MasBranchTank.BeforeQty + MasBranchTank.ReceiveQty - MasBranchTank.TransferQty - MasBranchTank.IssueQty);
      MasBranchTank.DiffQty = MasBranchTank.RealQty - MasBranchTank.RemainQty;
      // MasBranchTank.DiffQty =MasBranchTank.RemainQty - MasBranchTank.RealQty;
    // }else if (colName === "Real"){
    //   MasBranchTank.DiffQty =MasBranchTank.RemainQty - MasBranchTank.RealQty;
    // }
    }else if (colName == "Sale") {
      MasBranchTank.SaleQty = MasBranchTank.IssueQty - MasBranchTank.WithdrawQty;
    } else if (colName == "Height") {
      if (this.listMasBranchCalibrate.length > 0) {
        let mapRealQty = this.listMasBranchCalibrate.find(x => x.TankId == MasBranchTank.TankId && x.PdId == MasBranchTank.PdId && x.LevelNo == MasBranchTank.Height);
        if (typeof mapRealQty != "undefined") {
          MasBranchTank.RealQty = mapRealQty.TankQty;
        } else {
          MasBranchTank.RealQty = 0;
        }
        MasBranchTank.DiffQty =MasBranchTank.RemainQty - MasBranchTank.RealQty;
      }
    } else if (colName == "Water") {
      let mapWaterQty = this.listMasBranchCalibrate.find(x => x.TankId == MasBranchTank.TankId && x.PdId == MasBranchTank.PdId && x.LevelNo == MasBranchTank.WaterHeight);
      if (typeof mapWaterQty != "undefined") {
        MasBranchTank.WaterQty = mapWaterQty.TankQty;
      } else {
        MasBranchTank.WaterQty = 0;
      }
    }else if (colName === "Real"){
      MasBranchTank.DiffQty =MasBranchTank.RemainQty - MasBranchTank.RealQty;
    }
    this.calculateSumTankByProduct();
    // this.initCashStep();
    this.reCalculateCashStep();
  };

  public calculateSumSaleQtyMeter() {
    this.meterData.SumMeterSaleQty = 0;
    this.meterData.SumMeterTotalQty = 0;
    this.listMasBranchDisp.forEach(a => this.meterData.SumMeterSaleQty = this.SvDefault.GetNumber(this.meterData.SumMeterSaleQty +  a.SaleQty,2) );
    this.listMasBranchDisp.forEach(a => this.meterData.SumMeterTotalQty = this.SvDefault.GetNumber(this.meterData.SumMeterTotalQty + a.TotalQty,2) );


    var groupTank = this.groupByMultiple(this.listMasBranchDisp, function (item) {
      return [item.TankId, item.PdId];
    });

    groupTank.forEach(x => {
      if (x.length > 0) {
        let MasBranchTank = this.listMasBranchTank.find(y => { return y.TankId == x[0].TankId && y.PdId == x[0].PdId });
        if(MasBranchTank){
          MasBranchTank.IssueQty = 0;
          // x.forEach(a => MasBranchTank.IssueQty += a.SaleQty);
          x.forEach(a => MasBranchTank.IssueQty += a.TotalQty);
          if(this.isPosData){
            MasBranchTank.RemainQty = (MasBranchTank.BeforeQty + MasBranchTank.ReceiveQty - MasBranchTank.TransferQty - MasBranchTank.IssueQty);
          }
          MasBranchTank.SaleQty = MasBranchTank.IssueQty - MasBranchTank.WithdrawQty;
        }
      }
    });
  }


  public reCalculateCashStepForPosMeter() {
    let listGroupProduct = this.groupBy(this.listMasBranchTank, tank => tank.PdId);
    listGroupProduct.forEach(x => {

      // let sumSaleQty = x.reduce((sum, current) => sum + current.SaleQty, 0);
      let sumSaleQty = x.reduce((sum, current) => sum + current.IssueQty, 0);

      let listMasBranchDisp = this.listMasBranchDisp.filter(y => { return y.PdId == x[0].PdId });
      let sumSaleAmt = listMasBranchDisp.reduce((sum, current) => sum + current.SaleAmt, 0);
      let sumCashAmt = listMasBranchDisp.reduce((sum, current) => sum + current.CashAmt, 0);
      let sumCreditAmt = listMasBranchDisp.reduce((sum, current) => sum + current.CreditAmt, 0);
      let sumDiscAmt = listMasBranchDisp.reduce((sum, current) => sum + current.DiscAmt, 0);
      let sumCouponAmt = listMasBranchDisp.reduce((sum, current) => sum + current.CouponAmt, 0);

      let masBranchCash = this.listMasBranchCash.find(y => { return y.PdId == x[0].PdId });
      masBranchCash.MeterAmt = this.SvDefault.GetNumber(sumSaleQty,2);
      masBranchCash.UnitPrice = x[0].Unitprice;
      masBranchCash.SaleAmt = this.SvDefault.GetNumber(sumSaleAmt,2);
      masBranchCash.CashAmt = sumCashAmt;
      masBranchCash.CreditAmt = sumCreditAmt;
      masBranchCash.DiscAmt = sumDiscAmt;
      masBranchCash.CouponAmt = sumCouponAmt;
      masBranchCash.TotalAmt = masBranchCash.CashAmt - masBranchCash.CouponAmt - masBranchCash.DiscAmt;
      // masBranchCash.TotalAmt = masBranchCash.SaleAmt - masBranchCash.CouponAmt - masBranchCash.DiscAmt;
    });

    //calculate final sum
    let sumTotalAmt: number = 0;
    let sumMeterAmt: number = 0;
    let sumSaleAmt: number = 0;
    let sumCreditAmt: number = 0;
    let sumCashAmt: number = 0;
    let sumCouponAmt: number = 0;
    let sumDiscAmt: number = 0;

    this.listMasBranchCash.forEach(x => {
      sumTotalAmt += x.TotalAmt;
      sumMeterAmt += x.MeterAmt;
      sumSaleAmt += x.SaleAmt;
      sumCreditAmt += x.CreditAmt;
      sumCashAmt += x.CashAmt;
      sumCouponAmt += x.CouponAmt;
      sumDiscAmt += x.DiscAmt;
    });

    let sumCr: number = 0;
    this.listMasBranchCashCr.forEach(x => {
      sumCr += x.GlAmt;
    });

    let sumDr: number = 0;
    let sumDrSlip: number = 0;
    this.listMasBranchCashDr.forEach(x => {
      sumDr += x.GlAmt;
      if (x.GlSlip == "Y") {
        sumDrSlip += x.GlAmt;
      }
    });

    let sumPosDrSlip = this.listMasBranchDisp.reduce((sum, current) => sum + current.CardAmt, 0)

    // this.sumListDr = sumDr;
    // this.sumListDrSlip = sumDrSlip;
    // this.sumListCr = sumCr;
    this.MasBranchSumCash.CashAmt = (sumTotalAmt + sumCr) - sumDr;
    this.MasBranchSumCash.DiffAmt = this.MasBranchSumCash.CashAmt - this.MasBranchSumCash.RealAmt;
    this.MasBranchSumCash.SumTotalAmt = sumTotalAmt;
    this.MasBranchSumCash.SumMeterAmt = sumMeterAmt;
    this.MasBranchSumCash.SumSaleAmt = sumSaleAmt;
    this.MasBranchSumCash.SumCreditAmt = sumCreditAmt;
    this.MasBranchSumCash.SumCashAmt = sumCashAmt;
    this.MasBranchSumCash.SumCouponAmt = sumCouponAmt;
    this.MasBranchSumCash.SumDiscAmt = sumDiscAmt;
    this.MasBranchSumCash.SumCrAmt = sumCr;
    this.MasBranchSumCash.SumDrAmt = sumDr;
    this.MasBranchSumCash.SumSlipAmt = sumDrSlip;
    this.MasBranchSumCash.SumPosSlipAmt = sumPosDrSlip;
  }



  public reCalculateCashStepForModalFix() {
    let listGroupProduct = this.groupBy(this.listMasBranchTank, tank => tank.PdId);
    listGroupProduct.forEach(x => {

      // let sumSaleQty = x.reduce((sum, current) => sum + current.SaleQty, 0);
      let sumSaleQty = x.reduce((sum, current) => sum + current.IssueQty, 0);

      let listMasBranchDisp = this.listMasBranchDisp.filter(y => { return y.PdId == x[0].PdId });
      let sumSaleAmt = listMasBranchDisp.reduce((sum, current) => sum + current.SaleAmt, 0);
      let sumCashAmt = listMasBranchDisp.reduce((sum, current) => sum + current.CashAmt, 0);
      let sumCreditAmt = listMasBranchDisp.reduce((sum, current) => sum + current.CreditAmt, 0);
      let sumDiscAmt = listMasBranchDisp.reduce((sum, current) => sum + current.DiscAmt, 0);
      let sumCouponAmt = listMasBranchDisp.reduce((sum, current) => sum + current.CouponAmt, 0);

      let masBranchCash = this.listMasBranchCash.find(y => { return y.PdId == x[0].PdId });
      masBranchCash.MeterAmt = this.SvDefault.GetNumber(sumSaleQty,2);
      masBranchCash.UnitPrice = x[0].Unitprice;
      masBranchCash.SaleAmt = this.SvDefault.GetNumber(sumSaleAmt,2);
      // masBranchCash.CashAmt = sumCashAmt;
      // masBranchCash.CreditAmt = sumCreditAmt;
      // masBranchCash.DiscAmt = sumDiscAmt;
      // masBranchCash.CouponAmt = sumCouponAmt;
       masBranchCash.TotalAmt = masBranchCash.CashAmt - masBranchCash.CouponAmt - masBranchCash.DiscAmt;
      // masBranchCash.TotalAmt = masBranchCash.SaleAmt - masBranchCash.CouponAmt - masBranchCash.DiscAmt;
    });

    //calculate final sum
    let sumTotalAmt: number = 0;
    let sumMeterAmt: number = 0;
    let sumSaleAmt: number = 0;
    let sumCreditAmt: number = 0;
    let sumCashAmt: number = 0;
    let sumCouponAmt: number = 0;
    let sumDiscAmt: number = 0;

    this.listMasBranchCash.forEach(x => {
      sumTotalAmt += x.TotalAmt;
      sumMeterAmt += x.MeterAmt;
      sumSaleAmt += x.SaleAmt;
      sumCreditAmt += x.CreditAmt;
      sumCashAmt += x.CashAmt;
      sumCouponAmt += x.CouponAmt;
      sumDiscAmt += x.DiscAmt;
    });

    let sumCr: number = 0;
    this.listMasBranchCashCr.forEach(x => {
      sumCr += x.GlAmt;
    });

    let sumDr: number = 0;
    let sumDrSlip: number = 0;
    this.listMasBranchCashDr.forEach(x => {
      sumDr += x.GlAmt;
      if (x.GlSlip == "Y") {
        sumDrSlip += x.GlAmt;
      }
    });

    let sumPosDrSlip = this.listMasBranchDisp.reduce((sum, current) => sum + current.CardAmt, 0)

    // this.sumListDr = sumDr;
    // this.sumListDrSlip = sumDrSlip;
    // this.sumListCr = sumCr;
    this.MasBranchSumCash.CashAmt = (sumTotalAmt + sumCr) - sumDr;
    this.MasBranchSumCash.DiffAmt = this.MasBranchSumCash.CashAmt - this.MasBranchSumCash.RealAmt;
    this.MasBranchSumCash.SumTotalAmt = sumTotalAmt;
    this.MasBranchSumCash.SumMeterAmt = sumMeterAmt;
    this.MasBranchSumCash.SumSaleAmt = sumSaleAmt;
    this.MasBranchSumCash.SumCreditAmt = sumCreditAmt;
    this.MasBranchSumCash.SumCashAmt = sumCashAmt;
    this.MasBranchSumCash.SumCouponAmt = sumCouponAmt;
    this.MasBranchSumCash.SumDiscAmt = sumDiscAmt;
    this.MasBranchSumCash.SumCrAmt = sumCr;
    this.MasBranchSumCash.SumDrAmt = sumDr;
    this.MasBranchSumCash.SumSlipAmt = sumDrSlip;
    this.MasBranchSumCash.SumPosSlipAmt = sumPosDrSlip;
  }



  public reCalculateCashStep() {
    let listGroupProduct = this.groupBy(this.listMasBranchTank, tank => tank.PdId);
    listGroupProduct.forEach(x => {

      let sumSaleQty = x.reduce((sum, current) => sum + current.IssueQty, 0);
      // let sumSaleQty = x.reduce((sum, current) => sum + current.SaleQty, 0);
      let masBranchCash = this.listMasBranchCash.find(y => { return y.PdId == x[0].PdId });
      masBranchCash.MeterAmt = this.SvDefault.GetNumber(sumSaleQty,2) ;
      masBranchCash.UnitPrice = x[0].Unitprice;
      if (!this.isPosData) {
        masBranchCash.SaleAmt = this.SvDefault.GetNumber(sumSaleQty * x[0].Unitprice,2) ;
      }
      masBranchCash.CashAmt = this.SvDefault.GetNumber(masBranchCash.SaleAmt - masBranchCash.CreditAmt,2) ;
      masBranchCash.TotalAmt = this.SvDefault.GetNumber(masBranchCash.CashAmt - masBranchCash.CouponAmt - masBranchCash.DiscAmt,2) ;
    });

    //calculate final sum
    let sumTotalAmt: number = 0;
    let sumMeterAmt: number = 0;
    let sumSaleAmt: number = 0;
    let sumCreditAmt: number = 0;
    let sumCashAmt: number = 0;
    let sumCouponAmt: number = 0;
    let sumDiscAmt: number = 0;

    this.listMasBranchCash.forEach(x => {
      sumTotalAmt += x.TotalAmt;
      sumMeterAmt += x.MeterAmt;
      sumSaleAmt += x.SaleAmt;
      sumCreditAmt += x.CreditAmt;
      sumCashAmt += x.CashAmt;
      sumCouponAmt += x.CouponAmt;
      sumDiscAmt += x.DiscAmt;
    });

    let sumCr: number = 0;
    this.listMasBranchCashCr.forEach(x => {
      sumCr += x.GlAmt;
    });

    let sumDr: number = 0;
    let sumDrSlip: number = 0;
    this.listMasBranchCashDr.forEach(x => {
      sumDr += x.GlAmt;
      if (x.GlSlip == "Y") {
        sumDrSlip += x.GlAmt;
      }
    });

    let sumPosDrSlip = this.listMasBranchDisp.reduce((sum, current) => sum + current.CardAmt, 0)
    let cashamt = (sumTotalAmt + sumCr- sumDr).toLocaleString("en-US", {maximumFractionDigits: 2,useGrouping: false});
      // console.log("amt ==>"+ (sumTotalAmt + sumCr- sumDr));
    // // console.log("formatter ==>"+ cashamt );
    // console.log("minimumIntegerDigits ==>"+ (123456.15555555).toLocaleString("en-US", {minimumIntegerDigits: 2,useGrouping: false}));

    this.MasBranchSumCash.CashAmt =  parseFloat(cashamt);    //sumTotalAmt + sumCr- sumDr
    this.MasBranchSumCash.DiffAmt = this.SvDefault.GetNumber(this.MasBranchSumCash.RealAmt - this.MasBranchSumCash.CashAmt,2) ;
    this.MasBranchSumCash.SumTotalAmt = sumTotalAmt;
    this.MasBranchSumCash.SumMeterAmt = sumMeterAmt;
    this.MasBranchSumCash.SumSaleAmt = sumSaleAmt;
    this.MasBranchSumCash.SumCreditAmt = sumCreditAmt;
    this.MasBranchSumCash.SumCashAmt = sumCashAmt;
    this.MasBranchSumCash.SumCouponAmt = sumCouponAmt;
    this.MasBranchSumCash.SumDiscAmt = sumDiscAmt;
    this.MasBranchSumCash.SumCrAmt = sumCr;
    this.MasBranchSumCash.SumDrAmt = sumDr;
    this.MasBranchSumCash.SumSlipAmt = sumDrSlip;
    this.MasBranchSumCash.SumPosSlipAmt = sumPosDrSlip;
  }

  private initCashStep() {
    this.listMasBranchCash = [];
    let listGroupProduct = this.groupBy(this.listMasBranchTank, tank => tank.PdId);
    listGroupProduct.forEach(x => {

      // let sumSaleQty = x.reduce((sum, current) => sum + current.SaleQty, 0);
      let sumSaleQty = x.reduce((sum, current) => sum + current.IssueQty, 0);

      let masBranchCash = new MasBranchCashModel();

      masBranchCash.PdId = x[0].PdId;
      masBranchCash.PdName = x[0].PdName;
      masBranchCash.MeterAmt = sumSaleQty;
      masBranchCash.UnitPrice = x[0].Unitprice;
      masBranchCash.SaleAmt = this.SvDefault.GetNumber(sumSaleQty * x[0].Unitprice,2) ;
      masBranchCash.CreditAmt = 0;
      masBranchCash.CashAmt = this.SvDefault.GetNumber(masBranchCash.SaleAmt - masBranchCash.CreditAmt,2) ;
      masBranchCash.CouponAmt = 0;
      masBranchCash.DiscAmt = 0;
      masBranchCash.TotalAmt = this.SvDefault.GetNumber(masBranchCash.CashAmt - masBranchCash.CouponAmt - masBranchCash.DiscAmt,2);


      this.listMasBranchCash.push(masBranchCash);
    });

    this.listMasBranchCash.sort((a, b) => (a.PdId > b.PdId) ? 1 : ((b.PdId > a.PdId) ? -1 : 0))

    //calculate final sum
    let sumTotalAmt: number = 0;
    let sumMeterAmt: number = 0;
    let sumSaleAmt: number = 0;
    let sumCreditAmt: number = 0;
    let sumCashAmt: number = 0;
    let sumCouponAmt: number = 0;
    let sumDiscAmt: number = 0;

    this.listMasBranchCash.forEach(x => {
      sumTotalAmt += x.TotalAmt;
      sumMeterAmt += x.MeterAmt;
      sumSaleAmt += x.SaleAmt;
      sumCreditAmt += x.CreditAmt;
      sumCashAmt += x.CashAmt;
      sumCouponAmt += x.CouponAmt;
      sumDiscAmt += x.DiscAmt;
    });

    let sumCr: number = 0;
    this.listMasBranchCashCr.forEach(x => {
      sumCr += x.GlAmt;
    });

    let sumDr: number = 0;
    let sumDrSlip: number = 0;
    this.listMasBranchCashDr.forEach(x => {
      sumDr += x.GlAmt;
      if (x.GlSlip == "Y") {
        sumDrSlip += x.GlAmt;
      }
    });

    let sumPosDrSlip = this.listMasBranchDisp.reduce((sum, current) => sum + current.CardAmt, 0)

    // this.sumListDr = sumDr;
    // this.sumListDrSlip = sumDrSlip;
    // this.sumListCr = sumCr;
    this.MasBranchSumCash.CashAmt = (sumTotalAmt + sumCr) - sumDr;
    this.MasBranchSumCash.RealAmt = 0;
    this.MasBranchSumCash.DepositAmt = 0;
    this.MasBranchSumCash.DiffAmt = this.MasBranchSumCash.CashAmt - this.MasBranchSumCash.RealAmt;
    this.MasBranchSumCash.SumTotalAmt = sumTotalAmt;
    this.MasBranchSumCash.SumMeterAmt = sumMeterAmt;
    this.MasBranchSumCash.SumSaleAmt = sumSaleAmt;
    this.MasBranchSumCash.SumCreditAmt = sumCreditAmt;
    this.MasBranchSumCash.SumCashAmt = sumCashAmt;
    this.MasBranchSumCash.SumCouponAmt = sumCouponAmt;
    this.MasBranchSumCash.SumDiscAmt = sumDiscAmt;
    this.MasBranchSumCash.SumCrAmt = sumCr;
    this.MasBranchSumCash.SumDrAmt = sumDr;
    this.MasBranchSumCash.SumSlipAmt = sumDrSlip;
    this.MasBranchSumCash.SumPosSlipAmt = sumPosDrSlip;
  }
  private recalCashStep() {
    //this.listMasBranchCash = [];
    let listGroupProduct = this.groupBy(this.listMasBranchTank, tank => tank.PdId);
    listGroupProduct.forEach(x => {

      // let sumSaleQty = x.reduce((sum, current) => sum + current.SaleQty, 0);
      let sumSaleQty = x.reduce((sum, current) => sum + current.IssueQty, 0);

      let masBranchCash = this.listMasBranchCash.find(y=> y.PdId == x[0].PdId);

      // masBranchCash.PdId = x[0].PdId;
      // masBranchCash.PdName = x[0].PdName;
      masBranchCash.MeterAmt = sumSaleQty;
      masBranchCash.UnitPrice = x[0].Unitprice;
      masBranchCash.SaleAmt = sumSaleQty * x[0].Unitprice;
      // masBranchCash.CreditAmt = 0;
      masBranchCash.CashAmt = masBranchCash.SaleAmt - masBranchCash.CreditAmt;
      // masBranchCash.CouponAmt = 0;
      // masBranchCash.DiscAmt = 0;
      masBranchCash.TotalAmt = masBranchCash.CashAmt - masBranchCash.CouponAmt - masBranchCash.DiscAmt;


      //this.listMasBranchCash.push(masBranchCash);
    });

    //this.listMasBranchCash.sort((a, b) => (a.PdId > b.PdId) ? 1 : ((b.PdId > a.PdId) ? -1 : 0))

    //calculate final sum
    let sumTotalAmt: number = 0;
    let sumMeterAmt: number = 0;
    let sumSaleAmt: number = 0;
    let sumCreditAmt: number = 0;
    let sumCashAmt: number = 0;
    let sumCouponAmt: number = 0;
    let sumDiscAmt: number = 0;

    this.listMasBranchCash.forEach(x => {
      sumTotalAmt += x.TotalAmt;
      sumMeterAmt += x.MeterAmt;
      sumSaleAmt += x.SaleAmt;
      sumCreditAmt += x.CreditAmt;
      sumCashAmt += x.CashAmt;
      sumCouponAmt += x.CouponAmt;
      sumDiscAmt += x.DiscAmt;
    });

    let sumCr: number = 0;
    this.listMasBranchCashCr.forEach(x => {
      sumCr += x.GlAmt;
    });

    let sumDr: number = 0;
    let sumDrSlip: number = 0;
    this.listMasBranchCashDr.forEach(x => {
      sumDr += x.GlAmt;
      if (x.GlSlip == "Y") {
        sumDrSlip += x.GlAmt;
      }
    });

    let sumPosDrSlip = this.listMasBranchDisp.reduce((sum, current) => sum + current.CardAmt, 0)

    // this.sumListDr = sumDr;
    // this.sumListDrSlip = sumDrSlip;
    // this.sumListCr = sumCr;
    this.MasBranchSumCash.CashAmt = (sumTotalAmt + sumCr) - sumDr;
    this.MasBranchSumCash.RealAmt = 0;
    this.MasBranchSumCash.DepositAmt = 0;
    this.MasBranchSumCash.DiffAmt = this.MasBranchSumCash.CashAmt - this.MasBranchSumCash.RealAmt;
    this.MasBranchSumCash.SumTotalAmt = sumTotalAmt;
    this.MasBranchSumCash.SumMeterAmt = sumMeterAmt;
    this.MasBranchSumCash.SumSaleAmt = sumSaleAmt;
    this.MasBranchSumCash.SumCreditAmt = sumCreditAmt;
    this.MasBranchSumCash.SumCashAmt = sumCashAmt;
    this.MasBranchSumCash.SumCouponAmt = sumCouponAmt;
    this.MasBranchSumCash.SumDiscAmt = sumDiscAmt;
    this.MasBranchSumCash.SumCrAmt = sumCr;
    this.MasBranchSumCash.SumDrAmt = sumDr;
    this.MasBranchSumCash.SumSlipAmt = sumDrSlip;
    this.MasBranchSumCash.SumPosSlipAmt = sumPosDrSlip;
  }

  private calculateSumTankByProductForGetDocument() {
    this.listSumMasBranchTankModelByProduct = [];
    this.listProductDisplay = [];

    let listGroupProduct = this.groupBy(this.listMasBranchTank, tank => tank.PdId);
    listGroupProduct.forEach(x => {
      let sumBeforeQty = x.reduce((sum, current) => sum + current.BeforeQty, 0);
      let sumReceiveQty = x.reduce((sum, current) => sum + current.ReceiveQty, 0);
      let sumIssueQty = x.reduce((sum, current) => sum + current.IssueQty, 0);
      let sumWithdrawQty = x.reduce((sum, current) => sum + current.WithdrawQty, 0);
      let sumTransferQty = x.reduce((sum, current) => sum + current.TransferQty, 0);
      let sumSaleQty = x.reduce((sum, current) => sum + current.SaleQty, 0);
      // let sumSaleQty = x.reduce((sum, current) => sum + current.IssueQty, 0);

      let sumBalanceQty = x.reduce((sum, current) => sum + current.RealQty, 0);
      let sumRemainQty = x.reduce((sum, current) => sum + current.RemainQty, 0);
      let sumAdjustQty = sumBalanceQty - sumRemainQty;

      let sumMasBranchTankModelByProduct = new SumMasBranchTankModelByProduct(
        this._sanitizer.bypassSecurityTrustResourceUrl(x[0].PdImage),
        x[0].PdId,
        x[0].PdName,
        sumBeforeQty,
        sumReceiveQty,
        sumIssueQty,
        sumWithdrawQty,
        sumTransferQty,
        sumSaleQty,
        sumBalanceQty,
        sumAdjustQty
      );
      this.listSumMasBranchTankModelByProduct.push(sumMasBranchTankModelByProduct);


      let productDisplay = new ProductDisplay(
        x[0].PdId,
        x[0].PdName,
        this._sanitizer.bypassSecurityTrustResourceUrl(x[0].PdImage),
        x[0].Unitprice,
      );

      this.listProductDisplay.push(productDisplay);
    });
  }

  private calculateSumTankByProduct() {
    this.listSumMasBranchTankModelByProduct = [];
    this.listProductDisplay = [];

    this.listMasBranchTank.forEach(x => {
      x.RemainQty = this.SvDefault.GetNumber(x.BeforeQty + x.ReceiveQty - x.TransferQty - x.IssueQty,2);
      x.DiffQty = this.SvDefault.GetNumber(x.RealQty - x.RemainQty,2);
      x.SaleQty = this.SvDefault.GetNumber(x.IssueQty - x.WithdrawQty,2);
    });

    let listGroupProduct = this.groupBy(this.listMasBranchTank, tank => tank.PdId);
    listGroupProduct.forEach(x => {
      let sumBeforeQty = x.reduce((sum, current) => sum + current.BeforeQty, 0);
      let sumReceiveQty = x.reduce((sum, current) => sum + current.ReceiveQty, 0);
      let sumIssueQty = x.reduce((sum, current) => sum + current.IssueQty, 0);
      let sumWithdrawQty = x.reduce((sum, current) => sum + current.WithdrawQty, 0);
      let sumTransferQty = x.reduce((sum, current) => sum + current.TransferQty, 0);
      let sumSaleQty = x.reduce((sum, current) => sum + current.SaleQty, 0);
      // let sumSaleQty = sumIssueQty;

      let sumBalanceQty = x.reduce((sum, current) => sum + current.RealQty, 0);
      let sumRemainQty = x.reduce((sum, current) => sum + current.RemainQty, 0);
      let sumAdjustQty = sumBalanceQty - sumRemainQty;

      let sumMasBranchTankModelByProduct = new SumMasBranchTankModelByProduct(
        this._sanitizer.bypassSecurityTrustResourceUrl(x[0].PdImage),
        x[0].PdId,
        x[0].PdName,
        this.SvDefault.GetNumber(sumBeforeQty,2),
        this.SvDefault.GetNumber(sumReceiveQty,2),
        this.SvDefault.GetNumber(sumIssueQty,2),
        this.SvDefault.GetNumber(sumWithdrawQty,2),
        this.SvDefault.GetNumber(sumTransferQty,2),
        this.SvDefault.GetNumber(sumSaleQty,2),
        this.SvDefault.GetNumber(sumBalanceQty,2),
        this.SvDefault.GetNumber(sumAdjustQty,2)
      );
      this.listSumMasBranchTankModelByProduct.push(sumMasBranchTankModelByProduct);


      let productDisplay = new ProductDisplay(
        x[0].PdId,
        x[0].PdName,
        this._sanitizer.bypassSecurityTrustResourceUrl(x[0].PdImage),
        x[0].Unitprice,
      );

      this.listProductDisplay.push(productDisplay);
    });
  }

  public openModalMeterDefective(indexs: any) {
    let MasBranchDisp = this.listMasBranchDisp.find((row, index) => index == indexs);
    if(MasBranchDisp == null){
      return;
    }
    // console.log({
    //   TestQty : MasBranchDisp.TestQty,
    //   Index : indexs
    // });

    this.activeMeterDefective.Index = indexs;
    this.activeMeterDefective.RepairStart = MasBranchDisp.RepairStart;
    this.activeMeterDefective.RepairFinish = MasBranchDisp.RepairFinish;
    this.activeMeterDefective.MeterStart = MasBranchDisp.MeterStart;
    this.activeMeterDefective.MeterFinish = MasBranchDisp.MeterFinish;
    this.activeMeterDefective.RepairQty = MasBranchDisp.RepairQty;
    this.activeMeterDefective.TestStart = MasBranchDisp.TestStart;
    this.activeMeterDefective.TestQty = MasBranchDisp.TestQty;
    this.activeMeterDefective.DispId = MasBranchDisp.DispId;
  };

  public onRepairChange(){
    this.activeMeterDefective.RepairQty = (this.activeMeterDefective.MeterStart - this.activeMeterDefective.RepairStart )
      + (this.activeMeterDefective.MeterFinish - this.activeMeterDefective.RepairFinish);
  }

  public saveModalMeterDefective(indexs: any) {
    let MasBranchDisp = this.listMasBranchDisp.find((row, index) => index == indexs);
    MasBranchDisp.RepairStart = this.activeMeterDefective.RepairStart;
    MasBranchDisp.RepairFinish = this.activeMeterDefective.RepairFinish;
    MasBranchDisp.MeterStart = this.activeMeterDefective.MeterStart;
    MasBranchDisp.MeterFinish = this.activeMeterDefective.MeterFinish;
    MasBranchDisp.RepairQty = this.activeMeterDefective.RepairQty;
    MasBranchDisp.TestStart = this.activeMeterDefective.TestStart;
    MasBranchDisp.TestQty = this.activeMeterDefective.TestQty;

    if(this.SvDefault.GetNumber(MasBranchDisp.RepairStart,2) == 0 &&  this.SvDefault.GetNumber(MasBranchDisp.RepairFinish,2) == 0){//ไมกรอกซ่อม ให้คำนวณจากหน้าหลัก
      MasBranchDisp.TotalQty = this.SvDefault.GetNumber(MasBranchDisp.MeterFinish -  MasBranchDisp.MeterStart,2);
    }else{
      MasBranchDisp.TotalQty = this.activeMeterDefective.RepairQty;
    }

    MasBranchDisp.TotalQty -= this.SvDefault.GetNumber(this.activeMeterDefective.TestQty,2);
    MasBranchDisp.SaleQty =  MasBranchDisp.TotalQty;
    this.calculateSumSaleQtyMeter();
    if(this.isPosData){
      // this.reCalculateCashStepForPosMeter();
      this.reCalculateCashStepForModalFix();
      this.calculateSumTankByProduct();
    }else{
      this.recalCashStep();
    }


  };

  public GetSummaryTestQty(){
    return this.listMasBranchDisp?.reduce((a,b)=> a + b.TestQty , 0) || 0;
  }

  public changeTestQtyReCalTotalQty(indexs: any) {
    let MasBranchDisp = this.listMasBranchDisp.find((row, index) => index == indexs);

    MasBranchDisp.TotalQty = MasBranchDisp.SaleQty - this.activeMeterDefective.TestQty;
    this.calculateSumSaleQtyMeter();
    this.calculateSumTankByProduct();
    this.reCalculateCashStep();
  };

  public async clearDocumentByOneStep() {
    swal.fire({
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: "ตกลง",
      denyButtonText: "ยกเลิก",
      icon: 'warning',
      showDenyButton: true,
      title: 'คุณต้องการล้างข้อมูลที่กรอกไว้ ใช่หรือไม่?',
    }).then(async (result) => {
      if (result.isConfirmed) {
        if (this.allData != "") {
          let allDataObject = JSON.parse(this.allData);
          let currentStep = this.stepper._results[this.activeTab - 1]._selectedIndex;
          switch (currentStep) {
            case 0:
              this.meterData.PeriodStart = allDataObject["Meter"].PeriodStart;
              this.meterData.PeriodFinish = allDataObject["Meter"].PeriodFinish;

              let splitArrEmp = [];
              allDataObject["Meter"].Employee.forEach(x => {
                splitArrEmp.push(x.split(':')[0].trim());
              });

              this.meterData.Employee = splitArrEmp;
              this.listMasBranchDisp = allDataObject["Meter"].Items;
              this.calculateSumSaleQtyMeter();
              this.calculateSumTankByProduct();
              this.reCalculateCashStep();
              break;
            case 1:
              this.listMasBranchTank = allDataObject["Tank"].TankItems;
              this.calculateSumSaleQtyMeter();
              this.calculateSumTankByProduct();
              this.reCalculateCashStep();
              break;
            case 2:
              this.listMasBranchCash = allDataObject["Cash"].CashItems;
              this.MasBranchSumCash = allDataObject["Cash"].SumCashItems;
              this.listMasBranchCashDr = allDataObject["Cash"].DrItems;
              this.listMasBranchCashCr = allDataObject["Cash"].CrItems;
              this.sortBranchCash();
              this.calculateSumSaleQtyMeter();
              this.calculateSumTankByProduct();
              this.reCalculateCashStep();
              break;
          }
        } else {
          this.clearAllDataInPeriod();
          this.clearSelectedEmp();
          await this.SvDefault.DoActionAsync(async () => this.getDocument(), true);
        }
      }
    })
  }

  public async submitDocument() {
    if (await this.validateSubmitData()) {
      await this.SvDefault.DoActionAsync2(async () => this.SubmitDocument(), true , 1);
    }
  }

  private async SubmitDocument() {
    let allData = new SaveDocument;
    allData.CompCode = this.sharedService.compCode;
    allData.BrnCode = this.sharedService.brnCode;
    allData.User = this.sharedService.user;
    allData.DocDate = this.SvDefault.GetFormatDate(this.date);
    allData.PeriodNo = this.activeTab;
    allData.IsPos = this.isPosData ? "Y" : "N";

    //meter
    this.meterData.Items = this.listMasBranchDisp;
    if(allData.IsPos !== 'Y'){
      for (let i = 0; i < this.meterData.Items.length; i++) {
        let mbd = this.meterData.Items[i];

        let tank = this.listMasBranchTank.find(x=> x.PdId === mbd.PdId);
        let numUnitPrice = tank?.Unitprice || mbd.UnitPrice;
        let numSaleAmt = this.SvDefault.GetNumber(mbd.SaleQty * numUnitPrice,2) ;
        mbd.SaleAmt = numSaleAmt;
      }
    }
    //find unit product price
    this.meterData.Items.forEach(x => {
      let masBranchTank = this.listMasBranchTank.find(y => y.PdId == x.PdId);
      if (typeof masBranchTank != "undefined") {
        x.UnitPrice = masBranchTank.Unitprice;
      }
    });

    allData.Meter = this.meterData;

    //tank
    this.tankData.TankItems = this.listMasBranchTank;
    this.tankData.SumTankItems = this.listSumMasBranchTankModelByProduct;
    allData.Tank = this.tankData;

    //cash
    this.cashData.CashItems = this.listMasBranchCash;
    this.cashData.SumCashItems = this.MasBranchSumCash;
    this.cashData.DrItems = this.listMasBranchCashDr;
    this.cashData.CrItems = this.listMasBranchCashCr;
    allData.Cash = this.cashData;

    // console.log(allData);
    if(this.SvDefault.IsArray(allData.Tank.SumTankItems)){
      for (let i = 0; i < allData.Tank.SumTankItems.length; i++) {
        let sti = allData.Tank.SumTankItems[i];
        if(sti.DocDate){
          continue;
        }
        sti.DocDate = this.SvDefault.GetFormatDate(this.sharedService.systemDate);
      }
    }
    let response = await this.httpClient
      .post(this.sharedService.urlDailyAks + "/api/Meter/SubmitDocument", allData)
      .toPromise();
    if (response["Status"] == 'Success') {
      await swal.fire({
        allowEscapeKey: false,
        allowOutsideClick: false,
        icon: 'success',
        title: 'บันทึกข้อมูลสำเร็จ',
      });
      this.btnSave = true;
      this.clearSelectedEmp();
      await this.getDocument();
    }else{
      throw response["Message"];
    }
  }
  private async SubmitDocumentOld() {
    let allData = new SaveDocument;
    allData.CompCode = this.sharedService.compCode;
    allData.BrnCode = this.sharedService.brnCode;
    allData.User = this.sharedService.user;
    allData.DocDate = this.SvDefault.GetFormatDate(this.date);
    allData.PeriodNo = this.activeTab;
    allData.IsPos = this.isPosData ? "Y" : "N";

    //meter
    this.meterData.Items = this.listMasBranchDisp;
    if(allData.IsPos !== 'Y'){
      for (let i = 0; i < this.meterData.Items.length; i++) {
        let mbd = this.meterData.Items[i];

        let tank = this.listMasBranchTank.find(x=> x.PdId === mbd.PdId);
        let numUnitPrice = tank?.Unitprice || mbd.UnitPrice;
        let numSaleAmt = this.SvDefault.GetNumber(mbd.SaleQty * numUnitPrice,2) ;
        mbd.SaleAmt = numSaleAmt;
      }
    }
    //find unit product price
    this.meterData.Items.forEach(x => {
      let masBranchTank = this.listMasBranchTank.find(y => y.PdId == x.PdId);
      if (typeof masBranchTank != "undefined") {
        x.UnitPrice = masBranchTank.Unitprice;
      }
    });

    allData.Meter = this.meterData;

    //tank
    this.tankData.TankItems = this.listMasBranchTank;
    this.tankData.SumTankItems = this.listSumMasBranchTankModelByProduct;
    allData.Tank = this.tankData;

    //cash
    this.cashData.CashItems = this.listMasBranchCash;
    this.cashData.SumCashItems = this.MasBranchSumCash;
    this.cashData.DrItems = this.listMasBranchCashDr;
    this.cashData.CrItems = this.listMasBranchCashCr;
    allData.Cash = this.cashData;

    // console.log(allData);
    if(this.SvDefault.IsArray(allData.Tank.SumTankItems)){
      for (let i = 0; i < allData.Tank.SumTankItems.length; i++) {
        let sti = allData.Tank.SumTankItems[i];
        if(sti.DocDate){
          continue;
        }
        sti.DocDate = this.SvDefault.GetFormatDate(this.sharedService.systemDate);
      }
    }
    this.httpClient.post(this.sharedService.urlDailyAks + "/api/Meter/SubmitDocument", allData)
      .subscribe(
        response => {
          if (response["Status"] == 'Success') {
            swal.fire({
              allowEscapeKey: false,
              allowOutsideClick: false,
              icon: 'success',
              title: 'บันทึกข้อมูลสำเร็จ',
            })
              .then(async () => {
                this.btnSave = true;
                this.clearSelectedEmp();
                await this.getDocument();
              });
          }
          else {
            swal.fire({
              allowEscapeKey: false,
              allowOutsideClick: false,
              icon: 'error',
              title: response["Message"],
            });
          }
        },
        error => {
          swal.fire({
            allowEscapeKey: false,
            allowOutsideClick: false,
            title: '<span class="text-danger">เกิดข้อผิดพลาด</span>',
            text: error.error.message
          });
        }
      );
  }
  private async validateSubmitData() {
    if(!this.validateEmptyTable()){
      return false;
    }
    ////------------------- validate period ---------------------------////
    if (this.meterData.PeriodStart == "") {
      swal.fire({
        title: "กรุณากรอกช่วงเวลาในกะเริ่มต้นก่อนบันทึกข้อมูล",
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'error'
      })
        .then(() => {
          this.periodStart._results[this.activeTab - 1].nativeElement.classList.add('requiredField');
        });
      return false;
    } else {
      this.periodStart._results[this.activeTab - 1].nativeElement.classList.remove('requiredField');
    }

    if (this.meterData.PeriodFinish == "") {
      swal.fire({
        title: "กรุณากรอกช่วงเวลาในกะสิ้นสุดก่อนบันทึกข้อมูล",
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'error'
      })
        .then(() => {
          this.periodFinish._results[this.activeTab - 1].nativeElement.classList.add('requiredField');
        });
      return false;
    } else {
      this.periodFinish._results[this.activeTab - 1].nativeElement.classList.remove('requiredField');
    }

    ////------------------- validate employee ---------------------------////

    if (this.meterData.Employee.length == 0) {
      swal.fire({
        title: "กรุณาเลือกผู้รับผิดชอบการขายก่อนบันทึกข้อมูล",
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'error'
      })
        .then(() => {
          this.employee._results[this.activeTab - 1].nativeElement.childNodes[0].classList.add('requiredField');
        });
      return false;
    } else {
      this.employee._results[this.activeTab - 1].nativeElement.childNodes[0].classList.remove('requiredField');
    }


    ////------------------- validate period finish ---------------------------////

    this.listMasBranchDisp.forEach(x => {
      if ( x.MeterFinish == 0   && x.DispStatus === "Active") { //|| x.SaleQty < 0
        x.IsRequire = true;
      } else {
        x.IsRequire = false;
      }
    });
    let checkMeter = this.listMasBranchDisp.filter(x => { return x.IsRequire });
    if (checkMeter.length > 0) {
      swal.fire({
        title: "กรุณากรอกมิดเตอร์ปิดกะให้ครบถ้วนก่อนบันทึกข้อมูล",
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'error'
      });
      return false;
    }
    console.table(this.listMasBranchDisp);
    let isTotalQtyLessZero = this.listMasBranchDisp.some( x=> x.TotalQty < 0);
    if(isTotalQtyLessZero){
      swal.fire({
        title: "กรุณาระบุปริมาณขาย ไม่น้อยกว่า 0",
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'error'
      });
      return false;
    }

    ////------------------- validate tank ---------------------------////
    this.listMasBranchTank
    //.filter(x=> x.Hold !== 'Y')
    .forEach(x => {
      if(x.TankStatus !== "Active"){
        x.IsRequire = false;
      }else if (this.listMasBranchCalibrate.length > 0) {
        if (x.Height == 0) {
          x.IsRequire = true;
        } else {
          x.IsRequire = false;
        }
      } else {
        if (x.RealQty == 0) {
          x.IsRequire = true;
        } else {
          x.IsRequire = false;
        }
      }
    });
    for (let i = 0; i < this.listMasBranchTank.length; i++) {
      const mbt = this.listMasBranchTank[i];
      if(mbt.Hold === 'Y'){
        mbt.IsRequire = false;
      }
    }
    let checkTank = this.listMasBranchTank.filter(x => { return x.IsRequire });
    if (checkTank.length > 0) {
      swal.fire({
        title: this.listMasBranchCalibrate.length > 0 ? "กรุณาระบุ หมายเหตุ จากค่าความสูงที่วัดได้เป็น 0" : "กรุณาระบุ หมายเหตุ จากที่วัดได้จริงเป็น 0",
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'error'
      });
      return false;
    }

    ////------------------- compare time ---------------------------////
    // var beginningTime = moment(this.meterData.PeriodStart, 'hh:mm');
    // let endTime = moment(this.meterData.PeriodFinish, 'hh:mm');

    // if (endTime.isBefore(beginningTime)) {
    //   swal.fire({
    //     title: "ช่วงเวลากะสิ้นสุด ต้องไม่น้อยกว่า ช่วงเวลากะเริ่มต้น",
    //     allowOutsideClick: false,
    //     allowEscapeKey: false,
    //     icon: 'error'
    //   })
    //     .then(() => {
    //       this.periodStart._results[this.activeTab - 1].nativeElement.classList.add('requiredField');
    //       this.periodFinish._results[this.activeTab - 1].nativeElement.classList.add('requiredField');
    //     });
    //   return false;
    // }
    if(this.MasBranchSumCash.CashAmt > 0 && this.MasBranchSumCash.RealAmt === 0){
      Swal.fire("กรุณาระบุยอดเงินนำส่งจริง" ,"" , "error");
      return false;
    }
    // !this.isPosData &&
    for (let i = 0; i < this.listMasBranchTank.length; i++) {
      let mbt = this.listMasBranchTank[i];
      let remainQty1 = this.SvDefault.GetNumber(mbt.RemainQty , 2);
      let remainQty2 = this.SvDefault.GetNumber(mbt.BeforeQty + mbt.ReceiveQty - mbt.TransferQty - mbt.IssueQty , 2);
      if(remainQty1 !== remainQty2){
        console.log("RemainQty != BeforeQty + ReceiveQty - TransferQty - IssueQty");
        console.log(`${mbt.RemainQty} != ${mbt.BeforeQty} + ${mbt.ReceiveQty} - ${mbt.TransferQty} - ${mbt.IssueQty}`);
        Swal.fire(`ยอดคงเหลือของถังที่ ${mbt.TankId} ไม่ถูกต้องโปรดตรวจสอบ` ,"" , "error");
        return false;
      }
      let numSaleQty = this.SvDefault.GetNumber(mbt.SaleQty , 2);
      if(numSaleQty < 0){
        Swal.fire(`ยอดขายผ่านมิเตอร์ของถังที่ ${mbt.TankId} น้อยกว่า 0 โปรดตรวจสอบ`,"","error");
        return false;
      }
    }
    for (let i = 0; i < this.listMasBranchCash.length; i++) {
      let bc = this.listMasBranchCash[i];
      if(bc.TotalAmt < 0){
        Swal.fire(`หน้ารับจ่าย สินค้า ${bc.PdId} - ${bc.PdName} ยอดเงินสุทธิน้อยกว่า 0` ,"" , "error");
        return false;
      }
      //let arrDisc = this.listMasBranchDisp.filter(x=> x.PdId === bc.PdId);
      let arrTank = this.listMasBranchTank.filter( x=> x.PdId === bc.PdId);
      let sumMeterTotalQty = 0;
      let sumTankIssueQty = 0;
      let sumTankSaleQty = 0;
      // if(this.SvDefault.IsArray(arrDisc)){
      //   sumMeterTotalQty = arrDisc.reduce((a,b)=> a+= b.TotalQty , 0);
      // }
      if(this.SvDefault.IsArray(arrTank)){
        for (let j = 0; j < arrTank.length; j++) {
          let tank = arrTank[j];
          sumTankIssueQty += tank.IssueQty;
          sumTankSaleQty += tank.SaleQty;
        }
      }
      //|| sumMeterTotalQty !== sumTankIssueQty
      // if(bc.MeterAmt !== sumTankSaleQty ){
      let numMeterAmt = this.SvDefault.GetNumber(bc.MeterAmt , 2);
      let numSumTankIssueQty = this.SvDefault.GetNumber(sumTankIssueQty , 2);
      // if(bc.MeterAmt !== sumTankIssueQty ){
      if(numMeterAmt !== numSumTankIssueQty ){
        Swal.fire(`ขายผ่านมิเตอร์ ของ ${bc.PdId} - ${bc.PdName} หน้าวัดถังไม่สัมพันธ์กับหน้ารับจ่าย` ,"" , "error");
        return false;
      }
    }
    let numSumMeterSaleAmt = this.SvDefault.GetNumber(this.SumSaleAMT() , 3);
    let numSumCashSaleAmt = this.SvDefault.GetNumber(this.MasBranchSumCash.SumSaleAmt,3);
    let numDiffSaleAmt = Math.abs(numSumCashSaleAmt - numSumMeterSaleAmt);
    if(numDiffSaleAmt >= 0.05){
      Swal.fire("ยอดรวมหน้ามิเตอร์ กับหน้ารับจ่ายไม่เท่ากัน","","error");
      return false;
    }

    if(this.MasBranchSumCash.DiffAmt !== 0){
      let swResult = await Swal.fire({title: '',
      text:`กะที่ ${this.activeTab} มียอดขาดเกิน ${this.MasBranchSumCash.DiffAmt}  บาท คุณต้องการบันทึกใช่หรือไม่?`,
      icon: 'question',
      showCancelButton: true,
      });
      if(!swResult.isConfirmed){
        return false;
      }
    }


    return true;
  }

  // private validateSubmitData(): boolean {

  //   let validateMeter = false;
  //   let validateTank = false;


  //   //--------------------------------- step meter -----------------------------------------
  //   this.listMasBranchDisp.forEach(x => {
  //     if (x.MeterFinish == 0 || x.MeterFinish < x.MeterStart) {
  //       x.IsRequire = true;
  //     } else {
  //       x.IsRequire = false;
  //     }
  //   });

  //   if (this.meterData.PeriodStart == "") {
  //     this.periodStart._results[this.activeTab - 1].nativeElement.classList.add('requiredField');
  //   } else {
  //     this.periodStart._results[this.activeTab - 1].nativeElement.classList.remove('requiredField');
  //   }

  //   if (this.meterData.PeriodFinish == "") {
  //     this.periodFinish._results[this.activeTab - 1].nativeElement.classList.add('requiredField');
  //   } else {
  //     this.periodFinish._results[this.activeTab - 1].nativeElement.classList.remove('requiredField');
  //   }

  //   if (this.meterData.Employee.length == 0) {
  //     this.employee._results[this.activeTab - 1].nativeElement.childNodes[0].classList.add('requiredField');
  //   } else {
  //     this.employee._results[this.activeTab - 1].nativeElement.childNodes[0].classList.remove('requiredField');
  //   }

  //   let checkMeter = this.listMasBranchDisp.filter(x => { return x.IsRequire });
  //   if (checkMeter.length == 0 && this.meterData.PeriodStart != "" && this.meterData.PeriodFinish != "" && this.meterData.Employee.length > 0) {
  //     validateMeter = true;
  //   }

  //   //--------------------------------- step meter -----------------------------------------

  //   //--------------------------------- step tank -----------------------------------------

  //   this.listMasBranchTank.forEach(x => {
  //     if (x.Height == 0) {
  //       x.IsRequire = true;
  //     } else {
  //       x.IsRequire = false;
  //     }
  //   });

  //   let checkTank = this.listMasBranchTank.filter(x => { return x.IsRequire });
  //   if (checkTank.length == 0) {
  //     validateTank = true;
  //   }

  //   //--------------------------------- step tank -----------------------------------------

  //   if (validateMeter == false && validateTank) {
  //     swal.fire({
  //       title: "กรุณากรอกข้อมูลให้ครบถ้วนก่อน SUBMIT",
  //       allowOutsideClick: false,
  //       allowEscapeKey: false,
  //       icon: 'error'
  //     })
  //       .then(() => {
  //         this.stepper._results[this.activeTab - 1].selectedIndex = 0;
  //         return false;
  //       });
  //   }
  //   else if (validateMeter && validateTank == false) {
  //     swal.fire({
  //       title: "กรุณากรอกข้อมูลให้ครบถ้วนก่อน SUBMIT",
  //       allowOutsideClick: false,
  //       allowEscapeKey: false,
  //       icon: 'error'
  //     })
  //       .then(() => {
  //         this.stepper._results[this.activeTab - 1].selectedIndex = 1;
  //         return false;
  //       });
  //   }
  //   else if (validateMeter == false && validateTank == false) {
  //     swal.fire({
  //       title: "กรุณากรอกข้อมูลให้ครบถ้วนก่อน SUBMIT",
  //       allowOutsideClick: false,
  //       allowEscapeKey: false,
  //       icon: 'error'
  //     })
  //       .then(() => {
  //         return false;
  //       });
  //   }
  //   else {
  //     //compare time
  //     var beginningTime = moment(this.meterData.PeriodStart, 'hh:mm');
  //     let endTime = moment(this.meterData.PeriodFinish, 'hh:mm');

  //     if (endTime.isBefore(beginningTime)) {
  //       swal.fire({
  //         title: "ช่วงเวลากะสิ้นสุด ต้องไม่น้อยกว่า ช่วงเวลากะเริ่มต้น",
  //         allowOutsideClick: false,
  //         allowEscapeKey: false,
  //         icon: 'error'
  //       })
  //         .then(() => {
  //           this.periodStart._results[this.activeTab - 1].nativeElement.classList.add('requiredField');
  //           this.periodFinish._results[this.activeTab - 1].nativeElement.classList.add('requiredField');
  //           return false;
  //         });
  //     } else {
  //       // if (this.activeTab > 1) {
  //       //   //compare beginningTime and endtime previous period
  //       //   let strEndTimePrevious = this.listAllData.find(x => { return x.PeriodNo == (this.activeTab - 1) }).Meter.PeriodFinish;
  //       //   let endTimePrevious = moment(strEndTimePrevious, 'hh:mm');
  //       //   if (beginningTime.isBefore(endTimePrevious)) {
  //       //     swal.fire({
  //       //       title: "ช่วงเวลากะเริ่มต้น ต้องไม่น้อยกว่า ช่วงเวลากะสิ้นสุดของกะก่อนหน้า",
  //       //       allowOutsideClick: false,
  //       //       allowEscapeKey: false,
  //       //       icon: 'error'
  //       //     })
  //       //       .then(() => {
  //       //         this.periodStart._results[this.activeTab - 1].nativeElement.classList.add('requiredField');
  //       //         return false;
  //       //       });
  //       //   } else {
  //       //     return true;
  //       //   }
  //       // } else {
  //       //   return true;
  //       // }

  //       return true;
  //     }
  //   }
  // }

  public async changeDate(event: any) {
    if (!moment(this.currentDate).isBefore(event.value)) {
      this.date = event.value;
      await this.SvDefault.DoActionAsync(async () => this.ChangeDate(), true);
    } else {
      swal.fire({
        title: "ไม่สามารถเลือกวันล่วงหน้าได้",
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'error'
      }).then(() => {
        this.inputDate.nativeElement.value = this.getFormatDate(this.date);
      });
    }

  }

  private getFormatDate(pDateInput: Date): string {
    if (pDateInput == null) {
      return null;
    }
    let result: string = moment(pDateInput).format('DD/MM/YYYY');
    return result;
  }

  private async ChangeDate() {
    this.clearAllDataInPeriod();
    this.activeTab = 1;
    this.clearSelectedEmp();
    await this.getDocument();
  }

  public async changePeriodStart() {
    await this.SvDefault.DoActionAsync(async () => this.ChangePeriodStart(), true);
  }

  private async ChangePeriodStart() {
    let listMeter = await this._masService.getMasBranchDISP(this.compCode, this.brnCode, this.SvDefault.GetFormatDate(this.date), this.activeTab, this.meterData.PeriodStart);
    if (listMeter["isSuccess"]) {
      listMeter["items"].forEach(x => {
        x["masBranchTankItems"].forEach(element => {
          let newMasBranchTank = new MasBranchTankModel();
          this.SvDefault.CopyObject(element, newMasBranchTank);
          let unitPrice = newMasBranchTank.Unitprice;
          //set tank
          let tank = this.listMasBranchTank.find(y => { return y.PdId == newMasBranchTank.PdId });
          tank.Unitprice = unitPrice

          //set product display
          let productDisplay = this.listProductDisplay.find(y => { return y.PdId == newMasBranchTank.PdId });
          productDisplay.Unitprice = unitPrice;

          //set cash
          let cash = this.listMasBranchCash.find(y => { return y.PdId == newMasBranchTank.PdId });
          cash.UnitPrice = unitPrice;
          cash.SaleAmt = cash.MeterAmt * cash.UnitPrice;
          cash.CashAmt = cash.SaleAmt - cash.CreditAmt;
          cash.TotalAmt = cash.CashAmt - cash.CouponAmt - cash.DiscAmt;
        });
      });
    }
    else {
      swal.fire({
        title: listMeter["message"],
        allowOutsideClick: false,
        allowEscapeKey: false,
        icon: 'error'
      }).then(() => {
        this.btnSave = true;
        this.btnComplete = true;
        this.btnClear = true;
        this.btnGetPos = true;
      });
    }
  }

  private validateEmptyTable(){
    let strMessage = "";
    if(!this.SvDefault.IsArray(this.listMasBranchDisp)){
      strMessage = "ตารางมิเตอร์ ไม่มีข้อมูล";
    }
    if(!this.SvDefault.IsArray(this.listMasBranchTank)){
      strMessage = "ตารางวัดถัง ไม่มีข้อมูล";
    }
    if(!this.SvDefault.IsArray(this.listMasBranchCash)){
      strMessage = "ตารางรับจ่าย ไม่มีข้อมูล";
    }
    if(strMessage !== ""){
      Swal.fire(strMessage , "" , "error");
      return false;
    }
    return true;
  }

  public async saveDocument() {
    await this.SvDefault.DoActionAsync(async () => this.SaveDocument(), true);
  }
  private async SaveDocument() {
    if(!this.validateEmptyTable()){
      return;
    }
    let allData = new SaveDocument;
    allData.CompCode = this.sharedService.compCode;
    allData.BrnCode = this.sharedService.brnCode;
    allData.User = this.sharedService.user;
    allData.DocDate = this.SvDefault.GetFormatDate(this.date);
    allData.PeriodNo = this.activeTab;
    allData.IsPos = this.isPosData ? "Y" : "N";

    //meter
    this.meterData.Items = this.listMasBranchDisp;
    if(allData.IsPos !== 'Y'){
      for (let i = 0; i < this.meterData.Items.length; i++) {
        let mbd = this.meterData.Items[i];
        mbd.SaleAmt = this.SvDefault.GetNumber(mbd.SaleQty * mbd.UnitPrice,2) ;
      }
    }
    //find unit product price
    this.meterData.Items.forEach(x => {
      let masBranchTank = this.listMasBranchTank.find(y => y.PdId == x.PdId);
      if (typeof masBranchTank != "undefined") {
        x.UnitPrice = masBranchTank.Unitprice;
      }
    });

    allData.Meter = this.meterData;

    //tank
    this.tankData.TankItems = this.listMasBranchTank;
    this.tankData.SumTankItems = this.listSumMasBranchTankModelByProduct;
    allData.Tank = this.tankData;

    //cash
    this.cashData.CashItems = this.listMasBranchCash;
    this.cashData.SumCashItems = this.MasBranchSumCash;
    this.cashData.DrItems = this.listMasBranchCashDr;
    this.cashData.CrItems = this.listMasBranchCashCr;
    allData.Cash = this.cashData;

    //allData.Tank.TankItems.forEach( x=> x.PdImage = "");
    if(this.SvDefault.IsArray(allData.Tank.SumTankItems)){
      for (let i = 0; i < allData.Tank.SumTankItems.length; i++) {
        let sti = allData.Tank.SumTankItems[i];
        if(sti.DocDate){
          continue;
        }
        sti.DocDate = this.SvDefault.GetFormatDate(this.sharedService.systemDate);
      }
    }
    let response = await this.httpClient.post(this.sharedService.urlDailyAks + "/api/Meter/SaveDocument", allData).toPromise();
    if (response["Status"] == 'Success') {
      swal.fire({
        allowEscapeKey: false,
        allowOutsideClick: false,
        icon: 'success',
        title: 'บันทึกร่างสำเร็จ',
      }).then(async () => {
        this.clearSelectedEmp();
        await this.getDocument();
      });
    }
    else {
      throw response["Message"];
    }

  }
  private async SaveDocumentOld() {
    if(!this.validateEmptyTable()){
      return;
    }
    let allData = new SaveDocument;
    allData.CompCode = this.sharedService.compCode;
    allData.BrnCode = this.sharedService.brnCode;
    allData.User = this.sharedService.user;
    allData.DocDate = this.SvDefault.GetFormatDate(this.date);
    allData.PeriodNo = this.activeTab;
    allData.IsPos = this.isPosData ? "Y" : "N";

    //meter
    this.meterData.Items = this.listMasBranchDisp;
    if(allData.IsPos !== 'Y'){
      for (let i = 0; i < this.meterData.Items.length; i++) {
        let mbd = this.meterData.Items[i];
        mbd.SaleAmt = this.SvDefault.GetNumber(mbd.SaleQty * mbd.UnitPrice,2) ;
      }
    }
    //find unit product price
    this.meterData.Items.forEach(x => {
      let masBranchTank = this.listMasBranchTank.find(y => y.PdId == x.PdId);
      if (typeof masBranchTank != "undefined") {
        x.UnitPrice = masBranchTank.Unitprice;
      }
    });

    allData.Meter = this.meterData;

    //tank
    this.tankData.TankItems = this.listMasBranchTank;
    this.tankData.SumTankItems = this.listSumMasBranchTankModelByProduct;
    allData.Tank = this.tankData;

    //cash
    this.cashData.CashItems = this.listMasBranchCash;
    this.cashData.SumCashItems = this.MasBranchSumCash;
    this.cashData.DrItems = this.listMasBranchCashDr;
    this.cashData.CrItems = this.listMasBranchCashCr;
    allData.Cash = this.cashData;

    //allData.Tank.TankItems.forEach( x=> x.PdImage = "");
    if(this.SvDefault.IsArray(allData.Tank.SumTankItems)){
      for (let i = 0; i < allData.Tank.SumTankItems.length; i++) {
        let sti = allData.Tank.SumTankItems[i];
        if(sti.DocDate){
          continue;
        }
        sti.DocDate = this.SvDefault.GetFormatDate(this.sharedService.systemDate);
      }
    }
    this.httpClient.post(this.sharedService.urlDailyAks + "/api/Meter/SaveDocument", allData)
      .subscribe(
        response => {
          if (response["Status"] == 'Success') {
            swal.fire({
              allowEscapeKey: false,
              allowOutsideClick: false,
              icon: 'success',
              title: 'บันทึกร่างสำเร็จ',
            }).then(async () => {
              this.clearSelectedEmp();
              await this.getDocument();
            });
          }
          else {
            swal.fire({
              allowEscapeKey: false,
              allowOutsideClick: false,
              icon: 'error',
              title: response["Message"],
            });
          }
        },
        error => {
          swal.fire({
            allowEscapeKey: false,
            allowOutsideClick: false,
            title: '<span class="text-danger">เกิดข้อผิดพลาด</span>',
            text: error.error.message
          });
        }
      );
  }

  // private async deleteDocument(tabNo: number) {
  //   swal.showLoading();
  //   let deleteDocument = new DeleteDocument(this.sharedService.compCode, this.sharedService.brnCode, this.SvDefault.GetFormatDate(this.date), tabNo);

  //   this.httpClient.post(this.sharedService.urlDailyOperation + "/api/Meter/DeleteDocument", deleteDocument)
  //     .subscribe(
  //       response => {
  //         swal.close();
  //       }
  //     );
  // }

  // public async autoSaveDocument(tabNo: number) {
  //   let checkThisPeriodIsSubmited = this.listMasBranchDisp[0].PeriodStatus;
  //   if (checkThisPeriodIsSubmited != "Active") {
  //     swal.showLoading();
  //     let allData = new SaveDocument;
  //     allData.CompCode = this.sharedService.compCode;
  //     allData.BrnCode = this.sharedService.brnCode;
  //     allData.User = this.sharedService.user;
  //     allData.DocDate = this.SvDefault.GetFormatDate(this.date);
  //     allData.PeriodNo = this.activeTab;

  //     //meter
  //     this.meterData.Items = this.listMasBranchDisp;
  //     allData.Meter = this.meterData;

  //     //tank
  //     this.tankData.TankItems = this.listMasBranchTank;
  //     this.tankData.SumTankItems = this.listSumMasBranchTankModelByProduct;
  //     allData.Tank = this.tankData;

  //     //cash
  //     this.cashData.CashItems = this.listMasBranchCash;
  //     this.cashData.SumCashItems = this.MasBranchSumCash;
  //     this.cashData.DrItems = this.listMasBranchCashDr;
  //     this.cashData.CrItems = this.listMasBranchCashCr;
  //     allData.Cash = this.cashData;

  //     //console.log(allData);

  //     this.httpClient.post(this.sharedService.urlDailyOperation + "/api/Meter/SaveDocument", allData)
  //       .subscribe(
  //         async response => {
  //           this.activeTab = tabNo;

  //           this.clearAllDataInPeriod();

  //
  //           this.clearSelectedEmp();
  //           await this.getDocument();
  //           swal.close();
  //         }
  //       );
  //   }
  //   else {
  //     swal.showLoading();
  //     this.activeTab = tabNo;
  //     this.clearAllDataInPeriod();
  //
  //     this.clearSelectedEmp();
  //     await this.getDocument();
  //     swal.close();
  //   }
  // }

  private clearAllDataInPeriod() {
    //clear all data meter step
    if (this.periodStart._results.length > 1) {
      this.periodStart._results[this.oldTab - 1].nativeElement.classList.remove('requiredField');
      this.periodFinish._results[this.oldTab - 1].nativeElement.classList.remove('requiredField');
      if (!this.isOldData) {
        this.employee._results[this.oldTab - 1].nativeElement.childNodes[0].classList.remove('requiredField');
      }
    }

    this.activeMeterDefective = new MeterDefective;
    this.meterData.SumMeterSaleQty = 0;
    this.meterData.SumMeterTotalQty = 0;
    this.employeeSelect2 = [];
    this.listMasBranchDisp = [];
    this.meterData = new Meter;


    //clear all data tank step
    this.listMasBranchTank = [];
    this.listSumMasBranchTankModelByProduct = [];
    this.tankData = new Tank;
  }

  // ChangeEmployee() {
  //   this.SvDefault.DoActionAsync(() => this.changeEmployee());
  // }

  // changeEmployee() {
  //   let listEmp = (this.myGroup?.get('employeeId')?.value || "").toString().trim();
  //   //console.log(listEmp);
  // }

  addTab(hideTab: boolean) {
    let tab = {
      tab_no: Number(this.TabEntity.length + 1),
      tab_name: "กะที่" + Number(this.TabEntity.length + 1),
    };
    this.TabEntity.push(tab);
    if (hideTab) {
      this.btnAddTab.nativeElement.classList.add('hide');
    }
    this.IntStepperIndex = 0;
    this.isPosData = false;
  };

  // async delTab(key) {
  //   if (key == this.activeTab) {
  //     swal.fire({
  //       title: "ไม่สามารถลบกะปัจจุบันได้",
  //       allowOutsideClick: false,
  //       allowEscapeKey: false,
  //       icon: 'error'
  //     });
  //   }
  //   else if (key != this.TabEntity.length) {
  //     swal.fire({
  //       title: "ไม่สามารถลบกะข้ามกันได้ กรุณาลบกะสุดท้ายก่อน",
  //       allowOutsideClick: false,
  //       allowEscapeKey: false,
  //       icon: 'error'
  //     });
  //   }
  //   else {
  //     this.TabEntity.splice(this.TabEntity.findIndex(c => c.tab_no == key), 1);
  //     await this.SvDefault.DoActionAsync(async () => this.deleteDocument(key));
  //   }
  // }

  public async changeTab(tabNo: number) {
    await this.SvDefault.DoActionAsync(async () => await this.ChangeTab(tabNo), true);
  }

  private async ChangeTab(tabNo: number) {
    if (tabNo != this.activeTab) {
      this.oldTab = this.activeTab;
      this.activeTab = tabNo;
      this.clearAllDataInPeriod();
      this.clearSelectedEmp();
      await this.getDocument();
      this.IntStepperIndex = 0;
      //this.stepper.selectedIndex = 1;
      //console.log(this.stepper);
    }
  }

  public checkSession() {
    if ((this.sharedService.compCode === null || this.sharedService.compCode === undefined || this.sharedService.compCode === "")
      && (this.sharedService.brnCode === null || this.sharedService.brnCode === undefined || this.sharedService.brnCode === "")
      && (this.sharedService.locCode === null || this.sharedService.locCode === undefined || this.sharedService.locCode === "")
      && (this.sharedService.user === null || this.sharedService.user === undefined || this.sharedService.user === "")
    ) {
      swal.fire({
        allowEscapeKey: false,
        allowOutsideClick: false,
        icon: 'error',
        title: 'กรุณาเข้าสู่ระบบอีกครั้ง',
      })
        .then(() => {
          this.routerLink.navigate(["Login"]);
        });
    }
  };

  getThaiStatus(engStatus: string) {
    switch (engStatus) {
      case "Draft":
        return "ร่าง";
      case "Active":
        return "แอคทีฟ";
    }
  }

  getBackgroundRibbon() {
    let classStatus = "ribbon-1 ribbon tooltipa statusBase"
    if (this.status == "ร่าง") {
      classStatus += " statusNew ";
    } else if (this.status == "แอคทีฟ") {
      classStatus += " statusActive ";
    } else if (this.status == "ปิดสิ้นวัน") {
      classStatus += " statusActive ";
    }
    return classStatus;
  }

  public SumMasBranchTank(pStrFieldName){
    pStrFieldName = this.SvDefault.GetString(pStrFieldName);
    if(!this.SvDefault.IsArray(this.listMasBranchTank) || pStrFieldName === "" ){
      return 0;
    }
    let result = this.listMasBranchTank.reduce((x,y)=> x + y[pStrFieldName],0);
    return result;
  }
  private _selectTankIndex = 0;
  public ShowModalHoldReason(pIntIndex : number ){
    this._selectTankIndex = pIntIndex;
    this.SvDefault.CopyObject(this.listMasBranchTank[pIntIndex]  , this.SelectTank);
  }

  public SaveHoldReason(){
    let tank = this.listMasBranchTank[this._selectTankIndex];
    this.SvDefault.CopyObject(this.SelectTank , tank);
    let strReasonDesc = this.SvDefault.GetString(this.ArrHoldReason.find(x=> x.ReasonId === this.SelectTank.HoldReasonId)?.ReasonDesc);
    tank.HoldReasonDesc = strReasonDesc ;
  }
  public CancelHoldReason(){
    let tank = this.listMasBranchTank[this._selectTankIndex];
    tank.Hold = "N";
    tank.HoldReasonDesc = "";
    tank.HoldReasonId = "";
  }

  public Recalculate(){
    if(!this.SvDefault.IsArray(this.listMasBranchCash)){
      return;
    }
    for (let i = 0; i < this.listMasBranchDisp.length; i++) {
      let mbd = this.listMasBranchDisp[i];
      let mbt= this.listMasBranchTank.find(x=> x.PdId === mbd.PdId);
      mbd.SaleAmt = mbd.TotalQty * (mbt?.Unitprice || 0);
    }
    for (let i = 0; i < this.listMasBranchCash.length; i++) {
      let masBranchCash = this.listMasBranchCash[i];
      masBranchCash.SaleAmt = this.listMasBranchDisp
        .filter(x=> x.PdId === masBranchCash.PdId)
        .reduce((a,b)=> a+= (b.SaleAmt) , 0);
      // masBranchCash.SaleAmt = masBranchCash.MeterAmt * masBranchCash.UnitPrice;
      masBranchCash.CashAmt = masBranchCash.SaleAmt - masBranchCash.CreditAmt;
      masBranchCash.TotalAmt = masBranchCash.CashAmt - masBranchCash.CouponAmt - masBranchCash.DiscAmt;
    }
    let sumTotalAmt: number = 0;
    let sumMeterAmt: number = 0;
    let sumSaleAmt: number = 0;
    let sumCreditAmt: number = 0;
    let sumCashAmt: number = 0;
    let sumCouponAmt: number = 0;
    let sumDiscAmt: number = 0;

    this.listMasBranchCash.forEach(x => {
      sumTotalAmt += x.TotalAmt;
      sumMeterAmt += x.MeterAmt;
      sumSaleAmt += x.SaleAmt;
      sumCreditAmt += x.CreditAmt;
      sumCashAmt += x.CashAmt;
      sumCouponAmt += x.CouponAmt;
      sumDiscAmt += x.DiscAmt;
    });

    this.MasBranchSumCash.SumTotalAmt = sumTotalAmt;
    this.MasBranchSumCash.SumMeterAmt = sumMeterAmt;
    this.MasBranchSumCash.SumSaleAmt = sumSaleAmt;
    this.MasBranchSumCash.SumCreditAmt = sumCreditAmt;
    this.MasBranchSumCash.SumCashAmt = sumCashAmt;
    this.MasBranchSumCash.SumCouponAmt = sumCouponAmt;
    this.MasBranchSumCash.SumDiscAmt = sumDiscAmt;

    let sumCr: number = 0;
    this.listMasBranchCashCr.forEach(x => {
      sumCr += x.GlAmt;
    });
    let sumDr: number = 0;

    this.listMasBranchCashDr.forEach(x => {
      sumDr += x.GlAmt;
    });
    let cashamt = (sumTotalAmt + sumCr- sumDr).toLocaleString("en-US", {maximumFractionDigits: 2,useGrouping: false});

    this.MasBranchSumCash.CashAmt =  parseFloat(cashamt);    //sumTotalAmt + sumCr- sumDr
    this.MasBranchSumCash.DiffAmt = this.MasBranchSumCash.RealAmt - this.MasBranchSumCash.CashAmt;
  }

  public SumSaleAMT(){
    let result = 0;
    if(this.isPosData){
      result = this.listMasBranchDisp.reduce((a,b)=> a+= b.SaleAmt , 0);
    }else{
       let funcGetSaleAmt : ( x:  MasBranchDispModel )=> number = x =>{
        let numUnitPrice = this.listMasBranchTank.find(y=> y.PdId === x.PdId)?.Unitprice || 0;
        let result = x.TotalQty * numUnitPrice;
        return result;
      };
      result = this.listMasBranchDisp.reduce( (a,b)=> a+= funcGetSaleAmt(b),0);
    }
    return result;
    // if(!(this.SvDefault.IsArray(this.listMasBranchDisp) && this.SvDefault.IsArray(this.listMasBranchTank)) ){
    //   return 0;
    // }
    // let funcGetSaleAmt : ( x:  MasBranchDispModel )=> number = x =>{
    //   let numUnitPrice = this.listMasBranchTank.find(y=> y.PdId === x.PdId)?.Unitprice || 0;
    //   let result = x.TotalQty * numUnitPrice;
    //   return result;
    // };
    // let result = this.listMasBranchDisp.reduce( (a,b)=> a+= funcGetSaleAmt(b),0);
    // return result;

    // let sumSaleAmt: number = 0;
    // this.listMasBranchDisp.forEach(x=>{
    //   sumSaleAmt += x.SaleAmt;
    // })
    // return sumSaleAmt;
  }
  public async RecalculateTank(){
    await this.SvDefault.DoActionAsync( async()=> await this.recalculateTank() , true);
  }

  private async recalculateTank(){
    if(this.activeTab > 1){
      let request = new GetDocument(this.compCode, this.brnCode, this.SvDefault.GetFormatDate(this.date), this.activeTab-1);
      let listData = await this._meterService.getDocument(request);
      let arrTank = <any[]>listData["Data"][0]["Tank"]["TankItems"];
      for (let i = 0; i < arrTank.length; i++) {
        let rawTank = arrTank[i];
        let tank = new  MasBranchTankModel();
        this.SvDefault.CopyObject(rawTank , tank);
        let mbt = this.listMasBranchTank.find(x=> x.TankId === tank.TankId);
        mbt.BeforeQty = tank.RealQty;
        mbt.RemainQty = (mbt.BeforeQty + mbt.ReceiveQty - mbt.TransferQty - mbt.IssueQty);
        mbt.DiffQty = mbt.RealQty - mbt.RemainQty;
      }
    }
    this.calculateSumTankByProduct();
    this.reCalculateCashStep();
  }

  public selectionChange(stepper) {
    //console.log(stepper);
    this.IntStepperIndex = stepper.selectedIndex;
    //this.sorDataService.synchronizeStepper(stepper.selectedIndex + 1);
  }

  public GetMeterDefectIconClass(pMasBranchDisp : MasBranchDispModel){
    let result = "text-center btn-outline-warning align-middle";
    if(pMasBranchDisp != null){
      if(pMasBranchDisp.RepairQty !== 0 || pMasBranchDisp.TestQty !==0){
        result = "text-center btn-outline-danger align-middle";
      }
    }
    return result;
  }

}
