import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AppRouter } from '@app/utils/routers';
import {
  FaIconLibrary,
  FontAwesomeModule,
} from '@fortawesome/angular-fontawesome';
import {
  faBitcoinSign,
  faCoins,
  faHome,
  faMoneyBillTrendUp,
  faMoneyCheckDollar,
  faUser,
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
    {
      icon: faMoneyBillTrendUp,
      label: 'Tỉ giá Chứng khoáng',
      route: '/products',
    },
    {
      icon: faCoins,
      label: 'Tỉ giá Coin',
      route: AppRouter.Dashboard.TradeMarket('BTC-USDT'),
    },
    {
      icon: faBitcoinSign,
      label: 'Thông tin chi tiết',
      route: AppRouter.Dashboard.InfoDetail('BTC-USDT'),
    },
    {
      icon: faMoneyCheckDollar,
      label: 'Vào lệnh',
      route: AppRouter.Dashboard.OrderForm('BTC-USDT'),
    },
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
