import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SelectLangComponent } from '@app/shared/components';
import { AppMenu } from '@app/utils/menu';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCircleUser } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-mobile-menu',
  imports: [
    RouterModule,
    TranslateModule,
    NgClass,
    SelectLangComponent,
    FontAwesomeModule,
  ],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.scss',
})
export class MobileMenuComponent {
  isMenuOpen = input(false);

  closeMenu = output();

  faCircleUser = faCircleUser;

  menuItems = AppMenu;

  constructor() {}

  onClose() {
    this.closeMenu.emit();
  }
}
