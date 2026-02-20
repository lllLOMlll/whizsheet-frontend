import { Component, ChangeDetectionStrategy, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Field, form, min, required, submit } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';

import { CharacterService, UpdateCharacterData } from '../core/services/character';
import { AbilityScoresService, UpdateAbilityScoresData } from '../core/services/ability-scores';
import {
  CharacterClassModel,
  CharacterClassService,
  CharacterClassType,
  CreateCharacterClassData,
} from '../core/services/character-class';
import { HitPointsService, HitPointsData } from '../core/services/hit-points';

import { AbilityScoresFormComponent } from '../shared/ability-scores-form/ability-scores-form';
import { CharacterClassItemComponent } from '../shared/character-class-item/character-class-item';

@Component({
  selector: 'app-character-edit',
  standalone: true,
  imports: [Field, AbilityScoresFormComponent, CharacterClassItemComponent],
  templateUrl: './character-edit.html',
  styleUrl: './character-edit.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterEditComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private characterService = inject(CharacterService);
  private abilityScoresService = inject(AbilityScoresService);
  private characterClassService = inject(CharacterClassService);
  private hitPointsService = inject(HitPointsService);

  /* ------------------ CHARACTER ------------------ */

  characterModel = signal<UpdateCharacterData>({
    name: '',
  });

  characterForm = form(this.characterModel, (f) => {
    required(f.name);
  });

  /* ------------------      HP         ------------------ */
  hitPointsModelSignal = signal<HitPointsData>({
    totalHitPoints: 1,
    currentHitPoints: 1,
    temporaryHitPoints: 1
  });
  
  hitPointsForm = form(this.hitPointsModelSignal, (f) => {
    required(f.totalHitPoints),
    min(f.totalHitPoints, 1),
    required(f.currentHitPoints),
    min(f.currentHitPoints, 1),
    min(f.totalHitPoints, 1)
  })

  /* ------------------ ABILITY SCORES ------------------ */

  abilityScoresModel = signal<UpdateAbilityScoresData>({
    strength: 1,
    dexterity: 1,
    constitution: 1,
    intelligence: 1,
    wisdom: 1,
    charisma: 1,
  });

  abilityScoresForm = form(this.abilityScoresModel, (f) => {
    min(f.strength, 1);
    min(f.dexterity, 1);
    min(f.constitution, 1);
    min(f.intelligence, 1);
    min(f.wisdom, 1);
    min(f.charisma, 1);
  });

  /* ------------------ CLASSES ------------------ */

  characterClasses = signal<CharacterClassModel[]>([]);

  addClass() {
    if (this.characterClasses().length >= 3) return;

    this.characterClasses.update((list) => [
      ...list,
      {
        classType: CharacterClassType.Artificer,
        customClassName: '',
        level: 1,
      },
    ]);
  }

  updateClass(index: number, updated: CharacterClassModel) {
    this.characterClasses.update((list) => {
      const copy = [...list];
      copy[index] = updated;
      return copy;
    });
  }

  removeClass(index: number) {
    this.characterClasses.update((list) => list.filter((_, i) => i !== index));
  }

  /* ------------------ VALIDATIONS ------------------ */

  totalClassLevel = computed(() => this.characterClasses().reduce((sum, c) => sum + c.level, 0));

  isTotalLevelValid = computed(() => this.totalClassLevel() <= 100);

  isDuplicateClass = computed(() => {
    const classes = this.characterClasses()
      .filter((c) => c.classType !== CharacterClassType.Other)
      .map((c) => c.classType);

    return new Set(classes).size !== classes.length;
  });

  isDuplicatedCustomClass = computed(() => {
    const customs = this.characterClasses()
      .filter((c) => c.classType === CharacterClassType.Other)
      .map((c) => c.customClassName.trim())
      .filter(Boolean);

    return new Set(customs).size !== customs.length;
  });

  /* ------------------ INIT ------------------ */

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    const character = await firstValueFrom(this.characterService.getById(id));

    this.characterModel.set({
      name: character.name,
    });

    const abilityScores = await firstValueFrom(this.abilityScoresService.get(id));

    this.abilityScoresModel.set({
      strength: abilityScores.strength,
      dexterity: abilityScores.dexterity,
      constitution: abilityScores.constitution,
      intelligence: abilityScores.intelligence,
      wisdom: abilityScores.wisdom,
      charisma: abilityScores.charisma,
    });

    // ... dans ngOnInit()
    const classes = await firstValueFrom(this.characterClassService.get(id));

    this.characterClasses.set(
      classes.map((c) => ({
        id: c.id,
        // On utilise classType car c'est ce que l'API renvoie réellement
        classType: c.classType,
        customClassName: c.customClassName ?? '', // Gère le null du JSON
        level: c.level,
      })),
    );
  }

  /* ------------------ SUBMIT ------------------ */

  onSubmit(event: Event) {
    event.preventDefault();

    submit(this.characterForm, async () => {
      const id = Number(this.route.snapshot.paramMap.get('id'));

      await firstValueFrom(this.characterService.update(id, this.characterModel()));

      await firstValueFrom(this.abilityScoresService.update(id, this.abilityScoresModel()));
      
      const payload: CreateCharacterClassData[] = this.characterClasses().map((c) => ({
        classType: c.classType,
        level: c.level,
        customClassName:
          c.classType === CharacterClassType.Other ? c.customClassName.trim() : undefined,
      }));

      await firstValueFrom(this.characterClassService.update(id, payload));

      this.router.navigate(['/characters']);
    });
  }
}
