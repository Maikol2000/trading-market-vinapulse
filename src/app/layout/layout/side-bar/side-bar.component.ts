import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AppMenu } from '@app/utils/menu';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule, RouterModule, FontAwesomeModule, TranslateModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class SideBarComponent {
  menuItems = AppMenu;

  constructor(private router: Router, library: FaIconLibrary) {
    library.addIcons();
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
