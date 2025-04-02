import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AppRouter } from '@app/utils/routers';
import { Observable } from 'rxjs';
import { AuthService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | Observable<boolean> {
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      this.router.navigate([AppRouter.Auth.Login]);
      return false;
    }
  }
}
