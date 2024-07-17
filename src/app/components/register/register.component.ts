import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { eyeClosedIcon, eyeOpenIcon } from '../../icons/icons';
import { AuthService } from '../../services/auth/auth.service';
import { passwordValidator } from '../../validators/custom-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;
  eyeOpenIcon: SafeHtml;
  eyeClosedIcon: SafeHtml;

  constructor(
    private fb: FormBuilder,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private router: Router
  ) {
    this.eyeOpenIcon = this.sanitizer.bypassSecurityTrustHtml(eyeOpenIcon);
    this.eyeClosedIcon = this.sanitizer.bypassSecurityTrustHtml(eyeClosedIcon);

    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(8)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordValidator()]],
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.authService
        .register(
          this.registerForm.value.name,
          this.registerForm.value.email,
          this.registerForm.value.password
        )
        .subscribe({
          next: () => {
            toast.success('Registration successful');
            this.router.navigate(['/auth/login']);
          },
          error: error => {
            if (error.message === 'Email already register!') {
              toast.error('Email already registered!');
            } else {
              toast.error('Registration failed');
            }
          },
        });
    } else {
      this.registerForm.markAllAsTouched();
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.registerForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }
}
