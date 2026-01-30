import { 
  Component,
  ChangeDetectionStrategy,  
  inject,
 } from '@angular/core';

import { RouterOutlet, RouterLink, Router } from '@angular/router';

import { AuthService } from '../auth/auth';
import { ThemeService } from '../core/services/theme';
import { FooterComponent } from '../shared/footer/footer';
import { SideNav } from './side-nav/side-nav';
import { isSideNavOpen, toggleSideNav } from './nav-state';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, FooterComponent, SideNav],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  private readonly router = inject(Router);
  
  isSideNavOpen = isSideNavOpen;

  constructor(
    public auth: AuthService ,
    public theme: ThemeService
    ) {}

  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  toggleTheme() {
    this.theme.toggle();
  }

  toggleSideNav(): void {
    toggleSideNav();
  }
}
