const ENABLED_RECOMMENDATION_ENV_VALUES = new Set([
  '1',
  'true',
  'yes',
  'on',
  'enabled',
]);

export function isRecommendationsEnabled() {
  return ENABLED_RECOMMENDATION_ENV_VALUES.has(
    String(process.env.NEXT_PUBLIC_RECOMMENDATIONS_ENABLED || '')
      .trim()
      .toLowerCase()
  );
}
