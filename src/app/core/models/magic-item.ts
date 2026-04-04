import { AbilityScoreType } from './ability-score';
import { SavingThrowType } from './saving-throw';
import { SkillType } from './skill';

export interface MagicItem {
  id: string;
  requiresAttunement: boolean;
  magicEffectDescription: string;
  magicEffectMechanics: string;
  totalCharges: number;
  chargesRemaining: number;
  magicRechargeRate: string;
  effects: MagicItemEffect[];
}

export interface MagicItemEffect {
  id: number;
  effectType: ItemEffecType;
  abilityScore: AbilityScoreType;
  savingThrow: SavingThrowType;
  skill: SkillType;
  modifier: number;
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
  SpellAttack,
}
