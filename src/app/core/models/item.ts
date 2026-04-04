import { MagicItem } from './magic-item';

export interface Item {
 id: string; 
 name : string; 
 description: string; 
 itemRarity: ItemRarityType; 
 value: number; 
 weight: number; 
 isEquipped: boolean; 
 isAttuned: boolean; 
 quantity: number; 
 magicItem?: MagicItem; 
}

export enum ItemRarityType {
  Common = 0,
  Uncommon = 1,
  Rare = 2,
  VeryRare = 3,
  Legendary = 4,
  Artifact = 5,
}
