import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface AbilityScores {
  strength: number;
  strengthModifier: number;
  dexterity: number;
  dexterityModifier: number;
  constitution: number;
  constitutionModifier: number;
  intelligence: number;
  intelligenceModifier: number;
  wisdom: number;
  wisdomModifier: number;
  charisma: number;
  charimaModifier: number;
}

export interface UpdateAbilityScoresData {
  strength: number;
  strengthModifier: number;
  dexterity: number;
  dexterityModifier: number;
  constitution: number;
  constitutionModifier: number;
  intelligence: number;
  intelligenceModifier: number
  wisdom: number;
  wisdomModifier: number;
  charisma: number;
  charismaModifier: number;
}

@Injectable({
  providedIn: 'root',
})
export class AbilityScoresService {
  private http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiBaseUrl}/characters`;

  create(characterId: number, data: AbilityScores) {
    return this.http.post<AbilityScores>(`${this.baseUrl}/${characterId}/ability-scores`, data);
  }

  get(characterId: number) {
    return this.http.get<AbilityScores>(`${this.baseUrl}/${characterId}/ability-scores`);
  }

  update(characterId: number, data: AbilityScores)
  {
    return this.http.put<AbilityScores>(`${this.baseUrl}/${characterId}/ability-scores`, data);
  }
}
