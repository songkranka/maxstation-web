import { DOCUMENT } from "@angular/common";
import {
  Directive,
  ElementRef,
  Inject,
  OnInit,
  Renderer2,
} from "@angular/core";

@Directive({
  selector: "[dynamic-step]",
})
export class DynamicStepperDirective implements OnInit {
  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document
  ) {}

  ngOnInit() {
    // const child = document.createElement("div");
    // this.renderer.appendChild(this.elementRef.nativeElement, child);
  }
}
