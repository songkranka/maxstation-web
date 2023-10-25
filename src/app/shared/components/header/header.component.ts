import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup } from '@angular/forms';
import { SharedService } from "./../../shared.service";
import { valueSelectbox } from "../../../shared-model/demoModel"
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import * as moment from "moment";
import { MasControlData, MasControlService } from "../../shared-service/mas-control.service";
import { MasControl } from 'src/app/model/mas-control.interface';
import { DefaultService } from "src/app/service/default.service";
import { ModelMasBranch, ModelSysNotification } from "src/app/model/ModelScaffold";
import { CommonService } from "src/app/service/common-service/common-service.service";
import { ModelGetNotiParam } from "src/app/model/ModelCommon";
import Swal from "sweetalert2";
import { DomSanitizer } from "@angular/platform-browser";
import { BranchMasterService } from 'src/app/service/branch-service/branch-master-service';
import { ShareDataService } from "../../shared-service/data.service";
import { MenuService } from "../../shared-service/menu.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})

export class HeaderComponent implements OnInit {
  isToggleSidenav = false;
  language = "";
  branchSelect2: valueSelectbox[];
  COMPANY: valueSelectbox[];
  myGroup: FormGroup;
  user: string;
  urlInv = this.sharedService.urlInv;
  urlMas = this.sharedService.urlMas;
  @Output() OnLoadeSysDateComplete = new EventEmitter<boolean>();
  @Output() OnBranchChange = new EventEmitter();
  public ArrNoti: ModelSysNotification[] = [];

  branchList = [];

  constructor(
    private router: Router,
    public sharedService: SharedService,
    private masControlService: MasControlService,
    private branchMasterService: BranchMasterService,
    private route: ActivatedRoute,
    private httpClient: HttpClient,
    public SvDefault: DefaultService,
    private _svCommon: CommonService,
    public Sanitizer: DomSanitizer,
    private shareDataService: ShareDataService,
    private menuService: MenuService,
  ) {
    this.branchSelect2 = [];
  }


  changeLanguage(value: string) {
    this.language = value;
  }

  getBranch = (step_id: string = ""): void => {
    // this.shareDataService.dataList$.subscribe((value) => {
    //   this.branchList = value;
    // });
    this.branchList = JSON.parse(localStorage.getItem('branches'));

    this.branchSelect2 = [];
    for (let i = 0; i < this.branchList.length; i++) {
      this.branchSelect2.push({
        KEY: this.branchList[i].brnCode.trim() + " : " + this.branchList[i].brnName.trim(),
        VALUE: this.branchList[i].brnCode.trim()
      });
    }

    // var data =
    // {
    //   "Username": this.sharedService.user,
    //   "CompCode": this.sharedService.compCode
    // }
    // this.httpClient.post(this.urlMas + "/api/Branch/GetAuthBranchList", data)
    //   .subscribe(
    //     response => {
    //       this.branchSelect2 = [];
    //       for (let i = 0; i < response["Data"].length; i++) {
    //         this.branchSelect2.push({
    //           KEY: response["Data"][i].BrnCode.trim() + " : " + response["Data"][i].BrnName.trim(),
    //           VALUE: response["Data"][i].BrnCode.trim()
    //         });
    //       }
    //     },
    //     error => {
    //       console.log("Error", error);
    //     }
    //   );
  }

