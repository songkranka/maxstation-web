import { Component, OnInit } from '@angular/core';
import { async } from 'rxjs/internal/scheduler/async';
import { AuthGuard } from 'src/app/guards/auth-guard.service';
import { EmployeeAuth, SaveEmployeeAuth } from 'src/app/model/master/EmployeeAuth.interface';
import { ModelMasMapping, ModelMasOrganize, ModelMasPosition,ModelAuthBranch } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { MasterService } from 'src/app/service/master-service/master.service';
import { SharedService } from 'src/app/shared/shared.service';
import swal from 'sweetalert2';

export class EmployeeAuthModel {
  EmpCode: string;
  EmpName: string;
  AuthCode: number;
  PositionCode: string;
  UpdatedBy: string;
  UpdatedDate: string;
  Selected: boolean;
  // Mapping: number = 0;
  // Position: number = 0;
  IsPass: boolean;
}

@Component({
  selector: 'app-employee-auth',
  templateUrl: './employee-auth.component.html',
  styleUrls: ['./employee-auth.component.scss']
})
export class EmployeeAuthComponent implements OnInit {
  private authPositionRole: any;
  lines: EmployeeAuthModel[];
  public ArrMasMapping: ModelMasMapping[] = [];
  public ArrMasPosition: ModelMasPosition[] = [];
  employeeAuths: EmployeeAuth[] = [];

  constructor(
    private authGuard: AuthGuard,
    public SvDefault: DefaultService,
    private sharedService: SharedService,
    private masterService: MasterService,
  ) { }

  isUserAuthenticated = (): boolean => {
    return this.authGuard.canActivate();
  }

  async ngOnInit() {
    await this.SvDefault.DoActionAsync(async () => await this.start(), true);
  }

  private async start() {
    this.authPositionRole = this.SvDefault.GetAuthPositionRole();
    if (this.authPositionRole === undefined || this.authPositionRole.isView !== 'Y') {
      window.location.href = "/NoPermission";
      return;
    }

    this.lines = [];
    await this.getMasMapping();
    await this.getMasPosition();
  }

  private async getMasMapping() {
    let masMapping = await this.masterService.GetMasMapping("AutBranchRole");
    masMapping["Data"].forEach((element: any) => {
      this.ArrMasMapping.push(element);
    });
    this.ArrMasMapping = this.ArrMasMapping.sort((a,b)=>
      (a.MapId.length - b.MapId.length) * 10 + a.MapId.localeCompare(b.MapId)
    );
  }

  private async getMasPosition() {
    let masPosition = await this.masterService.GetAllMasPosition();
    masPosition["Data"].forEach((element: any) => {
      this.ArrMasPosition.push(element);
    });
    this.ArrMasPosition = this.ArrMasPosition.sort((a,b)=>
    (a.PositionCode.length - b.PositionCode.length) * 10 +a.PositionCode.localeCompare(b.PositionCode)
    );
  }

  async GetEmployee(element: any, index: number) {
    await this.SvDefault.DoActionAsync(async () => await this.getEmployee(element, index));
  }

  async getEmployee(element: any, index: number) {
    if (element.EmpCode != "" || element.EmpCode != null) {
      const duplicates = this.lines.filter((objs) => objs.EmpCode == element.EmpCode).length;
      if (duplicates > 1) {
        swal.fire({
          title: "รหัสพนักงานซ้ำ",
          allowOutsideClick: false,
          allowEscapeKey: false,
          icon: 'error'
        })
        return;
      }

      let employee = await this.masterService.GetEmployee(element.EmpCode);
      if (employee != undefined && employee.Data != null) {
        element.EmpName = employee.Data["EmpName"]
        element.Selected = true;
        element.IsPass = true;

        let authEmployeeRole = await this.masterService.GetAuthEmployeeRole(element.EmpCode);
        if (authEmployeeRole != undefined && authEmployeeRole.Data != null) {
          element.AuthCode = authEmployeeRole.Data["AuthCode"];
          element.PositionCode = authEmployeeRole.Data["PositionCode"];
          element.UpdatedBy = authEmployeeRole.Data["UpdatedBy"];
          element.UpdatedDate = authEmployeeRole.Data["UpdatedDate"];
          this.lines[index].AuthCode = authEmployeeRole.Data["AuthCode"];
          this.lines[index].PositionCode = authEmployeeRole.Data["PositionCode"];
        }
      }
      else {
        element.EmpName = "ไม่พบข้อมูลพนักงาน"
      }
    }
  }

  addRow() {
    let row = new EmployeeAuthModel();
    row.EmpCode = "";
    row.EmpName = "";
    row.AuthCode = 0;
    row.PositionCode = "";
    row.UpdatedBy = ""
    row.UpdatedDate = "";
    this.lines.push(row);
  }

  deleteRow = (indexs: any): void => {
    this.lines = this.lines.filter((row, index) => index !== indexs);
  }

