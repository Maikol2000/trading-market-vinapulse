import { inject, Injectable } from '@angular/core';
import { CanActivateChild, Router } from '@angular/router';
import { AppRouter } from '@app/utils/routers';
import { catchError, map, Observable, of } from 'rxjs';
import { AuthService } from '../services';

@Injectable({
  providedIn: 'root',
})
export class NonAuthGuard implements CanActivateChild {
  private router = inject(Router);

  constructor(private authService: AuthService) {}

  canActivateChild(): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      map((isAuthenticated) => {
        if (isAuthenticated) {
          // If authenticated, redirect to dashboard
          this.router.navigate([AppRouter.Dashboard.Home]);
          return false;
        }
        // Allow access to auth routes when not authenticated
        return true;
      }),
      catchError(() => {
        // On error, allow access and let error handling middleware handle the error
        return of(true);
      })
    );
  }
}
