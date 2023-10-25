import { element } from 'protractor';
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MenuModel } from 'src/app/shared-model/demoModel';
import { SharedService } from '../../../shared/shared.service';
import { MenuData, MenuService } from '../../shared-service/menu.service';
import { MasControlData, MasControlService } from "../../shared-service/mas-control.service";
import { MasControl } from 'src/app/model/mas-control.interface';
import { ModelSysMenu } from 'src/app/model/ModelScaffold';
import { Menu } from 'src/app/model/menu.interface';
import * as moment from "moment";
import { ShareDataService } from '../../shared-service/data.service';

export class BranchMenu {
  branchId: string;
}

interface MenuDatas extends ModelSysMenu {

}

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"],
})
export class SidebarComponent implements OnInit {
  isToggleSidenav: boolean;
  // Menu: MenuModel[] = [];
  // Group: MenuModel[] = [];
  brnCode: string;
  // defaultOpenMenuName: string = "การขาย";
  // defaultActiveSubMenuName: string = "ใบแจ้งหนี้";
  Menus: ModelSysMenu[] = [];
  NavMenus: ModelSysMenu[] = [];
  MenuEntity: ModelSysMenu[] = [];

  counter(i: number) {
    return new Array(i);
  }
  constructor(
    private route: Router,
    private sharedService: SharedService,
    private menuService: MenuService,
    private masControlService: MasControlService,
    private shareDataService: ShareDataService
  ) { }

  private _defaultMenu: ModelSysMenu;
  private _strBrnCode: string = "";
  private _strCompCode: string = "";
  private _strLocCode: string = "";
  private _expired: number = ((1000 * 60) * 60);
  public sysMenus: ModelSysMenu[] = [];

  ngOnInit() {
    this._strBrnCode = (this.sharedService.brnCode || "").toString().trim();
    this._strCompCode = (this.sharedService.compCode || "").toString().trim();
    this._strLocCode = (this.sharedService.locCode || "").toString().trim();


    // const menuData: ModelSysMenu[];
    this.shareDataService.dataList$.subscribe((value) => {
      this.sysMenus = value
      this.Menus = this.sysMenus.filter(c => c.Parent == "1");
    });

    if(this._strBrnCode != ""){
        this.menuService.GetMenu(this._strCompCode, this._strBrnCode)
        .subscribe((menu: MenuData<Menu>) => {
          this.sysMenus = this.toMenuData(menu.Data["SysMenus"]);
          this.Menus = this.sysMenus.filter(c => c.Parent == "1").sort((a, b) => a.SeqNo - b.SeqNo);
          setTimeout(() => this.checkBeforeRefreshPage(), 10);

          // this._defaultMenu = this.sysMenus.find(c => c.MenuName == this.defaultActiveSubMenuName);
          // if (typeof this._defaultMenu != "undefined") {
          //   this.route.navigate([this._defaultMenu.Route]);
          // }
        });
    }


    // this.branchMenu = this.branchMenu.filter((branchMenu: BranchMenu) => branchMenu.branchId === brnCode);

    // if (this.branchMenu.length > 0) {
    //   this.Group = menuEntity.filter(c => c.level == 0);
    // }
    // else {
    //   this.Group = menuEntity.filter(c => c.level == 0 && c.group == "C" || c.group == "F");
    // }
  }

  // ngAfterContentChecked() {
  //   this.ref.detectChanges();
  // }

  checkBeforeRefreshPage() {
    var oldSelectedMenu = this.getWithExpiry("oldSelectedMenu");
    if (oldSelectedMenu != null) {
      this.menuActive(oldSelectedMenu);
    }
  }

  checkChild(parent: string): number {
    // let child = menuEntity.filter(c => c.group == group && c.level == 1).length;
    // return child;
    let child = this.sysMenus.filter(c => c.Child == parent).length;
    return child
  }

