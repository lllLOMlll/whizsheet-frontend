import { AbilityScoreType } from './ability-score';
import { SavingThrowType } from './saving-throw';
import { SkillType } from './skill';

export interface MagicItem {
  id?: string;
  requiresAttunement: boolean;
  magicEffectDescription: string;
  magicEffectMechanics: string;
  totalCharges: number;
  chargesRemaining: number;
  magicRechargeRate: string;
  effects: MagicItemEffect[];
}

export interface MagicItemEffect {
  id?: number;
  effectType: ItemEffectType;
  abilityScore: AbilityScoreType | null;
  savingThrow: SavingThrowType | null;
  skill: SkillType | null;
  modifier: number;
}

export enum ItemEffectType {
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
