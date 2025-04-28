import { CommonModule, Location } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '@app/core/services';
import { SelectLangComponent } from '@app/shared/components';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-login-form',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    TranslateModule,
    SelectLangComponent,
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.scss',
})
export class LoginFormComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private service: AuthService,
    private location: Location
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.service.login({ userId: email, passId: password }).subscribe({
        next: () => {
          this.location.back();
          // this.router.navigate([AppRouter.Dashboard.Home]);
        },
        error: (error) => {
          console.error('Login failed', error);
        },
      });
    }
  }
}
