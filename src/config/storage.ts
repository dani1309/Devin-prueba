const PREFIX = 'calculadora-avanzada';

export const STORAGE_KEYS = {
  history: `${PREFIX}:history:v1`,
  memory: `${PREFIX}:memory:v1`,
  theme: `${PREFIX}:theme:v1`,
  preferences: `${PREFIX}:preferences:v1`,
} as const;

export const HISTORY_LIMIT = 200;
