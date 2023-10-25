import { AfterViewInit, Component, Input, OnInit } from "@angular/core";
import { DynamicStepperService } from "./services/dynamic-stepper.service";
import { DynamicStepperModel } from "./models/dynamic-stepper.model";

@Component({
  selector: "dynamic-stepper",
  styleUrls: ["./dynamic-stepper.component.scss"],
  template: `
    <div class="dynamic-stepper" #stepper>
      <div class="dynamic-stepper-step">
        <div
          class="dynamic-stepper-step-li"
          *ngFor="let item of this.DATA_STEP; let index = index"
          [class.current]="item.stepStatus === 'current'"
          [class.success]="item.stepStatus === 'success'"
        >
          <div class="stepper" (click)="gotoStep(item.stepIndex)">
            <div class="stepper-name">{{ item.stepName }}</div>
            <div class="stepper-detail">{{ item.stepDetail }}</div>
          </div>
        </div>
      </div>

      <div class="dynamic-stepper-body">
        <ng-content></ng-content>
      </div>
    </div>
  `,
})
export class DynamicStepperComponent implements AfterViewInit {
  constructor(private stepService: DynamicStepperService) {}

  @Input() id: string;

  DATA_STEP: DynamicStepperModel[] = [];

  gotoStep = (stepIndex) => {
    if (!this.stepService.isFormValid) {
      return;
    }
    this.stepService.gotoStep(stepIndex, this.id);
  };

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.DATA_STEP = this.stepService.DATA_STEP.filter((step) => {
        return step.stepID && step.stepID === this.id;
      });

      if (this.DATA_STEP.length > 0) {
        this.DATA_STEP[0].stepStatus = "current";
      }
    }, 0);
  }
}
