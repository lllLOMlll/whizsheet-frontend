import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import {
  form,
  Field,
  required,
  min,
  submit,
} from '@angular/forms/signals';
import { Router } from '@angular/router';
import { CharacterService, CreateCharacterData } from '../core/services/character';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-character-create',
  imports: [Field],
  templateUrl: './character-create.html',
  styleUrl: './character-create.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterCreateComponent {
  private service = inject(CharacterService);
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
    'Roguer',
    'Sorcerer',
    'Warlock',
    'Wizard',
    'Other'

  ] as const;
  
  model = signal<CreateCharacterData & {customClass: string}>({
    name: '',
    class: '',
    customClass: '',
    hp: 1,
  });

  characterForm = form(this.model, (fieldPath) => {
    required(fieldPath.name, { message: 'Name is required' });
    required(fieldPath.class, { message: 'Class is required' });
    min(fieldPath.hp, 1, { message: 'HP must be at least 1' });
  });

  onSubmit(event: Event) {
    event.preventDefault();

    submit(this.characterForm, async () => {
      const data = this.model();

      const finalClass = data.class === 'Other' ? data.customClass.trim() : data.class;

      if (!finalClass) {
        return;
      }

      const payload: CreateCharacterData = {
        name: data.name,
        class: finalClass,
        hp: data.hp,
      }

      await firstValueFrom(this.service.create(payload));

      this.router.navigate(['/characters']);
    });
  }



}
