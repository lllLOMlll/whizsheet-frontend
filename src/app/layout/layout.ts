import { 
  Component,
  ChangeDetectionStrategy,  
 } from '@angular/core';

import { RouterOutlet, RouterLink } from '@angular/router';

import { AuthService } from '../auth/auth';
import { ThemeService } from '../core/services/theme';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  constructor(
    public auth: AuthService ,
    public theme: ThemeService
    ) {}

  logout() {
    this.auth.logout();
  }

  toggleTheme() {
    this.theme.toggle();
  }
}
