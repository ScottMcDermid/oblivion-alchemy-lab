'use client';

import React, { useMemo, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppBar, Box, Button, IconButton, Snackbar, StyledEngineProvider, Toolbar, Tooltip, Typography } from '@mui/material';
import BookIcon from '@mui/icons-material/Book';
import ShareIcon from '@mui/icons-material/Share';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import theme from '@/app/theme';

import IngredientSelector from '@/components/IngredientSelector';
import ActiveIngredients from '@/components/ActiveIngredients';
import PotionResult from '@/components/PotionResult';
import PlayerSettingsDialog from '@/components/PlayerSettingsDialog';
import IngredientFilterDialog, {
  defaultFilters,
  IngredientFilters,
} from '@/components/IngredientFilterDialog';

import { useAlchemyStore } from '@/data/alchemyStore';
import { ingredientById } from '@/data/ingredients';
import { effectById, EffectId } from '@/data/effects';
import {
  calculatePotion,
  findSharedEffects,
  getMastery,
  getVisibleEffectCount,
  PlayerSettings,
  PotionEffect,
} from '@/utils/alchemyUtils';
import { useShareBrew } from '@/hooks/useShareBrew';
import { cn } from '@/utils/cn';
import type { BrewData } from '@/utils/brewCodec';
import type { Ingredient } from '@/data/ingredients';

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

