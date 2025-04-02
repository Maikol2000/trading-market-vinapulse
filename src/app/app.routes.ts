import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AppRouter } from './utils/routers';

export const routes: Routes = [
  {
    path: AppRouter.Dashboard.Layout,
    redirectTo: AppRouter.Dashboard.Home,
    pathMatch: 'full',
  },
  {
    path: AppRouter.Auth.AuthLayout,
    redirectTo: AppRouter.Dashboard.Home,
    pathMatch: 'full',
  },
  {
    path: '',
    loadComponent: AppRouter.Auth.authLayoutComponent,
    children: [
      {
        path: AppRouter.Auth.Login,
        loadComponent: AppRouter.Auth.loginComponent,
        pathMatch: 'full',
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
        // canActivate: [AuthGuard],
      },
      {
        path: AppRouter.Dashboard.TradeMarket(''),
        loadComponent: AppRouter.Dashboard.tradeMarketComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: AppRouter.Dashboard.Home,
    pathMatch: 'full',
  },
];
