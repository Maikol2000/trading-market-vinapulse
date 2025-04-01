export class authRoute {
  //auth
  AuthLayout = 'auth';
  authLayoutComponent = () =>
    import('@app/components/auth-layout/auth-layout.component').then(
      (m) => m.AuthLayoutComponent
    );

  //login
  Login = this.AuthLayout + '/login';
  loginComponent = () =>
    import('@app/pages/auth/login/login.component').then(
      (m) => m.LoginComponent
    );
}
