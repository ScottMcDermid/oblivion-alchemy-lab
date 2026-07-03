'use client';

import React, { useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { IconButton, StyledEngineProvider, Tooltip } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import theme from '@/app/theme';

import IngredientSelector from '@/components/IngredientSelector';
import ActiveIngredients from '@/components/ActiveIngredients';
import PotionResult from '@/components/PotionResult';
import PlayerSettingsDialog from '@/components/PlayerSettingsDialog';

import { useAlchemyStore } from '@/data/alchemyStore';
import { getMastery } from '@/utils/alchemyUtils';

export default function Home() {
  const {
    alchemySkill,
    actions: { addIngredient },
  } = useAlchemyStore();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const mastery = getMastery(alchemySkill);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <h1 className="absolute w-screen text-center text-lg">Oblivion Alchemy Lab</h1>
        <div className="max-w-screen m-auto flex h-screen max-h-screen max-w-6xl flex-col bg-inherit">
          {/* Nav bar */}
          <div className="z-20 flex h-12 w-full flex-row justify-end px-2 pt-6 sm:pt-2">
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

            {/* Right panel: Potion result + Active ingredients */}
            <div className="mt-3 max-h-80 flex-1 overflow-y-auto bg-inherit sm:max-h-full lg:max-w-full">
              <PotionResult />
              <ActiveIngredients />
            </div>
          </div>
        </div>

        <PlayerSettingsDialog
          open={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