export default function AlchemyLab({ sharedBrew }: { sharedBrew?: BrewData }) {
  const {
    alchemySkill,
    actions: { addIngredient, loadBrew },
  } = useAlchemyStore();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState<IngredientFilters>(defaultFilters);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);

  const { copyShareUrl } = useShareBrew();
  const router = useRouter();

  const isViewOnly = !!sharedBrew;
  const mastery = getMastery(isViewOnly ? sharedBrew.alchemySkill : alchemySkill);

  // ─── Shared brew derived data ───────────────────────────────────────────
  const sharedIngredients = useMemo<Ingredient[]>(() => {
    if (!sharedBrew) return [];
    return sharedBrew.ingredientIds
      .map((id) => ingredientById[id])
      .filter((i): i is Ingredient => i !== undefined);
  }, [sharedBrew]);

  const sharedSettings = useMemo<PlayerSettings | null>(() => {
    if (!sharedBrew) return null;
    return {
      alchemySkill: sharedBrew.alchemySkill,
      luck: sharedBrew.luck,
      mortarPestleQuality: sharedBrew.mortarPestleQuality,
      retortQuality: sharedBrew.retortQuality,
      calcinatorQuality: sharedBrew.calcinatorQuality,
      alembicQuality: sharedBrew.alembicQuality,
    };
  }, [sharedBrew]);

  const sharedPotion = useMemo(() => {
    if (!sharedSettings || sharedIngredients.length === 0) return null;
    return calculatePotion(sharedIngredients, sharedSettings);
  }, [sharedIngredients, sharedSettings]);

  const sharedVisibleCount = useMemo(
    () => (sharedBrew ? getVisibleEffectCount(sharedBrew.alchemySkill) : 0),
    [sharedBrew],
  );

  const sharedSharedEffects = useMemo(
    () =>
      sharedBrew
        ? new Set(findSharedEffects(sharedIngredients, sharedBrew.alchemySkill))
        : new Set<EffectId>(),
    [sharedIngredients, sharedBrew],
  );

  // ─── Handlers ───────────────────────────────────────────────────────────

  const handleShare = async () => {
    const success = await copyShareUrl();
    setSnackbarMessage(success ? 'Link copied to clipboard!' : 'Failed to copy link');
  };

  const handleCopyToMyLab = () => {
    if (!sharedBrew) return;
    loadBrew({
      selectedIngredients: sharedIngredients,
      alchemySkill: sharedBrew.alchemySkill,
      luck: sharedBrew.luck,
      mortarPestleQuality: sharedBrew.mortarPestleQuality,
      retortQuality: sharedBrew.retortQuality,
      calcinatorQuality: sharedBrew.calcinatorQuality,
      alembicQuality: sharedBrew.alembicQuality,
    });
    setSnackbarMessage('Brew copied to your lab!');
    router.push('/');
  };

  const handleToggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />

        {/* Shared brew banner */}
        {isViewOnly && (
          <div className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-2 bg-yellow-900/80 px-4 py-2 text-sm text-yellow-200">
            <span>Viewing a shared brew</span>
            <div className="flex gap-2">
              <Button
                size="small"
                variant="contained"
                color="secondary"
                onClick={handleCopyToMyLab}
                className="normal-case text-xs"
              >
                Copy to my lab
              </Button>
              <Button
                size="small"
                variant="outlined"
                href="/"
                className="normal-case text-xs text-yellow-200 border-yellow-200/50"
              >
                Back to my lab
              </Button>
            </div>
          </div>
        )}

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: 'background.default',
          }}
        >
          <AppBar position="static" sx={{ backgroundColor: 'background.paper' }} elevation={1}>
            <Toolbar variant="dense" sx={{ gap: 1, overflow: 'hidden' }}>
              <IconButton
                component="a"
                href="https://oblivion.tools"
                size="small"
                aria-label="Oblivion Tools home"
                sx={{ p: 0.5 }}
              >
                <img src="/oblivion-tools-icon.ico" alt="Oblivion Tools" width={16} height={16} style={{ display: 'block' }} />
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                sx={{ fontSize: '1rem', fontWeight: 'bold', color: 'secondary.main' }}
              >
                Oblivion Alchemy Lab
              </Typography>

              <Typography
                noWrap
                sx={{ fontSize: '0.75rem', color: 'text.disabled', mx: 1 }}
              >
                {mastery}
              </Typography>

              <Box sx={{ flex: 1 }} />

              {!isViewOnly && (
                <>
                  <Button size="small" aria-label="Share Build" onClick={handleShare} sx={{ minWidth: 0, px: { xs: '6px', sm: undefined } }}>
                    <ShareIcon fontSize="small" />
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, ml: 0.5 }}>
                      Share
                    </Box>
                  </Button>
                  <Button variant="contained" size="small" aria-label="Adjust your skills" onClick={() => setIsSettingsOpen(true)} sx={{ minWidth: 0, px: { xs: '6px', sm: undefined } }}>
                    <BookIcon fontSize="small" />
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' }, ml: 0.5 }}>
                      Skills
                    </Box>
                  </Button>
                </>
              )}
            </Toolbar>
          </AppBar>

          <Box sx={{ display: 'flex', height: { xs: 'auto', sm: 'calc(100vh - 48px)' }, overflow: { xs: 'visible', sm: 'hidden' } }}>
            {/* Persistent filter drawer (lg+ only, editable mode) */}
            {!isViewOnly && (
              <IngredientFilterDialog
                open={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                filters={filters}
                onFiltersChange={setFilters}
              />
            )}

            {/* Main content area - pushed right when drawer is open via flex layout */}
            <div className="flex min-w-0 flex-1 flex-col bg-inherit transition-all duration-[225ms] ease-[cubic-bezier(0.4,0,0.2,1)]">
              <div className="max-w-screen m-auto flex w-full max-w-6xl flex-1 flex-col sm:overflow-hidden bg-inherit">

              {isViewOnly ? (
                // ─── View-only mode ───────────────────────────────────────────
                <div className="flex-1 overflow-y-auto bg-inherit px-4 pb-4">
                  <div className="mx-auto max-w-2xl">
                    {/* Shared potion result */}
                    {sharedPotion && (
                      <div className="mb-4 rounded-md border border-[#2e2e2e] bg-[#252525] p-4">
                        <h3
                          className={cn(
                            'mb-3 text-lg font-semibold',
                            sharedPotion.isPoison ? 'text-green-400' : 'text-pink-400',
                          )}
                        >
                          {sharedPotion.isPoison ? 'Poison' : 'Potion'}
                        </h3>

                        <div className="space-y-2">
                          {sharedPotion.effects.map((pe) => {
                            const effect = effectById[pe.id];
                            const isUnwanted = sharedPotion.isPoison
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
                                    <WarningAmberIcon fontSize="small" className="text-yellow-600" />
                                  </Tooltip>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        <div className="mt-3 flex gap-4 border-t border-[#2e2e2e] pt-2 text-xs text-ghost">
                          <span>{sharedPotion.weight.toFixed(1)} wt</span>
                          <span>{sharedPotion.value} gold</span>
                        </div>
                      </div>
                    )}

                    {/* Shared ingredients */}
                    {sharedIngredients.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs text-ghost">
                          {sharedIngredients.length} ingredient{sharedIngredients.length !== 1 ? 's' : ''}
                        </span>

                        {sharedIngredients.map((ingredient) => (
                          <div
                            key={ingredient.id}
                            className="rounded-md border border-[#2e2e2e] bg-[#252525] p-3"
                          >
                            <div className="mb-2">
                              <span className="text-sm font-semibold">{ingredient.name}</span>
                            </div>
                            <div className="space-y-1">
                              {ingredient.effects.map((eid, idx) => {
                                if (eid === null) return null;
                                const isVisible = idx < sharedVisibleCount;
                                const isShared = isVisible && sharedSharedEffects.has(eid);
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
                                    <span className={cn('text-xs', isShared && 'text-yellow-400')}>
                                      {isVisible ? effect.name : '???'}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Shared settings summary */}
                    {sharedSettings && (
                      <div className="mt-4 rounded-md border border-[#2e2e2e] bg-[#252525] p-3 text-xs text-ghost">
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          <span>Alchemy: {sharedBrew.alchemySkill}</span>
                          <span>Luck: {sharedBrew.luck}</span>
                          <span>Mortar & Pestle: {sharedBrew.mortarPestleQuality}</span>
                          {sharedBrew.retortQuality && <span>Retort: {sharedBrew.retortQuality}</span>}
                          {sharedBrew.calcinatorQuality && (
                            <span>Calcinator: {sharedBrew.calcinatorQuality}</span>
                          )}
                          {sharedBrew.alembicQuality && (
                            <span>Alembic: {sharedBrew.alembicQuality}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // ─── Normal editable mode ─────────────────────────────────────
                <div className="flex w-full flex-1 flex-col justify-center gap-6 bg-inherit sm:flex-row sm:overflow-y-auto">
                  {/* Left panel: Ingredient selector */}
                  <div className="flex min-h-0 flex-shrink-0 flex-col max-h-[50vh] sm:max-h-full sm:flex-1 sm:max-w-80">
                    <IngredientSelector
                      onIngredientSelect={(ingredient) => {
                        addIngredient(ingredient);
                      }}
                      filters={filters}
                      onToggleFilter={handleToggleFilter}
                    />
                  </div>

                  {/* Right panel: Potion result + Active ingredients */}
                  <div className="mt-3 flex-1 bg-inherit sm:max-h-full sm:overflow-y-auto lg:max-w-full">
                    <PotionResult />
                    <ActiveIngredients />
                  </div>
                </div>
              )}
              </div>
            </div>

            {/* Skills drawer — persistent right drawer on md+, Dialog on smaller screens */}
            {!isViewOnly && (
              <PlayerSettingsDialog
                open={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
              />
            )}
          </Box>

          <footer className="mt-16 w-full border-t border-gray-700 bg-neutral-900 px-6 py-8 text-sm text-gray-400">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 text-center sm:text-left">
              <div className="space-y-2">
                <p>Oblivion Tool Suite © 2025 Scott McDermid</p>
                <p>
                  Licensed under the{' '}
                  <a
                    href="https://www.gnu.org/licenses/gpl-3.0.html"
                    className="underline hover:text-gray-200"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GNU General Public License v3.0
                  </a>
                  .
                </p>
                <p>
                  The Elder Scrolls and Oblivion are trademarks of Bethesda Softworks LLC, a ZeniMax
                  Media company.
                </p>
                <p>This site is fan-made and not affiliated with Bethesda.</p>
              </div>
              <div className="flex w-full justify-end">
                <a
                  href="https://github.com/ScottMcDermid/oblivion-alchemy-lab"
                  className="inline-flex items-center gap-2 rounded-md border border-transparent px-3 py-1 text-xs font-medium text-gray-400 transition hover:border-gray-600 hover:text-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-200"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-4 w-4 fill-current"
                    focusable="false"
                  >
                    <path d="M12 .297C5.375.297 0 5.67 0 12.297c0 5.302 3.438 9.799 8.205 11.387.6.112.82-.26.82-.577 0-.285-.01-1.04-.015-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.746.083-.73.083-.73 1.203.085 1.836 1.236 1.836 1.236 1.07 1.835 2.808 1.305 3.492.998.108-.775.418-1.305.762-1.606-2.665-.303-5.467-1.334-5.467-5.934 0-1.31.469-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.3 1.23a11.47 11.47 0 0 1 3.003-.404c1.02.005 2.047.138 3.003.404 2.292-1.552 3.298-1.23 3.298-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.628-5.48 5.923.43.37.823 1.096.823 2.21 0 1.595-.015 2.882-.015 3.274 0 .32.22.694.825.576C20.565 22.092 24 17.597 24 12.297 24 5.67 18.627.297 12 .297z" />
                  </svg>
                  <span className="uppercase tracking-wide">GitHub</span>
                </a>
              </div>
            </div>
          </footer>
        </Box>

        <Snackbar
          open={snackbarMessage !== null}
          autoHideDuration={3000}
          onClose={() => setSnackbarMessage(null)}
          message={snackbarMessage}
        />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
