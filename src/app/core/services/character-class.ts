import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CreateCharacterData } from './character';


export interface CharacterClassData {
  id: number;
  className: string;
  customClassName: string;
  level: number
}

export interface UpdateCharacterClassData  {
  id: number;
  className: string;
  customClassName: string;
  level: number
}

export interface CreateCharacterClassData {
  className: string;
  customClassName: string;
  level: number
}

  export const DND_CLASSES = [
		"Artificer",
		"Barbarian",
		"Bard",
		"BloodHunter",
		"Cleric",
		"Druid",
		"Fighter",
		"Monk",
		"Paladin",
		"Ranger",
		"Rogue",
		"Sorcerer",
		"Warlock",
		"Wizard",
		"Other"
  ] as const;


@Injectable({
  providedIn: 'root',
})
export class CharacterClassService {
  private http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiBaseUrl}/classes`;

  create(characterClass: CreateCharacterData) {
    return this.http.post<CreateCharacterData>(
      this.baseUrl,
      characterClass
    )
  }


}
