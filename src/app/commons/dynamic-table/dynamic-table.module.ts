import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DynamicTableComponent } from "./dynamic-table.component";
import { DynamicTableDirective } from "./directives/dynamic-table.directive";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [DynamicTableComponent, DynamicTableDirective],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [DynamicTableComponent, DynamicTableDirective],
})
export class DynamicTableModule {}
