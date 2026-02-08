import {
  Component,
  signal,
  ChangeDetectionStrategy,
  inject,
  EnvironmentInjector,
  runInInjectionContext,
  computed,
} from '@angular/core';
import { form, Field, required, min, max, submit } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { CharacterService, CreateCharacterData } from '../core/services/character';
import { AbilityScoresService, AbilityScores } from '../core/services/ability-scores';
import {
  CharacterClassService,
  CreateCharacterClassData,
  CharacterClassType,
  DND_CLASSES,
} from '../core/services/character-class';

import { AbilityScoresFormComponent } from '../shared/ability-scores-form/ability-scores-form';

type CharacterClassFormModel = {
  classType: CharacterClassType;
  customClassName: string;
  level: number;
};

@Component({
  selector: 'app-character-create',
  imports: [Field, AbilityScoresFormComponent],
  templateUrl: './character-create.html',
  styleUrl: './character-create.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterCreateComponent {
  private characterService = inject(CharacterService);
  private abilityScoresService = inject(AbilityScoresService);
  private characterClassService = inject(CharacterClassService);
  private router = inject(Router);
  private injector = inject(EnvironmentInjector);

  readonly dndClasses = DND_CLASSES;
  readonly CharacterClassType = CharacterClassType;

  /* ------------------ CHARACTER ------------------ */

  characterModel = signal<CreateCharacterData>({
    name: '',
    hp: 1,
  });

  characterForm = form(this.characterModel, (f) => {
    required(f.name);
    min(f.hp, 1);
  });

  /* ------------------ ABILITIES ------------------ */

  abilityScoresModel = signal<AbilityScores>({
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
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

  private createDefaultClass(): CharacterClassFormModel {
    return {
      classType: CharacterClassType.Artificer,
      customClassName: '',
      level: 1,
    };
  }

  characterClassForms = signal<ReturnType<typeof this.createCharacterClassForm>[]>([
    this.createCharacterClassForm(this.createDefaultClass()),
  ]);

  createCharacterClassForm(model: CharacterClassFormModel) {
    return runInInjectionContext(this.injector, () => {
      const modelSignal = signal(model);

      return form(modelSignal, (input) => {
        required(input.classType);

        required(input.customClassName, {
          when: () => modelSignal().classType === CharacterClassType.Other,
        });

        min(input.level, 1);
        max(input.level, 20);
      });
    });
  }

  addClass() {
    if (this.characterClassForms().length >= 3) return;

    this.characterClassForms.update((list) => [
      ...list,
      this.createCharacterClassForm(this.createDefaultClass()),
    ]);
  }

  removeClass() {
    if (this.characterClassForms().length <= 1) return;
    this.characterClassForms.update((list) => list.slice(0, -1));
  }

  totalClassLevel = computed(() =>
    this.characterClassForms().reduce((sum, f) => {
      return sum + f().value().level;
    }, 0),
  );

  isTotalLevelValid = computed(() => this.totalClassLevel() <= 100);
  /* ------------------ SUBMIT ------------------ */

  onSubmit(event: Event) {
    event.preventDefault();

    submit(this.characterForm, async () => {
      const character = await firstValueFrom(this.characterService.create(this.characterModel()));

      await firstValueFrom(
        this.abilityScoresService.create(character.id, this.abilityScoresModel()),
      );

      const classesPayload: CreateCharacterClassData[] = this.characterClassForms().map((f) => {
        const value = f().value();
        return {
          classType: value.classType,
          level: value.level,
          customClassName:
            value.classType === CharacterClassType.Other ? value.customClassName.trim() : undefined,
        };
      });

      await firstValueFrom(this.characterClassService.create(character.id, classesPayload));

      this.router.navigate(['/characters']);
    });
  }
}
