import React, { useMemo } from 'react';
import { Button, IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import Image from 'next/image';

import { effectById, EffectId } from '@/data/effects';
import { useAlchemyStore } from '@/data/alchemyStore';
import { findSharedEffects, getVisibleEffectCount } from '@/utils/alchemyUtils';
import { cn } from '@/utils/cn';

function getEffectIconPath(effectId: EffectId): string {
  return `/icons/effects/${effectById[effectId].icon}.png`;
}

export default function ActiveIngredients() {
  const selectedIngredients = useAlchemyStore((s) => s.selectedIngredients);
  const alchemySkill = useAlchemyStore((s) => s.alchemySkill);
  const removeIngredient = useAlchemyStore((s) => s.actions.removeIngredient);
  const clearIngredients = useAlchemyStore((s) => s.actions.clearIngredients);

  const visibleCount = useMemo(
    () => getVisibleEffectCount(alchemySkill),
    [alchemySkill],
  );

  const sharedEffects = useMemo(
    () => new Set(findSharedEffects(selectedIngredients, alchemySkill)),
    [selectedIngredients, alchemySkill],
  );

  if (selectedIngredients.length === 0) {
    return (
      <div className="py-6 text-center text-sm text-ghost">
        Select ingredients to begin brewing
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-ghost">
          {selectedIngredients.length} / 4 ingredients
        </span>
        <Button
          size="small"
          color="error"
          onClick={clearIngredients}
          startIcon={<DeleteIcon fontSize="small" />}
          className="normal-case text-xs"
        >
          Clear All
        </Button>
      </div>

      {selectedIngredients.map((ingredient) => (
        <div
          key={ingredient.id}
          className="rounded-md border border-[#2e2e2e] bg-[#252525] p-3"
        >
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-semibold">{ingredient.name}</span>
            <IconButton
              size="small"
              aria-label={`Remove ${ingredient.name}`}
              onClick={() => removeIngredient(ingredient.id)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>

          <div className="space-y-1">
            {ingredient.effects.map((eid, idx) => {
              if (eid === null) return null;
              const isVisible = idx < visibleCount;
              const isShared = isVisible && sharedEffects.has(eid);
              const effect = effectById[eid];

              return (
                <div
                  key={idx}
                  className={cn(
                    'flex items-center gap-2 rounded px-2 py-0.5',
                    isShared && 'border-l-2 border-yellow-400 bg-yellow-400/5',
                    !isVisible && 'opacity-30',
                  )}
                >
                  <Tooltip title={isVisible ? effect.name : '???'}>
                    <Image
                      src={getEffectIconPath(eid)}
                      width={20}
                      height={20}
                      alt={isVisible ? effect.name : 'Unknown effect'}
                      className="h-5 w-5"
                    />
                  </Tooltip>
                  <span
                    className={cn(
                      'text-xs',
                      isShared && 'text-yellow-400',
                    )}
                  >
                    {isVisible ? effect.name : '???'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
