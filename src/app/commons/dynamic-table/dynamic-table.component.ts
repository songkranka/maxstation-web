import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
} from "@angular/core";

import {
  DynamicTableColumnModel,
  DynamicTableConfigModel,
} from "./models/dynamic-table-config";

import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "dynamic-table",
  templateUrl: "./dynamic-table.component.html",
})
export class DynamicTableComponent {
  constructor(private sanitizer: DomSanitizer, public elementRef: ElementRef) {}

  @Input() dataTable: any[];
  @Input() config: DynamicTableConfigModel;
  @Input() columns: DynamicTableColumnModel[];

  @Input() customActionTarget: string;

  @Output() dataTableChange: EventEmitter<any> = new EventEmitter<any>();

  activeInfo = false;
  openCustom = false;
  openFilter = false;
  openForm = false;

  isInsert = false;
  isUpdate = false;

  newItem: any = {};
  currentItem: any = {};

  getInnerHTMLValue = (customHtml) => {
    return this.sanitizer.bypassSecurityTrustHtml(customHtml);
  };

  toggleFilterDialog = () => {
    if (this.openFilter !== true) {
      this.resetDialog();
    } else {
      this.resetDialog();
      return;
    }
    setTimeout(() => {
      this.activeInfo = true;
      this.openFilter = true;

      this.openCustom = false;
      this.openForm = false;
    }, 300);
  };

  toggleFormDialog = () => {
    if (this.openForm !== true) {
      this.resetDialog();
    } else {
      this.resetDialog();
      return;
    }

    setTimeout(() => {
      this.activeInfo = true;
      this.openForm = true;
      this.isInsert = true;

      this.openCustom = false;
      this.openFilter = false;
    }, 300);
  };

  toggleCustomDialog = (
    index: number,
    typeForm: any = null,
    rowIndex: number = 0
  ) => {
    this.resetDialog();

    setTimeout(() => {
      if (typeForm && typeForm === "update") {
        this.activeInfo = true;
        this.openForm = true;
        this.isUpdate = true;

        this.currentItem = this.dataTable[rowIndex];

        return;
      }

      let elements = this.elementRef.nativeElement.querySelectorAll(
        ".custom-content"
      );

      if (elements && elements.length > 0) {
        elements.forEach((element) => {
          element.classList.remove("toggled");
        });

        elements[index].classList.add("toggled");
      }

      this.activeInfo = true;
      this.openCustom = true;

      this.openFilter = false;
      this.openForm = false;
    }, 300);
  };

  resetDialog = () => {
    this.activeInfo = false;
    this.openCustom = false;
    this.openFilter = false;
    this.openForm = false;

    this.isInsert = false;
    this.isUpdate = false;
  };

  add = () => {
    this.dataTable.push(this.newItem);
    this.newItem = {};
  };

  update = () => {
    this.dataTable.push(this.newItem);
    this.newItem = {};
  };

  delete = (data: any, index: number) => {
    this.dataTable.splice(index, 1);
  };
}
