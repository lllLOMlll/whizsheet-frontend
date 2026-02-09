import { 
  Component, 
  signal, 
  ChangeDetectionStrategy, 
  inject, EnvironmentInjector } from '@angular/core';

import { form, Field, required, min, submit } from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';

import { CharacterService, UpdateCharacterData } from '../core/services/character';
import { AbilityScoresService, UpdateAbilityScoresData } from '../core/services/ability-scores';

import { AbilityScoresFormComponent } from '../shared/ability-scores-form/ability-scores-form';

import { firstValueFrom } from 'rxjs';



@Component({
  selector: 'app-character-edit',
  imports: [Field, AbilityScoresFormComponent],
  templateUrl: './character-edit.html',
  styleUrl: './character-edit.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterEditComponent {
  private characterService = inject(CharacterService);
  private abilityScoresService = inject(AbilityScoresService);
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  //private 


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
