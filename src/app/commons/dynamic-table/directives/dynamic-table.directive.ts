import { Directive, ElementRef, HostBinding } from "@angular/core";

@Directive({
  selector: "[custom-content]",
})
export class DynamicTableDirective {
  @HostBinding("class")
  elementClass = "custom-content";

  constructor() {}
}
