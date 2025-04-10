import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectLangComponent } from '@app/shared/components';
import { ClickOutsideDirective } from '@app/shared/directives';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-topbar',
  imports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    SelectLangComponent,
    ClickOutsideDirective,
  ],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent {
  isDropdownOpen = false;

  constructor() {}

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onClose(): void {
    this.isDropdownOpen = false;
  }

  logout(): void {
    // Implement logout logic here
  }
}
