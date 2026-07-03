import React, { useMemo } from 'react';
import {
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';

import { EffectId, positiveEffects, negativeEffects } from '@/data/effects';
import { ingredients } from '@/data/ingredients';
import { useAlchemyStore } from '@/data/alchemyStore';
import { getVisibleEffectCount } from '@/utils/alchemyUtils';
import { cn } from '@/utils/cn';

export interface IngredientFilters {
  selectedEffects: Set<EffectId>;
  showVanilla: boolean;
  showDlc: boolean;
  showCommon: boolean;
  showRare: boolean;
}

export const defaultFilters: IngredientFilters = {
  selectedEffects: new Set(),
  showVanilla: true,
  showDlc: true,
  showCommon: true,
  showRare: true,
};

export function isFilterActive(filters: IngredientFilters): boolean {
  return (
    !filters.showVanilla ||
    !filters.showDlc ||
    !filters.showCommon ||
    !filters.showRare ||
    filters.selectedEffects.size > 0
  );
}

export default function IngredientFilterDialog({
  open,
  onClose,
  filters,
  onFiltersChange,
}: {
  open: boolean;
  onClose: () => void;
  filters: IngredientFilters;
  onFiltersChange: (filters: IngredientFilters) => void;
}) {
  const alchemySkill = useAlchemyStore((s) => s.alchemySkill);

  // Determine which effects are currently visible at the player's alchemy level
  // An effect is "visible" if at least one ingredient has it in a visible slot
  const visibleEffectsAtLevel = useMemo(() => {
    const visibleCount = getVisibleEffectCount(alchemySkill);
    const visible = new Set<EffectId>();
    for (const ingredient of ingredients) {
      for (let i = 0; i < visibleCount; i++) {
        const eid = ingredient.effects[i];
        if (eid !== null) visible.add(eid);
      }
    }
    return visible;
  }, [alchemySkill]);

  const toggleEffect = (effectId: EffectId) => {
    const next = new Set(filters.selectedEffects);
    if (next.has(effectId)) {
      next.delete(effectId);
    } else {
      next.add(effectId);
    }
    onFiltersChange({ ...filters, selectedEffects: next });
  };

  const clearEffects = () => {
    onFiltersChange({ ...filters, selectedEffects: new Set() });
  };

  const resetAll = () => {
    onFiltersChange({ ...defaultFilters, selectedEffects: new Set() });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        className: 'w-[90vw] max-w-sm sm:max-w-md',
      }}
    >
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{ position: 'absolute', right: 8, top: 8 }}
      >
        <CloseIcon />
      </IconButton>

      <DialogTitle>Filter Ingredients</DialogTitle>

      <DialogContent className="space-y-5 p-4">
        {/* Source */}
        <div>
          <Typography variant="subtitle2" className="mb-2">
            Source
          </Typography>
          <div className="flex gap-2">
            <Chip
              label="Vanilla"
              variant={filters.showVanilla ? 'filled' : 'outlined'}
              color={filters.showVanilla ? 'primary' : 'default'}
              onClick={() =>
                onFiltersChange({ ...filters, showVanilla: !filters.showVanilla })
              }
            />
            <Chip
              label="Shivering Isles"
              variant={filters.showDlc ? 'filled' : 'outlined'}
              color={filters.showDlc ? 'primary' : 'default'}
              onClick={() =>
                onFiltersChange({ ...filters, showDlc: !filters.showDlc })
              }
            />
          </div>
        </div>

        {/* Rarity */}
        <div>
          <Typography variant="subtitle2" className="mb-2">
            Rarity
          </Typography>
          <div className="flex gap-2">
            <Chip
              label="Common"
              variant={filters.showCommon ? 'filled' : 'outlined'}
              color={filters.showCommon ? 'primary' : 'default'}
              onClick={() =>
                onFiltersChange({ ...filters, showCommon: !filters.showCommon })
              }
            />
            <Chip
              label="Rare"
              variant={filters.showRare ? 'filled' : 'outlined'}
              color={filters.showRare ? 'secondary' : 'default'}
              onClick={() =>
                onFiltersChange({ ...filters, showRare: !filters.showRare })
              }
            />
          </div>
        </div>

        {/* Effects */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <Typography variant="subtitle2">Effects</Typography>
            {filters.selectedEffects.size > 0 && (
              <Button size="small" onClick={clearEffects} className="normal-case text-xs">
                Clear
              </Button>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto rounded-md border border-[#2e2e2e] sm:max-h-80">
            {/* Positive effects */}
            <div className="sticky top-0 z-10 bg-[#303030] px-3 py-1 text-xs font-semibold text-ghost">
              Positive
            </div>
            {positiveEffects.map((effect) => {
              const isVisible = visibleEffectsAtLevel.has(effect.id);
              const isSelected = filters.selectedEffects.has(effect.id);

              return (
                <div
                  key={effect.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleEffect(effect.id)}
                  onKeyDown={(e) => e.key === 'Enter' && toggleEffect(effect.id)}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 px-3 py-1 hover:bg-[#2f2f2f]',
                    !isVisible && 'opacity-40',
                  )}
                >
                  <Checkbox
                    size="small"
                    checked={isSelected}
                    tabIndex={-1}
                    sx={{ padding: 0 }}
                  />
                  <Image
                    src={`/icons/effects/${effect.icon}.png`}
                    width={20}
                    height={20}
                    alt={effect.name}
                    className="h-5 w-5"
                  />
                  <span className="text-sm">{effect.name}</span>
                </div>
              );
            })}

            {/* Negative effects */}
            <div className="sticky top-0 z-10 bg-[#303030] px-3 py-1 text-xs font-semibold text-ghost">
              Negative
            </div>
            {negativeEffects.map((effect) => {
              const isVisible = visibleEffectsAtLevel.has(effect.id);
              const isSelected = filters.selectedEffects.has(effect.id);

              return (
                <div
                  key={effect.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => toggleEffect(effect.id)}
                  onKeyDown={(e) => e.key === 'Enter' && toggleEffect(effect.id)}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 px-3 py-1 hover:bg-[#2f2f2f]',
                    !isVisible && 'opacity-40',
                  )}
                >
                  <Checkbox
                    size="small"
                    checked={isSelected}
                    tabIndex={-1}
                    sx={{ padding: 0 }}
                  />
                  <Image
                    src={`/icons/effects/${effect.icon}.png`}
                    width={20}
                    height={20}
                    alt={effect.name}
                    className="h-5 w-5"
                  />
                  <span className="text-sm">{effect.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>

      <DialogActions className="px-4 pb-3">
        <Button
          size="small"
          color="error"
          onClick={resetAll}
          className="normal-case"
          disabled={!isFilterActive(filters)}
        >
          Reset All
        </Button>
      </DialogActions>
    </Dialog>
  );
}
