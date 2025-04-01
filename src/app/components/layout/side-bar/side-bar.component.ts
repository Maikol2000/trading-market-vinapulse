import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AppRouter } from '@app/utils/routers';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import {
  faHome,
  faUser,
  faProcedures,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-side-bar',
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class SideBarComponent {
  menuItems = [
    { icon: faHome, label: 'Trang chủ', route: AppRouter.Dashboard.Home },
    { icon: faUser, label: "Tỉ giá Cchứng khoáng", route: '/products' },
    { icon: faUser, label: 'Tỉ giá Coin', route: '/customers' },
    { icon: faUser, label: 'Thông tin chi tiết', route: '/customers' },
    { icon: faUser, label: 'Vào lệnh', route: '/customers' },
    { icon: faUser, label: 'AI dự đoán', route: '/customers' },
    { icon: faUser, label: 'AI tranding Boot', route: '/customers' },
    { icon: faUser, label: 'AI Chat Boot', route: '/customers' },
    { icon: faUser, label: 'Tin tức', route: '/customers' },
  ];

  constructor(private router: Router, library: FaIconLibrary) {
    library.addIcons();
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }
}
