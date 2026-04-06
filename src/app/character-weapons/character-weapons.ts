import { Component, inject } from '@angular/core';
import { CharacterLayout } from '../layout/character-layout/character-layout';
import { CharacterStore } from '../core/stores/character-store';
import { WeaponService } from '../core/services/weapon';
import { Router } from '@angular/router';
import { ToastService } from '../core/services/toast';

@Component({
  selector: 'app-character-weapons',
  imports: [CharacterLayout],
  templateUrl: './character-weapons.html',
  styleUrl: './character-weapons.css',
})
export class CharacterWeaponsComponent {
  readonly characterStore = inject(CharacterStore);
  readonly weaponService = inject(WeaponService);
  readonly toastService = inject(ToastService);
  private router = inject(Router);

  navigateToCreateWeapon(): void {
    this.router.navigate(['/characters', this.characterStore.character()?.id, 'create-weapon']);
  }

  deleteWeapon(weaponId: string, weaponName: string): void {
    const character = this.characterStore.character();

    if (!character) {
      console.error('Character not loaded');
      return;
    }
    
    if (confirm(`Are you sure you want to delete ${weaponName}?`)) {
      this.weaponService.deleteWeapon(character.id, weaponId).subscribe({
        next: (response) => {
          if (confirm(`Are you sure you want to delete ${weaponName}?`)) {
            this.toastService.show(`${weaponName} was successfully deleted`);
            this.characterStore.removeWeaponFromStore(weaponId);
          } else {
            return;
          }
        },
        error: (err) => {
          this.toastService.show(`Error while deleting ${weaponName}`, 'error');
        },
        complete: () => {},
      });
    } else {
      return;
    }
  }
}