  getMenu(parent: string): ModelSysMenu[] {
    this.NavMenus = this.sysMenus.filter(c => c.Child == parent);
    return this.NavMenus;
  }

  gotoPage(link) {
    this.route.navigate([link]);
  }

  menuActive(menuName: string) {
    var menuList = this.sysMenus;
    let selectedMenu = menuList.find(x => x.MenuName == menuName);
    this.setWithExpiry("oldSelectedMenu", selectedMenu.MenuName, this._expired);
    localStorage.removeItem('menuId');
    localStorage.setItem('menuId', selectedMenu.MenuId);
    var element = document.getElementById("");
    var childElement = document.getElementById("");
    menuList.forEach(menu => {
      if (menu.Parent == "0") {
        //Clear Menu Active Level 1 Only
        element = document.getElementById(menu.MenuName);
        element.className = "nav-link";
      }

      if (menu.Parent == "1" && menu.MenuId == selectedMenu.Child) {
        element = document.getElementById(menu.MenuName);
        element.classList.add("menu-open");
      }

      if (menu.Parent == "1" && menu.MenuId != selectedMenu.Child) {
        element = document.getElementById(menu.MenuName);
        element.classList.remove("menu-open");

        childElement = document.getElementById("Child-" + menu.MenuName);
        childElement.style.display = "none";
      }
    });

    //Add Menu Active
    var menuActive = document.getElementById(menuName);
    menuActive.className += " activeMenu";

    if( this.sharedService.brnCode != ""){
        this.masControlService.GetMasControl(this.sharedService.compCode, this.sharedService.brnCode, "WDATE")
        .subscribe((masControl: MasControlData<MasControl>) => {
          this.sharedService.systemDate = moment(masControl.Data["CtrlValue"], "DD/MM/YYYY").toDate();
          // this.systemDate = this.sharedService.systemDate;
        });
    }


  }

  menuActiveFromUrl(url: string) {
    var menuList = this.MenuEntity;
    var element = document.getElementById("");
    menuList.forEach(menu => {
      if (menu.Parent == "0") {
        //Clear Menu Active Level 1 Only
        element = document.getElementById(menu.MenuName);
        element.className = "nav-link";
      }

      ////Add Menu Active
      // if (url == "/QuotationList") {
      //   var menuActive = document.getElementById("ใบเสนอราคา");
      //   menuActive.className += " activeMenu";
      // } else if (url == "/CreditSaleList") {
      //   var menuActive = document.getElementById("ขายเชื่อ");
      //   menuActive.className += " activeMenu";
      // }
    });
  }

  private toMenuData(menus: ModelSysMenu[]): MenuDatas[] {
    return menus.map(b => {
      return {
        MenuId: b.MenuId,
        MenuName: b.MenuName,
        MenuStatus: b.MenuStatus,
        Parent: b.Parent,
        Child: b.Child,
        Route: b.Route,
        CreatedDate: b.CreatedDate,
        CreatedBy: b.CreatedBy,
        UpdatedDate: b.UpdatedDate,
        UpdatedBy: b.UpdatedBy,
        SeqNo: b.SeqNo
      };
    });
  }

  private setWithExpiry = (key, value, ttl) => {
    const now = new Date();
    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    }
    sessionStorage.setItem(key, JSON.stringify(item));
  }

  private getWithExpiry = (key) => {
    const itemStr = sessionStorage.getItem(key);
    if (!itemStr) {
      return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
      sessionStorage.removeItem(key);
      return null;
    }
    return item.value;
  }

  RefreshMenu(){
    this._strBrnCode = this.sharedService.brnCode
    this.menuService.GetMenu(this._strCompCode, this._strBrnCode)
        .subscribe((menu: MenuData<Menu>) => {
          this.sysMenus = this.toMenuData(menu.Data["SysMenus"]);
          this.Menus = this.sysMenus.filter(c => c.Parent == "1");
          setTimeout(() => this.checkBeforeRefreshPage(), 10);
        });
  }
}
