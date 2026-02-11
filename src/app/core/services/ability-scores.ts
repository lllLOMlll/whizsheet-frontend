import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface UpdateAbilityScoresData {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
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