  goto = (url) => {
    navigator = url;
    window.location.href = url;
  };
  async ngOnInit() {
    this.myGroup = new FormGroup({
      branch: new FormControl()
    });
    await this.SvDefault.DoActionAsync(async () => await this.start());
  }
  private async start() {
    const expired = ((1000 * 60) * 60);
    if (this.route.snapshot.queryParams.brnCode == undefined
      || this.route.snapshot.queryParams.comp == undefined
      || this.route.snapshot.queryParams.location == undefined
      || this.route.snapshot.queryParams.user == undefined
      || this.route.snapshot.queryParams.systemDate == undefined
    ) {
      this.sharedService.brnCode = this.getWithExpiry("brnCode");
      this.sharedService.compCode = this.getWithExpiry("compCode");
      this.sharedService.locCode = this.getWithExpiry("locCode");
      this.sharedService.user = this.getWithExpiry("user");
    } else {
      // let brnCode: string = this.route.snapshot.queryParams.brnCode.replace("52", "")
      // let compCode: string = this.route.snapshot.queryParams.comp
      // this.setWithExpiry("brnCode", brnCode.toUpperCase(), expired);
      // this.setWithExpiry("compCode", compCode.toUpperCase(), expired);
      // this.setWithExpiry("locCode", this.route.snapshot.queryParams.location, expired);
      // this.setWithExpiry("user", this.route.snapshot.queryParams.user, expired);
      // this.setWithExpiry("systemDate", this.route.snapshot.queryParams.systemDate, expired);

      // this.sharedService.brnCode = this.getWithExpiry("brnCode");
      // this.sharedService.compCode = this.getWithExpiry("compCode");
      // this.sharedService.locCode = this.getWithExpiry("locCode");
      // this.sharedService.user = this.getWithExpiry("user");
      window.location.href = "/Login";
    }

    if (!await this.SvDefault.CheckSessionAsync()) {
      return;
    }

    let sysTemDate = await this.getControlDate(this.sharedService.compCode, this.sharedService.brnCode);
    this.sharedService.systemDate = sysTemDate
    this.setWithExpiry("systemDate", this.SvDefault.GetFormatDate(sysTemDate), expired);
    this.OnLoadeSysDateComplete.emit(true);
    this.language = "TH"
    this.branchSelect2;
    this.getBranch();
    this.myGroup.controls['branch'].setValue(this.sharedService.brnCode);
    this.user = this.sharedService.user;
    await this.loadNoti();
  }

  private async loadNoti() {
    let paramGetNoti = <ModelGetNotiParam>{
      BrnCode: this.sharedService.brnCode,
      CompCode: this.sharedService.compCode
    };
    this.ArrNoti = await this._svCommon.GetNoti(paramGetNoti);
  }

  public async CloseNoti(param: ModelSysNotification) {
    await this.SvDefault.DoActionAsync(async () => await this.closeNoti(param), false);
  }
  private async closeNoti(param: ModelSysNotification) {
    if (param == null) {
      return null;
    }
    param.IsRead = "Y";
    param.UpdatedBy = this.sharedService.user;
    Swal.fire("", param.Remark, "info");
    await this._svCommon.UpdateNoti(param);
    await this.loadNoti();
  }


  private async getControlDate(pStrCompCode: string, pStrBrnCode: string): Promise<Date> {
    pStrCompCode = this.SvDefault.GetString(pStrCompCode);
    pStrBrnCode = this.SvDefault.GetString(pStrBrnCode);
    let masControlData: MasControlData<MasControl> = null;
    if (pStrBrnCode != "") {
      masControlData = await this.masControlService.GetMasControl(pStrCompCode, pStrBrnCode, "WDATE").toPromise();
    }


    let strCtrlValue: string = "";
    strCtrlValue = (<MasControl><unknown>masControlData?.Data)?.CtrlValue || "";
    if (strCtrlValue === "") {
      return null;
    }
    let result: Date = null;
    result = moment(strCtrlValue, "DD/MM/YYYY").toDate();
    return result;
  }

  async changeBranch() {
    await this.SvDefault.DoActionAsync(async () => await this.ChangeBranch(), true);
  }

  private async ChangeBranch() {
    const expired = ((1000 * 60) * 60);
    let branchCode = this.myGroup.get('branch').value;
    let compCode = this.sharedService.compCode
    // let masBranch = await this.branchMasterService.GetBranchByCompCodeAndBrnCode(compCode, branchCode);
    let masBranch = await this.branchMasterService.GetBranchName(compCode, branchCode);
    let sysTemDate = await this.getControlDate(compCode, branchCode);
    this.setWithExpiry("brnCode", branchCode, expired);
    this.setWithExpiry("locCode", masBranch['Data'].LocCode, expired);
    this.setWithExpiry("systemDate", this.SvDefault.GetFormatDate(sysTemDate), expired);
    this.sharedService.brnCode = this.getWithExpiry("brnCode");
    this.sharedService.locCode = this.getWithExpiry("locCode");
    this.sharedService.systemDate = new Date(this.getWithExpiry("systemDate"));
    this.router.navigate(["/dashboard"]);
    this.OnBranchChange.emit();
  }

  togleSidenav = () => {
    this.sharedService.isToggleSidenav = !this.sharedService.isToggleSidenav;
  };

  setWithExpiry = (key, value, ttl) => {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    }
    localStorage.setItem(key, JSON.stringify(item));
  }

  getWithExpiry = (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  }

  logOut = () => {
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(["/Login"]);
  }
}

