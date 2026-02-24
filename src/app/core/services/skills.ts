import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
	Survival = 'Survival'
}

export interface Skill {
  skillType : SkillType,
  isProficient: boolean,
  modifier: number,
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
    return this.http.get<Skill[]>(`${this.baseURL}/${characterId}/skills`);
  }

  update (characterId: number, data: Skill[]) {
    return this.http.put<Skill[]>(`${this.baseURL}/${characterId}/skills`, data);
  }
}
