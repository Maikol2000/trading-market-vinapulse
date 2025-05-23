import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '@app/core/services';
import { SelectLangComponent } from '@app/shared/components';
import { AppRouter } from '@app/utils/routers';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime } from 'rxjs';

@Component({
  selector: 'app-login-form',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TranslateModule,
    SelectLangComponent,
    RouterModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  loginForm: FormGroup;
  appRouter = AppRouter;

  constructor(
    private fb: FormBuilder,
    private service: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.service
        .login({ userId: email, passId: password })
        .pipe(debounceTime(100))
        .subscribe({
          next: () => {
            // this.service.checkAuth();
          },
          error: (error) => {
            console.error('Login failed', error);
          },
        });
    }
  }

  navigate() {
    this.router.navigate([this.appRouter.Auth.Register]);
  }

  async signInWithGoogle() {
    try {
      const auth = await this.service.signInWithGoogle();
      console.log({ auth });
    } catch (error) {
      console.error('Lỗi đăng nhập:', error);
    }
  }
}
