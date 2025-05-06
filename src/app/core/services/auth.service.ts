import { Injectable } from '@angular/core';
import { ResponseData } from '@app/shared/models';
import { ApiService } from '@app/shared/services';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { ILoginRequest } from '../models';
import { Router } from '@angular/router';
import { AppRouter } from '@app/utils/routers';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authState$ = new BehaviorSubject<boolean>(false);

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
          } else {
            this.router.navigate([AppRouter.Auth.Login]);
          }
        }),
        catchError(() => {
          this.authState$.next(false);
          return of(false);
        })
      )
      .subscribe();
  }

  isAuthenticated() {
    return this.authState$.asObservable();
  }
}
