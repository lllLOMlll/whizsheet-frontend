import { Injectable } from '@angular/core';

export interface SavingThrows {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
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
