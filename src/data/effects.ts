export type School =
  | 'Alteration'
  | 'Conjuration'
  | 'Destruction'
  | 'Illusion'
  | 'Mysticism'
  | 'Restoration';

export type EffectType = 'most' | 'durationOnly' | 'magnitudeOnly' | 'noMagnitudeOrDuration';

export type EffectId =
  // Alteration
  | 'BRDN'
  | 'FTHR'
  | 'FISH'
  | 'FRSH'
  | 'SHLD'
  | 'LISH'
  | 'WABR'
  | 'WAWA'
  // Destruction
  | 'DGAT_STR'
  | 'DGAT_INT'
  | 'DGAT_WIL'
  | 'DGAT_AGI'
  | 'DGAT_SPD'
  | 'DGAT_END'
  | 'DGAT_PER'
  | 'DGAT_LUC'
  | 'DGFA'
  | 'DGHE'
  | 'DGSP'
  | 'DRAT_AGI'
  | 'DRAT_SPD'
  | 'DRFA'
  | 'DRHE'
  | 'FIDG'
  | 'FRDG'
  | 'SHDG'
  | 'WKFI'
  // Illusion
  | 'CHML'
  | 'INVI'
  | 'LGHT'
  | 'NEYE'
  | 'PARA'
  | 'SLNC'
  // Mysticism
  | 'DTCT'
  | 'DSPL'
  | 'REDG'
  | 'RFLC'
  // Restoration
  | 'CUDI'
  | 'CUPA'
  | 'CUPO'
  | 'FOAT_STR'
  | 'FOAT_INT'
  | 'FOAT_WIL'
  | 'FOAT_AGI'
  | 'FOAT_SPD'
  | 'FOAT_END'
  | 'FOAT_PER'
  | 'FOAT_LUC'
  | 'FOFA'
  | 'FOHE'
  | 'FOSP'
  | 'RSDI'
  | 'RSFI'
  | 'RSFR'
  | 'RSPA'
  | 'RSPO'
  | 'RSSH'
  | 'REAT_STR'
  | 'REAT_INT'
  | 'REAT_WIL'
  | 'REAT_AGI'
  | 'REAT_SPD'
  | 'REAT_END'
  | 'REAT_PER'
  | 'REAT_LUC'
  | 'REFA'
  | 'REHE'
  | 'RESP';

export interface Effect {
  id: EffectId;
  name: string;
  baseCost: number;
  school: School;
  isNegativeEffect: boolean;
  effectType: EffectType;
  description: string;
  icon: string;
}

