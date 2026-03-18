import { Item } from './item';

export interface Weapon extends Item {
  attackType?: AttackType;
  bonusAttackRollType?: BonusAttackRollType;
  damageDiceType?: DamageDiceType;
  damageType?: DamageType;
  rangeType?: RangeType;

  isLight: boolean;
  isFinesse: boolean;
  isThrown: boolean;
  isVersatile: boolean;
  isAmmunition: boolean;
  isHeavy: boolean;
  isReach: boolean;
  isTwoHanded: boolean;
  isLoading: boolean;
  isSpecial: boolean;
}

export interface CharacterWeapon {
  characterItemId: number;
  weapon?: Weapon;
  quantity: number;
  isEquipped: boolean;
  isAttuned: boolean;
  chargesRemaining: number;
}

export enum AttackType {
  Melee,
  Range,
}

export enum BonusAttackRollType {
  None = 0,
  B1 = 1,
  B2 = 2,
  B3 = 3,
  B4 = 4,
  B5 = 5,
}

export const BonusAttackRollLabel: Record<BonusAttackRollType, string> = {
  [BonusAttackRollType.None]: '+0',
  [BonusAttackRollType.B1]: '+1',
  [BonusAttackRollType.B2]: '+2',
  [BonusAttackRollType.B3]: '+3',
  [BonusAttackRollType.B4]: '+4',
  [BonusAttackRollType.B5]: '+5',
};

export enum DamageDiceType {
  D4_1 = 1,
  D6_1 = 2,
  D8_1 = 3,
  D10_1 = 4,
  D12_1 = 5,
  D4_2 = 6,
  D6_2 = 7,
  D8_2 = 8,
  D10_2 = 9,
  D12_2 = 10,
}

export const DamageDiceLabel: Record<DamageDiceType, string> = {
  [DamageDiceType.D4_1]: '1d4',
  [DamageDiceType.D6_1]: '1d6',
  [DamageDiceType.D8_1]: '1d8',
  [DamageDiceType.D10_1]: '1d10',
  [DamageDiceType.D12_1]: '1d12',
  [DamageDiceType.D4_2]: '2d4',
  [DamageDiceType.D6_2]: '2d6',
  [DamageDiceType.D8_2]: '2d8',
  [DamageDiceType.D10_2]: '2d10',
  [DamageDiceType.D12_2]: '2d12',
};

export enum DamageType {
  Slashing,
  Piercing,
  Bludgeoning,
  Magic,
  Other,
}

export enum RangeType {
  R0 = 0,
  R1 = 1,
  R2 = 2,
  R3 = 3,
  R4 = 4,
  R5 = 5,
  R6 = 6,
}

export const RangeLabel: Record<RangeType, string> = {
  [RangeType.R0]: 'Not a range weapon',
  [RangeType.R1]: '5/15',
  [RangeType.R2]: '20/60',
  [RangeType.R3]: '30/120',
  [RangeType.R4]: '80/320',
  [RangeType.R5]: '100/400',
  [RangeType.R6]: '150/600',
};
