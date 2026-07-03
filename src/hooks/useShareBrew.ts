'use client';

import { useCallback } from 'react';
import { useAlchemyStore } from '@/data/alchemyStore';
import { encodeBrew, type BrewData } from '@/utils/brewCodec';

/**
 * Hook that provides a function to generate a shareable URL for the current brew.
 */
export function useShareBrew() {
  const selectedIngredients = useAlchemyStore((s) => s.selectedIngredients);
  const alchemySkill = useAlchemyStore((s) => s.alchemySkill);
  const luck = useAlchemyStore((s) => s.luck);
  const mortarPestleQuality = useAlchemyStore((s) => s.mortarPestleQuality);
  const retortQuality = useAlchemyStore((s) => s.retortQuality);
  const calcinatorQuality = useAlchemyStore((s) => s.calcinatorQuality);
  const alembicQuality = useAlchemyStore((s) => s.alembicQuality);

  const getShareUrl = useCallback((): string => {
    const brewData: BrewData = {
      alchemySkill,
      luck,
      mortarPestleQuality,
      retortQuality,
      calcinatorQuality,
      alembicQuality,
      ingredientIds: selectedIngredients.map((i) => i.id),
    };

    const code = encodeBrew(brewData);
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/brew/${code}`;
  }, [
    selectedIngredients,
    alchemySkill,
    luck,
    mortarPestleQuality,
    retortQuality,
    calcinatorQuality,
    alembicQuality,
  ]);

  const copyShareUrl = useCallback(async (): Promise<boolean> => {
    try {
      const url = getShareUrl();
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      return false;
    }
  }, [getShareUrl]);

  return { getShareUrl, copyShareUrl };
}
