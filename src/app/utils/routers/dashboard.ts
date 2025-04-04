export class dashboardRoute {
  //layout
  Layout = 'app';
  layoutComponent = () =>
    import('@app/layout/layout/layout.component').then(
      (m) => m.LayoutComponent
    );

  //home
  Home = this.Layout + '/home';
  homeComponent = () =>
    import('@app/pages/dashboard/home/home.component').then(
      (m) => m.HomeComponent
    );

  //trade market
  TradeMarket = (instId: string) =>
    this.Layout + `/trade-market/${instId ? instId : ':instId'}`;
  tradeMarketComponent = () =>
    import('@app/pages/dashboard/trade-market/trade-market.component').then(
      (m) => m.TradeMarketComponent
    );

  // order form
  OrderForm = (instId: string) =>
    this.Layout + `/order-form/${instId ? instId : ':instId'}`;
  orderFormComponent = () =>
    import('@app/pages/dashboard/order/order.component').then(
      (m) => m.OrderComponent
    );
}
