import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DynamicStepperComponent } from "./dynamic-stepper.component";
import { DynamicStepperContentComponent } from "./dynamic-stepper-content.component";
import { DynamicStepperDirective } from "./directives/dynamic-stepper.directive";
import { DynamicStepperService } from "./services/dynamic-stepper.service";

@NgModule({
  imports: [CommonModule],
  declarations: [
    DynamicStepperComponent,
    DynamicStepperContentComponent,
    DynamicStepperDirective,
  ],
  exports: [
    DynamicStepperComponent,
    DynamicStepperContentComponent,
    DynamicStepperDirective,
  ],
  providers: [DynamicStepperService],
})
export class DynamicStepperModule {}
