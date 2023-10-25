
import { Injectable } from '@angular/core';
import { CanActivate, Router} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import Swal from 'sweetalert2';
import { DefaultService } from '../service/default.service';
import { SharedService } from '../shared/shared.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private jwtHelper: JwtHelperService,
    public defaultService: DefaultService,
    public sharedService: SharedService,) { }


    private sleep(milliseconds) {
      const date = Date.now();
      let currentDate = null;
      do {
        currentDate = Date.now();
      } while (currentDate - date < milliseconds);
    }
  canActivate() {
    const token = localStorage.getItem("jwt");
    const branches = localStorage.getItem("branches");
    if (token && branches && !this.jwtHelper.isTokenExpired(token)){
      return true;
    }
    localStorage.setItem("LoginMessage" , "ระบบไม่ได้ใช้งานเกินกำหนด(Session Expired)<br/>กรุณา Login เข้าระบบอีกครั้ง");
    window.location.href="/Login";
    //.finally(()=>window.location.href="/Login");
    //Swal.fire("session หมดอายุ  กรุณา login").then(x=> window.location.href="/Login");
    //this.router.navigate(["Login"]);
    return true;

    // let brnCode = this.getWithExpiry("brnCode");
    // let compCode = this.getWithExpiry("compCode");
    // let locCode = this.getWithExpiry("locCode");
    // let user = this.getWithExpiry("user");
    // let isInvalidSession: boolean = false;

    // isInvalidSession = isInvalidSession || (compCode || "") === "";
    // isInvalidSession = isInvalidSession || (brnCode || "") === "";
    // isInvalidSession = isInvalidSession || (locCode || "") === "";
    // isInvalidSession = isInvalidSession || (user || "") === "";

    // if(!isInvalidSession)
    // {
    //   return true;
    // }

    // this.router.navigate(["Login"]);
    // return false;
  }

  getWithExpiry = (key: string) => {
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
}
