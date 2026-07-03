import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { Ingredient } from '@/data/ingredients';
import { ApparatusQuality, PlayerSettings } from '@/utils/alchemyUtils';

type State = {
  selectedIngredients: Ingredient[];
  alchemySkill: number;
  luck: number;
  mortarPestleQuality: ApparatusQuality;
  retortQuality: ApparatusQuality | null;
  calcinatorQuality: ApparatusQuality | null;
  alembicQuality: ApparatusQuality | null;
  version: number;
};

type Action = {
  addIngredient: (ingredient: Ingredient) => void;
  removeIngredient: (ingredientId: string) => void;
  clearIngredients: () => void;
  setAlchemySkill: (level: number) => void;
  setLuck: (level: number) => void;
  setMortarPestleQuality: (quality: ApparatusQuality) => void;
  setRetortQuality: (quality: ApparatusQuality | null) => void;
  setCalcinatorQuality: (quality: ApparatusQuality | null) => void;
  setAlembicQuality: (quality: ApparatusQuality | null) => void;
  loadBrew: (data: {
    selectedIngredients: Ingredient[];
    alchemySkill: number;
    luck: number;
    mortarPestleQuality: ApparatusQuality;
    retortQuality: ApparatusQuality | null;
    calcinatorQuality: ApparatusQuality | null;
    alembicQuality: ApparatusQuality | null;
  }) => void;
};

type AlchemyStore = State & { actions: Action };

export const useAlchemyStore = create<AlchemyStore>()(
  persist(
    (set) => {
      return {
        selectedIngredients: [],
        alchemySkill: 25,
        luck: 50,
        mortarPestleQuality: 'Novice',
        retortQuality: null,
        calcinatorQuality: null,
        alembicQuality: null,
        version: 1,
        actions: {
          addIngredient: (ingredient) =>
            set((state) => {
              if (state.selectedIngredients.length >= 4) return state;
              if (state.selectedIngredients.some((i) => i.id === ingredient.id))
                return state;
              return {
                selectedIngredients: [...state.selectedIngredients, ingredient],
              };
            }),
          removeIngredient: (ingredientId) =>
            set((state) => ({
              selectedIngredients: state.selectedIngredients.filter(
                (ingredient) => ingredient.id !== ingredientId,
              ),
            })),
          clearIngredients: () => set(() => ({ selectedIngredients: [] })),
          setAlchemySkill: (level) =>
            set(() => ({ alchemySkill: Math.min(100, Math.max(0, level)) })),
          setLuck: (level) =>
            set(() => ({ luck: Math.min(100, Math.max(0, level)) })),
          setMortarPestleQuality: (quality) =>
            set(() => ({ mortarPestleQuality: quality })),
          setRetortQuality: (quality) =>
            set(() => ({ retortQuality: quality })),
          setCalcinatorQuality: (quality) =>
            set(() => ({ calcinatorQuality: quality })),
          setAlembicQuality: (quality) =>
            set(() => ({ alembicQuality: quality })),
          loadBrew: (data) =>
            set(() => ({
              selectedIngredients: data.selectedIngredients,
              alchemySkill: data.alchemySkill,
              luck: data.luck,
              mortarPestleQuality: data.mortarPestleQuality,
              retortQuality: data.retortQuality,
              calcinatorQuality: data.calcinatorQuality,
              alembicQuality: data.alembicQuality,
            })),
        },
      };
    },
    {
      name: 'oblivion-alchemy-lab',
      version: 1,
      storage: createJSONStorage(
        () => (typeof window !== 'undefined' ? localStorage : ({} as Storage)),
      ),
      partialize: (state) => ({
        selectedIngredients: state.selectedIngredients,
        alchemySkill: state.alchemySkill,
        luck: state.luck,
        mortarPestleQuality: state.mortarPestleQuality,
        retortQuality: state.retortQuality,
        calcinatorQuality: state.calcinatorQuality,
        alembicQuality: state.alembicQuality,
        version: state.version,
      }),
    },
  ),
);

export function getPlayerSettings(state: AlchemyStore): PlayerSettings {
  return {
    alchemySkill: state.alchemySkill,
    luck: state.luck,
    mortarPestleQuality: state.mortarPestleQuality,
    retortQuality: state.retortQuality,
    calcinatorQuality: state.calcinatorQuality,
    alembicQuality: state.alembicQuality,
  };
}
