import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { form, Field, required, min, submit } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { CharacterService, CreateCharacterData } from '../core/services/character';
import { AbilityScoresService, AbilityScores } from '../core/services/ability-scores';
import { firstValueFrom } from 'rxjs';
import { AbilityScoresFormComponent } from '../shared/ability-scores-form/ability-scores-form';

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
  private router = inject(Router);

  readonly dndClasses = [
    'Barbarian',
    'Bard',
    'Cleric',
    'Druid',
    'Fighter',
    'Monk',
    'Paladin',
    'Ranger',
    'Rogue',
    'Sorcerer',
    'Warlock',
    'Wizard',
    'Other',
  ] as const;

  characterModel = signal<CreateCharacterData & { customClass: string }>({
    // Character
    name: '',
    class: '',
    customClass: '',
    hp: 1,
  });

  abilityScoresModel = signal<AbilityScores>({
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10,
  });

  characterForm = form(this.characterModel, (fieldPath) => {
    required(fieldPath.name, { message: 'Name is required' });
    required(fieldPath.class, { message: 'Class is required' });
    min(fieldPath.hp, 1, { message: 'HP must be at least 1' });
  });

  abilityScoresForm = form(this.abilityScoresModel, (fieldPath) => {
    min(fieldPath.strength, 1);
    min(fieldPath.dexterity, 1);
    min(fieldPath.constitution, 1);
    min(fieldPath.intelligence, 1);
    min(fieldPath.wisdom, 1);
    min(fieldPath.charisma, 1);
  });

  async ngOnInit() {
    const characters = await firstValueFrom(this.characterService.getAll());

    if (characters.length >= 2) {
      this.router.navigate(['/characters']);
    }
  }

  onSubmit(event: Event) {
    event.preventDefault();

    submit(this.characterForm, async () => {
      const data = this.characterModel();

      const finalClass = data.class === 'Other' ? data.customClass.trim() : data.class;

      if (!finalClass) {
        return;
      }

      const characterPayload: CreateCharacterData = {
        name: data.name,
        class: finalClass,
        hp: data.hp,
      };

      try {
        // Create character
        const character = await firstValueFrom(this.characterService.create(characterPayload));

        // Create ability scores
        await firstValueFrom(
          this.abilityScoresService.create(character.id, this.abilityScoresModel()),
        );

        this.router.navigate(['/characters']);
      } catch (err: any) {
        if (err?.error?.error === 'CHARACTER_LIMIT_REACHED') {
          alert('You cannot create more than 2 characters.');
          this.router.navigate(['/characters']);
          return;
        }

        throw err;
      }
    });
  }
}
