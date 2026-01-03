import { Component, inject, signal } from '@angular/core';
import { CharacterService, Character  } from '../core/services/character';

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

}
