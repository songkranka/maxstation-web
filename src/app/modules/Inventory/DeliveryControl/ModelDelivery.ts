import { ModelInvDeliveryCtrl, ModelInvDeliveryCtrlDt, ModelInvDeliveryCtrlHd } from 'src/app/model/ModelScaffold';

export class ModelParamSearchDelivery{
  BrnCode : string = "";
  CompCode : string = "";
  LocCode : string = "";
  Keyword : string = "";
  FromDate : Date = new Date();
  ToDate : Date = new Date();
  Page : number = 0;
  ItemsPerPage : number = 0;
}

export class ModelResultSearchDelivery{
  Items : ModelInvDeliveryCtrl[] = [];
  TotalItems : number = 0;
  ItemsPerPage : number = 0;
}
export class ModelParamSearchReceive{
  ArrPotypeId : string[] = [];
  BrnCode : string = "";
  CompCode : string = "";
  LocCode : string = "";
  Keyword : string = "";
  FromDate : Date = new Date();
  ToDate : Date = new Date();
}
export class ModelDeliveryControl{
  Header : ModelInvDeliveryCtrlHd = new ModelInvDeliveryCtrlHd();
  ArrDetail : ModelInvDeliveryCtrlDt[] = [];
}
