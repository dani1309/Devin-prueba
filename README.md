# Calculadora Pro

Calculadora avanzada, moderna y completa construida con **React + TypeScript + Vite**.
Incluye calculadora básica y científica, memoria, historial persistente con estadísticas,
conversor de unidades, conversor de monedas y calculadora de porcentajes, con tema
claro/oscuro, diseño responsive y soporte completo de teclado.

## Requisitos

- Node.js 20 o superior (probado con Node 24)
- npm 10 o superior

## Instalación y ejecución

```bash
npm install
npm run dev        # servidor de desarrollo en http://localhost:5173
```

## Scripts

| Script               | Descripción                                          |
| -------------------- | ---------------------------------------------------- |
| `npm run dev`        | Servidor de desarrollo con recarga en caliente       |
| `npm run build`      | Comprobación de tipos + build de producción (`dist/`) |
| `npm run preview`    | Sirve localmente el build de producción              |
| `npm test`           | Ejecuta las pruebas unitarias (Vitest)               |
| `npm run test:watch` | Pruebas en modo observación                          |
| `npm run typecheck`  | Comprobación de tipos con TypeScript                 |
| `npm run lint`       | Análisis estático con oxlint                         |

## Funcionalidades

### Calculadora básica
- Suma, resta, multiplicación, división, porcentajes, decimales, cambio de signo, paréntesis,
  borrar último carácter (⌫), limpiar todo (AC) e igual.
- Respeta la jerarquía de operaciones: `5 + 3 × 2 = 11`, `(5 + 3) × 2 = 16`.
- Vista previa del resultado mientras se escribe y botón para copiar el resultado.
- Los paréntesis abiertos se cierran automáticamente al calcular.

**Semántica del porcentaje**

| Expresión    | Resultado | Explicación                         |
| ------------ | --------- | ----------------------------------- |
| `50%`        | `0.5`     | Porcentaje aislado                  |
| `200 × 10%`  | `20`      | 10 % de 200                         |
| `500 + 20%`  | `600`     | 500 más el 20 % de 500              |
| `500 − 20%`  | `400`     | 500 menos el 20 % de 500            |

### Calculadora científica
- Potencias (`x²`, `x³`, `xʸ`), raíz cuadrada, raíz n-ésima (`ⁿ√x`: índice `ⁿ√` radicando).
- `log` (base 10), `ln`, `eˣ`, `10ˣ`, `1/x`, factorial (`n!`), módulo (`mod`).
- `sin`, `cos`, `tan` y sus inversas (botón **INV**), en grados o radianes (botón **DEG/RAD**).
- Constantes `π` y `e`, tecla `Ans` (último resultado) y paréntesis anidados.
- Multiplicación implícita: `2π`, `3(4 + 1)`, `(2)(3)`.

### Memoria
`MC` (borrar), `MR` (recuperar), `M+` (sumar), `M−` (restar), `MS` (guardar).
Un indicador **M** en la pantalla muestra el valor guardado. La memoria se conserva al recargar.

### Historial y estadísticas
- Cada operación guarda expresión, resultado, fecha/hora y unidad angular.
- Por cada entrada: cargar la operación, cargar el resultado, insertar el resultado en la
  expresión actual, repetir el cálculo y eliminar.
- Borrar todo el historial con diálogo de confirmación.
- Estadísticas: total de operaciones, última operación, operación más utilizada,
  resultado máximo y mínimo.

### Conversor de unidades
Longitud, peso, temperatura, área, volumen y velocidad, con botón para intercambiar unidades
y tabla de equivalencias. La temperatura rechaza valores por debajo del cero absoluto.

### Conversor de monedas
COP, USD, EUR y GBP.

> **Importante:** sin configuración, la aplicación usa **tasas de demostración** fijas
> (1 USD = 4 000 COP = 0.90 EUR = 0.80 GBP). Son valores ilustrativos, **no** tasas reales,
> y la interfaz lo indica claramente.

Para usar tasas reales, crea un archivo `.env.local` (ver `.env.example`):

```env
VITE_EXCHANGE_RATE_API_URL=https://open.er-api.com/v6/latest/{base}
```

`{base}` se sustituye por la moneda de origen. La respuesta debe contener un objeto `rates`
o `conversion_rates` indexado por código de moneda. Si la API falla, se vuelve
automáticamente a las tasas de demostración y se muestra un aviso.
Para otro proveedor basta con implementar la interfaz `ExchangeRateProvider`
(`src/core/converters/currency/types.ts`).

