import { Component, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { form, Field, required, min, submit } from '@angular/forms/signals';

import { ActivatedRoute, Router } from '@angular/router';
import { CharacterService } from '../core/services/character';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-character-edit',
  imports: [Field],
  templateUrl: './character-edit.html',
  styleUrl: './character-edit.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterEditComponent {
  private service = inject(CharacterService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  model = signal({
    name: '',
    class: '',
    hp: 1,
  });

  // Parentheses optionnal arond the f => or (f) =>
  characterForm = form(this.model, (f) => {
    required(f.name);
    required(f.class);
    required(f.hp);
  });

  async ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    const character = await firstValueFrom(this.service.getById(id));

    this.model.set({
      name: character.name,
      class: character.class,
      hp: character.hp,
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();

    submit(this.characterForm, async () => {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      await firstValueFrom(this.service.update(id, this.model()));
      this.router.navigate(['/characters']);
    });
  }
}
