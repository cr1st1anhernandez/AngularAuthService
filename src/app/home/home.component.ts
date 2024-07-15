import { Component } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { loginIcon } from '../icons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
})
export class HomeComponent {
  loginIcon: SafeHtml;
  constructor(private sanitizer: DomSanitizer) {
    this.loginIcon = this.sanitizer.bypassSecurityTrustHtml(loginIcon);
  }
}
