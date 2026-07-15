import React, { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Drawer,
  IconButton,
  Slider,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

import { useAlchemyStore } from '@/data/alchemyStore';
import {
  apparatusQualities,
  ApparatusQuality,
  getEffectiveAlchemy,
  getMastery,
  getVisibleEffectCount,
  Mastery,
} from '@/utils/alchemyUtils';

const DRAWER_WIDTH = 280;

function getMasteryLabel(mastery: Mastery): string {
  switch (mastery) {
    case 'Novice':      return 'Novice (0-24)';
    case 'Apprentice':  return 'Apprentice (25-49)';
    case 'Journeyman':  return 'Journeyman (50-74)';
    case 'Expert':      return 'Expert (75-99)';
    case 'Master':      return 'Master (100)';
  }
}

// For required apparatus: indices 0–4 map to Novice–Master
// For optional apparatus: index 0 = None, indices 1–5 map to Novice–Master
const requiredMarks = apparatusQualities.map((_, i) => ({ value: i }));
const optionalMarks = [
  { value: 0 },
  ...apparatusQualities.map((_, i) => ({ value: i + 1 })),
];

function qualityToIndex(quality: ApparatusQuality | null, required?: boolean): number {
  if (quality === null) return 0;
  const idx = apparatusQualities.indexOf(quality);
  return required ? idx : idx + 1;
}

function indexToQuality(index: number, required?: boolean): ApparatusQuality | null {
  if (!required && index === 0) return null;
  const qualityIndex = required ? index : index - 1;
  return apparatusQualities[qualityIndex] ?? null;
}

function ApparatusSelector({
  label,
  value,
  required,
  subtext,
  onChange,
}: {
  label: string;
  value: ApparatusQuality | null;
  required?: boolean;
  subtext?: string;
  onChange: (quality: ApparatusQuality | null) => void;
}) {
  const marks = required ? requiredMarks : optionalMarks;
  const min = 0;
  const max = required ? 4 : 5;
  const sliderValue = qualityToIndex(value, required);
  const currentLabel = value ?? 'None';

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span>{label}</span>
        <span className="text-xs text-ghost">{currentLabel}</span>
      </div>
      <div className="px-3">
        <Slider
          value={sliderValue}
          min={min}
          max={max}
          step={1}
          marks={marks}
          onChange={(_e, val) => {
            const quality = indexToQuality(val as number, required);
            if (required && quality === null) return;
            onChange(quality);
          }}
        />
      </div>
      {subtext && <p className="text-xs text-ghost">{subtext}</p>}
    </div>
  );
}

// Shared inner content rendered in both the Dialog and Drawer
function SkillsContent({
  localAlchemySkill,
  setLocalAlchemySkill,
  localLuck,
  setLocalLuck,
  mastery,
  visibleEffects,
  effectiveAlchemy,
  mortarPestleQuality,
  retortQuality,
  calcinatorQuality,
  alembicQuality,
  actions,
}: {
  localAlchemySkill: number;
  setLocalAlchemySkill: (v: number) => void;
  localLuck: number;
  setLocalLuck: (v: number) => void;
  mastery: Mastery;
  visibleEffects: number;
  effectiveAlchemy: number;
  mortarPestleQuality: ApparatusQuality;
  retortQuality: ApparatusQuality | null;
  calcinatorQuality: ApparatusQuality | null;
  alembicQuality: ApparatusQuality | null;
  actions: ReturnType<typeof useAlchemyStore.getState>['actions'];
}) {
  return (
    <div className="space-y-6 p-4">
      {/* Alchemy Skill */}
      <div>
        <div className="mb-1 flex items-baseline justify-between">
          <label className="text-sm">Alchemy Skill</label>
          <TextField
            type="number"
            size="small"
            value={localAlchemySkill}
            onChange={(e) => {
              const val = Number(e.target.value);
              setLocalAlchemySkill(val);
              actions.setAlchemySkill(val);
            }}
            inputProps={{ min: 0, max: 100, step: 1 }}
            className="w-20"
            variant="standard"
          />
        </div>
        <div className="px-3">
          <Slider
            value={localAlchemySkill}
            onChange={(_e, val) => setLocalAlchemySkill(val as number)}
            onChangeCommitted={(_e, val) => actions.setAlchemySkill(val as number)}
            min={0}
            max={100}
            step={1}
          />
        </div>
        <div className="flex justify-between text-xs text-ghost">
          <span>{getMasteryLabel(mastery)}</span>
          <span>Can see {visibleEffects} of 4 effects</span>
        </div>
      </div>

      {/* Luck */}
      <div>
        <div className="mb-1 flex items-baseline justify-between">
          <label className="text-sm">Luck</label>
          <TextField
            type="number"
            size="small"
            value={localLuck}
            onChange={(e) => {
              const val = Number(e.target.value);
              setLocalLuck(val);
              actions.setLuck(val);
            }}
            inputProps={{ min: 0, max: 100, step: 1 }}
            className="w-20"
            variant="standard"
          />
        </div>
        <div className="px-3">
          <Slider
            value={localLuck}
            onChange={(_e, val) => setLocalLuck(val as number)}
            onChangeCommitted={(_e, val) => actions.setLuck(val as number)}
            min={0}
            max={100}
            step={1}
          />
        </div>
      </div>

      {/* Effective Alchemy */}
      <Typography variant="body2" className="text-ghost">
        Effective Alchemy: {effectiveAlchemy.toFixed(1)}
      </Typography>

      {/* Apparatus Section */}
      <div className="space-y-4 border-t border-[#2e2e2e] pt-4">
        <Typography variant="subtitle2">Apparatus</Typography>

        <ApparatusSelector
          label="Mortar & Pestle"
          value={mortarPestleQuality}
          required
          subtext="Required to brew potions. Quality scales potion strength."
          onChange={(quality) => {
            if (quality !== null) actions.setMortarPestleQuality(quality);
          }}
        />

        <ApparatusSelector
          label="Retort"
          value={retortQuality}
          subtext="Boosts magnitude and duration of beneficial effects."
          onChange={actions.setRetortQuality}
        />

        <ApparatusSelector
          label="Calcinator"
          value={calcinatorQuality}
          subtext="Boosts magnitude and duration of all effects, including negative ones."
          onChange={actions.setCalcinatorQuality}
        />

        <ApparatusSelector
          label="Alembic"
          value={alembicQuality}
          subtext="Reduces duration of negative effects in potions. No effect on poisons."
          onChange={actions.setAlembicQuality}
        />
      </div>
    </div>
  );
}

