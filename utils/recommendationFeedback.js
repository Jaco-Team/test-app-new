export const RECOMMENDATION_ADDED_EVENT = 'jaco:recommendation-added';
export const RECOMMENDATION_FEEDBACK_DURATION_MS = 3000;

export function notifyRecommendationAdded() {
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    window.dispatchEvent(new Event(RECOMMENDATION_ADDED_EVENT));
  }
}