### Calculadora de porcentajes
- ¿Cuánto es X % de Y?
- Aumentar un valor un X %
- Disminuir un valor un X %
- Diferencia porcentual entre dos valores
- ¿Qué porcentaje es X de Y?

### Manejo de errores
Nunca se muestran `NaN`, `Infinity` ni `undefined`. En su lugar aparecen mensajes claros:
división entre cero, operación no válida, paréntesis incorrectos, resultado demasiado grande,
factorial no válido, raíz no válida, logaritmo no válido y valor fuera de dominio.

### Teclado

| Tecla              | Acción                      |
| ------------------ | --------------------------- |
| `0`–`9`            | Números                     |
| `+` `-` `*` `/`    | Operadores                  |
| `^`                | Potencia                    |
| `%` / `!`          | Porcentaje / factorial      |
| `(` `)`            | Paréntesis                  |
| `.` o `,`          | Decimal                     |
| `p` / `e`          | Constantes π y e            |
| `s`                | Raíz cuadrada               |
| `Enter` o `=`      | Calcular                    |
| `Backspace`        | Borrar último carácter      |
| `Escape` o `Supr`  | Limpiar                     |

Los atajos se desactivan mientras se escribe en un campo de texto (conversores).

### Interfaz
- Tema claro/oscuro (respeta la preferencia del sistema la primera vez y se recuerda).
- Diseño responsive para escritorio, tablet y móvil.
- Animaciones sutiles (desactivadas con `prefers-reduced-motion`).
- Accesible: etiquetas ARIA, regiones `aria-live` para resultados, foco visible y diálogos modales.

### Persistencia (localStorage)

| Clave                                  | Contenido                       |
| -------------------------------------- | ------------------------------- |
| `calculadora-avanzada:history:v1`      | Historial (máx. 200 entradas)   |
| `calculadora-avanzada:memory:v1`       | Valor de memoria                |
| `calculadora-avanzada:theme:v1`        | Tema claro/oscuro               |
| `calculadora-avanzada:preferences:v1`  | Modo, unidad angular, vista     |

Los datos corruptos se ignoran de forma segura.

## Estructura del proyecto

```
src/
├── App.tsx                  # Composición de la aplicación
├── main.tsx                 # Punto de entrada
├── components/              # Interfaz (React)
│   ├── calculator/          # Pantalla, teclados, memoria, ayuda de teclado
│   ├── history/             # Historial y panel lateral
│   ├── stats/               # Estadísticas
│   ├── converters/          # Unidades, monedas y porcentajes
│   ├── layout/              # Cabecera y pestañas
│   └── common/              # Componentes reutilizables (diálogo, toast, campos…)
├── core/                    # Lógica pura, sin dependencias de React
│   ├── math/                # Tokenizador, parser, funciones, formato y errores
│   ├── calculator/          # Edición de expresiones
│   ├── history/             # Tipos y estadísticas del historial
│   ├── memory/              # Operaciones de memoria
│   ├── converters/          # Unidades y monedas (proveedores de tasas)
│   ├── percentage/          # Calculadora de porcentajes
│   └── validation/          # Validación de entradas numéricas
├── hooks/                   # Estado de React (calculadora, historial, memoria, tema…)
├── config/                  # Símbolos, unidades, monedas, teclado, almacenamiento
├── utils/                   # localStorage seguro, ids, fechas
└── styles/                  # Tema (variables CSS) y estilos base
```

### Motor matemático
Las expresiones **no** se evalúan con `eval`. `src/core/math` contiene un tokenizador y un
parser de descenso recursivo con esta precedencia (de menor a mayor):

1. Suma y resta
2. Multiplicación, división, módulo (y multiplicación implícita)
3. Signo unario
4. Potencia y raíz n-ésima (asociativas por la derecha)
5. Postfijos: factorial y porcentaje
6. Números, constantes, funciones y paréntesis

Los resultados se redondean para eliminar el ruido de coma flotante (`0.1 + 0.2 = 0.3`).

## Pruebas

```bash
npm test
```

Las pruebas unitarias (Vitest) cubren operaciones básicas, jerarquía de operaciones,
decimales, porcentajes, funciones científicas, errores, edición de expresiones, memoria,
historial y estadísticas, conversores, calculadora de porcentajes, validación de entradas y
el mapeo de teclado.
