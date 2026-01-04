import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface Character {
  id: number;
  name: string;
  class: string;
  hp: number;
}

export interface CreateCharacterData {
  name: string;
  class: string;
  hp: number;
}

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private http = inject(HttpClient)

  private readonly baseUrl = `${environment.apiBaseUrl}/characters`;

  getAll() {
    return this.http.get<Character[]>(this.baseUrl);
  }

  create(character: Omit<Character, 'id'>) {
    return this.http.post<Character>(
      this.baseUrl,
      character
    )
  }
}
