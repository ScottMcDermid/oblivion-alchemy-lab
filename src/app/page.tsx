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

        <footer className="mt-16 w-full border-t border-gray-700 bg-neutral-900 px-6 py-8 text-sm text-gray-400">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 text-center sm:text-left">
            <div className="space-y-2">
              <p>Oblivion Tool Suite &copy; 2025 Scott McDermid</p>
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

        <PlayerSettingsDialog
          open={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
