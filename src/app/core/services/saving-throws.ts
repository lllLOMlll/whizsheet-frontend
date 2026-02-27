import { Injectable } from '@angular/core';

export interface SavingThrows {
  	strength: number;
		dexterity: number;
		constitution: number; 
		intelligence: number;
		wisdom: number;
		charisma: number;
}

@Injectable({
  providedIn: 'root',
})
export class SavingThrowsService {

}
