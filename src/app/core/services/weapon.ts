import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Weapon, CharacterWeapon } from '../models/weapon';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WeaponService {
  private http = inject(HttpClient);

  private baseUrl = `${environment.apiBaseUrl}/v1/characters`;

  getCharacterWeapons(characterId: number): Observable<CharacterWeapon[]> {
    return this.http.get<CharacterWeapon[]>(
      `${this.baseUrl}/${characterId}/item/weapons`
    );  
  }

  createWeapon(characterId: number, weaponData: any): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${this.baseUrl}/${characterId}/items/weapons`, weaponData);
  }
}
