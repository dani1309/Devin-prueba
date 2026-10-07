export interface UnitDefinition {
  id: string;
  label: string;
  symbol: string;
  toBase: (value: number) => number;
  fromBase: (value: number) => number;
}

export interface UnitCategory {
  id: string;
  label: string;
  units: readonly UnitDefinition[];
  /** Smallest physically valid value expressed in the base unit. */
  minBaseValue?: number;
  minBaseValueMessage?: string;
}

const linear = (id: string, label: string, symbol: string, factorToBase: number): UnitDefinition => ({
  id,
  label,
  symbol,
  toBase: (value) => value * factorToBase,
  fromBase: (value) => value / factorToBase,
});

export const UNIT_CATEGORIES: readonly UnitCategory[] = [
  {
    id: 'length',
    label: 'Longitud',
    units: [
      linear('m', 'Metros', 'm', 1),
      linear('km', 'Kilómetros', 'km', 1000),
      linear('cm', 'Centímetros', 'cm', 0.01),
      linear('mm', 'Milímetros', 'mm', 0.001),
      linear('mi', 'Millas', 'mi', 1609.344),
      linear('ft', 'Pies', 'ft', 0.3048),
      linear('in', 'Pulgadas', 'in', 0.0254),
    ],
  },
  {
    id: 'weight',
    label: 'Peso',
    units: [
      linear('kg', 'Kilogramos', 'kg', 1),
      linear('g', 'Gramos', 'g', 0.001),
      linear('lb', 'Libras', 'lb', 0.45359237),
      linear('oz', 'Onzas', 'oz', 0.028349523125),
    ],
  },
  {
    id: 'temperature',
    label: 'Temperatura',
    minBaseValue: -273.15,
    minBaseValueMessage: 'La temperatura no puede ser inferior al cero absoluto',
    units: [
      { id: 'c', label: 'Celsius', symbol: '°C', toBase: (v) => v, fromBase: (v) => v },
      { id: 'f', label: 'Fahrenheit', symbol: '°F', toBase: (v) => ((v - 32) * 5) / 9, fromBase: (v) => (v * 9) / 5 + 32 },
      { id: 'k', label: 'Kelvin', symbol: 'K', toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
    ],
  },
  {
    id: 'area',
    label: 'Área',
    units: [
      linear('m2', 'Metros cuadrados', 'm²', 1),
      linear('km2', 'Kilómetros cuadrados', 'km²', 1e6),
      linear('ft2', 'Pies cuadrados', 'ft²', 0.09290304),
      linear('acre', 'Acres', 'ac', 4046.8564224),
    ],
  },
  {
    id: 'volume',
    label: 'Volumen',
    units: [
      linear('l', 'Litros', 'L', 1),
      linear('ml', 'Mililitros', 'mL', 0.001),
      linear('m3', 'Metros cúbicos', 'm³', 1000),
      linear('gal', 'Galones (EE. UU.)', 'gal', 3.785411784),
    ],
  },
  {
    id: 'speed',
    label: 'Velocidad',
    units: [
      linear('kmh', 'Kilómetros por hora', 'km/h', 1 / 3.6),
      linear('mph', 'Millas por hora', 'mph', 0.44704),
      linear('ms', 'Metros por segundo', 'm/s', 1),
    ],
  },
];
