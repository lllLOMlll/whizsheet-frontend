import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CharacterStore } from '../stores/character-store';

@Injectable({
  providedIn: 'root',
})
export class WhizSheetNavigation {
  private router = inject(Router);
  private characterStore = inject(CharacterStore);

  navigateToCharacterDetail(): void {
    const charId = this.characterStore.character()?.id;
    if (charId) {
      this.router.navigate(['/characters', charId]);
    }
  }

}
