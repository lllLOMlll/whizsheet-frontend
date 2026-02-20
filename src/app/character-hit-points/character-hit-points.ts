import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal,
  computed,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CharacterStore } from '../core/stores/character-store';
import { CommonModule } from '@angular/common';
import { CharacterService } from '../core/services/character';
import { CharacterLayout } from '../layout/character-layout/character-layout';
import { ValueDisplayCard } from '../shared/value-display-card/value-display-card';
import { HitPointsData, HitPointsCategoryToString } from '../core/services/hit-points';
import { ValueEditModal } from '../shared/value-edit-modal/value-edit-modal';

@Component({
  selector: 'app-character-hit-points',
  imports: [CommonModule, ValueDisplayCard, ValueEditModal],
  templateUrl: './character-hit-points.html',
  styleUrl: './character-hit-points.css',
})
export class CharacterHitPointsComponent {
  readonly characterStore = inject(CharacterStore);
  readonly characterService = inject(CharacterService);
  private route = inject(ActivatedRoute);

  isModalOpen = signal(false);
  title = signal(HitPointsCategoryToString);
  selectedHp = signal<keyof HitPointsData | null>(null);
  readonly selectedHPToString = computed(() => {
    const key = this.selectedHp();
    return key ? HitPointsCategoryToString[key] : '';
  });

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!isNaN(id)) {
      this.characterStore.loadCharacterData(id);
    }
  }

  openModal(sortOfHp: string) {
    this.selectedHp.set(sortOfHp as keyof HitPointsData);
    this.isModalOpen.set(true);
  }

  updateHp(newValue: number) {
    const hpCatoryToModify = this.selectedHp();
    const currentHpModel = this.characterStore.hitPoints();

    if (hpCatoryToModify && currentHpModel) {
      const updatedHp: HitPointsData = {
        ...currentHpModel,
        [hpCatoryToModify]: newValue
      };

      this.characterStore.updateHp(updatedHp);
      this.isModalOpen.set(false);
    }

  }
}
