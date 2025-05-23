import { CommonModule } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '@app/core/services';
import { SelectLangComponent } from '@app/shared/components';
import { ClickOutsideDirective } from '@app/shared/directives';
import { TranslateModule } from '@ngx-translate/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { BadgeNotificationComponent } from './badge-notification/badge-notification.component';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: 'app-topbar',
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    SelectLangComponent,
    ClickOutsideDirective,
    SideBarComponent,
    MobileMenuComponent,
    BadgeNotificationComponent,
    FontAwesomeModule,
  ],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent {
  isDropdownOpen = false;

  isMenuOpen = signal(false);
  isMobile = false;

  faSignOut = faSignOut;

  constructor(private service: AuthService) {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    this.isMobile = window.innerWidth < 768;
    if (!this.isMobile) {
      this.isMenuOpen.set(false);
    }
  }

  openMenu() {
    this.isMenuOpen.set(true);
  }

  // Đóng menu khi click bên ngoài
  closeMenu() {
    if (this.isMenuOpen()) {
      this.isMenuOpen.set(false);
      document.body.classList.remove('overflow-hidden');
    }
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onClose(): void {
    this.isDropdownOpen = false;
  }

  logout(): void {
    this.service.logout().subscribe(() => {
      // this.service.checkAuth();
    });
  }
}
