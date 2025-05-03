import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
  animations: [
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('150ms', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('150ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export class ModalComponent {
  @Input() isOpen = true;
  @Input() title?: string;
  @Input() showHeader = true;
  @Input() showFooter = true;
  @Input() showCloseButton = true;
  @Input() closeOnBackdropClick = true;
  @Input() closeOnEscape = true;

  // Custom classes for styling with Tailwind
  @Input() backdropClass?: string;
  @Input() containerClass?: string;
  @Input() headerClass?: string;
  @Input() titleClass?: string;
  @Input() bodyClass?: string;
  @Input() footerClass?: string;
  @Input() closeButtonClass?: string;

  @Output() closed = new EventEmitter<void>();

  @ViewChild('modalContent') modalContent?: ElementRef;

  @HostListener('document:keydown.escape')
  onEscapePress() {
    if (this.isOpen && this.closeOnEscape) {
      this.close();
    }
  }

  close(): void {
    this.isOpen = false;
    this.closed.emit();
  }
}
