import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './core/services';
import { LanguageService } from './shared/services';
@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterModule,
    PanelModule,
    CardModule,
    ButtonModule,
    ToastModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(
    private translate: LanguageService,
    private authService: AuthService
  ) {
    this.authService.checkAuth();
  }
}
