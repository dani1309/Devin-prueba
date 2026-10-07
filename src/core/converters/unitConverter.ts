import { UNIT_CATEGORIES, type UnitCategory, type UnitDefinition } from '../../config/units';

export type ConversionResult = { ok: true; value: number } | { ok: false; error: string };

export function findCategory(categoryId: string): UnitCategory {
  const category = UNIT_CATEGORIES.find((candidate) => candidate.id === categoryId);
  if (!category) throw new Error(`Unknown unit category: ${categoryId}`);
  return category;
}

export function findUnit(category: UnitCategory, unitId: string): UnitDefinition {
  const unit = category.units.find((candidate) => candidate.id === unitId);
  if (!unit) throw new Error(`Unknown unit "${unitId}" in category "${category.id}"`);
  return unit;
}

export function convertUnit(categoryId: string, value: number, fromId: string, toId: string): ConversionResult {
  const category = findCategory(categoryId);
  const baseValue = findUnit(category, fromId).toBase(value);

  if (category.minBaseValue !== undefined && baseValue < category.minBaseValue - 1e-9) {
    return { ok: false, error: category.minBaseValueMessage ?? 'Valor fuera de rango' };
  }

  const converted = findUnit(category, toId).fromBase(baseValue);
  if (!Number.isFinite(converted)) return { ok: false, error: 'Resultado demasiado grande' };
  return { ok: true, value: Number(converted.toPrecision(15)) };
}
