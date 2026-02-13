import { Component, inject, signal } from '@angular/core';
import { RouterLink, Router, RouterLinkActive, ActivatedRoute } from '@angular/router';
import { closeSideNav, isSideNavOpen } from '../nav-state';
import { ThemeService } from '../../core/services/theme';
import { AuthService } from '../../auth/auth';

import { CharacterService } from '../../core/services/character';

@Component({
  selector: 'app-side-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css',
})
export class SideNav {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly characterService = inject(CharacterService);
  public theme = inject(ThemeService);
  public auth = inject(AuthService);

  isOpen = isSideNavOpen;

  activeCharacterId = this.characterService.activeCharacterId;
  activeCharacter = this.characterService.activeCharacter;

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
