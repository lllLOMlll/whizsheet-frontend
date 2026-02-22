import { Component, inject } from '@angular/core';
import { CharacterLayout } from "../layout/character-layout/character-layout";
import { CharacterStore } from '../core/stores/character-store';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-character-skills',
  imports: [CharacterLayout],
  templateUrl: './character-skills.html',
  styleUrl: './character-skills.css',
})
export class CharacterSkillsComponent {
  readonly characterStore = inject(CharacterStore);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!isNaN(id)) {
      this.characterStore.loadCharacterData(id);
    }
  }
}
