import { AbilityScoreType } from './ability-score';
import { SavingThrowType } from './saving-throw';
import { SkillType } from './skill';

export interface MagicItem {
  Id: number;
  RequiresAttunement: boolean;
  MagicEffectDescription: string;
  MagicEffectMechanics: string;
  TotalCharges: number;
  ChargesRemaining: number;
  MagicRechargeRate: string;
  Effects: MagicItemEffect[];
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
