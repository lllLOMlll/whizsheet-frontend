import {
  Component,
  ChangeDetectionStrategy,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { Field, form, min, required, submit } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';

import { CharacterService, CreateCharacterData } from '../core/services/character';
import { AbilityScoresService, AbilityScores } from '../core/services/ability-scores';
import {
  CharacterClassModel,
  CharacterClassService,
  CreateCharacterClassData,
  CharacterClassType,
} from '../core/services/character-class';

import { AbilityScoresFormComponent } from '../shared/ability-scores-form/ability-scores-form';
import { CharacterClassItemComponent } from '../shared/character-class-item/character-class-item';

@Component({
  selector: 'app-character-create',
  standalone: true,
  imports: [
    Field,
    AbilityScoresFormComponent,
    CharacterClassItemComponent,
  ],
  templateUrl: './character-create.html',
  styleUrl: './character-create.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterCreateComponent {
  private router = inject(Router);
  private characterService = inject(CharacterService);
  private abilityScoresService = inject(AbilityScoresService);
  private characterClassService = inject(CharacterClassService);

  /* ------------------ CHARACTER ------------------ */

  characterModel = signal<CreateCharacterData>({
    name: '',
    hp: 1,
  });

  characterForm = form(this.characterModel, f => {
    required(f.name);
    min(f.hp, 1);
  });

  /* ------------------ ABILITY SCORES ------------------ */

  abilityScoresModel = signal<AbilityScores>({
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  });

  abilityScoresForm = form(this.abilityScoresModel, f => {
    min(f.strength, 1);
    min(f.dexterity, 1);
    min(f.constitution, 1);
    min(f.intelligence, 1);
    min(f.wisdom, 1);
    min(f.charisma, 1);
  });

  /* ------------------ CLASSES (DOMAIN STATE) ------------------ */

  characterClasses = signal<CharacterClassModel[]>([
    {
      classType: CharacterClassType.Artificer,
      customClassName: '',
      level: 1,
    },
  ]);

  addClass() {
    if (this.characterClasses().length >= 3) return;

    this.characterClasses.update(list => [
      ...list,
      {
        classType: CharacterClassType.Artificer,
        customClassName: '',
        level: 1,
      },
    ]);
  }

  updateClass(index: number, updated: CharacterClassModel) {
    this.characterClasses.update(list => {
      const copy = [...list];
      copy[index] = updated;
      return copy;
    });
  }

  removeClass(index: number) {
    this.characterClasses.update(list =>
      list.filter((_, i) => i !== index),
    );
  }

  /* ------------------ VALIDATIONS ------------------ */

  totalClassLevel = computed(() =>
    this.characterClasses().reduce((sum, c) => sum + c.level, 0),
  );

  isTotalLevelValid = computed(() => this.totalClassLevel() <= 100);

  isDuplicateClass = computed(() => {
    const classes = this.characterClasses()
      .filter(c => c.classType !== CharacterClassType.Other)
      .map(c => c.classType);

    return new Set(classes).size !== classes.length;
  });

  isDuplicatedCustomClass = computed(() => {
    const customs = this.characterClasses()
      .filter(c => c.classType === CharacterClassType.Other)
      .map(c => c.customClassName.trim())
      .filter(Boolean);

    return new Set(customs).size !== customs.length;
  });

  /* ------------------ INIT --------------------- */
  ngOnInit() {
    this.characterService.activeCharacterId.set(null);
    this.characterService.activeCharacter.set(null);
  }

  /* ------------------ SUBMIT ------------------ */

  onSubmit(event: Event) {
    event.preventDefault();

    submit(this.characterForm, async () => {
      const character = await firstValueFrom(
        this.characterService.create(this.characterModel()),
      );

      await firstValueFrom(
        this.abilityScoresService.create(
          character.id,
          this.abilityScoresModel(),
        ),
      );

      const classesPayload: CreateCharacterClassData[] =
        this.characterClasses().map(c => ({
          classType: c.classType,
          level: c.level,
          customClassName:
            c.classType === CharacterClassType.Other
              ? c.customClassName.trim()
              : undefined,
        }));

      await firstValueFrom(
        this.characterClassService.create(
          character.id,
          classesPayload,
        ),
      );

      this.router.navigate(['/characters']);
    });
  }
}
