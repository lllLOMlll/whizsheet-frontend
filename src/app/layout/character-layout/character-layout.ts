import { Component, inject } from '@angular/core';
import { CharacterStore } from '../../core/stores/character-store';

@Component({
  selector: 'app-character-layout',
  imports: [],
  templateUrl: './character-layout.html',
  styleUrl: './character-layout.css',
})
export class CharacterLayout {
  readonly characterStore = inject(CharacterStore);
}
