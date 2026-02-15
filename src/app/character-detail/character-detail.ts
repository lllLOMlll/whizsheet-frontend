import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CharacterStore } from '../core/stores/character-store';
import { CommonModule } from '@angular/common';
import { CharacterService } from '../core/services/character';

@Component({
  selector: 'app-character-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './character-detail.html',
  styleUrl: './character-detail.css',
})
export class CharacterDetailComponent implements OnInit {
  // On injecte le store
  readonly store = inject(CharacterStore);
  readonly characterService = inject(CharacterService);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    // On récupère l'ID et on demande au store de charger les données
    const id = Number(this.route.snapshot.paramMap.get('id'));

 
    if (!isNaN(id)) {
      this.store.loadCharacterData(id);
    }
  }
}