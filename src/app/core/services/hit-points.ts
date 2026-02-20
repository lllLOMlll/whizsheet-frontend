import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


export interface HitPointsData {
  totalHitPoints: number;
  currentHitPoints: number;
  temporaryHitPoints: number;
}

export interface CreateHitPointsData {
  totalHitPoints: number;
}

export enum HitPointsCategoryToString {
  totalHitPoints = 'Total HP',
  currentHitPoints = 'Current HP',
  temporaryHitPoints = 'Temporary HP'
}

@Injectable({
  providedIn: 'root',
})
export class HitPointsService {
  private http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiBaseUrl}/characters`;

  create(characterId: number, data: CreateHitPointsData) {
    return this.http.post<HitPointsData>(`${this.baseUrl}/${characterId}/hit-points`, data);
  }

  get(characterId: number) {
    return this.http.get<HitPointsData>(`${this.baseUrl}/${characterId}/hit-points`);
  }
}
