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

  private baseUrl = `${environment.apiBaseUrl}/characters`;

  getCharacterWeapons(characterId: number): Observable<Weapon[]> {
    return this.http.get<Weapon[]>(`${this.baseUrl}/${characterId}/items/weapons`);
  }

  getWeaponById(characterId: number, weaponId: string): Observable<Weapon> {
    return this.http.get<Weapon>(`${this.baseUrl}/${characterId}/items/weapons/${weaponId}`)
  }

  createWeapon(characterId: number, weaponData: any): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(
      `${this.baseUrl}/${characterId}/items/weapons`,
      weaponData,
    );
  }

  deleteWeapon(characterId: number, weaponId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${characterId}/items/weapons/${weaponId}`);
  }

  toggleEquip(
    characterId: number,
    weaponId: string,
  ): Observable<{ id: string; isEquipped: boolean }> {
    return this.http.patch<{ id: string; isEquipped: boolean }>(
      `${this.baseUrl}/${characterId}/items/weapons/${weaponId}/equip`,
      {},
    );
  }
}
