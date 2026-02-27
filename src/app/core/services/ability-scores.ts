import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Skill } from './skills';
import { SavingThrows } from './saving-throws';


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
  charismaModifier: number;
}

export interface UpdateAbilityScoresData {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface AbilityUpdateResponseDto {
  abilities: AbilityScores;
  skills: Skill[];
  savingThrows: SavingThrows;
}

@Injectable({
  providedIn: 'root',
})
export class AbilityScoresService {
  private http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiBaseUrl}/characters`;

  create(characterId: number, data: UpdateAbilityScoresData) {
    return this.http.post<AbilityScores>(`${this.baseUrl}/${characterId}/ability-scores`, data);
  }

  get(characterId: number) {
    return this.http.get<AbilityUpdateResponseDto>(`${this.baseUrl}/${characterId}/ability-scores`);
  }

  update(characterId: number, data: UpdateAbilityScoresData): Observable<AbilityUpdateResponseDto> {
    return this.http.put<AbilityUpdateResponseDto>(`${this.baseUrl}/${characterId}/ability-scores`, data);
  }
}