  async saveDocument() {
    await this.SvDefault.DoActionAsync(async () => await this.SaveDocument(), true);
  }

  private async SaveDocument() {
    if (this.validateData()) {
      let saveEmployeeAuth = new SaveEmployeeAuth();
      this.employeeAuths = [];
      for (let i = 0; i < this.lines.length; i++) {
        let employeeAuth = new EmployeeAuth
        employeeAuth.EmpCode = this.lines[i].EmpCode;
        employeeAuth.EmpName = this.lines[i].EmpName;
        employeeAuth.AuthCode = Number(this.lines[i].AuthCode);
        employeeAuth.PositionCode = this.lines[i].PositionCode;
        this.employeeAuths.push(employeeAuth);
      }
      saveEmployeeAuth.User = this.sharedService.user;
      saveEmployeeAuth._EmployeeAuth = this.employeeAuths;
      let employeeAuthResponse = await this.masterService.SaveEmployeeAuth(saveEmployeeAuth);
      let statusCode = employeeAuthResponse.StatusCode;
      let message = employeeAuthResponse.Message;

      if (statusCode == "422") {
        this.SvDefault.ShowWarningDialog(message);
      }
      else {
        this.GetEmployeeUpdate();
        await this.SvDefault.ShowSaveCompleteDialogAsync();
      }
    }
  }

  async GetEmployeeUpdate() {
    await this.SvDefault.DoActionAsync(async () => await this.getEmployeeUpdate());
  }

  async getEmployeeUpdate() {
    this.lines.forEach(async (element) => {
      let authEmployeeRole = await this.masterService.GetAuthEmployeeRole(element.EmpCode);
      if (authEmployeeRole != undefined && authEmployeeRole.Data != null) {
        element.UpdatedBy = authEmployeeRole.Data["UpdatedBy"];
        element.UpdatedDate = authEmployeeRole.Data["UpdatedDate"];
      }
    });
  }


  validateData = (): boolean => {
    let pass = false;
    let msg = "";
    if (this.lines.length == 0) {
      pass = false;
      msg = "กรุณาเพิ่มรายการ";
    }
    else {
      if (this.lines.length > 0) {
        for (var i = 0; i < this.lines.length; i++) {
          if (this.lines[i].EmpCode == "") {
            pass = false;
            msg = "กรุณากรอกรหัสพนักงาน<br>";
            break;
          } else {
            pass = true;
          }
          if (this.lines[i].IsPass != true) {
            pass = false;
            msg = "รหัสพนักงานไม่ถูกต้อง<br>";
            break;
          } else {
            pass = true;
          }
          // if (this.lines[i].AuthCode.toString() == "" || this.lines[i].AuthCode == 0) {
          //   pass = false;
          //   msg = `กรุณาเลือกกลุ่มสาขาที่ใช้งานของรหัสพนักงาน ${this.lines[i].EmpCode}` + "<br>";
          //   break;
          // } else {
          //   pass = true;
          // }
          if (this.lines[i].PositionCode == "") {
            pass = false;
            msg = `กรุณาเลือกกลุ่มตำแหน่งงานของรหัสพนักงาน ${this.lines[i].EmpCode}` + "<br>";
            break;
          } else {
            pass = true;
          }
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

  clearDocument = () => {
    swal.fire({
      allowEscapeKey: false,
      allowOutsideClick: false,
      confirmButtonText: "ตกลง",
      denyButtonText: "ยกเลิก",
      icon: 'warning',
      showDenyButton: true,
      title: 'คุณต้องการล้างข้อมูลที่กรอกไว้ ใช่หรือไม่?',
    }).then((result) => {
      if (result.isConfirmed) {
        this.start();
      } else if (result.isDenied) {
      }
    })
  }
  public async ShowModalOrg(pEmployeeAuth : EmployeeAuthModel) : Promise<void>{
    this.SvDefault.DoActionAsync(async()=> await this.showModalOrg(pEmployeeAuth),true);
  }

  private async showModalOrg(pEmployeeAuth : EmployeeAuthModel) : Promise<void>{
    let strEmpCode : string = "";
    strEmpCode = this.SvDefault.GetString(pEmployeeAuth?.EmpCode);
    if(strEmpCode === ""){
      return;
    }
    let arrOrganize : ModelAuthBranch[];
    // arrOrganize = await this.masterService.GetArrOrganize(strEmpCode);
    arrOrganize = await this.masterService.GetAuthBranch(strEmpCode);
    if(!this.SvDefault.IsArray(arrOrganize)){
      return;
    }
    let arrMapOrg : {
      "รหัส": string ,
      "ชื่อ" : string
    }[];
    arrMapOrg = arrOrganize.map(x=>({
      "รหัส" : x.BrnCode,
      "ชื่อ" : x.BrnName
    }));
    this.SvDefault.ShowModalHtml(arrMapOrg , "สาขารับผิดชอบ" , "xs");
  }
}
