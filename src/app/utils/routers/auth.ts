export class authRoute {
  //auth
  AuthLayout = 'auth';
  authLayoutComponent = () =>
    import('@app/layout/auth-layout/auth-layout.component').then(
      (m) => m.AuthLayoutComponent
    );

  //login
  Login = this.AuthLayout + '/login';
  loginComponent = () =>
    import('@app/pages/auth/login/login.component').then(
      (m) => m.LoginComponent
    );

  //register
  Register = this.AuthLayout + '/register';
  registerComponent = () =>
    import('@app/pages/auth/register/register.component').then(
      (m) => m.RegisterComponent
    );
}
