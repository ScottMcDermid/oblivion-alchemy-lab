import { EffectId, effectById, Effect } from '@/data/effects';
import { Ingredient } from '@/data/ingredients';

// --- Types ---

export type Mastery = 'Novice' | 'Apprentice' | 'Journeyman' | 'Expert' | 'Master';

export type ApparatusType = 'Mortar & Pestle' | 'Retort' | 'Calcinator' | 'Alembic';

export type ApparatusQuality = 'Novice' | 'Apprentice' | 'Journeyman' | 'Expert' | 'Master';

export const apparatusQualities: ApparatusQuality[] = ['Novice', 'Apprentice', 'Journeyman', 'Expert', 'Master'];

export const apparatusStrength: Record<ApparatusQuality, number> = {
  Novice: 0.1,
  Apprentice: 0.25,
  Journeyman: 0.5,
  Expert: 0.75,
  Master: 1.0,
};

export interface PlayerSettings {
  alchemySkill: number;  // 0-100
  luck: number;          // 0-100
  mortarPestleQuality: ApparatusQuality;
  retortQuality: ApparatusQuality | null;      // null = not equipped
  calcinatorQuality: ApparatusQuality | null;   // null = not equipped
  alembicQuality: ApparatusQuality | null;      // null = not equipped
}

export interface PotionEffect {
  id: EffectId;
  name: string;
  magnitude: number;
  duration: number;
  isNegativeEffect: boolean;
}

export interface Potion {
  effects: PotionEffect[];
  weight: number;
  value: number;
  isPoison: boolean;
  ingredients: Ingredient[];
}

// --- Core Functions ---

/**
 * Compute effective alchemy skill factoring in luck.
 * Effective_Alchemy = min(100, max(0, skill + 0.4 * (luck - 50)))
 */
export function getEffectiveAlchemy(skill: number, luck: number): number {
  return Math.min(100, Math.max(0, skill + 0.4 * (luck - 50)));
}

/**
 * Determine mastery tier from raw skill level.
 *   0-24  = Novice
 *  25-49  = Apprentice
 *  50-74  = Journeyman
 *  75-99  = Expert
 *  100    = Master
 */
export function getMastery(skill: number): Mastery {
  if (skill >= 100) return 'Master';
  if (skill >= 75) return 'Expert';
  if (skill >= 50) return 'Journeyman';
  if (skill >= 25) return 'Apprentice';
  return 'Novice';
}

/**
 * Number of ingredient effect slots visible at a given skill level.
 *  Novice      → 1
 *  Apprentice  → 2
 *  Journeyman  → 3
 *  Expert      → 4
 *  Master      → 4
 */
export function getVisibleEffectCount(skill: number): number {
  const mastery = getMastery(skill);
  switch (mastery) {
    case 'Novice':      return 1;
    case 'Apprentice':  return 2;
    case 'Journeyman':  return 3;
    case 'Expert':      return 4;
    case 'Master':      return 4;
  }
}

/**
 * Find effects shared by two or more ingredients (considering visible slots).
 *
 * For each ingredient, only the first `visibleCount` non-null effect slots are
 * considered. An effect is "shared" if it appears in the visible slots of at
 * least two ingredients.
 *
 * The returned array preserves discovery order: we scan through each
 * ingredient's visible effects in order and add a shared effect the first
 * time it is encountered.
 *
 * Special case: a Master (skill = 100) with exactly one ingredient returns
 * just the ingredient's first effect (single-ingredient potion).
 */
export function findSharedEffects(ingredients: Ingredient[], alchemySkill: number): EffectId[] {
  const visibleCount = getVisibleEffectCount(alchemySkill);

  // Master single-ingredient potion
  if (getMastery(alchemySkill) === 'Master' && ingredients.length === 1) {
    const firstEffect = ingredients[0].effects[0];
    return firstEffect !== null ? [firstEffect] : [];
  }

  // Count how many ingredients have each effect in their visible slots
  const effectCounts = new Map<EffectId, number>();
  for (const ingredient of ingredients) {
    for (let i = 0; i < visibleCount; i++) {
      const eid = ingredient.effects[i];
      if (eid !== null) {
        effectCounts.set(eid, (effectCounts.get(eid) ?? 0) + 1);
      }
    }
  }

  // Collect shared effects (count >= 2) in discovery order
  const shared: EffectId[] = [];
  const added = new Set<EffectId>();

  for (const ingredient of ingredients) {
    for (let i = 0; i < visibleCount; i++) {
      const eid = ingredient.effects[i];
      if (eid !== null && !added.has(eid) && (effectCounts.get(eid) ?? 0) >= 2) {
        shared.push(eid);
        added.add(eid);
      }
    }
  }

  return shared;
}

