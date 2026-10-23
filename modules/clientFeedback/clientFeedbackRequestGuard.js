export function createClientFeedbackRequestGuard() {
  let sequence = 0;
  let submitInFlight = false;

  return {
    begin() {
      sequence += 1;
      return sequence;
    },
    beginSubmit() {
      if (submitInFlight) return null;
      submitInFlight = true;
      sequence += 1;
      return sequence;
    },
    finishSubmit(requestId) {
      if (requestId === sequence) submitInFlight = false;
    },
    invalidate() {
      sequence += 1;
    },
    isCurrent(requestId) {
      return requestId === sequence;
    },
    reset() {
      sequence += 1;
      submitInFlight = false;
    },
  };
}
