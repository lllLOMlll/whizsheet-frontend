import { MagicItem } from './magic-item';

export interface Item {
 Id: number; 
 Name : string; 
 Description: string; 
 ItemRarity: ItemRarityType; 
 Value: number; 
 Weight: number; 
 IsEquipped: boolean; 
 IsAttuned: boolean; 
 Quantity: number; 
 MagicItem: MagicItem; 
}

export enum ItemRarityType {
  Common = 0,
  Uncommon = 1,
  Rare = 2,
  VeryRare = 3,
  Legendary = 4,
  Artifact = 5,
}
