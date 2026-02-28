import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ValueDisplayCard } from '../shared/value-display-card/value-display-card';
import { CharacterStore } from '../core/stores/character-store';
import { SavingThrows } from '../core/services/saving-throws';
import { CharacterLayout } from "../layout/character-layout/character-layout";

@Component({
  selector: 'app-character-saving-throws',
  imports: [ValueDisplayCard, CharacterLayout],
  templateUrl: './character-saving-throws.html',
  styleUrl: './character-saving-throws.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterSavingThrowsComponent {
  readonly characterStore = inject(CharacterStore);


}
