import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';

export enum SkillType {
  Acrobatics = 'Acrobatics',
  AnimalHandling = 'AnimalHandling',
  Arcana = 'Arcana',
  Athletics = 'Athletics',
  Deception = 'Deception',
  History = 'History',
  Insight = 'Insight',
  Intimidation = 'Intimidation',
  Investigation = 'Investigation',
  Medicine = 'Medicine',
  Nature = 'Nature',
  Perception = 'Perception',
  Performance = 'Performance',
  Persuasion = 'Persuasion',
  Religion = 'Religion',
  SleightOfHand = 'SleightOfHand',
  Stealth = 'Stealth',
  Survival = 'Survival',
}

export interface Skill {
  type: SkillType;
  isProficient: boolean;
  modifier: number;
}

export interface SkillsResponse {
  skills: Skill[];
}

@Injectable({
  providedIn: 'root',
})
export class SkillsService {
  private http = inject(HttpClient);

  private readonly baseURL = `${environment.apiBaseUrl}/characters`;

  // create(characterId: number, data: Skills) {
  //   return this.http.post<SkillsWithModifiers>(`${this.baseURL}/${characterId}/skills`, data);
  // }

  get(characterId: number) {
    // On extrait la propriété .skills du DTO reçu
    return this.http
      .get<SkillsResponse>(`${this.baseURL}/${characterId}/skills`)
      .pipe(map((res) => res.skills));
  }

  update(characterId: number, data: Skill[]) {
    // Note: Si ton update attend aussi l'objet enveloppé { skills: [...] },
    // il faudra adapter l'envoi ici.
    return this.http.put<Skill[]>(`${this.baseURL}/${characterId}/skills`, data);
  }
}
