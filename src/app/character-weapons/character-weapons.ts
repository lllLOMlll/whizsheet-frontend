import { Component, inject } from '@angular/core';
import { CharacterLayout } from '../layout/character-layout/character-layout';
import { CharacterStore } from '../core/stores/character-store';
import { WeaponService } from '../core/services/weapon';

@Component({
  selector: 'app-character-weapons',
  imports: [CharacterLayout],
  templateUrl: './character-weapons.html',
  styleUrl: './character-weapons.css',
})
export class CharacterWeaponsComponent {
  readonly characterStore = inject(CharacterStore);
  readonly weaponService = inject(WeaponService);
}
