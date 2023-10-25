import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { SaveUnlock, Unlock } from 'src/app/model/master/unlock.interface';
import { ModelSysMenu, ModelSysPositionRole } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { MasterService } from 'src/app/service/master-service/master.service';
import { valueSelectbox } from 'src/app/shared-model/demoModel';
import { ShareDataService } from 'src/app/shared/shared-service/data.service';
import { SharedService } from 'src/app/shared/shared.service';
import swal from 'sweetalert2';

export class EmployeeBranchConfig {
  PositionCode: string;
  ItemNo: number;
  ConfigId: string;
  IsView: string;
  ConfigName: string;
  IsLockDate: string;
  Remark: string;
  IsLock: string;
  StartDate: Date;
  EndDate: Date;
}

export class SysBrnchConfig {
  BrnCode: string;
  BrnName: string;
  DocDate: Date;
  LockDate: Date;
  LockNo: number;
  EmpName: string;
}

@Component({
  selector: 'app-unlock-status',
  templateUrl: './unlock-status.component.html',
  styleUrls: ['./unlock-status.component.scss']
})
export class UnlockStatusComponent implements OnInit {
  public PositionRole = new ModelSysPositionRole();
  myGroup: FormGroup;
  branchSelect: valueSelectbox[];
  isFindValue: boolean = false;
  employeeBranchConfigs: EmployeeBranchConfig[];
  sysBranchConfig: SysBrnchConfig;
  // startDate = new FormControl();
  // endDate = new FormControl();
  // startDate = new FormControl(new Date(this.sharedService.systemDate.getFullYear(), this.sharedService.systemDate.getMonth(), this.sharedService.systemDate.getDate()));
  // endDate = new FormControl(new Date(this.sharedService.systemDate.getFullYear(), this.sharedService.systemDate.getMonth(), this.sharedService.systemDate.getDate()));
  btnSave = false;
  unlocks: Unlock[] = [];

  unlockStatus = [{
    value: 'Y', viewValue: 'Lock'
  },
  {
    value: 'N', viewValue: 'Unlock'
  }];

  authPositionRole: any;

  constructor(
    public defaultService: DefaultService,
    private sharedService: SharedService,
    public masterService: MasterService,
    private httpClient: HttpClient,
    private authGuard: AuthGuard,
    private shareDataService: ShareDataService,
  ) {
    this.myGroup = new FormGroup({
      branchOption: new FormControl(),
    });
  }

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  async ngOnInit() {
    await this.defaultService.DoActionAsync(async () => await this.start(), true);
  }

  private async start() {
    // if (!await this.defaultService.CheckSessionAsync()) {
    //   return;
    // }

    // this.PositionRole = await this.defaultService.GetPositionRole(this.sharedService.user, "Unlock");

    // if (this.PositionRole != null && this.PositionRole.IsView !== 'Y') {
    //   window.location.href = "/NoPermission";
    //   return;
    // }

    this.authPositionRole = this.defaultService.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }

