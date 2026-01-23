import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CharacterService, Character } from '../core/services/character';


@Component({
  selector: 'app-character-detail',
  imports: [],
  templateUrl: './character-detail.html',
  styleUrl: './character-detail.css',
})
export class CharacterDetailComponent {
  private route = inject(ActivatedRoute);
  private characterService = inject(CharacterService);

  character = signal<Character | null>(null);
  isLoading = signal(true);

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (Number.isNaN(id)) {
      this.isLoading.set(false);
      return;
    }

  this.characterService.getById(id).subscribe({
      next: character => {
        this.character.set(character);
        this.isLoading.set(false);
      },
      error: () => {
        this.character.set(null);
        this.isLoading.set(false);
      },
    });

  }
}