export default function PlayerSettingsDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const storeAlchemySkill = useAlchemyStore((s) => s.alchemySkill);
  const storeLuck = useAlchemyStore((s) => s.luck);
  const mortarPestleQuality = useAlchemyStore((s) => s.mortarPestleQuality);
  const retortQuality = useAlchemyStore((s) => s.retortQuality);
  const calcinatorQuality = useAlchemyStore((s) => s.calcinatorQuality);
  const alembicQuality = useAlchemyStore((s) => s.alembicQuality);
  const actions = useAlchemyStore((s) => s.actions);

  // Local state for sliders to avoid re-rendering the entire app on every tick
  const [localAlchemySkill, setLocalAlchemySkill] = useState(storeAlchemySkill);
  const [localLuck, setLocalLuck] = useState(storeLuck);

  // Sync local state when dialog opens or store values change externally
  useEffect(() => {
    if (open) {
      setLocalAlchemySkill(storeAlchemySkill);
      setLocalLuck(storeLuck);
    }
  }, [open, storeAlchemySkill, storeLuck]);

  const mastery = useMemo(() => getMastery(localAlchemySkill), [localAlchemySkill]);
  const visibleEffects = useMemo(() => getVisibleEffectCount(localAlchemySkill), [localAlchemySkill]);
  const effectiveAlchemy = useMemo(
    () => getEffectiveAlchemy(localAlchemySkill, localLuck),
    [localAlchemySkill, localLuck],
  );

  const sharedProps = {
    localAlchemySkill,
    setLocalAlchemySkill,
    localLuck,
    setLocalLuck,
    mastery,
    visibleEffects,
    effectiveAlchemy,
    mortarPestleQuality,
    retortQuality,
    calcinatorQuality,
    alembicQuality,
    actions,
  };

  const closeButton = (
    <IconButton
      aria-label="close"
      onClick={onClose}
      sx={{ position: 'absolute', right: 8, top: 8 }}
    >
      <CloseIcon />
    </IconButton>
  );

  if (isDesktop) {
    return (
      <Drawer
        variant="persistent"
        anchor="right"
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
            borderLeft: '1px solid #2e2e2e',
            backgroundColor: 'inherit',
            overflowX: 'hidden',
            overflowY: 'auto',
          },
        }}
      >
        <div className="relative">
          {closeButton}
          <div className="py-3 pl-4 pr-12 text-base font-medium">Skills</div>
        </div>
        <SkillsContent {...sharedProps} />
      </Drawer>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        className: 'w-[90vw] max-w-sm sm:max-w-md md:max-w-lg',
      }}
    >
      {closeButton}
      <DialogTitle>Skills</DialogTitle>
      <DialogContent className="space-y-6 p-4">
        <SkillsContent {...sharedProps} />
      </DialogContent>
    </Dialog>
  );
}