/**
 * Calculate the magnitude and duration of a single potion effect using the
 * UESP-documented Oblivion alchemy formulas.
 *
 * @param effectId  - The effect to calculate
 * @param settings  - Current player / apparatus configuration
 * @param isPotion  - true if the brew is a potion, false if poison
 */
export function calculatePotionEffect(
  effectId: EffectId,
  settings: PlayerSettings,
  isPotion: boolean,
): PotionEffect {
  const effect: Effect = effectById[effectId];
  const { effectType, baseCost, isNegativeEffect } = effect;

  // ------------------------------------------------------------------
  // Step 1: Compute base values
  // ------------------------------------------------------------------
  const effectiveAlchemy = getEffectiveAlchemy(settings.alchemySkill, settings.luck);
  const magickaCost = effectiveAlchemy + apparatusStrength[settings.mortarPestleQuality] * 25;

  // ------------------------------------------------------------------
  // noMagnitudeOrDuration (Cure effects) – short-circuit
  // ------------------------------------------------------------------
  if (effectType === 'noMagnitudeOrDuration') {
    return {
      id: effectId,
      name: effect.name,
      magnitude: 1,
      duration: 0,
      isNegativeEffect,
    };
  }

  // ------------------------------------------------------------------
  // Step 2: Compute Base_Mag and Base_Dur
  // ------------------------------------------------------------------
  let baseMag: number;
  let baseDur: number;

  if (effectType === 'durationOnly') {
    baseDur = magickaCost / (baseCost / 10);
    baseMag = 1;
  } else if (effectType === 'magnitudeOnly') {
    // Only Dispel uses this path
    baseMag = Math.pow(magickaCost / (baseCost / 10), 1 / 1.28);
    baseDur = 1;
  } else {
    // effectType === 'most'
    baseMag = Math.pow(magickaCost / (baseCost / 10 * 4), 1 / 2.28);
    baseDur = 4 * baseMag;
  }

  // ------------------------------------------------------------------
  // Step 3: Apply apparatus modifiers (Master Equations)
  // ------------------------------------------------------------------
  const calcStr = settings.calcinatorQuality ? apparatusStrength[settings.calcinatorQuality] : 0;
  const retStr  = settings.retortQuality     ? apparatusStrength[settings.retortQuality]     : 0;
  const alemStr = settings.alembicQuality    ? apparatusStrength[settings.alembicQuality]    : 0;

  let finalMag: number;
  let finalDur: number;

  if (effectType === 'durationOnly') {
    // Magnitude is always 1 for duration-only effects
    finalMag = 1;

    if (!isNegativeEffect) {
      // Positive effect
      finalDur = baseDur * (1 + 0.25 * calcStr + 0.35 * retStr);
    } else if (isPotion) {
      // Negative effect in a potion – alembic reduces duration
      finalDur = baseDur * (1 + 0.25 * calcStr - 2 * alemStr);
    } else {
      // Negative effect in a poison – alembic has no effect on duration-only
      finalDur = baseDur * (1 + 0.25 * calcStr);
    }
  } else if (effectType === 'magnitudeOnly') {
    // Only Dispel – always positive
    finalDur = 1;

    if (calcStr > 0 && retStr > 0) {
      // Both Calcinator AND Retort present → multiplicative interaction
      finalMag = baseMag * (1 + 0.15 * calcStr * retStr);
    } else {
      finalMag = baseMag * (1 + 0.3 * calcStr + 0.5 * retStr);
    }
  } else {
    // effectType === 'most'
    if (!isNegativeEffect) {
      // Positive effect
      if (calcStr > 0 && retStr > 0) {
        // Both Calcinator AND Retort present
        finalMag = baseMag * (1 + 1.4 * calcStr + 0.5 * retStr);
        finalDur = baseDur * (1 + 0.35 * calcStr + 1.0 * retStr);
      } else {
        finalMag = baseMag * (1 + 0.35 * calcStr + 0.5 * retStr);
        finalDur = baseDur * (1 + 0.35 * calcStr + 1.0 * retStr);
      }
    } else if (isPotion) {
      // Negative effect in a potion
      if (alemStr > 0) {
        // Alembic present → exception equation
        const factor = (1 + 0.35 * calcStr) * (1 + 0.35 * calcStr - 2 * alemStr);
        finalMag = baseMag * factor;
        finalDur = baseDur * factor;
      } else {
        finalMag = baseMag * (1 + 0.35 * calcStr);
        finalDur = baseDur * (1 + 0.35 * calcStr);
      }
    } else {
      // Negative effect in a poison
      if (alemStr > 0) {
        // Alembic present but alemFac = 0 for poisons, so -0 term
        const factor = (1 + 0.35 * calcStr) * (1 + 0.35 * calcStr);
        finalMag = baseMag * factor;
        finalDur = baseDur * factor;
      } else {
        finalMag = baseMag * (1 + 0.35 * calcStr);
        finalDur = baseDur * (1 + 0.35 * calcStr);
      }
    }
  }

  // ------------------------------------------------------------------
  // Step 4: Final rounding and clamping
  // ------------------------------------------------------------------
  let magnitude = Math.max(1, Math.round(finalMag));
  let duration  = Math.max(1, Math.round(finalDur));

  // Duration-only effects keep magnitude at 1 (already set above in finalMag)
  if (effectType === 'durationOnly') {
    magnitude = 1;
  }

  // Magnitude-only effects keep duration at 1 (already set above in finalDur)
  if (effectType === 'magnitudeOnly') {
    duration = 1;
  }

  return {
    id: effectId,
    name: effect.name,
    magnitude,
    duration,
    isNegativeEffect,
  };
}

