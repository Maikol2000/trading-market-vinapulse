import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IRegisterRequest } from '@app/core/models';
import { AuthService } from '@app/core/services';
import { AppRouter } from '@app/utils/routers';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm!: FormGroup;
  submitted = false;
  passwordVisible = false;
  confirmPasswordVisible = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: AuthService
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group(
      {
        fullName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.pattern(/^[a-zA-Z\s]*$/),
          ],
        ],
        userName: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(30),
          ],
        ],
        phoneNumber: [
          '',
          [
            Validators.required,
            Validators.pattern(/^(\+84|0)[3|5|7|8|9][0-9]{8}$/),
          ],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.email,
            Validators.pattern(
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
            ),
          ],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  // Custom validator for password match
  private passwordMatchValidator(g: FormGroup) {
    const password = g.get('password');
    const confirmPassword = g.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else if (confirmPassword) {
      confirmPassword.setErrors(null);
    }
    return null;
  }

  // Getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  // Form submission
  onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      // Mark all fields as touched to trigger validation display
      Object.keys(this.registerForm.controls).forEach((key) => {
        const control = this.registerForm.get(key);
        control?.markAsTouched();
      });
      return;
    }

    const res: IRegisterRequest = {
      fullName: this.registerForm.value.fullName,
      userName: this.registerForm.value.userName,
      phoneNumber: this.registerForm.value.phoneNumber,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
    };

    // Process registration
    this.service.register(res).subscribe({
      next: (response) => {
        if (response.value) {
          this.router.navigate([AppRouter.Auth.Login]);
        }
      },
      error: (error) => {
        // Handle error response
        console.error('Registration error:', error.message);
      },
    });
  }

  // Helper methods for password visibility
  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  toggleConfirmPasswordVisibility() {
    this.confirmPasswordVisible = !this.confirmPasswordVisible;
  }

  // Real-time validation methods
  getErrorMessage(fieldName: string): string {
    const control = this.registerForm.get(fieldName);
    if (control && control.errors && (control.dirty || control.touched)) {
      if (control.errors['required']) return `${fieldName} is required`;
      if (control.errors['minlength'])
        return `${fieldName} must be at least ${control.errors['minlength'].requiredLength} characters`;
      if (control.errors['maxlength'])
        return `${fieldName} must not exceed ${control.errors['maxlength'].requiredLength} characters`;
      if (control.errors['email']) return 'Invalid email address';
      if (control.errors['pattern']) {
        switch (fieldName) {
          case 'password':
            return 'Password must contain uppercase, lowercase, number and special character';
          case 'email':
            return 'Invalid email format';
          case 'phoneNumber':
            return 'Please enter a valid Vietnamese phone number';
          default:
            return `Invalid ${fieldName} format`;
        }
      }
      if (control.errors['passwordMismatch']) return 'Passwords do not match';
    }
    return '';
  }

  navigate() {
    this.router.navigate([AppRouter.Auth.Login]);
  }
}
