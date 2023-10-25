import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthenticatedResponse } from 'src/app/model/master/AuthenticatedResponse';
import { Branch } from 'src/app/model/master/branch.interface';
import { LoginModel } from 'src/app/model/master/login.interface';
import { Menu } from 'src/app/model/menu.interface';
import { ModelMasCompany, ModelSysMenu, ModelSysMessage } from 'src/app/model/ModelScaffold';
import { DefaultService } from 'src/app/service/default.service';
import { MasterService } from 'src/app/service/master-service/master.service';
import { MessageService } from 'src/app/service/Message.service';
import { ShareDataService } from 'src/app/shared/shared-service/data.service';
import { MenuData, MenuService } from 'src/app/shared/shared-service/menu.service';
import { SharedService } from 'src/app/shared/shared.service';
import Swal from 'sweetalert2';
import { DialogBoxLoginBranchComponent } from './dialog-box-branch/dialog-box-branch.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, AfterViewInit {
  invalidLogin: boolean;
  selectCompany: ModelMasCompany;
  credentials: LoginModel = { Username: '', Password: '', CompCode: '', IpAddress: '' };
  companys: ModelMasCompany[] = [];
  authBranchRole: Branch[] = [];
  companySelected = null;
  loginForm: FormGroup;
  findIP: any;
  IsLoading = false;
  InvalidMessage: string;
  private _arrMessage : ModelSysMessage[] = [];
  constructor(
    private router: Router,
    private http: HttpClient,
    private sharedService: SharedService,
    private masterService: MasterService,
    private defaultService: DefaultService,
    private shareDataService: ShareDataService,
    private menuService: MenuService,
    public dialog: MatDialog,
    private renderer: Renderer2,
    private _svMessage : MessageService,
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      company: new FormControl(),
    });
  }

  async ngOnInit() {    
    await this.defaultService.DoActionAsync(async () => await this.start(), true);  
  }

  ngAfterViewInit() {
    this.renderer.selectRootElement('#username').focus();
  }

  private async start() {
    this.companys = (await this.masterService.GetAllMasCompany()).Data;
    this.loginForm.controls['company'].setValue(this.companys[0].CompCode, { onlySelf: true });

    // fetch('https://jsonip.com', { mode: 'cors' })
    // .then((resp) => resp.json())
    // .then((ip) => {
    //   this.credentials.IpAddress = ip['ip']
    // });
    let strLoginMessage = localStorage.getItem("LoginMessage");
    strLoginMessage = this.defaultService.GetString(strLoginMessage);
    if(strLoginMessage !== ""){
      localStorage.setItem("LoginMessage" , "");
      Swal.fire(strLoginMessage);
    }
    this._arrMessage = await this._svMessage.GetArrSysMessage();

  }

  login() {
    if (this.loginForm.valid) {
      this.IsLoading = true;
      let branCode: string;
      let compCode = this.loginForm.get('company').value
      this.credentials.CompCode = this.loginForm.controls['company'].value;
      this.credentials.Username = this.loginForm.controls['username'].value.toString().trim();
      let strUrl = (this.sharedService.urlCommon || "").toString().trim() + "/api/Auth/Login";
      this.http.post<AuthenticatedResponse>(strUrl, this.credentials, {
        headers: new HttpHeaders({ "Content-Type": "application/json" })
      })
        .subscribe({
          next: (response: AuthenticatedResponse) => {
            const token = response.token;
            const branches = response.branches;
            const positionroles = response.positionRoles;
            const user = this.loginForm.get('username').value;
            // const compCode = this.loginForm.get('company').value
            // const branCode: any = branches[0].brnCode.replace("52", "");
            //branCode = branches[0].brnCode.replace("52", "");
            branCode = this.defaultService.GetString( branches[0].brnCode);
            const locCode: any = branches[0].locCode;
            const expired = ((1000 * 60) * 60);
            this.invalidLogin = false;
            localStorage.clear();

            this.setWithExpiry("brnCode", branCode, expired);
            this.setWithExpiry("compCode", compCode, expired);
            this.setWithExpiry("locCode", locCode, expired);
            this.setWithExpiry("user", user, expired);
            // this.setWithExpiry("jwt", token, expired);
            localStorage.setItem('jwt', token);
            localStorage.setItem('branches', JSON.stringify(branches));
            localStorage.setItem('positionroles', JSON.stringify(positionroles));
            this._svMessage.SaveToLocalStorage(this._arrMessage);
            window.location.href = "/dashboard";
          },
          error: (err: HttpErrorResponse) => {
            this.InvalidMessage = err.error;
            this.invalidLogin = true;
            this.IsLoading = false;
          }
        })
    }
  }



  openBranchDialog() {
    var user = this.loginForm.get('username').value;
    var compCode = this.loginForm.get('company').value

    const dialogRef = this.dialog.open(DialogBoxLoginBranchComponent, {
      width: '600px',
      data: {
        compCode: compCode
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != undefined) {
        let branCode = result['BrnCode'].replace("52", "");
        let locCode = result['LocCode'];

        const expired = ((1000 * 60) * 60);
        this.setWithExpiry("brnCode", branCode, expired);
        this.setWithExpiry("compCode", compCode, expired);
        this.setWithExpiry("locCode", locCode, expired);
        this.setWithExpiry("user", user, expired);
        // this.router.navigate(["/dashboard"]);
        window.location.href = "/dashboard";
      }
    });
  }

  setWithExpiry = (key: string, value: any, timeLimit: number) => {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + timeLimit,
    }
    localStorage.setItem(key, JSON.stringify(item));
  }
}
