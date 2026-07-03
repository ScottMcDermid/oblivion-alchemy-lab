import React, { useMemo } from 'react';
import { Tooltip } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Image from 'next/image';

import { effectById, EffectId } from '@/data/effects';
import { useAlchemyStore } from '@/data/alchemyStore';
import { calculatePotion, getMastery, PlayerSettings, PotionEffect } from '@/utils/alchemyUtils';
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

function SkeletonBar({ className }: { className?: string }) {
  return <div className={cn('h-4 rounded bg-[#2e2e2e]', className)} />;
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

  const isMaster = getMastery(alchemySkill) === 'Master';
  const needsMoreIngredients =
    selectedIngredients.length === 0 ||
    (selectedIngredients.length === 1 && !isMaster);
  const noSharedEffects =
    !potion && !needsMoreIngredients && selectedIngredients.length >= 2;

  // Always render the panel container for layout stability
  return (
    <div className="mb-4 rounded-md border border-[#2e2e2e] bg-[#252525] p-4">
      {potion ? (
        // -- Potion/Poison result --
        <>
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
        </>
      ) : noSharedEffects ? (
        // -- No shared effects --
        <>
          <h3 className="mb-3 text-lg font-semibold text-ghost">Potion</h3>
          <div className="py-2 text-center text-sm text-ghost">
            No shared effects found. Try different ingredients.
          </div>
          <div className="mt-3 flex gap-4 border-t border-[#2e2e2e] pt-2 text-xs text-ghost">
            <span>-- wt</span>
            <span>-- gold</span>
          </div>
        </>
      ) : (
        // -- Skeleton placeholder --
        <>
          <h3 className="mb-3 text-lg font-semibold text-[#3a3a3a]">Potion</h3>
          <div className="space-y-2 opacity-30">
            <div className="flex items-center gap-2 px-2 py-1">
              <div className="h-6 w-6 rounded bg-[#2e2e2e]" />
              <SkeletonBar className="w-3/4" />
            </div>
            <div className="flex items-center gap-2 px-2 py-1">
              <div className="h-6 w-6 rounded bg-[#2e2e2e]" />
              <SkeletonBar className="w-1/2" />
            </div>
            <div className="flex items-center gap-2 px-2 py-1">
              <div className="h-6 w-6 rounded bg-[#2e2e2e]" />
              <SkeletonBar className="w-2/3" />
            </div>
          </div>
          <div className="mt-3 flex gap-4 border-t border-[#2e2e2e] pt-2 text-xs text-[#3a3a3a]">
            <span>-- wt</span>
            <span>-- gold</span>
          </div>
          {selectedIngredients.length === 1 && (
            <div className="mt-2 text-center text-xs text-ghost">
              Select another ingredient...
            </div>
          )}
        </>
      )}
    </div>
  );
}
