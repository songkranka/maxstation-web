import { AfterViewInit, Component, Input, OnInit } from "@angular/core";
	
import { NavigatorBarService } from '../../commons/navigator-bar/navigator-bar.service';


@Component({
  selector: "dynamic-stepper",
  styleUrls: ["../dynamic-stepper/dynamic-stepper.component.scss"],
  template: `
    <div id="navigator-page" class="alert alert-success" role="alert">
        <b style="color: green;">Page : {{currentRoute}} </b>
    </div>
  `,
})
export class NavigatorBarComponent implements AfterViewInit {
  constructor(private Service: NavigatorBarService) {}

  @Input() currentRoute: string;

  ngAfterViewInit(): void {

  }
}
