import { Component, inject } from '@angular/core';
import { CharacterStore } from '../../core/stores/character-store';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-character-layout',
  imports: [],
  templateUrl: './character-layout.html',
  styleUrl: './character-layout.css',
})
export class CharacterLayout {
  readonly characterStore = inject(CharacterStore);
  private route = inject(ActivatedRoute);

  // The parent component is loading the character.
  // I dont need to put route and loadCharacterData in each and every component
  constructor(){
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (!isNaN(id)) {
        this.characterStore.loadCharacterData(id);
      }
    })
  }

}
