export const MAX_ACTIONS_PER_REQUEST = 500;
/** 全国最大コンボとして受け付ける上限（現実的にあり得ない値を記録に残さないため） */
export const MAX_COMBO = 100000;

const clampTo = (value: unknown, max: number): number => {
  if (typeof value !== "number" || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(max, Math.floor(value)));
};

/** POST /api/stats の actions フィールドを、安全な整数（0〜上限）に丸める */
export const clampActions = (value: unknown): number => clampTo(value, MAX_ACTIONS_PER_REQUEST);

/** POST /api/stats の combo フィールド（全国最大コンボの申告値）を丸める */
export const clampCombo = (value: unknown): number => clampTo(value, MAX_COMBO);
