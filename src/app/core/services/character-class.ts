import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CreateCharacterData } from './character';

export interface CharacterClassData {
  id: number;
  className: string;
  customClassName: string;
  level: number;
}

export interface UpdateCharacterClassData {
  id: number;
  className: string;
  customClassName: string;
  level: number;
}

export interface CreateCharacterClassData {
  classType: CharacterClassType;
  customClassName?: string;
  level: number;
}

export enum CharacterClassType {
  Artificer = 'Artificer',
  Barbarian = 'Barbarian',
  Bard = 'Bard',
  BloodHunter = 'BloodHunter',
  Cleric = 'Cleric',
  Druid = 'Druid',
  Fighter = 'Fighter',
  Monk = 'Monk',
  Paladin = 'Paladin',
  Ranger = 'Ranger',
  Rogue = 'Rogue',
  Sorcerer = 'Sorcerer',
  Warlock = 'Warlock',
  Wizard = 'Wizard',
  Other = 'Other',
}

export const DND_CLASSES = [
  'Artificer',
  'Barbarian',
  'Bard',
  'BloodHunter',
  'Cleric',
  'Druid',
  'Fighter',
  'Monk',
  'Paladin',
  'Ranger',
  'Rogue',
  'Sorcerer',
  'Warlock',
  'Wizard',
  'Other',
] as const;

@Injectable({
  providedIn: 'root',
})
export class CharacterClassService {
  private http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiBaseUrl}/characters`;

  create(characterId: number, data: CreateCharacterClassData[]) {
    return this.http.post<CharacterClassData[]>(
      `${this.baseUrl}/${characterId}/classes`, data);
  }
}
