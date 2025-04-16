import { TemplateRef } from '@angular/core';

export interface ModalConfig {
  title?: string;
  content: any;
  cancelText?: string;
  confirmText?: string;
  showCancel?: boolean;
  showConfirm?: boolean;
  modalClass?: string;
}

export interface ModalRef {
  close(result?: any): void;
}
