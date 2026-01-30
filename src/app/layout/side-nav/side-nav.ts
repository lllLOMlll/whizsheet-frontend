import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { closeSideNav, isSideNavOpen } from '../nav-state';
import { ThemeService } from '../../core/services/theme';


@Component({
  selector: 'app-side-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css',
})
export class SideNav {
  public theme = inject(ThemeService);

  isOpen = isSideNavOpen;

  close(): void {
    closeSideNav();
  }
}



