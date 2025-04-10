import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<void>();
  @Input() clickOutsideExceptions: HTMLElement[] = [];

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: HTMLElement) {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    const clickedException = this.clickOutsideExceptions.some((el) =>
      el.contains(targetElement)
    );

    if (!clickedInside && !clickedException) {
      this.clickOutside.emit();
    }
  }
}
