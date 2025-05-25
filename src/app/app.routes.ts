import { Routes } from '@angular/router';
import { NonAuthGuard } from './core/guards';
import { AppRouter } from './utils/routers';

export const routes: Routes = [
  {
    path: '',
    loadComponent: AppRouter.Auth.authLayoutComponent,
    canActivateChild: [NonAuthGuard],
    children: [
      {
        path: AppRouter.Auth.Login,
        loadComponent: AppRouter.Auth.loginComponent,
      },
      {
        path: AppRouter.Auth.Register,
        loadComponent: AppRouter.Auth.registerComponent,
      },
    ],
  },
  {
    path: '',
    loadComponent: AppRouter.Dashboard.layoutComponent,
    children: [
      {
        path: AppRouter.Dashboard.Home,
        loadComponent: AppRouter.Dashboard.homeComponent,
      },
      {
        path: AppRouter.Dashboard.TradeMarket(''),
        loadComponent: AppRouter.Dashboard.tradeMarketComponent,
      },
      {
        path: AppRouter.Dashboard.InfoDetail(''),
        loadComponent: AppRouter.Dashboard.infoDetailComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: AppRouter.Dashboard.Home,
    pathMatch: 'full',
  },
];
