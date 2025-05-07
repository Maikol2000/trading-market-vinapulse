import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ResponseData } from '@app/shared/models';
import { ApiService } from '@app/shared/services';
import { AppRouter } from '@app/utils/routers';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { ILoginRequest, IRegisterRequest } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authState$ = new BehaviorSubject<boolean>(false);

  routerAuth = [
    AppRouter.Auth.AuthLayout,
    AppRouter.Auth.Login,
    AppRouter.Auth.Register,
    // AppRouter.Auth.ForgotPassword,
    // AppRouter.Auth.ResetPassword,
  ];

  constructor(private service: ApiService, private router: Router) {
    this.checkAuth();
  }

  login(login: ILoginRequest): Observable<ResponseData<string>> {
    // let deviceInfo = this.deviceService.getDeviceInfo();
    // const { device, deviceType, os, os_version } = deviceInfo; // Log device information
    return this.service.post<ResponseData<string>>('/auth/login', {
      ...login,
    });
  }

  logout() {
    return this.service.post<ResponseData<boolean>>('/auth/logout');
  }

  checkAuth() {
    return this.service
      .get<ResponseData<boolean>>('/auth/auth-check')
      .pipe(
        map((response) => {
          this.authState$.next(response.value);
          if (response.value) {
            this.router.navigate([AppRouter.Dashboard.Home]);
          } else if (this.routerAuth.includes(this.router.url)) {
            this.router.navigate([AppRouter.Auth.AuthLayout]);
          }
        }),
        catchError(() => {
          this.authState$.next(false);
          return of(false);
        })
      )
      .subscribe();
  }

  register(register: IRegisterRequest): Observable<ResponseData<string>> {
    return this.service.post<ResponseData<string>>('/auth/register', {
      ...register,
    });
  }

  isAuthenticated() {
    return this.authState$.asObservable();
  }
}
