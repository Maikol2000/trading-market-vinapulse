import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SelectLangComponent } from '@app/shared/components';
import { ClickOutsideDirective } from '@app/shared/directives';
import { AppMenu } from '@app/utils/menu';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-mobile-menu',
  imports: [RouterModule, TranslateModule, NgClass, SelectLangComponent],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.scss',
})
export class MobileMenuComponent {
  isMenuOpen = input(false);

  closeMenu = output();

  menuItems = AppMenu;

  constructor() {}

  onClose() {
    this.closeMenu.emit();
  }
}
