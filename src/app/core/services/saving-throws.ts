import { Injectable } from '@angular/core';

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

// export enum SavingThrowsToString {
//   strength = 'Strength',
//   dexterity = 'Dexterity',
//   constitution = 'Constitution',
//   intelligence = 'Intelligence',
//   wisdom = 'Wisdom',
//   charisma = 'Charisma',
// }

@Injectable({
  providedIn: 'root',
})
export class SavingThrowsService {}
