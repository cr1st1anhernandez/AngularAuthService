import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { toast } from 'ngx-sonner';
import { eyeClosedIcon, eyeOpenIcon } from '../../icons/icons';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  eyeOpenIcon: SafeHtml;
  eyeClosedIcon: SafeHtml;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.eyeOpenIcon = this.sanitizer.bypassSecurityTrustHtml(eyeOpenIcon);
    this.eyeClosedIcon = this.sanitizer.bypassSecurityTrustHtml(eyeClosedIcon);
    this.loginForm = this.fb.group({
      name: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  togglePasswordVisibility(event: Event) {
    event.preventDefault();
    this.hidePassword = !this.hidePassword;
  }

  login(): void {
    if (this.loginForm.valid) {
      const { name, password } = this.loginForm.value;
      this.authService.login(name, password).subscribe({
        next: () => {
          this.router.navigate(['/users']);
        },
        error: () => {
          toast.error('Invalid credentials');
        },
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  isInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return control ? control.invalid && control.touched : false;
  }
}
