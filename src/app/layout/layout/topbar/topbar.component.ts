import { CommonModule } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '@app/core/services';
import { SelectLangComponent } from '@app/shared/components';
import { ClickOutsideDirective } from '@app/shared/directives';
import { AppRouter } from '@app/utils/routers';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {
  faCircleUser,
  faSignIn,
  faSignOut,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { SideBarComponent } from '../side-bar/side-bar.component';
import { BadgeNotificationComponent } from './badge-notification/badge-notification.component';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';

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
    RouterModule,
  ],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent {
  isDropdownOpen = false;
  isMobile = false;

  isMenuOpen = signal(false);
  isLogin = signal(false);

  faSignOut = faSignOut;
  faSignIn = faSignIn;
  faCircleUser = faCircleUser;
  faUser = faUser;

  appRouter = AppRouter;

  constructor(private service: AuthService) {
    this.checkScreenSize();
    this.service.isAuthenticated().subscribe((val) => {
      this.isLogin.set(val);
    });
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
      this.service.checkAuth();
    });
  }
}
