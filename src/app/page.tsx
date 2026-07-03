'use client';

import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Button, IconButton, StyledEngineProvider, Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SettingsIcon from '@mui/icons-material/Settings';
import theme from '@/app/theme';

import IngredientSelector from '@/components/IngredientSelector';
import ActiveIngredients from '@/components/ActiveIngredients';
import PotionResult from '@/components/PotionResult';
import PlayerSettingsDialog from '@/components/PlayerSettingsDialog';
import ConfirmDialog from '@/components/ConfirmDialog';

import { useAlchemyStore } from '@/data/alchemyStore';
import { getMastery } from '@/utils/alchemyUtils';

export default function Home() {
  const {
    selectedIngredients,
    alchemySkill,
    actions: { addIngredient, clearIngredients },
  } = useAlchemyStore();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isConfirmingClear, setIsConfirmingClear] = useState(false);

  const handleClear = (confirm: boolean) => {
    if (confirm) {
      clearIngredients();
    }
    setIsConfirmingClear(false);
  };

  const mastery = getMastery(alchemySkill);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <h1 className="absolute w-screen text-center text-lg">Oblivion Alchemy Lab</h1>
        <div className="max-w-screen m-auto flex h-screen max-h-screen max-w-6xl flex-col bg-inherit">
          {/* Nav bar */}
          <div className="z-20 flex h-12 w-full flex-row justify-between px-2 pt-6 sm:pt-2">
            <div className="flex place-items-center">
              {selectedIngredients.length > 0 && (
                <Button
                  className="mx-2"
                  color="error"
                  aria-label="Clear Ingredients"
                  onClick={() => setIsConfirmingClear(true)}
                >
                  <DeleteIcon />
                  <div className="hidden sm:block">&nbsp;Clear</div>
                </Button>
              )}
            </div>

            <div className="flex place-items-center gap-2">
              <span className="text-sm text-ghost">{mastery}</span>
              <Tooltip title="Player Settings">
                <IconButton onClick={() => setIsSettingsOpen(true)} size="small">
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
            </div>
          </div>

          <div className="flex w-full flex-1 flex-col justify-center gap-6 overflow-y-auto bg-inherit sm:flex-row">
            {/* Left panel: Ingredient selector */}
            <div className="flex min-h-0 flex-1 flex-shrink-0 flex-col sm:max-w-80">
              <IngredientSelector
                onIngredientSelect={(ingredient) => {
                  addIngredient(ingredient);
                }}
              />
            </div>

            {/* Right panel: Active ingredients + Potion result */}
            <div className="mt-3 max-h-80 flex-1 overflow-y-auto bg-inherit sm:max-h-full lg:max-w-full">
              <ActiveIngredients />
              <PotionResult />
            </div>
          </div>
        </div>

        <PlayerSettingsDialog
          open={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />

        <ConfirmDialog
          open={isConfirmingClear}
          description="This will remove all selected ingredients"
          handleClose={handleClear}
        />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
