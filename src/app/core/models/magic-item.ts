import { AbilityScoreType } from "./ability-score";
import { SavingThrowType } from "./saving-throw";
import { SkillType } from "./skill";

export interface MagicItem {
  requiresAttunement: boolean;
  effects: MagicItemEffect[];
}

export interface MagicItemEffect {
	effectType: ItemEffecType; 
	abilityScore: AbilityScoreType;
	savingThrow:  SavingThrowType;
	skill: SkillType;
	modifier: number; 
	description: string; 
}

export enum ItemEffecType {
	AbilityScore,
	SavingThrow,
	Skill,
	ArmorClass,
	Initiative,
	Speed,
	HitPoints,
	Proficiency,
	SpellSaveDC,
	SpellAttack
}