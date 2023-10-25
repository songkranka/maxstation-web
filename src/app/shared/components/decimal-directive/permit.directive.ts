import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appPermit]'
})
export class PermitDirective {

  @Input('appPermit') pattern: string;

  private categories = {
    decimals: '^[0-9]+(\\.[0-9]{0,2}){0,1}$',
    numbers: '^\\d+$',
  };

  constructor() {}

  @HostListener('keydown', ['$event']) onKeyDown(e) {
    switch (true) {
      case e.metaKey:
      case e.ctrlKey:
      case e.altKey:
      case e.key?.length !== 1:
        return true;
      default:
        return this.isValidText(e, e.key);
    }
  }

  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    return this.isValidText(event, event.clipboardData.getData('text/plain'));
  }

  isValidText(e, text) {
    const [selectionStart, selectionEnd] = this.getSelectionRange(e.target);
    // for elements not having value accessor(innerText)
    const existingValue = e.target.value ?? e.target.innerText; 

    return new RegExp(this.categories[this.pattern] || this.pattern).test(
      existingValue.substring(0, selectionStart) +
        text +
        existingValue.substring(selectionEnd)
    );
  }

  getSelectionRange(el: HTMLElement) {
    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      // These properties aren't present for any HTMLElement
      return [el.selectionStart, el.selectionEnd];
    }
    // currently getSelection() doesn't work on the content of <textarea> and // <input> elements in Firefox, Edge (Legacy)
    const {startOffset, endOffset} = getSelection().getRangeAt(0);
    return [startOffset, endOffset];
  }

}