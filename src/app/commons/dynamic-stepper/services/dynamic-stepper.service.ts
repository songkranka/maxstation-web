import { AfterViewInit, Injectable, OnInit } from "@angular/core";
import { DynamicStepperModel } from "../models/dynamic-stepper.model";

@Injectable()
export class DynamicStepperService {
  public DATA_STEP: DynamicStepperModel[] = [];
  public isFormValid: boolean = true;

  constructor() {}

  public initializeStepper = (step: DynamicStepperModel): void => {
    this.DATA_STEP.push(step);
  };

  public nextStep = (stepID): void => {
    let StepperContent = this.DATA_STEP.filter((step) => {
      return step.stepID === stepID;
    });

    if (StepperContent.length === 0) return;

    StepperContent = StepperContent.sort((a, b) => a.stepIndex - b.stepIndex);

    let currentIndex = this.getCurrentStep(stepID);

    StepperContent[currentIndex - 1].stepStatus = "success";
    StepperContent[currentIndex].stepStatus = "current";
  };

  public getCurrentStep = (stepID): number => {
    let StepperContent = this.DATA_STEP.filter((step) => {
      return step.stepID === stepID;
    });

    const currentIndex = StepperContent.filter((step) => {
      return step.stepStatus === "current";
    })[0].stepIndex;

    if (StepperContent.length === 0) return 0;
    else return currentIndex;
  };

  public backStep = (stepID): void => {
    let StepperContent = this.DATA_STEP.filter((step) => {
      return step.stepID === stepID;
    });

    if (StepperContent.length === 0) return;

    StepperContent = StepperContent.sort((a, b) => a.stepIndex - b.stepIndex);

    let currentIndex = this.getCurrentStep(stepID);

    StepperContent[currentIndex - 1].stepStatus = "";
    StepperContent[currentIndex - 2].stepStatus = "current";
  };

  public gotoStep = (stepIndex: number, stepID: string): void => {
    let StepperContent = this.DATA_STEP.filter((step) => {
      return step.stepID === stepID;
    });

    StepperContent.forEach((step) => {
      if (step.stepIndex < stepIndex) {
        step.stepStatus = "success";
      } else if (step.stepIndex === stepIndex) {
        step.stepStatus = "current";
      } else {
        step.stepStatus = "";
      }
    });
  };

  public setValidation(isValid: boolean): void {
    this.isFormValid = isValid;
  }

  public getValidation(): boolean {
    return this.isFormValid;
  }
}
