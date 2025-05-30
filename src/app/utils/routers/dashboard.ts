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

  // Infomation detail
  InfoDetail = (instId: string) =>
    this.Layout + `/info-detail/${instId ? instId : ':instId'}`;
  infoDetailComponent = () =>
    import('@app/pages/dashboard/info-detail/info-detail.component').then(
      (m) => m.InfoDetailComponent
    );

  // News
  News = this.Layout + '/news';
  newsComponent = () =>
    import('@app/pages/dashboard/news/news.component').then(
      (m) => m.NewsComponent
    );

  // New Detail
  NewDetail = (newsId: string) =>
    this.Layout + `/news-detail/${newsId ? newsId : ':newsId'}`;
  newsDetailComponent = () =>
    import('@app/pages/dashboard/news/new-detail/new-detail.component').then(
      (m) => m.NewDetailComponent
    );
}
