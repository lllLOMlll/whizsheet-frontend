import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CharacterStore } from '../core/stores/character-store';
import { CommonModule } from '@angular/common';
import { CharacterService } from '../core/services/character';
import { CharacterLayout } from '../layout/character-layout/character-layout';
import { AbilityScoreCard } from "../shared/ability-score-card/ability-score-card";
import { AbilityScores } from '../core/services/ability-scores';


@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [CommonModule, CharacterLayout],
  templateUrl: './character-detail.html',
  styleUrl: './character-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterDetailComponent implements OnInit {
  // On injecte le store
  readonly characterStore = inject(CharacterStore);
  readonly characterService = inject(CharacterService);
  private route = inject(ActivatedRoute);

  isModalOpen = signal(false);
  selectedStat = signal<keyof AbilityScores | null>(null);

  ngOnInit() {
    // On récupère l'ID et on demande au store de charger les données
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!isNaN(id)) {
      this.characterStore.loadCharacterData(id);
    }
  }

  openModal(statName: string) {
    this.selectedStat.set(statName as keyof AbilityScores);
    this.isModalOpen.set(true);
  }
  
}
