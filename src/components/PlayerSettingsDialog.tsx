import React, { useEffect, useMemo, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slider,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
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

function getMasteryLabel(mastery: Mastery): string {
  switch (mastery) {
    case 'Novice':      return 'Novice (0-24)';
    case 'Apprentice':  return 'Apprentice (25-49)';
    case 'Journeyman':  return 'Journeyman (50-74)';
    case 'Expert':      return 'Expert (75-99)';
    case 'Master':      return 'Master (100)';
  }
}

const qualityOptions: (ApparatusQuality | 'None')[] = ['None', ...apparatusQualities];

function ApparatusSelector({
  label,
  value,
  required,
  onChange,
}: {
  label: string;
  value: ApparatusQuality | null;
  required?: boolean;
  onChange: (quality: ApparatusQuality | null) => void;
}) {
  const effectiveValue = value ?? 'None';
  const options = required ? apparatusQualities : qualityOptions;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-sm">
        <span>{label}</span>
        {required && <span className="text-xs text-ghost">(Required)</span>}
      </div>
      <ToggleButtonGroup
        exclusive
        size="small"
        value={effectiveValue}
        onChange={(_e, newValue) => {
          if (newValue === null) return;
          onChange(newValue === 'None' ? null : (newValue as ApparatusQuality));
        }}
      >
        {options.map((opt) => (
          <ToggleButton key={opt} value={opt} className="px-2 py-1 text-xs">
            {opt}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
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

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        className: 'w-[90vw] max-w-md sm:max-w-lg',
      }}
    >
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogTitle>Player Settings</DialogTitle>

      <DialogContent className="space-y-6 p-4">
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
            onChange={(quality) => {
              if (quality !== null) actions.setMortarPestleQuality(quality);
            }}
          />

          <ApparatusSelector
            label="Retort"
            value={retortQuality}
            onChange={actions.setRetortQuality}
          />

          <ApparatusSelector
            label="Calcinator"
            value={calcinatorQuality}
            onChange={actions.setCalcinatorQuality}
          />

          <ApparatusSelector
            label="Alembic"
            value={alembicQuality}
            onChange={actions.setAlembicQuality}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
