import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EnvironmentInjector,
  inject,
  runInInjectionContext,
  signal,
} from '@angular/core';

import { Field, form, max, min, required, submit } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';

import { CharacterService, UpdateCharacterData } from '../core/services/character';
import { AbilityScoresService, UpdateAbilityScoresData } from '../core/services/ability-scores';
import {
  CharacterClassService,
  CreateCharacterClassData,
  CharacterClassType,
  DND_CLASSES,
  UpdateCharacterClassData,
} from '../core/services/character-class';

import { AbilityScoresFormComponent } from '../shared/ability-scores-form/ability-scores-form';
import { CharacterClassFormComponent } from '../shared/character-class-form/character-class-form';

import { firstValueFrom } from 'rxjs';

type CharacterClassFormModel = {
  classType: CharacterClassType;
  customClassName: string;
  level: number;
};

@Component({
  selector: 'app-character-edit',
  imports: [AbilityScoresFormComponent, CharacterClassFormComponent, Field  ],
  templateUrl: './character-edit.html',
  styleUrl: './character-edit.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterEditComponent {
  private characterService = inject(CharacterService);
  private abilityScoresService = inject(AbilityScoresService);
  private characterClassService = inject(CharacterClassService);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private injector = inject(EnvironmentInjector);

  // *** MODELS **********************
  characterModel = signal<UpdateCharacterData>({
    name: '',
    hp: 1,
  });

  abilityScoresModel = signal<UpdateAbilityScoresData>({
    strength: 1,
    dexterity: 1,
    constitution: 1,
    intelligence: 1,
    wisdom: 1,
    charisma: 1,
  });

  characterClassModel = signal<UpdateCharacterClassData[]>([
    {
      id: 0,
      className: '',
      customClassName: '',
      level: 1,
    },
  ]);

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

  isDuplicateClass = computed(() => {
    let classesArray: CharacterClassType[] = [];

    this.characterClassForms().forEach((form) => {
      if (form().value().classType != CharacterClassType.Other) {
        classesArray.push(form().value().classType);
      }
    });

    return new Set(classesArray).size !== classesArray.length;
  });

  isDuplicatedCustomClass = computed(() => {
    let customClassArray: string[] = [];

    this.characterClassForms().forEach((form) => {
      if (form().value().classType === CharacterClassType.Other) {
        customClassArray.push(form().value().customClassName);
      }
    });

    return new Set(customClassArray).size !== customClassArray.length;
  });

  // *** FORMS ******************************
  // Parentheses optionnal arond the f => or (f) =>
  characterForm = form(this.characterModel, (f) => {
    required(f.name);
    required(f.hp);
  });

  abilityScoresForm = form(this.abilityScoresModel, (f) => {
    min(f.strength, 1);
    min(f.dexterity, 1);
    min(f.constitution, 1);
    min(f.intelligence, 1);
    min(f.wisdom, 1);
    min(f.charisma, 1);
  });

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    // *** CHARACTER **************
    const character = await firstValueFrom(this.characterService.getById(id));

    this.characterModel.set({
      name: character.name,
      hp: character.hp,
    });

    // *** ABILITY SCORES ********
    const abilityScores = await firstValueFrom(this.abilityScoresService.get(id));

    this.abilityScoresModel.set({
      strength: abilityScores.strength,
      dexterity: abilityScores.dexterity,
      constitution: abilityScores.constitution,
      intelligence: abilityScores.intelligence,
      wisdom: abilityScores.wisdom,
      charisma: abilityScores.charisma,
    });

    // *** CLASSES AND LEVELS
    const characterClasses = await firstValueFrom(this.characterClassService.get(id));

    // 2. On transforme le tableau brut en tableau de formulaires
    const updatedForms = characterClasses.map((item) => {
      // On prépare l'objet pour le formulaire
      const model: CharacterClassFormModel = {
        // On fait correspondre className (API) vers classType (Formulaire)
        classType: item.className as CharacterClassType,
        customClassName: item.customClassName || '',
        level: item.level,
      };

      // On crée le formulaire pour cet élément précis
      return this.createCharacterClassForm(model);
    });

    // 3. On met à jour le signal global d'un seul coup
    this.characterClassForms.set(updatedForms);
  }

  onSubmit(event: Event) {
    event.preventDefault();

    submit(this.characterForm, async () => {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      await firstValueFrom(this.characterService.update(id, this.characterModel()));
      this.router.navigate(['/characters']);
    });
  }
}
