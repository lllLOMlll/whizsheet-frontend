import { Component, inject } from '@angular/core';
import { RouterLink, Router, RouterLinkActive } from "@angular/router";
import { closeSideNav, isSideNavOpen } from '../nav-state';
import { ThemeService } from '../../core/services/theme';
import { AuthService } from '../../auth/auth';


@Component({
  selector: 'app-side-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css',
})
export class SideNav {
  private readonly router = inject(Router);
  public theme = inject(ThemeService);
  public auth = inject(AuthService);
  

  isOpen = isSideNavOpen;


  close(): void {
    closeSideNav();
  }

  toggleTheme() {
    this.theme.toggle();
  }

    logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }



}



