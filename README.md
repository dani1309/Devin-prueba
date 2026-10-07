# Calculadora

Calculadora básica, moderna y responsive con historial de operaciones persistente, modo claro/oscuro y soporte de teclado.

Construida con **TypeScript** y **Vite**, sin frameworks. Las pruebas usan **Vitest**.

## Requisitos

- [Node.js](https://nodejs.org/) 20.19 o superior (incluye `npm`).

## Cómo ejecutar

```bash
npm install      # instala las dependencias
npm run dev      # inicia el servidor de desarrollo
```

Abre <http://localhost:5173> en el navegador.

Para probarla desde el celular (en la misma red Wi‑Fi):

```bash
npm run dev -- --host
```

y abre en el celular la dirección `Network` que muestra la terminal.

### Otros comandos

| Comando             | Descripción                                            |
| ------------------- | ------------------------------------------------------ |
| `npm test`          | Ejecuta las pruebas unitarias.                         |
| `npm run typecheck` | Verifica los tipos de TypeScript.                      |
| `npm run build`     | Genera la versión de producción en `dist/`.            |
| `npm run preview`   | Sirve localmente la versión de producción ya generada. |

## Funcionalidades

- Suma, resta, multiplicación y división con la jerarquía de operaciones correcta.
- Paréntesis (anidados), números decimales y cambio de signo (`+/−`).
- Porcentajes: `50%` = `0.5`, `200 × 10%` = `20`, y en sumas/restas `200 + 10%` = `220` (como en las calculadoras habituales).
- Botones para borrar un carácter (`⌫`), limpiar todo (`C`) e igual (`=`).
- Vista previa del resultado mientras se escribe.
- Mensajes de error sencillos: «No se puede dividir entre cero», «Operación no válida», «Operación incompleta», «Paréntesis incorrectos» y «Resultado demasiado grande». Nunca se muestra `NaN`, `Infinity` ni `undefined`.
- **Historial** (guardado en `localStorage`, se mantiene al cerrar y abrir la app):
  - Ver operaciones anteriores con su resultado.
  - Tocar una operación para volver a cargarla en la calculadora.
  - Eliminar una operación individual o borrar todo el historial.
- Modo claro y oscuro (se recuerda la elección; por defecto usa la preferencia del sistema).
- Diseño responsive: en computador el historial aparece al lado; en celular se abre como panel inferior con el botón de historial.

### Teclado

| Tecla                  | Acción              |
| ---------------------- | ------------------- |
| `0`–`9`                | Números             |
| `+` `-` `*` `/`        | Operaciones         |
| `.` o `,`              | Punto decimal       |
| `%`                    | Porcentaje          |
| `(` `)`                | Paréntesis          |
| `Enter` o `=`          | Resultado           |
| `Backspace`            | Borrar un carácter  |
| `Escape`               | Limpiar todo        |

## Estructura del proyecto

```
├── index.html               # Estructura de la página
├── public/favicon.svg
├── src/
│   ├── main.ts              # Punto de entrada: conecta lógica e interfaz
│   ├── core/                # Lógica pura (sin DOM)
│   │   ├── tokenizer.ts     # Convierte el texto en tokens
│   │   ├── parser.ts        # Analizador con jerarquía de operaciones
│   │   ├── evaluate.ts      # Evalúa la expresión y redondea el resultado
│   │   ├── errors.ts        # Errores y mensajes amigables
│   │   ├── format.ts        # Formato de números y símbolos (×, ÷, −)
│   │   ├── input.ts         # Reglas de edición de la expresión
│   │   └── calculator.ts    # Estado de la calculadora
│   ├── history/
│   │   └── historyStore.ts  # Historial persistente en localStorage
│   ├── theme/
│   │   └── theme.ts         # Modo claro / oscuro
│   ├── ui/                  # Componentes de interfaz
│   │   ├── display.ts       # Pantalla (operación y resultado)
│   │   ├── keypad.ts        # Botones
│   │   ├── keyboard.ts      # Atajos de teclado
│   │   ├── historyPanel.ts  # Panel de historial
│   │   ├── themeToggle.ts   # Botón de tema
│   │   └── dom.ts           # Utilidades e iconos
│   └── styles/              # Estilos (tema, base, calculadora, historial)
└── *.test.ts                # Pruebas junto a cada módulo
```
