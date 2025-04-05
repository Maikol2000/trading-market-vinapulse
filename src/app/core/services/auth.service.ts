import { Injectable } from '@angular/core';
import { ResponseData } from '@app/shared/models';
import { ApiService } from '@app/shared/services';
import { DeviceDetectorService } from 'ngx-device-detector';
import { Observable } from 'rxjs';
import { ILoginRequest } from '../models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isLoggedIn: boolean = false;

  constructor(
    private service: ApiService,
    private deviceService: DeviceDetectorService
  ) {
    // Kiểm tra token trong localStorage khi service được khởi tạo
    const token = localStorage.getItem('token');
    this.isLoggedIn = !!token;
  }

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
    localStorage.removeItem('token');
    this.isLoggedIn = false;
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
