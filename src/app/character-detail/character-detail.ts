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
import { HitPointsData, HitPointsCategoryToString } from '../core/services/hit-points';
import { CharacterHitPointsComponent } from "../character-hit-points/character-hit-points";

@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [CommonModule, CharacterHitPointsComponent],
  templateUrl: './character-detail.html',
  styleUrl: './character-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterDetailComponent implements OnInit {

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
