import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SavingThrows {
  strength: number;
  isStrengthProficient: boolean;
  dexterity: number;
  isDexterityProficient: boolean;
  constitution: number;
  isConstitutionProficient: boolean;
  intelligence: number;
  isIntelligenceProficient: boolean;
  wisdom: number;
  isWisdomProficient: boolean;
  charisma: number;
  isCharismaProficient: boolean;
}

export enum SavingThrowsType {
  strength = 'Strength',
  dexterity = 'Dexterity',
  constitution = 'Constitution',
  intelligence = 'Intelligence',
  wisdom = 'Wisdom',
  charisma = 'Charisma',
}

export interface SavingThrow {
  savingThrowType: SavingThrowsType;
  isProficient: boolean;
  modifier: number;
}

export interface SavingThrowsProficient {
  SavingThrowType: SavingThrowsType;
  isProficient: boolean;
}

export interface SavingThrowsList {
  savingThrowsListDto: SavingThrow[];
}

export interface SavingThrowProficientList {
  savingThrowsProficient: SavingThrowsProficient[];
}

@Injectable({
  providedIn: 'root',
})
export class SavingThrowsService {
  private http = inject(HttpClient);

  private readonly baseURL = `${environment.apiBaseUrl}/characters`;

 get(characterId: number) {
    return this.http
      .get<SavingThrowsList>(`${this.baseURL}/${characterId}/saving-throws`)
      .pipe(map((res) => res.savingThrowsListDto)); // Retourne directement SavingThrow[]
  } 

  firstUpdate(characterId: number) {
    return this.http.put<void>(`${this.baseURL}/${characterId}/saving-throws/first-update`, characterId);
  }

put(characterId: number, data: SavingThrowsProficient[]) {
    const payload = { savingThrows: data }; // Doit matcher SavingTrowsProficientListDto en C#
    return this.http
      .put<SavingThrowsList>(`${this.baseURL}/${characterId}/saving-throws`, payload)
      .pipe(map((res) => res.savingThrowsListDto)); // Retourne aussi la liste mise à jour
  }
}
