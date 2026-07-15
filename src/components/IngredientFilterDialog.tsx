import React, { useMemo, useState } from 'react';
import {
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Drawer,
  FormControlLabel,
  IconButton,
  Switch,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Image from 'next/image';

import { EffectId, positiveEffects, negativeEffects } from '@/data/effects';
import { ingredients } from '@/data/ingredients';
import { useAlchemyStore } from '@/data/alchemyStore';
import { getVisibleEffectCount } from '@/utils/alchemyUtils';
import { cn } from '@/utils/cn';

export const DRAWER_WIDTH = 320;

export interface IngredientFilters {
  selectedEffects: Set<EffectId>;
  showVanilla: boolean;
  showDlc: boolean;
  showCommon: boolean;
  showRare: boolean;
  includeHiddenEffects: boolean;
}

export const defaultFilters: IngredientFilters = {
  selectedEffects: new Set(),
  showVanilla: true,
  showDlc: true,
  showCommon: true,
  showRare: true,
  includeHiddenEffects: false,
};

export function isFilterActive(filters: IngredientFilters): boolean {
  return (
    !filters.showVanilla ||
    !filters.showDlc ||
    !filters.showCommon ||
    !filters.showRare ||
    filters.selectedEffects.size > 0 ||
    filters.includeHiddenEffects
  );
}

interface FilterProps {
  open: boolean;
  onClose: () => void;
  filters: IngredientFilters;
  onFiltersChange: (filters: IngredientFilters) => void;
}

/**
 * Inner filter content shared between Dialog and Drawer rendering modes.
 */
function FilterContent({
  filters,
  onFiltersChange,
}: {
  filters: IngredientFilters;
  onFiltersChange: (filters: IngredientFilters) => void;
}) {
  const alchemySkill = useAlchemyStore((s) => s.alchemySkill);
  const [effectSearch, setEffectSearch] = useState('');

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

  const lowerEffectSearch = effectSearch.toLowerCase();

  const filteredPositiveEffects = useMemo(
    () =>
      effectSearch
        ? positiveEffects.filter((e) => e.name.toLowerCase().includes(lowerEffectSearch))
        : positiveEffects,
    [effectSearch, lowerEffectSearch],
  );

  const filteredNegativeEffects = useMemo(
    () =>
      effectSearch
        ? negativeEffects.filter((e) => e.name.toLowerCase().includes(lowerEffectSearch))
        : negativeEffects,
    [effectSearch, lowerEffectSearch],
  );

  const renderEffectRow = (effect: (typeof positiveEffects)[number]) => {
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
          'flex cursor-pointer items-center gap-2 px-3 py-1.5 hover:bg-[#2f2f2f]',
          !isVisible && 'opacity-40',
        )}
      >
        <Checkbox checked={isSelected} tabIndex={-1} sx={{ padding: 0 }} />
        <Image
          src={`/icons/effects/${effect.icon}.png`}
          width={24}
          height={24}
          alt={effect.name}
          className="h-6 w-6"
        />
        <span className="text-base">{effect.name}</span>
      </div>
    );
  };

  return (
    <>
      {/* Effects (moved to top) */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <Typography variant="subtitle2">Effects</Typography>
          <Button
            size="small"
            onClick={clearEffects}
            className="text-xs normal-case"
            sx={{ visibility: filters.selectedEffects.size > 0 ? 'visible' : 'hidden' }}
          >
            Clear
          </Button>
        </div>

        <TextField
          label="Search Effects"
          variant="outlined"
          size="small"
          fullWidth
          value={effectSearch}
          onChange={(e) => setEffectSearch(e.target.value)}
          className="mb-2"
        />

        <div className="max-h-64 overflow-y-auto rounded-md border border-[#2e2e2e] sm:max-h-80 lg:max-h-[calc(100vh-480px)]">
          {filteredPositiveEffects.length > 0 && (
            <>
              <div className="sticky top-0 z-10 bg-[#303030] px-3 py-1 text-xs font-semibold text-ghost">
                Positive
              </div>
              {filteredPositiveEffects.map(renderEffectRow)}
            </>
          )}

          {filteredNegativeEffects.length > 0 && (
            <>
              <div className="sticky top-0 z-10 bg-[#303030] px-3 py-1 text-xs font-semibold text-ghost">
                Negative
              </div>
              {filteredNegativeEffects.map(renderEffectRow)}
            </>
          )}

          {filteredPositiveEffects.length === 0 && filteredNegativeEffects.length === 0 && (
            <div className="px-3 py-4 text-sm italic text-ghost">No effects match.</div>
          )}
        </div>
      </div>

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
            onClick={() => onFiltersChange({ ...filters, showVanilla: !filters.showVanilla })}
          />
          <Chip
            label="Shivering Isles"
            variant={filters.showDlc ? 'filled' : 'outlined'}
            color={filters.showDlc ? 'primary' : 'default'}
            onClick={() => onFiltersChange({ ...filters, showDlc: !filters.showDlc })}
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
            onClick={() => onFiltersChange({ ...filters, showCommon: !filters.showCommon })}
          />
          <Chip
            label="Rare"
            variant={filters.showRare ? 'filled' : 'outlined'}
            color={filters.showRare ? 'secondary' : 'default'}
            onClick={() => onFiltersChange({ ...filters, showRare: !filters.showRare })}
          />
        </div>
      </div>

      {/* Include hidden effects toggle */}
      <div className="rounded-md border border-[#2e2e2e] bg-[#1e1e1e] px-3 py-1">
        <FormControlLabel
          control={
            <Switch
              size="small"
              checked={filters.includeHiddenEffects}
              onChange={(_e, checked) =>
                onFiltersChange({ ...filters, includeHiddenEffects: checked })
              }
            />
          }
          label={
            <div>
              <div className="text-sm">Include hidden effects</div>
              <div className="text-xs text-ghost">
                Match ingredients using effects beyond your alchemy level
              </div>
            </div>
          }
        />
      </div>

      {/* Reset */}
      <div>
        <Button
          size="small"
          color="error"
          onClick={resetAll}
          className="normal-case"
          disabled={!isFilterActive(filters)}
        >
          Reset All
        </Button>
      </div>
    </>
  );
}

export default function IngredientFilterDialog({
  open,
  onClose,
  filters,
  onFiltersChange,
}: FilterProps) {
  const isXl = useMediaQuery('(min-width: 1280px)');

  if (isXl) {
    return (
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: open ? DRAWER_WIDTH : 0,
          flexShrink: 0,
          transition: 'width 225ms cubic-bezier(0.4, 0, 0.2, 1)',
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            position: 'relative',
            height: '100%',
            border: 'none',
            borderRight: '1px solid #2e2e2e',
            backgroundColor: 'inherit',
            overflowX: 'hidden',
          },
        }}
      >
        <div className="flex h-full flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <Typography variant="h6" className="text-base font-semibold">
              Filter Ingredients
            </Typography>
            <IconButton aria-label="close" onClick={onClose} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>

          <div className="flex-1 space-y-5 overflow-y-auto px-4 pb-4">
            <FilterContent filters={filters} onFiltersChange={onFiltersChange} />
          </div>
        </div>
      </Drawer>
    );
  }

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
        <FilterContent filters={filters} onFiltersChange={onFiltersChange} />
      </DialogContent>

      <DialogActions className="px-4 pb-3" />
    </Dialog>
  );
}