    this.branchSelect = [];
    this.employeeBranchConfigs = [];
    this.initBranchOption();
  }

  private initBranchOption() {
    var data =
    {
      "CompCode": this.sharedService.compCode,
      "BrnCode": this.sharedService.brnCode,
      "EmpCode": this.sharedService.user
    }
    this.httpClient.post(this.sharedService.urlMas + '/api/Dropdown/GetBranchEmployeeAuth', data)
      .subscribe(
        response => {
          this.branchSelect = [];
          for (let i = 0; i < response["Data"].length; i++) {
            this.branchSelect.push({
              VALUE: response["Data"][i].BrnCode.trim() + " : " + response["Data"][i].BrnName.trim(),
              KEY: response["Data"][i].BrnCode.trim(),
            });
          }
        },
        error => {
          console.log(data);
          console.log("Error", error);
        }
      );
  }

  public async findByValue() {
    if (!this.validateBranchSelect()) {
      return;
    }

    this.isFindValue = true;
    this.employeeBranchConfigs = [];
    let docDate = new Date(this.sharedService.systemDate.getFullYear(), this.sharedService.systemDate.getMonth(), this.sharedService.systemDate.getDate());
    let branchSelect = this.myGroup.get('branchOption').value;

    let empConfigs = (await this.masterService.GetEmpBranchConfig(this.sharedService.compCode, branchSelect, <any>this.defaultService.GetFormatDate(docDate), this.sharedService.user));

    for (let i = 0; i < empConfigs.Data.length; i++) {
      let obj = new EmployeeBranchConfig();
      obj.PositionCode = empConfigs.Data[i].PositionCode;
      obj.ItemNo = empConfigs.Data[i].ItemNo;
      obj.ConfigId = empConfigs.Data[i].ConfigId;
      obj.IsView = empConfigs.Data[i].IsView;
      obj.ConfigName = empConfigs.Data[i].ConfigName;
      obj.IsLockDate = empConfigs.Data[i].IsLockDate;
      obj.IsLock = empConfigs.Data[i].IsLock;
      obj.Remark = empConfigs.Data[i].Remark;
      obj.StartDate = empConfigs.Data[i].StartDate;
      obj.EndDate = empConfigs.Data[i].EndDate;
      this.employeeBranchConfigs.push(obj);
    }

    let lastUnlock = (await this.masterService.GetSysBranchConfig(this.sharedService.compCode, branchSelect, <any>this.defaultService.GetFormatDate(docDate))).Data;
    let sysUnlock = new SysBrnchConfig();
    sysUnlock.BrnCode = lastUnlock["BrnCode"];
    sysUnlock.BrnName = lastUnlock["BrnName"];
    sysUnlock.DocDate = lastUnlock["DocDate"];
    sysUnlock.LockDate = lastUnlock["LockDate"];
    sysUnlock.EmpName = lastUnlock["EmpName"];
    sysUnlock.LockNo = lastUnlock["SeqNo"];
    this.sysBranchConfig = sysUnlock;
  }

  async saveUnlock() {
    await this.defaultService.DoActionAsync(async () => await this.SaveUnlock(), true);
  }

  private async SaveUnlock() {
    if (!this.defaultService.ValidateAuthPositionRole(this.authPositionRole, "isCreate")) {
      this.defaultService.ShowPositionRoleMessage("IsCreate");
      return;
    }

    swal.fire({
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: "ตกลง",
      denyButtonText: "ยกเลิก",
      icon: 'warning',
      showDenyButton: true,
      title: 'คุณต้องการบันทึกข้อมูลปลดล็อค ใช่หรือไม่?',
    }).then(async (result) => {
      if (result.isConfirmed) {
        let saveUnlock = new SaveUnlock();

        for (let i = 0; i < this.employeeBranchConfigs.length; i++) {
          let startDatePicker = new Date(this.employeeBranchConfigs[i].StartDate);
          let endDatePicker = new Date(this.employeeBranchConfigs[i].EndDate);
          let unlock = new Unlock
          unlock.ItemNo = this.employeeBranchConfigs[i].ItemNo;
          unlock.ConfigId = this.employeeBranchConfigs[i].ConfigId;
          unlock.IsLock = this.employeeBranchConfigs[i].IsLock;
          unlock.StartDate = <any>this.defaultService.GetFormatDate(startDatePicker);
          unlock.EndDate = <any>this.defaultService.GetFormatDate(endDatePicker);
          unlock.Remark = this.employeeBranchConfigs[i].Remark;
          this.unlocks.push(unlock);
        }

        let docDate = new Date(this.sharedService.systemDate.getFullYear(), this.sharedService.systemDate.getMonth(), this.sharedService.systemDate.getDate());
        saveUnlock.CompCode = this.sharedService.compCode;
        saveUnlock.BrnCode = this.myGroup.get('branchOption').value;
        saveUnlock.DocDate = <any>this.defaultService.GetFormatDate(docDate);
        saveUnlock.EmpCode = this.sharedService.user;
        saveUnlock.CreatedBy = this.sharedService.user;
        saveUnlock._Unlock = this.unlocks;
        this.unlocks = [];
        let unlockResponse = await this.masterService.SaveUnlock(saveUnlock);
        let statusCode = unlockResponse.StatusCode;
        let message = unlockResponse.Message;
        // let unlockResponseData = unlockResponse.Data;

        if (statusCode == "422") {
          this.defaultService.ShowWarningDialog(message);
        }
        else {
          let docDate = new Date(this.sharedService.systemDate.getFullYear(), this.sharedService.systemDate.getMonth(), this.sharedService.systemDate.getDate());
          let branchSelect = this.myGroup.get('branchOption').value;
          let lastUnlock = (await this.masterService.GetSysBranchConfig(this.sharedService.compCode, branchSelect, <any>this.defaultService.GetFormatDate(docDate))).Data;
          let sysUnlock = new SysBrnchConfig();
          sysUnlock.BrnCode = lastUnlock["BrnCode"];
          sysUnlock.BrnName = lastUnlock["BrnName"];
          sysUnlock.DocDate = lastUnlock["DocDate"];
          sysUnlock.LockDate = lastUnlock["LockDate"];
          sysUnlock.EmpName = lastUnlock["EmpName"];
          sysUnlock.LockNo = lastUnlock["SeqNo"];
          this.sysBranchConfig = sysUnlock;
          // this.startDate = new FormControl(sysUnlock.DocDate);
          // this.endDate = new FormControl(sysUnlock.DocDate);
          await this.defaultService.ShowSaveCompleteDialogAsync();
        }
      }
    })
  }

  private validateBranchSelect(): boolean {
    let funShowError: (strMessage: string) => void = null;
    funShowError = strMessage => {
      swal.fire(strMessage, "", "error");
    };

    let branch: string;
    branch = this.myGroup.get('branchOption').value;

    if (branch === "" || branch == null || branch == undefined) {
      funShowError("กรุณาเลือกสาขา");
      return false;
    }

    return true;
  }

  private validateData(): boolean {
    let pass = false;
    let msg = "";

    if (this.employeeBranchConfigs.length > 0) {
      for (var i = 0; i < this.employeeBranchConfigs.length; i++) {
        if (this.employeeBranchConfigs[i].IsLock === null || this.employeeBranchConfigs[i].IsLock === undefined) {
          pass = false;
          msg = "กรุณาเลือกสถานะ <br>" + this.employeeBranchConfigs[i].ConfigName;
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
        .then(() => {
        });
    }
    return pass;
  }

}
