/**
 * Brew Codec — encodes/decodes the alchemy lab state into a compact,
 * URL-safe string using binary packing + lz-string compression.
 *
 * Encoding format (v1):
 *   Byte 0: version (1)
 *   Then bit-packed fields:
 *     - alchemySkill: 7 bits (0-100)
 *     - luck: 7 bits (0-100)
 *     - mortarPestleQuality: 3 bits (0-4, index into qualities)
 *     - retortQuality: 3 bits (0=None, 1-5=qualities)
 *     - calcinatorQuality: 3 bits (0=None, 1-5=qualities)
 *     - alembicQuality: 3 bits (0=None, 1-5=qualities)
 *     - ingredientCount: 3 bits (0-4)
 *     - per ingredient: 8 bits (index into sorted ingredients array)
 */

import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';

import { ingredients } from '@/data/ingredients';
import { apparatusQualities, ApparatusQuality } from '@/utils/alchemyUtils';

const CODEC_VERSION = 1;

// Build a map from ingredient id -> index for fast encoding
const ingredientIndexById: Record<string, number> = {};
for (let i = 0; i < ingredients.length; i++) {
  ingredientIndexById[ingredients[i].id] = i;
}

// ─── Bit Writer / Reader ────────────────────────────────────────────────────

class BitWriter {
  private buffer: number[] = [];
  private currentByte = 0;
  private bitPos = 0;

  writeBits(value: number, numBits: number): void {
    for (let i = numBits - 1; i >= 0; i--) {
      const bit = (value >> i) & 1;
      this.currentByte = (this.currentByte << 1) | bit;
      this.bitPos++;
      if (this.bitPos === 8) {
        this.buffer.push(this.currentByte);
        this.currentByte = 0;
        this.bitPos = 0;
      }
    }
  }

  toUint8Array(): Uint8Array {
    const result = [...this.buffer];
    if (this.bitPos > 0) {
      result.push(this.currentByte << (8 - this.bitPos));
    }
    return new Uint8Array(result);
  }
}

class BitReader {
  private data: Uint8Array;
  private bytePos = 0;
  private bitPos = 0;

  constructor(data: Uint8Array) {
    this.data = data;
  }

  readBits(numBits: number): number {
    let value = 0;
    for (let i = 0; i < numBits; i++) {
      const byte = this.data[this.bytePos];
      const bit = (byte >> (7 - this.bitPos)) & 1;
      value = (value << 1) | bit;
      this.bitPos++;
      if (this.bitPos === 8) {
        this.bytePos++;
        this.bitPos = 0;
      }
    }
    return value;
  }
}

// ─── Types ──────────────────────────────────────────────────────────────────

export interface BrewData {
  alchemySkill: number;
  luck: number;
  mortarPestleQuality: ApparatusQuality;
  retortQuality: ApparatusQuality | null;
  calcinatorQuality: ApparatusQuality | null;
  alembicQuality: ApparatusQuality | null;
  ingredientIds: string[];
}

// ─── Encode ─────────────────────────────────────────────────────────────────

function encodeQualityRequired(quality: ApparatusQuality): number {
  return apparatusQualities.indexOf(quality);
}

function encodeQualityOptional(quality: ApparatusQuality | null): number {
  if (quality === null) return 0;
  return apparatusQualities.indexOf(quality) + 1;
}

export function encodeBrew(data: BrewData): string {
  const writer = new BitWriter();

  // Version (8 bits)
  writer.writeBits(CODEC_VERSION, 8);

  // Alchemy Skill (7 bits, 0-100)
  writer.writeBits(Math.min(data.alchemySkill, 127), 7);

  // Luck (7 bits, 0-100)
  writer.writeBits(Math.min(data.luck, 127), 7);

  // Mortar & Pestle quality (3 bits, 0-4)
  writer.writeBits(encodeQualityRequired(data.mortarPestleQuality), 3);

  // Retort quality (3 bits, 0=None, 1-5=qualities)
  writer.writeBits(encodeQualityOptional(data.retortQuality), 3);

  // Calcinator quality (3 bits)
  writer.writeBits(encodeQualityOptional(data.calcinatorQuality), 3);

  // Alembic quality (3 bits)
  writer.writeBits(encodeQualityOptional(data.alembicQuality), 3);

  // Ingredient count (3 bits, 0-4)
  const count = Math.min(data.ingredientIds.length, 4);
  writer.writeBits(count, 3);

  // Ingredient indices (8 bits each)
  for (let i = 0; i < count; i++) {
    const idx = ingredientIndexById[data.ingredientIds[i]] ?? 0;
    writer.writeBits(idx, 8);
  }

  // Compress
  const bytes = writer.toUint8Array();
  const binaryString = String.fromCharCode.apply(null, Array.from(bytes));
  return compressToEncodedURIComponent(binaryString);
}

// ─── Decode ─────────────────────────────────────────────────────────────────

function decodeQualityRequired(value: number): ApparatusQuality {
  return apparatusQualities[value] ?? apparatusQualities[0];
}

function decodeQualityOptional(value: number): ApparatusQuality | null {
  if (value === 0) return null;
  return apparatusQualities[value - 1] ?? null;
}

export function decodeBrew(code: string): BrewData | null {
  try {
    const binaryString = decompressFromEncodedURIComponent(code);
    if (!binaryString) return null;

    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const reader = new BitReader(bytes);

    // Version
    const version = reader.readBits(8);
    if (version !== 1) return null;

    // Alchemy Skill
    const alchemySkill = reader.readBits(7);

    // Luck
    const luck = reader.readBits(7);

    // Apparatus qualities
    const mortarPestleQuality = decodeQualityRequired(reader.readBits(3));
    const retortQuality = decodeQualityOptional(reader.readBits(3));
    const calcinatorQuality = decodeQualityOptional(reader.readBits(3));
    const alembicQuality = decodeQualityOptional(reader.readBits(3));

    // Ingredients
    const count = reader.readBits(3);
    const ingredientIds: string[] = [];
    for (let i = 0; i < count; i++) {
      const idx = reader.readBits(8);
      if (idx >= ingredients.length) return null;
      ingredientIds.push(ingredients[idx].id);
    }

    return {
      alchemySkill,
      luck,
      mortarPestleQuality,
      retortQuality,
      calcinatorQuality,
      alembicQuality,
      ingredientIds,
    };
  } catch {
    return null;
  }
}
