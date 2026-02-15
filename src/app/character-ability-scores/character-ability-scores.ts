import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CharacterStore } from '../core/stores/character-store';
import { ActivatedRoute } from '@angular/router';
import { CharacterLayout } from '../layout/character-layout/character-layout';
import { AbilityScoreCard } from '../shared/ability-score-card/ability-score-card';
import { AbilityScores } from '../core/services/ability-scores';
import { AbilityScoresModal } from '../shared/ability-scores-modal/ability-scores-modal';

@Component({
  selector: 'app-character-ability-scores',
  imports: [CharacterLayout, AbilityScoreCard, AbilityScoresModal],
  templateUrl: './character-ability-scores.html',
  styleUrl: './character-ability-scores.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterAbilityScores {
  readonly characterStore = inject(CharacterStore);
  private route = inject(ActivatedRoute);

  isModalOpen = signal(false);
  selectedStat = signal<keyof AbilityScores | null>(null);


  ngOnInit() {
    // Dois-je vraiment charger cela à chaque clic
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!isNaN(id)) {
      this.characterStore.loadCharacterData(id);
    }
  }

  openModal(statName: string) {
    this.selectedStat.set(statName as keyof AbilityScores);
    this.isModalOpen.set(true);
  }

  updateStat(newValue: number) {
    const stat = this.selectedStat();
    const currentAbilities = this.characterStore.abilities();

    if (stat && currentAbilities) {
      const updateScores: AbilityScores = {
        ...currentAbilities,
        [stat]: newValue
      };

      this.characterStore.updateAbilities(updateScores);
      this.isModalOpen.set(false);
    }
  }

}
