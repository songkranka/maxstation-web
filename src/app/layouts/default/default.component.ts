import { Component, Input, OnInit,ViewChild } from "@angular/core";
import { NavigationEnd, Router } from '@angular/router';
import { SharedService } from "./../../shared/shared.service";
import { ActivatedRoute } from '@angular/router';
import { RequestListComponent } from '../../modules/Inventory/Request/request-list/request-list.component';
import swal from 'sweetalert2';

@Component({
  selector: "app-default",
  templateUrl: "./default.component.html",
  styleUrls: ["./default.component.scss"],
})
export class DefaultComponent implements OnInit {
  public IsLoadSysDateComplete : boolean = false;

  get isToggleSidenav(): boolean {
    return this.sharedService.isToggleSidenav;
  }

  // constructor(private sharedService: SharedService) {}

  name = 'Get Current Url Route Demo';
  currentRoute: string;

  constructor(private sharedService:SharedService ,private router: Router,private route: ActivatedRoute){

      this.currentRoute = router.url;

  }


  @ViewChild(RequestListComponent) child;
  @Input("RequestListComponent") a;



  ngOnInit(): void {
    //get Param
    let comp = this.route.snapshot.params.comp;
    //this.sharedService.brnCode = "006";
  }
}
