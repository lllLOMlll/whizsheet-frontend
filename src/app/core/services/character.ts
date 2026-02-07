import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface Character {
  id: number;
  name: string;
  hp: number;
}

export interface CreateCharacterData {
  name: string;
  hp: number;
}

export interface UpdateCharacterData {
  name: string;
  hp: number;
}

@Injectable({
  providedIn: 'root',
})
export class CharacterService {
  private http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiBaseUrl}/characters`;

  getAll() {
    return this.http.get<Character[]>(this.baseUrl);
  }

  getById(id: number) {
     return this.http.get<Character>(`${this.baseUrl}/${id}`);
  }

  create(character: Omit<Character, 'id'>) {
    return this.http.post<Character>(
      this.baseUrl,
      character
    )
  }

  delete(id: number) {
    return this.http.delete<void>(
      `${this.baseUrl}/${id}`
    );
  }

  update(id: number, character: UpdateCharacterData) {
    return this.http.put<void>(
      `${this.baseUrl}/${id}`, 
      character
    )
  }
}
