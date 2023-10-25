export interface DynamicStepperModel {
  stepID: string;
  stepIndex: number;
  stepName: string;
  stepDetail: string;
  stepStatus: string;
}

export interface DynamicStepperResultModel {
  isError: boolean;
  errMessage: string;
  result: any;
}
