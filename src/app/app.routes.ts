import { Routes } from '@angular/router';
import { AuthGuard, NonAuthGuard } from './core/guards';
import { AppRouter } from './utils/routers';

export const routes: Routes = [
  {
    path: '',
    redirectTo: AppRouter.Auth.Login,
    pathMatch: 'full',
  },
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
        canActivate: [NonAuthGuard],
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
        canActivate: [AuthGuard],
      },
      {
        path: AppRouter.Dashboard.TradeMarket(''),
        loadComponent: AppRouter.Dashboard.tradeMarketComponent,
        canActivate: [AuthGuard],
      },
      {
        path: AppRouter.Dashboard.OrderForm(''),
        loadComponent: AppRouter.Dashboard.orderFormComponent,
        canActivate: [AuthGuard],
      },
      {
        path: AppRouter.Dashboard.InfoDetail(''),
        loadComponent: AppRouter.Dashboard.infoDetailComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: '**',
    redirectTo: AppRouter.Dashboard.Home,
    pathMatch: 'full',
  },
];
