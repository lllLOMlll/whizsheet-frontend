import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CreateCharacterData } from './character';


export type CharacterClassModel = {
  id?: number;
  classType: CharacterClassType;
  customClassName: string;
  level: number;
};


// export interface CharacterClassData {
//   id: number;
//   className: string;
//   customClassName: string;
//   level: number;
// }

// ... (gardez les imports et CharacterClassModel tel quel)

export interface CharacterClassData {
  id: number;
  classType: CharacterClassType; // Correction : était className
  customClassName: string | null; // Correction : accepter null depuis l'API
  level: number;
  displayName?: string; // Ajouté pour correspondre au JSON de l'API
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

// export const DND_CLASSES = [
//   'Artificer',
//   'Barbarian',
//   'Bard',
//   'BloodHunter',
//   'Cleric',
//   'Druid',
//   'Fighter',
//   'Monk',
//   'Paladin',
//   'Ranger',
//   'Rogue',
//   'Sorcerer',
//   'Warlock',
//   'Wizard',
//   'Other',
// ] as const;

export const DND_CLASSES = Object.values(CharacterClassType)

@Injectable({
  providedIn: 'root',
})
export class CharacterClassService {
  private http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiBaseUrl}/characters`;

  create(characterId: number, data: CreateCharacterClassData[]) {
    return this.http.post<CharacterClassData[]>(
      `${this.baseUrl}/${characterId}/classes`, data
    );
  }

  get(characterId: number) {
    return this.http.get<CharacterClassData[]>(
      `${this.baseUrl}/${characterId}/classes`
    );
  }

  update(characterId: number, data: CreateCharacterClassData[])
  {
    return this.http.put<CharacterClassData[]>(
      `${this.baseUrl}/${characterId}/classes`, data
    );
  }
}
