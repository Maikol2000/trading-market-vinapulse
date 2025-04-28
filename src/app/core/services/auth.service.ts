import { Injectable } from '@angular/core';
import { ResponseData } from '@app/shared/models';
import { ApiService, CookiesService } from '@app/shared/services';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable } from 'rxjs';
import { ILoginRequest } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private service: ApiService,
    private deviceService: DeviceDetectorService,
    private cookieService: CookiesService
  ) {}

  login(credentials: ILoginRequest): Observable<ResponseData<string>> {
    let deviceInfo = this.deviceService.getDeviceInfo();
    const { device, deviceType, os, os_version } = deviceInfo; // Log device information
    return this.service.post<ResponseData<string>>('/auth/login', {
      ...credentials,
      deviceName: device,
      deviceType,
      deviceOs: os,
      versionOs: os_version,
    });
    // .pipe(
    //   tap((response) => {
    //     if (response) {
    //       this.isLoggedIn = true;
    //     }
    //   })
    // );
  }

  logout(): void {
    // localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return this.cookieService.hasCookie('auth_token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
