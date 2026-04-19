import { Component, inject } from '@angular/core';
import { CharacterLayout } from '../layout/character-layout/character-layout';
import { CharacterStore } from '../core/stores/character-store';
import { WeaponService } from '../core/services/weapon';
import { Router } from '@angular/router';
import { ToastService } from '../core/services/toast';
import { DamageDiceType, DamageDiceLabel } from '../core/models/weapon';

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

  getDamageLabel(type: DamageDiceType | string | null | undefined): string {
    if (type === null || type === undefined || type === '') {
      return '';
    }

    const numericValue = typeof type === 'string'
      ? DamageDiceType[type as keyof typeof DamageDiceType]
      : type;

      if (numericValue !== undefined && numericValue in DamageDiceLabel) {
        return DamageDiceLabel[numericValue as DamageDiceType];
      }

      return '';
  }

  navigateToCreateWeapon(): void {
    this.router.navigate(['/characters', this.characterStore.character()?.id, 'create-weapon']);
  }

  deleteWeapon(weaponId: string): void {
    const character = this.characterStore.character();
    const weapon = this.characterStore.weapons().find((w) => w.id === weaponId);

    if (!character) {
      console.error('Character not loaded');
      return;
    }

    if (weapon) {
      if (confirm(`Are you sure you want to delete ${weapon?.name}?`)) {
        this.weaponService.deleteWeapon(character.id, weaponId).subscribe({
          next: (response) => {   
              this.toastService.show(`${weapon?.name} was successfully deleted`);
              this.characterStore.removeWeaponFromStore(weaponId); 
          },
          error: (err) => {
            this.toastService.show(`Error while deleting ${weapon.name}`, 'error');
          },
          complete: () => {},
        });
      } else {
        return;
      }
    }
  }

  toggleEquip(weaponId: string) {
    const character = this.characterStore.character();
    const weapon = this.characterStore.weapons().find((w) => w.id === weaponId);
    const equipOrUnequippedToString = weapon?.isEquipped ? 'unequipped' : 'equiped';

    if (!character) {
      console.log('Character not loaded');
      return;
    }

    this.weaponService.toggleEquip(character.id, weaponId).subscribe({
      next: (response) => {
        this.characterStore.toggleEquipWeapon(weaponId);
        this.toastService.show(`${weapon?.name} is now ${equipOrUnequippedToString}!`);
      },
      error: (err) => {
        console.error('Error while toogleEquip() the weapon', err);
        this.toastService.show(`Faile to operate toggleEquip on ${weapon?.name}`, 'error');
      },
      complete: () => {},
    });
  }
}
