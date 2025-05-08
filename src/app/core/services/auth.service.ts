import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { IResponse } from '@app/shared/models';
import { ApiService } from '@app/shared/services';
import { AppRouter } from '@app/utils/routers';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { ILoginRequest, IRegisterRequest } from '../models';
import { LocalStorageKey } from '@app/shared/enums';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authState$ = new BehaviorSubject<boolean>(false);

  routerAuth = [
    '/' + AppRouter.Auth.AuthLayout,
    '/' + AppRouter.Auth.Login,
    '/' + AppRouter.Auth.Register,
    // AppRouter.Auth.ForgotPassword,
    // AppRouter.Auth.ResetPassword,
  ];

  constructor(private service: ApiService, private router: Router) {
    this.checkAuth();
    this.router.events.subscribe(() => {
      if (
        !this.routerAuth.includes(this.router.url) &&
        this.router.url !== '/'
      ) {
        localStorage.setItem(LocalStorageKey.LAST_URL, this.router.url);
      }
    });
  }

  login(login: ILoginRequest): Observable<IResponse<string>> {
    // let deviceInfo = this.deviceService.getDeviceInfo();
    // const { device, deviceType, os, os_version } = deviceInfo; // Log device information
    return this.service.post<IResponse<string>>('/auth/login', {
      ...login,
    });
  }

  logout() {
    return this.service.post<IResponse<boolean>>('/auth/logout');
  }

  checkAuth() {
    return this.service
      .get<IResponse<boolean>>('/auth/auth-check')
      .pipe(
        map((response) => {
          this.authState$.next(response.value);
          if (response.value && this.router.url !== AppRouter.Auth.AuthLayout) {
            const url =
              localStorage.getItem(LocalStorageKey.LAST_URL) ??
              AppRouter.Dashboard.Home;
            this.router.navigate([url]);
          } else if (this.router.url !== '/') {
            this.router.navigate([AppRouter.Auth.AuthLayout]);
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

  register(register: IRegisterRequest): Observable<IResponse<string>> {
    return this.service.post<IResponse<string>>('/auth/register', {
      ...register,
    });
  }

  isAuthenticated() {
    return this.authState$.asObservable();
  }
}
