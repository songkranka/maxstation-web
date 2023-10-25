import { ModelInvTranoutHd } from "./ModelScaffold";

export class ResponseWarpadTaskList {
  StatusCode: number;
  Message: string;
  CurrentCount: number;
  Data: Array<ResponseWarpadTaskData>;
}

export class ResponseWarpadTaskData {
  Topic: string;
  StartDate: string;
  EndDate: string;
  BranchFrom: string;
  Link: string;
  Detail: string;
  TaskStatus: string;
}

export class CsModelInvTranoutHd extends ModelInvTranoutHd {
  brnName: string;
}


export class QueryResultResource<T> {
  totalItems: number;
  items: T[]
  itemsPerPage: number;
  isSuccess: boolean;
  message: string;
}

export class QueryObjectResource<T> {
  data: T
  isSuccess: boolean;
  message: string;
}

export class ModelGetToDoTaskSecond {
  LeftTime: number = 0;
}

export class ModelGetToDoTaskData {
  AssignID: string = "";
  TaskID: string = "";
  TaskName: string = "";
  EndDate: string = "";
  EndTime: string = "";
  TaskStatus: string = "";
  GroupId?: any = null;
  IsGroup: number = 0;
  TaskType: string = "";
  Category: string = "";
  SubCategory: string = "";
  TaskTopic: string = "";
  Second: ModelGetToDoTaskSecond = new ModelGetToDoTaskSecond();
  Link: string = "";
}

export class ModelGetToDoTaskResult {
  status: number =0;
  resultCode: number =0;
  resultMessage: string = "";
  count: number = 0;
  resultData: ModelGetToDoTaskData[] = [];
}
