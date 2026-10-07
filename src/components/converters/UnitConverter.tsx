import { useMemo, useState } from 'react';
import { UNIT_CATEGORIES } from '../../config/units';
import { convertUnit, findCategory } from '../../core/converters/unitConverter';
import { formatNumber } from '../../core/math';
import { parseNumberInput } from '../../core/validation/numberInput';
import { NumberField } from '../common/NumberField';
import { SelectField } from '../common/SelectField';
import { SwapIcon } from '../common/Icons';
import { ConverterLayout } from './ConverterLayout';

const CATEGORY_DEFAULTS: Record<string, [string, string]> = {
  length: ['m', 'ft'],
  weight: ['kg', 'lb'],
  temperature: ['c', 'f'],
  area: ['m2', 'ft2'],
  volume: ['l', 'gal'],
  speed: ['kmh', 'mph'],
};

export function UnitConverter() {
  const [categoryId, setCategoryId] = useState(UNIT_CATEGORIES[0].id);
  const [[fromId, toId], setUnits] = useState(CATEGORY_DEFAULTS[UNIT_CATEGORIES[0].id]);
  const [input, setInput] = useState('1');

  const category = findCategory(categoryId);
  const unitOptions = category.units.map((unit) => ({ value: unit.id, label: `${unit.label} (${unit.symbol})` }));
  const parsed = parseNumberInput(input);

  const conversions = useMemo(() => {
    if (!parsed.ok) return null;
    return category.units.map((unit) => ({ unit, result: convertUnit(category.id, parsed.value, fromId, unit.id) }));
  }, [parsed, category, fromId]);

  const main = conversions?.find((item) => item.unit.id === toId)?.result;
  const error = !parsed.ok ? (input.trim() ? parsed.error : null) : main && !main.ok ? main.error : null;

  const selectCategory = (id: string) => {
    setCategoryId(id);
    setUnits(CATEGORY_DEFAULTS[id]);
  };

  const fromUnit = category.units.find((unit) => unit.id === fromId);
  const toUnit = category.units.find((unit) => unit.id === toId);

  return (
    <ConverterLayout title="Conversor de unidades" description="Convierte longitud, peso, temperatura, área, volumen y velocidad.">
      <div className="chip-group" role="radiogroup" aria-label="Categoría">
        {UNIT_CATEGORIES.map((item) => (
          <button
            key={item.id}
            type="button"
            role="radio"
            aria-checked={item.id === categoryId}
            className={`chip${item.id === categoryId ? ' is-active' : ''}`}
            onClick={() => selectCategory(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="converter__grid">
        <NumberField label="Valor" value={input} onChange={setInput} error={error} suffix={fromUnit?.symbol} />
        <div className="converter__pair">
          <SelectField label="De" value={fromId} options={unitOptions} onChange={(value) => setUnits([value, toId])} />
          <button
            type="button"
            className="icon-button converter__swap"
            onClick={() => setUnits([toId, fromId])}
            aria-label="Intercambiar unidades"
            title="Intercambiar unidades"
          >
            <SwapIcon />
          </button>
          <SelectField label="A" value={toId} options={unitOptions} onChange={(value) => setUnits([fromId, value])} />
        </div>
      </div>

      <div className="converter__result" aria-live="polite">
        {main?.ok ? (
          <>
            <span className="converter__result-label">
              {formatNumber(parsed.ok ? parsed.value : 0, { grouping: true })} {fromUnit?.symbol} =
            </span>
            <span className="converter__result-value">
              {formatNumber(main.value, { grouping: true })} <small>{toUnit?.symbol}</small>
            </span>
          </>
        ) : (
          <span className="converter__result-label">Introduce un valor para convertir</span>
        )}
      </div>

      {conversions && main?.ok && (
        <div className="equivalences">
          <h3 className="equivalences__title">Todas las equivalencias</h3>
          <ul className="equivalences__list">
            {conversions
              .filter((item) => item.unit.id !== fromId)
              .map(({ unit, result }) => (
                <li key={unit.id} className="equivalences__item">
                  <span>{unit.label}</span>
                  <strong>
                    {result.ok ? formatNumber(result.value, { grouping: true }) : '—'} {unit.symbol}
                  </strong>
                </li>
              ))}
          </ul>
        </div>
      )}
    </ConverterLayout>
  );
}
