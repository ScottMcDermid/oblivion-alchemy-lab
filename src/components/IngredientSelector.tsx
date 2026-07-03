import React, { useMemo, useState } from 'react';
import { TextField, Button, Tooltip } from '@mui/material';
import Image from 'next/image';

import { effectById, EffectId } from '@/data/effects';
import { ingredients, Ingredient } from '@/data/ingredients';
import { useAlchemyStore } from '@/data/alchemyStore';
import { getVisibleEffectCount } from '@/utils/alchemyUtils';
import { cn } from '@/utils/cn';

function getEffectIconPath(effectId: EffectId): string {
  return `/icons/effects/${effectById[effectId].icon}.png`;
}

export default function IngredientSelector({
  onIngredientSelect,
}: {
  onIngredientSelect: (ingredient: Ingredient) => void;
}) {
  const [search, setSearch] = useState('');

  const selectedIngredients = useAlchemyStore((s) => s.selectedIngredients);
  const alchemySkill = useAlchemyStore((s) => s.alchemySkill);

  const visibleCount = useMemo(() => getVisibleEffectCount(alchemySkill), [alchemySkill]);

  const filteredIngredients = useMemo(() => {
    const selectedIds = new Set(selectedIngredients.map((i) => i.id));
    const lowerSearch = search.toLowerCase();

    // Collect all visible effects from selected ingredients for shared-effect filtering
    const selectedVisibleEffects = new Set<EffectId>();
    for (const sel of selectedIngredients) {
      for (let i = 0; i < visibleCount; i++) {
        const eid = sel.effects[i];
        if (eid !== null) selectedVisibleEffects.add(eid);
      }
    }
    const hasSelection = selectedIngredients.length > 0;

    return ingredients.filter((ingredient) => {
      if (selectedIds.has(ingredient.id)) return false;

      // Only show ingredients that share at least one visible effect with selected
      if (hasSelection) {
        const hasSharedEffect = ingredient.effects.some((eid, idx) => {
          if (eid === null) return false;
          if (idx >= visibleCount) return false;
          return selectedVisibleEffects.has(eid);
        });
        if (!hasSharedEffect) return false;
      }

      if (!search) return true;

      if (ingredient.name.toLowerCase().includes(lowerSearch)) return true;

      return ingredient.effects.some((eid) => {
        if (eid === null) return false;
        return effectById[eid].name.toLowerCase().includes(lowerSearch);
      });
    });
  }, [search, selectedIngredients, visibleCount]);

  return (
    <div className="flex h-full flex-col">
      <TextField
        label="Search Ingredients"
        variant="outlined"
        size="small"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 px-2"
      />

      <div className="min-h-0 flex-1">
        <div className="h-full space-y-1 overflow-y-auto rounded-md border border-[#2e2e2e] p-2">
          {filteredIngredients.map((ingredient) => (
            <Button
              key={ingredient.id}
              variant="outlined"
              fullWidth
              onClick={() => {
                setSearch('');
                onIngredientSelect(ingredient);
              }}
              className="justify-start text-left normal-case"
            >
              <div className="flex w-full items-center gap-2 p-1">
                <div className="flex shrink-0 gap-0.5">
                  {ingredient.effects.map((eid, idx) => {
                    if (eid === null) return null;
                    const isVisible = idx < visibleCount;
                    return (
                      <Tooltip
                        key={idx}
                        title={isVisible ? effectById[eid].name : '???'}
                      >
                        <Image
                          src={getEffectIconPath(eid)}
                          width={20}
                          height={20}
                          alt={isVisible ? effectById[eid].name : 'Unknown effect'}
                          className={cn(
                            'h-5 w-5',
                            !isVisible && 'opacity-30',
                          )}
                        />
                      </Tooltip>
                    );
                  })}
                </div>

                <span className="flex-1 truncate text-sm">{ingredient.name}</span>

                {ingredient.isDlc && (
                  <span className="shrink-0 rounded border border-[#555] px-1 text-[10px] leading-tight text-ghost">
                    SI
                  </span>
                )}

                {ingredient.isRare && (
                  <span className="shrink-0 text-xs text-yellow-400">Rare</span>
                )}
              </div>
            </Button>
          ))}

          {filteredIngredients.length === 0 && (
            <div className="text-sm italic text-ghost">No ingredients found.</div>
          )}
        </div>
      </div>
    </div>
  );
}
