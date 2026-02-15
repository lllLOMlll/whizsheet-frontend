import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { CharacterService, Character } from '../core/services/character';
import { CharacterStore } from '../core/stores/character-store';

@Component({
  selector: 'app-character-list',
  imports: [],
  templateUrl: './character-list.html',
  styleUrl: './character-list.css',
})
export class CharacterListComponent {
  private characterService = inject(CharacterService);
  private router = inject(Router);
  readonly characterStore = inject(CharacterStore);

  
  characters = signal<Character[]>([]);
  isCharactersListEmpty = computed(() => this.characters().length === 0);
  maxCharactersReached = computed(()=> this.characters().length >= 5);

  ngOnInit() {
  this.resetHero();

    this.characterService.getAll().subscribe((data) => this.characters.set(data));

  }
  
  viewCharacter(id: number){
    this.router.navigate(["/characters", id])
  }

  editCharacter(id: number) {
    this.router.navigate(['/characters', id, 'edit']);
  }

  goToCreateCharacterPage() {
    this.router.navigate(["/characters/create"])
  }

  resetHero() {
    this.characterStore.clear();
  }



  async deleteCharacter(id: number) {
    const characterToDelete = this.characters().find((c) => c.id === id);
    const characterName = characterToDelete ? characterToDelete.name : 'this character';

    // Dont user the native web browser confirm
    // Native confirm blocks the principal thread
    if (!confirm(`Are you sure you want to delete ${characterName}`)) {
      return;
    }
    await firstValueFrom(this.characterService.delete(id));

    // Local update (the page dont recharge)
    // On ne fait pas this.loadCharacters();
    this.characters.update((list) => list.filter((c) => c.id !== id));

    if (this.isCharactersListEmpty()) {
      this.router.navigate(['/auth-redirect']);
    }
  }


}
