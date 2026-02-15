import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CharacterStore } from '../core/stores/character-store';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-character-ability-scores',
  imports: [],
  templateUrl: './character-ability-scores.html',
  styleUrl: './character-ability-scores.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterAbilityScores {
  readonly characterStore = inject(CharacterStore);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    // Dois-je vraiment charger cela à chaque clic
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!isNaN(id)) {
      this.characterStore.loadCharacterData(id);
    }
  }
  
}
