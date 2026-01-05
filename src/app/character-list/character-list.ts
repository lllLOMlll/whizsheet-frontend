import { Component, inject, signal } from '@angular/core';
import { CharacterService, Character  } from '../core/services/character';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-character-list',
  imports: [],
  templateUrl: './character-list.html',
  styleUrl: './character-list.css',
})
export class CharacterListComponent {
  private service = inject(CharacterService);

  characters = signal<Character[]>([]);

  ngOnInit() {
    this.service.getAll().subscribe(data => this.characters.set(data));
  }

  async deleteCharacter(id: number) {
    const characterToDelete = this.characters().find(c => c.id === id);
    const characterName = characterToDelete ? characterToDelete.name : 'this character';

    // Dont user the native web browser confirm
    // Native confirm blocks the principal thread 
    if (!confirm(`Are you sure you want to delete ${characterName}`)) {
      return;
    }
    await firstValueFrom(this.service.delete(id));

    // Local update (the page dont recharge)
    // On ne fait pas this.loadCharacters();
    this.characters.update(list =>
      list.filter(c => c.id !== id)
    );
  }

}
