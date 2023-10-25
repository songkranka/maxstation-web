import { Component, OnInit } from "@angular/core";
import { SharedService } from "./../../shared.service";

@Component({
  selector: "app-loading",
  templateUrl: "./loading.component.html",
  styleUrls: ["./loading.component.scss"],
})
export class LoadingComponent implements OnInit {
  constructor(private sharedService: SharedService) {}

  get isLoading(): boolean {
    return this.sharedService.isLoading;
  }
  ngOnInit(): void {}
}