/**
 * Calculate the gold value of a potion created with the given settings.
 * price = floor((effectiveAlchemy + mortarPestleStrength * 25) * 0.45)
 */
export function getPotionPrice(settings: PlayerSettings): number {
  const effectiveAlchemy = getEffectiveAlchemy(settings.alchemySkill, settings.luck);
  return Math.floor((effectiveAlchemy + apparatusStrength[settings.mortarPestleQuality] * 25) * 0.45);
}

/**
 * Brew a potion (or poison) from the given ingredients and player settings.
 *
 * Returns `null` when:
 *  - Fewer than 2 ingredients are provided (unless Master with 1 ingredient)
 *  - No shared effects are found among the visible ingredient slots
 */
export function calculatePotion(ingredients: Ingredient[], settings: PlayerSettings): Potion | null {
  const isMaster = getMastery(settings.alchemySkill) === 'Master';

  // Need at least 2 ingredients (or 1 at Master)
  if (ingredients.length < 2 && !(isMaster && ingredients.length === 1)) {
    return null;
  }

  // Find shared effects
  const sharedEffects = findSharedEffects(ingredients, settings.alchemySkill);
  if (sharedEffects.length === 0) {
    return null;
  }

  // Determine potion vs poison: if ANY shared effect is positive → potion
  const isPotion = sharedEffects.some((eid) => !effectById[eid].isNegativeEffect);

  // Calculate each effect
  const potionEffects: PotionEffect[] = sharedEffects.map((eid) =>
    calculatePotionEffect(eid, settings, isPotion),
  );

  // Weight = average of ingredient weights
  const weight = ingredients.reduce((sum, ing) => sum + ing.weight, 0) / ingredients.length;

  // Value
  const value = getPotionPrice(settings);

  return {
    effects: potionEffects,
    weight,
    value,
    isPoison: !isPotion,
    ingredients,
  };
}

// --- Default Settings ---

export const defaultPlayerSettings: PlayerSettings = {
  alchemySkill: 25,
  luck: 50,
  mortarPestleQuality: 'Novice',
  retortQuality: null,
  calcinatorQuality: null,
  alembicQuality: null,
};
