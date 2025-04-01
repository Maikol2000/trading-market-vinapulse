export class dashboardRoute {
  //layout
  Layout = 'app';
  layoutComponent = () =>
    import('@app/components/layout/layout.component').then(
      (m) => m.LayoutComponent
    );

  //home
  Home = this.Layout + '/home';
  homeComponent = () =>
    import('@app/pages/dashboard/home/home.component').then(
      (m) => m.HomeComponent
    );

  //
}
