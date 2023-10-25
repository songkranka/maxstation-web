import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { DefaultComponent } from "./default.component";
import { SharedModule } from "src/app/shared/shared.module";
import { DynamicStepperModule } from "./../../commons/dynamic-stepper/dynamic-stepper.module";
import { DynamicTableModule } from "./../../commons/dynamic-table/dynamic-table.module";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatListModule } from "@angular/material/list";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTableModule } from "@angular/material/table";
import { MatMenuModule } from "@angular/material/menu";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatBadgeModule } from "@angular/material/badge";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatTabsModule } from "@angular/material/tabs";
import { MatStepperModule } from "@angular/material/stepper";
import { CdkTableModule } from "@angular/cdk/table";
import { MatChipsModule } from "@angular/material/chips";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { BrowserModule } from "@angular/platform-browser";

const MatModules = [
  MatToolbarModule,
  MatSidenavModule,
  MatListModule,
  MatCardModule,
  MatIconModule,
  MatButtonModule,
  MatCheckboxModule,
  MatTableModule,
  MatMenuModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatTooltipModule,
  MatBadgeModule,
  MatProgressBarModule,
  MatTabsModule,
  MatStepperModule,
  CdkTableModule,
  MatChipsModule,
  MatExpansionModule,
  MatDatepickerModule,
];

@NgModule({
  declarations: [
    DefaultComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    MatModules,
    DynamicTableModule,
    DynamicStepperModule,
  ],
  exports: [MatModules],
})
export class DefaultModule {}
