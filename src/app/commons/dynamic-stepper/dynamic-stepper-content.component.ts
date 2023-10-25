import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from "@angular/core";
import {
  DynamicStepperModel,
  DynamicStepperResultModel,
} from "./models/dynamic-stepper.model";
import { DynamicStepperService } from "./services/dynamic-stepper.service";

@Component({
  selector: "dynamic-stepper-content",
  styleUrls: ["./dynamic-stepper.component.scss"],
  template: `
    <div
      class="dynamic-stepper-content"
      select="[stepper-content]"
      [ngClass]="{
        open: THAT_STEP.stepStatus === 'current'
      }"
      [attr.stepIndex]="stepIndex"
      [attr.stepName]="stepName"
    >
      <div class="dynamic-stepper-content-header">{{ stepName }}</div>
      <div class="dynamic-stepper-content-body">
        <ng-content></ng-content>
      </div>
      <div class="dynamic-stepper-content-footer">
        <button
          class="btn-step-back waves-effect"
          (click)="backStep($event.target)"
        >
          {{
            buttonBackText && buttonBackText.length > 0
              ? buttonBackText
              : "Back"
          }}
        </button>
        <button
          class="btn-step-next waves-effect"
          (click)="nextStep($event.target)"
        >
          {{
            buttonNextText && buttonNextText.length > 0
              ? buttonNextText
              : "Next"
          }}
        </button>
        <button
          class="btn-step-submit waves-effect"
          *ngIf="buttonSubmit && buttonSubmit === 'true'"
          (click)="onSubmitClicked($event)"
        >
          {{
            buttonSubmitText && buttonSubmitText.length > 0
              ? buttonSubmitText
              : "Submit"
          }}
        </button>
      </div>
    </div>
  `,
})
export class DynamicStepperContentComponent implements AfterViewInit {
  @Input() stepIndex: number;
  @Input() stepName: string;
  @Input() stepDetail: string;

  @Input() buttonNextText: string;
  @Input() buttonBackText: string;

  @Input() buttonSubmit: string;
  @Input() buttonSubmitText: string;

  @Input() stepID: string;

  @Output() onSubmit: EventEmitter<any> = new EventEmitter();
  @Output() onNext: EventEmitter<any> = new EventEmitter();
  @Output() onValid: EventEmitter<any> = new EventEmitter();

  DATA_STEP: DynamicStepperModel[] = [];
  THAT_STEP: DynamicStepperModel = {
    stepIndex: 0,
    stepName: "",
    stepDetail: "",
    stepStatus: "",
    stepID: "",
  };

  constructor(private stepService: DynamicStepperService) {}

  gotoStepper(el: HTMLElement) {
    const top = el.closest("dynamic-stepper").getBoundingClientRect().top - 75;
    window.scrollTo({ top: top, behavior: "smooth" });
  }

  onSubmitClicked(params: any): void {
    this.onSubmit.emit([params]);
  }

  nextStep = (el): any => {
    this.onNext.emit();
    this.onValid.emit();
    if (!this.stepService.isFormValid) {
      return;
    }

    this.gotoStepper(el);
    this.stepService.nextStep(this.stepID);
  };

  backStep = (el): void => {
    this.gotoStepper(el);
    this.stepService.backStep(this.stepID);
  };

  ngAfterViewInit(): void {
    let step: DynamicStepperModel = {
      stepIndex: this.stepIndex,
      stepName: this.stepName,
      stepDetail: this.stepDetail,
      stepStatus: "",
      stepID: this.stepID,
    };

    //this.stepService.DATA_STEP=[];
    this.stepService.initializeStepper(step);

    setTimeout(() => {
      this.DATA_STEP = this.stepService.DATA_STEP.filter((step) => {
        return step.stepID && step.stepID === this.stepID;
      });

      this.THAT_STEP = this.DATA_STEP.filter(
        (step) => step.stepIndex === this.stepIndex
      )[0];
    }, 0);
  }
}
