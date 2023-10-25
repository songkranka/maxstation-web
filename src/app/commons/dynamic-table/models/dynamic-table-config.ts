import { SafeHtml } from "@angular/platform-browser";

export interface DynamicTableConfigModel {
  tableTitle: string;
  buttonForm: boolean;
  buttonFormClass: string;
  buttonFormText: string;
  buttonFilter: boolean;
  buttonFilterText: string;
  buttonFilterClass: string;
}

export interface DynamicTableColumnModel {
  fieldName: string;
  fieldType: string;
  fieldPlaceholder: string;

  headerText: string;
  headerTextAlign: string;

  customStyle: string;
  textAlign: string;

  isShow: boolean;
  isSort: boolean;

  isHtml: boolean;
  customHtml: string[];

  isButton: boolean;
  customButton: DynamicTableButton[];

  isBatchInput: boolean;
  batchInputType: string;
}

export interface DynamicTableButton {
  buttonName: string;
  buttonClass: string;
  buttonText: string;
  actionCustomForm: string;
  actionCustomMethod: any;
  actionMethod: any;

  isShow: boolean;
}
