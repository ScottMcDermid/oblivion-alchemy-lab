import React, { useMemo } from 'react';
import { Tooltip } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Image from 'next/image';

import { effectById, EffectId } from '@/data/effects';
import { useAlchemyStore } from '@/data/alchemyStore';
import { calculatePotion, PlayerSettings, PotionEffect } from '@/utils/alchemyUtils';
import { cn } from '@/utils/cn';

function getEffectIconPath(effectId: EffectId): string {
  return `/icons/effects/${effectById[effectId].icon}.png`;
}

function formatEffect(pe: PotionEffect): string {
  const effect = effectById[pe.id];
  switch (effect.effectType) {
    case 'noMagnitudeOrDuration':
      return effect.name;
    case 'durationOnly':
      return `${effect.name} for ${pe.duration}s`;
    case 'magnitudeOnly':
      return `${effect.name} ${pe.magnitude} pts`;
    case 'most':
      return `${effect.name} ${pe.magnitude} pts for ${pe.duration}s`;
  }
}

export default function PotionResult() {
  const selectedIngredients = useAlchemyStore((s) => s.selectedIngredients);
  const alchemySkill = useAlchemyStore((s) => s.alchemySkill);
  const luck = useAlchemyStore((s) => s.luck);
  const mortarPestleQuality = useAlchemyStore((s) => s.mortarPestleQuality);
  const retortQuality = useAlchemyStore((s) => s.retortQuality);
  const calcinatorQuality = useAlchemyStore((s) => s.calcinatorQuality);
  const alembicQuality = useAlchemyStore((s) => s.alembicQuality);

  const potion = useMemo(() => {
    const settings: PlayerSettings = {
      alchemySkill,
      luck,
      mortarPestleQuality,
      retortQuality,
      calcinatorQuality,
      alembicQuality,
    };
    return calculatePotion(selectedIngredients, settings);
  }, [
    selectedIngredients,
    alchemySkill,
    luck,
    mortarPestleQuality,
    retortQuality,
    calcinatorQuality,
    alembicQuality,
  ]);

  if (!potion) {
    if (selectedIngredients.length >= 2) {
      return (
        <div className="py-4 text-center text-sm text-ghost">
          No shared effects found. Try different ingredients.
        </div>
      );
    }
    return null;
  }

  return (
    <div className="rounded-md border border-[#2e2e2e] bg-[#252525] p-4">
      <h3
        className={cn(
          'mb-3 text-lg font-semibold',
          potion.isPoison ? 'text-green-400' : 'text-pink-400',
        )}
      >
        {potion.isPoison ? 'Poison' : 'Potion'}
      </h3>

      <div className="space-y-2">
        {potion.effects.map((pe) => {
          const effect = effectById[pe.id];
          const isUnwanted = potion.isPoison
            ? !pe.isNegativeEffect
            : pe.isNegativeEffect;

          return (
            <div
              key={pe.id}
              className={cn(
                'flex items-center gap-2 rounded px-2 py-1',
                isUnwanted && 'opacity-50',
              )}
            >
              <Image
                src={getEffectIconPath(pe.id)}
                width={24}
                height={24}
                alt={effect.name}
                className="h-6 w-6"
              />

              <span className="flex-1 text-sm">{formatEffect(pe)}</span>

              {isUnwanted && (
                <Tooltip title="Side effect">
                  <WarningAmberIcon
                    fontSize="small"
                    className="text-yellow-600"
                  />
                </Tooltip>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex gap-4 border-t border-[#2e2e2e] pt-2 text-xs text-ghost">
        <span>{potion.weight.toFixed(1)} wt</span>
        <span>{potion.value} gold</span>
      </div>
    </div>
  );
}