const allEffects: Effect[] = [
  // ---------------------------------------------------------------------------
  // Alteration
  // ---------------------------------------------------------------------------
  {
    id: 'BRDN',
    name: 'Burden',
    baseCost: 0.21,
    school: 'Alteration',
    isNegativeEffect: true,
    effectType: 'most',
    description: 'Increase the target\'s encumbrance.',
    icon: 'BRDN',
  },
  {
    id: 'FTHR',
    name: 'Feather',
    baseCost: 0.01,
    school: 'Alteration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Decrease the target\'s encumbrance.',
    icon: 'FTHR',
  },
  {
    id: 'FISH',
    name: 'Fire Shield',
    baseCost: 0.95,
    school: 'Alteration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Adds fire resistance and armor.',
    icon: 'FISH',
  },
  {
    id: 'FRSH',
    name: 'Frost Shield',
    baseCost: 0.95,
    school: 'Alteration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Adds frost resistance and armor.',
    icon: 'FRSH',
  },
  {
    id: 'SHLD',
    name: 'Shield',
    baseCost: 0.45,
    school: 'Alteration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Increases the target\'s armor rating.',
    icon: 'SHLD',
  },
  {
    id: 'LISH',
    name: 'Shock Shield',
    baseCost: 0.95,
    school: 'Alteration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Adds shock resistance and armor.',
    icon: 'LISH',
  },
  {
    id: 'WABR',
    name: 'Water Breathing',
    baseCost: 14.5,
    school: 'Alteration',
    isNegativeEffect: false,
    effectType: 'durationOnly',
    description: 'Allows the target to breathe underwater.',
    icon: 'WABR',
  },
  {
    id: 'WAWA',
    name: 'Water Walking',
    baseCost: 13.0,
    school: 'Alteration',
    isNegativeEffect: false,
    effectType: 'durationOnly',
    description: 'Allows the target to walk on water.',
    icon: 'WAWA',
  },

  // ---------------------------------------------------------------------------
  // Destruction
  // ---------------------------------------------------------------------------
  {
    id: 'DGAT_STR',
    name: 'Damage Strength',
    baseCost: 100.0,
    school: 'Destruction',
    isNegativeEffect: true,
    effectType: 'most',
    description: 'Damage the target\'s Strength.',
    icon: 'DGAT',
  },
  {
    id: 'DGAT_INT',
    name: 'Damage Intelligence',
    baseCost: 100.0,
    school: 'Destruction',
    isNegativeEffect: true,
    effectType: 'most',
    description: 'Damage the target\'s Intelligence.',
    icon: 'DGAT',
  },
  {
    id: 'DGAT_WIL',
    name: 'Damage Willpower',
    baseCost: 100.0,
    school: 'Destruction',
    isNegativeEffect: true,
    effectType: 'most',
    description: 'Damage the target\'s Willpower.',
    icon: 'DGAT',
  },
  {
    id: 'DGAT_AGI',
    name: 'Damage Agility',
    baseCost: 100.0,
    school: 'Destruction',
    isNegativeEffect: true,
    effectType: 'most',
    description: 'Damage the target\'s Agility.',
    icon: 'DGAT',
  },
  {
    id: 'DGAT_SPD',
    name: 'Damage Speed',
    baseCost: 100.0,
    school: 'Destruction',
    isNegativeEffect: true,
    effectType: 'most',
    description: 'Damage the target\'s Speed.',
    icon: 'DGAT',
  },
  {
    id: 'DGAT_END',
    name: 'Damage Endurance',
    baseCost: 100.0,
    school: 'Destruction',
    isNegativeEffect: true,
    effectType: 'most',
    description: 'Damage the target\'s Endurance.',
    icon: 'DGAT',
  },
  {
    id: 'DGAT_PER',
    name: 'Damage Personality',
    baseCost: 100.0,
    school: 'Destruction',
    isNegativeEffect: true,
    effectType: 'most',
    description: 'Damage the target\'s Personality.',
    icon: 'DGAT',
  },
  {
    id: 'DGAT_LUC',
    name: 'Damage Luck',
    baseCost: 100.0,
    school: 'Destruction',
    isNegativeEffect: true,
    effectType: 'most',
    description: 'Damage the target\'s Luck.',
    icon: 'DGAT',
  },
  {
    id: 'DGFA',
    name: 'Damage Fatigue',
    baseCost: 4.4,
    school: 'Destruction',
    isNegativeEffect: true,
    effectType: 'most',
    description: 'Damage the target\'s Fatigue.',
    icon: 'DGFA',
  },
  {
    id: 'DGHE',
    name: 'Damage Health',
    baseCost: 12.0,
    school: 'Destruction',
    isNegativeEffect: true,
    effectType: 'most',
    description: 'Damage the target\'s Health.',
    icon: 'DGHE',
  },
  {
    id: 'DGSP',
    name: 'Damage Magicka',
    baseCost: 2.45,
    school: 'Destruction',
    isNegativeEffect: true,
    effectType: 'most',
    description: 'Damage the target\'s Magicka.',
    icon: 'DGSP',
  },
  {
    id: 'DRAT_AGI',
    name: 'Drain Agility',
    baseCost: 0.7,
    school: 'Destruction',
    isNegativeEffect: true,
    effectType: 'most',
    description: 'Temporarily drain the target\'s Agility.',
    icon: 'DRAT',
  },
  {
    id: 'DRAT_SPD',
    name: 'Drain Speed',
    baseCost: 0.7,
    school: 'Destruction',
    isNegativeEffect: true,
    effectType: 'most',
    description: 'Temporarily drain the target\'s Speed.',
    icon: 'DRAT',
  },
  {
    id: 'DRFA',
    name: 'Drain Fatigue',
    baseCost: 0.18,
    school: 'Destruction',
    isNegativeEffect: true,
    effectType: 'most',
    description: 'Temporarily drain the target\'s Fatigue.',
    icon: 'DRFA',
  },
  {
    id: 'DRHE',
    name: 'Drain Health',
    baseCost: 0.9,
    school: 'Destruction',
    isNegativeEffect: true,
    effectType: 'most',
    description: 'Temporarily drain the target\'s Health.',
    icon: 'DRHE',
  },
  {
    id: 'FIDG',
    name: 'Fire Damage',
    baseCost: 7.5,
    school: 'Destruction',
    isNegativeEffect: true,
    effectType: 'most',
    description: 'Deal fire damage to the target.',
    icon: 'FIDG',
  },
  {
    id: 'FRDG',
    name: 'Frost Damage',
    baseCost: 7.4,
    school: 'Destruction',
    isNegativeEffect: true,
    effectType: 'most',
    description: 'Deal frost damage to the target.',
    icon: 'FRDG',
  },
  {
    id: 'SHDG',
    name: 'Shock Damage',
    baseCost: 7.8,
    school: 'Destruction',
    isNegativeEffect: true,
    effectType: 'most',
    description: 'Deal shock damage to the target.',
    icon: 'SHDG',
  },
  {
    id: 'WKFI',
    name: 'Weakness to Fire',
    baseCost: 0.1,
    school: 'Destruction',
    isNegativeEffect: true,
    effectType: 'most',
    description: 'Weaken the target\'s resistance to fire.',
    icon: 'WKFI',
  },

  // ---------------------------------------------------------------------------
  // Illusion
  // ---------------------------------------------------------------------------
  {
    id: 'CHML',
    name: 'Chameleon',
    baseCost: 0.63,
    school: 'Illusion',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Blend into the surroundings.',
    icon: 'CHML',
  },
  {
    id: 'INVI',
    name: 'Invisibility',
    baseCost: 40.0,
    school: 'Illusion',
    isNegativeEffect: false,
    effectType: 'durationOnly',
    description: 'Makes the target invisible.',
    icon: 'INVI',
  },
  {
    id: 'LGHT',
    name: 'Light',
    baseCost: 0.051,
    school: 'Illusion',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Create a hovering light.',
    icon: 'LGHT',
  },
  {
    id: 'NEYE',
    name: 'Night-Eye',
    baseCost: 22.0,
    school: 'Illusion',
    isNegativeEffect: false,
    effectType: 'durationOnly',
    description: 'Improve the target\'s ability to see in the dark.',
    icon: 'NEYE',
  },
  {
    id: 'PARA',
    name: 'Paralyze',
    baseCost: 475,
    school: 'Illusion',
    isNegativeEffect: true,
    effectType: 'durationOnly',
    description: 'Paralyze the target.',
    icon: 'PARA',
  },
  {
    id: 'SLNC',
    name: 'Silence',
    baseCost: 60.0,
    school: 'Illusion',
    isNegativeEffect: true,
    effectType: 'durationOnly',
    description: 'Prevent the target from casting spells.',
    icon: 'SLNC',
  },

  // ---------------------------------------------------------------------------
  // Mysticism
  // ---------------------------------------------------------------------------
  {
    id: 'DTCT',
    name: 'Detect Life',
    baseCost: 0.08,
    school: 'Mysticism',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Detect living beings in range.',
    icon: 'DTCT',
  },
  {
    id: 'DSPL',
    name: 'Dispel',
    baseCost: 3.6,
    school: 'Mysticism',
    isNegativeEffect: false,
    effectType: 'magnitudeOnly',
    description: 'Remove spell effects from the target.',
    icon: 'DSPL',
  },
  {
    id: 'REDG',
    name: 'Reflect Damage',
    baseCost: 2.5,
    school: 'Mysticism',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Reflect physical damage back at the attacker.',
    icon: 'REDG',
  },
  {
    id: 'RFLC',
    name: 'Reflect Spell',
    baseCost: 3.5,
    school: 'Mysticism',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Reflect spells back at the caster.',
    icon: 'RFLC',
  },

  // ---------------------------------------------------------------------------
  // Restoration
  // ---------------------------------------------------------------------------
  {
    id: 'CUDI',
    name: 'Cure Disease',
    baseCost: 1400,
    school: 'Restoration',
    isNegativeEffect: false,
    effectType: 'noMagnitudeOrDuration',
    description: 'Cures common disease.',
    icon: 'CUDI',
  },
  {
    id: 'CUPA',
    name: 'Cure Paralysis',
    baseCost: 500,
    school: 'Restoration',
    isNegativeEffect: false,
    effectType: 'noMagnitudeOrDuration',
    description: 'Cures paralysis.',
    icon: 'CUPA',
  },
  {
    id: 'CUPO',
    name: 'Cure Poison',
    baseCost: 600,
    school: 'Restoration',
    isNegativeEffect: false,
    effectType: 'noMagnitudeOrDuration',
    description: 'Cures poison.',
    icon: 'CUPO',
  },
  {
    id: 'FOAT_STR',
    name: 'Fortify Strength',
    baseCost: 0.6,
    school: 'Restoration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Fortify the target\'s Strength.',
    icon: 'FOAT',
  },
  {
    id: 'FOAT_INT',
    name: 'Fortify Intelligence',
    baseCost: 0.6,
    school: 'Restoration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Fortify the target\'s Intelligence.',
    icon: 'FOAT',
  },
  {
    id: 'FOAT_WIL',
    name: 'Fortify Willpower',
    baseCost: 0.6,
    school: 'Restoration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Fortify the target\'s Willpower.',
    icon: 'FOAT',
  },
  {
    id: 'FOAT_AGI',
    name: 'Fortify Agility',
    baseCost: 0.6,
    school: 'Restoration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Fortify the target\'s Agility.',
    icon: 'FOAT',
  },
  {
    id: 'FOAT_SPD',
    name: 'Fortify Speed',
    baseCost: 0.6,
    school: 'Restoration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Fortify the target\'s Speed.',
    icon: 'FOAT',
  },
  {
    id: 'FOAT_END',
    name: 'Fortify Endurance',
    baseCost: 0.6,
    school: 'Restoration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Fortify the target\'s Endurance.',
    icon: 'FOAT',
  },
  {
    id: 'FOAT_PER',
    name: 'Fortify Personality',
    baseCost: 0.6,
    school: 'Restoration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Fortify the target\'s Personality.',
    icon: 'FOAT',
  },
  {
    id: 'FOAT_LUC',
    name: 'Fortify Luck',
    baseCost: 0.6,
    school: 'Restoration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Fortify the target\'s Luck.',
    icon: 'FOAT',
  },
  {
    id: 'FOFA',
    name: 'Fortify Fatigue',
    baseCost: 0.04,
    school: 'Restoration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Fortify the target\'s Fatigue.',
    icon: 'FOFA',
  },
  {
    id: 'FOHE',
    name: 'Fortify Health',
    baseCost: 0.14,
    school: 'Restoration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Fortify the target\'s Health.',
    icon: 'FOHE',
  },
  {
    id: 'FOSP',
    name: 'Fortify Magicka',
    baseCost: 0.15,
    school: 'Restoration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Fortify the target\'s Magicka.',
    icon: 'FOSP',
  },
  {
    id: 'RSDI',
    name: 'Resist Disease',
    baseCost: 0.5,
    school: 'Restoration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Resist common disease.',
    icon: 'RSDI',
  },
  {
    id: 'RSFI',
    name: 'Resist Fire',
    baseCost: 0.5,
    school: 'Restoration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Resist fire damage.',
    icon: 'RSFI',
  },
  {
    id: 'RSFR',
    name: 'Resist Frost',
    baseCost: 0.5,
    school: 'Restoration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Resist frost damage.',
    icon: 'RSFR',
  },
  {
    id: 'RSPA',
    name: 'Resist Paralysis',
    baseCost: 0.75,
    school: 'Restoration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Resist paralysis effects.',
    icon: 'RSPA',
  },
  {
    id: 'RSPO',
    name: 'Resist Poison',
    baseCost: 0.5,
    school: 'Restoration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Resist poison.',
    icon: 'RSPO',
  },
  {
    id: 'RSSH',
    name: 'Resist Shock',
    baseCost: 0.5,
    school: 'Restoration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Resist shock damage.',
    icon: 'RSSH',
  },
  {
    id: 'REAT_STR',
    name: 'Restore Strength',
    baseCost: 38.0,
    school: 'Restoration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Restore the target\'s Strength.',
    icon: 'REAT',
  },
  {
    id: 'REAT_INT',
    name: 'Restore Intelligence',
    baseCost: 38.0,
    school: 'Restoration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Restore the target\'s Intelligence.',
    icon: 'REAT',
  },
  {
    id: 'REAT_WIL',
    name: 'Restore Willpower',
    baseCost: 38.0,
    school: 'Restoration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Restore the target\'s Willpower.',
    icon: 'REAT',
  },
  {
    id: 'REAT_AGI',
    name: 'Restore Agility',
    baseCost: 38.0,
    school: 'Restoration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Restore the target\'s Agility.',
    icon: 'REAT',
  },
  {
    id: 'REAT_SPD',
    name: 'Restore Speed',
    baseCost: 38.0,
    school: 'Restoration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Restore the target\'s Speed.',
    icon: 'REAT',
  },
  {
    id: 'REAT_END',
    name: 'Restore Endurance',
    baseCost: 38.0,
    school: 'Restoration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Restore the target\'s Endurance.',
    icon: 'REAT',
  },
  {
    id: 'REAT_PER',
    name: 'Restore Personality',
    baseCost: 38.0,
    school: 'Restoration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Restore the target\'s Personality.',
    icon: 'REAT',
  },
  {
    id: 'REAT_LUC',
    name: 'Restore Luck',
    baseCost: 38.0,
    school: 'Restoration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Restore the target\'s Luck.',
    icon: 'REAT',
  },
  {
    id: 'REFA',
    name: 'Restore Fatigue',
    baseCost: 2.0,
    school: 'Restoration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Restore the target\'s Fatigue.',
    icon: 'REFA',
  },
  {
    id: 'REHE',
    name: 'Restore Health',
    baseCost: 10.0,
    school: 'Restoration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Restore the target\'s Health.',
    icon: 'REHE',
  },
  {
    id: 'RESP',
    name: 'Restore Magicka',
    baseCost: 2.5,
    school: 'Restoration',
    isNegativeEffect: false,
    effectType: 'most',
    description: 'Restore the target\'s Magicka.',
    icon: 'RESP',
  },
];

function sortByName(a: Effect, b: Effect): number {
  return a.name.localeCompare(b.name);
}

export const effectById: Record<EffectId, Effect> = allEffects.reduce(
  (acc, effect) => {
    acc[effect.id] = effect;
    return acc;
  },
  {} as Record<EffectId, Effect>,
);

export const effects: Effect[] = [...allEffects].sort(sortByName);

export const positiveEffects: Effect[] = allEffects
  .filter((e) => !e.isNegativeEffect)
  .sort(sortByName);

export const negativeEffects: Effect[] = allEffects
  .filter((e) => e.isNegativeEffect)
  .sort(sortByName);
